# 🚀 Landing Page Manager - Modular Architecture

## ✨ Tính năng mới (Oct 2025)

- 🏗️ **Modular Architecture**: Code được tách thành 6 modules độc lập
- 📦 **Tối ưu Package**: Chỉ 45.52KB (giảm 99.8% từ 25MB)
- 🔧 **Maintainable**: Dễ bảo trì và mở rộng tính năng
- 🚀 **Production Ready**: Đã test kỹ lưỡng với Docker

## Cách 1: Chạy trực tiếp với Python (Development)

### Bước 1: Cài đặt môi trường
```powershell
# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
.\venv\Scripts\Activate.ps1

# Cài đặt dependencies
pip install -r requirements.txt
```

### Bước 2: Chạy ứng dụng
```powershell
cd ladifinal
python main.py
```

Truy cập: http://localhost:5000

**Lưu ý**: App hiện dùng `main.py` với modular architecture!

---

## Cách 2: Chạy với Docker (Production-ready)

### Bước 1: Khởi động Docker Desktop
- Mở Docker Desktop trên Windows
- Đợi Docker khởi động hoàn tất

### Bước 2: Build và chạy container
```powershell
# Khuyến nghị: Dùng docker-compose (đã tối ưu)
docker-compose up --build -d

# Hoặc build manual
docker build -t ladifinal:latest .
docker run -p 5001:5000 --name ladifinal-app ladifinal:latest
```

**Port mới**: 5001 (tránh conflict với services khác)

### Bước 3: Kiểm tra
```powershell
# Kiểm tra health check (API mới)
Invoke-WebRequest -Uri "http://localhost:5001/health" -UseBasicParsing

# Kiểm tra trang chủ
curl http://localhost:5000/
```

Truy cập: http://localhost:5001

---

## 🎯 Demo & Testing

Sau khi chạy thành công:
- **Homepage**: http://localhost:5001
- **Admin Panel**: http://localhost:5001/admin-panel-xyz123/
- **Health Check**: http://localhost:5001/health
- **API**: http://localhost:5001/api/landing-pages

Đây là landing page bán quần áo đồng phục đã được tạo sẵn theo yêu cầu!

---

## 🔧 Tính năng chính (Modular)

### 🏗️ Architecture Modules:
1. **homepage_routes**: Quản lý company homepage
2. **landing_routes**: Upload ZIP, CRUD landing pages, API
3. **auth_routes**: Đăng nhập, admin panel, security
4. **agents_routes**: Quản lý đại lý và tracking
5. **health_routes**: System health monitoring
6. **file_handler**: ZIP processing, validation

### 🎯 Core Features:
- ✅ **ZIP Upload System**: Drag & drop landing pages
- ✅ **RESTful API**: Complete CRUD operations
- ✅ **Auto Tracking**: Google Analytics, phone codes
- ✅ **Multi-tenant**: Support multiple domains
- ✅ **Health Monitoring**: Real-time system status

---

## 🚨 Lưu ý quan trọng

### Đăng nhập Admin Panel
- **URL**: http://localhost:5001/admin-panel-xyz123/
- **Username**: admin
- **Password**: admin123
- **Features**: Upload, manage, monitor landing pages

### Cấu trúc Modular mới
```
ladifinal/
├── app/
│   ├── routes/              # 🆕 6 Modular Blueprints
│   │   ├── homepage_routes.py
│   │   ├── landing_routes.py
│   │   ├── auth_routes.py
│   │   ├── agents_routes.py
│   │   ├── health_routes.py
│   │   └── file_handler.py
│   ├── __init__.py         # Flask factory pattern
│   └── (auth, db, forms, repository)
├── templates/              # HTML templates
├── main.py                # 🆕 Entry point
├── docker-compose.yml     # Production ready
└── README.md              # Updated docs
```

### 🎯 Benefits của Modular Architecture
- **Maintainable**: Mỗi tính năng trong module riêng
- **Scalable**: Dễ thêm tính năng mới
- **Debuggable**: Lỗi được isolated theo module
- **Team-friendly**: Multiple devs có thể work parallel
- **Production-ready**: Tested kỹ lưỡng với Docker

---

## 🚀 Development Workflow

1. **Local Test**: `docker-compose up --build`
2. **Code Changes**: Edit specific route module
3. **Validate**: Check `/health` endpoint
4. **Package**: Create optimized ZIP (45KB)
5. **Deploy**: Upload to production server

---

## 📞 Troubleshooting

### Common Issues:
1. **Port 5001 conflict**: Change port in docker-compose.yml
2. **Container won't start**: Check `docker-compose logs`
3. **Module import errors**: Verify `app/__init__.py`
4. **Login issues**: Check `auth_routes.py` blueprint
5. **Health check fails**: Verify `health_routes.py`

### Debug Commands:
```powershell
# Check container status
docker ps

# View logs by module
docker logs container-name

# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:5001/health"
```

Chúc bạn thành công! 🎉