#!/bin/bash

# Update Traefik configuration for thelaixedanang.shop
echo "🔧 Updating Traefik configuration..."

# Navigate to Traefik directory
cd /opt/traefik

# Backup existing config
sudo cp traefik.yml traefik.yml.backup

# Update traefik.yml to include new domain
sudo tee traefik.yml > /dev/null <<EOF
api:
  dashboard: true
  debug: true

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false

certificatesResolvers:
  cloudflare:
    acme:
      tlsChallenge: {}
      email: your-email@example.com
      storage: acme.json
      caServer: https://acme-v02.api.letsencrypt.org/directory

# Global redirect to https
http:
  middlewares:
    default-headers:
      headers:
        frameDeny: true
        sslRedirect: true
        browserXssFilter: true
        contentTypeNosniff: true
        forceSTSHeader: true
        stsIncludeSubdomains: true
        stsPreload: true
        stsSeconds: 31536000

  routers:
    api:
      rule: Host(\`traefik.yourdomain.com\`)
      entrypoints: websecure
      middlewares:
        - default-headers
      tls:
        certResolver: cloudflare
      service: api@internal
EOF

# Restart Traefik
sudo docker compose restart

echo "✅ Traefik updated successfully!"
echo "🔄 Please restart Traefik: sudo docker compose restart"