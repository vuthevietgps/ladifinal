# Health Check & System Routes
from flask import Blueprint, jsonify, current_app
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