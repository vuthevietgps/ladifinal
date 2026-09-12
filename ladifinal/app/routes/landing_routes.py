# Landing Pages Management Module
from flask import Blueprint, request, jsonify, render_template, flash, redirect, url_for, current_app, send_from_directory, make_response
from flask_login import login_required
import os
import json
import re
from html import escape
from .. import repository, agents_repository
from .file_handler import (
    validate_zip_structure,
    extract_and_validate_folder,
    process_html_tracking_in_folder,
    rewrite_asset_paths_in_folder,
)
from ..constants import (
    MIME_TYPES,
    STATIC_ASSETS_CACHE_TIME,
    CACHE_EXPIRES_DATE,
    ERROR_MESSAGES,
    TRACKING_TEMPLATE_HEAD,
)
from ..exceptions import ValidationError, FileUploadError, ZipProcessingError, SubdomainError

landing_bp = Blueprint('landing', __name__)
PROJECT_ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
LANDINGPAGES_COMPLETED_DIR = os.path.join(PROJECT_ROOT_DIR, 'landingpages-thanh-pham')

GA_TRACKING_ID_PATTERN = re.compile(r'^(?:G|GT)-[A-Za-z0-9]+$')
FB_PIXEL_ID_PATTERN = re.compile(r'^\d{10,20}$')
TIKTOK_PIXEL_ID_PATTERN = re.compile(r'^[A-Za-z0-9]+$')
GOOGLE_ADS_CONVERSION_ID_PATTERN = re.compile(r'^(?:AW-)?\d+$', re.IGNORECASE)
GOOGLE_ADS_LABEL_PATTERN = re.compile(r'^[A-Za-z0-9_-]{3,100}$')


def validate_tracking_ids(
    ga_tracking_id: str,
    fb_pixel_id: str,
    tiktok_pixel_id: str,
    google_ads_conversion_id: str,
    google_ads_label_phone: str,
    google_ads_label_zalo: str
):
    """Validate tracking IDs and Google Ads conversion labels."""
    if ga_tracking_id and not GA_TRACKING_ID_PATTERN.match(ga_tracking_id):
        return False, 'Google tag ID không hợp lệ. Định dạng đúng: G-XXXXXXXXXX hoặc GT-XXXXXXXXXX'
    if fb_pixel_id and not FB_PIXEL_ID_PATTERN.match(fb_pixel_id):
        return False, 'Facebook Pixel ID không hợp lệ. Chỉ được nhập chuỗi số 10-20 chữ số.'
    if tiktok_pixel_id and not TIKTOK_PIXEL_ID_PATTERN.match(tiktok_pixel_id):
        return False, 'TikTok Pixel ID không hợp lệ. Chỉ gồm chữ và số.'
    if google_ads_conversion_id and not GOOGLE_ADS_CONVERSION_ID_PATTERN.match(google_ads_conversion_id):
        return False, 'Mã chuyển đổi Google Ads không hợp lệ. Nhập dạng số (vd: 16590250699) hoặc AW-16590250699.'
    if google_ads_label_phone and not GOOGLE_ADS_LABEL_PATTERN.match(google_ads_label_phone):
        return False, 'Nhãn chuyển đổi SỐ ĐIỆN THOẠI không hợp lệ. Chỉ gồm chữ, số, gạch ngang hoặc gạch dưới.'
    if google_ads_label_zalo and not GOOGLE_ADS_LABEL_PATTERN.match(google_ads_label_zalo):
        return False, 'Nhãn chuyển đổi ZALO không hợp lệ. Chỉ gồm chữ, số, gạch ngang hoặc gạch dưới.'
    if (google_ads_label_phone or google_ads_label_zalo) and not google_ads_conversion_id:
        return False, 'Bạn đã nhập nhãn chuyển đổi nhưng chưa nhập Mã chuyển đổi Google Ads.'
    return True, ''


