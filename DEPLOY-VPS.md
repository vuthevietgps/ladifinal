## 🚀 HƯỚNG DẪN DEPLOY LÊN VPS UBUNTU (CẬP NHẬT 2025)

## 📋 Chuẩn Bị

### VPS Requirements:
- **OS**: Ubuntu 20.04+ hoặc 22.04 LTS (đã test trên Ubuntu 24.04.3 LTS)
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB+) 
- **Storage**: 20GB+ free space
- **Network**: Public IP với port 80, 443, 22 mở
- **Root Access**: Cần quyền sudo/root để cài đặt

### Domain Setup:
1. **Mua domain** (ví dụ: `mydomain.com`)
2. **Cấu hình DNS** tại nhà cung cấp domain (GoDaddy, Namecheap, Cloudflare):
   ```
   Type    Name     Value           TTL
   A       @        YOUR_VPS_IP     300
   A       *        YOUR_VPS_IP     300
   A       admin    YOUR_VPS_IP     300
   ```
   
### ⚠️ QUAN TRỌNG:
- **Chờ DNS propagation**: 5-15 phút sau khi cấu hình DNS
- **Kiểm tra DNS**: `nslookup admin.yourdomain.com` trước khi cài SSL
- **Backup dữ liệu cũ**: Nếu VPS đã có ứng dụng khácOY LÊN VPS UBUNTU

## 📋 Chuẩn Bị

### VPS Requirements:
- **OS**: Ubuntu 20.04+ hoặc 22.04 LTS
- **RAM**: Tối thiểu 1GB (khuyến nghị 2GB+)
- **Storage**: 20GB+ free space
- **Network**: Public IP với port 80, 443 mở

### Domain Setup:
1. **Mua domain** (ví dụ: `mydomain.com`)
2. **Cấu hình DNS** tại nhà cung cấp domain:
   ```
   Type    Name     Value           TTL
   A       @        YOUR_VPS_IP     300
   A       *        YOUR_VPS_IP     300
   A       admin    YOUR_VPS_IP     300
   ```

## 🛠️ Deploy Bước 1: Làm Sạch VPS (Nếu Cần)

⚠️ **CHỈ CHẠY NẾU VPS ĐÃ CÓ ỨNG DỤNG CŨ:**

```bash
# SSH vào VPS
ssh root@YOUR_VPS_IP

# Tải và chạy script cleanup (sẽ hỏi xác nhận)
wget -O /root/cleanup-vps.sh https://raw.githubusercontent.com/vuthevietgps/ladi/main/cleanup-vps.sh
sudo bash /root/cleanup-vps.sh
```

Script sẽ hỏi:
- **Xác nhận cleanup**: Gõ `y` để tiếp tục  
- **Giữ landing pages**: Chọn `Y` nếu muốn backup
- **Giữ uploads**: Chọn `Y` nếu muốn giữ files cũ
- **Backup SSL**: Chọn `y` để backup certificates

## 🛠️ Deploy Bước 2: Deploy Tự Động

### SSH vào VPS và chạy script deploy:
```bash
# Tải script deploy từ GitHub
wget -O /root/redeploy-vps.sh https://raw.githubusercontent.com/vuthevietgps/ladi/main/redeploy-vps.sh

# Chạy script deploy tự động
sudo bash /root/redeploy-vps.sh
```

### Khi script chạy:
1. **Nhập domain chính**: Ví dụ `mydomain.com`
2. **Preserve landing pages**: Chọn `N` cho fresh install, `Y` để giữ
3. **Chờ script cài đặt**: 5-10 phút tùy tốc độ VPS

### ⚠️ LỖI THƯỜNG GẶP VÀ CÁCH FIX:

#### Lỗi "No module named 'app'":
```bash
# Di chuyển vào thư mục app
cd /var/www/quanlyladipage

# Kiểm tra cấu trúc - đảm bảo có app/ folder
ls -la

# Nếu code trong thư mục .tmp, di chuyển ra:
mv quanlyladipage.tmp/* .
mv quanlyladipage.tmp/.* . 2>/dev/null || true
rmdir quanlyladipage.tmp

# Cài dependencies và khởi tạo DB
source venv/bin/activate
pip install -r requirements.txt
python -c "from app import create_app; from app.db import init_db; app = create_app(); init_db(app); print('✅ Database OK!')"

# Fix permissions
sudo chown -R www-data:www-data /var/www/quanlyladipage
sudo chmod 664 /var/www/quanlyladipage/database.db

# Restart service
sudo systemctl restart quanlyladipage
```

