# 📋 VPS DEPLOYMENT CHECKLIST

## 🎯 Pre-Deployment Preparation

### **Local System Ready:**
- [ ] Code pushed to GitHub repository
- [ ] All deployment scripts tested locally  
- [ ] Database schema verified
- [ ] Static files organized correctly
- [ ] Requirements.txt updated

### **VPS Server Preparation:**
- [ ] Ubuntu 24.04+ server accessible via SSH
- [ ] Root or sudo access confirmed
- [ ] Server has internet connectivity
- [ ] At least 2GB RAM and 20GB disk space
- [ ] Port 22 (SSH) and 80 (HTTP) open

## 🚀 Deployment Process

### **Step 1: Initial Server Setup**
```bash
# Connect to VPS
ssh root@YOUR_SERVER_IP

# Update system
apt update && apt upgrade -y

# Install basic requirements
apt install -y curl wget git
```

### **Step 2: Download and Execute Cleanup**
```bash
# Download cleanup script
wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/cleanup-vps-ultimate.sh

# Make executable
chmod +x cleanup-vps-ultimate.sh

# Execute cleanup
./cleanup-vps-ultimate.sh
```
**Expected Result:** ✅ Clean system, old installations removed

### **Step 3: Deploy Application**
```bash
# Download deployment script
wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/deploy-vps-ultimate.sh

# Make executable  
chmod +x deploy-vps-ultimate.sh

# Execute deployment
./deploy-vps-ultimate.sh
```
**Expected Result:** ✅ Application installed and services running

### **Step 4: Verify Installation**
```bash
# Check service status
sudo systemctl status ladifinal nginx

# Test HTTP response
curl -I http://localhost/

# Check admin panel
curl -I http://localhost/admin-panel-xyz123
```
**Expected Results:** 
- ✅ Services active and running
- ✅ HTTP 200 responses
- ✅ Admin panel accessible

### **Step 5: Final Health Check**
```bash
# Download and run health check
wget https://raw.githubusercontent.com/vuthevietgps/ladifinal/main/health-check.sh
chmod +x health-check.sh
./health-check.sh
```
**Expected Result:** ✅ All systems green

## ✅ Post-Deployment Verification

### **Web Interface Testing:**
- [ ] Main website loads at `http://YOUR_SERVER_IP/`
- [ ] Admin panel accessible at `http://YOUR_SERVER_IP/admin-panel-xyz123`
- [ ] Can login with credentials (admin / admin)
- [ ] Can create new landing page
- [ ] Can upload ZIP folders successfully
- [ ] Generated pages display correctly

### **System Health Verification:**
- [ ] Flask service running: `sudo systemctl status ladifinal`
- [ ] Nginx service running: `sudo systemctl status nginx`
- [ ] Database accessible and writable
- [ ] File permissions correct (www-data ownership)
- [ ] No error messages in logs

### **Performance Testing:**
- [ ] Website loads within 3 seconds
- [ ] File uploads complete successfully
- [ ] Multiple concurrent users supported
- [ ] Memory usage under 80%
- [ ] Disk space sufficient

## 🔧 Troubleshooting Checkpoints

### **If Services Won't Start:**
```bash
# Check detailed service status
sudo systemctl status ladifinal --no-pager -l
sudo journalctl -u ladifinal --no-pager -l

# Verify dependencies installed
source /var/www/ladifinal/venv/bin/activate
pip list | grep -E "(flask|gunicorn)"
deactivate
```

### **If Website Not Accessible:**
```bash
# Test local connection
curl http://127.0.0.1:5000
curl http://localhost/

# Check nginx configuration
sudo nginx -t

# Verify firewall settings
sudo ufw status
```

### **If Database Errors:**
```bash
# Check database file
ls -la /var/www/ladifinal/database.db

# Reset database if needed
cd /var/www/ladifinal
sudo rm -f database.db
source venv/bin/activate
python -c "from app.db import init_db; init_db()"
deactivate
sudo chown www-data:www-data database.db
```

## 📈 Monitoring and Maintenance

### **Regular Health Checks:**
```bash
# Weekly system check
./health-check.sh

# Monitor logs for errors
sudo journalctl -u ladifinal --since="1 hour ago"

# Check disk space
df -h
```

### **Performance Monitoring:**
```bash
# Check memory usage
free -h

# Monitor active connections
netstat -an | grep :80 | wc -l

# Top processes by memory
ps aux --sort=-%mem | head -10
```

### **Security Maintenance:**
```bash
# Update system packages monthly
sudo apt update && sudo apt upgrade -y

# Check file permissions quarterly
sudo find /var/www/ladifinal -type f -perm -002

# Review logs for suspicious activity
sudo grep "404\|403\|500" /var/log/nginx/access.log
```

## 🆘 Emergency Procedures

### **Complete Service Restart:**
```bash
sudo systemctl stop ladifinal nginx
sleep 10
sudo systemctl start nginx ladifinal
sudo systemctl status ladifinal nginx
```

### **Emergency Rollback:**
```bash
# Stop services
sudo systemctl stop ladifinal nginx

# Backup current installation
sudo mv /var/www/ladifinal /var/www/ladifinal-backup

# Redeploy from clean state
./cleanup-vps-ultimate.sh
./deploy-vps-ultimate.sh
```

### **Contact Information:**
- **System Logs:** `sudo journalctl -u ladifinal -f`
- **Error Logs:** `/var/log/nginx/error.log`
- **Application Directory:** `/var/www/ladifinal/`
- **Configuration:** `/etc/systemd/system/ladifinal.service`

## 🎉 Success Criteria

**Deployment is successful when:**
- ✅ All services show `active (running)` status
- ✅ Website responds with HTTP 200 on main page
- ✅ Admin panel accessible and functional
- ✅ Can create and publish landing pages
- ✅ File uploads work correctly
- ✅ No critical errors in system logs
- ✅ System resources within normal limits

**🚀 Your landing page system is now live and ready for production use!**

---

**📝 Keep this checklist handy for future deployments and system maintenance.**