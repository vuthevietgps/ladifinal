#!/bin/bash
# Script dọn dẹp server Ubuntu và deploy mới từ Docker Hub

echo "🧹 Bắt đầu dọn dẹp server..."

# Stop tất cả containers liên quan đến phuhieutoanquoc
echo "🛑 Dừng containers cũ..."
docker stop $(docker ps -a | grep phuhieutoanquoc | awk '{print $1}') 2>/dev/null || true
docker stop $(docker ps -a | grep ladifinal | awk '{print $1}') 2>/dev/null || true

# Xóa containers cũ
echo "🗑️ Xóa containers cũ..."
docker rm $(docker ps -a | grep phuhieutoanquoc | awk '{print $1}') 2>/dev/null || true
docker rm $(docker ps -a | grep ladifinal | awk '{print $1}') 2>/dev/null || true

# Xóa images cũ (local build)
echo "📦 Xóa images cũ..."
docker rmi $(docker images | grep phuhieutoanquoc | awk '{print $3}') 2>/dev/null || true
docker rmi $(docker images | grep ladifinal | grep -v vutheviet | awk '{print $3}') 2>/dev/null || true

# Dọn dẹp unused images, containers, networks
echo "🧽 Dọn dẹp Docker system..."
docker system prune -f

# Tạo thư mục mới cho deployment
echo "📁 Tạo thư mục deploy mới..."
mkdir -p /opt/websites/sites/ladifinal-new
cd /opt/websites/sites/ladifinal-new

# Backup dữ liệu quan trọng từ thư mục cũ (nếu có)
echo "💾 Backup dữ liệu cũ..."
if [ -d "/opt/websites/sites/phuhieutoanquoc/uploads" ]; then
    cp -r /opt/websites/sites/phuhieutoanquoc/uploads ./
    echo "✅ Đã backup uploads"
fi

if [ -d "/opt/websites/sites/phuhieutoanquoc/published" ]; then
    cp -r /opt/websites/sites/phuhieutoanquoc/published ./
    echo "✅ Đã backup published"
fi

if [ -f "/opt/websites/sites/phuhieutoanquoc/database.db" ]; then
    cp /opt/websites/sites/phuhieutoanquoc/database.db ./
    echo "✅ Đã backup database.db"
fi

if [ -f "/opt/websites/sites/phuhieutoanquoc/ladifinal/database.db" ]; then
    mkdir -p ./ladifinal
    cp /opt/websites/sites/phuhieutoanquoc/ladifinal/database.db ./ladifinal/
    echo "✅ Đã backup ladifinal/database.db"
fi

# Tạo cấu trúc thư mục cần thiết
echo "🏗️ Tạo cấu trúc thư mục..."
mkdir -p uploads published logs data ladifinal

# Đảm bảo file database tồn tại
touch ladifinal/database.db

echo "✅ Dọn dẹp hoàn tất!"
echo "📍 Thư mục mới: /opt/websites/sites/ladifinal-new"
echo "📋 Tiếp theo: copy files cấu hình và deploy"