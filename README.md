# Landing Page Manager - Modular Architecture

## Overview

A powerful Flask-based landing page management system with modular architecture, supporting multi-site deployment, ZIP-based page uploads, and comprehensive analytics tracking.

**Current Version**: Modular Architecture (Oct 2025)
**Package Size**: 45.52KB (optimized)
**Architecture**: 6 modular blueprints for maintainability

### Key Features
- 🏗️ **Modular Architecture**: Clean separation with 6 route modules
- 🚀 **Multi-site Ready**: Template-based deployment system
- 📦 **ZIP Upload System**: Easy landing page deployment
- 📊 **Analytics Integration**: Auto-inject tracking codes
- 🔐 **Secure Admin Panel**: Role-based access control
- 🐳 **Docker Optimized**: Production-ready containerization

### Server Requirements
- Ubuntu 22.04+ (or compatible Linux)
- Docker and Docker Compose installed
- Traefik reverse proxy running
- Domain with SSL certificates

### Quick Deployment

1. **Upload Package**
   ```bash
   # Upload ladifinal-clean-20251011-2206.zip to server
   cd /opt/websites/sites/
   # Upload via SCP, SFTP, or web interface
   unzip ladifinal-clean-20251011-2206.zip
   cd ladifinal
   ```

2. **Set Permissions**
   ```bash
   chmod +x deploy.sh
   sudo chown -R $USER:docker .
   ```

3. **Deploy Application**
   ```bash
   ./deploy.sh
   ```

### Configuration

- **Domain**: landing.htxbachgia.shop
- **Port**: 5001
- **Traefik Labels**: Configured for subdomain routing
- **Health Check**: Available at `/health` endpoint

### Modular Architecture
```
ladifinal/
├── app/
│   ├── routes/          # 6 Modular Route Blueprints
│   │   ├── homepage_routes.py    # Company homepage management
│   │   ├── landing_routes.py     # Landing page CRUD & API
│   │   ├── auth_routes.py        # Authentication & admin
│   │   ├── agents_routes.py      # Agent management
│   │   ├── health_routes.py      # Health checks
│   │   └── file_handler.py       # ZIP processing utilities
│   ├── __init__.py      # Flask app factory
│   ├── auth.py         # User authentication
│   ├── db.py           # Database operations
│   └── repository.py   # Data access layer
├── templates/          # Jinja2 HTML templates
├── uploads/           # User uploads (auto-created)
├── published/         # Published sites (auto-created)
├── main.py           # Application entry point
├── Dockerfile        # Optimized container config
├── docker-compose.yml # Production orchestration
├── requirements.txt   # Python dependencies
├── .env.production   # Production environment
├── deploy.sh         # Deployment script
└── README.md         # This file
```

### Management Commands

- **View logs**: `docker-compose logs -f`
- **Restart**: `docker-compose restart`
- **Stop**: `docker-compose down`
- **Update**: `git pull && docker-compose up -d --build`

### Troubleshooting

1. **Container won't start**:
   ```bash
   docker-compose logs
   docker ps -a
   ```

2. **Network issues**:
   ```bash
   docker network ls
   docker network inspect traefik-network
   ```

3. **Permissions issues**:
   ```bash
   sudo chown -R $USER:docker /opt/websites/sites/ladifinal
   ```

4. **Traefik not routing**:
   - Check Traefik dashboard
   - Verify labels in docker-compose.yml
   - Ensure traefik-network exists

### API Endpoints

- **Health Check**: `/health` - System status
- **Admin Panel**: `/admin-panel-xyz123/` - Management interface
- **Landing Pages**: `/landing/{subdomain}` - Published pages
- **API**: `/api/landing-pages` - RESTful API

### Modular Benefits

✅ **Maintainable**: Each feature in separate module
✅ **Scalable**: Easy to add new functionality
✅ **Testable**: Isolated components
✅ **Clean**: Clear separation of concerns
✅ **Reusable**: Modular blueprints

### Development Workflow

1. **Local Testing**: `docker-compose up --build`
2. **Code Changes**: Edit specific route modules
3. **Package**: Create optimized ZIP (45KB)
4. **Deploy**: Upload and restart container

### Support

For issues, check:
1. **Logs**: `docker-compose logs -f`
2. **Health**: Visit `/health` endpoint
3. **Modules**: Each route module has isolated errors
4. **Database**: Auto-created SQLite with proper schema