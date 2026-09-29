"""Collect Google Ads visits and present manual IP-block suggestions."""

import csv
from io import StringIO
from ipaddress import ip_address
from urllib.parse import urlparse
from datetime import datetime, timedelta
from flask_wtf.csrf import generate_csrf, validate_csrf
from wtforms.validators import ValidationError

from flask import Blueprint, Response, current_app, g, jsonify, make_response, render_template, request
from flask_login import login_required, current_user

from .. import click_tracking_repository as repository


click_tracking_bp = Blueprint('click_tracking', __name__)

CLICK_ID_PARAMS = ('gclid', 'wbraid', 'gbraid')
PUBLIC_EXCLUDED_PREFIXES = (
    '/admin-panel-xyz123',
    '/api/',
    '/static/',
    '/login',
    '/logout',
    '/health',
)
TRACKER_TAG = '<script src="/static/js/click-fraud-tracker.js" defer></script>'


def _allowed_countries():
    raw = current_app.config.get('CLICK_TRACKING_ALLOWED_COUNTRIES', '')
    if isinstance(raw, str):
        return [value.strip() for value in raw.split(',') if value.strip()]
    return list(raw or [])


def _valid_ip(value):
    if not value:
        return None
    candidate = value.strip()
    try:
        return str(ip_address(candidate))
    except ValueError:
        return None


def _client_ip():
    if current_app.config.get('TRUST_CLOUDFLARE_IP', True):
        cloudflare_ip = _valid_ip(request.headers.get('CF-Connecting-IP'))
        if cloudflare_ip:
            return cloudflare_ip
    return _valid_ip(request.remote_addr)


def _click_identity():
    for key in CLICK_ID_PARAMS:
        value = request.args.get(key, '').strip()
        if value:
            return key, value[:512]

    source = request.args.get('utm_source', '').strip().lower()
    medium = request.args.get('utm_medium', '').strip().lower()
    if source in ('google', 'googleads', 'google-ads') and medium in ('cpc', 'ppc', 'paid', 'paidsearch', 'paid-search'):
        return 'utm', ''
    return None, None


def _first_arg(*names, limit=255):
    for name in names:
        value = request.args.get(name, '').strip()
        if value:
            return value[:limit]
    return None


def _landing_name(path):
    parts = [part for part in path.split('/') if part]
    if len(parts) >= 2 and parts[0] == 'landing':
        return parts[1][:120]
    if not parts:
        return 'homepage'
    return parts[0][:120]


def _is_public_html_path():
    return not any(request.path.startswith(prefix) for prefix in PUBLIC_EXCLUDED_PREFIXES)


def _same_origin_request():
    origin = request.headers.get('Origin')
    if not origin:
        return True
    return urlparse(origin).netloc == request.host


@click_tracking_bp.before_app_request
def collect_ad_landing_request():
    if not current_app.config.get('CLICK_TRACKING_ENABLED', True):
        return None
    if request.method != 'GET' or not _is_public_html_path():
        return None

    click_id_type, click_id = _click_identity()
    if not click_id_type:
        return None

    client_ip = _client_ip()
    if not client_ip:
        return None

    data = {
        'ip_address': client_ip,
        'click_id': click_id,
        'click_id_type': click_id_type,
        'landing_path': request.path[:500],
        'landing_name': _landing_name(request.path),
        'campaign_id': _first_arg('cid', 'campaignid', 'utm_campaign'),
        'ad_group_id': _first_arg('agid', 'adgroupid'),
        'keyword': _first_arg('kw', 'keyword', 'utm_term'),
        'network': _first_arg('net', 'network'),
        'device': _first_arg('dev', 'device'),
        'match_type': _first_arg('mt', 'matchtype'),
        'country': (request.headers.get('CF-IPCountry') or '')[:8].upper() or None,
        'user_agent': (request.headers.get('User-Agent') or '')[:1000] or None,
        'referrer': (request.referrer or '')[:1000] or None,
    }
    g.ad_visit_token = repository.record_ad_visit(data)
    return None


@click_tracking_bp.after_app_request
def attach_click_cookie_and_tracker(response):
    visit_token = getattr(g, 'ad_visit_token', None)
    if visit_token:
        response.set_cookie(
            'ad_visit_token',
            visit_token,
            max_age=1800,
            secure=request.is_secure,
            httponly=True,
            samesite='Lax',
        )
        response.headers['Cache-Control'] = 'private, no-store, max-age=0'

    if not current_app.config.get('CLICK_TRACKING_ENABLED', True):
        return response
    if not visit_token and not request.cookies.get('ad_visit_token'):
        return response
    if request.method != 'GET' or not _is_public_html_path():
        return response
    if response.status_code < 200 or response.status_code >= 300:
        return response
    if 'text/html' not in (response.content_type or ''):
        return response
    if response.headers.get('Content-Encoding'):
        return response

    try:
        response.direct_passthrough = False
        html = response.get_data(as_text=True)
        if 'click-fraud-tracker.js' not in html:
            if '</body>' in html.lower():
                lower_html = html.lower()
                insert_at = lower_html.rfind('</body>')
                html = f'{html[:insert_at]}{TRACKER_TAG}\n{html[insert_at:]}'
            else:
                html = f'{html}\n{TRACKER_TAG}'
            response.set_data(html)
    except (RuntimeError, UnicodeDecodeError):
        # Do not break a landing page if a streamed/non-UTF8 response cannot be modified.
        pass
    return response


