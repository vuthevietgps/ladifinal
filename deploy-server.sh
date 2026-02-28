#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Deploy ladifinal from Docker Hub using docker-compose.prod.yml.

Usage:
  ./deploy-server.sh [tag] [options]

Options:
  --old-action <mode>   Handle old containers: stop|remove|none (default: stop)
  --keep-port-only      Fail if PORT is busy (no automatic port shift)
  --skip-pull           Skip docker compose pull
  --help                Show this help

Examples:
  ./deploy-server.sh
  ./deploy-server.sh v1.0.0 --old-action remove
EOF
}

TAG="latest"
OLD_ACTION="stop"
ALLOW_PORT_SHIFT=1
SKIP_PULL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --old-action)
      OLD_ACTION="$2"
      shift 2
      ;;
    --keep-port-only)
      ALLOW_PORT_SHIFT=0
      shift
      ;;
    --skip-pull)
      SKIP_PULL=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --*)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
    *)
      TAG="$1"
      shift
      ;;
  esac
done

if [[ "$OLD_ACTION" != "stop" && "$OLD_ACTION" != "remove" && "$OLD_ACTION" != "none" ]]; then
  echo "Invalid --old-action: $OLD_ACTION (allowed: stop|remove|none)"
  exit 1
fi

DOCKER_USERNAME="${DOCKER_USERNAME:-vutheviet}"
IMAGE_NAME="${IMAGE_NAME:-ladifinal}"
FULL_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
COMPOSE_FILE="docker-compose.prod.yml"
PRIMARY_CONTAINER="${PRIMARY_CONTAINER:-phuhieutoanquoc-app}"

log() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
err() { echo "[ERROR] $*" >&2; }

if ! command -v docker >/dev/null 2>&1; then
  err "Docker is not installed."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  err "Docker daemon is not running."
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(docker-compose)
else
  err "Docker Compose is not available."
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  err "Missing compose file: $COMPOSE_FILE"
  exit 1
fi

mkdir -p uploads published logs data ladifinal
touch ladifinal/database.db

if [[ ! -f .env ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example .env
    err "Created .env from .env.example. Update SECRET_KEY/DOMAIN/PORT then rerun."
    exit 1
  fi
  err "Missing .env and .env.example"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

REQUESTED_PORT="${PORT:-5001}"
if ! [[ "$REQUESTED_PORT" =~ ^[0-9]+$ ]] || (( REQUESTED_PORT < 1 || REQUESTED_PORT > 65535 )); then
  err "Invalid PORT in .env: $REQUESTED_PORT"
  exit 1
fi

container_exists() {
  docker ps -a --format '{{.Names}}' | grep -Fxq "$1"
}

container_image() {
  docker inspect -f '{{.Config.Image}}' "$1" 2>/dev/null || true
}

port_in_use() {
  local port="$1"

  if command -v lsof >/dev/null 2>&1; then
    if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      return 0
    fi
  elif command -v ss >/dev/null 2>&1; then
    if ss -ltn | awk -v p=":$port" 'NR>1 && $4 ~ p"$" {found=1} END {exit(found?0:1)}'; then
      return 0
    fi
  fi

  if docker ps --filter "publish=$port" --format '{{.Names}}' | grep -q .; then
    return 0
  fi

  return 1
}

containers_using_port() {
  docker ps --filter "publish=$1" --format '{{.Names}}'
}

handle_container_action() {
  local name="$1"
  if ! container_exists "$name"; then
    return 0
  fi

  case "$OLD_ACTION" in
    stop)
      log "Stopping old container: $name"
      docker stop "$name" >/dev/null || true
      ;;
    remove)
      log "Removing old container: $name"
      docker rm -f "$name" >/dev/null || true
      ;;
    none)
      warn "Old container exists but OLD_ACTION=none: $name"
      ;;
  esac
}

SELECTED_PORT="$REQUESTED_PORT"

resolve_port_conflicts() {
  local tries=0
  while (( tries < 100 )); do
    tries=$((tries + 1))

    mapfile -t blockers < <(containers_using_port "$SELECTED_PORT" || true)
    for c in "${blockers[@]}"; do
      [[ -z "$c" ]] && continue

      if [[ "$c" == "$PRIMARY_CONTAINER" || "$c" == "phuhieutoanquoc-web" || "$c" == "phuhieutoanquoc-app" ]]; then
        handle_container_action "$c"
        continue
      fi

      img="$(container_image "$c")"
      if [[ "$img" == vutheviet/ladifinal* || "$img" == vutheviet/ladipage* ]]; then
        warn "Port $SELECTED_PORT used by old app container $c ($img)."
        handle_container_action "$c"
      fi
    done

    if ! port_in_use "$SELECTED_PORT"; then
      return 0
    fi

    if (( ALLOW_PORT_SHIFT == 0 )); then
      err "Port $SELECTED_PORT is busy and --keep-port-only is set."
      return 1
    fi

    warn "Port $SELECTED_PORT is busy. Trying next port..."
    SELECTED_PORT=$((SELECTED_PORT + 1))
    if (( SELECTED_PORT > 65535 )); then
      err "No free port available."
      return 1
    fi
  done

  err "Unable to resolve port conflicts."
  return 1
}

compose() {
  DOCKER_IMAGE="$FULL_IMAGE" PORT="$SELECTED_PORT" "${COMPOSE_CMD[@]}" -f "$COMPOSE_FILE" "$@"
}

log "Deploy image: $FULL_IMAGE"
log "Requested port from .env: $REQUESTED_PORT"
log "Old container action: $OLD_ACTION"

resolve_port_conflicts

if [[ "$SELECTED_PORT" != "$REQUESTED_PORT" ]]; then
  warn "Using port $SELECTED_PORT (requested $REQUESTED_PORT is busy)."
  warn "To persist this port, update PORT=$SELECTED_PORT in .env"
fi

if docker network inspect traefik-network >/dev/null 2>&1; then
  log "Docker network exists: traefik-network"
else
  log "Creating docker network: traefik-network"
  docker network create traefik-network >/dev/null
fi

case "$OLD_ACTION" in
  stop)
    compose stop || true
    ;;
  remove)
    compose down --remove-orphans || true
    ;;
  none)
    log "Skipping old container stop/remove."
    ;;
esac

if (( SKIP_PULL == 0 )); then
  log "Pulling image..."
  compose pull
else
  log "Skipping image pull (--skip-pull)."
fi

log "Starting services..."
compose up -d --remove-orphans

if command -v curl >/dev/null 2>&1; then
  log "Waiting for health check on port $SELECTED_PORT..."
  ok=0
  for _ in $(seq 1 40); do
    if curl -fsS "http://127.0.0.1:$SELECTED_PORT/health" >/dev/null 2>&1; then
      ok=1
      break
    fi
    sleep 1
  done

  if (( ok == 1 )); then
    log "Health check passed."
  else
    warn "Health check failed. Recent logs:"
    compose logs --tail=50 || true
    exit 1
  fi
else
  warn "curl not found. Skipping health check."
fi

compose ps

echo
echo "Deployment completed"
echo "Image: $FULL_IMAGE"
echo "Port: $SELECTED_PORT"
echo "Compose file: $COMPOSE_FILE"