## 🔧 Bước 4: Cấu Hình Nginx (Fix Routing)

Script có thể tạo Nginx config chưa hoàn hảo. Cập nhật config đúng:

```bash
sudo tee /etc/nginx/sites-available/quanlyladipage > /dev/null << 'EOF'
# Domain chính - Trang công ty
server {
    listen 80;
    server_name mydomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name mydomain.com;
    
    ssl_certificate /etc/letsencrypt/live/mydomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mydomain.com/privkey.pem;

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
    server_name admin.mydomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name admin.mydomain.com;
    
    ssl_certificate /etc/letsencrypt/live/admin.mydomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.mydomain.com/privkey.pem;

    # Auto-redirect to admin panel
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

# Wildcard subdomains cho landing pages
server {
    listen 80;
    server_name *.mydomain.com;
    
    # Loại trừ domain chính và admin
    if ($host = mydomain.com) { return 404; }
    if ($host = admin.mydomain.com) { return 404; }

    root /var/www/landingpages;
    index index.html;

    location / {
        set $subdomain "";
        if ($host ~* "^([^.]+)\.mydomain\.com$") { 
            set $subdomain $1; 
        }
        try_files /$subdomain/index.html @fallback;
    }

    location @fallback { 
        return 404 "Landing page không tồn tại"; 
    }
}
EOF

# Thay mydomain.com bằng domain thực của bạn
sudo sed -i 's/mydomain.com/yourdomain.com/g' /etc/nginx/sites-available/quanlyladipage

# Test và reload
sudo nginx -t && sudo systemctl reload nginx
```

## 🔒 Bước 3: Cài SSL Certificate (HTTPS)

⚠️ **QUAN TRỌNG**: Chờ DNS propagate 5-15 phút trước khi chạy

### Cài SSL cho Admin Panel trước:
```bash
# Cài Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx

# Tạo certificate cho admin subdomain
sudo certbot --nginx -d admin.mydomain.com
```

### Cài SSL cho Domain chính:
```bash
# Tạo certificate cho domain chính
sudo certbot --nginx -d mydomain.com
```

### ⚠️ LỖI SSL THƯỜNG GẶP:

#### Lỗi "Domain redundant with wildcard":
```bash
# ĐÚNG: Cài riêng từng domain
sudo certbot --nginx -d admin.mydomain.com
sudo certbot --nginx -d mydomain.com

# SAI: Không được cài wildcard + subdomain cùng lúc
# sudo certbot --nginx -d admin.mydomain.com -d "*.mydomain.com"
```

#### Lỗi DNS không resolve:
```bash
# Kiểm tra DNS trước khi cài SSL
nslookup admin.mydomain.com
nslookup mydomain.com

# Nếu không resolve → Chờ thêm hoặc check DNS config
```

## ✅ Bước 5: Kiểm Tra Hoạt Động

### 1. Kiểm tra services:
```bash
sudo systemctl status quanlyladipage    # Flask app
sudo systemctl status nginx             # Web server

# Xem logs nếu có lỗi
sudo journalctl -u quanlyladipage -f --lines=20
```

### 2. Test endpoints:
```bash
# Test HTTP responses
curl -I https://mydomain.com              # Trang công ty
curl -I https://admin.mydomain.com        # Admin panel (auto-redirect)
curl -I http://test.mydomain.com          # Test landing page (404 là bình thường)
```

### 3. Truy cập web:
- **Trang chủ**: `https://mydomain.com` → Hiển thị trang company marketing
- **Admin panel**: `https://admin.mydomain.com` → Tự động chuyển về login
- **Login**: Username `admin`, Password `admin123`

### 4. Test tạo landing page:
1. Đăng nhập admin panel
2. Click **"Thêm mới"** 
3. Điền thông tin:
   ```
   Subdomain: test123
   Agent: [chọn hoặc tạo agent]
   File HTML: Upload file HTML của bạn
   ```
4. Save và truy cập: `https://test123.mydomain.com`

### ⚠️ LỖI THƯỜNG GẶP:

#### Browser cache redirect cũ:
```bash
# Fix: Xóa browser cache hoặc test bằng:
# - Incognito mode
# - Ctrl+Shift+R (hard refresh)  
# - Máy/browser khác
```

#### Landing page không load:
```bash
# Kiểm tra thư mục và permissions
ls -la /var/www/landingpages/
sudo chown -R www-data:www-data /var/www/landingpages/
sudo chmod -R 755 /var/www/landingpages/
```

## 🖼️ Bước 5: Upload Images cho Landing Pages

