# Authentication & Admin Management Module
from flask import Blueprint, request, render_template, redirect, url_for, flash, current_app
from flask_login import login_required, current_user, login_user, logout_user
import os
from ..auth import User
from ..forms import LoginForm
from .. import repository, agents_repository
from ..constants import ADMIN_SECRET_PATH, ERROR_MESSAGES
from ..exceptions import AuthenticationError, PermissionError

auth_bp = Blueprint('auth', __name__)

# ============ AUTHENTICATION ============

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login page"""
    if current_user.is_authenticated:
        return redirect(url_for('auth.admin_dashboard'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.get_by_username(form.username.data)
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            if not next_page or not next_page.startswith('/'):
                next_page = url_for('auth.admin_dashboard')
            flash('Đăng nhập thành công!', 'success')
            return redirect(next_page)
        else:
            flash('Tên đăng nhập hoặc mật khẩu không đúng', 'error')
    
    try:
        return render_template('login.html', form=form)
    except Exception:
        tpl_dir = getattr(current_app, 'template_folder', None)
        if tpl_dir:
            fallback_file = os.path.join(tpl_dir, 'login.html')
            if os.path.exists(fallback_file):
                with open(fallback_file, 'r', encoding='utf-8') as f:
                    return f.read()
    return "<h1>Login</h1>", 200


@auth_bp.route('/logout')
@login_required
def logout():
    """User logout"""
    logout_user()
    flash('Đã đăng xuất thành công', 'info')
    return redirect(url_for('homepage.company_home'))


# ============ ADMIN DASHBOARD ============

@auth_bp.route('/admin-panel-xyz123/')
@login_required
def admin_dashboard():
    """Main admin dashboard with overview"""
    try:
        from .. import repository, agents_repository
        
        # Get statistics
        all_landings = repository.list_landings({})
        homepage_count = len([l for l in all_landings if l.get('page_type') == 'homepage'])
        landing_count = len([l for l in all_landings if l.get('page_type') == 'landing'])
        active_count = len([l for l in all_landings if l.get('status') == 'active'])
        agents_count = len(agents_repository.list_agents())
        
        stats = {
            'homepage_count': homepage_count,
            'landing_count': landing_count, 
            'active_count': active_count,
            'agents_count': agents_count,
            'total_count': len(all_landings)
        }
        
        return render_template('dashboard.html', stats=stats)
    except Exception as e:
        return f"<h1>Dashboard Error</h1><p>Error: {str(e)}</p>", 500


@auth_bp.route('/admin-panel-xyz123/homepage')
@login_required
def admin_homepage():
    """Admin homepage management page"""
    filters = {
        'agent': request.args.get('agent','').strip(),
        'status': request.args.get('status','').strip(),
        'q': request.args.get('q','').strip(),
        'page_type': 'homepage'  # Filter only homepage
    }
    
    try:
        from .. import repository, agents_repository
        
        # Get homepage pages only
        landings = repository.list_landings(filters)
        
        # Get agents list for dropdown
        agents_list = agents_repository.list_agents()
        
        return render_template('homepage_management.html', 
                             filters=filters, 
                             landings=landings, 
                             agents_list=agents_list,
                             page_title="Quản lý Homepage")
    except Exception as e:
        return f"<h1>Homepage Management Error</h1><p>Error: {str(e)}</p>", 500


@auth_bp.route('/admin-panel-xyz123/landing')
@login_required 
def admin_landing():
    """Admin landing pages management page"""
    filters = {
        'agent': request.args.get('agent','').strip(),
        'status': request.args.get('status','').strip(),
        'q': request.args.get('q','').strip(),
        'page_type': 'landing'  # Filter only landing pages
    }
    
    try:
        from .. import repository, agents_repository
        
        # Get landing pages only
        landings = repository.list_landings(filters)
        
        # Get agents list for dropdown
        agents_list = agents_repository.list_agents()
        
        return render_template('landing_management.html', 
                             filters=filters, 
                             landings=landings, 
                             agents_list=agents_list,
                             page_title="Quản lý Landing Pages")
    except Exception as e:
        return f"<h1>Landing Management Error</h1><p>Error: {str(e)}</p>", 500


@auth_bp.route('/admin-panel-xyz123/agents')
@login_required
def admin_agents():
    """Admin agents management page"""
    agents_list = agents_repository.list_agents()
    return render_template('agents.html', agents=agents_list)