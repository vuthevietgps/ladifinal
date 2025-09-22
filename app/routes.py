
import os
import json
import zipfile
import tempfile
import shutil
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app, send_from_directory
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from .utils import sanitize_subdomain, inject_tracking
from . import repository
from . import agents_repository as agents
from .auth import User
from .forms import LoginForm

bp = Blueprint('main', __name__)

TRACKING_TEMPLATE_HEAD = """<!-- Global Site Tag -->\n{global_site_tag}\n<!-- /Global Site Tag -->"""
TRACKING_TEMPLATE_BODY = """<!-- Tracking Codes -->\n<script>window.PHONE_TRACKING={phone_tracking!r};</script>\n<script>window.ZALO_TRACKING={zalo_tracking!r};</script>\n<script>window.FORM_TRACKING={form_tracking!r};</script>\n<!-- /Tracking Codes -->"""

def validate_zip_structure(zip_file):
    """Pre-validate ZIP structure and provide helpful feedback"""
    try:
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            file_list = zip_ref.namelist()
            
            # Check for index.html at different levels
            index_at_root = any(f.lower() in ['index.html', 'index.htm'] for f in file_list if '/' not in f)
            
            if index_at_root:
                return {
                    'status': 'valid',
                    'message': 'ZIP structure is correct - index.html found at root level',
                    'index_location': 'root'
                }
            
            # Check for index.html in subfolders
            subfolders_with_index = []
            for file_path in file_list:
                if '/' in file_path:
                    parts = file_path.split('/')
                    if len(parts) == 2 and parts[1].lower() in ['index.html', 'index.htm']:
                        subfolders_with_index.append(parts[0])
            
            if subfolders_with_index:
                return {
                    'status': 'fixable',
                    'message': f'index.html found in subfolder(s): {", ".join(subfolders_with_index)}. System will auto-extract from subfolder.',
                    'index_location': 'subfolder',
                    'subfolders': subfolders_with_index
                }
            
            return {
                'status': 'error',
                'message': 'No index.html found in ZIP file (checked root and 1-level subfolders)',
                'index_location': 'not_found'
            }
            
    except zipfile.BadZipFile:
        return {
            'status': 'error',
            'message': 'Invalid ZIP file format',
            'index_location': 'not_found'
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': f'Error reading ZIP file: {str(e)}',
            'index_location': 'not_found'
        }