@click_tracking_bp.route('/api/ad-traffic/event', methods=['POST'])
def collect_visit_event():
    if not current_app.config.get('CLICK_TRACKING_ENABLED', True):
        return '', 204
    if not _same_origin_request():
        return jsonify({'error': 'invalid_origin'}), 403

    visit_token = request.cookies.get('ad_visit_token')
    payload = request.get_json(silent=True) or {}
    event_type = str(payload.get('event', ''))[:30]
    value = payload.get('value', 0)

    try:
        repository.record_visit_event(visit_token, event_type, value)
    except (TypeError, ValueError):
        return jsonify({'error': 'invalid_event'}), 400
    return '', 204


@click_tracking_bp.route('/admin-panel-xyz123/click-fraud')
@login_required
def admin_click_fraud():
    if request.args.get('view') == 'conversions':
        return conversion_table()
    try:
        days = max(1, min(int(request.args.get('days', 7)), 90))
    except ValueError:
        days = 7
    risk = request.args.get('risk', 'suggested')
    search = request.args.get('q', '').strip()

    repository.purge_old_visits(current_app.config.get('CLICK_TRACKING_RETENTION_DAYS', 90))
    rows, stats = repository.analyze_ips(
        days=days,
        allowed_countries=_allowed_countries(),
        search=search,
        risk=risk,
    )
    return render_template(
        'click_fraud.html',
        rows=rows,
        stats=stats,
        filters={'days': days, 'risk': risk, 'q': search},
        allowed_countries=_allowed_countries(),
    )


@click_tracking_bp.route('/admin-panel-xyz123/click-fraud/export')
@login_required
def export_click_fraud():
    try:
        days = max(1, min(int(request.args.get('days', 7)), 90))
    except ValueError:
        days = 7
    risk = request.args.get('risk', 'suggested')
    export_format = request.args.get('format', 'txt').lower()
    rows, _ = repository.analyze_ips(
        days=days,
        allowed_countries=_allowed_countries(),
        risk=risk,
    )

    if export_format == 'csv':
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['IP', 'Diem rui ro', 'Muc do', 'Luot Ads', 'Ty le ngan', 'Ly do'])
        for row in rows:
            writer.writerow([
                row['ip_address'],
                row['score'],
                row['risk_level'],
                row['visit_count'],
                f"{row['short_rate']}%",
                '; '.join(row['reasons']),
            ])
        response = make_response('\ufeff' + output.getvalue())
        response.mimetype = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=ip-de-xuat-{days}-ngay.csv'
        return response

    content = '\n'.join(row['ip_address'] for row in rows)
    return Response(
        content,
        mimetype='text/plain; charset=utf-8',
        headers={'Content-Disposition': f'attachment; filename=ip-de-xuat-{days}-ngay.txt'},
    )


def conversion_table():
    try:
        days = int(request.args.get('days', 7))
        page = max(1, int(request.args.get('page', 1)))
    except ValueError:
        days, page = 7, 1
    if days not in (0, 1, 3, 7, 14, 30, 90):
        days = 7
    conversion = request.args.get('conversion', 'all')
    search = request.args.get('q', '').strip()[:200]
    rows, total, page, pages = repository.list_conversion_visits(days, conversion, search, page)
    def local_time(value):
        if not value:
            return '—'
        return (datetime.fromisoformat(value) + timedelta(hours=7)).strftime('%d/%m/%Y %H:%M:%S')
    response = make_response(render_template('click_conversions.html', rows=rows, total=total,
        page=page, pages=pages, filters={'days': days, 'conversion': conversion, 'q': search},
        csrf_token_value=generate_csrf(), local_time=local_time))
    response.headers['Cache-Control'] = 'private, no-store'
    return response


@click_tracking_bp.route('/admin-panel-xyz123/click-fraud/orders/<visit_token>', methods=['POST'])
@login_required
def save_conversion_order(visit_token):
    if not _same_origin_request():
        return jsonify(error='Nguồn yêu cầu không hợp lệ.'), 403
    if current_app.config.get('WTF_CSRF_ENABLED', True):
        try:
            validate_csrf(request.headers.get('X-CSRFToken'))
        except ValidationError:
            return jsonify(error='Phiên lưu đã hết hạn. Hãy tải lại trang.'), 400
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error='Dữ liệu không hợp lệ.'), 400
    try:
        version = repository.save_visit_order(visit_token, payload, current_user.get_id())
    except (ValueError, TypeError):
        return jsonify(error='Kiểm tra dữ liệu: số tiền VND không âm, tối đa 13 chữ số; nhập ít nhất một thông tin.'), 400
    except LookupError as error:
        return jsonify(error=str(error)), 404
    except RuntimeError as error:
        return jsonify(error=str(error)), 409
    return jsonify(version=version, message='Đã lưu thông tin.' )
