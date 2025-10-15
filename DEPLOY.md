# Hướng dẫn Deploy ứng dụng lên Ubuntu Server qua Docker Hub Registry

Tài liệu này hướng dẫn deploy ứng dụng Landing Page Manager từ máy phát triển (Windows) lên server Ubuntu sản xuất thông qua Docker Hub Registry.

## Tổng quan quy trình

1. **Phát triển** (máy local) → Build Docker image → Push lên Docker Hub
2. **Sản xuất** (server Ubuntu) → Pull image từ Docker Hub → Deploy với docker-compose

## Bước 1: Chuẩn bị Docker Hub Account

### 1.1 Tạo tài khoản Docker Hub
- Truy cập: https://hub.docker.com
- Đăng ký tài khoản miễn phí (cho phép 1 private repo, unlimited public repos)

### 1.2 Tạo Repository
- Đăng nhập Docker Hub → "Create Repository"
- Tên repository: `ladifinal`
- Visibility: `Public` (hoặc Private nếu bạn có tài khoản trả phí)
- Repository sẽ có đường dẫn: `yourusername/ladifinal`

### 1.3 Cập nhật cấu hình
Sửa file sau với username Docker Hub của bạn:
- `.env.example` → dòng `DOCKER_IMAGE=vutheviet/ladifinal:latest`
- `build-and-push.sh` → dòng `DOCKER_USERNAME="vutheviet"`
- `build-and-push.bat` → dòng `set DOCKER_USERNAME=vutheviet`
- `deploy-server.sh` → dòng `DOCKER_USERNAME="vutheviet"`

## Bước 2: Build và Push từ máy phát triển (Windows)

### 2.1 Đăng nhập Docker Hub từ terminal
```powershell
docker login
# Nhập username và password Docker Hub
```

### 2.2 Build và push image
**Cách 1: Dùng script tự động**
```powershell
# Chạy script Windows
.\build-and-push.bat

# Hoặc nếu có Git Bash/WSL
chmod +x build-and-push.sh
./build-and-push.sh
```

**Cách 2: Chạy thủ công**
```powershell
# Build image với tag timestamp
$TAG = Get-Date -Format "yyyyMMdd-HHmmss"
docker build --no-cache -t "yourusername/ladifinal:$TAG" -t "yourusername/ladifinal:latest" .

# Push cả 2 tags
docker push "yourusername/ladifinal:$TAG"
docker push "yourusername/ladifinal:latest"
```

### 2.3 Kiểm tra trên Docker Hub
- Truy cập https://hub.docker.com/r/yourusername/ladifinal
- Xác nhận image đã được push thành công

## Bước 3: Chuẩn bị Server Ubuntu

### 3.1 Cài đặt Docker và Docker Compose
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Đăng xuất và đăng nhập lại để nhóm docker có hiệu lực
logout
```

### 3.2 Kiểm tra Docker
```bash
# Sau khi đăng nhập lại
docker version
docker compose version
```

### 3.3 Tạo thư mục dự án
```bash
# Tạo thư mục cho ứng dụng
mkdir -p ~/ladifinal && cd ~/ladifinal

# Tạo các thư mục dữ liệu
mkdir -p uploads published logs data ladifinal
touch ladifinal/database.db
```

## Bước 4: Copy file cấu hình lên server

### 4.1 Copy các file cần thiết
Copy các file sau từ máy phát triển lên server:
- `docker-compose.prod.yml`
- `.env.example` 
- `deploy-server.sh`

**Cách 1: Dùng scp (từ máy Windows)**
```powershell
# Copy file lên server (thay user@server-ip bằng thông tin server thật)
scp docker-compose.prod.yml .env.example deploy-server.sh user@server-ip:~/ladifinal/
```

**Cách 2: Dùng Git (nếu có repository)**
```bash
# Trên server
git clone https://github.com/yourusername/ladifinal.git .
```

### 4.2 Tạo file .env production
```bash
# Copy template và chỉnh sửa
cp .env.example .env
nano .env