def extract_and_validate_folder(zip_file, target_dir):
    """Extract ZIP file and validate folder structure with auto-subfolder detection"""
    allowed_extensions = {'.html', '.htm', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.txt', '.json'}
    max_file_size = 50 * 1024 * 1024  # 50MB per file
    max_total_size = 500 * 1024 * 1024  # 500MB total
    max_files = 500  # Max files
    
    extracted_files = []
    folder_structure = {}
    total_size = 0
    
    with tempfile.TemporaryDirectory() as temp_dir:
        # Extract to temp directory first
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            file_list = zip_ref.infolist()
            
            if len(file_list) > max_files:
                raise ValueError(f'Quá nhiều file. Tối đa {max_files} file được phép.')
            
            # Validate each file
            for file_info in file_list:
                if file_info.is_dir():
                    continue
                    
                # Check file size
                if file_info.file_size > max_file_size:
                    raise ValueError(f'File {file_info.filename} quá lớn. Tối đa 50MB mỗi file.')
                
                total_size += file_info.file_size
                if total_size > max_total_size:
                    raise ValueError('Tổng dung lượng folder quá lớn. Tối đa 500MB.')
                
                # Check file extension
                _, ext = os.path.splitext(file_info.filename.lower())
                if ext not in allowed_extensions:
                    raise ValueError(f'File extension {ext} không được phép. Chỉ chấp nhận: {", ".join(allowed_extensions)}')
                
                # Check for dangerous file paths
                if '..' in file_info.filename or file_info.filename.startswith('/'):
                    raise ValueError(f'Đường dẫn file không an toàn: {file_info.filename}')
            
            # Extract all files
            zip_ref.extractall(temp_dir)
        
        # Smart detection of index.html location
        index_html_path = None
        root_source_dir = None
        
        # First, try to find index.html at root level
        for file in os.listdir(temp_dir):
            if file.lower() in ['index.html', 'index.htm']:
                index_html_path = os.path.join(temp_dir, file)
                root_source_dir = temp_dir
                break
        
        # If not found at root, look in subfolders (one level deep only)
        if not index_html_path:
            for item in os.listdir(temp_dir):
                item_path = os.path.join(temp_dir, item)
                if os.path.isdir(item_path):
                    for file in os.listdir(item_path):
                        if file.lower() in ['index.html', 'index.htm']:
                            index_html_path = os.path.join(item_path, file)
                            root_source_dir = item_path
                            print(f"Found index.html in subfolder: {item}/")
                            break
                    if index_html_path:
                        break
        
        if not index_html_path:
            raise ValueError('Không tìm thấy file index.html trong folder (tìm kiếm ở root và subfolder level 1).')
        
        # Copy files from the detected source directory to target directory
        for root, dirs, files in os.walk(root_source_dir):
            for file in files:
                src_path = os.path.join(root, file)
                rel_path = os.path.relpath(src_path, root_source_dir)
                dest_path = os.path.join(target_dir, rel_path)
                
                # Create directory if needed
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                
                # Copy file
                shutil.copy2(src_path, dest_path)
                
                # Get file info
                file_size = os.path.getsize(src_path)
                _, ext = os.path.splitext(file.lower())
                
                # Determine file type
                if ext in ['.html', '.htm']:
                    file_type = 'html'
                elif ext in ['.css']:
                    file_type = 'css'
                elif ext in ['.js']:
                    file_type = 'js'
                elif ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']:
                    file_type = 'image'
                else:
                    file_type = 'other'
                
                extracted_files.append({
                    'path': rel_path,
                    'original_name': file,
                    'type': file_type,
                    'size': file_size
                })
                
                # Build folder structure
                path_parts = rel_path.split(os.sep)
                current = folder_structure
                for part in path_parts[:-1]:
                    if part not in current:
                        current[part] = {}
                    current = current[part]
                current[path_parts[-1]] = {'type': file_type, 'size': file_size}
    
    return extracted_files, folder_structure

def process_html_tracking_in_folder(target_dir, head_snippet, body_snippet):
    """Process all HTML files in folder to inject tracking codes"""
    processed_files = []
    
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.lower().endswith(('.html', '.htm')):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, target_dir)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Inject tracking
                    processed_content = inject_tracking(content, head_snippet, body_snippet)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(processed_content)
                        
                    processed_files.append(rel_path)
                except Exception as e:
                    raise Exception(f'Lỗi xử lý file {rel_path}: {str(e)}')
    
    return processed_files

@bp.route('/landing/<subdomain>')
def serve_landing_simple(subdomain):
    """Serve published landing pages via /landing/<subdomain> URL"""
    from flask import make_response
    
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