def build_tracking_snippets(
    global_site_tag: str,
    ga_tracking_id: str,
    fb_pixel_id: str,
    tiktok_pixel_id: str,
    google_ads_conversion_id: str,
    google_ads_label_phone: str,
    google_ads_label_zalo: str
):
    """Build tracking snippets with JSON-safe values for injected JavaScript."""
    has_head_tracking = any([
        global_site_tag,
        ga_tracking_id,
        fb_pixel_id,
        tiktok_pixel_id,
        google_ads_conversion_id,
        google_ads_label_phone,
        google_ads_label_zalo
    ])

    head_snippet = TRACKING_TEMPLATE_HEAD.format(
        global_site_tag=global_site_tag or '',
        ga_id_json=json.dumps(ga_tracking_id or None),
        fb_pixel_id_json=json.dumps(fb_pixel_id or None),
        tiktok_pixel_id_json=json.dumps(tiktok_pixel_id or None),
        google_ads_conversion_id_json=json.dumps(google_ads_conversion_id or None),
        google_ads_phone_label_json=json.dumps(google_ads_label_phone or None),
        google_ads_zalo_label_json=json.dumps(google_ads_label_zalo or None),
    ) if has_head_tracking else ''

    body_snippet = ''

    return head_snippet, body_snippet


def apply_tracking_to_folder(target_dir: str, landing_data: dict):
    """Rebuild and apply tracking snippets for all HTML files in a published folder."""
    head_snippet, body_snippet = build_tracking_snippets(
        landing_data.get('global_site_tag', ''),
        landing_data.get('ga_tracking_id', ''),
        landing_data.get('fb_pixel_id', ''),
        landing_data.get('tiktok_pixel_id', ''),
        landing_data.get('google_ads_conversion_id', ''),
        landing_data.get('google_ads_label_phone', ''),
        landing_data.get('google_ads_label_zalo', ''),
    )
    return process_html_tracking_in_folder(target_dir, head_snippet, body_snippet)


def create_default_page_content(
    target_dir: str,
    page_type: str,
    subdomain: str,
    hotline_phone: str,
    zalo_phone: str,
    google_form_link: str
):
    """Create a minimal default page when user does not upload a ZIP file."""
    os.makedirs(target_dir, exist_ok=True)

    safe_subdomain = escape(subdomain or '')
    safe_hotline = escape(hotline_phone or '')
    safe_zalo = escape(zalo_phone or '')
    safe_form_link = escape(google_form_link or '')
    page_label = 'Homepage' if page_type == 'homepage' else 'Landing Page'

    contact_items = []
    if safe_hotline:
        contact_items.append(f'<li>Hotline: <a href="tel:{safe_hotline}">{safe_hotline}</a></li>')
    if safe_zalo:
        contact_items.append(f'<li>Zalo: <a href="https://zalo.me/{safe_zalo}" target="_blank" rel="noopener">{safe_zalo}</a></li>')
    if safe_form_link:
        contact_items.append(f'<li>Form: <a href="{safe_form_link}" target="_blank" rel="noopener">Điền thông tin</a></li>')
    if not contact_items:
        contact_items.append('<li>Chưa cấu hình thông tin liên hệ.</li>')

    index_html = f"""<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{page_label} - {safe_subdomain}</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f7f8fa; color: #1f2937; }}
    .wrap {{ max-width: 760px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08); }}
    h1 {{ margin: 0 0 8px; font-size: 28px; }}
    .muted {{ color: #6b7280; margin: 0 0 20px; }}
    ul {{ margin: 0; padding-left: 18px; line-height: 1.8; }}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>{page_label}</h1>
    <p class="muted">Trang mặc định được tạo tự động (không cần upload ZIP).</p>
    <p><strong>Subdomain:</strong> {safe_subdomain or '(homepage)'}</p>
    <h3>Thông tin liên hệ</h3>
    <ul>
      {''.join(contact_items)}
    </ul>
  </div>
</body>
</html>"""

    index_path = os.path.join(target_dir, 'index.html')
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_html)

    file_size = os.path.getsize(index_path)
    extracted_files = [{
        'path': 'index.html',
        'original_name': 'index.html',
        'type': 'html',
        'size': file_size
    }]
    folder_structure = {
        'index.html': {'type': 'html', 'size': file_size}
    }
    return extracted_files, folder_structure

# ============ LANDING PAGES INDEX ============

@landing_bp.route('/landings')
def landings_index():
    """Serve the index page listing all available landing pages"""
    return render_template('index_landings.html')

# ============ SPECIAL LANDING PAGES ============

@landing_bp.route('/real-talk-english')
def real_talk_english():
    """Serve the Real Talk English course landing page"""
    return render_template('real_talk_english.html')


@landing_bp.route('/dich-vu-lam-phu-hieu-xe', strict_slashes=False)
@landing_bp.route('/phu-hieu-xe', strict_slashes=False)
def phu_hieu_xe_service():
    """Serve the Google Ads landing page for phu hieu xe service."""
    return render_template('landing_phu_hieu_xe.html')


