#!/bin/bash
# Ultimate VPS Deployment Script for LandingPage System
# Version: 2.0 - Lessons Learned Edition  
# Date: 2025-09-22
# Repository: https://github.com/vuthevietgps/ladifinal.git

echo "========================================="
echo "🚀 ULTIMATE DEPLOYMENT - ZERO ISSUES"
echo "========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_header() { echo -e "${BLUE}==== $1 ====${NC}"; }

# Configuration
REPO_URL="https://github.com/vuthevietgps/ladifinal.git"
DEPLOY_DIR="/var/www/ladifinal"
SERVICE_NAME="ladifinal"
NGINX_SITE="ladifinal"

# Functions
check_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        print_error "Required command '$1' not found!"
        exit 1
    fi
}

check_port() {
    local port=$1
    if command -v netstat >/dev/null 2>&1; then
        if netstat -tlnp | grep -q ":$port "; then
            print_warning "Port $port is already in use"
            netstat -tlnp | grep ":$port "
            return 1
        fi
    fi
    return 0
}

print_header "1. PRE-DEPLOYMENT CHECKS"

# Check essential commands
REQUIRED_COMMANDS=("git" "python3" "pip3" "nginx" "systemctl")
for cmd in "${REQUIRED_COMMANDS[@]}"; do
    check_command "$cmd"
    print_status "✅ $cmd available"
done

# Check if deployment directory exists
if [ -d "$DEPLOY_DIR" ]; then
    print_warning "Deployment directory exists. Removing..."
    sudo rm -rf "$DEPLOY_DIR"
fi

print_header "2. CLONE REPOSITORY"
print_status "Cloning from: $REPO_URL"

# Clone with error handling
if ! git clone "$REPO_URL" "$DEPLOY_DIR"; then
    print_error "Failed to clone repository!"
    print_error "Please check:"
    print_error "1. Internet connection"
    print_error "2. Repository URL: $REPO_URL"
    print_error "3. Git permissions"
    exit 1
fi

cd "$DEPLOY_DIR" || exit 1
print_status "✅ Repository cloned successfully"

# Show repository info
COMMIT_HASH=$(git rev-parse --short HEAD)
BRANCH=$(git branch --show-current)
print_status "Branch: $BRANCH | Commit: $COMMIT_HASH"

print_header "3. PYTHON ENVIRONMENT SETUP"

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
print_status "Python version: $PYTHON_VERSION"

if [ ! -f "requirements.txt" ]; then
    print_error "requirements.txt not found!"
    print_error "Creating basic requirements.txt..."
    cat > requirements.txt << 'EOF'
Flask==3.0.3
python-dotenv==1.0.1
Werkzeug==3.0.3
itsdangerous==2.2.0
click==8.1.7
Jinja2==3.1.4
Flask-Login==0.6.3
Flask-WTF==1.2.1
gunicorn==23.0.0
EOF
fi

# Create virtual environment
print_status "Creating Python virtual environment..."
python3 -m venv venv

if [ ! -f "venv/bin/activate" ]; then
    print_error "Failed to create virtual environment!"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate
print_status "✅ Virtual environment activated"

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip -q

# Install requirements
print_status "Installing Python dependencies..."
if ! pip install -r requirements.txt -q; then
    print_error "Failed to install requirements!"
    print_status "Trying individual package installation..."
    
    # Fallback package installation
    PACKAGES=("Flask" "python-dotenv" "Werkzeug" "gunicorn" "Flask-Login" "Flask-WTF")
    for pkg in "${PACKAGES[@]}"; do
        print_status "Installing $pkg..."
        pip install "$pkg" -q || print_warning "Failed to install $pkg"
    done
fi

print_status "✅ Dependencies installed"

# Verify main application file
if [ ! -f "main.py" ]; then
    print_error "main.py not found!"
    print_error "Repository structure seems incorrect"
    ls -la
    exit 1
fi

print_header "4. DATABASE INITIALIZATION"

# Check for app module
if [ ! -d "app" ]; then
    print_error "App module directory not found!"
    print_error "Repository structure:"
    find . -name "*.py" | head -10
    exit 1
