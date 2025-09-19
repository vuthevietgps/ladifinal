# 🚀 Quan Ly Landing Page - Hệ Thống Quản Lý Landing Page

Hệ thống quản lý và phục vụ landing pages với wildcard subdomain, tracking injection và quản lý Agent.

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-green.svg)](https://flask.palletsprojects.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](https://getbootstrap.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Tính Năng Chính

- **🏗️ Quản lý Landing Pages**: CRUD hoàn chỉnh với file upload và preview
- **👥 Quản lý Agents**: Phân công nhân viên phụ trách từng landing page  
- **📊 Tracking Integration**: Tự động inject Google Analytics, Facebook Pixel, phone/zalo tracking
- **🌐 Wildcard Subdomain**: Phục vụ `*.yourdomain.com` từ static files
- **📱 Responsive UI**: Giao diện Bootstrap 5 với modal interactions
- **🖼️ Image Management**: Upload, optimize và backup ảnh tự động
- **🔒 Production Ready**: Systemd service, Nginx config, automated backups

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

Truy cập: http://localhost:5000

### Production Deployment
```bash
# Trên VPS Ubuntu:
wget https://raw.githubusercontent.com/vuthevietgps/ladi/main/cleanup-vps.sh
chmod +x cleanup-vps.sh
./cleanup-vps.sh

wget https://raw.githubusercontent.com/vuthevietgps/ladi/main/redeploy-vps.sh
chmod +x redeploy-vps.sh
./redeploy-vps.sh
```

Chi tiết: [HUONG-DAN-DEPLOY.md](HUONG-DAN-DEPLOY.md)

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