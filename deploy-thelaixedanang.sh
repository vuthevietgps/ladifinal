#!/bin/bash

# Deploy script for thelaixedanang.shop
echo "🚀 Deploying thelaixedanang.shop..."

# Create project directory
sudo mkdir -p /opt/websites/sites/thelaixedanang
cd /opt/websites/sites/thelaixedanang

# Stop and remove existing containers if any
sudo docker compose down 2>/dev/null || true
sudo docker system prune -f

# Create docker-compose.yml for thelaixedanang.shop
sudo tee docker-compose.yml > /dev/null <<EOF
version: '3.8'

services:
  web:
    image: vutheviet/ladifinal:latest
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
      - "traefik.http.routers.thelaixedanang.rule=Host(\`thelaixedanang.shop\`) || Host(\`www.thelaixedanang.shop\`)"
      - "traefik.http.routers.thelaixedanang.entrypoints=websecure"
      - "traefik.http.routers.thelaixedanang.tls.certresolver=cloudflare"
      - "traefik.http.services.thelaixedanang.loadbalancer.server.port=5000"
      - "traefik.http.middlewares.thelaixedanang-redirect.redirectscheme.scheme=https"
      - "traefik.http.routers.thelaixedanang-http.rule=Host(\`thelaixedanang.shop\`) || Host(\`www.thelaixedanang.shop\`)"
      - "traefik.http.routers.thelaixedanang-http.entrypoints=web"
      - "traefik.http.routers.thelaixedanang-http.middlewares=thelaixedanang-redirect"
    networks:
      - traefik

networks:
  traefik:
    external: true
EOF

# Create necessary directories
sudo mkdir -p uploads published database

# Set permissions
sudo chown -R www-data:www-data .
sudo chmod -R 755 .

# Pull latest image and start
sudo docker compose pull
sudo docker compose up -d

echo "✅ thelaixedanang.shop deployed successfully!"
echo "📍 Location: /opt/websites/sites/thelaixedanang"
echo "🌐 Domain: https://thelaixedanang.shop"

# Show status
sudo docker compose ps