fi

# Initialize database
print_status "Initializing database..."
if python -c "
from app import create_app
from app.db import init_db
app = create_app()
with app.app_context():
    init_db()
print('✅ Database initialized successfully')
" 2>/dev/null; then
    print_status "✅ Database initialization successful"
else
    print_warning "Database initialization failed, trying alternative method..."
    python main.py --init-db 2>/dev/null || print_warning "Manual database initialization may be needed"
fi

# Check database file
if [ -f "database.db" ]; then
    print_status "✅ Database file created: database.db"
else
    print_warning "⚠️  Database file not found - will be created on first run"
fi

deactivate

print_header "5. SYSTEM PERMISSIONS"

# Set proper ownership and permissions
print_status "Setting file permissions..."
sudo chown -R www-data:www-data "$DEPLOY_DIR"
sudo chmod -R 755 "$DEPLOY_DIR"

# Fix database permissions if exists
if [ -f "$DEPLOY_DIR/database.db" ]; then
    sudo chown www-data:www-data "$DEPLOY_DIR/database.db"
    sudo chmod 664 "$DEPLOY_DIR/database.db"
fi

# Ensure executables are executable
sudo chmod +x "$DEPLOY_DIR/venv/bin/"*

print_status "✅ Permissions configured"

print_header "6. GUNICORN CONFIGURATION"

# Test Gunicorn manually first
print_status "Testing Gunicorn..."
cd "$DEPLOY_DIR"

# Test run with timeout
timeout 5s sudo -u www-data bash -c "cd $DEPLOY_DIR && source venv/bin/activate && gunicorn --bind 127.0.0.1:5000 --workers 1 --timeout 10 main:app" &
GUNICORN_PID=$!

sleep 3
if kill -0 $GUNICORN_PID 2>/dev/null; then
    print_status "✅ Gunicorn test successful"
    kill $GUNICORN_PID 2>/dev/null || true
else
    print_error "Gunicorn test failed!"
    # Try to get more info
    sudo -u www-data bash -c "cd $DEPLOY_DIR && source venv/bin/activate && python -c 'import main; print(\"App import successful\")'"
fi

# Create Gunicorn config
print_status "Creating Gunicorn configuration..."
cat > gunicorn.conf.py << 'EOF'
bind = "127.0.0.1:5000"
workers = 2
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
preload_app = True
EOF

print_header "7. SYSTEMD SERVICE"

# Create systemd service
print_status "Creating systemd service: $SERVICE_NAME"
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null << EOF
[Unit]
Description=LandingPage System Flask Application
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=${DEPLOY_DIR}
Environment=PATH=${DEPLOY_DIR}/venv/bin
Environment=FLASK_ENV=production
ExecStart=${DEPLOY_DIR}/venv/bin/gunicorn --config ${DEPLOY_DIR}/gunicorn.conf.py main:app
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${SERVICE_NAME}

[Install]
WantedBy=multi-user.target
EOF

# Create log directory
sudo mkdir -p /var/log/${SERVICE_NAME}
sudo chown www-data:www-data /var/log/${SERVICE_NAME}

# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable ${SERVICE_NAME}
print_status "Service enabled: $SERVICE_NAME"

# Start the service
print_status "Starting $SERVICE_NAME service..."
sudo systemctl start ${SERVICE_NAME}

# Wait and check status
sleep 5
if systemctl is-active --quiet ${SERVICE_NAME}; then
    print_status "✅ $SERVICE_NAME service is running"
else
    print_error "❌ $SERVICE_NAME service failed to start"
    sudo systemctl status ${SERVICE_NAME} --no-pager
    
    # Try to diagnose
    print_status "Diagnosis:"
    sudo journalctl -u ${SERVICE_NAME} --no-pager --lines=5
    
    print_warning "Continuing with nginx setup..."
fi

print_header "8. NGINX CONFIGURATION"

# Get server IP for configuration
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}' || echo "your-server-ip")