# Serve static assets for landing pages
@bp.route('/landing/<subdomain>/<path:filename>')  
def serve_landing_assets_simple(subdomain, filename):
    """Serve static assets (CSS, JS, images, etc.) for landing pages with proper MIME types"""
    from flask import make_response
    
    pub_root = current_app.config['PUBLISHED_ROOT']
    landing_dir = os.path.join(pub_root, subdomain)
    full_path = os.path.join(landing_dir, filename)
    
    if not os.path.exists(full_path):
        return "File not found", 404
    
    # Get file extension to determine MIME type
    _, ext = os.path.splitext(filename.lower())
    
    # Set appropriate MIME types
    mimetype = None
    if ext == '.css':
        mimetype = 'text/css'
    elif ext == '.js':
        mimetype = 'application/javascript'
    elif ext in ['.jpg', '.jpeg']:
        mimetype = 'image/jpeg'
    elif ext == '.png':
        mimetype = 'image/png'
    elif ext == '.gif':
        mimetype = 'image/gif'
    elif ext == '.svg':
        mimetype = 'image/svg+xml'
    elif ext == '.webp':
        mimetype = 'image/webp'
    elif ext == '.ico':
        mimetype = 'image/x-icon'
    elif ext in ['.html', '.htm']:
        mimetype = 'text/html'
    elif ext == '.json':
        mimetype = 'application/json'
    elif ext == '.txt':
        mimetype = 'text/plain'
    
    # Create response with proper headers
    response = make_response(send_from_directory(landing_dir, filename, mimetype=mimetype))
    
    # Add cache headers for static assets (but allow no-cache for debugging)
    if request.args.get('debug') == '1':
        # Debug mode - no cache
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    else:
        # Production mode - cache
        if ext in ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']:
            response.headers['Cache-Control'] = 'public, max-age=86400'  # 1 day cache
            response.headers['Expires'] = 'Thu, 31 Dec 2037 23:55:55 GMT'
    
    # Security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    
    return response

# Company homepage (public)
@bp.route('/')
def company_home():
    return render_template('company_home.html')

# Login page
@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.admin_dashboard'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.get_by_username(form.username.data)
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            if not next_page or not next_page.startswith('/'):
                next_page = url_for('main.admin_dashboard')
            flash('Đăng nhập thành công!', 'success')
            return redirect(next_page)
        else:
            flash('Tên đăng nhập hoặc mật khẩu không đúng', 'error')
    
    return render_template('login.html', form=form)

# Logout
@bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Đã đăng xuất thành công', 'info')
    return redirect(url_for('main.company_home'))

# Admin dashboard (protected with secret URL)
@bp.route('/admin-panel-xyz123/')
@login_required
def admin_dashboard():
    filters = {
        'agent': request.args.get('agent','').strip(),
        'status': request.args.get('status','').strip(),
        'q': request.args.get('q','').strip(),
    }
    landings = repository.list_landings(filters)
    agents_list = agents.list_agents()
    return render_template('index.html', landings=landings, filters=filters, agents_list=agents_list)

# Admin agents page  
@bp.route('/admin-panel-xyz123/agents')
@login_required
def admin_agents():
    agents_list = agents.list_agents()
    return render_template('agents.html', agents=agents_list)

@bp.route('/landing/<int:landing_id>')
def landing_detail(landing_id):
    landing = repository.get_landing(landing_id)
    if not landing:
        flash('Không tìm thấy landing page','danger')
        return redirect(url_for('main.admin_dashboard'))
    return render_template('detail.html', landing=landing)

@bp.route('/api/landingpages', methods=['GET'])
@login_required
def api_list():
    filters = {
        'agent': request.args.get('agent','').strip(),
        'status': request.args.get('status','').strip(),
        'q': request.args.get('q','').strip(),
    }
    return jsonify(repository.list_landings(filters))

