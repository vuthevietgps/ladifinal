# 🔧 VPS DEPLOYMENT TROUBLESHOOTING GUIDE

## 🚨 Common Issues & Quick Fixes

### **Issue 1: Service shows "activating" but never "active"**
**Symptoms:**
```bash
sudo systemctl status ladifinal
● ladifinal.service - LandingPage System Flask Application
   Active: activating (auto-restart)
```

**Solution:**
```bash
# Check if gunicorn is installed
cd /var/www/ladifinal
source venv/bin/activate
pip install gunicorn
deactivate

# Restart service
sudo systemctl restart ladifinal
sudo systemctl status ladifinal
```

### **Issue 2: HTTP 502 Bad Gateway**
**Symptoms:**
- Browser shows "502 Bad Gateway"
- Nginx is running but can't connect to Flask app

**Solution:**
```bash
# Test Flask app directly
curl http://127.0.0.1:5000

# If no response, check Flask service
sudo systemctl status ladifinal
sudo journalctl -u ladifinal -f --lines=20

# Restart Flask service
sudo systemctl restart ladifinal
```

### **Issue 3: Database Permission Errors**
**Symptoms:**
```
PermissionError: [Errno 13] Permission denied: 'database.db'
```

**Solution:**
```bash
# Fix database permissions
cd /var/www/ladifinal
sudo chown www-data:www-data database.db
sudo chmod 664 database.db
sudo systemctl restart ladifinal
```

### **Issue 4: Static Files Not Loading (CSS/JS missing)**
**Symptoms:**
- Website loads but no styling
- 404 errors for CSS/JS files

**Solution:**
```bash
# Check nginx configuration
sudo nginx -t

# Fix static file permissions
sudo chown -R www-data:www-data /var/www/ladifinal/static
sudo chmod -R 755 /var/www/ladifinal/static

# Restart nginx
sudo systemctl restart nginx
```

### **Issue 5: Admin Panel 404 Error**
**Symptoms:**
- Main site works but admin panel returns 404

**Solution:**
```bash
# Check if route is properly configured
curl -I http://localhost/admin-panel-xyz123

# If still 404, restart Flask app
sudo systemctl restart ladifinal
```

## 🔍 Diagnostic Commands

### **Check All Services Status:**
```bash
sudo systemctl status ladifinal nginx
ps aux | grep gunicorn
netstat -tlnp | grep -E ":80|:5000"
```

### **View Application Logs:**
```bash
# Flask app logs
sudo journalctl -u ladifinal -f --lines=50

# Nginx error logs  
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### **Test HTTP Responses:**
```bash
# Test main site
curl -I http://localhost/

# Test Flask app directly
curl -I http://127.0.0.1:5000

# Test admin panel
curl -I http://localhost/admin-panel-xyz123
```

### **Check File Permissions:**
```bash
# Application directory
ls -la /var/www/ladifinal/

# Database file
ls -la /var/www/ladifinal/database.db

# Static files
ls -la /var/www/ladifinal/static/
```

## 🛠️ Emergency Recovery

### **Complete Service Restart:**
```bash
sudo systemctl stop ladifinal
sudo systemctl stop nginx
sleep 5
sudo systemctl start nginx
sudo systemctl start ladifinal
sudo systemctl status ladifinal nginx
```

### **Reset Database (if corrupted):**
```bash
cd /var/www/ladifinal
sudo rm -f database.db
source venv/bin/activate
python -c "
from app import create_app
from app.db import init_db
app = create_app()
with app.app_context():
    init_db()
"
deactivate
sudo chown www-data:www-data database.db
sudo chmod 664 database.db
sudo systemctl restart ladifinal
```

### **Reinstall from Scratch:**
```bash
# Download and run cleanup script
cd ~
wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/cleanup-vps-ultimate.sh
chmod +x cleanup-vps-ultimate.sh
./cleanup-vps-ultimate.sh

# Deploy again
wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/deploy-vps-ultimate.sh
chmod +x deploy-vps-ultimate.sh
./deploy-vps-ultimate.sh
```

## 📊 Performance Monitoring

### **Check Resource Usage:**
```bash
# Memory usage
free -h
ps aux --sort=-%mem | head -10

# Disk usage  
df -h
du -sh /var/www/ladifinal/*

# CPU load
top -p $(pgrep -f gunicorn) -n 1

# Network connections
netstat -an | grep :80
netstat -an | grep :5000
```

### **Performance Optimization:**
```bash
# Increase Gunicorn workers if needed
sudo nano /etc/systemd/system/ladifinal.service
# Change: --workers 2 to --workers 4

sudo systemctl daemon-reload
sudo systemctl restart ladifinal

# Enable Nginx gzip compression (if not already)
sudo nano /etc/nginx/sites-available/ladifinal
# Add gzip settings in server block

sudo nginx -t
sudo systemctl restart nginx
```

## 🔐 Security Checklist

### **Firewall Configuration:**
```bash
sudo ufw status
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### **File Permission Audit:**
```bash
# Check for world-writable files
find /var/www/ladifinal -type f -perm -002

# Check for files owned by root (should be www-data)
find /var/www/ladifinal ! -user www-data

# Fix permissions if needed
sudo chown -R www-data:www-data /var/www/ladifinal
sudo find /var/www/ladifinal -type d -exec chmod 755 {} \;
sudo find /var/www/ladifinal -type f -exec chmod 644 {} \;
sudo chmod +x /var/www/ladifinal/venv/bin/*
```

### **SSL/HTTPS Setup (Optional):**
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (replace YOUR-DOMAIN)
sudo certbot --nginx -d YOUR-DOMAIN

# Test SSL renewal
sudo certbot renew --dry-run
```

## 📞 Support Information

### **Log File Locations:**
- Flask App: `sudo journalctl -u ladifinal`
- Nginx Error: `/var/log/nginx/error.log`
- Nginx Access: `/var/log/nginx/access.log`
- System: `/var/log/syslog`

### **Configuration Files:**
- Systemd Service: `/etc/systemd/system/ladifinal.service`
- Nginx Site: `/etc/nginx/sites-available/ladifinal`
- Application: `/var/www/ladifinal/`
- Database: `/var/www/ladifinal/database.db`

### **Quick Health Check Script:**
```bash
# Run comprehensive health check
cd ~ && ./health-check.sh

# Or download if not available
wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/health-check.sh
chmod +x health-check.sh
./health-check.sh
```

---

**💡 Remember: Most issues can be resolved by restarting services and checking logs. The deployment scripts are designed to handle common problems automatically.**