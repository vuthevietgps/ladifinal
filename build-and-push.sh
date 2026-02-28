#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Build, smoke-test on Docker Desktop, then push to Docker Hub.

Usage:
  ./build-and-push.sh [tag]

Environment variables:
  DOCKER_USERNAME   Docker Hub username (default: vutheviet)
  IMAGE_NAME        Docker image name (default: ladifinal)
  SMOKE_PORT        Preferred host port for smoke test (default: 5001)
EOF
}

if [[ ${1:-} == "-h" || ${1:-} == "--help" ]]; then
  usage
  exit 0
fi

DOCKER_USERNAME="${DOCKER_USERNAME:-vutheviet}"
IMAGE_NAME="${IMAGE_NAME:-ladifinal}"
SMOKE_PORT="${SMOKE_PORT:-5001}"

if [[ $# -ge 1 ]]; then
  TAG="$1"
else
  if git describe --tags --exact-match >/dev/null 2>&1; then
    TAG="$(git describe --tags --exact-match)"
  else
    TAG="$(date +%Y%m%d-%H%M%S)"
  fi
fi

FULL_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
LATEST_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
SMOKE_CONTAINER="${IMAGE_NAME}-smoke-test"

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

if ! [[ "$SMOKE_PORT" =~ ^[0-9]+$ ]] || (( SMOKE_PORT < 1 || SMOKE_PORT > 65535 )); then
  err "Invalid SMOKE_PORT: $SMOKE_PORT"
  exit 1
fi

port_in_use() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
    return $?
  fi

  if command -v ss >/dev/null 2>&1; then
    ss -ltn | awk -v p=":$port" 'NR>1 && $4 ~ p"$" {found=1} END {exit(found?0:1)}'
    return $?
  fi

  docker ps --filter "publish=$port" --format '{{.Names}}' | grep -q .
}

pick_port() {
  local p="$1"
  local tries=0
  while (( tries < 100 )); do
    if ! port_in_use "$p"; then
      echo "$p"
      return 0
    fi
    p=$((p + 1))
    tries=$((tries + 1))
  done
  return 1
}

cleanup_smoke_container() {
  docker rm -f "$SMOKE_CONTAINER" >/dev/null 2>&1 || true
}

trap cleanup_smoke_container EXIT

SELECTED_PORT="$(pick_port "$SMOKE_PORT")" || {
  err "Cannot find free port for smoke test."
  exit 1
}

if [[ "$SELECTED_PORT" != "$SMOKE_PORT" ]]; then
  warn "Smoke test port $SMOKE_PORT is busy, using $SELECTED_PORT"
fi

log "Building image: $FULL_IMAGE"
docker build --pull -t "$FULL_IMAGE" -t "$LATEST_IMAGE" .

log "Running smoke test container on port $SELECTED_PORT"
cleanup_smoke_container
docker run -d --name "$SMOKE_CONTAINER" -p "$SELECTED_PORT:5000" "$FULL_IMAGE" >/dev/null

health_ok=0
for _ in $(seq 1 45); do
  if curl -fsS "http://127.0.0.1:$SELECTED_PORT/health" >/dev/null 2>&1; then
    health_ok=1
    break
  fi
  sleep 1
done

if (( health_ok == 0 )); then
  err "Smoke test failed. Container logs:"
  docker logs "$SMOKE_CONTAINER" || true
  exit 1
fi

log "Smoke test passed."
cleanup_smoke_container

if ! docker info 2>/dev/null | grep -q '^ Username:'; then
  log "Docker Hub login required."
  docker login
fi

log "Pushing image tags..."
docker push "$FULL_IMAGE"
docker push "$LATEST_IMAGE"

echo
echo "Build and push completed"
echo "Image tag: $FULL_IMAGE"
echo "Image tag: $LATEST_IMAGE"
