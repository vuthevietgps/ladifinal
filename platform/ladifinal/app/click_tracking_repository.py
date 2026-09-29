"""Storage and explainable scoring for Google Ads landing visits."""

from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
import secrets

from .db import get_db


def _utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _sql_timestamp(value):
    return value.strftime('%Y-%m-%d %H:%M:%S')


def purge_old_visits(retention_days):
    retention_days = max(1, min(int(retention_days or 90), 365))
    cutoff = _sql_timestamp(_utc_now() - timedelta(days=retention_days))
    db = get_db()
    db.execute('DELETE FROM ad_click_visits WHERE occurred_at < ? AND visit_token NOT IN (SELECT visit_token FROM ad_visit_orders)', (cutoff,))
    db.execute('DELETE FROM ad_visit_events WHERE visit_token NOT IN (SELECT visit_token FROM ad_click_visits)')
    db.commit()


def record_ad_visit(data, dedupe_seconds=30):
    """Insert an ad landing request, deduplicating immediate reloads/retries."""
    db = get_db()
    now = _utc_now()
    cutoff = _sql_timestamp(now - timedelta(seconds=max(1, dedupe_seconds)))
    click_id = (data.get('click_id') or '').strip()

    duplicate = db.execute(
        """
        SELECT visit_token
        FROM ad_click_visits
        WHERE ip_address = ?
          AND landing_path = ?
          AND COALESCE(click_id, '') = ?
          AND occurred_at >= ?
        ORDER BY id DESC
        LIMIT 1
        """,
        (
            data['ip_address'],
            data['landing_path'],
            click_id,
            cutoff,
        ),
    ).fetchone()

    if duplicate:
        db.execute(
            'UPDATE ad_click_visits SET last_seen_at = ? WHERE visit_token = ?',
            (_sql_timestamp(now), duplicate['visit_token']),
        )
        db.commit()
        return duplicate['visit_token']

    visit_token = secrets.token_urlsafe(24)
    db.execute(
        """
        INSERT INTO ad_click_visits (
            visit_token, occurred_at, last_seen_at, ip_address,
            click_id, click_id_type, landing_path, landing_name,
            campaign_id, ad_group_id, keyword, network, device, match_type,
            country, user_agent, referrer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            visit_token,
            _sql_timestamp(now),
            _sql_timestamp(now),
            data['ip_address'],
            click_id or None,
            data.get('click_id_type'),
            data['landing_path'],
            data.get('landing_name'),
            data.get('campaign_id'),
            data.get('ad_group_id'),
            data.get('keyword'),
            data.get('network'),
            data.get('device'),
            data.get('match_type'),
            data.get('country'),
            data.get('user_agent'),
            data.get('referrer'),
        ),
    )
    db.commit()
    return visit_token


def record_visit_event(visit_token, event_type, value=0):
    if not visit_token:
        return False

    db = get_db()
    value = max(0, min(int(value or 0), 86400))
    now = _sql_timestamp(_utc_now())

    statements = {
        'page_view': ('page_views = page_views + 1', ()),
        'heartbeat': ('engaged_seconds = MAX(engaged_seconds, ?)', (min(value, 3600),)),
        'scroll': ('max_scroll = MAX(max_scroll, ?)', (min(value, 100),)),
        'contact': ('contact_actions = contact_actions + 1', ()),
        'phone': ('contact_actions = contact_actions + 1', ()),
        'zalo': ('contact_actions = contact_actions + 1', ()),
        'inbox': ('contact_actions = contact_actions + 1', ()),
        'form_submit': ('form_submits = form_submits + 1', ()),
    }
    update = statements.get(event_type)
    if not update:
        return False

    set_clause, params = update
    cursor = db.execute(
        f'UPDATE ad_click_visits SET {set_clause}, last_seen_at = ? WHERE visit_token = ?',
        (*params, now, visit_token),
    )
    if cursor.rowcount > 0 and event_type in ('contact', 'phone', 'zalo', 'inbox', 'form_submit'):
        db.execute('INSERT INTO ad_visit_events (visit_token, event_type, occurred_at) VALUES (?, ?, ?)',
                   (visit_token, event_type, now))
    db.commit()
    return cursor.rowcount > 0


def _parse_time(value):
    try:
        return datetime.fromisoformat(value)
    except (TypeError, ValueError):
        return datetime.min


def _max_burst(timestamps, window_seconds=600):
    timestamps = sorted(_parse_time(value) for value in timestamps)
    left = 0
    best = 0
    for right, current in enumerate(timestamps):
        while left <= right and (current - timestamps[left]).total_seconds() > window_seconds:
            left += 1
        best = max(best, right - left + 1)
    return best


def _risk_level(score):
    if score >= 70:
        return 'high'
    if score >= 50:
        return 'medium'
    if score >= 30:
        return 'watch'
    return 'low'


def _score_ip(ip_address, visits, allowed_countries):
    count = len(visits)
    engaged = sum(
        1 for visit in visits
        if visit['engaged_seconds'] >= 10
        or visit['max_scroll'] >= 25
        or visit['contact_actions'] > 0
        or visit['form_submits'] > 0
    )
    short_visits = count - engaged
    short_ratio = short_visits / count if count else 0
    contacts = sum(visit['contact_actions'] + visit['form_submits'] for visit in visits)
    click_ids = {visit['click_id'] for visit in visits if visit['click_id']}
    countries = {visit['country'].upper() for visit in visits if visit['country']}
    campaigns = sorted({visit['campaign_id'] for visit in visits if visit['campaign_id']})
    keywords = [visit['keyword'] for visit in visits if visit['keyword']]
    landings = sorted({visit['landing_name'] or visit['landing_path'] for visit in visits})
    user_agents = {visit['user_agent'] for visit in visits if visit['user_agent']}
    max_burst = _max_burst([visit['occurred_at'] for visit in visits])

    score = 0
    reasons = []

    if count >= 10:
        score += 40
        reasons.append(f'{count} lượt vào từ Ads trong kỳ')
    elif count >= 6:
        score += 30
        reasons.append(f'{count} lượt vào từ Ads trong kỳ')
    elif count >= 4:
        score += 20
        reasons.append(f'{count} lượt vào từ Ads trong kỳ')
    elif count >= 3:
        score += 10
        reasons.append(f'{count} lượt vào từ Ads trong kỳ')

    if count >= 3 and short_ratio >= 0.8:
        score += 20
        reasons.append(f'{round(short_ratio * 100)}% lượt không có tương tác rõ ràng')
        if engaged == 0:
            score += 5

    if max_burst >= 6:
        score += 30
        reasons.append(f'{max_burst} lượt trong vòng 10 phút')
    elif max_burst >= 3:
        score += 20
        reasons.append(f'{max_burst} lượt trong vòng 10 phút')

    if count >= 4 and len(click_ids) >= 3 and len(click_ids) / count >= 0.75:
        score += 10
        reasons.append('Nhiều mã click khác nhau từ cùng một IP')

    if count >= 5 and contacts == 0:
        score += 10
        reasons.append('Không có hành động liên hệ hoặc gửi form')

    if allowed_countries and countries and countries.isdisjoint(allowed_countries):
        score += 20
        reasons.append(f'Ngoài khu vực mục tiêu ({", ".join(sorted(countries))})')

    if count >= 5 and len(user_agents) == 1:
        score += 5
        reasons.append('Lặp lại cùng một trình duyệt/thiết bị')

    # Real engagement is a counter-signal: avoid recommending active prospects
    # solely because they revisit or share a carrier/NAT IP.
    if contacts > 0:
        score -= 20
    elif count and engaged / count >= 0.5:
        score -= 15

    score = max(0, min(score, 100))
    level = _risk_level(score)
    keyword_counts = Counter(keywords).most_common(3)

    return {
        'ip_address': ip_address,
        'score': score,
        'risk_level': level,
        'is_suggested': level in ('high', 'medium'),
        'reasons': reasons or ['Chưa đủ tín hiệu bất thường'],
        'visit_count': count,
        'unique_click_ids': len(click_ids),
        'engaged_visits': engaged,
        'short_visits': short_visits,
        'short_rate': round(short_ratio * 100),
        'contact_actions': contacts,
        'max_burst_10m': max_burst,
        'countries': sorted(countries),
        'campaigns': campaigns,
        'top_keywords': [name for name, _ in keyword_counts],
        'landings': landings,
        'first_seen': min(visit['occurred_at'] for visit in visits),
        'last_seen': max(visit['occurred_at'] for visit in visits),
    }


def analyze_ips(days=7, allowed_countries=None, search='', risk='all'):
    days = max(1, min(int(days or 7), 90))
    cutoff = _sql_timestamp(_utc_now() - timedelta(days=days))
    rows = get_db().execute(
        """
        SELECT occurred_at, ip_address, click_id, landing_path, landing_name,
               campaign_id, keyword, country, user_agent, engaged_seconds,
               max_scroll, contact_actions, form_submits
        FROM ad_click_visits
        WHERE occurred_at >= ?
        ORDER BY occurred_at DESC
        """,
        (cutoff,),
    ).fetchall()

    grouped = defaultdict(list)
    for row in rows:
        grouped[row['ip_address']].append(dict(row))

    allowed = {value.strip().upper() for value in (allowed_countries or []) if value.strip()}
    analyses = [_score_ip(ip, visits, allowed) for ip, visits in grouped.items()]
    analyses.sort(key=lambda item: (item['score'], item['visit_count'], item['last_seen']), reverse=True)

    stats = {
        'total_visits': len(rows),
        'unique_ips': len(analyses),
        'suggested_ips': sum(1 for item in analyses if item['is_suggested']),
        'high_risk_ips': sum(1 for item in analyses if item['risk_level'] == 'high'),
    }

    query = (search or '').strip().lower()
    if query:
        analyses = [
            item for item in analyses
            if query in item['ip_address'].lower()
            or any(query in value.lower() for value in item['campaigns'])
            or any(query in value.lower() for value in item['top_keywords'])
            or any(query in value.lower() for value in item['landings'])
        ]

    if risk == 'suggested':
        analyses = [item for item in analyses if item['is_suggested']]
    elif risk in ('high', 'medium', 'watch', 'low'):
        analyses = [item for item in analyses if item['risk_level'] == risk]

    return analyses, stats


ORDER_TEXT_FIELDS = {'customer_name': 200, 'recipient_name': 200, 'phone': 40,
                     'shipping_address': 1000, 'notes': 2000}
ORDER_MONEY_FIELDS = ('sale_total', 'deposit', 'cod_amount', 'supplier_cost')


def list_conversion_visits(days=7, conversion='all', search='', page=1):
    clauses, params = [], []
    if days:
        clauses.append('v.occurred_at >= ?')
        params.append(_sql_timestamp(_utc_now() - timedelta(days=days)))
    if conversion == 'contact':
        clauses.append('(v.contact_actions > 0 OR v.form_submits > 0)')
    elif conversion == 'none':
        clauses.append('(v.contact_actions = 0 AND v.form_submits = 0)')
    elif conversion in ('phone', 'zalo', 'inbox', 'form_submit'):
        clauses.append('EXISTS (SELECT 1 FROM ad_visit_events e WHERE e.visit_token=v.visit_token AND e.event_type=?)')
        params.append(conversion)
    elif conversion == 'noted':
        clauses.append('o.visit_token IS NOT NULL')
    elif conversion == 'confirmed':
        clauses.append("o.status = 'confirmed'")
    if search:
        columns = ('v.ip_address', 'v.click_id', 'v.ad_group_id', 'v.campaign_id',
                   'v.landing_name', 'o.customer_name', 'o.recipient_name', 'o.phone')
        clauses.append('(' + ' OR '.join(f'instr(lower(COALESCE({c}, \'\')), lower(?)) > 0' for c in columns) + ')')
        params.extend([search] * len(columns))
    where = ' AND '.join(clauses) or '1=1'
    source = 'FROM ad_click_visits v LEFT JOIN ad_visit_orders o ON o.visit_token=v.visit_token'
    db = get_db()
    total = db.execute(f'SELECT COUNT(*) {source} WHERE {where}', params).fetchone()[0]
    pages = max(1, (total + 49) // 50)
    page = min(max(1, page), pages)
    rows = db.execute(f'''SELECT v.*, o.customer_name, o.recipient_name, o.phone,
        o.shipping_address, o.sale_total, o.deposit, o.cod_amount, o.supplier_cost,
        o.notes, o.status, COALESCE(o.version, 0) AS version, o.updated_at, o.updated_by,
        (SELECT MAX(e.occurred_at) FROM ad_visit_events e WHERE e.visit_token=v.visit_token) AS contact_at
        {source} WHERE {where}
        ORDER BY COALESCE((SELECT MAX(e.occurred_at) FROM ad_visit_events e WHERE e.visit_token=v.visit_token), v.occurred_at) DESC, v.id DESC
        LIMIT 50 OFFSET ?''', [*params, (page - 1) * 50]).fetchall()
    results = []
    for row in rows:
        item = dict(row)
        events = db.execute('SELECT event_type, occurred_at FROM ad_visit_events WHERE visit_token=? ORDER BY id DESC', (item['visit_token'],)).fetchall()
        item['events'] = [dict(event) for event in events]
        results.append(item)
    return results, total, page, pages


def save_visit_order(visit_token, payload, user_id):
    values = {}
    for field, limit in ORDER_TEXT_FIELDS.items():
        value = payload.get(field, '')
        if not isinstance(value, str) or len(value.strip()) > limit:
            raise ValueError('Thông tin quá dài hoặc không hợp lệ.')
        values[field] = value.strip()
    for field in ORDER_MONEY_FIELDS:
        raw = str(payload.get(field, '')).strip()
        if raw and (not raw.isascii() or not raw.isdigit() or len(raw) > 13):
            raise ValueError('Số tiền phải là số nguyên VND không âm, tối đa 13 chữ số.')
        values[field] = int(raw) if raw else None
    status = payload.get('status', 'noted')
    if status not in ('noted', 'confirmed', 'cancelled'):
        raise ValueError('Trạng thái không hợp lệ.')
    values['status'] = status
    if not any(values[f] for f in ORDER_TEXT_FIELDS) and all(values[f] is None for f in ORDER_MONEY_FIELDS):
        raise ValueError('Hãy nhập ít nhất một thông tin khách hàng hoặc đơn hàng.')
    version = int(payload.get('version', 0))
    db = get_db()
    try:
        db.execute('BEGIN IMMEDIATE')
        if not db.execute('SELECT 1 FROM ad_click_visits WHERE visit_token=?', (visit_token,)).fetchone():
            raise LookupError('Không tìm thấy lượt truy cập.')
        existing = db.execute('SELECT version FROM ad_visit_orders WHERE visit_token=?', (visit_token,)).fetchone()
        if (existing['version'] if existing else 0) != version:
            raise RuntimeError('Dòng này vừa được người khác sửa. Hãy tải lại trang trước khi lưu.')
        values.update(updated_at=_sql_timestamp(_utc_now()), updated_by=str(user_id), version=version + 1)
        if existing:
            db.execute('UPDATE ad_visit_orders SET ' + ', '.join(f'{f}=?' for f in values) + ' WHERE visit_token=?', [*values.values(), visit_token])
        else:
            values['visit_token'] = visit_token
            db.execute('INSERT INTO ad_visit_orders (' + ', '.join(values) + ') VALUES (' + ', '.join('?' for _ in values) + ')', list(values.values()))
        db.commit()
        return version + 1
    except Exception:
        db.rollback()
        raise
