#!/usr/bin/env bash
set -Eeuo pipefail

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
CYAN=$'\033[0;36m'
BOLD=$'\033[1m'
DIM=$'\033[2m'
NC=$'\033[0m'

CONTAINER_NAME="vulnforce"
IMAGE_NAME="vulnforce:latest"
DEFAULT_PORT=47474
HOST_BIND="${HOST_BIND:-127.0.0.1}"
PORT="${PORT:-}"

for arg in "$@"; do
  case "$arg" in
    --port=*) PORT="${arg#*=}" ;;
  esac
done

if [[ -z "$PORT" ]]; then
  PORT="${1:-$DEFAULT_PORT}"
fi

log() { echo "${GREEN}[+]${NC} $1"; }
warn() { echo "${YELLOW}[!]${NC} $1"; }
err() { echo "${RED}[x]${NC} $1" >&2; exit 1; }
require_root() {
  [[ "${EUID}" -eq 0 ]] || err "$1 Run with sudo or use a Docker-capable user."
}

cleanup() {
  echo ""
  warn "Stopping VulnForce..."
  docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
  log "VulnForce stopped. Container preserved; data remains in Docker volume 'vulnforce_data'."
  echo ""
  exit 0
}

clear
echo ""
printf '%s\n' "${RED} _    __        __        ______                       ${NC}"
printf '%s\n' "${RED}| |  / /__  __ / /____   / ____/____   _____ _____ ___ ${NC}"
printf '%s\n' "${RED}| | / // / / // // __ \\ / /_   / __ \\ / ___// ___// _ \\${NC}"
printf '%s\n' "${RED}| |/ // /_/ // // / / // __/  / /_/ // /   / /__ /  __/${NC}"
printf '%s\n' "${RED}|___/ \\__,_//_//_/ /_//_/     \\____//_/    \\___/ \\___/ ${NC}"
echo ""
echo "  ${BOLD}VulnForce - Professional Hacking Reporting Platform${NC}"
echo "  ${DIM}Docker deployment for isolated and controlled environments${NC}"
echo ""

if ! command -v docker >/dev/null 2>&1; then
  warn "Docker is not installed."
  read -rp "    Install Docker now? (y/n): " INSTALL_DOCKER
  if [[ "$INSTALL_DOCKER" =~ ^[yYsS]$ ]]; then
    require_root "Installing Docker requires root privileges."
    command -v apt-get >/dev/null 2>&1 || err "Automatic Docker installation requires apt-get. Install Docker manually and rerun this script."
    log "Installing Docker..."
    apt-get update -qq
    apt-get install -y -qq docker.io >/dev/null 2>&1 || err "Docker installation failed."
    systemctl enable --now docker >/dev/null 2>&1
    log "Docker installed."
  else
    err "Docker is required to deploy VulnForce."
  fi
fi

if ! DOCKER_INFO_OUTPUT="$(docker info 2>&1 >/dev/null)"; then
  if grep -qi "permission denied" <<<"$DOCKER_INFO_OUTPUT"; then
    err "Docker is installed, but this user cannot access the Docker socket. Add the user to the docker group or rerun with sudo."
  fi

  warn "Docker service is not running."
  read -rp "    Start Docker now? (y/n): " START_DOCKER
  if [[ "$START_DOCKER" =~ ^[yYsS]$ ]]; then
    require_root "Starting the Docker service requires root privileges."
    command -v systemctl >/dev/null 2>&1 || err "systemctl is not available. Start Docker manually and rerun this script."
    systemctl start docker
    sleep 2
    docker info >/dev/null 2>&1 || err "Docker could not be started."
    log "Docker started."
  else
    err "Docker must be running to deploy VulnForce."
  fi
fi

trap cleanup SIGINT SIGTERM

log "Binding to ${BOLD}${HOST_BIND}:${PORT}${NC}."

warn "Removing previous VulnForce container if it exists..."
docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_HASH="$(git -C "$SCRIPT_DIR" rev-parse --short HEAD 2>/dev/null || date +%s)"

log "Building Docker image with pnpm (compact output)..."
# Try a quiet build to reduce console output. If it fails, run a verbose build to show the error.
if ! docker build -q -t "$IMAGE_NAME" --build-arg CACHEBUST="$GIT_HASH" "$SCRIPT_DIR" >/dev/null 2>&1; then
  warn "Quiet build failed — re-running verbose build to show details."
  docker build -t "$IMAGE_NAME" --build-arg CACHEBUST="$GIT_HASH" "$SCRIPT_DIR" || err "Docker image build failed (see output above)."
else
  log "Docker image built successfully (compact)."
fi

