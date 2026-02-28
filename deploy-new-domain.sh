#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Deploy one domain using Docker + Traefik labels.

Usage:
  ./deploy-new-domain.sh <domain> <port> [options]

Options:
  --image <image>             Docker image (default: vutheviet/ladifinal:latest)
  --network <name>            External Docker network (default: traefik-network)
  --site-root <path>          Root deploy directory (default: /opt/websites/sites)
  --old-action <mode>         Handle old containers: stop|remove|none (default: stop)
  --keep-port-only            Fail if requested port is busy (no automatic port shift)
  --no-tunnel                 Skip Cloudflare tunnel config update
  --skip-pull                 Skip docker compose pull
  --help                      Show this help

Examples:
  ./deploy-new-domain.sh thelaixe.shop 8083
  ./deploy-new-domain.sh example.com 8083 --old-action remove
  ./deploy-new-domain.sh example.com 8083 --network traefik --no-tunnel
EOF
}

if [[ ${1:-} == "-h" || ${1:-} == "--help" ]]; then
  usage
  exit 0
fi

if [[ $# -lt 2 ]]; then
  usage
  exit 1
fi

DOMAIN="$1"
REQUESTED_PORT="$2"
shift 2

IMAGE="${IMAGE:-vutheviet/ladifinal:latest}"
SITE_ROOT="${SITE_ROOT:-/opt/websites/sites}"
NETWORK_NAME="${NETWORK_NAME:-traefik-network}"
INTERNAL_PORT="${INTERNAL_PORT:-5000}"
OLD_ACTION="${OLD_ACTION:-stop}"
ALLOW_PORT_SHIFT=1
UPDATE_TUNNEL=1
SKIP_PULL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --image)
      IMAGE="$2"
      shift 2
      ;;
    --network)
      NETWORK_NAME="$2"
      shift 2
      ;;
    --site-root)
      SITE_ROOT="$2"
      shift 2
      ;;
    --old-action)
      OLD_ACTION="$2"
      shift 2
      ;;
    --keep-port-only)
      ALLOW_PORT_SHIFT=0
      shift
      ;;
    --no-tunnel)
      UPDATE_TUNNEL=0
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
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if ! [[ "$REQUESTED_PORT" =~ ^[0-9]+$ ]] || (( REQUESTED_PORT < 1 || REQUESTED_PORT > 65535 )); then
  echo "Invalid port: $REQUESTED_PORT"
  exit 1
fi

if [[ "$OLD_ACTION" != "stop" && "$OLD_ACTION" != "remove" && "$OLD_ACTION" != "none" ]]; then
  echo "Invalid --old-action: $OLD_ACTION (allowed: stop|remove|none)"
  exit 1
fi

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g'
}

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

if [[ $EUID -ne 0 ]]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO=(sudo)
  else
    err "This script needs root permission for $SITE_ROOT and tunnel config. Install sudo or run as root."
    exit 1
  fi
else
  SUDO=()
fi

PROJECT_NAME="$(slugify "$DOMAIN")"
CONTAINER_NAME="${PROJECT_NAME}-web"
TARGET_DIR="${SITE_ROOT}/${PROJECT_NAME}"
MIDDLEWARE_NAME="${PROJECT_NAME}-redirect-https"
SECRET_KEY="${SECRET_KEY:-${PROJECT_NAME}-$(date +%s)}"

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

container_exists() {
  docker ps -a --format '{{.Names}}' | grep -Fxq "$1"
}

container_image() {
  docker inspect -f '{{.Config.Image}}' "$1" 2>/dev/null || true
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
      warn "Old container found but OLD_ACTION=none: $name"
      ;;
  esac
}

SELECTED_PORT="$REQUESTED_PORT"

resolve_port_conflicts() {
  local attempts=0
  while (( attempts < 100 )); do
    attempts=$((attempts + 1))

    mapfile -t blockers < <(containers_using_port "$SELECTED_PORT" || true)
    for c in "${blockers[@]}"; do
      [[ -z "$c" ]] && continue

      if [[ "$c" == "$CONTAINER_NAME" || "$c" == "${PROJECT_NAME}-app" || "$c" == "$PROJECT_NAME" ]]; then
        handle_container_action "$c"
        continue
      fi

      local img
      img="$(container_image "$c")"
      if [[ "$img" == vutheviet/ladipage* || "$img" == vutheviet/ladifinal* ]]; then
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

  err "Could not resolve port conflict after many attempts."
  return 1
}

log "Deploying domain: $DOMAIN"
log "Requested host port: $REQUESTED_PORT"
log "Image: $IMAGE"
log "Old container action: $OLD_ACTION"

resolve_port_conflicts

if [[ "$SELECTED_PORT" != "$REQUESTED_PORT" ]]; then
  warn "Using port $SELECTED_PORT instead of requested port $REQUESTED_PORT due to conflict."
fi

if docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
  log "Docker network exists: $NETWORK_NAME"
else
  log "Creating docker network: $NETWORK_NAME"
  docker network create "$NETWORK_NAME" >/dev/null
fi

"${SUDO[@]}" mkdir -p "$TARGET_DIR" "$TARGET_DIR/uploads" "$TARGET_DIR/published" "$TARGET_DIR/logs"
"${SUDO[@]}" touch "$TARGET_DIR/database.db"

if id -u www-data >/dev/null 2>&1; then
  "${SUDO[@]}" chown -R www-data:www-data "$TARGET_DIR" || true
fi

