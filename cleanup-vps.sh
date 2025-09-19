#!/bin/bash

# Script làm sạch sâu VPS trước khi deploy mới
# Chạy với quyền root: sudo bash cleanup-vps.sh

set -Eeuo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Kiểm tra quyền root
if [[ $EUID -ne 0 ]]; then
   print_error "Script này cần chạy với quyền root (sudo bash cleanup-vps.sh)"
   exit 1
fi

print_header "🧹 BẮT ĐẦU LÀM SẠCH VPS"

# Hỏi xác nhận
echo -e "${YELLOW}CẢNH BÁO: Script này sẽ xóa:${NC}"
echo "- Tất cả ứng dụng Flask/Python cũ"
echo "- Cấu hình Nginx cũ"
echo "- Cấu hình Supervisor/Systemd cũ"
echo "- Database và files uploaded cũ"
echo "- Packages không cần thiết"
echo ""
read -p "Bạn có chắc chắn muốn tiếp tục? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Hủy bỏ cleanup"
    exit 1
fi

print_header "1. DỪNG VÀ XÓA CÁC SERVICE CỦ"

print_status "Dừng các service có thể đang chạy..."

# Danh sách các service có thể có
SERVICES=(
    "quanlyladipage"
    "landingpage"
    "flask-app" 
    "webapp"
    "myapp"
    "gunicorn"
    "uwsgi"
)

for service in "${SERVICES[@]}"; do
    if systemctl is-active --quiet $service 2>/dev/null; then
        print_status "Dừng service: $service"
        systemctl stop $service
        systemctl disable $service
        rm -f /etc/systemd/system/$service.service
    fi
    
    # Kiểm tra supervisor config
    if [ -f "/etc/supervisor/conf.d/$service.conf" ]; then
        print_status "Xóa supervisor config: $service"
        supervisorctl stop $service 2>/dev/null || true
        rm -f /etc/supervisor/conf.d/$service.conf
    fi
done

# Reload systemd và supervisor
systemctl daemon-reload
supervisorctl reread 2>/dev/null || true
supervisorctl update 2>/dev/null || true

print_header "2. XÓA CÁC THƯ MỤC ỨNG DỤNG CŨ"

print_status "Xóa thư mục ứng dụng cũ..."

# Danh sách thư mục có thể chứa app cũ
APP_DIRS=(
    "/var/www/quanlyladipage"
    "/var/www/landingpage"
    "/var/www/flask-app"
    "/var/www/webapp"
    "/var/www/html/landingpage"
    "/home/*/quanlyladipage"
    "/home/*/landingpage" 
    "/home/*/flask-app"
    "/opt/quanlyladipage"
    "/opt/landingpage"
    "/srv/quanlyladipage"
    "/srv/landingpage"
)

for dir in "${APP_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_status "Xóa thư mục: $dir"
        rm -rf "$dir"
    fi
done

# Xóa thư mục published/uploaded files
print_status "Xử lý thư mục dữ liệu (landingpages, uploads)..."
read -p "Giữ nguyên thư mục landing pages (/var/www/landingpages)? (Y/n): " -n 1 -r keep_lp
echo
if [[ ! $keep_lp =~ ^[Nn]$ ]]; then
    print_warning "Giữ nguyên /var/www/landingpages"
else
    print_status "Xóa /var/www/landingpages"
    rm -rf /var/www/landingpages
fi

read -p "Giữ nguyên thư mục uploads (/var/www/uploads)? (Y/n): " -n 1 -r keep_up
echo
if [[ ! $keep_up =~ ^[Nn]$ ]]; then
    print_warning "Giữ nguyên /var/www/uploads"
else
    print_status "Xóa /var/www/uploads"
    rm -rf /var/www/uploads
fi

print_status "Xóa các thư mục dư thừa nếu có..."
rm -rf /var/www/published
rm -rf /var/www/static

print_header "3. CLEAN NGINX CONFIGURATION"

print_status "Backup và xóa cấu hình Nginx cũ..."

