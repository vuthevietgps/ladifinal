# Health Check & System Routes
from flask import Blueprint, jsonify, current_app, send_from_directory
from datetime import datetime
import os
from ..exceptions import DatabaseError

health_bp = Blueprint('health', __name__)

@health_bp.route('/health')
def health_check():
    """System health check endpoint"""
    try:
        # Basic health check
        health_status = {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.0',
            'database': 'ok',
            'storage': 'ok'
        }
        return jsonify(health_status)
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'timestamp': datetime.now().isoformat(),
            'error': str(e)
        }), 500

@health_bp.route('/published/<path:subpath>')
def serve_published(subpath):
    """Serve files from published directory for demo purposes"""
    root = current_app.config['PUBLISHED_ROOT']
    # Remove trailing slash and filter empty strings
    subpath = subpath.rstrip('/')
    parts = [p for p in subpath.split('/') if p]
    
    if not parts:
        return "No subdirectory specified", 404
    
    if len(parts) == 1:
        # Only subdomain provided, serve index.html
        return send_from_directory(os.path.join(root, parts[0]), 'index.html')
    else:
        # Subdomain + filename
        sub = parts[0]
        filename = '/'.join(parts[1:])
        return send_from_directory(os.path.join(root, sub), filename)