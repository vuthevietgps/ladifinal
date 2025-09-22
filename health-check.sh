#!/bin/bash
# VPS Health Check and Monitoring Script
# Version: 1.0
# Date: 2025-09-22

echo "🔍 VPS HEALTH CHECK - LANDING PAGE SYSTEM"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }

echo "📊 SYSTEM STATUS"
echo "=================="

# System info
echo "OS: $(lsb_release -d | cut -f2 2>/dev/null || echo 'Unknown')"
echo "Uptime: $(uptime -p)"
echo "Load: $(uptime | awk -F'load average:' '{print $2}')"

# Memory
MEMORY=$(free -h | grep '^Mem:')
MEMORY_USED=$(echo $MEMORY | awk '{print $3}')
MEMORY_FREE=$(echo $MEMORY | awk '{print $4}')
echo "Memory: $MEMORY_USED used, $MEMORY_FREE available"

# Disk space
DISK=$(df -h / | tail -1)
DISK_USED=$(echo $DISK | awk '{print $5}' | sed 's/%//')
DISK_AVAIL=$(echo $DISK | awk '{print $4}')

if [ "$DISK_USED" -gt 80 ]; then
    error "Disk usage: ${DISK_USED}% (${DISK_AVAIL} free) - HIGH!"
elif [ "$DISK_USED" -gt 70 ]; then
    warn "Disk usage: ${DISK_USED}% (${DISK_AVAIL} free)"
else
    log "Disk usage: ${DISK_USED}% (${DISK_AVAIL} free)"
fi

echo ""
echo "🔧 SERVICE STATUS"
echo "================="

# Check Flask app service
if systemctl is-active --quiet ladifinal; then
    log "Flask App (ladifinal): Running"
    FLASK_PID=$(systemctl show --property MainPID --value ladifinal)
    FLASK_MEMORY=$(ps -o pid,rss --no-headers -p $FLASK_PID 2>/dev/null | awk '{print $2}')
    if [ -n "$FLASK_MEMORY" ]; then
        FLASK_MB=$((FLASK_MEMORY / 1024))
        info "  Memory usage: ${FLASK_MB}MB"
    fi
else
    error "Flask App (ladifinal): Not running"
    warn "  Try: sudo systemctl start ladifinal"
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    log "Nginx: Running"
else
    error "Nginx: Not running"
    warn "  Try: sudo systemctl start nginx"
fi

echo ""
echo "🌐 NETWORK STATUS"
echo "================="

# Check ports
if command -v netstat >/dev/null 2>&1; then
    # Port 80 (HTTP)
    if netstat -tlnp | grep -q ":80 "; then
        PORT_80_PROC=$(netstat -tlnp | grep ":80 " | awk '{print $7}' | head -1)
        log "Port 80 (HTTP): Open ($PORT_80_PROC)"
    else
        error "Port 80 (HTTP): Not listening"
    fi
    
    # Port 5000 (Flask)
    if netstat -tlnp | grep -q ":5000 "; then
        PORT_5000_PROC=$(netstat -tlnp | grep ":5000 " | awk '{print $7}' | head -1)
        log "Port 5000 (Flask): Open ($PORT_5000_PROC)"
    else
        warn "Port 5000 (Flask): Not listening"
    fi
    
    # Port 22 (SSH)
    if netstat -tlnp | grep -q ":22 "; then
        log "Port 22 (SSH): Open"
    else
        warn "Port 22 (SSH): Check SSH configuration"
    fi
else
    warn "netstat not available - install net-tools"
fi

echo ""
echo "📁 APPLICATION STATUS"  
echo "===================="

APP_DIR="/var/www/ladifinal"

