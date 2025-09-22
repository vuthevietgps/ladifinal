#!/bin/bash
# Ultimate VPS Cleanup Script for LandingPage System
# Version: 2.0 - Lessons Learned Edition
# Date: 2025-09-22
# Repository: ladifinal

echo "========================================="
echo "🧹 ULTIMATE VPS CLEANUP - DEEP CLEAN"
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

print_header "1. SYSTEM INFO"
print_status "OS: $(lsb_release -d | cut -f2 2>/dev/null || echo 'Unknown')"
print_status "Kernel: $(uname -r)"
print_status "Uptime: $(uptime -p)"
print_status "Memory: $(free -h | grep '^Mem:' | awk '{print $4 " free of " $2}')"
print_status "Disk: $(df -h / | tail -1 | awk '{print $4 " free (" $5 " used)"}')"

print_header "2. KILL ALL PROCESSES"
print_status "Stopping all Python/Flask/Gunicorn processes..."

# Kill all related processes
PROCESSES=("python" "gunicorn" "flask" "uwsgi" "celery")
for proc in "${PROCESSES[@]}"; do
    if pgrep -f "$proc" >/dev/null 2>&1; then
        print_warning "Killing $proc processes..."
        sudo pkill -9 -f "$proc" 2>/dev/null || true
        sleep 1
    fi
done

print_header "3. STOP AND REMOVE ALL SERVICES"
print_status "Stopping and removing systemd services..."

# List of possible service names
SERVICES=(
    "ladifinal"
    "ladipage" 
    "quanlyladipage"
    "landingpage"
    "flask-app"
    "gunicorn"
)

for service in "${SERVICES[@]}"; do
    if systemctl is-active --quiet "$service" 2>/dev/null; then
        print_status "Stopping $service..."
        sudo systemctl stop "$service" 2>/dev/null || true
    fi
    
    if systemctl is-enabled --quiet "$service" 2>/dev/null; then
        print_status "Disabling $service..."
        sudo systemctl disable "$service" 2>/dev/null || true
    fi
    
    if [ -f "/etc/systemd/system/$service.service" ]; then
        print_status "Removing $service.service..."
        sudo rm -f "/etc/systemd/system/$service.service"
    fi
done

# Reload systemd
sudo systemctl daemon-reload

print_header "4. NGINX CLEANUP"
print_status "Cleaning Nginx configurations..."

# Stop nginx
sudo systemctl stop nginx 2>/dev/null || true

# Remove all custom sites
SITE_NAMES=(
    "ladifinal"
    "ladipage"
    "quanlyladipage" 
    "landingpage"
    "default"
)

for site in "${SITE_NAMES[@]}"; do
    sudo rm -f "/etc/nginx/sites-available/$site"
    sudo rm -f "/etc/nginx/sites-enabled/$site"
done

# Restore default nginx site
if [ -f "/etc/nginx/sites-available/default.backup" ]; then
    sudo cp /etc/nginx/sites-available/default.backup /etc/nginx/sites-available/default
else
    sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    server_name _;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
fi

sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Test and start nginx
if sudo nginx -t >/dev/null 2>&1; then
    sudo systemctl start nginx
    print_status "Nginx restored and started"
else
    print_error "Nginx config error - manual fix required"
fi

print_header "5. DEEP DIRECTORY CLEANUP"
print_status "Removing all deployment directories..."

# Comprehensive directory cleanup
CLEANUP_DIRS=(
    "/var/www/ladifinal"
    "/var/www/ladipage"
    "/var/www/quanlyladipage" 
    "/var/www/landingpages"
    "/var/www/html/ladi*"
    "/opt/ladifinal"
    "/opt/ladipage"
    "/home/*/ladifinal"
    "/home/*/ladipage"
    "/home/*/quanlyladipage"
    "/tmp/ladifinal*"
    "/tmp/ladipage*"
    "/tmp/gunicorn*"
    "/tmp/flask*"
)

for dir in "${CLEANUP_DIRS[@]}"; do
    if ls $dir 1> /dev/null 2>&1; then
        print_status "Removing: $dir"
        sudo rm -rf $dir 2>/dev/null || true
    fi
done

print_header "6. LOGS AND CACHE CLEANUP"
print_status "Cleaning logs and caches..."

# Log directories
LOG_DIRS=(
    "/var/log/ladifinal"
    "/var/log/ladipage"
    "/var/log/gunicorn"
    "/var/log/flask"
)

for logdir in "${LOG_DIRS[@]}"; do
    sudo rm -rf "$logdir" 2>/dev/null || true
done

# PID directories
sudo rm -rf /var/run/ladifinal 2>/dev/null || true
sudo rm -rf /var/run/ladipage 2>/dev/null || true
sudo rm -rf /run/gunicorn* 2>/dev/null || true