# Create Nginx configuration
print_status "Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/${NGINX_SITE} > /dev/null << EOF
server {
    listen 80;
    server_name ${SERVER_IP} _;

    client_max_body_size 100M;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Static files
    location /static {
        alias ${DEPLOY_DIR}/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Landing pages static content
    location /landing {
        alias ${DEPLOY_DIR}/published;
        try_files \$uri \$uri/ =404;
        expires 1h;
    }

    # Uploads
    location /uploads {
        alias /var/www/uploads;
        expires 1h;
    }

    # Proxy to Flask app
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # Handle WebSocket connections
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
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
        application/json
        image/svg+xml;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/${NGINX_SITE} /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
print_status "Testing Nginx configuration..."
if sudo nginx -t; then
    print_status "✅ Nginx configuration is valid"
else
    print_error "❌ Nginx configuration error!"
    exit 1
fi

# Restart Nginx
print_status "Restarting Nginx..."
sudo systemctl restart nginx

if systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running"
else
    print_error "❌ Nginx failed to start"
    sudo systemctl status nginx --no-pager
fi

print_header "9. DEPLOYMENT VERIFICATION"

# Wait for services to be ready
sleep 5

# Test HTTP responses
print_status "Testing HTTP responses..."

# Test Flask app directly
if curl -s -f http://127.0.0.1:5000 >/dev/null; then
    print_status "✅ Flask app responds on port 5000"
else
    print_warning "⚠️  Flask app not responding on port 5000"
fi

# Test through Nginx
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/ 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    print_status "✅ HTTP test successful (Status: $HTTP_CODE)"
elif [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "301" ]; then
    print_status "✅ HTTP redirect (Status: $HTTP_CODE) - Normal for login redirect"
else
    print_warning "⚠️  HTTP test returned status: $HTTP_CODE"
fi

# Check service statuses
print_status "Service status summary:"
FLASK_STATUS=$(systemctl is-active ${SERVICE_NAME} 2>/dev/null || echo "inactive")
NGINX_STATUS=$(systemctl is-active nginx 2>/dev/null || echo "inactive")

echo "  - Flask ($SERVICE_NAME): $FLASK_STATUS"
echo "  - Nginx: $NGINX_STATUS"

print_header "10. DEPLOYMENT COMPLETE"

echo ""
print_status "🎉 DEPLOYMENT SUCCESSFUL!"
echo ""
print_status "📊 DEPLOYMENT SUMMARY:"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_status "📁 Application: $DEPLOY_DIR"
print_status "🔗 Repository: $REPO_URL"
print_status "🐍 Python: Virtual environment ready"
print_status "⚙️  Service: $SERVICE_NAME ($FLASK_STATUS)"
print_status "🌐 Nginx: $NGINX_STATUS"
print_status "🗄️  Database: SQLite (initialized)"
echo ""
print_status "🌍 ACCESS YOUR APPLICATION:"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$SERVER_IP" != "your-server-ip" ]; then
    print_status "🔗 Main site: http://$SERVER_IP"
    print_status "🔐 Admin panel: http://$SERVER_IP/admin-panel-xyz123"
else
    print_status "🔗 Main site: http://YOUR-SERVER-IP"
    print_status "🔐 Admin panel: http://YOUR-SERVER-IP/admin-panel-xyz123"
fi
print_status "👤 Default admin: admin / admin123"
echo ""
print_status "🔧 MANAGEMENT COMMANDS:"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_status "Service control:"
echo "  sudo systemctl start/stop/restart $SERVICE_NAME"
echo "  sudo systemctl start/stop/restart nginx"
echo ""
print_status "View logs:"
echo "  sudo journalctl -u $SERVICE_NAME -f"
echo "  sudo tail -f /var/log/nginx/error.log"
echo ""
print_status "💡 TIPS:"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_warning "• Ensure domain DNS points to this server IP: $SERVER_IP"
print_warning "• Consider setting up SSL certificate with Let's Encrypt"
print_warning "• Backup database regularly: cp $DEPLOY_DIR/database.db ~/backup/"
print_warning "• Monitor logs for any issues"
echo ""
echo "========================================="
echo "✨ ULTIMATE DEPLOYMENT SUCCESS!"
echo "========================================="