# Landing Pages Management Module
from flask import Blueprint, request, jsonify, render_template, flash, redirect, url_for, current_app, send_from_directory, make_response
from flask_login import login_required
import os
import json
from .. import repository, agents_repository
from .file_handler import (
    validate_zip_structure,
    extract_and_validate_folder,
    process_html_tracking_in_folder,
    rewrite_asset_paths_in_folder,
)
from ..constants import MIME_TYPES, STATIC_ASSETS_CACHE_TIME, CACHE_EXPIRES_DATE, ERROR_MESSAGES
from ..exceptions import ValidationError, FileUploadError, ZipProcessingError, SubdomainError

landing_bp = Blueprint('landing', __name__)

# ============ LANDING PAGE SERVING ============

@landing_bp.route('/landing/<subdomain>')
def serve_landing_simple(subdomain):
    """Serve published landing pages via /landing/<subdomain> URL"""
    pub_root = current_app.config['PUBLISHED_ROOT']
    landing_dir = os.path.join(pub_root, subdomain)
    index_file = os.path.join(landing_dir, 'index.html')
    
    # Check if landing page exists
    if not os.path.exists(index_file):
        return f"<h1>Landing page '{subdomain}' not found</h1><p>Please check if the landing page has been uploaded correctly.</p>", 404
    
    try:
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Create response with anti-cache headers for debugging
        response = make_response(content)
        response.headers['Content-Type'] = 'text/html; charset=utf-8'
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        
        return response
    except Exception as e:
        return f"<h1>Error loading landing page: {str(e)}</h1>", 500


@landing_bp.route('/landing/<subdomain>/<path:filename>')
def serve_landing_assets_simple(subdomain, filename):
    """Serve static assets (CSS, JS, images, etc.) for landing pages with proper MIME types"""
    pub_root = current_app.config['PUBLISHED_ROOT']
    landing_dir = os.path.join(pub_root, subdomain)
    full_path = os.path.join(landing_dir, filename)
    
    if not os.path.exists(full_path):
        return "File not found", 404
    
    # Get file extension to determine MIME type
    _, ext = os.path.splitext(filename.lower())
    
    # Set appropriate MIME type using constants
    mimetype = MIME_TYPES.get(ext, 'application/octet-stream')
    
    # Create response with proper headers
    response = make_response(send_from_directory(landing_dir, filename, mimetype=mimetype))
    response.headers['X-Landing-Subdomain'] = subdomain
    
    # Add cache headers for static assets (but allow no-cache for debugging)
    if request.args.get('debug') == '1':
        # Debug mode - no cache
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    else:
        # Production mode - cache
        if ext in ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']:
            response.headers['Cache-Control'] = f'public, max-age={STATIC_ASSETS_CACHE_TIME}'
            response.headers['Expires'] = CACHE_EXPIRES_DATE
    
    # Security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    
    return response


@landing_bp.route('/landing/<int:landing_id>')
def landing_detail(landing_id):
    """Show landing page details"""
    landing = repository.get_landing(landing_id)
    if not landing:
        flash('Không tìm thấy landing page','danger')
        return redirect(url_for('auth.admin_dashboard'))
    return render_template('detail.html', landing=landing)


# ============ LANDING PAGE API ============

@landing_bp.route('/api/landingpages', methods=['GET'])
@login_required
def api_list():
    """Get list of landing pages with filters"""
    filters = {
        'agent': request.args.get('agent','').strip(),
        'status': request.args.get('status','').strip(),
        'q': request.args.get('q','').strip(),
    }
    return jsonify(repository.list_landings(filters))


