# 🚀 Landing Page Manager - Hệ Thống Quản Lý Landing Page

Hệ thống quản lý và phục vụ landing pages với folder upload, tracking injection và quản lý Agent.

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-green.svg)](https://flask.palletsprojects.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](https://getbootstrap.com)

## 🎯 Tính Năng Chính

- **📁 Folder Upload**: Upload toàn bộ website dưới dạng ZIP folder hoàn chỉnh
- **👥 Quản lý Agents**: Phân công nhân viên phụ trách từng landing page  
- **📊 Tracking Integration**: Tự động inject Google Analytics, phone/zalo/form tracking
- **🌐 Landing Page Serving**: Phục vụ landing pages qua `/landing/{subdomain}`
- **📱 Responsive UI**: Giao diện Bootstrap 5 với loading animations
- **� Auto ZIP Processing**: Tự động phát hiện và sửa cấu trúc ZIP không chuẩn
- **🔒 Authentication**: Flask-Login với admin panel bảo mật

## 🏁 Quick Start

### Development
```bash
git clone https://github.com/vuthevietgps/ladi.git
cd ladi
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
```

Truy cập: http://localhost:5000/admin-panel-xyz123/

Truy cập: http://localhost:5000

### Production Deployment

#### 🚀 **Ultimate Deployment (Recommended)**
```bash
# Trên VPS Ubuntu - Complete deployment with error handling
wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/cleanup-vps-ultimate.sh
chmod +x cleanup-vps-ultimate.sh
./cleanup-vps-ultimate.sh

wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/deploy-vps-ultimate.sh
chmod +x deploy-vps-ultimate.sh  
./deploy-vps-ultimate.sh
```

#### ⚡ **Quick Deployment (Fast)**
```bash
# One-command deployment for experienced users
wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/quick-deploy.sh
chmod +x quick-deploy.sh
./quick-deploy.sh
```

#### 🔍 **Health Monitoring**
```bash
# Monitor system health after deployment
wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/health-check.sh
chmod +x health-check.sh
./health-check.sh
```

#### 📋 **What Scripts Do:**
- **Cleanup**: Deep VPS cleaning, remove conflicts, install dependencies
- **Deploy**: Clone repo, setup Python env, configure services, test everything
- **Monitor**: Check services, HTTP responses, performance, logs
- **Error Handling**: Comprehensive checks and fallback methods at every step
- **Production Ready**: Nginx + Gunicorn + Systemd + Security headers

#### 🎯 **Deployment Results:**
- **Access URL**: http://YOUR-SERVER-IP
- **Admin Panel**: http://YOUR-SERVER-IP/admin-panel-xyz123
- **Default Login**: admin / admin123
- **Services**: Automatic startup, restart on failure
- **Performance**: Production optimized with caching

## 📋 API Endpoints

### Landing Pages
```
GET    /api/landingpages              # Danh sách landing pages
POST   /api/landingpages              # Tạo mới (với file upload)
PUT    /api/landingpages/{id}         # Cập nhật
PATCH  /api/landingpages/{id}/status  # Pause/Resume
DELETE /api/landingpages/{id}         # Xóa
```

### Agents
```
GET    /api/agents                    # Danh sách agents
POST   /api/agents                    # Tạo agent
PUT    /api/agents/{id}               # Cập nhật
DELETE /api/agents/{id}               # Xóa
```

## 🗄️ Database Schema

```sql
-- Landing Pages
CREATE TABLE landing_pages (
    id INTEGER PRIMARY KEY,
    subdomain TEXT UNIQUE NOT NULL,
    agent TEXT,
    global_site_tag TEXT,           -- Google Analytics/Facebook Pixel
    phone_tracking TEXT,            -- Số điện thoại tracking
    zalo_tracking TEXT,             -- Zalo tracking  
    form_tracking TEXT,             -- Form submission tracking
    hotline_phone TEXT,             -- Hotline chính
    zalo_phone TEXT,                -- Zalo phụ
    google_form_link TEXT,          -- Google Form URL
    status TEXT DEFAULT 'active',   -- active/paused
    original_filename TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Agents
CREATE TABLE agents (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Landing Page Template

### Cấu trúc chuẩn:
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <!-- HỆ THỐNG TỰ ĐỘNG INJECT GLOBAL SITE TAG VÀO ĐÂY -->
</head>
<body>
    <!-- Nội dung landing page -->
    
    <script>
        // Sử dụng tracking variables
        if (window.PHONE_TRACKING) {
            document.querySelectorAll('.phone-link').forEach(el => {
                el.href = 'tel:' + window.PHONE_TRACKING;
            });
        }
        
        if (window.ZALO_TRACKING) {
            // Zalo integration logic
        }
    </script>
    
    <!-- HỆ THỐNG TỰ ĐỘNG INJECT TRACKING CODES VÀO ĐÂY -->
</body>
</html>
```

### Sample Templates:
- [published/vongtay-shopee/](published/vongtay-shopee/) - Landing page bán vòng tay (mẫu)

## 🖼️ Image Management

Images được lưu trong thư mục `published/{subdomain}/` cùng với `index.html`. 

Hệ thống hỗ trợ:
- ✅ Upload ảnh qua admin panel
- ✅ Tự động backup ảnh khi cập nhật
- ✅ Serve static files qua Nginx
- ✅ Tối ưu performance với CDN

## 🚀 Production Architecture

```
VPS Ubuntu Server
├── Nginx (Port 80/443)
│   ├── admin.yourdomain.com → Flask App (Port 5000)
│   └── *.yourdomain.com → Static Files (/var/www/landingpages/)
├── Flask App (Port 5000) 
│   ├── Admin Panel
│   ├── API Endpoints
│   └── File Processing
└── SQLite Database
    ├── landing_pages table
    └── agents table
```

## 📊 Testing Results

✅ **100% API Coverage**: Tất cả endpoints đã test và hoạt động  
✅ **CRUD Operations**: Create, Read, Update, Delete cho cả Landing Pages và Agents  
✅ **File Upload**: HTML upload với validation và error handling  
✅ **Tracking Injection**: Tự động inject tracking codes vào đúng vị trí  
✅ **Wildcard Serving**: `*.domain.com` serve static files thành công  
✅ **UI/UX**: Bootstrap responsive, modal interactions, form validation  
✅ **Error Handling**: HTTP status codes chuẩn, validation messages  

## 📖 Documentation

- [quytac.md](quytac.md) - Quy tắc hệ thống và phát triển
- [quytactaoindex.md](quytactaoindex.md) - Hướng dẫn tạo landing page
- [HUONG-DAN-LAM-HOMEPAGE.md](HUONG-DAN-LAM-HOMEPAGE.md) - Kinh nghiệm & hướng dẫn làm trang chủ (homepage)
- [HUONG-DAN-DEPLOY.md](HUONG-DAN-DEPLOY.md) - Hướng dẫn deploy production chi tiết
- [cleanup-vps.sh](cleanup-vps.sh) - Script làm sạch VPS  
- [redeploy-vps.sh](redeploy-vps.sh) - Script deploy tự động

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- **GitHub Issues**: [Create Issue](https://github.com/vuthevietgps/ladi/issues)
- **Email**: support@yourdomain.com

---

**Phát triển bởi**: [vuthevietgps](https://github.com/vuthevietgps)  
**Version**: 1.0.0  
**Last Updated**: September 2025