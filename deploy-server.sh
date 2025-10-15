#!/bin/bash
# Deploy script for Ubuntu server

set -e  # Exit on error

# Configuration
DOCKER_USERNAME="vutheviet"  # Replace with your Docker Hub username
IMAGE_NAME="ladifinal"
TAG="${1:-latest}"
FULL_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "🚀 Deploying ${FULL_IMAGE} on server..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installed. Please logout and login again, then run this script."
    exit 0
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose plugin."
    exit 1
fi

# Create necessary directories
echo "📁 Creating data directories..."
mkdir -p uploads published logs data ladifinal
touch ladifinal/database.db

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating .env from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing!"
    echo "   Especially update SECRET_KEY and DOCKER_IMAGE"
    exit 0
fi

# Source environment variables
source .env

# Update image in environment
export DOCKER_IMAGE="${FULL_IMAGE}"

# Create external network if it doesn't exist
echo "🌐 Creating traefik-network if needed..."
docker network create traefik-network 2>/dev/null || true

# Login to Docker Hub (optional, for private repos)
echo "🔐 Logging in to Docker Hub..."
docker login || echo "⚠️  Login failed, continuing with public images..."

# Pull latest image
echo "📥 Pulling latest image..."
docker-compose -f docker-compose.prod.yml pull

# Stop existing containers gracefully
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Start new containers
echo "🚀 Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait a moment for containers to start
sleep 10

# Check container status
echo "📊 Checking container status..."
docker-compose -f docker-compose.prod.yml ps

# Test health endpoint
echo "🏥 Testing health endpoint..."
sleep 5
if curl -f http://localhost:${PORT:-5001}/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "⚠️  Health check failed. Check logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=20
fi

echo "🎉 Deployment completed!"
echo "📝 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop app: docker-compose -f docker-compose.prod.yml down"
echo "   Restart: docker-compose -f docker-compose.prod.yml restart"