# Routes Module - Clean Modular Architecture
from .homepage_routes import homepage_bp
from .landing_routes import landing_bp
from .auth_routes import auth_bp
from .agents_routes import agents_bp
from .health_routes import health_bp

def register_blueprints(app):
    """Register all blueprints with the Flask app"""
    
    # Register health check (no prefix)
    app.register_blueprint(health_bp)
    
    # Register homepage routes (no prefix)
    app.register_blueprint(homepage_bp)
    
    # Register landing page routes (no prefix) 
    app.register_blueprint(landing_bp)
    
    # Register authentication routes (no prefix)
    app.register_blueprint(auth_bp)
    
    # Register agents routes (no prefix)
    app.register_blueprint(agents_bp)

    # Finally, register legacy routes (must be last for catch-all). This file is app/routes.py,
    # but since we also have a package app.routes (this folder), import it by path to avoid name collision.
    try:
        import os, importlib.util
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        legacy_path = os.path.join(base_dir, 'routes.py')
        if os.path.exists(legacy_path):
            spec = importlib.util.spec_from_file_location('legacy_routes_module', legacy_path)
            if spec and spec.loader:
                legacy_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(legacy_module)
                legacy_bp = getattr(legacy_module, 'bp', None)
                if legacy_bp is not None:
                    app.register_blueprint(legacy_bp)
    except Exception:
        # Safe to continue if legacy blueprint cannot be loaded
        pass
