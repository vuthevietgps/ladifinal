#!/bin/bash
# Build and push Docker image to Docker Hub

set -e  # Exit on error

# Configuration
DOCKER_USERNAME="vutheviet"  # Replace with your Docker Hub username
IMAGE_NAME="ladifinal"
TAG="${1:-$(date +%Y%m%d-%H%M%S)}"  # Use provided tag or timestamp
FULL_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
LATEST_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME}:latest"

echo "🚀 Building and pushing Docker image..."
echo "📦 Image: ${FULL_IMAGE}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the image
echo "🔨 Building Docker image..."
docker build --no-cache -t "${FULL_IMAGE}" -t "${LATEST_IMAGE}" .

# Login to Docker Hub (if not already logged in)
echo "🔐 Logging in to Docker Hub..."
docker login

# Push the images
echo "📤 Pushing images to Docker Hub..."
docker push "${FULL_IMAGE}"
docker push "${LATEST_IMAGE}"

echo "✅ Successfully pushed:"
echo "   - ${FULL_IMAGE}"
echo "   - ${LATEST_IMAGE}"
echo ""
echo "📋 To deploy on server, run:"
echo "   export DOCKER_IMAGE=${FULL_IMAGE}"
echo "   docker-compose -f docker-compose.prod.yml pull"
echo "   docker-compose -f docker-compose.prod.yml up -d"