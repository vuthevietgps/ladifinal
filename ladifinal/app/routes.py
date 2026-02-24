# Legacy Routes - Only Essential Utilities and Helpers
import os
import re
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
from .constants import (TRACKING_TEMPLATE_HEAD, TRACKING_TEMPLATE_BODY, 
                        ALLOWED_EXTENSIONS, MAX_FILE_SIZE, MAX_TOTAL_SIZE, MAX_FILES,
                        HOMEPAGE_DEFAULT_SUBDOMAIN, ERROR_MESSAGES, BLOCKED_ROUTE_PREFIXES)
from .exceptions import ValidationError, FileUploadError, ZipProcessingError, SubdomainError

bp = Blueprint('main', __name__)

@bp.route('/giayphep-vanttai-landing')
def giayphep_vanttai_landing():
    """Landing page for giấy phép kinh doanh vận tải service"""
    return send_from_directory('../../giayphep-vanttai-landing', 'index.html')

@bp.route('/css/giayphep-vanttai-landing.css')
def giayphep_vanttai_styles():
    """CSS for giấy phép kinh doanh vận tải landing page"""
    return send_from_directory('../../giayphep-vanttai-landing', 'giayphep-vanttai-landing.css', mimetype='text/css')

@bp.route('/js/giayphep-vanttai-landing.js')
def giayphep_vanttai_script():
    """JS for giấy phép kinh doanh vận tải landing page"""
    return send_from_directory('../../giayphep-vanttai-landing', 'giayphep-vanttai-landing.js', mimetype='application/javascript')

@bp.route('/phu-hieu-xe')
def phu_hieu_xe():
    """Landing page for phù hiệu xe service"""
    return render_template('landing_phu_hieu_xe.html')

@bp.route('/phu-hieu-xe-can-gap')
def phu_hieu_xe_can_gap():
    """Landing page for xe đang chạy thiếu phù hiệu service"""
    return send_from_directory('../../phu-hieu-xe-can-gap', 'index.html')

@bp.route('/cap-giay-phep-vao-pho-cam')
def cap_giay_phep_vao_pho_cam():
    """Landing page for xe bị chặn vì phố cấm service"""
    return send_from_directory('../../cap-giay-phep-vao-pho-cam', 'index.html')

@bp.route('/mua-giay-phep-vao-pho-cam')
def mua_giay_phep_vao_pho_cam():
    """Landing page for mua giấy phép vào phố cấm - xử lý nhanh"""
    return send_from_directory('../../mua-giay-phep-vao-pho-cam', 'index.html')

@bp.route('/the-tap-huan-nghiep-vu-van-tai')
def the_tap_huan_nghiep_vu_van_tai():
    """Landing page for thẻ tập huấn nghiệp vụ vận tải gấp"""
    return send_from_directory('../../the-tap-huan-nghiep-vu-van-tai', 'index.html')

@bp.route('/phu-hieu-xe-check-new/')
def phu_hieu_xe_check():
    """Landing page for phù hiệu xe check service"""
    with open(os.path.join(current_app.static_folder, 'phu-hieu-xe-check-new', 'index.html'), 'r', encoding='utf-8') as f:
        return f.read()

def validate_zip_structure(zip_file):
    """Pre-validate ZIP structure and provide helpful feedback"""
    try:
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            file_list = zip_ref.namelist()
            
            # Check for index.html at different levels
            index_at_root = any(
                f.lower() in ['index.html', 'index.htm']
                for f in file_list
                if ('/' not in f and '\\' not in f)
            )
            
            if index_at_root:
                return {
                    'status': 'valid',
                    'message': 'ZIP structure is correct - index.html found at root level',
                    'index_location': 'root'
                }
            
            # Check for index.html in subfolders
            subfolders_with_index = []
            for file_path in file_list:
                if ('/' in file_path) or ('\\' in file_path):
                    parts = re.split(r'[\\\\/]+', file_path)
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
    
    extracted_files = []
    folder_structure = {}
    total_size = 0
    
    with tempfile.TemporaryDirectory() as temp_dir:
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            file_list = zip_ref.infolist()
            
            if len(file_list) > MAX_FILES:
                raise ValueError(f'Quá nhiều file. Tối đa {MAX_FILES} file được phép.')
            
            # Validate each file
            for file_info in file_list:
                if file_info.is_dir():
                    continue
                    
                # Check file size
                if file_info.file_size > MAX_FILE_SIZE:
                    raise ValueError(f'File {file_info.filename} quá lớn. Tối đa 50MB mỗi file.')
                
                total_size += file_info.file_size
                if total_size > MAX_TOTAL_SIZE:
                    raise ValueError('Tổng dung lượng folder quá lớn. Tối đa 500MB.')
                
                # Check file extension
                _, ext = os.path.splitext(file_info.filename.lower())
                if ext not in ALLOWED_EXTENSIONS:
                    raise ValueError(f'File extension {ext} không được phép. Chỉ chấp nhận: {", ".join(ALLOWED_EXTENSIONS)}')
                
                # Check for dangerous file paths
                if '..' in file_info.filename or file_info.filename.startswith('/'):
                    raise ValueError(f'Đường dẫn file không an toàn: {file_info.filename}')

            # Extract all files with normalized paths (handle Windows backslashes as separators)
            for file_info in file_list:
                if file_info.is_dir():
                    continue
                # Normalize path separators to POSIX-style first, then split on both
                raw_name = file_info.filename
                # Remove any leading separators or current directory references
                raw_name = raw_name.lstrip('/\\')
                parts = [p for p in re.split(r'[\\\\/]+', raw_name) if p not in ('', '.')]
                if any(p == '..' for p in parts):
                    raise ValueError(f'Đường dẫn file không an toàn: {file_info.filename}')
                normalized_rel_path = os.path.join(*parts) if parts else os.path.basename(raw_name)
                dest_path = os.path.join(temp_dir, normalized_rel_path)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with zip_ref.open(file_info) as src, open(dest_path, 'wb') as dst:
                    shutil.copyfileobj(src, dst)
        
        # Smart detection of index.html location
        index_html_path = None
        root_source_dir = None
        
        # First, try to find index.html at root level
        for file in os.listdir(temp_dir):
            # Handle possibility of previously malformed names like 'index.html' vs 'index.htm'
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
        
        # As a safety net, rename any files that still contain backslashes in their names (edge cases)
        for root, dirs, files in os.walk(temp_dir):
            for name in files:
                if '\\' in name:
                    old_path = os.path.join(root, name)
                    # Split on backslashes and move to proper nested folders under the same root
                    parts = name.split('\\')
                    new_subpath = os.path.join(*parts)
                    new_path = os.path.join(root, new_subpath)
                    os.makedirs(os.path.dirname(new_path), exist_ok=True)
                    if not os.path.exists(new_path):
                        os.replace(old_path, new_path)
        
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