@landing_bp.route('/phu-hieu-xe-check-new/')
def phu_hieu_xe_check_new():
    """Serve completed phu-hieu-xe-check-new landing page."""
    landing_dir = os.path.join(LANDINGPAGES_COMPLETED_DIR, 'phu-hieu-xe-check-new')
    index_file = os.path.join(landing_dir, 'index.html')
    if not os.path.exists(index_file):
        return "Landing page not found", 404
    return send_from_directory(landing_dir, 'index.html')


@landing_bp.route('/phu-hieu-xe-check-new/<path:filename>')
def phu_hieu_xe_check_new_assets(filename):
    """Serve assets for completed phu-hieu-xe-check-new landing page."""
    landing_dir = os.path.join(LANDINGPAGES_COMPLETED_DIR, 'phu-hieu-xe-check-new')
    full_path = os.path.join(landing_dir, filename)
    if not os.path.exists(full_path):
        return "File not found", 404
    return send_from_directory(landing_dir, filename)


@landing_bp.route('/phu-hieu-check/')
def phu_hieu_check():
    """Serve completed phu-hieu-check landing page."""
    landing_dir = os.path.join(LANDINGPAGES_COMPLETED_DIR, 'phu-hieu-check')
    index_file = os.path.join(landing_dir, 'index.html')
    if not os.path.exists(index_file):
        return "Landing page not found", 404
    return send_from_directory(landing_dir, 'index.html')