@bp.route('/api/landingpages', methods=['POST'])
@login_required
def api_create():
    subdomain = sanitize_subdomain(request.form.get('subdomain',''))
    if not subdomain:
        return jsonify({'error':'Subdomain không hợp lệ'}), 400
    if repository.get_by_subdomain(subdomain):
        return jsonify({'error':'Subdomain đã tồn tại'}), 400

    agent = request.form.get('agent','').strip()
    upload_type = request.form.get('upload_type', 'single').strip()
    global_site_tag = request.form.get('global_site_tag','').strip()
    phone_tracking = request.form.get('phone_tracking','').strip()
    zalo_tracking = request.form.get('zalo_tracking','').strip()
    form_tracking = request.form.get('form_tracking','').strip()
    hotline_phone = request.form.get('hotline_phone','').strip()
    zalo_phone = request.form.get('zalo_phone','').strip()
    google_form_link = request.form.get('google_form_link','').strip()

    pub_root = current_app.config['PUBLISHED_ROOT']
    target_dir = os.path.join(pub_root, subdomain)
    os.makedirs(target_dir, exist_ok=True)
    
    head_snippet = TRACKING_TEMPLATE_HEAD.format(global_site_tag=global_site_tag)
    body_snippet = TRACKING_TEMPLATE_BODY.format(
        phone_tracking=phone_tracking,
        zalo_tracking=zalo_tracking,
        form_tracking=form_tracking,
    )

    extracted_files = []
    folder_structure = {}
    original_filename = ''
    
    if upload_type == 'folder':
        # Handle folder upload
        zip_file = request.files.get('folder_zip')
        if not zip_file or zip_file.filename == '':
            return jsonify({'error':'Chưa chọn file ZIP'}), 400
        
        # Pre-validate ZIP structure
        zip_validation = validate_zip_structure(zip_file)
        if zip_validation['status'] == 'error':
            return jsonify({'error': f'Lỗi ZIP file: {zip_validation["message"]}'}), 400
            
        try:
            # Reset file pointer after validation
            zip_file.seek(0)
            
            extracted_files, folder_structure = extract_and_validate_folder(zip_file, target_dir)
            processed_html_files = process_html_tracking_in_folder(target_dir, head_snippet, body_snippet)
            original_filename = secure_filename(zip_file.filename)
            
            # Prepare success message with structure info
            success_message = f'Tạo thành công! Đã upload {len(extracted_files)} file từ folder.'
            if zip_validation['status'] == 'fixable':
                success_message += f' (Đã tự động extract từ subfolder: {zip_validation["subfolders"][0]})'
            
            # Save file metadata to database
            landing_id = repository.create_landing({
                'subdomain': subdomain,
                'agent': agent,
                'global_site_tag': global_site_tag,
                'phone_tracking': phone_tracking,
                'zalo_tracking': zalo_tracking,
                'form_tracking': form_tracking,
                'hotline_phone': hotline_phone,
                'zalo_phone': zalo_phone,
                'google_form_link': google_form_link,
                'status': 'active',
                'original_filename': original_filename,
                'upload_type': 'folder',
                'folder_structure': json.dumps(folder_structure)
            })
            
            # Save individual file records
            from .db import get_db
            db = get_db()
            for file_info in extracted_files:
                db.execute(
                    'INSERT INTO landing_files (landing_id, file_path, original_name, file_type, file_size) VALUES (?, ?, ?, ?, ?)',
                    (landing_id, file_info['path'], file_info['original_name'], file_info['type'], file_info['size'])
                )
            db.commit()
            
            return jsonify({
                'id': landing_id,
                'message': success_message,
                'upload_type': 'folder',
                'files_count': len(extracted_files),
                'html_files_processed': len(processed_html_files),
                'structure_info': zip_validation['message']
            })
            
        except ValueError as e:
            # Clean up on validation error
            if os.path.exists(target_dir):
                shutil.rmtree(target_dir)
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            # Clean up on other errors
            if os.path.exists(target_dir):
                shutil.rmtree(target_dir)
            return jsonify({'error': f'Lỗi xử lý folder: {str(e)}'}), 500
    
    else:
        # Single file upload is no longer supported - only folder upload allowed
        return jsonify({'error': 'Chỉ hỗ trợ upload folder (ZIP file). Vui lòng chọn upload_type=folder và tải lên file ZIP.'}), 400

