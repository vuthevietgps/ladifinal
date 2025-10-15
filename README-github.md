# Cloudflare Tunnel Deploy

🚀 **Script tự động deploy website với Cloudflare Tunnel chỉ bằng 1 lệnh!**

## 📥 Quick Start

### 1. Download script:
```bash
curl -o deploy-new-domain.sh https://raw.githubusercontent.com/vuthevietgps/cloudflare-tunnel-deploy/main/deploy-new-domain.sh
chmod +x deploy-new-domain.sh
```

### 2. Deploy domain mới:
```bash
sudo ./deploy-new-domain.sh example.com 8083
```

## 🎯 Tính năng

- ✅ **Tự động tạo** Docker Compose với Traefik labels
- ✅ **Tự động cập nhật** Cloudflare Tunnel config
- ✅ **Tự động restart** tunnel service
- ✅ **Port management** - tránh xung đột
- ✅ **Health check** - test ngay sau deploy

## 📋 Yêu cầu hệ thống

- Ubuntu Server với Docker & Docker Compose
- Cloudflare Tunnel đã setup
- Traefik reverse proxy
- Sudo permissions

## 🔧 Cấu hình

### Tunnel ID hiện tại:
```
13835f7d-46a0-48f7-bb67-333f39ee33d1
```

### Port đã sử dụng:
- `8081`: phuhieutoanquoc.shop
- `8082`: thelaixedanang.shop
- `8083-8090`: Available

## 📖 Hướng dẫn chi tiết

### 1. **Deploy container:**
Script sẽ tự động:
- Tạo thư mục `/opt/websites/sites/[DOMAIN]`
- Tạo `docker-compose.yml` với image `vutheviet/ladipage:latest`
- Expose port tùy chọn
- Cấu hình Traefik labels

### 2. **Cập nhật tunnel:**
Tự động thêm vào `/etc/cloudflared/config.yml`:
```yaml
- hostname: example.com
  service: http://127.0.0.1:8083
  originRequest:
    noTLSVerify: true
    connectTimeout: 30s
    tlsTimeout: 30s
```

### 3. **DNS Configuration:**
Sau khi chạy script, cần:
1. Add domain vào Cloudflare Dashboard
2. Tạo CNAME records:
   - `@` → `13835f7d-46a0-48f7-bb67-333f39ee33d1.cfargotunnel.com`
   - `www` → `13835f7d-46a0-48f7-bb67-333f39ee33d1.cfargotunnel.com`
3. Bật Proxy (Orange cloud)

## 🧪 Testing

```bash
# Test container local
curl -I http://localhost:8083

# Test domain (sau khi DNS propagate)
curl -I https://example.com
```

## 🔍 Troubleshooting

### 502 Bad Gateway:
```bash
# Kiểm tra logs tunnel
sudo journalctl -u cloudflared --since "5 minutes ago" | grep -i error

# Kiểm tra container
sudo docker ps | grep example
sudo docker logs example-com-web
```

### DNS không resolve:
```bash
# Kiểm tra DNS propagation
nslookup example.com 8.8.8.8

# Chờ 5-30 phút để DNS propagate
```

## 📁 File Structure

```
/opt/websites/sites/example-com/
├── docker-compose.yml
├── uploads/
├── published/
└── database/
```

## 🚀 Advanced Usage

### Install globally:
```bash
sudo curl -o /usr/local/bin/deploy-domain https://raw.githubusercontent.com/vuthevietgps/cloudflare-tunnel-deploy/main/deploy-new-domain.sh
sudo chmod +x /usr/local/bin/deploy-domain

# Sử dụng từ bất kỳ đâu:
sudo deploy-domain newsite.com 8084
```

### Batch deploy:
```bash
# Deploy nhiều domain cùng lúc
for domain in site1.com site2.com site3.com; do
    sudo ./deploy-new-domain.sh $domain $((8083 + i))
    ((i++))
done
```

## 📚 Template Files

- [`docker-compose.yml`](docker-compose.template.yml) - Template Docker Compose
- [`tunnel-config.yml`](tunnel-config.template.yml) - Template Tunnel Config

## 🔒 Security Notes

- Script yêu cầu `sudo` để chỉnh sửa system files
- Tất cả containers chạy trên `traefik-network`
- SSL certificates do Cloudflare quản lý

## 🤝 Contributing

1. Fork repo
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License - Sử dụng tự do cho personal và commercial projects.

---

⭐ **Star repo này nếu hữu ích!**

🐛 **Report issues:** [GitHub Issues](https://github.com/vuthevietgps/cloudflare-tunnel-deploy/issues)