@landing_bp.route('/phu-hieu-check/<path:filename>')
def phu_hieu_check_assets(filename):
    """Serve assets for completed phu-hieu-check landing page."""
    landing_dir = os.path.join(LANDINGPAGES_COMPLETED_DIR, 'phu-hieu-check')
    full_path = os.path.join(landing_dir, filename)
    if not os.path.exists(full_path):
        return "File not found", 404
    return send_from_directory(landing_dir, filename)

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
@login_required
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
        ga_tracking_id = request.form.get('ga_tracking_id', '').strip()
        fb_pixel_id = request.form.get('fb_pixel_id', '').strip()
        tiktok_pixel_id = request.form.get('tiktok_pixel_id', '').strip()
        google_ads_conversion_id = request.form.get('google_ads_conversion_id', '').strip()
        google_ads_label_phone = request.form.get('google_ads_label_phone', '').strip()
        google_ads_label_zalo = request.form.get('google_ads_label_zalo', '').strip()

        tracking_valid, tracking_msg = validate_tracking_ids(
            ga_tracking_id,
            fb_pixel_id,
            tiktok_pixel_id,
            google_ads_conversion_id,
            google_ads_label_phone,
            google_ads_label_zalo
        )
        if not tracking_valid:
            return jsonify({'success': False, 'message': tracking_msg}), 400

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
        if zip_file and zip_file.filename == '':
            zip_file = None

        uploaded_filename = 'auto-generated-default'
        upload_type = 'default'
        if zip_file:
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
            if zip_file:
                # Extract and validate uploaded ZIP
                extracted_files, folder_structure = extract_and_validate_folder(zip_file, target_dir)
                uploaded_filename = zip_file.filename
                upload_type = 'folder'
            else:
                # No upload: create default content
                extracted_files, folder_structure = create_default_page_content(
                    target_dir,
                    page_type,
                    subdomain,
                    hotline_phone,
                    zalo_phone,
                    google_form_link
                )
             
            head_snippet, body_snippet = build_tracking_snippets(
                global_site_tag,
                ga_tracking_id,
                fb_pixel_id,
                tiktok_pixel_id,
                google_ads_conversion_id,
                google_ads_label_phone,
                google_ads_label_zalo
            )
            process_html_tracking_in_folder(target_dir, head_snippet, body_snippet)

            # Rewrite absolute asset URLs to work under /landing/<subdomain>/
            try:
                rewrite_asset_paths_in_folder(target_dir, subdomain)
            except Exception:
                pass

            # Save to database
            landing_data = {
                'subdomain': subdomain,
                'agent': agent,
                'page_type': page_type,
                'global_site_tag': global_site_tag,
                'ga_tracking_id': ga_tracking_id,
                'fb_pixel_id': fb_pixel_id,
                'tiktok_pixel_id': tiktok_pixel_id,
                'google_ads_conversion_id': google_ads_conversion_id,
                'google_ads_label_phone': google_ads_label_phone,
                'google_ads_label_zalo': google_ads_label_zalo,
                'hotline_phone': hotline_phone,
                'zalo_phone': zalo_phone,
                'google_form_link': google_form_link,
                'status': 'active',
                'original_filename': uploaded_filename,
                'upload_type': upload_type,
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
            'ga_tracking_id': request.form.get('ga_tracking_id', '').strip(),
            'fb_pixel_id': request.form.get('fb_pixel_id', '').strip(),
            'tiktok_pixel_id': request.form.get('tiktok_pixel_id', '').strip(),
            'google_ads_conversion_id': request.form.get('google_ads_conversion_id', '').strip(),
            'google_ads_label_phone': request.form.get('google_ads_label_phone', '').strip(),
            'google_ads_label_zalo': request.form.get('google_ads_label_zalo', '').strip(),
            'hotline_phone': request.form.get('hotline_phone', '').strip(),
            'zalo_phone': request.form.get('zalo_phone', '').strip(),
            'google_form_link': request.form.get('google_form_link', '').strip(),
        }

        tracking_valid, tracking_msg = validate_tracking_ids(
            updates['ga_tracking_id'],
            updates['fb_pixel_id'],
            updates['tiktok_pixel_id'],
            updates['google_ads_conversion_id'],
            updates['google_ads_label_phone'],
            updates['google_ads_label_zalo']
        )
        if not tracking_valid:
            return jsonify({'success': False, 'message': tracking_msg}), 400
        
        head_snippet, body_snippet = build_tracking_snippets(
            updates.get('global_site_tag', ''),
            updates.get('ga_tracking_id', ''),
            updates.get('fb_pixel_id', ''),
            updates.get('tiktok_pixel_id', ''),
            updates.get('google_ads_conversion_id', ''),
            updates.get('google_ads_label_phone', ''),
            updates.get('google_ads_label_zalo', '')
        )

        pub_root = current_app.config['PUBLISHED_ROOT']
        target_dir = os.path.join(pub_root, landing['subdomain'])

        # Handle new ZIP file upload (optional)
        zip_file = None
        if 'folder_zip' in request.files and request.files['folder_zip'].filename:
            zip_file = request.files['folder_zip']
        elif 'zipFile' in request.files and request.files['zipFile'].filename:
            zip_file = request.files['zipFile']

        if zip_file:
            
            # Validate ZIP structure
            validation_result = validate_zip_structure(zip_file)
            if validation_result['status'] == 'error':
                return jsonify({'success': False, 'message': validation_result['message']}), 400

            # Backup current folder
            import shutil
            import tempfile
            with tempfile.TemporaryDirectory() as backup_dir:
                backup_path = os.path.join(backup_dir, 'backup')
                if os.path.exists(target_dir):
                    shutil.copytree(target_dir, backup_path)
                
                try:
                    # Clear and recreate
                    if os.path.exists(target_dir):
                        shutil.rmtree(target_dir)
                    os.makedirs(target_dir, exist_ok=True)
                    
                    # Extract new files
                    extracted_files, folder_structure = extract_and_validate_folder(zip_file, target_dir)

                    process_html_tracking_in_folder(target_dir, head_snippet, body_snippet)

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
        else:
            if not os.path.exists(target_dir):
                return jsonify({'success': False, 'message': 'Published folder not found. Please upload ZIP again.'}), 404

            # Re-apply tracking snippet to existing HTML files so updates take effect immediately.
            process_html_tracking_in_folder(target_dir, head_snippet, body_snippet)
        
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


@landing_bp.route('/api/landingpages/<int:landing_id>/cleanup-tracking', methods=['POST'])
@login_required
def api_cleanup_tracking(landing_id):
    """Cleanup legacy Google tracking and re-apply managed tracking block."""
    try:
        landing = repository.get_landing(landing_id)
        if not landing:
            return jsonify({'success': False, 'message': 'Landing page not found'}), 404

        pub_root = current_app.config['PUBLISHED_ROOT']
        target_dir = os.path.join(pub_root, landing['subdomain'])
        if not os.path.exists(target_dir):
            return jsonify({'success': False, 'message': 'Published folder not found'}), 404

        processed_files = apply_tracking_to_folder(target_dir, landing)
        return jsonify({
            'success': True,
            'message': f'Đã dọn tracking Google cũ và chuẩn hóa {len(processed_files)} file HTML.',
            'processed_files': len(processed_files)
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi dọn tracking: {str(e)}'}), 500


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

