#!/usr/bin/env bash
set -Eeuo pipefail

# Single-domain deploy script (Tunnel-only, Cloudflare Tunnel first)
# Domain: nghiepvuvantai.com

DOMAIN="nghiepvuvantai.com"
PROJECT_NAME="nghiepvuvantai-com"
SITE_ROOT="/opt/websites/sites"
TARGET_DIR="${SITE_ROOT}/${PROJECT_NAME}"
COMPOSE_FILE="${TARGET_DIR}/docker-compose.yml"

IMAGE="${IMAGE:-vutheviet/ladifinal:latest}"
INTERNAL_PORT="${INTERNAL_PORT:-5000}"
PORT="${PORT:-8091}"
APP_UID="${APP_UID:-1000}"
APP_GID="${APP_GID:-1000}"
FALLBACK_GOOGLE_FORM_URL="${FALLBACK_GOOGLE_FORM_URL:-}"

SKIP_PULL=0
UPDATE_TUNNEL=1
TUNNEL_CONFIG="${TUNNEL_CONFIG:-/etc/cloudflared/config.yml}"

CONTAINER_NAME="${PROJECT_NAME}-web"
SECRET_KEY="${SECRET_KEY:-${PROJECT_NAME}-$(date +%s)}"

usage() {
  cat <<'EOF'
Deploy nghiepvuvantai.com (single container, Tunnel-only).

Usage:
  sudo ./deploy-nghiepvuvantai.sh [options]

Options:
  --image <image>           Docker image (default: vutheviet/ladifinal:latest)
  --port <port>             Localhost port for tunnel origin (default: 8091)
  --site-root <path>        Root path for site folder (default: /opt/websites/sites)
  --app-uid <uid>           UID for mounted data permissions (default: 1000)
  --app-gid <gid>           GID for mounted data permissions (default: 1000)
  --google-form-link <url>  Fallback Google Form URL for homepage contact section
  --no-tunnel               Skip cloudflared config update
  --tunnel-config <path>    cloudflared config path (default: /etc/cloudflared/config.yml)
  --skip-pull               Skip docker compose pull
  --help                    Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --image)
      IMAGE="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    --site-root)
      SITE_ROOT="$2"
      TARGET_DIR="${SITE_ROOT}/${PROJECT_NAME}"
      COMPOSE_FILE="${TARGET_DIR}/docker-compose.yml"
      shift 2
      ;;
    --app-uid)
      APP_UID="$2"
      shift 2
      ;;
    --app-gid)
      APP_GID="$2"
      shift 2
      ;;
    --google-form-link)
      FALLBACK_GOOGLE_FORM_URL="$2"
      shift 2
      ;;
    --no-tunnel)
      UPDATE_TUNNEL=0
      shift
      ;;
    --tunnel-config)
      TUNNEL_CONFIG="$2"
      shift 2
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
      echo "[ERROR] Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if ! [[ "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
  echo "[ERROR] Invalid --port: $PORT" >&2
  exit 1
fi
if ! [[ "$APP_UID" =~ ^[0-9]+$ ]] || ! [[ "$APP_GID" =~ ^[0-9]+$ ]]; then
  echo "[ERROR] --app-uid and --app-gid must be numeric." >&2
  exit 1