# Cập nhật các giá trị:
# DOCKER_IMAGE=yourusername/ladifinal:latest
# SECRET_KEY=your-super-secret-production-key-123456789
# PORT=5001
# DOMAIN=yourdomain.com
```

## Bước 5: Deploy trên Server

### 5.1 Chạy script deploy tự động
```bash
# Cấp quyền thực thi
chmod +x deploy-server.sh

# Chạy deploy (sẽ tự động pull image mới nhất)
./deploy-server.sh

# Hoặc deploy tag cụ thể
./deploy-server.sh 20251012-143000
```

### 5.2 Deploy thủ công (nếu cần)
```bash
# Tạo external network cho Traefik
docker network create traefik-network || true

# Đăng nhập Docker Hub (nếu repository private)
docker login

# Pull image mới nhất
export DOCKER_IMAGE=yourusername/ladifinal:latest
docker-compose -f docker-compose.prod.yml pull

# Stop containers cũ và start mới
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Kiểm tra status
docker-compose -f docker-compose.prod.yml ps
```

### 5.3 Kiểm tra ứng dụng
```bash
# Test health endpoint
curl http://localhost:5001/health

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f

# Test qua trình duyệt
# http://server-ip:5001 hoặc http://yourdomain.com
```

## Bước 6: Cập nhật ứng dụng

### 6.1 Từ máy phát triển (khi có code mới)
```powershell
# Build và push version mới
.\build-and-push.bat
```

### 6.2 Trên server (deploy version mới)
```bash
# Deploy phiên bản mới nhất
./deploy-server.sh

# Hoặc thủ công
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Bước 7: Thiết lập Reverse Proxy (tùy chọn)

### 7.1 Với Traefik (đã có sẵn labels trong docker-compose.prod.yml)
```bash
# Tạo file traefik.yml nếu chưa có
# Cấu hình domain và SSL certificate
```

### 7.2 Với Nginx
```nginx
# /etc/nginx/sites-available/ladifinal
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Bước 8: Backup và Monitoring

### 8.1 Backup dữ liệu quan trọng
```bash
# Tạo script backup hàng ngày
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/ladifinal"
mkdir -p $BACKUP_DIR

# Backup uploaded files và database
tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" uploads/ published/ ladifinal/database.db

# Xóa backup cũ hơn 30 ngày
find $BACKUP_DIR -name "data_*.tar.gz" -mtime +30 -delete
EOF

chmod +x backup.sh

# Thêm vào crontab (chạy hàng ngày lúc 2AM)
(crontab -l; echo "0 2 * * * /home/$(whoami)/ladifinal/backup.sh") | crontab -
```

### 8.2 Monitor logs
```bash
# Xem logs realtime
docker-compose -f docker-compose.prod.yml logs -f

# Check disk space
df -h

# Check container resource usage  
docker stats
```

## Troubleshooting

### Lỗi thường gặp:

**1. "Cannot connect to the Docker daemon"**
```bash
# Khởi động Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

**2. "Permission denied accessing Docker"**
```bash
# Thêm user vào group docker
sudo usermod -aG docker $USER
# Logout và login lại
```

**3. "Image pull failed"**
```bash
# Kiểm tra tên image và quyền truy cập
docker login
docker pull yourusername/ladifinal:latest
```

**4. "Port 5001 already in use"**
```bash
# Tìm process đang dùng port
sudo lsof -i :5001
# Hoặc đổi port trong .env
```

**5. "Database locked" errors**
```bash
# Stop container, backup DB và restart
docker-compose -f docker-compose.prod.yml down
cp ladifinal/database.db ladifinal/database.db.backup
docker-compose -f docker-compose.prod.yml up -d
```

## Files được tạo trong quy trình này:

- `.dockerignore` - Loại trừ files không cần thiết khỏi Docker image
- `docker-compose.prod.yml` - Cấu hình Docker Compose cho production
- `.env.example` - Template biến môi trường
- `build-and-push.sh` / `build-and-push.bat` - Script build và push image
- `deploy-server.sh` - Script deploy tự động trên server

Chúc bạn deploy thành công! 🚀