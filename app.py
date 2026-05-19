#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import re
import shutil
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


CONTAINER_COMPAT_NAME = "vulnforce"
DEFAULT_PORT = 47474
DEFAULT_HOST = "127.0.0.1"
PNPM_VERSION = "11.1.2"
REQUIRED_NODE = (22, 13, 0)
READY_TIMEOUT_SECONDS = int(os.environ.get("READY_TIMEOUT", "60"))
HTTP_REQUEST_TIMEOUT_SECONDS = int(os.environ.get("HTTP_REQUEST_TIMEOUT", "30"))

SCRIPT_DIR = Path(__file__).resolve().parent
SERVER_PROCESS: subprocess.Popen[bytes] | None = None


def color(code: str, text: str) -> str:
    if not sys.stdout.isatty() or os.environ.get("NO_COLOR"):
        return text
    return f"\033[{code}m{text}\033[0m"


def log(message: str) -> None:
    print(f"{color('0;32', '[+]')} {message}")


def warn(message: str) -> None:
    print(f"{color('1;33', '[!]')} {message}")


def fail(message: str, exit_code: int = 1) -> None:
    print(f"{color('0;31', '[x]')} {message}", file=sys.stderr)
    raise SystemExit(exit_code)


def parse_port(value: str) -> int:
    try:
        port = int(value)
    except ValueError:
        fail(f"Invalid port: {value}")

    if not 1 <= port <= 65535:
        fail(f"Port out of range: {port}")
    return port


def parse_args() -> tuple[str, int, bool]:
    parser = argparse.ArgumentParser(
        description="Start VulnForce locally for testing.",
    )
    parser.add_argument("port_arg", nargs="?", help="Port to bind, like deploy.sh.")
    parser.add_argument("--port", dest="port_opt", help="Port to bind.")
    parser.add_argument(
        "--host",
        default=os.environ.get("HOST_BIND", DEFAULT_HOST),
        help=f"Host/IP to bind. Defaults to HOST_BIND or {DEFAULT_HOST}.",
    )
    parser.add_argument(
        "--skip-install",
        action="store_true",
        default=os.environ.get("SKIP_INSTALL") == "1",
        help="Skip pnpm install even if node_modules is missing.",
    )
    args = parser.parse_args()

    raw_port = args.port_opt or os.environ.get("PORT") or args.port_arg or str(DEFAULT_PORT)
    return args.host, parse_port(raw_port), args.skip_install


def run_checked(command: list[str], description: str) -> None:
    log(description)
    try:
        subprocess.run(command, cwd=SCRIPT_DIR, check=True)
    except FileNotFoundError:
        fail(f"Command not found: {command[0]}")
    except subprocess.CalledProcessError as exc:
        fail(f"Command failed with exit code {exc.returncode}: {' '.join(command)}")