@landing_bp.route('/api/landingpages', methods=['POST'])
@login_required
def api_create():
    """Create new landing page via API"""
    try:
        # Get form data
        subdomain = request.form.get('subdomain', '').strip()
        agent = request.form.get('agent', '').strip()
        page_type = request.form.get('page_type', 'landing')
        
        # Tracking fields
        global_site_tag = request.form.get('global_site_tag', '').strip()
        phone_tracking = request.form.get('phone_tracking', '').strip()
        zalo_tracking = request.form.get('zalo_tracking', '').strip()
        form_tracking = request.form.get('form_tracking', '').strip()
        
        # Contact fields
        hotline_phone = request.form.get('hotline_phone', '').strip()
        zalo_phone = request.form.get('zalo_phone', '').strip()
        google_form_link = request.form.get('google_form_link', '').strip()
        
        # Handle homepage vs landing validation
        if page_type == 'homepage':
            # Generate unique subdomain for homepage
            import time
            timestamp = str(int(time.time()))
            subdomain = f'_homepage_{timestamp}'
        else:
            # Validate subdomain for landing pages
            if not subdomain:
                return jsonify({'success': False, 'message': 'Subdomain is required for landing pages'}), 400
            
            # Sanitize subdomain
            from ..utils import sanitize_subdomain
            from ..constants import SUBDOMAIN_RESERVED_WORDS
            raw_lower = subdomain.strip().lower()
            sanitized_subdomain = sanitize_subdomain(subdomain)
            if not sanitized_subdomain:
                if raw_lower in SUBDOMAIN_RESERVED_WORDS:
                    return jsonify({'success': False, 'message': f'Subdomain "{subdomain}" là từ khóa hệ thống và không được phép. Vui lòng chọn tên khác (vd: ladi-ao, ao-phong-1).'}), 400
                return jsonify({'success': False, 'message': f'Subdomain "{subdomain}" không hợp lệ. Chỉ được dùng chữ cái thường, số và dấu gạch ngang.'}), 400
            
            subdomain = sanitized_subdomain
            
            # Check if subdomain already exists
            existing = repository.get_by_subdomain(subdomain)
            if existing:
                return jsonify({'success': False, 'message': f'Subdomain "{subdomain}" đã tồn tại'}), 400
        
        # Handle file upload (check both possible field names)
        zip_file = None
        if 'folder_zip' in request.files:
            zip_file = request.files['folder_zip']
        elif 'zipFile' in request.files:
            zip_file = request.files['zipFile']
        
        if not zip_file:
            return jsonify({'success': False, 'message': 'Không có file ZIP được upload'}), 400
        if zip_file.filename == '':
            return jsonify({'success': False, 'message': 'Không có file nào được chọn'}), 400
        
        # Validate ZIP structure
        validation_result = validate_zip_structure(zip_file)
        if validation_result['status'] == 'error':
            return jsonify({'success': False, 'message': validation_result['message']}), 400
        
        # Create target directory
        pub_root = current_app.config['PUBLISHED_ROOT']
        target_dir = os.path.join(pub_root, subdomain)
        
        if os.path.exists(target_dir):
            return jsonify({'success': False, 'message': f'Directory for subdomain "{subdomain}" already exists'}), 400
        
        os.makedirs(target_dir, exist_ok=True)
        
        try:
            # Extract and validate
            extracted_files, folder_structure = extract_and_validate_folder(zip_file, target_dir)
            
            # Process tracking codes
            head_snippet = global_site_tag
            body_snippet = "\n".join(filter(None, [phone_tracking, zalo_tracking, form_tracking]))
            
            if head_snippet or body_snippet:
                processed_files = process_html_tracking_in_folder(target_dir, head_snippet, body_snippet)

            # Rewrite absolute asset URLs to work under /landing/<subdomain>/
            try:
                rewrites = rewrite_asset_paths_in_folder(target_dir, subdomain)
            except Exception:
                rewrites = []
            
            # Save to database
            landing_data = {
                'subdomain': subdomain,
                'agent': agent,
                'page_type': page_type,
                'global_site_tag': global_site_tag,
                'phone_tracking': phone_tracking,
                'zalo_tracking': zalo_tracking,
                'form_tracking': form_tracking,
                'hotline_phone': hotline_phone,
                'zalo_phone': zalo_phone,
                'google_form_link': google_form_link,
                'status': 'active',
                'original_filename': zip_file.filename,
                'upload_type': 'folder',
                'folder_structure': json.dumps(folder_structure, ensure_ascii=False)
            }
            
            landing_id = repository.create_landing(landing_data)
            
            # If homepage, set as active
            if page_type == 'homepage':
                from .. import homepage_repository
                homepage_repository.set_active_homepage(landing_id)
            
            success_msg = 'Trang chủ đã được tạo thành công' if page_type == 'homepage' else f'Landing page "{subdomain}" đã được tạo thành công'
            
            return jsonify({
                'success': True,
                'message': success_msg,
                'landing_id': landing_id,
                'extracted_files_count': len(extracted_files)
            })
            
        except Exception as e:
            # Clean up on error
            if os.path.exists(target_dir):
                import shutil
                shutil.rmtree(target_dir, ignore_errors=True)
            raise e
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi tạo landing page: {str(e)}'}), 500


