#!/usr/bin/env bash
set -euo pipefail

# Deploy both production domains with the same Docker image.
# - nghiepvuvantai.com (tunnel-first script)
# - phuhieuxe247.com (generic multi-domain deploy script)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE="${IMAGE:-vutheviet/ladifinal:latest}"
SKIP_PULL="${SKIP_PULL:-0}"

COMMON_ARGS=()
if [[ "$SKIP_PULL" == "1" ]]; then
  COMMON_ARGS+=(--skip-pull)
fi

echo "[INFO] Deploying nghiepvuvantai.com with image: $IMAGE"
IMAGE="$IMAGE" "$SCRIPT_DIR/deploy-nghiepvuvantai.sh" "${COMMON_ARGS[@]}" "$@"

echo "[INFO] Deploying phuhieuxe247.com with image: $IMAGE"
IMAGE="$IMAGE" "$SCRIPT_DIR/deploy-phuhieuxe247.sh" "${COMMON_ARGS[@]}" "$@"

echo
echo "[INFO] Done deploying both domains."
