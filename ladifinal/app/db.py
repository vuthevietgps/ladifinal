import sqlite3
from flask import current_app, g

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS landing_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subdomain TEXT UNIQUE NOT NULL,
    page_type TEXT NOT NULL DEFAULT 'landing',
    agent TEXT,
    global_site_tag TEXT,
    phone_tracking TEXT,
    zalo_tracking TEXT,
    form_tracking TEXT,
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
"""


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
    with app.app_context():
        db = get_db()
        db.executescript(SCHEMA_SQL)
        # Simple idempotent ALTERs in case table existed before
        existing_cols = {r[1] for r in db.execute("PRAGMA table_info(landing_pages)").fetchall()}
        for col, ddl in [
            ('page_type', "ALTER TABLE landing_pages ADD COLUMN page_type TEXT NOT NULL DEFAULT 'landing'"),
            ('hotline_phone', "ALTER TABLE landing_pages ADD COLUMN hotline_phone TEXT"),
            ('zalo_phone', "ALTER TABLE landing_pages ADD COLUMN zalo_phone TEXT"),
            ('google_form_link', "ALTER TABLE landing_pages ADD COLUMN google_form_link TEXT"),
            ('upload_type', "ALTER TABLE landing_pages ADD COLUMN upload_type TEXT NOT NULL DEFAULT 'single'"),
            ('folder_structure', "ALTER TABLE landing_pages ADD COLUMN folder_structure TEXT"),
            ('is_active', "ALTER TABLE landing_pages ADD COLUMN is_active INTEGER DEFAULT 0")
        ]:
            if col not in existing_cols:
                db.execute(ddl)
        db.commit()

    @app.teardown_appcontext
    def teardown_db(exception):  # noqa: F811
        close_db()
