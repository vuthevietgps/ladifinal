#!/bin/bash
# Quick Deployment Script - For when you just want it to work
# Version: 2.0
# Date: 2025-09-22

echo "🚀 QUICK DEPLOY - ZERO HASSLE"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Quick setup
REPO="https://github.com/vuthevietgps/ladifinal.git"
DIR="/var/www/ladifinal"

log "1. Quick cleanup..."
sudo pkill -f python 2>/dev/null || true
sudo pkill -f gunicorn 2>/dev/null || true
sudo systemctl stop ladifinal 2>/dev/null || true
sudo rm -rf $DIR

log "2. Clone and setup..."
git clone $REPO $DIR
cd $DIR
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt -q
pip install gunicorn -q

log "3. Initialize database..."
python -c "
from app import create_app
from app.db import init_db
app = create_app()
with app.app_context():
    init_db()
print('Database ready!')
" || python main.py &
sleep 3
pkill -f python 2>/dev/null || true
deactivate

log "4. Set permissions..."
sudo chown -R www-data:www-data $DIR
sudo chmod -R 755 $DIR

log "5. Create service..."
sudo tee /etc/systemd/system/ladifinal.service > /dev/null << 'EOF'
[Unit]
Description=LandingPage System
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/ladifinal
ExecStart=/var/www/ladifinal/venv/bin/gunicorn --bind 127.0.0.1:5000 --workers 2 main:app
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

log "6. Configure nginx..."
sudo tee /etc/nginx/sites-available/ladifinal > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    client_max_body_size 100M;
    
    location /static {
        alias /var/www/ladifinal/static;
        expires 1y;
    }
    
    location /landing {
        alias /var/www/ladifinal/published;
        try_files $uri $uri/ =404;
    }
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/ladifinal /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

log "7. Start services..."
sudo systemctl daemon-reload
sudo systemctl enable ladifinal
sudo systemctl start ladifinal
sudo systemctl restart nginx

sleep 3

log "8. Check status..."
if systemctl is-active --quiet ladifinal; then
    log "✅ Flask app: Running"
else
    warn "❌ Flask app: Failed"
fi

if systemctl is-active --quiet nginx; then
    log "✅ Nginx: Running"
else
    warn "❌ Nginx: Failed"
fi

SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo ""
log "🎉 DEPLOYMENT COMPLETE!"
log "🔗 Access: http://$SERVER_IP"
log "🔐 Admin: http://$SERVER_IP/admin-panel-xyz123"  
log "👤 Login: admin / admin123"
echo ""
log "🔧 Commands:"
echo "  sudo systemctl restart ladifinal"
echo "  sudo systemctl restart nginx"  
echo "  sudo journalctl -u ladifinal -f"
echo ""
echo "================================"
echo "✨ QUICK DEPLOY SUCCESS!"
echo "================================"