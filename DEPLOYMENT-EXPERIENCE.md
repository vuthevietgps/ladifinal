# 📚 KINH NGHIỆM DEPLOY THỰC TẾ (September 2025)

Tài liệu này ghi lại những kinh nghiệm deploy thực tế từ dự án **htxbachgia.shop**, bao gồm các lỗi đã gặp và cách fix.

## 🎯 TỔNG QUAN DEPLOYMENT

**Thời gian deploy**: ~20-30 phút (bao gồm troubleshooting)  
**VPS test**: Ubuntu 24.04.3 LTS, 4GB RAM, 40GB SSD  
**Domain test**: htxbachgia.shop  
**Kết quả**: ✅ Thành công hoàn toàn  

## 🚨 CÁC LỖI ĐÃ GẶP VÀ CÁCH FIX

### 1. **Script Clone Repository vào Thư mục Sai**
**Lỗi**: Code được clone vào `quanlyladipage.tmp/` thay vì thư mục gốc  
**Triệu chứng**: `No module named 'app'` khi khởi tạo database  
**Root cause**: Logic `mv` trong script chưa đúng  

**Fix**:
```bash
cd /var/www/quanlyladipage
mv quanlyladipage.tmp/* .
mv quanlyladipage.tmp/.* . 2>/dev/null || true  
rmdir quanlyladipage.tmp
```

**Cập nhật script**: Đã fix logic clone trong `redeploy-vps.sh`

### 2. **Database Initialization Failed**  
**Lỗi**: `TypeError: init_db() missing 1 required positional argument: 'app'`  
**Root cause**: Function signature không đúng trong database init  

**Fix**:
```bash
# Thay vì: init_db()
python -c "from app import create_app; from app.db import init_db; app = create_app(); init_db(app)"
```

**Cập nhật script**: Đã fix error handling trong database init

### 3. **SSL Certificate Conflict**
**Lỗi**: `Domain name "admin.domain.com" is redundant with a wildcard domain`  
**Root cause**: Không thể cài cả `admin.domain.com` và `*.domain.com` cùng lúc  

**Fix**:
```bash
# Cài riêng từng domain
sudo certbot --nginx -d admin.mydomain.com
sudo certbot --nginx -d mydomain.com

# KHÔNG làm thế này:
# sudo certbot --nginx -d admin.mydomain.com -d "*.mydomain.com"
```

### 4. **Nginx Routing Wrong**
**Lỗi**: Admin panel hiển thị trang công ty thay vì admin interface  
**Root cause**: Admin panel có URL đặc biệt `/admin-panel-xyz123/` nhưng Nginx proxy tất cả requests về root  

**Fix**: Cấu hình Nginx redirect tự động:
```nginx
# Admin panel auto-redirect
location = / {
    return 301 https://$server_name/admin-panel-xyz123/;
}
```

### 5. **Browser Cache Redirect**
**Lỗi**: Sau khi fix config, domain chính vẫn redirect về admin  
**Root cause**: Browser cache redirect 301 cũ  

**Fix**:
- Hard refresh: `Ctrl + Shift + R`  
- Incognito mode  
- Test bằng browser/máy khác  

## 📋 CHECKLIST DEPLOYMENT

### Pre-deployment:
- [ ] VPS sẵn sàng (Ubuntu 20.04+, 2GB+ RAM)
- [ ] Domain đã mua và có quyền cấu hình DNS  
- [ ] DNS records đã cấu hình (`@`, `*`, `admin`)
- [ ] SSH access với quyền root/sudo

### Deployment steps:
- [ ] Chạy cleanup script (nếu VPS có ứng dụng cũ)
- [ ] Chạy deploy script (`redeploy-vps.sh`)
- [ ] Fix lỗi cấu trúc thư mục (nếu có)
- [ ] Kiểm tra Flask app chạy (`systemctl status quanlyladipage`)
- [ ] Chờ DNS propagate (5-15 phút)
- [ ] Cài SSL certificates (admin trước, sau đó domain chính)
- [ ] Update Nginx config với routing đúng
- [ ] Test endpoints và clear browser cache

### Post-deployment verification:
- [ ] `https://domain.com` → Company homepage
- [ ] `https://admin.domain.com` → Admin panel login  
- [ ] `https://admin.domain.com/admin-panel-xyz123/` → Admin dashboard
- [ ] `http://test.domain.com` → 404 (bình thường, chưa có landing page)
- [ ] Login admin panel: `admin/admin123`
- [ ] Tạo test landing page và verify

## 🔧 TOOLS & COMMANDS HỮU ÍCH

### Debug Flask app:
```bash
# Xem logs realtime
sudo journalctl -u quanlyladipage -f --lines=50

# Restart Flask service
sudo systemctl restart quanlyladipage  

# Test Flask manual (for debugging)
cd /var/www/quanlyladipage
source venv/bin/activate
python main.py
```

### Debug Nginx:
```bash
# Test config syntax
sudo nginx -t

# Reload config
sudo systemctl reload nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### Debug DNS:
```bash
# Check DNS resolution
nslookup admin.mydomain.com
nslookup mydomain.com

# Check from different DNS servers
nslookup admin.mydomain.com 8.8.8.8
```

### Debug SSL:
```bash
# List certificates
sudo certbot certificates

# Check certificate details
openssl x509 -in /etc/letsencrypt/live/domain.com/fullchain.pem -text -noout

# Test SSL connection  
openssl s_client -connect admin.mydomain.com:443 -servername admin.mydomain.com
```

## 📈 PERFORMANCE NOTES

**Startup time**: Flask app khởi động ~3-5 giây  
**Memory usage**: ~50-100MB cho Flask app  
**Database**: SQLite, < 1MB khi mới tạo  
**SSL renewal**: Tự động sau 90 ngày  

## 🔮 IMPROVEMENTS FOR FUTURE

1. **Script enhancements**:
   - Better error handling cho database init
   - Auto-detect và fix directory structure issues
   - Integrated SSL setup trong deploy script

2. **Documentation**:
   - Video walkthrough cho beginners
   - Docker version cho local development  
   - Automated backup scripts

3. **Monitoring**:
   - Health check endpoints
   - Log rotation setup
   - Basic monitoring dashboard

---

**Tài liệu này được cập nhật**: September 19, 2025  
**Tested trên**: Ubuntu 24.04.3 LTS  
**Status**: ✅ Production Ready