if [ -d "$APP_DIR" ]; then
    log "Application directory: Exists"
    
    # Check main files
    if [ -f "$APP_DIR/main.py" ]; then
        log "  main.py: Found"
    else
        error "  main.py: Missing"
    fi
    
    if [ -d "$APP_DIR/app" ]; then
        log "  app module: Found"
    else
        error "  app module: Missing"
    fi
    
    if [ -f "$APP_DIR/database.db" ]; then
        DB_SIZE=$(ls -lh "$APP_DIR/database.db" | awk '{print $5}')
        log "  database.db: Found (${DB_SIZE})"
    else
        warn "  database.db: Not found (will be created on startup)"
    fi
    
    if [ -d "$APP_DIR/venv" ]; then
        log "  Virtual environment: Found"
        if [ -f "$APP_DIR/venv/bin/gunicorn" ]; then
            log "    gunicorn: Installed"
        else
            error "    gunicorn: Missing"
        fi
    else
        error "  Virtual environment: Missing"
    fi
    
    # Check published directory
    if [ -d "$APP_DIR/published" ]; then
        LANDING_COUNT=$(find "$APP_DIR/published" -name "index.html" | wc -l)
        log "  Published landing pages: $LANDING_COUNT"
    else
        info "  Published directory: Empty (no landing pages yet)"
    fi
    
else
    error "Application directory: Not found ($APP_DIR)"
fi

echo ""
echo "🔍 HTTP HEALTH CHECK"
echo "==================="

# Test HTTP responses
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null || echo "000")
case $HTTP_CODE in
    200)
        log "HTTP Test: OK (Status: $HTTP_CODE)"
        ;;
    302|301)
        log "HTTP Test: Redirect (Status: $HTTP_CODE) - Normal"
        ;;
    000)
        error "HTTP Test: Connection failed"
        warn "  Check if nginx and flask are running"
        ;;
    *)
        warn "HTTP Test: Status $HTTP_CODE"
        ;;
esac

# Test admin panel
ADMIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/admin-panel-xyz123 2>/dev/null || echo "000")
if [ "$ADMIN_CODE" = "200" ] || [ "$ADMIN_CODE" = "302" ]; then
    log "Admin Panel: Accessible"
else
    warn "Admin Panel: Status $ADMIN_CODE"
fi

echo ""
echo "📋 RECENT LOGS"
echo "=============="

# Flask app logs
info "Last 3 Flask app log entries:"
sudo journalctl -u ladifinal --no-pager --lines=3 2>/dev/null || echo "No logs available"

echo ""
# Nginx error logs
info "Last 3 Nginx error log entries:"
sudo tail -3 /var/log/nginx/error.log 2>/dev/null || echo "No error logs"

echo ""
echo "💡 RECOMMENDATIONS"
echo "=================="

# Performance recommendations
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk -F',' '{print $1}' | sed 's/ //g')
if (( $(echo "$LOAD_AVG > 2.0" | bc -l) )); then
    warn "High system load: $LOAD_AVG - consider optimizing"
fi

# Memory recommendations
MEMORY_PERCENT=$(free | grep '^Mem:' | awk '{print int($3/$2 * 100)}')
if [ "$MEMORY_PERCENT" -gt 80 ]; then
    warn "High memory usage: ${MEMORY_PERCENT}% - consider adding more RAM"
fi

# Security recommendations
if ! sudo ufw status | grep -q "Status: active"; then
    warn "Firewall (UFW): Not active - consider enabling"
    info "  sudo ufw enable"
fi

# SSL recommendation
if ! netstat -tlnp 2>/dev/null | grep -q ":443 "; then
    info "Consider setting up SSL certificate (Let's Encrypt)"
    info "  sudo apt install certbot python3-certbot-nginx"
fi

echo ""
echo "🔧 USEFUL COMMANDS"
echo "=================="
echo "Service control:"
echo "  sudo systemctl restart ladifinal"
echo "  sudo systemctl restart nginx"
echo ""
echo "View live logs:"
echo "  sudo journalctl -u ladifinal -f"
echo "  sudo tail -f /var/log/nginx/error.log"
echo ""
echo "Database backup:"
echo "  cp $APP_DIR/database.db ~/backup-$(date +%Y%m%d).db"
echo ""
echo "Check disk usage:"
echo "  du -sh $APP_DIR/*"
echo ""

echo "=========================================="
echo "🏁 HEALTH CHECK COMPLETE"
echo "=========================================="