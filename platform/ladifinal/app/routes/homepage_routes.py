# Homepage Management Module  
from flask import Blueprint, request, render_template, current_app, make_response, jsonify
from flask_login import login_required
import os
from ..constants import HOMEPAGE_DEFAULT_SUBDOMAIN, HOMEPAGE_ASSETS_CACHE_TIME, CACHE_EXPIRES_DATE, MIME_TYPES
from ..exceptions import HomepageError, HomepageNotFoundError, HomepageActivationError

homepage_bp = Blueprint('homepage', __name__)

# ============ HOMEPAGE SERVING ============

@homepage_bp.route('/')
def company_home():
    """Serve the homepage theme if uploaded; otherwise default marketing page."""
    from .. import repository
    
    # Get active homepage from database
    from .. import homepage_repository
    active_homepage = None
    
    try:
        active_homepage = homepage_repository.get_active_homepage()
        if active_homepage:
            subdomain = active_homepage.get('subdomain', HOMEPAGE_DEFAULT_SUBDOMAIN)
            print(f"[Home] Using active homepage ID {active_homepage.get('id')}, subdomain: {subdomain}")
        else:
            # Try to auto-pick a usable homepage with files
            candidate = homepage_repository.get_first_available_active_homepage()
            if candidate:
                subdomain = candidate.get('subdomain', HOMEPAGE_DEFAULT_SUBDOMAIN)
                print(f"[Home] No active flagged homepage, using first available with files: {candidate.get('id')} -> {subdomain}")
            else:
                subdomain = HOMEPAGE_DEFAULT_SUBDOMAIN
                print(f"[Home] No active homepage found, using fallback: {subdomain}")
    except Exception as e:
        print(f"[Home] Error querying homepage: {e}")
        subdomain = HOMEPAGE_DEFAULT_SUBDOMAIN
    
    pub_root = current_app.config['PUBLISHED_ROOT']
    homepage_dir = os.path.join(pub_root, subdomain)
    index_file = os.path.join(homepage_dir, 'index.html')
    
    try:
        print(f"[Home] pub_root={pub_root}, homepage_dir={homepage_dir}, index_exists={os.path.exists(index_file)}")
        print(f"[Home] template_folder={getattr(current_app, 'template_folder', None)}")
        test_company_home = None
        if getattr(current_app, 'template_folder', None):
            test_company_home = os.path.join(current_app.template_folder, 'company_home.html')
            print(f"[Home] company_home path test: {test_company_home}, exists={os.path.exists(test_company_home)}")
    except Exception as _e:
        pass
    
    if os.path.exists(index_file):
        try:
            with open(index_file, 'r', encoding='utf-8') as f:
                content = f.read()
            resp = make_response(content)
            resp.headers['Content-Type'] = 'text/html; charset=utf-8'
            return resp
        except Exception as e:
            return f"<h1>Lỗi tải trang chủ: {str(e)}</h1>", 500
    
    fallback_google_form_url = ''
    if active_homepage and active_homepage.get('google_form_link'):
        fallback_google_form_url = str(active_homepage.get('google_form_link')).strip()
    if not fallback_google_form_url:
        fallback_google_form_url = str(current_app.config.get('FALLBACK_GOOGLE_FORM_URL', '')).strip()

    # Fallback to render template; if not found, read file directly
    try:
        return render_template('company_home.html', google_form_link=fallback_google_form_url)
    except Exception:
        # read directly from filesystem
        tpl_dir = getattr(current_app, 'template_folder', None)
        if tpl_dir:
            fallback_file = os.path.join(tpl_dir, 'company_home.html')
            if os.path.exists(fallback_file):
                with open(fallback_file, 'r', encoding='utf-8') as f:
                    return f.read()
    
    return "<h1>Trang chủ</h1>", 200

    # Asset serving handled by legacy routes in app/routes.py


@homepage_bp.route('/_debug_active_homepage')
def debug_active_homepage():
    """Small debug endpoint to inspect active homepage and candidates."""
    from .. import homepage_repository
    import os
    data = {}
    try:
        active = homepage_repository.get_active_homepage()
        data['active'] = active
        cand = homepage_repository.list_active_homepage_candidates()
        data['candidates'] = cand
        # existence map for index.html
        pub_root = current_app.config['PUBLISHED_ROOT']
        ex = {}
        for hp in (cand or []):
            sub = hp.get('subdomain')
            if sub:
                ex[sub] = os.path.exists(os.path.join(pub_root, sub, 'index.html'))
        data['index_exists'] = ex
    except Exception as e:
        data['error'] = str(e)
    return jsonify(data)


# ============ HOMEPAGE MANAGEMENT API ============

@homepage_bp.route('/api/homepage/<int:homepage_id>/activate', methods=['POST'])
@login_required
def api_activate_homepage(homepage_id):
    """Set a homepage as active"""
    try:
        from .. import homepage_repository
        
        success = homepage_repository.set_active_homepage(homepage_id)
        
        if success:
            return jsonify({'success': True, 'message': 'Homepage đã được kích hoạt'})
        else:
            raise HomepageActivationError('Không thể kích hoạt homepage')
            
    except HomepageActivationError as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': f'Lỗi: {str(e)}'}), 500


 