def command_output(command: list[str]) -> str:
    try:
        result = subprocess.run(
            command,
            cwd=SCRIPT_DIR,
            check=True,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError:
        fail(f"Command not found: {command[0]}")
    except subprocess.CalledProcessError as exc:
        output = (exc.stderr or exc.stdout or "").strip()
        if output:
            fail(output)
        fail(f"Command failed with exit code {exc.returncode}: {' '.join(command)}")
    return result.stdout.strip()


def parse_node_version(raw_version: str) -> tuple[int, int, int]:
    match = re.match(r"v?(\d+)\.(\d+)\.(\d+)", raw_version)
    if not match:
        fail(f"Could not parse Node.js version: {raw_version}")
    return tuple(int(part) for part in match.groups())


def ensure_node() -> None:
    node = shutil.which("node")
    if not node:
        fail("Node.js is required. Install Node.js 22.13+ and rerun this script.")

    version = parse_node_version(command_output([node, "--version"]))
    if version < REQUIRED_NODE:
        required = ".".join(str(part) for part in REQUIRED_NODE)
        found = ".".join(str(part) for part in version)
        fail(f"Node.js {required}+ is required. Found {found}.")

    log(f"Node.js detected: {'.'.join(str(part) for part in version)}")


def ensure_pnpm() -> str:
    pnpm = shutil.which("pnpm")
    if pnpm:
        log(f"pnpm detected: {Path(pnpm).name}")
        return pnpm

    corepack = shutil.which("corepack")
    if not corepack:
        fail("pnpm was not found and corepack is unavailable. Install pnpm 11 or enable corepack.")

    run_checked([corepack, "enable"], "pnpm not found; enabling corepack...")
    run_checked(
        [corepack, "prepare", f"pnpm@{PNPM_VERSION}", "--activate"],
        f"Preparing pnpm {PNPM_VERSION} with corepack...",
    )

    pnpm = shutil.which("pnpm")
    if not pnpm:
        fail("corepack finished, but pnpm is still not available in PATH.")
    return pnpm


def ensure_dependencies(pnpm: str, skip_install: bool) -> None:
    if skip_install:
        warn("Skipping dependency installation because SKIP_INSTALL=1 or --skip-install was used.")
        return

    if (SCRIPT_DIR / "node_modules").exists():
        log("Dependencies already installed.")
        return

    run_checked([pnpm, "install", "--frozen-lockfile"], "Installing dependencies with pnpm...")


def prepare_local_data() -> None:
    log("Preparing local data folders...")
    data_dir = SCRIPT_DIR / "data"
    for directory in (data_dir, SCRIPT_DIR / "uploads", SCRIPT_DIR / "logs"):
        directory.mkdir(parents=True, exist_ok=True)

    db_file = data_dir / "vulnforce.db"
    if not db_file.exists():
        db_file.touch()


def ensure_node_localstorage(env: dict[str, str]) -> None:
    node_options = env.get("NODE_OPTIONS", "").strip()
    if "--localstorage-file" in node_options:
        return

    localstorage_option = "--localstorage-file=./data/node-localstorage.json"
    node = shutil.which("node")
    if not node:
        return

    try:
        result = subprocess.run(
            [node, localstorage_option, "-p", "typeof localStorage?.getItem"],
            cwd=SCRIPT_DIR,
            check=False,
            capture_output=True,
            text=True,
            timeout=5,
        )
    except (subprocess.SubprocessError, OSError):
        return

    if result.returncode != 0 or result.stdout.strip() != "function":
        return

    env["NODE_OPTIONS"] = f"{node_options} {localstorage_option}".strip()


def ensure_port_available(host: str, port: int) -> None:
    family = socket.AF_INET6 if ":" in host else socket.AF_INET
    with socket.socket(family, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind((host, port))
        except OSError as exc:
            fail(f"Cannot bind to {host}:{port}. Is the port already in use? ({exc})")


def display_host(host: str) -> str:
    if host in {"0.0.0.0", "::"}:
        return "127.0.0.1"
    return host


def wait_until_ready(url: str) -> tuple[bool, str | None]:
    print(f"{color('0;32', '[+]')} Waiting for HTTP service", end="", flush=True)
    deadline = time.time() + READY_TIMEOUT_SECONDS

    while time.time() < deadline:
        if SERVER_PROCESS and SERVER_PROCESS.poll() is not None:
            print("")
            fail(f"The development server stopped with exit code {SERVER_PROCESS.returncode}.")

        try:
            with urllib.request.urlopen(url, timeout=HTTP_REQUEST_TIMEOUT_SECONDS) as response:
                if 200 <= response.status < 400:
                    print("")
                    return True, None
        except urllib.error.HTTPError as exc:
            print("")
            return (
                False,
                f"HTTP service responded with status {exc.code}. "
                "The server is running, but the app returned an error.",
            )
        except (urllib.error.URLError, TimeoutError, socket.timeout):
            pass

        print(".", end="", flush=True)
        time.sleep(1)

    print("")
    return False, f"HTTP readiness check did not pass within {READY_TIMEOUT_SECONDS} seconds."


def stop_server() -> None:
    global SERVER_PROCESS
    if SERVER_PROCESS is None or SERVER_PROCESS.poll() is not None:
        return

    warn("Stopping VulnForce...")
    if os.name == "nt":
        SERVER_PROCESS.terminate()
    else:
        os.killpg(SERVER_PROCESS.pid, signal.SIGTERM)

    try:
        SERVER_PROCESS.wait(timeout=10)
    except subprocess.TimeoutExpired:
        warn("Server did not stop cleanly; killing process.")
        if os.name == "nt":
            SERVER_PROCESS.kill()
        else:
            os.killpg(SERVER_PROCESS.pid, signal.SIGKILL)
        SERVER_PROCESS.wait(timeout=5)


def cleanup(_signum: int | None = None, _frame: object | None = None) -> None:
    print("")
    stop_server()
    log("VulnForce stopped. Local data remains in ./data, ./uploads and ./logs.")
    raise SystemExit(0)


def print_banner() -> None:
    if sys.stdout.isatty() and not os.environ.get("NO_CLEAR"):
        print("\033c", end="")

    red = lambda text: color("0;31", text)
    bold = lambda text: color("1", text)
    dim = lambda text: color("2", text)
    green = lambda text: color("0;32", text)

    print("")
    print(red(" _    __        __        ______                       "))
    print(red("| |  / /__  __ / /____   / ____/____   _____ _____ ___ "))
    print(red("| | / // / / // // __ \\ / /_   / __ \\ / ___// ___// _ \\"))
    print(red("| |/ // /_/ // // / / // __/  / /_/ // /   / /__ /  __/"))
    print(red("|___/ \\__,_//_//_/ /_//_/     \\____//_/    \\___/ \\___/ "))
    print("")
    print(f"  {bold('VulnForce - Professional Hacking Reporting Platform')}")
    print(f"  {dim('Local development runner for controlled testing')}")
    print(f"  {green('developed by afsh4ck')}")
    print("")


def start_server(pnpm: str, host: str, port: int) -> str:
    global SERVER_PROCESS

    env = os.environ.copy()
    env.setdefault("NEXT_TELEMETRY_DISABLED", "1")
    env["PORT"] = str(port)
    env["HOSTNAME"] = host
    ensure_node_localstorage(env)

    command = [pnpm, "exec", "next", "dev", "-H", host, "-p", str(port)]
    log(f"Starting VulnForce on {color('1', f'{host}:{port}')}...")

    kwargs: dict[str, object] = {}
    if os.name != "nt":
        kwargs["preexec_fn"] = os.setsid

    SERVER_PROCESS = subprocess.Popen(command, cwd=SCRIPT_DIR, env=env, **kwargs)
    return f"http://{display_host(host)}:{port}"


def main() -> None:
    host, port, skip_install = parse_args()

    print_banner()
    log(f"Binding to {color('1', f'{host}:{port}')}.")

    if not (SCRIPT_DIR / "package.json").exists():
        fail("package.json was not found. Run this script from the VulnForce project root.")

    ensure_port_available(host, port)
    ensure_node()
    pnpm = ensure_pnpm()
    ensure_dependencies(pnpm, skip_install)
    prepare_local_data()

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    try:
        url = start_server(pnpm, host, port)
        ready, readiness_warning = wait_until_ready(url)
        if not ready and readiness_warning:
            warn(readiness_warning)

        print("")
        print(f"  {color('0;32', '====================================================')}")
        print(f"  {color('1;32', '  VulnForce is running locally')}")
        print(f"  {color('0;32', '====================================================')}")
        print("")
        print(f"  {color('0;36', color('1', f'  URL: {url}'))}")
        print(f"  {color('2', f'  Runtime:  Next.js dev server')}")
        print(f"  {color('2', f'  Name:     {CONTAINER_COMPAT_NAME}')}")
        print("")
        print(f"  {color('1;33', '  Press Ctrl+C to stop the local server')}")
        print("")

        while SERVER_PROCESS and SERVER_PROCESS.poll() is None:
            time.sleep(5)
    except Exception:
        stop_server()
        raise

    if SERVER_PROCESS:
        fail(f"The development server stopped unexpectedly with exit code {SERVER_PROCESS.returncode}.")


if __name__ == "__main__":
    main()
