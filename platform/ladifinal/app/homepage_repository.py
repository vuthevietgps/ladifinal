# Homepage Management Repository
from typing import List, Optional, Dict, Any
from .db import get_db
from .constants import HOMEPAGE_DEFAULT_SUBDOMAIN
from .exceptions import HomepageError, HomepageNotFoundError, HomepageActivationError, DatabaseError

def get_active_homepage() -> Optional[Dict[str, Any]]:
    """Get the currently active homepage"""
    db = get_db()
    row = db.execute('''
        SELECT * FROM landing_pages 
        WHERE page_type = 'homepage' AND is_active = 1 AND status = 'active'
        ORDER BY id DESC LIMIT 1
    ''').fetchone()
    
    if row:
        return dict(row)
    return None

def list_all_homepages() -> List[Dict[str, Any]]:
    """Get all homepage entries"""
    db = get_db()
    rows = db.execute('''
        SELECT * FROM landing_pages 
        WHERE page_type = 'homepage'
        ORDER BY created_at DESC
    ''').fetchall()
    
    return [dict(row) for row in rows]

def list_active_homepage_candidates() -> List[Dict[str, Any]]:
    """List all homepages that are eligible to be active (status='active')."""
    db = get_db()
    rows = db.execute('''
        SELECT * FROM landing_pages
        WHERE page_type='homepage' AND status='active'
        ORDER BY updated_at DESC, id DESC
    ''').fetchall()
    return [dict(r) for r in rows]

def get_first_available_active_homepage() -> Optional[Dict[str, Any]]:
    """Return the first homepage with status='active' and existing published index.html if any."""
    import os
    from flask import current_app
    pub_root = current_app.config['PUBLISHED_ROOT']
    for hp in list_active_homepage_candidates():
        sub = hp.get('subdomain')
        if not sub:
            continue
        idx = os.path.join(pub_root, sub, 'index.html')
        if os.path.exists(idx):
            return hp
    return None

def set_active_homepage(homepage_id: int) -> bool:
    """Set a specific homepage as active and deactivate others"""
    db = get_db()
    
    try:
        # Check if the homepage exists
        existing = db.execute('''
            SELECT id FROM landing_pages 
            WHERE id = ? AND page_type = 'homepage'
        ''', (homepage_id,)).fetchone()
        
        if not existing:
            raise HomepageNotFoundError(f"Homepage with ID {homepage_id} not found")
        
        # Deactivate all homepages first
        db.execute('''
            UPDATE landing_pages 
            SET is_active = 0 
            WHERE page_type = 'homepage'
        ''')
        
        # Activate the selected homepage and ensure status is 'active'
        cursor = db.execute('''
            UPDATE landing_pages 
            SET is_active = 1, status = 'active' 
            WHERE id = ? AND page_type = 'homepage'
        ''', (homepage_id,))
        
        db.commit()
        
        if cursor.rowcount == 0:
            raise HomepageActivationError(f"Failed to activate homepage {homepage_id}")
        
        return True
        
    except (HomepageNotFoundError, HomepageActivationError):
        db.rollback()
        raise
    except Exception as e:
        print(f"[Homepage] Error setting active homepage: {e}")
        db.rollback()
        raise DatabaseError(f"Database error while activating homepage: {str(e)}")

def demote_homepage(homepage_id: int) -> None:
    """Set is_active=0 for given homepage id (if exists)."""
    db = get_db()
    try:
        db.execute('''
            UPDATE landing_pages
            SET is_active = 0
            WHERE id = ? AND page_type='homepage'
        ''', (homepage_id,))
        db.commit()
    except Exception:
        db.rollback()
        # swallow; best effort

def ensure_single_active() -> None:
    """Ensure at most one homepage has is_active=1 by keeping the most recently updated."""
    db = get_db()
    try:
        rows = db.execute('''
            SELECT id FROM landing_pages
            WHERE page_type='homepage' AND is_active=1
            ORDER BY updated_at DESC, id DESC
        ''').fetchall()
        ids = [r['id'] for r in rows]
        if len(ids) > 1:
            # Keep first, demote others
            keep = ids[0]
            for i in ids[1:]:
                db.execute('UPDATE landing_pages SET is_active=0 WHERE id=?', (i,))
            db.commit()
    except Exception:
        db.rollback()

def deactivate_all_homepages():
    """Deactivate all homepages"""
    db = get_db()
    
    try:
        db.execute('''
            UPDATE landing_pages 
            SET is_active = 0 
            WHERE page_type = 'homepage'
        ''')
        db.commit()
    except Exception as e:
        print(f"[Homepage] Error deactivating homepages: {e}")
        db.rollback()
        raise DatabaseError(f"Database error while deactivating homepages: {str(e)}")