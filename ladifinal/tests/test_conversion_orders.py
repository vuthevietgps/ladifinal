import test_click_tracking as tracking
import unittest
from app import click_tracking_repository as repo
from app.db import get_db, SCHEMA_SQL


class ConversionOrderTests(unittest.TestCase):
    setUp = tracking.ClickTrackingTestCase.setUp
    tearDown = tracking.ClickTrackingTestCase.tearDown
    _login_admin = tracking.ClickTrackingTestCase._login_admin

    def seed(self, click='click-a', group='group-a'):
        with self.app.app_context():
            return repo.record_ad_visit({'ip_address': '203.0.113.20', 'landing_path': '/',
                'click_id': click, 'click_id_type': 'gclid', 'ad_group_id': group})

    def test_order_is_attached_to_visit_not_shared_ip_and_survives_cleanup(self):
        first, second = self.seed(), self.seed('click-b', 'group-b')
        self._login_admin()
        payload = dict(customer_name='Khách mẫu', recipient_name='Người nhận mẫu', phone='0900000000',
            shipping_address='Địa chỉ thử', sale_total='1000000', deposit='200000',
            cod_amount='750000', supplier_cost='500000', status='confirmed', notes='Đối chiếu thủ công', version=0)
        url = '/admin-panel-xyz123/click-fraud/orders/' + first
        response = self.client.post(url, json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['version'], 1)
        self.assertEqual(self.client.post(url, json=payload).status_code, 409)
        with self.app.app_context():
            rows, total, _, _ = repo.list_conversion_visits(conversion='confirmed', search='group-a')
            self.assertEqual(total, 1)
            self.assertEqual(rows[0]['click_id'], 'click-a')
            self.assertEqual(rows[0]['cod_amount'], 750000)
            self.assertEqual(repo.list_conversion_visits(search='group-b')[0][0]['customer_name'], None)
            db = get_db()
            db.execute("UPDATE ad_click_visits SET occurred_at='2020-01-01 00:00:00'")
            db.commit()
            repo.purge_old_visits(90)
            self.assertEqual(db.execute('SELECT visit_token FROM ad_click_visits').fetchone()[0], first)
            self.assertEqual(repo.list_conversion_visits(days=0, conversion='confirmed')[1], 1)
            db.executescript(SCHEMA_SQL)
            self.assertEqual(db.execute('SELECT phone FROM ad_visit_orders').fetchone()[0], '0900000000')

    def test_filters_timestamps_search_and_render(self):
        first, second = self.seed(), self.seed('click-b', 'group-b')
        with self.app.app_context():
            repo.record_visit_event(first, 'phone')
            repo.record_visit_event(first, 'zalo')
            repo.record_visit_event(second, 'form_submit')
            for conversion in ('phone', 'zalo', 'form_submit'):
                self.assertEqual(repo.list_conversion_visits(conversion=conversion)[1], 1)
            self.assertEqual(repo.list_conversion_visits(conversion='contact')[1], 2)
            self.assertEqual(repo.list_conversion_visits(conversion='none')[1], 0)
            rows = repo.list_conversion_visits(search='group-a')[0]
            self.assertTrue(rows[0]['contact_at'])
            self.assertEqual(len(rows[0]['events']), 2)
        self._login_admin()
        page = self.client.get('/admin-panel-xyz123/click-fraud?view=conversions&conversion=phone')
        self.assertEqual(page.status_code, 200)
        self.assertIn('group-a', page.text)
        self.assertNotIn('group-b', page.text)
        self.assertIn('Tên người nhận', page.text)
        self.assertEqual(page.headers['Cache-Control'], 'private, no-store')

    def test_order_auth_csrf_validation_and_update(self):
        import re
        token = self.seed()
        url = '/admin-panel-xyz123/click-fraud/orders/' + token
        self.assertEqual(self.client.post(url, json={'customer_name':'Demo'}).status_code, 302)
        self._login_admin()
        self.app.config['WTF_CSRF_ENABLED'] = True
        self.assertEqual(self.client.post(url, json={'customer_name':'Demo'}).status_code, 400)
        page = self.client.get('/admin-panel-xyz123/click-fraud?view=conversions')
        csrf = re.search(r'const csrf = "([^"]+)";', page.text).group(1)
        headers = {'X-CSRFToken': csrf}
        for bad in ('-1', '1.5', 'NaN', '10000000000000'):
            self.assertEqual(self.client.post(url, json={'sale_total':bad}, headers=headers).status_code, 400)
        self.assertEqual(self.client.post(url, json={}, headers=headers).status_code, 400)
        response = self.client.post(url, json={'customer_name':'Demo', 'deposit':'0'}, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.post(url, json={'customer_name':'Updated', 'version':1}, headers=headers).json['version'], 2)
        self.assertEqual(self.client.post(url, json={'customer_name':'Demo'}, headers={**headers, 'Origin':'https://elsewhere.example'}).status_code, 403)
        self.assertEqual(self.client.post(url+'missing', json={'customer_name':'Demo'}, headers=headers).status_code, 404)

    def test_pagination_and_legacy_contact(self):
        for i in range(51):
            self.seed('click-' + str(i))
        with self.app.app_context():
            db = get_db()
            db.execute('UPDATE ad_click_visits SET contact_actions=1 WHERE id=1')
            db.commit()
            rows, total, page, pages = repo.list_conversion_visits(page=2)
            self.assertEqual((len(rows), total, page, pages), (1, 51, 2, 2))
            rows = repo.list_conversion_visits(conversion='contact')[0]
            self.assertEqual(len(rows), 1)
            self.assertIsNone(rows[0]['contact_at'])
            self.assertEqual(rows[0]['events'], [])
