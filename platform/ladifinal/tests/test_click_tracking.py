import os
import sys
import tempfile
import unittest

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if PROJECT_DIR not in sys.path:
    sys.path.insert(0, PROJECT_DIR)

from app import create_app
from app import click_tracking_repository
from app.db import get_db


class ClickTrackingTestCase(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.app = create_app({
            'TESTING': True,
            'DATABASE': os.path.join(self.temp_dir.name, 'test.db'),
            'PUBLISHED_ROOT': os.path.join(self.temp_dir.name, 'published'),
            'WTF_CSRF_ENABLED': False,
            'CLICK_TRACKING_ENABLED': True,
            'TRUST_CLOUDFLARE_IP': True,
            'CLICK_TRACKING_ALLOWED_COUNTRIES': 'VN',
        })
        self.client = self.app.test_client()

    def tearDown(self):
        self.temp_dir.cleanup()

    def _login_admin(self):
        with self.client.session_transaction() as session:
            session['_user_id'] = '1'
            session['_fresh'] = True

    def test_collects_cloudflare_ip_and_engagement(self):
        response = self.client.get(
            '/phu-hieu-xe?gclid=click-123&cid=campaign-1&agid=group-2&kw=phu+hieu&net=g&dev=m',
            headers={
                'CF-Connecting-IP': '203.0.113.25',
                'CF-IPCountry': 'VN',
                'User-Agent': 'Test Browser',
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'click-fraud-tracker.js', response.data)
        self.assertIn('HttpOnly', response.headers.get('Set-Cookie', ''))

        self.assertEqual(self.client.post('/api/ad-traffic/event', json={'event': 'page_view'}).status_code, 204)
        self.assertEqual(self.client.post('/api/ad-traffic/event', json={'event': 'heartbeat', 'value': 25}).status_code, 204)
        self.assertEqual(self.client.post('/api/ad-traffic/event', json={'event': 'scroll', 'value': 50}).status_code, 204)
        self.assertEqual(self.client.post('/api/ad-traffic/event', json={'event': 'contact'}).status_code, 204)

        with self.app.app_context():
            row = get_db().execute('SELECT * FROM ad_click_visits').fetchone()
            self.assertEqual(row['ip_address'], '203.0.113.25')
            self.assertEqual(row['click_id'], 'click-123')
            self.assertEqual(row['campaign_id'], 'campaign-1')
            self.assertEqual(row['engaged_seconds'], 25)
            self.assertEqual(row['max_scroll'], 50)
            self.assertEqual(row['contact_actions'], 1)

    def test_organic_visit_does_not_load_click_tracker(self):
        response = self.client.get('/phu-hieu-xe')
        self.assertEqual(response.status_code, 200)
        self.assertNotIn(b'click-fraud-tracker.js', response.data)
        with self.app.app_context():
            count = get_db().execute('SELECT COUNT(*) FROM ad_click_visits').fetchone()[0]
            self.assertEqual(count, 0)

    def test_suggests_repeated_non_engaged_ip_and_exports_it(self):
        with self.app.app_context():
            for index in range(4):
                click_tracking_repository.record_ad_visit({
                    'ip_address': '198.51.100.44',
                    'click_id': f'click-{index}',
                    'click_id_type': 'gclid',
                    'landing_path': '/landing/demo',
                    'landing_name': 'demo',
                    'campaign_id': 'campaign-risky',
                    'keyword': 'dich vu',
                    'country': 'VN',
                    'user_agent': 'Same browser',
                })

            for index in range(4):
                token = click_tracking_repository.record_ad_visit({
                    'ip_address': '198.51.100.80',
                    'click_id': f'quality-{index}',
                    'click_id_type': 'gclid',
                    'landing_path': '/landing/demo',
                    'landing_name': 'demo',
                    'campaign_id': 'campaign-quality',
                    'keyword': 'bao gia',
                    'country': 'VN',
                    'user_agent': 'Real browser',
                })
                click_tracking_repository.record_visit_event(token, 'heartbeat', 30)
                click_tracking_repository.record_visit_event(token, 'scroll', 75)
                click_tracking_repository.record_visit_event(token, 'contact')

            rows, stats = click_tracking_repository.analyze_ips(
                days=7,
                allowed_countries=['VN'],
                risk='suggested',
            )
            self.assertEqual(stats['suggested_ips'], 1)
            self.assertEqual(rows[0]['ip_address'], '198.51.100.44')
            self.assertTrue(rows[0]['is_suggested'])

        self._login_admin()
        page = self.client.get('/admin-panel-xyz123/click-fraud?days=7&risk=suggested')
        self.assertEqual(page.status_code, 200)
        self.assertIn(b'198.51.100.44', page.data)

        export = self.client.get('/admin-panel-xyz123/click-fraud/export?days=7&risk=suggested&format=txt')
        self.assertEqual(export.status_code, 200)
        self.assertEqual(export.get_data(as_text=True), '198.51.100.44')


if __name__ == '__main__':
    unittest.main()
