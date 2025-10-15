# Configuration Constants for Landing Page Manager

# Homepage Configuration
HOMEPAGE_DEFAULT_SUBDOMAIN = '_homepage'
HOMEPAGE_ASSETS_CACHE_TIME = 86400  # 1 day in seconds

# File Upload Configuration
MAX_FILE_SIZE = 52428800  # 50MB per file
MAX_TOTAL_SIZE = 524288000  # 500MB total
MAX_FILES = 500  # Max files
ALLOWED_EXTENSIONS = {
    '.html', '.htm', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.txt', '.json',
    # fonts and related assets
    '.woff', '.woff2', '.ttf', '.otf', '.eot', '.map'
}

# Subdomain Configuration
SUBDOMAIN_MIN_LENGTH = 1
SUBDOMAIN_MAX_LENGTH = 40
SUBDOMAIN_PATTERN = r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'
SUBDOMAIN_RESERVED_WORDS = {
    'admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'test', 'staging', 'dev',
    'app', 'cdn', 'static', 'assets', 'images', 'css', 'js', 'login', 'logout',
    'health', 'status', 'ping', 'robots', 'sitemap', 'favicon', 'apple-touch-icon'
}

# Security Configuration
BLOCKED_ROUTE_PREFIXES = (
    'admin-panel-xyz123/', 'api/', 'landing/', '_dev_published/', 
    'health', 'login', 'logout', 'static/', 'favicon.ico'
)

# Cache Configuration
STATIC_ASSETS_CACHE_TIME = 86400  # 1 day
CACHE_EXPIRES_DATE = 'Thu, 31 Dec 2037 23:55:55 GMT'

# MIME Type Configuration
MIME_TYPES = {
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.htm': 'text/html',
    '.json': 'application/json',
    '.txt': 'text/plain',
    '.xml': 'application/xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.pdf': 'application/pdf'
}

# Tracking Template Configuration
TRACKING_TEMPLATE_HEAD = """<!-- Global Site Tag -->
{global_site_tag}
<!-- /Global Site Tag -->"""

TRACKING_TEMPLATE_BODY = """<!-- Tracking Codes -->
<script>window.PHONE_TRACKING={phone_tracking!r};</script>
<script>window.ZALO_TRACKING={zalo_tracking!r};</script>
<script>window.FORM_TRACKING={form_tracking!r};</script>
<!-- /Tracking Codes -->"""

# Database Configuration
LANDING_PAGE_STATUSES = ('active', 'paused')
PAGE_TYPES = ('landing', 'homepage')

# Admin Configuration
ADMIN_SECRET_PATH = 'admin-panel-xyz123'

# Error Messages
ERROR_MESSAGES = {
    'invalid_page_type': 'Loại giao diện không hợp lệ',
    'invalid_subdomain': 'Subdomain không hợp lệ',
    'subdomain_exists': 'Subdomain đã tồn tại',
    'invalid_status': 'Trạng thái không hợp lệ',
    'file_not_found': 'File không tồn tại',
    'zip_invalid': 'File ZIP không hợp lệ',
    'index_not_found': 'Không tìm thấy file index.html',
    'homepage_not_found': 'Không tìm thấy homepage',
    'homepage_activation_failed': 'Không thể kích hoạt homepage'
}