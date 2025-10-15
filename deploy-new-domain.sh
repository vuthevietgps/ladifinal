#!/bin/bash

# Quick deploy script for new domain
# Usage: ./deploy-new-domain.sh domain.com 8083

DOMAIN=$1
PORT=$2
CONTAINER_NAME=$(echo $DOMAIN | sed 's/\./-/g')

if [ -z "$DOMAIN" ] || [ -z "$PORT" ]; then
    echo "Usage: $0 domain.com port"
    echo "Example: $0 example.com 8083"
    exit 1
fi

echo "🚀 Deploying $DOMAIN on port $PORT..."

# 1. Create directory
cd /opt/websites/sites
sudo mkdir -p $CONTAINER_NAME
cd $CONTAINER_NAME

# 2. Create docker-compose.yml
sudo tee docker-compose.yml > /dev/null <<EOF
version: '3.8'

services:
  web:
    image: vutheviet/ladipage:latest
    container_name: ${CONTAINER_NAME}-web
    restart: unless-stopped
    volumes:
      - ./uploads:/app/uploads
      - ./published:/app/published
      - ./database:/app/database
    environment:
      - FLASK_ENV=production
    ports:
      - "${PORT}:5000"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${CONTAINER_NAME}.rule=Host(\`${DOMAIN}\`) || Host(\`www.${DOMAIN}\`)"
      - "traefik.http.routers.${CONTAINER_NAME}.entrypoints=websecure"
      - "traefik.http.services.${CONTAINER_NAME}.loadbalancer.server.port=5000"
      - "traefik.http.routers.${CONTAINER_NAME}-http.rule=Host(\`${DOMAIN}\`) || Host(\`www.${DOMAIN}\`)"
      - "traefik.http.routers.${CONTAINER_NAME}-http.entrypoints=web"
      - "traefik.http.routers.${CONTAINER_NAME}-http.middlewares=redirect-to-https"
      - "traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https"
    networks:
      - traefik-network

networks:
  traefik-network:
    external: true
EOF

# 3. Create directories
sudo mkdir -p uploads published database
sudo chown -R www-data:www-data .

# 4. Start container
sudo docker-compose up -d

# 5. Add to tunnel config
echo "📝 Adding to tunnel config..."
sudo sed -i "/- service: http_status:404/i\\
  - hostname: $DOMAIN\\
    service: http://127.0.0.1:$PORT\\
    originRequest:\\
      noTLSVerify: true\\
      connectTimeout: 30s\\
      tlsTimeout: 30s\\
  - hostname: www.$DOMAIN\\
    service: http://127.0.0.1:$PORT\\
    originRequest:\\
      noTLSVerify: true\\
      connectTimeout: 30s\\
      tlsTimeout: 30s" /etc/cloudflared/config.yml

# 6. Restart tunnel
sudo systemctl restart cloudflared

# 7. Test
echo "🧪 Testing..."
sleep 10
curl -I http://localhost:$PORT

echo ""
echo "✅ Deploy completed!"
echo "📍 Container: ${CONTAINER_NAME}-web"
echo "🌐 Domain: https://$DOMAIN"
echo "🔌 Port: $PORT"
echo ""
echo "📋 Next steps:"
echo "1. Add $DOMAIN to Cloudflare Dashboard"
echo "2. Create CNAME records:"
echo "   @ → 13835f7d-46a0-48f7-bb67-333f39ee33d1.cfargotunnel.com"
echo "   www → 13835f7d-46a0-48f7-bb67-333f39ee33d1.cfargotunnel.com"
echo "3. Test: curl -I https://$DOMAIN"