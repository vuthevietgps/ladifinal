import sqlite3
from flask import current_app, g

LANDING_PAGES_COLUMNS = [
    'id',
    'subdomain',
    'page_type',
    'agent',
    'global_site_tag',
    'ga_tracking_id',
    'fb_pixel_id',
    'tiktok_pixel_id',
    'google_ads_conversion_id',
    'google_ads_label_phone',
    'google_ads_label_zalo',
    'hotline_phone',
    'zalo_phone',
    'google_form_link',
    'status',
    'is_active',
    'original_filename',
    'upload_type',
    'folder_structure',
    'created_at',
    'updated_at',
]

LANDING_PAGES_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS landing_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subdomain TEXT UNIQUE NOT NULL,
    page_type TEXT NOT NULL DEFAULT 'landing',
    agent TEXT,
    global_site_tag TEXT,
    ga_tracking_id TEXT,
    fb_pixel_id TEXT,
    tiktok_pixel_id TEXT,
    google_ads_conversion_id TEXT,
    google_ads_label_phone TEXT,
    google_ads_label_zalo TEXT,
    hotline_phone TEXT,
    zalo_phone TEXT,
    google_form_link TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    is_active INTEGER DEFAULT 0, -- For homepage selection: 0=not used, 1=active homepage
    original_filename TEXT,
    upload_type TEXT NOT NULL DEFAULT 'single', -- 'single' or 'folder'
    folder_structure TEXT, -- JSON string storing folder structure
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
"""

SCHEMA_SQL = """
{landing_pages_table_sql}

CREATE TABLE IF NOT EXISTS landing_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    landing_id INTEGER NOT NULL,
    file_path TEXT NOT NULL, -- relative path within landing folder
    original_name TEXT NOT NULL,
    file_type TEXT, -- 'html', 'css', 'js', 'image', 'other'
    file_size INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (landing_id) REFERENCES landing_pages (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ad_click_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_token TEXT UNIQUE NOT NULL,
    occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT NOT NULL,
    click_id TEXT,
    click_id_type TEXT,
    landing_path TEXT NOT NULL,
    landing_name TEXT,
    campaign_id TEXT,
    ad_group_id TEXT,
    keyword TEXT,
    network TEXT,
    device TEXT,
    match_type TEXT,
    country TEXT,
    user_agent TEXT,
    referrer TEXT,
    page_views INTEGER NOT NULL DEFAULT 0,
    engaged_seconds INTEGER NOT NULL DEFAULT 0,
    max_scroll INTEGER NOT NULL DEFAULT 0,
    contact_actions INTEGER NOT NULL DEFAULT 0,
    form_submits INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ad_click_visits_occurred_at
    ON ad_click_visits (occurred_at);
CREATE INDEX IF NOT EXISTS idx_ad_click_visits_ip_time
    ON ad_click_visits (ip_address, occurred_at);
CREATE INDEX IF NOT EXISTS idx_ad_click_visits_click_id
    ON ad_click_visits (click_id);
CREATE INDEX IF NOT EXISTS idx_ad_click_visits_token
    ON ad_click_visits (visit_token);

CREATE TABLE IF NOT EXISTS ad_visit_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_token TEXT NOT NULL,
    event_type TEXT NOT NULL,
    occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ad_visit_events_token ON ad_visit_events (visit_token, occurred_at);
CREATE TABLE IF NOT EXISTS ad_visit_orders (
    visit_token TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL DEFAULT '',
    recipient_name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    shipping_address TEXT NOT NULL DEFAULT '',
    sale_total INTEGER,
    deposit INTEGER,
    cod_amount INTEGER,
    supplier_cost INTEGER,
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'noted',
    version INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT NOT NULL DEFAULT ''
);
""".format(landing_pages_table_sql=LANDING_PAGES_TABLE_SQL.strip())


def _get_landing_pages_columns(db):
    return {r[1] for r in db.execute("PRAGMA table_info(landing_pages)").fetchall()}


def _add_missing_landing_page_columns(db):
    existing_cols = _get_landing_pages_columns(db)
    for col, ddl in [
        ('page_type', "ALTER TABLE landing_pages ADD COLUMN page_type TEXT NOT NULL DEFAULT 'landing'"),
        ('global_site_tag', "ALTER TABLE landing_pages ADD COLUMN global_site_tag TEXT"),
        ('ga_tracking_id', "ALTER TABLE landing_pages ADD COLUMN ga_tracking_id TEXT"),
        ('fb_pixel_id', "ALTER TABLE landing_pages ADD COLUMN fb_pixel_id TEXT"),
        ('hotline_phone', "ALTER TABLE landing_pages ADD COLUMN hotline_phone TEXT"),
        ('zalo_phone', "ALTER TABLE landing_pages ADD COLUMN zalo_phone TEXT"),
        ('google_form_link', "ALTER TABLE landing_pages ADD COLUMN google_form_link TEXT"),
        ('status', "ALTER TABLE landing_pages ADD COLUMN status TEXT NOT NULL DEFAULT 'active'"),
        ('upload_type', "ALTER TABLE landing_pages ADD COLUMN upload_type TEXT NOT NULL DEFAULT 'single'"),
        ('folder_structure', "ALTER TABLE landing_pages ADD COLUMN folder_structure TEXT"),
        ('is_active', "ALTER TABLE landing_pages ADD COLUMN is_active INTEGER DEFAULT 0"),
        ('tiktok_pixel_id', "ALTER TABLE landing_pages ADD COLUMN tiktok_pixel_id TEXT"),
        ('original_filename', "ALTER TABLE landing_pages ADD COLUMN original_filename TEXT"),
        ('google_ads_conversion_id', "ALTER TABLE landing_pages ADD COLUMN google_ads_conversion_id TEXT"),
        ('google_ads_label_phone', "ALTER TABLE landing_pages ADD COLUMN google_ads_label_phone TEXT"),
        ('google_ads_label_zalo', "ALTER TABLE landing_pages ADD COLUMN google_ads_label_zalo TEXT"),
    ]:
        if col not in existing_cols:
            db.execute(ddl)


def _drop_legacy_tracking_columns(db):
    existing_cols = _get_landing_pages_columns(db)
    legacy_cols = {'phone_tracking', 'zalo_tracking', 'form_tracking'}
    if not (legacy_cols & existing_cols):
        return

    copy_columns = [c for c in LANDING_PAGES_COLUMNS if c in existing_cols]
    if not copy_columns:
        return

    preserved_columns = ', '.join(copy_columns)

    db.execute("PRAGMA foreign_keys=OFF")
    try:
        db.execute("BEGIN")
        db.execute(LANDING_PAGES_TABLE_SQL.replace(
            "CREATE TABLE IF NOT EXISTS landing_pages (",
            "CREATE TABLE landing_pages_new ("
        ))
        db.execute(
            f"INSERT INTO landing_pages_new ({preserved_columns}) "
            f"SELECT {preserved_columns} FROM landing_pages"
        )
        db.execute("DROP TABLE landing_pages")
        db.execute("ALTER TABLE landing_pages_new RENAME TO landing_pages")
        db.execute("COMMIT")
    except Exception:
        db.execute("ROLLBACK")
        raise
    finally:
        db.execute("PRAGMA foreign_keys=ON")


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db(app):
    @app.teardown_appcontext
    def teardown_db(exception):  # noqa: F811
        close_db()

    with app.app_context():
        db = get_db()
        db.executescript(SCHEMA_SQL)
        # Idempotent migration for legacy databases.
        _add_missing_landing_page_columns(db)
        db.commit()
        _drop_legacy_tracking_columns(db)
        db.commit()