### Sử dụng script có sẵn:
```bash
# Upload ảnh từ local lên server
scp *.jpg *.png user@YOUR_VPS_IP:/tmp/

# SSH vào server và di chuyển ảnh
ssh user@YOUR_VPS_IP
sudo bash /var/www/quanlyladipage/images.sh upload test123 /tmp/
```

### Hoặc upload qua FTP/SFTP:
```bash
# Upload vào thư mục tương ứng
/var/www/landingpages/subdomain/images/
```

## 🔍 Troubleshooting

### Landing page không load:
```bash
# Kiểm tra DNS
nslookup test123.mydomain.com

# Kiểm tra Nginx config
sudo nginx -t
sudo systemctl status nginx

# Kiểm tra file tồn tại
ls -la /var/www/landingpages/test123/
```

### Flask app không chạy:
```bash
# Xem logs
sudo journalctl -u quanlyladipage -f

# Restart service
sudo systemctl restart quanlyladipage

# Test thủ công
cd /var/www/quanlyladipage
source venv/bin/activate
python main.py
```

### Images không hiển thị:
```bash
# Kiểm tra quyền thư mục
ls -la /var/www/landingpages/subdomain/images/

# Fix quyền nếu cần
sudo chown -R www-data:www-data /var/www/landingpages/
sudo chmod -R 755 /var/www/landingpages/
```

## 📊 Monitoring

### Kiểm tra logs:
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Flask app logs  
sudo journalctl -u quanlyladipage -f

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Health check:
```bash
curl -I https://admin.mydomain.com          # Admin panel
curl -I https://test123.mydomain.com        # Landing page
```

## 🆘 Support

Nếu gặp vấn đề:

1. **Kiểm tra logs** theo hướng dẫn trên
2. **Tạo issue** tại: https://github.com/vuthevietgps/quanlyladipage/issues
3. **Cung cấp thông tin**:
   - OS version: `lsb_release -a`
   - Error logs
   - Steps đã làm

## 🎉 Hoàn Thành!

Bạn đã có hệ thống quản lý landing page hoàn chỉnh:

- ✅ **Admin Panel**: `https://admin.mydomain.com`
- ✅ **Wildcard Subdomain**: `https://anything.mydomain.com`
- ✅ **Tracking Integration**: Google Analytics, Phone, Zalo
- ✅ **Image Management**: Upload và optimize tự động
- ✅ **Auto Backup**: Database và files
- ✅ **SSL Certificate**: HTTPS secure

**Chúc mừng bạn đã deploy thành công!** 🚀

## 🔄 (Mới) Làm sạch sâu và triển khai lại từ GitHub

Nếu VPS của bạn đã có ứng dụng cũ, hãy dùng các bước sau để dọn dẹp sâu và triển khai lại từ repo GitHub mới:

### 1) Làm sạch sâu VPS

Chạy script dọn sâu (sẽ hỏi có giữ dữ liệu landingpages/uploads hay không, và có backup rồi xoá SSL hay không):

```bash
wget -O /root/cleanup-vps.sh https://raw.githubusercontent.com/vuthevietgps/quanlyladipage/main/cleanup-vps.sh
sudo bash /root/cleanup-vps.sh
```

### 2) Triển khai lại từ GitHub mới

Script triển khai 1 bước: cài gói cần thiết, clone repo, tạo venv, cài requirements, khởi tạo DB, tạo service systemd, cấu hình Nginx admin + wildcard, mở firewall và khởi động.

Chạy tương tác (sẽ hỏi DOMAIN và có giữ landingpages hay không):

```bash
wget -O /root/redeploy-vps.sh https://raw.githubusercontent.com/vuthevietgps/quanlyladipage/main/redeploy-vps.sh
sudo bash /root/redeploy-vps.sh
```

Hoặc chạy không cần hỏi (ví dụ):

```bash
DOMAIN=example.com \
BRANCH=main \
REPO_URL=https://github.com/vuthevietgps/ladi.git \
PRESERVE_LANDINGPAGES=true \
sudo -E bash /root/redeploy-vps.sh
```

Sau khi hoàn tất:

- Trỏ DNS: `@`, `*`, `admin` → IP VPS
- Mở admin: `http://admin.example.com`
- Cài SSL (khuyến nghị):

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d admin.example.com -d "*.example.com"
```

Ghi chú: `redeploy-vps.sh` cho phép ghi đè bằng biến môi trường: `APP_NAME`, `APP_DIR`, `PUBLISHED_DIR`, `UPLOADS_DIR`, `SERVICE_NAME`, `PY_BIN`… để tùy biến đường dẫn và tên dịch vụ.