# Python cache cleanup
print_status "Cleaning Python caches..."
sudo find /var/www -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
sudo find /opt -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
sudo find /home -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Pip cache
sudo rm -rf /root/.cache/pip 2>/dev/null || true
sudo rm -rf /home/*/.cache/pip 2>/dev/null || true

# Virtual environments
print_status "Removing all virtual environments..."
sudo find /var/www -name "venv" -type d -exec rm -rf {} + 2>/dev/null || true
sudo find /opt -name "venv" -type d -exec rm -rf {} + 2>/dev/null || true
sudo find /home -name "venv" -type d -exec rm -rf {} + 2>/dev/null || true

print_header "7. SYSTEM CLEANUP"
print_status "Deep system cleanup..."

# Update package lists
sudo apt update -qq

# Clean packages
sudo apt autoremove -y --purge -qq
sudo apt autoclean -qq
sudo apt clean -qq

# Clean journals
sudo journalctl --vacuum-time=1d >/dev/null 2>&1 || true

# Clear system caches
sudo sync
echo 3 | sudo tee /proc/sys/vm/drop_caches >/dev/null

print_header "8. FIREWALL SETUP"
print_status "Configuring UFW firewall..."

# Reset and configure UFW
sudo ufw --force reset >/dev/null 2>&1
sudo ufw default deny incoming >/dev/null 2>&1
sudo ufw default allow outgoing >/dev/null 2>&1
sudo ufw allow ssh >/dev/null 2>&1
sudo ufw allow 'Nginx Full' >/dev/null 2>&1
sudo ufw --force enable >/dev/null 2>&1

print_header "9. INSTALL ESSENTIAL PACKAGES"
print_status "Installing/updating essential packages..."

PACKAGES=(
    "curl"
    "wget"
    "git"
    "python3"
    "python3-pip"
    "python3-venv" 
    "python3-dev"
    "build-essential"
    "nginx"
    "supervisor"
    "ufw"
    "net-tools"
    "htop"
    "tree"
    "unzip"
    "sqlite3"
)

for package in "${PACKAGES[@]}"; do
    if ! dpkg -l | grep -q "^ii.*$package "; then
        print_status "Installing $package..."
        sudo apt install -y "$package" -qq >/dev/null 2>&1
    fi
done

print_header "10. PREPARE DEPLOYMENT DIRECTORIES"
print_status "Creating fresh deployment structure..."

# Create deployment directory
DEPLOY_DIR="/var/www/ladifinal"
sudo mkdir -p "$DEPLOY_DIR"
sudo chown -R $USER:$USER "$DEPLOY_DIR"

# Create log directory
LOG_DIR="/var/log/ladifinal"
sudo mkdir -p "$LOG_DIR"
sudo chown -R www-data:www-data "$LOG_DIR"

# Create uploads directory
sudo mkdir -p /var/www/uploads
sudo chown -R www-data:www-data /var/www/uploads

print_header "11. VERIFICATION"
print_status "Verifying cleanup..."

# Check no old processes
OLD_PROCS=$(ps aux | grep -E "(python|gunicorn|flask)" | grep -v grep | wc -l)
if [ "$OLD_PROCS" -eq 0 ]; then
    print_status "✅ No old processes running"
else
    print_warning "⚠️  $OLD_PROCS processes still running"
fi

# Check ports
if command -v netstat >/dev/null 2>&1; then
    PORT_80=$(sudo netstat -tlnp | grep ":80 " | wc -l)
    PORT_5000=$(sudo netstat -tlnp | grep ":5000 " | wc -l)
    
    print_status "Port 80: $([[ $PORT_80 -gt 0 ]] && echo "Nginx ✅" || echo "Free ✅")"
    print_status "Port 5000: $([[ $PORT_5000 -eq 0 ]] && echo "Free ✅" || echo "Occupied ⚠️")"
fi

# Check services
NGINX_STATUS=$(systemctl is-active nginx 2>/dev/null || echo "inactive")
print_status "Nginx status: $NGINX_STATUS"

print_header "12. COMPLETION"
echo ""
print_status "🎉 ULTIMATE CLEANUP COMPLETED!"
print_status ""
print_status "📁 Deployment directory: $DEPLOY_DIR"
print_status "📋 Log directory: $LOG_DIR"
print_status "🔥 Firewall: Configured"
print_status "📦 Packages: Updated"
print_status "🧹 System: Deep cleaned"
echo ""
print_status "🚀 VPS is now ready for fresh deployment!"
print_warning "💡 Run the deployment script next: ./deploy-vps-ultimate.sh"
echo ""
echo "========================================="
echo "✨ ULTIMATE CLEANUP SUCCESS!"
echo "========================================="