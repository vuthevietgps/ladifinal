# Deployment Guide

## 📋 Checklist trước khi deploy:

### 1. **Chuẩn bị server:**
- [ ] Ubuntu Server với Docker installed
- [ ] Docker Compose installed
- [ ] Cloudflare Tunnel active
- [ ] Traefik reverse proxy running
- [ ] Port range available (8083-8090)

### 2. **Chuẩ bị domain:**
- [ ] Domain đã mua và có quyền quản lý
- [ ] Access vào Cloudflare Dashboard
- [ ] Domain chưa được sử dụng

### 3. **Download và chạy script:**

```bash
# Download
curl -o deploy-new-domain.sh https://raw.githubusercontent.com/vuthevietgps/cloudflare-tunnel-deploy/main/deploy-new-domain.sh

# Phân quyền
chmod +x deploy-new-domain.sh

# Chạy (thay domain và port)
sudo ./deploy-new-domain.sh example.com 8083
```

### 4. **Cấu hình DNS:**
1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Add site: `example.com`
3. Chọn plan Free
4. Thêm CNAME records:
   ```
   @ → 13835f7d-46a0-48f7-bb67-333f39ee33d1.cfargotunnel.com (Proxied)
   www → 13835f7d-46a0-48f7-bb67-333f39ee33d1.cfargotunnel.com (Proxied)
   ```
5. Cập nhật nameserver tại nhà cung cấp domain

### 5. **Kiểm tra:**
```bash
# Test container local
curl -I http://localhost:8083

# Test DNS (chờ 5-30 phút)
nslookup example.com 8.8.8.8

# Test website final
curl -I https://example.com
```

## 🔍 Debug thường gặp:

### Container không start:
```bash
# Xem logs
sudo docker logs example-com-web

# Kiểm tra port conflict
sudo netstat -tlnp | grep 8083
```

### Tunnel 502 error:
```bash
# Xem tunnel logs
sudo journalctl -u cloudflared --since "5 minutes ago" | grep -i error

# Restart tunnel
sudo systemctl restart cloudflared
```

### DNS không resolve:
```bash
# Kiểm tra nameserver
dig NS example.com

# Kiểm tra CNAME
dig CNAME example.com
```

## 📊 Port management:

| Port | Domain | Status |
|------|--------|--------|
| 8081 | phuhieutoanquoc.shop | ✅ Active |
| 8082 | thelaixedanang.shop | ✅ Active |
| 8083 | Available | 🟢 Free |
| 8084 | Available | 🟢 Free |
| 8085 | Available | 🟢 Free |

## 🔄 Update script:

```bash
# Cập nhật script mới nhất
curl -o deploy-new-domain.sh https://raw.githubusercontent.com/vuthevietgps/cloudflare-tunnel-deploy/main/deploy-new-domain.sh
```