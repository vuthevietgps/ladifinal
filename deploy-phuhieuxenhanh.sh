sudo rm deploy-tungtran.sh
sudo nano deploy-tungtran.sh  # Paste nội dung mới
sudo chmod +x deploy-tungtran.sh
sudo ./deploy-tungtran.sh

curl -i -H "Host: tungtran.online" http://127.0.0.1/api/auth/login


curl -I -k https://tungtran.online/api/auth/login
curl -i -k -X POST https://tungtran.online/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin1@gmail.com","password":"wrong"}'


# Traefik HTTPS với SNI đúng
curl -k --resolve tungtran.online:443:127.0.0.1 \
  -H "Host: tungtran.online" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"email":"admin1@gmail.com","password":"wrong"}' \
  https://tungtran.online/api/auth/login