#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Deploy ladifinal to a remote server using SSH alias from ~/.ssh/config.

Usage:
  ./deploy-to-vippro.sh [options] [deploy-script-args]

Options:
  --host <alias>        SSH host alias from ~/.ssh/config (default: vippro)
  --remote-dir <path>   Target directory on server (default: ~/ladifinal)
  --retries <n>         Number of retry attempts for SSH/SCP failures (default: 3)
  -h, --help            Show this help

All arguments after wrapper options are forwarded to remote deploy-server.sh.
Example:
  ./deploy-to-vippro.sh --host vippro-proj-a --remote-dir ~/ladifinal 20251012-143000 --old-action remove
EOF
}

REMOTE_HOST="${REMOTE_HOST:-vippro}"
REMOTE_DIR="${REMOTE_DIR:-~/ladifinal}"
RETRY_COUNT="${RETRY_COUNT:-3}"
DEPLOY_FILES=(docker-compose.prod.yml .env.example deploy-server.sh)
REMOTE_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host)
      REMOTE_HOST="$2"
      shift 2
      ;;
    --remote-dir)
      REMOTE_DIR="$2"
      shift 2
      ;;
    --retries)
      if ! [[ "${2:-}" =~ ^[0-9]+$ ]] || (( "$2" < 1 || "$2" > 20 )); then
        echo "[ERROR] --retries must be a number from 1 to 20." >&2
        exit 1
      fi
      RETRY_COUNT="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    --)
      shift
      while [[ $# -gt 0 ]]; do
        REMOTE_ARGS+=("$1")
        shift
      done
      ;;
    *)
      REMOTE_ARGS+=("$1")
      shift
      ;;
  esac
done

log() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
err() { echo "[ERROR] $*" >&2; }

for file in "${DEPLOY_FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    err "Missing local file: $file"
    exit 1
  fi
done

if ! command -v ssh >/dev/null 2>&1 || ! command -v scp >/dev/null 2>&1; then
  err "ssh and scp are required."
  exit 1
fi

SSH_OPTS=(
  -o BatchMode=yes
  -o IdentitiesOnly=yes
  -o IdentityAgent=none
  -o PreferredAuthentications=publickey
  -o PubkeyAuthentication=yes
  -o PasswordAuthentication=no
  -o StrictHostKeyChecking=yes
  -o ConnectTimeout=15
  -o ServerAliveInterval=30
  -o ServerAliveCountMax=3
)

run_with_retry() {
  local attempt=1
  local delay=2
  local max=${RETRY_COUNT}
  while true; do
    if "$@"; then
      return 0
    fi
    if (( attempt >= max )); then
      return 1
    fi
    warn "Attempt $attempt failed. Retrying in ${delay}s..."
    sleep "$delay"
    attempt=$((attempt + 1))
    delay=$((delay * 2))
  done
}

run_with_retry ssh "${SSH_OPTS[@]}" "$REMOTE_HOST" "mkdir -p $REMOTE_DIR"

log "Uploading deploy files to $REMOTE_HOST:$REMOTE_DIR"
run_with_retry scp "${SSH_OPTS[@]}" "${DEPLOY_FILES[@]}" "$REMOTE_HOST:${REMOTE_DIR}/"

remote_args_escaped="$(printf ' %q' "${REMOTE_ARGS[@]}")"
log "Running remote deploy: deploy-server.sh${remote_args_escaped}"
run_with_retry ssh "${SSH_OPTS[@]}" "$REMOTE_HOST" "cd $REMOTE_DIR && chmod +x deploy-server.sh && ./deploy-server.sh${remote_args_escaped}"

log "Remote deploy finished. Check output on server: $REMOTE_HOST:$REMOTE_DIR"