@bp.route('/api/landingpages/<int:landing_id>', methods=['PUT'])
@login_required
def api_update(landing_id):
    landing = repository.get_landing(landing_id)
    if not landing:
        return jsonify({'error':'Không tồn tại'}), 404

    # Only allow updating metadata, not files - use folder upload to replace entire landing page
    agent = request.form.get('agent', landing['agent']).strip()
    global_site_tag = request.form.get('global_site_tag', landing['global_site_tag'] or '').strip()
    phone_tracking = request.form.get('phone_tracking', landing['phone_tracking'] or '').strip()
    zalo_tracking = request.form.get('zalo_tracking', landing['zalo_tracking'] or '').strip()
    form_tracking = request.form.get('form_tracking', landing['form_tracking'] or '').strip()
    hotline_phone = request.form.get('hotline_phone', landing.get('hotline_phone') or '').strip()
    zalo_phone = request.form.get('zalo_phone', landing.get('zalo_phone') or '').strip()
    google_form_link = request.form.get('google_form_link', landing.get('google_form_link') or '').strip()

    # Check if new folder upload is provided
    zip_file = request.files.get('folder_zip')
    if zip_file and zip_file.filename:
        # If uploading new folder, process it completely
        pub_root = current_app.config['PUBLISHED_ROOT']
        target_dir = os.path.join(pub_root, landing['subdomain'])
        
        # Remove existing files
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
        os.makedirs(target_dir, exist_ok=True)
        
        # Validate and extract new ZIP
        zip_validation = validate_zip_structure(zip_file)
        if zip_validation['status'] == 'error':
            return jsonify({'error': f'Lỗi ZIP file: {zip_validation["message"]}'}), 400
        
        try:
            zip_file.seek(0)
            head_snippet = TRACKING_TEMPLATE_HEAD.format(global_site_tag=global_site_tag)
            body_snippet = TRACKING_TEMPLATE_BODY.format(
                phone_tracking=phone_tracking,
                zalo_tracking=zalo_tracking,
                form_tracking=form_tracking,
            )
            
            extracted_files, folder_structure = extract_and_validate_folder(zip_file, target_dir)
            processed_html_files = process_html_tracking_in_folder(target_dir, head_snippet, body_snippet)
            
            # Update database with new folder info
            repository.update_landing(landing_id, {
                'agent': agent,
                'global_site_tag': global_site_tag,
                'phone_tracking': phone_tracking,
                'zalo_tracking': zalo_tracking,
                'form_tracking': form_tracking,
                'hotline_phone': hotline_phone,
                'zalo_phone': zalo_phone,
                'google_form_link': google_form_link,
                'original_filename': secure_filename(zip_file.filename),
                'upload_type': 'folder',
                'folder_structure': json.dumps(folder_structure)
            })
            
            return jsonify({
                'message': f'Cập nhật thành công! Đã upload {len(extracted_files)} file từ folder mới.',
                'files_count': len(extracted_files),
                'html_files_processed': len(processed_html_files)
            })
            
        except Exception as e:
            return jsonify({'error': f'Lỗi xử lý folder: {str(e)}'}), 500
    
    else:
        # Only update tracking metadata without changing files
        pub_root = current_app.config['PUBLISHED_ROOT']
        target_dir = os.path.join(pub_root, landing['subdomain'])
        
        head_snippet = TRACKING_TEMPLATE_HEAD.format(global_site_tag=global_site_tag)
        body_snippet = TRACKING_TEMPLATE_BODY.format(
            phone_tracking=phone_tracking,
            zalo_tracking=zalo_tracking,
            form_tracking=form_tracking,
        )
        
        # Re-process existing HTML files with new tracking codes
        try:
            processed_html_files = process_html_tracking_in_folder(target_dir, head_snippet, body_snippet)
            
            repository.update_landing(landing_id, {
                'agent': agent,
                'global_site_tag': global_site_tag,
                'phone_tracking': phone_tracking,
                'zalo_tracking': zalo_tracking,
                'form_tracking': form_tracking,
                'hotline_phone': hotline_phone,
                'zalo_phone': zalo_phone,
                'google_form_link': google_form_link
            })
            
            return jsonify({
                'message': 'Cập nhật tracking codes thành công!',
                'html_files_processed': len(processed_html_files)
            })
            
        except Exception as e:
            return jsonify({'error': f'Lỗi cập nhật tracking codes: {str(e)}'}), 500

