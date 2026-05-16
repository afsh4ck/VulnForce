#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# VulnForce – Despliegue Docker al estilo HackLabs
# Uso: sudo bash deploy.sh
# ─────────────────────────────────────────────────────────────────

# ── Colores (usando $'…' para que los escapes se resuelvan al asignar) ──
RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[1;33m'
CYAN=$'\033[0;36m'; BOLD=$'\033[1m'; DIM=$'\033[2m'; NC=$'\033[0m'

CONTAINER_NAME="vulnforce"
IMAGE_NAME="vulnforce:latest"

# Puerto en el host (no estándar) y bind a localhost por defecto
# Se acepta: PORT env, primer argumento posicional, o --port=NNNN
DEFAULT_PORT=47474
PORT="${PORT:-}"
for arg in "$@"; do
    case $arg in
        --port=*) PORT="${arg#*=}"; shift ;;
    esac
done
if [[ -z "$PORT" ]]; then
    PORT="${1:-}"
fi
if [[ -z "$PORT" ]]; then
    PORT="$DEFAULT_PORT"
fi

# Host bind fijo a localhost
HOST_BIND="127.0.0.1"

log()  { echo "${GREEN}[+]${NC} $1"; }
warn() { echo "${YELLOW}[!]${NC} $1"; }
err()  { echo "${RED}[✗] $1${NC}"; exit 1; }

# ── Banner ──
clear
echo ""
echo "${RED} __     __           _    ______                          ${NC}"
echo "${RED} \ \   / /  _   _   | |  |  ____|  _ __    ___   _ __    ${NC}"
echo "${RED}  \ \ / /  | | | |  | |  | |__   | '__ \  / _ \ | '_ \   ${NC}"
echo "${RED}   \ V /   | |_| |  | |  |  __|  | | | ||  __/ | | | |  ${NC}"
echo "${RED}    \_/     \__,_|  |_|  |_|     |_| |_| \___| |_| |_|  ${NC}"
echo ""
echo "  ${DIM}VulnForce · Despliegue Docker${NC}"
echo "  ${RED}[!] ADVERTENCIA: Solo usar en entornos aislados y controlados${NC}"
echo ""

# ── Verificar root ──
[[ $EUID -ne 0 ]] && err "Ejecuta con privilegios root: ${YELLOW}sudo bash deploy.sh${NC}"

# ── Verificar Docker ──
if ! command -v docker &>/dev/null; then
    echo "${YELLOW}[!]${NC} Docker no está instalado en el sistema."
    read -rp "    ¿Deseas instalar Docker ahora? (y/n): " INSTALL_DOCKER
    if [[ "$INSTALL_DOCKER" =~ ^[yYsS]$ ]]; then
        log "Instalando Docker..."
        apt-get update -qq
        apt-get install -y -qq docker.io > /dev/null 2>&1 || err "Error al instalar Docker."
        systemctl enable --now docker > /dev/null 2>&1
        log "Docker instalado correctamente."
    else
        err "Docker es necesario para desplegar VulnForce."
    fi
fi

if ! docker info &>/dev/null; then
    echo "${YELLOW}[!]${NC} El servicio Docker no está activo."
    read -rp "    ¿Deseas iniciar Docker ahora? (y/n): " START_DOCKER
    if [[ "$START_DOCKER" =~ ^[yYsS]$ ]]; then
        systemctl start docker
        sleep 2
        docker info &>/dev/null || err "No se pudo iniciar Docker."
        log "Docker iniciado correctamente."
    else
        err "Docker debe estar activo para desplegar VulnForce."
    fi
fi

# Bind a localhost y mostrar información básica
log "Bind a ${BOLD}${HOST_BIND}:${PORT}${NC} (solo accesible desde el host)."

# ── Limpiar instancias previas ──
warn "Limpiando instancias previas si existen..."
docker stop  "$CONTAINER_NAME" &>/dev/null || true
docker rm    "$CONTAINER_NAME" &>/dev/null || true

# ── Función de limpieza (Ctrl+C) ──
cleanup() {
    echo ""
    warn "Deteniendo VulnForce..."
    docker stop  "$CONTAINER_NAME" &>/dev/null || true
    docker rm    "$CONTAINER_NAME" &>/dev/null || true
    echo "${GREEN}[+] VulnForce eliminado correctamente.${NC}"
    echo ""
    exit 0
}
trap cleanup SIGINT SIGTERM

# ── Construir imagen Docker ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_HASH=$(git -C "$SCRIPT_DIR" rev-parse --short HEAD 2>/dev/null || date +%s)
log "Construyendo imagen Docker..."
docker build -t "$IMAGE_NAME" --build-arg CACHEBUST="$GIT_HASH" "$SCRIPT_DIR" --quiet \
    || err "Error al construir la imagen Docker."

# ── Iniciar contenedor (mapeo de puertos a localhost) ──
log "Iniciando contenedor VulnForce (mapeo de puertos a ${HOST_BIND}:${PORT})..."
docker run -d \
    --name "$CONTAINER_NAME" \
    --hostname vulnforce \
    -v vulnforce_db:/app/data \
    -v vulnforce_uploads:/app/uploads \
    -v vulnforce_logs:/app/logs \
    -e PORT=3000 \
    -p ${HOST_BIND}:${PORT}:3000 \
    "$IMAGE_NAME" > /dev/null \
    || err "No se pudo iniciar el contenedor."

# ── Esperar que el servicio HTTP esté listo ──
echo -n "${GREEN}[+]${NC} Esperando que el servicio arranque"
sleep 5
for _ in $(seq 1 30); do
    curl -sf --connect-timeout 1 "http://${HOST_BIND}:${PORT}" &>/dev/null && break
    echo -n "."
    sleep 1
done
echo ""

# ── Panel de información ──
echo ""
echo "  ${GREEN}════════════════════════════════════════════════════${NC}"
echo "  ${BOLD}${GREEN}  ✓  VulnForce desplegado correctamente${NC}"
echo "  ${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo "  ${CYAN}${BOLD}  Localhost bind:   ${HOST_BIND}:${PORT}${NC}"
echo ""
echo "  ${DIM}  HTTP  →  http://${HOST_BIND}:${PORT}${NC}"
echo ""
echo "  ${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo "  ${YELLOW}  Presiona Ctrl+C para detener el despliegue${NC}"
echo ""

# ── Mantener el script activo hasta Ctrl+C ──
while true; do
    # Verificar que el contenedor sigue corriendo
    if ! docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" &>/dev/null 2>&1; then
        echo ""
        warn "El contenedor se ha detenido inesperadamente."
        break
    fi
    sleep 5
done