# Backup nginx config hiện tại
if [ -d "/etc/nginx" ]; then
    mkdir -p /root/nginx-backup-$(date +%Y%m%d)
    cp -r /etc/nginx/* /root/nginx-backup-$(date +%Y%m%d)/ 2>/dev/null || true
fi

# Xóa các site config cũ
rm -f /etc/nginx/sites-enabled/*
rm -f /etc/nginx/sites-available/quanlyladipage*
rm -f /etc/nginx/sites-available/landingpage*
rm -f /etc/nginx/sites-available/flask-app*
rm -f /etc/nginx/sites-available/webapp*

# Xóa các cấu hình conf.d tuỳ biến (nếu có)
rm -f /etc/nginx/conf.d/*.conf 2>/dev/null || true

# Khôi phục default nginx config
cat > /etc/nginx/sites-available/default << 'EOF'
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

ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t && systemctl reload nginx || print_warning "Nginx config có vấn đề, sẽ fix sau"

print_header "4. XÓA DATABASE VÀ DATA CŨ"

print_status "Xóa database files cũ..."

# Tìm và xóa các file database
find /var -name "*.db" -type f -exec rm -f {} \; 2>/dev/null || true
find /opt -name "*.db" -type f -exec rm -f {} \; 2>/dev/null || true
find /srv -name "*.db" -type f -exec rm -f {} \; 2>/dev/null || true
find /home -name "landingpages.db" -type f -exec rm -f {} \; 2>/dev/null || true
find /home -name "database.db" -type f -exec rm -f {} \; 2>/dev/null || true

print_status "Xóa logs cũ..."
rm -f /var/log/quanlyladipage*
rm -f /var/log/landingpage*
rm -f /var/log/flask-app*
rm -f /var/log/gunicorn*
rm -f /var/log/uwsgi*

print_status "Tuỳ chọn: Dọn chứng chỉ Let's Encrypt"
read -p "Bạn có muốn backup và xoá chứng chỉ Let's Encrypt không? (y/N): " -n 1 -r purge_le
echo
if [[ $purge_le =~ ^[Yy]$ ]]; then
    LE_BK="/root/letsencrypt-backup-$(date +%Y%m%d)"
    print_status "Backup /etc/letsencrypt → $LE_BK"
    mkdir -p "$LE_BK"
    cp -r /etc/letsencrypt/* "$LE_BK" 2>/dev/null || true
    print_status "Xoá cấu hình và chứng chỉ Let's Encrypt"
    rm -rf /etc/letsencrypt/live/* 2>/dev/null || true
    rm -rf /etc/letsencrypt/renewal/* 2>/dev/null || true
    rm -rf /etc/letsencrypt/archive/* 2>/dev/null || true
fi

print_header "5. DỌN DẸP USER VÀ CRON JOBS"

print_status "Xóa cron jobs cũ..."
rm -f /etc/cron.d/quanlyladipage*
rm -f /etc/cron.d/landingpage*
rm -f /etc/cron.d/flask-app*

print_status "Xóa users không cần thiết..."
# Chỉ xóa user nếu được tạo cho app (không xóa system users)
USERS_TO_CHECK=("appuser" "landinguser" "flaskuser")
for user in "${USERS_TO_CHECK[@]}"; do
    if id "$user" &>/dev/null; then
        read -p "Tìm thấy user '$user'. Xóa không? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            userdel -r "$user" 2>/dev/null || userdel "$user" 2>/dev/null || true
            print_status "Đã xóa user: $user"
        fi
    fi
done

print_header "6. CLEAN PYTHON PACKAGES VÀ VIRTUAL ENVS"

print_status "Dọn dẹp Python packages và virtual environments..."

# Xóa virtual envs trong các thư mục thường gặp
find /var/www -name ".venv" -type d -exec rm -rf {} \; 2>/dev/null || true
find /var/www -name "venv" -type d -exec rm -rf {} \; 2>/dev/null || true
find /opt -name ".venv" -type d -exec rm -rf {} \; 2>/dev/null || true
find /opt -name "venv" -type d -exec rm -rf {} \; 2>/dev/null || true
find /home -name ".venv" -type d -exec rm -rf {} \; 2>/dev/null || true
find /home -name "venv" -type d -exec rm -rf {} \; 2>/dev/null || true

print_status "Xóa __pycache__ folders..."
find /var -name "__pycache__" -type d -exec rm -rf {} \; 2>/dev/null || true
find /opt -name "__pycache__" -type d -exec rm -rf {} \; 2>/dev/null || true
find /srv -name "__pycache__" -type d -exec rm -rf {} \; 2>/dev/null || true

print_status "Tuỳ chọn: gỡ cài đặt các dịch vụ Python web không dùng (gunicorn/uwsgi/supervisor)"
read -p "Purge các package gunicorn, uwsgi, supervisor? (y/N): " -n 1 -r purge_pkgs
echo
if [[ $purge_pkgs =~ ^[Yy]$ ]]; then
    apt purge -y gunicorn uwsgi uwsgi-core supervisor 2>/dev/null || true
fi

print_header "7. SYSTEM CLEANUP"

print_status "Dọn dẹp system packages không cần thiết..."

# Xóa packages không còn cần thiết
apt autoremove -y
apt autoclean

print_status "Dọn dẹp temp files..."
rm -rf /tmp/*
rm -rf /var/tmp/*

print_status "Dọn dẹp logs cũ..."
journalctl --vacuum-time=7d
logrotate -f /etc/logrotate.conf

print_header "8. KIỂM TRA HỆ THỐNG"

print_status "Kiểm tra các service đang chạy..."
systemctl status nginx --no-pager -l || true

print_status "Kiểm tra disk space..."
df -h

print_status "Kiểm tra memory..."
free -h

print_status "Kiểm tra processes liên quan đến Flask/Python..."
ps aux | grep -E "(flask|python|gunicorn|uwsgi)" | grep -v grep || echo "Không có process Flask/Python nào đang chạy"

print_header "9. TẠO BACKUP INFO"

print_status "Tạo thông tin backup..."
cat > /root/cleanup-info-$(date +%Y%m%d).txt << EOF
VPS Cleanup completed at: $(date)
Backup locations:
- Nginx config backup: /root/nginx-backup-$(date +%Y%m%d)/

Items cleaned:
- All Flask/Python applications
- Nginx configurations  
- Supervisor configurations
- Database files
- Uploaded files
- Virtual environments
- Cron jobs
- Temporary files
- System packages

System status after cleanup:
$(df -h)
$(free -h)
EOF

print_header "✅ HOÀN THÀNH CLEANUP"

echo -e "${GREEN}🎉 VPS đã được làm sạch thành công!${NC}"
echo ""
echo -e "${BLUE}Những gì đã được thực hiện:${NC}"
echo "✅ Dừng và xóa tất cả services cũ"
echo "✅ Xóa thư mục ứng dụng cũ" 
echo "✅ Reset cấu hình Nginx về mặc định"
echo "✅ Xóa database và files uploaded cũ"
echo "✅ Dọn dẹp users và cron jobs"
echo "✅ Xóa Python virtual environments cũ"
echo "✅ Dọn dẹp system và logs"
echo ""
echo -e "${YELLOW}Thông tin backup:${NC}"
echo "📁 Nginx config backup: /root/nginx-backup-$(date +%Y%m%d)/"
echo "📄 Cleanup info: /root/cleanup-info-$(date +%Y%m%d).txt"
echo ""
echo -e "${GREEN}🚀 VPS sẵn sàng cho deployment mới!${NC}"
echo ""
echo -e "${BLUE}Bước tiếp theo:${NC}"
echo "1. Tải và chạy script redeploy từ GitHub:"
echo "   wget -O /root/redeploy-vps.sh https://raw.githubusercontent.com/vuthevietgps/quanlyladipage/main/redeploy-vps.sh"
echo "   sudo bash /root/redeploy-vps.sh"
echo "2. Hoặc chạy không tương tác (ví dụ):"
echo "   DOMAIN=example.com PRESERVE_LANDINGPAGES=true sudo -E bash /root/redeploy-vps.sh"
echo "3. (Tuỳ chọn) Bạn vẫn có thể dùng deploy.sh cũ nếu muốn quy trình cũ."
echo ""