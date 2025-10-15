# Agents Management Module
from flask import Blueprint, jsonify, request
from flask_login import login_required
from .. import agents_repository
from ..constants import ERROR_MESSAGES
from ..exceptions import ValidationError, DatabaseError

agents_bp = Blueprint('agents', __name__)

# ============ AGENTS API ============

@agents_bp.route('/api/agents', methods=['GET'])
@login_required
def api_agents_list():
    """Get list of all agents"""
    try:
        agents = agents_repository.list_agents()
        return jsonify({'success': True, 'agents': agents})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi lấy danh sách agents: {str(e)}'}), 500


@agents_bp.route('/api/agents', methods=['POST'])
@login_required
def api_agents_create():
    """Create new agent"""
    try:
        # Handle both FormData and JSON
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
        
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        
        if not name:
            return jsonify({'success': False, 'message': 'Tên agent là bắt buộc'}), 400
        
        agent_id = agents_repository.create_agent(name, phone)
        
        return jsonify({
            'success': True, 
            'message': 'Agent đã được tạo thành công',
            'agent_id': agent_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi tạo agent: {str(e)}'}), 500


@agents_bp.route('/api/agents/<int:agent_id>', methods=['PUT'])
@login_required
def api_agents_update(agent_id):
    """Update existing agent"""
    try:
        # Handle both FormData and JSON
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
            
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        
        if not name:
            return jsonify({'success': False, 'message': 'Tên agent là bắt buộc'}), 400
        
        success = agents_repository.update_agent(agent_id, name, phone)
        
        if success:
            return jsonify({'success': True, 'message': 'Agent đã được cập nhật thành công'})
        else:
            return jsonify({'success': False, 'message': 'Không thể cập nhật agent'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi cập nhật agent: {str(e)}'}), 500


@agents_bp.route('/api/agents/<int:agent_id>', methods=['DELETE'])
@login_required
def api_agents_delete(agent_id):
    """Delete agent"""
    try:
        success = agents_repository.delete_agent(agent_id)
        
        if success:
            return jsonify({'success': True, 'message': 'Agent đã được xóa thành công'})
        else:
            return jsonify({'success': False, 'message': 'Không thể xóa agent'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi xóa agent: {str(e)}'}), 500