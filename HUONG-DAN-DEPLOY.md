# HƯỚNG DẪN DEPLOY HỆ THỐNG QUẢN LÝ LANDING PAGE (CẬP NHẬT 2025)

## 🚀 QUICK START - DEPLOY TỰ ĐỘNG

### Yêu cầu VPS
- **OS**: Ubuntu 20.04+ hoặc 22.04+ LTS (đã test Ubuntu 24.04.3 LTS ✅)
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB+)
- **Storage**: 20GB+ free space
- **Network**: Public IP với port 80, 443, 22 mở
- **Domain**: Có wildcard DNS (*.yourdomain.com) 
- **Root access**: Quyền sudo để cài đặt packages

### ⚠️ QUAN TRỌNG TRƯỚC KHI BẮt ĐẦU:
1. **Cấu hình DNS**: Trỏ `@`, `*`, `admin` về IP VPS
2. **Chờ DNS propagate**: 5-15 phút sau khi cấu hình
3. **Backup dữ liệu cũ**: Nếu VPS đã có ứng dụng khác

### Bước 1: Clean VPS (nếu cần)

⚠️ **CHỈ CHẠY NẾU VPS ĐÃ CÓ ỨNG DỤNG CŨ:**

```bash
# SSH vào VPS với quyền root
ssh root@YOUR_VPS_IP

# Tải và chạy script cleanup sâu
wget -O /root/cleanup-vps.sh https://raw.githubusercontent.com/vuthevietgps/ladi/main/cleanup-vps.sh
sudo bash /root/cleanup-vps.sh
```

### Bước 2: Deploy tự động từ GitHub

```bash
# Tải và chạy script deploy tự động  
wget -O /root/redeploy-vps.sh https://raw.githubusercontent.com/vuthevietgps/ladi/main/redeploy-vps.sh
sudo bash /root/redeploy-vps.sh
```

Script sẽ hỏi:
- **Domain chính**: Ví dụ `mydomain.com` 
- **Giữ landing pages cũ**: Chọn `Y` nếu muốn giữ, `N` để fresh start

### Bước 3: Fix lỗi thường gặp (nếu có)

#### Nếu gặp lỗi "No module named 'app'":
```bash
cd /var/www/quanlyladipage

# Kiểm tra cấu trúc - nếu code trong .tmp thì di chuyển:
ls -la
mv quanlyladipage.tmp/* . 2>/dev/null || true
mv quanlyladipage.tmp/.* . 2>/dev/null || true
rmdir quanlyladipage.tmp 2>/dev/null || true

# Setup lại environment
source venv/bin/activate
pip install -r requirements.txt
python -c "from app import create_app; from app.db import init_db; app = create_app(); init_db(app); print('✅ DB OK!')"

# Fix permissions và restart
sudo chown -R www-data:www-data /var/www/quanlyladipage
sudo chmod 664 /var/www/quanlyladipage/database.db
sudo systemctl restart quanlyladipage
```

### Bước 4: Cài SSL Certificate

⚠️ **Chờ DNS propagate 5-15 phút trước khi chạy**

```bash
# Cài certbot
sudo apt install -y certbot python3-certbot-nginx

# Cài SSL cho admin trước (dễ hơn)
sudo certbot --nginx -d admin.yourdomain.com

# Sau đó cài SSL cho domain chính  
sudo certbot --nginx -d yourdomain.com
```

**Lỗi thường gặp:**
- **Domain redundant**: KHÔNG được cài `admin.domain.com` và `*.domain.com` cùng lúc
- **DNS not resolve**: Chờ thêm hoặc check DNS config

### Bước 5: Cấu hình Nginx routing (quan trọng)

Script có thể tạo Nginx config chưa đúng. Fix bằng cách thay thế:

```bash
sudo tee /etc/nginx/sites-available/quanlyladipage > /dev/null << 'EOF'
# Domain chính - Trang công ty
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /static/ {
        alias /var/www/quanlyladipage/static/;
        expires 30d;
    }
}

# Admin panel  
server {
    listen 80;
    server_name admin.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name admin.yourdomain.com;
    ssl_certificate /etc/letsencrypt/live/admin.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.yourdomain.com/privkey.pem;

    location = / {
        return 301 https://$server_name/admin-panel-xyz123/;
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /static/ {
        alias /var/www/quanlyladipage/static/;
        expires 30d;
    }
}

# Wildcard subdomains
server {
    listen 80;
    server_name *.yourdomain.com;
    if ($host = yourdomain.com) { return 404; }
    if ($host = admin.yourdomain.com) { return 404; }

    root /var/www/landingpages;
    index index.html;

    location / {
        set $subdomain "";
        if ($host ~* "^([^.]+)\.yourdomain\.com$") { 
            set $subdomain $1; 
        }
        try_files /$subdomain/index.html @fallback;
    }

    location @fallback { 
        return 404 "Landing page không tồn tại"; 
    }
}
EOF

# Thay yourdomain.com bằng domain thực
sudo sed -i 's/yourdomain.com/mydomain.com/g' /etc/nginx/sites-available/quanlyladipage

# Test và reload
sudo nginx -t && sudo systemctl reload nginx
```

## 📋 VERIFY DEPLOYMENT

Kiểm tra hệ thống hoạt động:

```bash
# Kiểm tra services
sudo systemctl status quanlyladipage
sudo systemctl status nginx

# Kiểm tra logs
sudo journalctl -u quanlyladipage -f

# Test endpoints
curl -I http://admin.yourdomain.com
curl -I http://test.yourdomain.com
```