fi
if [[ -n "$FALLBACK_GOOGLE_FORM_URL" ]] && ! [[ "$FALLBACK_GOOGLE_FORM_URL" =~ ^https?:// ]]; then
  echo "[ERROR] --google-form-link must start with http:// or https://" >&2
  exit 1
fi

log() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
err() { echo "[ERROR] $*" >&2; }

if [[ $EUID -ne 0 ]] && command -v sudo >/dev/null 2>&1; then
  SUDO=(sudo)
else
  SUDO=()
fi

run_host() { "${SUDO[@]}" "$@"; }
run_docker() { "${SUDO[@]}" docker "$@"; }

if ! command -v docker >/dev/null 2>&1; then
  err "Docker is not installed."
  exit 1
fi
if ! run_docker info >/dev/null 2>&1; then
  err "Docker daemon is not running."
  exit 1
fi

if run_docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(docker-compose)
else
  err "Docker Compose is not available."
  exit 1
fi
run_compose() { "${SUDO[@]}" "${COMPOSE_CMD[@]}" "$@"; }

extract_tunnel_id() {
  local cfg="$1"
  awk -F': *' '/^[[:space:]]*tunnel:[[:space:]]*/ {print $2; exit}' "$cfg" \
    | tr -d "\"'" \
    | awk '{print $1}'
}

print_cloudflare_guide() {
  local tunnel_id="$1"

  echo
  echo "Cloudflare setup guide (Tunnel)"
  echo "1) Zero Trust -> Networks -> Tunnels -> ensure your tunnel is CONNECTED."
  echo "2) Public hostnames in tunnel config:"
  echo "   - $DOMAIN -> http://127.0.0.1:$PORT"
  echo "   - www.$DOMAIN -> http://127.0.0.1:$PORT"

  if [[ -n "$tunnel_id" ]]; then
    echo "3) DNS records (proxied) in Cloudflare:"
    echo "   - Type: CNAME | Name: @   | Target: ${tunnel_id}.cfargotunnel.com"
    echo "   - Type: CNAME | Name: www | Target: ${tunnel_id}.cfargotunnel.com"
    echo "   CLI option:"
    echo "   sudo cloudflared tunnel route dns $tunnel_id $DOMAIN"
    echo "   sudo cloudflared tunnel route dns $tunnel_id www.$DOMAIN"
  else
    echo "3) Tunnel ID was not detected from: $TUNNEL_CONFIG"
    echo "   Get tunnel ID/name first: sudo cloudflared tunnel list"
    echo "   Then create DNS:"
    echo "   sudo cloudflared tunnel route dns <TUNNEL_ID_OR_NAME> $DOMAIN"
    echo "   sudo cloudflared tunnel route dns <TUNNEL_ID_OR_NAME> www.$DOMAIN"
  fi

  echo "4) SSL/TLS mode in Cloudflare: Full (strict)."
  echo "5) Verify:"
  echo "   cloudflared tunnel ingress validate --config $TUNNEL_CONFIG"
  echo "   curl -I https://$DOMAIN"
  echo "   curl -I https://www.$DOMAIN"
}

container_exists() {
  run_docker ps -a --format '{{.Names}}' | grep -Fxq "$1"
}

port_in_use() {
  local p="$1"
  if command -v ss >/dev/null 2>&1 && ss -ltn | awk -v p=":$p" 'NR>1 && $4 ~ p"$" {found=1} END {exit(found?0:1)}'; then
    return 0
  fi
  if run_docker ps --filter "publish=$p" --format '{{.Names}}' | grep -q .; then
    return 0
  fi
  return 1
}

upsert_tunnel_hosts() {
  local cfg="$1"
  local tmp_file
  tmp_file="$(mktemp)"

  # Remove existing blocks for this domain and re-insert a clean pair before the fallback rule.
  awk -v d="$DOMAIN" -v p="$PORT" '
    function print_hosts() {
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
    }

    BEGIN {
      skip_block=0
      inserted=0
      has_ingress=0
    }

    {
      if ($0 ~ /^[[:space:]]*ingress:[[:space:]]*$/) {
        has_ingress=1
      }

      if (skip_block == 1) {
        if ($0 ~ /^[[:space:]]*-[[:space:]]/) {
          skip_block=0
        } else {
          next
        }
      }

      if ($0 ~ /^[[:space:]]*-[[:space:]]*hostname:[[:space:]]*/) {
        host=$0
        sub(/^[[:space:]]*-[[:space:]]*hostname:[[:space:]]*/, "", host)
        sub(/[[:space:]]*$/, "", host)
        if (host == d || host == "www." d) {
          skip_block=1
          next
        }
      }

      if (inserted == 0 && $0 ~ /^[[:space:]]*-[[:space:]]*service:[[:space:]]*http_status:404[[:space:]]*$/) {
        print_hosts()
        inserted=1
      }

      print
    }

    END {
      if (inserted == 0) {
        print ""
        if (has_ingress == 0) {
          print "ingress:"
        }
        print_hosts()
        print "  - service: http_status:404"
      }
    }
  ' "$cfg" > "$tmp_file"

  run_host cp "$tmp_file" "$cfg"
  rm -f "$tmp_file"
}

log "Deploying: $DOMAIN"
log "Image: $IMAGE"
log "Local tunnel port: $PORT"
log "Target dir: $TARGET_DIR"
if [[ -n "$FALLBACK_GOOGLE_FORM_URL" ]]; then
  log "Fallback Google Form URL: $FALLBACK_GOOGLE_FORM_URL"
else
  log "Fallback Google Form URL: (not set)"
fi

TUNNEL_ID=""
if [[ -f "$TUNNEL_CONFIG" ]]; then
  TUNNEL_ID="$(extract_tunnel_id "$TUNNEL_CONFIG")"
fi

if [[ -f "$COMPOSE_FILE" ]]; then
  log "Removing old compose services..."
  (cd "$TARGET_DIR" && run_compose down --remove-orphans) || true
fi

if container_exists "$CONTAINER_NAME"; then
  log "Removing old container: $CONTAINER_NAME"
  run_docker rm -f "$CONTAINER_NAME" >/dev/null || true
fi

if port_in_use "$PORT"; then
  blockers="$(run_docker ps --filter "publish=$PORT" --format '{{.Names}}' | tr '\n' ' ')"
  err "Port $PORT is busy. Blocking container(s): ${blockers:-unknown}"
  exit 1
fi

log "Preparing folders and permissions..."
run_host mkdir -p "$TARGET_DIR" "$TARGET_DIR/uploads" "$TARGET_DIR/published" "$TARGET_DIR/logs"
run_host touch "$TARGET_DIR/database.db"
run_host chown -R "$APP_UID:$APP_GID" "$TARGET_DIR" || true
run_host chmod 775 "$TARGET_DIR" "$TARGET_DIR/uploads" "$TARGET_DIR/published" "$TARGET_DIR/logs" || true
run_host chmod 664 "$TARGET_DIR/database.db" || true

log "Writing compose file: $COMPOSE_FILE"
run_host tee "$COMPOSE_FILE" >/dev/null <<EOF
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
      FALLBACK_GOOGLE_FORM_URL: "$FALLBACK_GOOGLE_FORM_URL"
    volumes:
      - ./uploads:/app/uploads
      - ./published:/app/published
      - ./logs:/app/logs
      - ./database.db:/app/ladifinal/database.db
    ports:
      - "127.0.0.1:$PORT:$INTERNAL_PORT"
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:$INTERNAL_PORT/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
EOF

if (( UPDATE_TUNNEL == 1 )); then
  if [[ -f "$TUNNEL_CONFIG" ]]; then
    log "Upserting tunnel hostnames in: $TUNNEL_CONFIG"
    upsert_tunnel_hosts "$TUNNEL_CONFIG"

    if command -v cloudflared >/dev/null 2>&1; then
      if run_host cloudflared tunnel ingress validate --config "$TUNNEL_CONFIG" >/dev/null 2>&1; then
        log "cloudflared config validation: OK"
      else
        warn "cloudflared config validation failed. Please run:"
        warn "  sudo cloudflared tunnel ingress validate --config $TUNNEL_CONFIG"
      fi
    fi

    if command -v systemctl >/dev/null 2>&1; then
      run_host systemctl restart cloudflared || warn "Cannot restart cloudflared automatically."
    fi
  else
    warn "Tunnel config not found at $TUNNEL_CONFIG. Skip tunnel update."
  fi
else
  log "Skipping tunnel update (--no-tunnel)."
fi

log "Deploying container..."
if (( SKIP_PULL == 0 )); then
  (cd "$TARGET_DIR" && run_compose pull) || warn "docker compose pull failed, continuing."
else
  log "Skipping image pull (--skip-pull)."
fi
(cd "$TARGET_DIR" && run_compose up -d --remove-orphans)

health_code="000"
if command -v curl >/dev/null 2>&1; then
  log "Waiting for health endpoint..."
  for _ in $(seq 1 40); do
    health_code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/health" || echo 000)"
    if [[ "$health_code" == "200" ]]; then
      break
    fi
    sleep 1
  done
fi

echo
echo "=========================================="
echo "Deploy completed (Tunnel-only)"
echo "Domain:          https://$DOMAIN"
echo "Container:       $CONTAINER_NAME"
echo "Target dir:      $TARGET_DIR"
echo "Local bind:      127.0.0.1:$PORT -> $INTERNAL_PORT"
echo "Image:           $IMAGE"
echo "Local health:    http://127.0.0.1:$PORT/health -> $health_code"
echo "Tunnel target:   http://127.0.0.1:$PORT"
echo "Tunnel ID:       ${TUNNEL_ID:-unknown}"
echo "=========================================="
echo "Quick checks:"
echo "  cd $TARGET_DIR && ${COMPOSE_CMD[*]} ps"
echo "  cd $TARGET_DIR && ${COMPOSE_CMD[*]} logs -f"
echo "  curl -I http://127.0.0.1:$PORT/health"
echo "  curl -I https://$DOMAIN"
print_cloudflare_guide "$TUNNEL_ID"