# ============ UTILITY ROUTES ============

# Serve published (dev helper only – in production Nginx will serve)
@bp.route('/_dev_published/<path:sub>/<path:filename>')
def dev_published(sub, filename):
    root = current_app.config['PUBLISHED_ROOT']
    return send_from_directory(os.path.join(root, sub), filename)

# Additional route for /published/ path (easier access)
@bp.route('/published/<path:subpath>')
def serve_published(subpath):
    """Serve files from published directory"""
    root = current_app.config['PUBLISHED_ROOT']
    # Remove trailing slash and split path
    subpath = subpath.rstrip('/')
    parts = [p for p in subpath.split('/') if p]  # Filter empty strings
    
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


# Temporary debug route to inspect Jinja template search paths
@bp.route('/_debug_paths')
def debug_paths():
    import os
    loader = getattr(current_app, 'jinja_loader', None) or getattr(current_app, 'jinja_env', None)
    searchpath = []
    if hasattr(loader, 'searchpath'):
        try:
            searchpath = list(loader.searchpath)
        except Exception:
            searchpath = []
    # Check typical templates
    guesses = [
        os.path.join(p, 'company_home.html') for p in searchpath
    ]
    exists = {g: os.path.exists(g) for g in guesses}
    return jsonify({
        'searchpath': searchpath,
        'exists': exists
    })


# Catch-all for homepage assets (placed last to avoid shadowing other routes)
@bp.route('/<path:filename>')
def homepage_catchall(filename):
    """Serve static files from the homepage theme folder if they exist and have safe extensions."""
    # Do not intercept important app paths
    for p in BLOCKED_ROUTE_PREFIXES:
        if filename.startswith(p):
            return "Not Found", 404
    
    allowed_exts = {'.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.txt', '.json', '.woff', '.woff2', '.ttf', '.map'}
    _, ext = os.path.splitext(filename.lower())
    if ext not in allowed_exts:
        return "Not Found", 404
        
    pub_root = current_app.config['PUBLISHED_ROOT']
    # Resolve active homepage subdomain; fallback to first available with files, else default
    try:
        from . import homepage_repository
        active = homepage_repository.get_active_homepage()
        subdomain = None
        if active:
            subdomain = active.get('subdomain')
            # If index.html missing, try first available candidate
            if subdomain and not os.path.exists(os.path.join(pub_root, subdomain, 'index.html')):
                cand = homepage_repository.get_first_available_active_homepage()
                subdomain = cand.get('subdomain') if cand else subdomain
        if not subdomain:
            cand = homepage_repository.get_first_available_active_homepage()
            subdomain = cand.get('subdomain') if cand else HOMEPAGE_DEFAULT_SUBDOMAIN
    except Exception:
        subdomain = HOMEPAGE_DEFAULT_SUBDOMAIN
    homepage_dir = os.path.join(pub_root, subdomain)
    full_path = os.path.join(homepage_dir, filename)
    
    # Prevent path traversal
    if not os.path.abspath(full_path).startswith(os.path.abspath(homepage_dir)):
        return "Invalid path", 400
    if not os.path.exists(full_path):
        return "Not Found", 404
        
    response = send_from_directory(homepage_dir, filename)
    response.headers['X-Homepage-Subdomain'] = subdomain
    if ext in ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']:
        response.headers['Cache-Control'] = 'public, max-age=86400'
        response.headers['Expires'] = 'Thu, 31 Dec 2037 23:55:55 GMT'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response