@bp.route('/api/landingpages/<int:landing_id>/status', methods=['PATCH'])
@login_required
def api_change_status(landing_id):
    landing = repository.get_landing(landing_id)
    if not landing:
        return jsonify({'error':'Không tồn tại'}), 404
    new_status = request.json.get('status') if request.is_json else request.form.get('status')
    if new_status not in ('active','paused'):
        return jsonify({'error':'Trạng thái không hợp lệ'}), 400

    pub_root = current_app.config['PUBLISHED_ROOT']
    target_dir = os.path.join(pub_root, landing['subdomain'])
    index_file = os.path.join(target_dir, 'index.html')
    paused_file = os.path.join(target_dir, 'index.paused.html')

    if new_status == 'paused' and landing['status'] != 'paused':
        if os.path.exists(index_file):
            os.replace(index_file, paused_file)
            with open(index_file, 'w', encoding='utf-8') as f:
                f.write('<html><head><meta charset="utf-8"><title>Tạm dừng</title></head><body><h3>Landing page đang tạm dừng.</h3></body></html>')
    elif new_status == 'active' and landing['status'] == 'paused':
        if os.path.exists(paused_file):
            if os.path.exists(index_file):
                os.remove(index_file)
            os.replace(paused_file, index_file)

    repository.update_landing(landing_id, {'status': new_status})
    return jsonify({'message':'Đổi trạng thái thành công'})

@bp.route('/api/landingpages/<int:landing_id>', methods=['DELETE'])
@login_required
def api_delete(landing_id):
    landing = repository.get_landing(landing_id)
    if not landing:
        return jsonify({'error':'Không tồn tại'}), 404
    repository.delete_landing(landing_id)
    return jsonify({'message':'Đã xóa'})

# Basic HTML pages (reuse API via JS later if needed)
@bp.route('/admin-panel-xyz123/edit/<int:landing_id>', methods=['GET'])
@login_required  
def edit_page(landing_id):
    landing = repository.get_landing(landing_id)
    if not landing:
        flash('Không tìm thấy','danger')
        return redirect(url_for('main.admin_dashboard'))
    return render_template('edit.html', landing=landing, agents_list=agents.list_agents())

# Serve published (dev helper only – in production Nginx will serve)
@bp.route('/_dev_published/<path:sub>/<path:filename>')
def dev_published(sub, filename):
    root = current_app.config['PUBLISHED_ROOT']
    return send_from_directory(os.path.join(root, sub), filename)

# Serve assets for subdomains  
@bp.route('/_dev_published/<path:sub>/assets/<path:filename>')
def dev_published_assets(sub, filename):
    root = current_app.config['PUBLISHED_ROOT']
    assets_dir = os.path.join(root, sub, 'assets')
    return send_from_directory(assets_dir, filename)

# ---------------- Agents UI & API -----------------
@bp.route('/api/agents', methods=['GET'])
@login_required
def api_agents_list():
    return jsonify(agents.list_agents())

@bp.route('/api/agents', methods=['POST'])
@login_required
def api_agents_create():
    name = request.form.get('name','').strip()
    phone = request.form.get('phone','').strip()
    if not name:
        return jsonify({'error':'Tên đại lý bắt buộc'}), 400
    agent_id = agents.create_agent(name, phone)
    return jsonify({'id': agent_id, 'message':'Tạo thành công'})

@bp.route('/api/agents/<int:agent_id>', methods=['PUT'])
@login_required
def api_agents_update(agent_id):
    a = agents.get_agent(agent_id)
    if not a:
        return jsonify({'error':'Không tồn tại'}), 404
    name = request.form.get('name','').strip()
    phone = request.form.get('phone','').strip()
    if not name:
        return jsonify({'error':'Tên đại lý bắt buộc'}), 400
    agents.update_agent(agent_id, name, phone)
    return jsonify({'message':'Cập nhật thành công'})

@bp.route('/api/agents/<int:agent_id>', methods=['DELETE'])
@login_required
def api_agents_delete(agent_id):
    a = agents.get_agent(agent_id)
    if not a:
        return jsonify({'error':'Không tồn tại'}), 404
    agents.delete_agent(agent_id)
    return jsonify({'message':'Đã xóa'})