log "Starting VulnForce container..."
docker run -d \
  --name "$CONTAINER_NAME" \
  --hostname vulnforce \
  -v vulnforce_data:/app/data \
  -v vulnforce_uploads:/app/uploads \
  -v vulnforce_logs:/app/logs \
  -e PORT=3000 \
  -p "${HOST_BIND}:${PORT}:3000" \
  "$IMAGE_NAME" >/dev/null \
  || err "Container start failed."

echo -n "${GREEN}[+]${NC} Waiting for HTTP service"
READY=0
for _ in $(seq 1 30); do
  if curl -sf --connect-timeout 1 "http://${HOST_BIND}:${PORT}" >/dev/null 2>&1; then
    READY=1
    break
  fi
  echo -n "."
  sleep 1
done
echo ""

if [[ "$READY" -ne 1 ]]; then
  warn "Container started, but HTTP readiness check did not pass within 30 seconds."
  docker logs --tail 80 "$CONTAINER_NAME" || true
fi

open_browser() {
  _BROWSER_USER="${SUDO_USER:-${USER}}"
  _HOME="/home/${_BROWSER_USER}"
  _URL="http://${HOST_BIND}:${PORT}"

  # Prefer firefox, then chrome/chromium
  _BROWSERS=(firefox firefox-esr google-chrome chromium-browser chromium chrome)
  BROWSER_CMD=""
  for b in "${_BROWSERS[@]}"; do
    if command -v "$b" >/dev/null 2>&1; then
      BROWSER_CMD="$b"
      break
    fi
  done
  if [[ -z "$BROWSER_CMD" ]]; then
    warn "No supported browser found (firefox/chrome). Skipping automatic open."
    return 0
  fi

  # Try to find an existing browser process for the target user
  _PID=$(pgrep -u "${_BROWSER_USER}" -x "${BROWSER_CMD}" | head -1 || true)

  _DISPLAY=":0"
  _DBUS=""
  if [[ -n "$_PID" ]] && [[ -r "/proc/$_PID/environ" ]]; then
    _ENV_DUMP=$(tr '\0' '\n' < "/proc/$_PID/environ" 2>/dev/null || true)
    _DISPLAY=$(printf '%s\n' "$_ENV_DUMP" | awk -F= '/^DISPLAY=/{print $2; exit}')
    _DBUS=$(printf '%s\n' "$_ENV_DUMP" | awk -F= '/^DBUS_SESSION_BUS_ADDRESS=/{print substr($0,index($0,$2)); exit}')
  fi

  if [[ -n "$_PID" ]]; then
    # Browser already running: open new tab in existing session
    if [[ -n "$_DBUS" ]]; then
      sudo -u "${_BROWSER_USER}" env DISPLAY="$_DISPLAY" DBUS_SESSION_BUS_ADDRESS="$_DBUS" HOME="${_HOME}" "$BROWSER_CMD" --new-tab "$_URL" >/dev/null 2>&1 &
    else
      sudo -u "${_BROWSER_USER}" env DISPLAY="$_DISPLAY" HOME="${_HOME}" "$BROWSER_CMD" --new-tab "$_URL" >/dev/null 2>&1 &
    fi
  else
    # Browser not running: start it as the user
    if [[ -n "$_DBUS" ]]; then
      sudo -u "${_BROWSER_USER}" env DISPLAY="$_DISPLAY" DBUS_SESSION_BUS_ADDRESS="$_DBUS" HOME="${_home}" "$BROWSER_CMD" "$_URL" >/dev/null 2>&1 &
    else
      sudo -u "${_BROWSER_USER}" env DISPLAY="$_DISPLAY" HOME="${_HOME}" "$BROWSER_CMD" "$_URL" >/dev/null 2>&1 &
    fi
  fi
}

echo ""
echo "  ${GREEN}====================================================${NC}"
echo "  ${BOLD}${GREEN}  VulnForce is running${NC}"
echo "  ${GREEN}====================================================${NC}"
echo ""
echo "  ${CYAN}${BOLD}  URL: http://${HOST_BIND}:${PORT}${NC}"
echo "  ${DIM}  Container: ${CONTAINER_NAME}${NC}"
echo "  ${DIM}  Image:     ${IMAGE_NAME}${NC}"
echo ""
echo "  ${YELLOW}  Press Ctrl+C to stop the container (data preserved in Docker volume 'vulnforce_data')${NC}"
echo ""

while true; do
  if ! docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" >/dev/null 2>&1; then
    echo ""
    warn "The container stopped unexpectedly."
    docker logs --tail 120 "$CONTAINER_NAME" || true
    exit 1
  fi
  sleep 5
done
