#!/bin/bash

# Deploy thelaixedanang.shop from Docker Hub
echo "🚀 Creating and deploying thelaixedanang..."

# Create project directory
mkdir -p thelaixedanang
cd thelaixedanang

# Stop any existing containers
docker compose down 2>/dev/null || true

# Create docker-compose.yml for thelaixedanang
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  web:
    image: vutheviet/ladipage:latest
    container_name: thelaixedanang-web
    restart: unless-stopped
    volumes:
      - ./uploads:/app/uploads
      - ./published:/app/published
      - ./database:/app/database
    environment:
      - FLASK_ENV=production
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.thelaixedanang.rule=Host(`thelaixedanang.shop`) || Host(`www.thelaixedanang.shop`)"
      - "traefik.http.routers.thelaixedanang.entrypoints=websecure"
      - "traefik.http.routers.thelaixedanang.tls.certresolver=cloudflare"
      - "traefik.http.services.thelaixedanang.loadbalancer.server.port=5000"
      - "traefik.http.middlewares.thelaixedanang-redirect.redirectscheme.scheme=https"
      - "traefik.http.routers.thelaixedanang-http.rule=Host(`thelaixedanang.shop`) || Host(`www.thelaixedanang.shop`)"
      - "traefik.http.routers.thelaixedanang-http.entrypoints=web"
      - "traefik.http.routers.thelaixedanang-http.middlewares=thelaixedanang-redirect"
    networks:
      - traefik

networks:
  traefik:
    external: true
EOF

# Create necessary directories
mkdir -p uploads published database

# Set proper permissions
chown -R www-data:www-data .
chmod -R 755 .

echo "📦 Pulling latest image from Docker Hub..."
# Pull the latest image from vutheviet/ladipage
docker pull vutheviet/ladipage:latest

echo "🚀 Starting containers..."
# Start the application
docker compose up -d

echo ""
echo "✅ thelaixedanang deployed successfully!"
echo "📍 Location: /opt/websites/sites/thelaixedanang"
echo "🌐 Domain: https://thelaixedanang.shop"
echo "🐳 Image: vutheviet/ladipage:latest"
echo ""

# Show container status
echo "📊 Container Status:"
docker compose ps

echo ""
echo "📋 Next steps:"
echo "1. Configure domain DNS to point to this server"
echo "2. Add domain to Cloudflare"
echo "3. Wait for SSL certificate generation"
echo "4. Test: curl -I https://thelaixedanang.shop"
EOF