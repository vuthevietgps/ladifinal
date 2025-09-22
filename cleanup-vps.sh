#!/bin/bash
# Script cleanup VPS cho LandingPage System
# Tác giả: Auto-generated for ladifinal project
# Ngày tạo: 2025-09-22

echo "========================================="
echo "🧹 CLEANUP VPS CHO LANDING PAGE SYSTEM"
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

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_warning "Đang chạy với quyền root. Khuyến nghị chạy với user thường."
fi

print_header "1. KIỂM TRA HỆ THỐNG"

# System info
print_status "Hệ điều hành: $(lsb_release -d | cut -f2)"
print_status "Kernel: $(uname -r)"
print_status "Uptime: $(uptime -p)"

# Memory and disk usage
echo ""
print_status "Memory usage:"
free -h

echo ""
print_status "Disk usage:"
df -h

print_header "2. DỪNG CÁC DỊCH VỤ CŨ"

# Stop existing Python/Flask processes
print_status "Dừng các process Python/Flask..."
pkill -f "python.*main.py" 2>/dev/null || true
pkill -f "flask.*run" 2>/dev/null || true
pkill -f "gunicorn" 2>/dev/null || true

# Stop nginx if exists
if systemctl is-active --quiet nginx; then
    print_status "Dừng Nginx..."
    sudo systemctl stop nginx
fi

# Stop apache if exists  
if systemctl is-active --quiet apache2; then
    print_status "Dừng Apache2..."
    sudo systemctl stop apache2
fi

print_header "3. XÓA CÁC FOLDER CŨ"

# Remove old deployment folders
OLD_FOLDERS=(
    "/var/www/ladipage"
    "/var/www/ladi"
    "/home/$USER/ladipage"
    "/home/$USER/ladi"
    "/opt/ladipage"
    "/opt/ladi"
)

for folder in "${OLD_FOLDERS[@]}"; do
    if [ -d "$folder" ]; then
        print_status "Xóa folder cũ: $folder"
        sudo rm -rf "$folder"
    fi
done

print_header "4. DỌN DẸP PYTHON ENVIRONMENT"

# Remove old virtual environments
VENV_FOLDERS=(
    "/home/$USER/venv"
    "/home/$USER/.venv"
    "/var/www/venv"
    "/opt/venv"
)

for venv in "${VENV_FOLDERS[@]}"; do
    if [ -d "$venv" ]; then
        print_status "Xóa virtual environment cũ: $venv"
        rm -rf "$venv"
    fi
done

print_header "5. DỌN DẸP SYSTEM PACKAGES"

# Update system first
print_status "Cập nhật danh sách package..."
sudo apt update -qq

# Remove unused packages
print_status "Xóa các package không cần thiết..."
sudo apt autoremove -y -qq
sudo apt autoclean -qq

print_header "6. DỌN DẸP LOGS VÀ TEMP FILES"

# Clean logs
print_status "Dọn dẹp system logs..."
sudo journalctl --vacuum-time=7d 2>/dev/null || true

# Clean temp files
print_status "Dọn dẹp temp files..."
sudo rm -rf /tmp/pip-* 2>/dev/null || true
sudo rm -rf /tmp/tmp* 2>/dev/null || true

# Clean user cache
if [ -d "/home/$USER/.cache" ]; then
    print_status "Dọn dẹp user cache..."
    rm -rf /home/$USER/.cache/*
fi

print_header "7. KIỂM TRA PORT"

# Check if ports are free
PORTS=(80 443 5000 8000)
for port in "${PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $port đang được sử dụng:"
        lsof -Pi :$port -sTCP:LISTEN
    else
        print_status "Port $port: Trống ✓"
    fi
done

print_header "8. CÀI ĐẶT CÁC TOOLS CẦN THIẾT"

# Install essential packages
PACKAGES=(
    "curl"
    "wget" 
    "git"
    "python3"
    "python3-pip"
    "python3-venv"
    "nginx"
    "supervisor"
    "ufw"
)

print_status "Cài đặt packages cần thiết..."
for package in "${PACKAGES[@]}"; do
    if ! dpkg -l | grep -q "^ii.*$package "; then
        print_status "Cài đặt $package..."
        sudo apt install -y "$package" -qq
    else
        print_status "$package: Đã có ✓"
    fi
done

print_header "9. CẤU HÌNH FIREWALL"

# Configure UFW
print_status "Cấu hình UFW firewall..."
sudo ufw --force reset >/dev/null 2>&1
sudo ufw default deny incoming >/dev/null 2>&1
sudo ufw default allow outgoing >/dev/null 2>&1
sudo ufw allow ssh >/dev/null 2>&1
sudo ufw allow 'Nginx Full' >/dev/null 2>&1
sudo ufw --force enable >/dev/null 2>&1

print_status "UFW status:"
sudo ufw status

print_header "10. TẠO FOLDER DEPLOYMENT"

# Create deployment directory
DEPLOY_DIR="/var/www/ladifinal"
print_status "Tạo thư mục deployment: $DEPLOY_DIR"
sudo mkdir -p "$DEPLOY_DIR"
sudo chown -R $USER:$USER "$DEPLOY_DIR"

# Create log directory
LOG_DIR="/var/log/ladifinal"
print_status "Tạo thư mục logs: $LOG_DIR"
sudo mkdir -p "$LOG_DIR"
sudo chown -R $USER:$USER "$LOG_DIR"

print_header "11. HOÀN TẤT CLEANUP"

echo ""
print_status "✅ Cleanup hoàn tất!"
print_status "📁 Thư mục deployment: $DEPLOY_DIR"
print_status "📋 Thư mục logs: $LOG_DIR"
print_status "🔥 Firewall: Đã cấu hình"
print_status "⚡ Services: Đã dừng các service cũ"

echo ""
print_status "🚀 VPS đã sẵn sàng cho deployment!"
print_warning "Tiếp theo: Chạy script redeploy-vps.sh để deploy ứng dụng"

echo ""
echo "========================================="
echo "✨ CLEANUP THÀNH CÔNG!"
echo "========================================="