if [[ -f "$TARGET_DIR/docker-compose.yml" ]]; then
  case "$OLD_ACTION" in
    stop)
      log "Stopping existing compose services in $TARGET_DIR"
      (cd "$TARGET_DIR" && "${COMPOSE_CMD[@]}" stop) || true
      ;;
    remove)
      log "Removing existing compose services in $TARGET_DIR"
      (cd "$TARGET_DIR" && "${COMPOSE_CMD[@]}" down --remove-orphans) || true
      ;;
  esac
fi

log "Writing compose file: $TARGET_DIR/docker-compose.yml"
"${SUDO[@]}" tee "$TARGET_DIR/docker-compose.yml" >/dev/null <<EOF
services:
  web:
    image: $IMAGE
    container_name: $CONTAINER_NAME
    restart: unless-stopped
    environment:
      FLASK_ENV: production
      SECRET_KEY: "$SECRET_KEY"
      PORT: "$INTERNAL_PORT"
      PUBLISHED_ROOT: /app/published
      UPLOAD_FOLDER: /app/uploads
    volumes:
      - ./uploads:/app/uploads
      - ./published:/app/published
      - ./logs:/app/logs
      - ./database.db:/app/ladifinal/database.db
    ports:
      - "$SELECTED_PORT:$INTERNAL_PORT"
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:$INTERNAL_PORT/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.$PROJECT_NAME.rule=Host(\`$DOMAIN\`) || Host(\`www.$DOMAIN\`)"
      - "traefik.http.routers.$PROJECT_NAME.entrypoints=websecure"
      - "traefik.http.routers.$PROJECT_NAME.tls=true"
      - "traefik.http.services.$PROJECT_NAME.loadbalancer.server.port=$INTERNAL_PORT"
      - "traefik.http.routers.$PROJECT_NAME-http.rule=Host(\`$DOMAIN\`) || Host(\`www.$DOMAIN\`)"
      - "traefik.http.routers.$PROJECT_NAME-http.entrypoints=web"
      - "traefik.http.routers.$PROJECT_NAME-http.middlewares=$MIDDLEWARE_NAME"
      - "traefik.http.middlewares.$MIDDLEWARE_NAME.redirectscheme.scheme=https"
      - "traefik.docker.network=$NETWORK_NAME"
    networks:
      - $NETWORK_NAME

networks:
  $NETWORK_NAME:
    external: true
EOF

if (( UPDATE_TUNNEL == 1 )); then
  TUNNEL_CONFIG="/etc/cloudflared/config.yml"
  if [[ -f "$TUNNEL_CONFIG" ]]; then
    if grep -Eq "hostname:\s*$DOMAIN$" "$TUNNEL_CONFIG" || grep -Eq "hostname:\s*www\.$DOMAIN$" "$TUNNEL_CONFIG"; then
      log "Cloudflare tunnel entries for $DOMAIN already exist. Skipping tunnel update."
    else
      log "Adding Cloudflare tunnel entries for $DOMAIN"
      tmp_file="$(mktemp)"
      awk -v d="$DOMAIN" -v p="$SELECTED_PORT" '
        BEGIN { inserted=0 }
        /- service: http_status:404/ && inserted==0 {
          print "  - hostname: " d
          print "    service: http://127.0.0.1:" p
          print "    originRequest:"
          print "      noTLSVerify: true"
          print "      connectTimeout: 30s"
          print "      tlsTimeout: 30s"
          print "  - hostname: www." d
          print "    service: http://127.0.0.1:" p
          print "    originRequest:"
          print "      noTLSVerify: true"
          print "      connectTimeout: 30s"
          print "      tlsTimeout: 30s"
          inserted=1
        }
        { print }
      ' "$TUNNEL_CONFIG" > "$tmp_file"
      "${SUDO[@]}" cp "$tmp_file" "$TUNNEL_CONFIG"
      rm -f "$tmp_file"

      if command -v systemctl >/dev/null 2>&1; then
        "${SUDO[@]}" systemctl restart cloudflared || warn "Unable to restart cloudflared."
      else
        warn "systemctl not available. Restart cloudflared manually if needed."
      fi
    fi
  else
    warn "Tunnel config not found at $TUNNEL_CONFIG. Skipping tunnel update."
  fi
fi

log "Deploying containers with Docker Compose"
if (( SKIP_PULL == 0 )); then
  (cd "$TARGET_DIR" && "${COMPOSE_CMD[@]}" pull) || warn "docker compose pull failed, continuing..."
fi

(cd "$TARGET_DIR" && "${COMPOSE_CMD[@]}" up -d --remove-orphans)

if command -v curl >/dev/null 2>&1; then
  log "Waiting for health endpoint..."
  health_ok=0
  for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:$SELECTED_PORT/health" >/dev/null 2>&1; then
      health_ok=1
      break
    fi
    sleep 1
  done

  if (( health_ok == 1 )); then
    log "Health check passed: http://127.0.0.1:$SELECTED_PORT/health"
  else
    warn "Health check did not pass yet. Last logs:"
    (cd "$TARGET_DIR" && "${COMPOSE_CMD[@]}" logs --tail=40) || true
  fi
else
  warn "curl not found. Skipping health check."
fi

echo
echo "Deploy completed"
echo "Domain: https://$DOMAIN"
echo "Container: $CONTAINER_NAME"
echo "Path: $TARGET_DIR"
echo "Host port: $SELECTED_PORT"
echo "Image: $IMAGE"