**Kết quả mong đợi:**
- ✅ Admin Panel: `http://admin.yourdomain.com`
- ✅ Landing test: `http://anything.yourdomain.com` 
- ✅ SSL: `https://admin.yourdomain.com`

## 🛠️ DEPLOY THỦ CÔNG (Nâng cao)

Nếu cần tùy biến hoặc script tự động thất bại:

### 1. Cài đặt dependencies
```bash
apt update && apt upgrade -y
apt install -y nginx git sqlite3 python3 python3-venv python3-pip ufw curl
```

### 2. Clone source code
```bash
cd /var/www
git clone https://github.com/vuthevietgps/ladi.git quanlyladipage
cd quanlyladipage
```

### 3. Setup Python environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Cấu hình .env
```bash
cp .env.example .env
nano .env
# Chỉnh sửa:
# DOMAIN=yourdomain.com
# SECRET_KEY=your-secret-key
```

### 5. Khởi tạo database
```bash
python -c "
from app import create_app
from app.db import init_db
app = create_app()
init_db(app)
print('Database initialized!')
"
```

### 6. Tạo systemd service
```bash
cat > /etc/systemd/system/quanlyladipage.service << 'EOF'
[Unit]
Description=Quan Ly Landing Page Flask App
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/quanlyladipage
Environment="PATH=/var/www/quanlyladipage/venv/bin"
Environment="FLASK_APP=main.py"
Environment="FLASK_ENV=production"
ExecStart=/var/www/quanlyladipage/venv/bin/python main.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable quanlyladipage
systemctl start quanlyladipage
```

### 7. Cấu hình Nginx
```bash
cat > /etc/nginx/sites-available/quanlyladipage << 'EOF'
# Admin panel
server {
    listen 80;
    server_name admin.YOURDOMAIN.COM;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/quanlyladipage/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# Wildcard subdomains
server {
    listen 80;
    server_name *.YOURDOMAIN.COM;
    root /var/www/landingpages;
    index index.html;

    location / {
        set $subdomain "";
        if ($host ~* "^([^.]+)\.YOURDOMAIN\.COM$") { set $subdomain $1; }
        try_files /$subdomain/index.html /$subdomain/index.html @fallback;
    }

    location ~* ^/([^/]+)/images/(.+\.(jpg|jpeg|png|gif|svg|webp|ico))$ {
        alias /var/www/landingpages/$1/images/$2;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    location @fallback { return 404 "Landing page không tồn tại"; }

    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
EOF

# Thay YOURDOMAIN.COM bằng domain thực
sed -i 's/YOURDOMAIN.COM/yourdomain.com/g' /etc/nginx/sites-available/quanlyladipage

# Kích hoạt
ln -sf /etc/nginx/sites-available/quanlyladipage /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

### 8. Cài đặt permissions
```bash
mkdir -p /var/www/landingpages /var/www/uploads
chown -R www-data:www-data /var/www/quanlyladipage
chown -R www-data:www-data /var/www/landingpages
chown -R www-data:www-data /var/www/uploads
chmod -R 755 /var/www/landingpages
chmod -R 755 /var/www/uploads
chmod 664 /var/www/quanlyladipage/database.db
```

### 9. Cấu hình firewall
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

## 🔧 TROUBLESHOOTING

### Landing page không load
```bash
# Kiểm tra DNS
nslookup test.yourdomain.com

# Kiểm tra Nginx config
sudo nginx -t
sudo systemctl status nginx

# Kiểm tra file tồn tại
ls -la /var/www/landingpages/test/
```

### Flask app không chạy
```bash
# Xem logs
sudo journalctl -u quanlyladipage -f

# Restart service
sudo systemctl restart quanlyladipage

# Test manual
cd /var/www/quanlyladipage
source venv/bin/activate
python main.py
```

### Database permission denied
```bash
sudo chown www-data:www-data /var/www/quanlyladipage/database.db
sudo chmod 664 /var/www/quanlyladipage/database.db
```

### SSL không hoạt động
```bash
# Kiểm tra DNS trước
nslookup admin.yourdomain.com

# Chạy lại certbot
sudo certbot renew --dry-run
sudo certbot --nginx -d admin.yourdomain.com -d "*.yourdomain.com"
```

## 📊 MONITORING & MAINTENANCE

### Health checks
```bash
# Services status
systemctl is-active quanlyladipage nginx

# Resource usage
free -h
df -h

# Logs
tail -f /var/log/nginx/access.log
sudo journalctl -u quanlyladipage -f
```

### Backup
```bash
# Database backup
cp /var/www/quanlyladipage/database.db /var/backups/backup-$(date +%Y%m%d).db

# Landing pages backup
tar -czf /var/backups/landingpages-$(date +%Y%m%d).tar.gz /var/www/landingpages/
```

### Updates
```bash
# Update system
apt update && apt upgrade -y

# Update app code
cd /var/www/quanlyladipage
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart quanlyladipage
```

## 🆘 SUPPORT & ISSUES

### Common deployment issues:
1. **DNS chưa propagate** → Chờ 5-15 phút
2. **Port 5000 blocked** → Mở firewall hoặc dùng Nginx proxy
3. **Database permission** → Fix ownership và chmod
4. **Module not found** → Kiểm tra venv và requirements.txt
5. **Nginx config error** → Kiểm tra syntax với `nginx -t`

### Liên hệ support:
- **GitHub Issues**: https://github.com/vuthevietgps/ladi/issues
- **Documentation**: Xem file `quytac.md` và `quytactaoindex.md`

---
**Cập nhật lần cuối**: September 2025  
**Tested trên**: Ubuntu 24.04.3 LTS, Nginx 1.24.0, Python 3.12