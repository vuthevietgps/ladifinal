"""
Database Migration Script
Adds GA4/Facebook/TikTok tracking columns to landing_pages table.
"""

import os
import sqlite3


def migrate_database(db_path=None):
    """Add tracking columns to database."""
    if db_path is None:
        repo_root = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(repo_root, 'ladifinal', 'database.db')

    print('Starting database migration...')

    if not os.path.exists(db_path):
        print(f'Database not found at: {db_path}')
        print('Database will be created automatically on first run')
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Check if columns already exist
        cursor.execute('PRAGMA table_info(landing_pages)')
        columns = [col[1] for col in cursor.fetchall()]

        needs_migration = False

        # Add ga_tracking_id if not exists
        if 'ga_tracking_id' not in columns:
            print('Adding ga_tracking_id column...')
            cursor.execute('ALTER TABLE landing_pages ADD COLUMN ga_tracking_id TEXT')
            needs_migration = True
        else:
            print('ga_tracking_id column already exists')

        # Add fb_pixel_id if not exists
        if 'fb_pixel_id' not in columns:
            print('Adding fb_pixel_id column...')
            cursor.execute('ALTER TABLE landing_pages ADD COLUMN fb_pixel_id TEXT')
            needs_migration = True
        else:
            print('fb_pixel_id column already exists')

        # Add tiktok_pixel_id if not exists
        if 'tiktok_pixel_id' not in columns:
            print('Adding tiktok_pixel_id column...')
            cursor.execute('ALTER TABLE landing_pages ADD COLUMN tiktok_pixel_id TEXT')
            needs_migration = True
        else:
            print('tiktok_pixel_id column already exists')

        if needs_migration:
            conn.commit()
            print('Migration completed successfully!')
        else:
            print('No migration needed')

        # Show current schema
        print('\nCurrent table schema:')
        cursor.execute('PRAGMA table_info(landing_pages)')
        for col in cursor.fetchall():
            print(f'   - {col[1]}: {col[2]}')

        conn.close()

    except Exception as e:
        print(f'Migration failed: {str(e)}')
        raise


if __name__ == '__main__':
    migrate_database()
    print('\nDone! You can now use GA4, Facebook Pixel, and TikTok Pixel tracking.')