@landing_bp.route('/api/landingpages/<int:landing_id>', methods=['PUT'])
@login_required
def api_update(landing_id):
    """Update existing landing page"""
    try:
        landing = repository.get_landing(landing_id)
        if not landing:
            return jsonify({'success': False, 'message': 'Landing page not found'}), 404
        
        # Get updated data
        updates = {
            'agent': request.form.get('agent', '').strip(),
            'global_site_tag': request.form.get('global_site_tag', '').strip(),
            'phone_tracking': request.form.get('phone_tracking', '').strip(),
            'zalo_tracking': request.form.get('zalo_tracking', '').strip(),
            'form_tracking': request.form.get('form_tracking', '').strip(),
            'hotline_phone': request.form.get('hotline_phone', '').strip(),
            'zalo_phone': request.form.get('zalo_phone', '').strip(),
            'google_form_link': request.form.get('google_form_link', '').strip(),
        }
        
        # Handle new ZIP file upload (optional)
        if 'zipFile' in request.files and request.files['zipFile'].filename:
            zip_file = request.files['zipFile']
            
            # Validate ZIP structure
            validation_result = validate_zip_structure(zip_file)
            if validation_result['status'] == 'error':
                return jsonify({'success': False, 'message': validation_result['message']}), 400
            
            # Update published folder
            pub_root = current_app.config['PUBLISHED_ROOT']
            target_dir = os.path.join(pub_root, landing['subdomain'])
            
            # Backup current folder
            import shutil
            import tempfile
            with tempfile.TemporaryDirectory() as backup_dir:
                if os.path.exists(target_dir):
                    backup_path = os.path.join(backup_dir, 'backup')
                    shutil.copytree(target_dir, backup_path)
                
                try:
                    # Clear and recreate
                    if os.path.exists(target_dir):
                        shutil.rmtree(target_dir)
                    os.makedirs(target_dir, exist_ok=True)
                    
                    # Extract new files
                    extracted_files, folder_structure = extract_and_validate_folder(zip_file, target_dir)
                    
                    # Process tracking codes
                    head_snippet = updates['global_site_tag']
                    body_snippet = "\n".join(filter(None, [
                        updates['phone_tracking'], 
                        updates['zalo_tracking'], 
                        updates['form_tracking']
                    ]))
                    
                    if head_snippet or body_snippet:
                        processed_files = process_html_tracking_in_folder(target_dir, head_snippet, body_snippet)

                    # Rewrite absolute asset URLs to work under /landing/<subdomain>/
                    try:
                        rewrite_asset_paths_in_folder(target_dir, landing['subdomain'])
                    except Exception:
                        pass
                    
                    # Update folder structure in updates
                    updates['folder_structure'] = json.dumps(folder_structure, ensure_ascii=False)
                    updates['original_filename'] = zip_file.filename
                    
                except Exception as e:
                    # Restore backup on error
                    if os.path.exists(backup_path):
                        if os.path.exists(target_dir):
                            shutil.rmtree(target_dir)
                        shutil.copytree(backup_path, target_dir)
                    raise e
        
        # Update database
        success = repository.update_landing(landing_id, updates)
        
        if success:
            return jsonify({'success': True, 'message': 'Landing page đã được cập nhật thành công'})
        else:
            return jsonify({'success': False, 'message': 'Không thể cập nhật landing page'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi cập nhật landing page: {str(e)}'}), 500


@landing_bp.route('/api/landingpages/<int:landing_id>/status', methods=['PATCH'])
@login_required
def api_change_status(landing_id):
    """Change landing page status"""
    try:
        landing = repository.get_landing(landing_id)
        if not landing:
            return jsonify({'success': False, 'message': 'Landing page not found'}), 404
        
        new_status = request.json.get('status')
        # UI uses 'paused' instead of 'inactive'
        if new_status not in ['active', 'paused']:
            return jsonify({'success': False, 'message': 'Invalid status'}), 400
        
        success = repository.update_landing(landing_id, {'status': new_status})
        
        if success:
            # If this is a homepage and we just paused the active one, pick another available homepage automatically
            if landing.get('page_type') == 'homepage' and new_status == 'paused':
                try:
                    from .. import homepage_repository
                    # If this landing was active, demote it and promote another if possible
                    if landing.get('is_active') == 1:
                        homepage_repository.demote_homepage(landing_id)
                        replacement = homepage_repository.get_first_available_active_homepage()
                        if replacement and replacement.get('id') != landing_id:
                            homepage_repository.set_active_homepage(replacement['id'])
                except Exception as _e:
                    # non-fatal
                    pass
            return jsonify({'success': True, 'message': f'Trạng thái đã được đổi thành {new_status}'})
        else:
            return jsonify({'success': False, 'message': 'Không thể thay đổi trạng thái'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi thay đổi trạng thái: {str(e)}'}), 500


@landing_bp.route('/api/landingpages/<int:landing_id>', methods=['DELETE'])
@login_required
def api_delete(landing_id):
    """Delete landing page"""
    try:
        landing = repository.get_landing(landing_id)
        if not landing:
            return jsonify({'success': False, 'message': 'Landing page not found'}), 404
        
        # Delete published folder
        pub_root = current_app.config['PUBLISHED_ROOT']
        target_dir = os.path.join(pub_root, landing['subdomain'])
        
        if os.path.exists(target_dir):
            import shutil
            shutil.rmtree(target_dir, ignore_errors=True)
        
        # Before delete, if it's the active homepage, we will attempt to auto-promote another
        was_active_homepage = landing.get('page_type') == 'homepage' and landing.get('is_active') == 1
        
        # Delete from database
        success = repository.delete_landing(landing_id)
        
        if success:
            # Auto-promote next homepage if needed
            if was_active_homepage:
                try:
                    from .. import homepage_repository
                    replacement = homepage_repository.get_first_available_active_homepage()
                    if replacement:
                        homepage_repository.set_active_homepage(replacement['id'])
                except Exception as _e:
                    pass
            return jsonify({'success': True, 'message': 'Landing page đã được xóa thành công'})
        else:
            return jsonify({'success': False, 'message': 'Không thể xóa landing page'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi xóa landing page: {str(e)}'}), 500


# ============ LANDING PAGE UI ============

@landing_bp.route('/admin-panel-xyz123/edit/<int:landing_id>', methods=['GET'])
@login_required
def edit_landing(landing_id):
    """Edit landing page form"""
    landing = repository.get_landing(landing_id)
    if not landing:
        flash('Landing page not found', 'error')
        return redirect(url_for('auth.admin_dashboard'))
    
    agents_list = agents_repository.list_agents()
    return render_template('edit.html', 
                         landing=landing, 
                         agents=agents_list)