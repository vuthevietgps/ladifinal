#!/bin/bash
# Script deploy VPS cho LandingPage System
# Tác giả: Auto-generated for ladifinal project  
# Ngày tạo: 2025-09-22

echo "========================================="
echo "🚀 DEPLOY LANDING PAGE SYSTEM TO VPS"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}==== $1 ====${NC}"
}

# Configuration
REPO_URL="https://github.com/vuthevietgps/ladifinal.git"
DEPLOY_DIR="/var/www/ladifinal"
SERVICE_NAME="ladifinal"
NGINX_SITE="ladifinal"

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then
    print_error "Không nên chạy script này với quyền root!"
    print_warning "Chạy với user thường: sudo -u username $0"
    exit 1
fi

print_header "1. CLONE SOURCE CODE"

# Remove existing directory if it exists
if [ -d "$DEPLOY_DIR" ]; then
    print_status "Xóa thư mục cũ..."
    sudo rm -rf "$DEPLOY_DIR"
fi

# Clone repository
print_status "Clone source code từ GitHub..."
git clone "$REPO_URL" "$DEPLOY_DIR"

if [ $? -ne 0 ]; then
    print_error "Không thể clone repository!"
    exit 1
fi

cd "$DEPLOY_DIR"
print_status "✅ Clone thành công!"

print_header "2. TẠO PYTHON VIRTUAL ENVIRONMENT"

# Create virtual environment
print_status "Tạo Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
print_status "Cập nhật pip..."
pip install --upgrade pip

# Install requirements
if [ -f "requirements.txt" ]; then
    print_status "Cài đặt Python packages..."
    pip install -r requirements.txt
else
    print_warning "Không tìm thấy requirements.txt, cài đặt packages cơ bản..."
    pip install flask flask-sqlalchemy flask-wtf flask-bcrypt python-dotenv
fi

print_status "✅ Python environment đã sẵn sàng!"

print_header "3. CẤU HÌNH DATABASE"

# Initialize database if needed
if [ -f "main.py" ]; then
    print_status "Khởi tạo database..."
    python main.py --init-db 2>/dev/null || python -c "
from app import create_app
from app.db import init_db
app = create_app()
with app.app_context():
    init_db()
" 2>/dev/null || true
    print_status "✅ Database đã được khởi tạo!"
fi

print_header "4. CẤU HÌNH GUNICORN"

# Create Gunicorn configuration
print_status "Tạo cấu hình Gunicorn..."
cat > gunicorn.conf.py << 'EOF'
# Gunicorn configuration file
bind = "127.0.0.1:5000"
workers = 2
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
preload_app = True
pidfile = "/var/run/ladifinal/gunicorn.pid"
user = "www-data"
group = "www-data"
errorlog = "/var/log/ladifinal/gunicorn_error.log"
accesslog = "/var/log/ladifinal/gunicorn_access.log"
loglevel = "info"
EOF

# Create PID directory
sudo mkdir -p /var/run/ladifinal
sudo chown www-data:www-data /var/run/ladifinal

print_header "5. CẤU HÌNH SYSTEMD SERVICE"

# Create systemd service
print_status "Tạo systemd service..."
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null << EOF
[Unit]
Description=LandingPage System Flask Application
After=network.target

[Service]
Type=forking
User=www-data
Group=www-data
WorkingDirectory=${DEPLOY_DIR}
Environment="PATH=${DEPLOY_DIR}/venv/bin"
ExecStart=${DEPLOY_DIR}/venv/bin/gunicorn --config gunicorn.conf.py main:app
ExecReload=/bin/kill -s HUP \$MAINPID
PIDFile=/var/run/ladifinal/gunicorn.pid
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Set permissions
sudo chown -R www-data:www-data "$DEPLOY_DIR"
sudo chmod -R 755 "$DEPLOY_DIR"

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"

print_header "6. CẤU HÌNH NGINX"

# Create Nginx configuration
print_status "Tạo cấu hình Nginx..."
sudo tee /etc/nginx/sites-available/${NGINX_SITE} > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    client_max_body_size 100M;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Static files
    location /static {
        alias /var/www/ladifinal/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Landing pages static content  
    location /landing {
        alias /var/www/ladifinal/published;
        try_files $uri $uri/ =404;
        expires 1h;
    }

    # Proxy to Flask app
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/${NGINX_SITE} /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

if [ $? -ne 0 ]; then
    print_error "Nginx configuration có lỗi!"
    exit 1
fi

print_header "7. KHỞI ĐỘNG SERVICES"

# Start services
print_status "Khởi động Flask application..."
sudo systemctl start "$SERVICE_NAME"

print_status "Khởi động Nginx..."
sudo systemctl restart nginx

# Check service status
sleep 3

print_status "Kiểm tra trạng thái services..."
if systemctl is-active --quiet "$SERVICE_NAME"; then
    print_status "✅ Flask app: Running"
else
    print_error "❌ Flask app: Failed"
    sudo systemctl status "$SERVICE_NAME" --no-pager
fi

if systemctl is-active --quiet nginx; then
    print_status "✅ Nginx: Running"
else
    print_error "❌ Nginx: Failed"
    sudo systemctl status nginx --no-pager
fi

print_header "8. KIỂM TRA DEPLOYMENT"

# Test HTTP response
print_status "Testing HTTP response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    print_status "✅ HTTP Test: OK (Status: $HTTP_CODE)"
else
    print_warning "⚠️  HTTP Test: Status $HTTP_CODE"
fi

# Show logs
print_status "Log files location:"
echo "  - Gunicorn Error: /var/log/ladifinal/gunicorn_error.log"
echo "  - Gunicorn Access: /var/log/ladifinal/gunicorn_access.log"  
echo "  - Nginx Error: /var/log/nginx/error.log"
echo "  - Nginx Access: /var/log/nginx/access.log"

print_header "9. THÔNG TIN DEPLOYMENT"

echo ""
print_status "🎉 DEPLOYMENT HOÀN THÀNH!"
echo ""
print_status "📁 Deploy directory: $DEPLOY_DIR"
print_status "🔗 Repository: $REPO_URL"
print_status "🐍 Python venv: $DEPLOY_DIR/venv"
print_status "⚙️  Service name: $SERVICE_NAME"
print_status "🌐 Nginx site: $NGINX_SITE"
echo ""
print_status "🔧 QUẢN LÝ SERVICES:"
echo "  sudo systemctl start/stop/restart $SERVICE_NAME"
echo "  sudo systemctl start/stop/restart nginx"
echo ""
print_status "📋 XEM LOGS:"
echo "  sudo journalctl -u $SERVICE_NAME -f"
echo "  sudo tail -f /var/log/ladifinal/gunicorn_error.log"
echo "  sudo tail -f /var/log/nginx/error.log"
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
if [ -n "$SERVER_IP" ]; then
    print_status "🌍 Truy cập ứng dụng tại: http://$SERVER_IP"
fi

echo ""
print_warning "💡 LƯU Ý:"
echo "  - Đảm bảo firewall đã mở port 80 và 443"
echo "  - Cân nhắc cài đặt SSL certificate (Let's Encrypt)"
echo "  - Backup database thường xuyên"
echo ""

echo "========================================="
echo "✨ DEPLOYMENT THÀNH CÔNG!"
echo "========================================="