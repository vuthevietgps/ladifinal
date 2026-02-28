import os
from flask import Flask
from flask_login import LoginManager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    # Resolve paths relative to repository root (one level up from this package)
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    templates_dir = os.path.join(base_dir, 'templates')
    static_dir = os.path.join(base_dir, 'static')

    # Explicit template/static folders because templates/ & static/ nằm ngoài package 'app'
    app = Flask(
        __name__,
        template_folder=templates_dir,
        static_folder=static_dir
    )

    # Debug: print template/static directories once at startup
    try:
        print(f"[Init] Templates dir: {templates_dir}")
        print(f"[Init] Static dir: {static_dir}")
        loader = getattr(app, 'jinja_loader', None) or getattr(app, 'jinja_env', None)
        if hasattr(loader, 'searchpath'):
            print(f"[Init] Jinja searchpath: {getattr(loader, 'searchpath', [])}")
    except Exception as _e:
        pass
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-in-production')
    app.config['DATABASE'] = os.path.join(base_dir, 'database.db')  # Changed filename
    app.config['PUBLISHED_ROOT'] = os.environ.get('PUBLISHED_ROOT', os.path.join(base_dir, 'published'))
    app.config['MAX_CONTENT_LENGTH'] = int(os.environ.get('MAX_CONTENT_LENGTH', 16777216))  # 16MB
    app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', os.path.join(base_dir, 'uploads'))
    app.config['WTF_CSRF_ENABLED'] = True
    app.config['ADMIN_SECRET_PATH'] = os.environ.get('ADMIN_SECRET_PATH', 'admin-panel-xyz123')
    app.config['WILDCARD_DOMAIN'] = os.environ.get('WILDCARD_DOMAIN', 'localhost:8080')
    app.config['FALLBACK_GOOGLE_FORM_URL'] = os.environ.get('FALLBACK_GOOGLE_FORM_URL', '').strip()
    
    # Subdomain support (commented out for now)
    # app.config['SERVER_NAME'] = 'localhost:5000'

    # Ensure publish root exists
    os.makedirs(app.config['PUBLISHED_ROOT'], exist_ok=True)
    
    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Vui lòng đăng nhập để truy cập trang này.'
    login_manager.login_message_category = 'info'
    
    @login_manager.user_loader
    def load_user(user_id):
        from .auth import User
        return User.get(user_id)
    
    # Make config available in templates
    @app.context_processor
    def inject_config():
        return {'config': app.config}

    from .db import init_db
    init_db(app)
    
    # Initialize users table
    from .auth import init_users_table
    init_users_table()

    # Register all blueprints using new modular system
    from .routes import register_blueprints
    register_blueprints(app)

    return app
