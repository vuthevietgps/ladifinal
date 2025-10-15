# Quick Deploy Scripts for Cloudflare Tunnel

## Deploy mới domain với 1 lệnh:

```bash
# Download script
curl -o deploy-new-domain.sh https://raw.githubusercontent.com/[YOUR_USERNAME]/cloudflare-deploy/main/deploy-new-domain.sh

# Chạy
chmod +x deploy-new-domain.sh
sudo ./deploy-new-domain.sh domain.com 8083
```

## Hoặc copy trực tiếp:

```bash
# Tạo script trên server
sudo nano /usr/local/bin/deploy-new-domain
# Paste nội dung script
sudo chmod +x /usr/local/bin/deploy-new-domain

# Sử dụng từ bất kỳ đâu:
sudo deploy-new-domain example.com 8084
```

## Tunnel ID hiện tại:
```
13835f7d-46a0-48f7-bb67-333f39ee33d1
```

## Port đã sử dụng:
- 8081: phuhieutoanquoc.shop
- 8082: thelaixedanang.shop
- 8083: [Available]
- 8084: [Available]