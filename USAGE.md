# Hệ thống Landing Page Manager

## Tính năng chính

### 1. Quản lý Landing Pages
- Tạo landing page từ folder ZIP hoàn chỉnh
- Tự động inject tracking codes (Google Analytics, phone, zalo, form tracking)
- Serve landing pages qua subdomain: `/landing/{subdomain}`
- Pause/Resume landing pages

### 2. Quản lý Agents
- Tạo và quản lý danh sách agents
- Liên kết agents với landing pages

### 3. Upload ZIP Folder
- **Cấu trúc ZIP yêu cầu:**
  ```
  your-site.zip
  ├── index.html        (bắt buộc)
  ├── css/
  │   └── style.css
  ├── js/
  │   └── main.js
  └── images/
      └── logo.png
  ```
- **Hỗ trợ:** .html, .css, .js, .png, .jpg, .gif, .svg, .webp, .ico, .txt, .json
- **Giới hạn:** 500 files, 500MB tổng, 50MB/file

## Cách sử dụng

### Khởi động hệ thống
```bash
cd ladipage
python main.py
```

### Truy cập Admin Panel
- URL: `http://localhost:5000/admin-panel-xyz123/`
- Login để truy cập các chức năng quản lý

### Tạo Landing Page mới
1. Chuẩn bị folder website hoàn chỉnh
2. Nén thành file ZIP (đảm bảo index.html ở root level)
3. Upload qua admin panel
4. Cấu hình tracking codes nếu cần
5. Landing page sẽ accessible tại `/landing/{subdomain}`

### Cập nhật Landing Page
- Upload ZIP mới để thay thế toàn bộ
- Hoặc chỉ cập nhật tracking codes mà không thay files

## API Endpoints

### Landing Pages
- `GET /api/landingpages` - Lấy danh sách
- `POST /api/landingpages` - Tạo mới (chỉ folder upload)
- `PUT /api/landingpages/{id}` - Cập nhật
- `DELETE /api/landingpages/{id}` - Xóa

### Agents  
- `GET /api/agents` - Lấy danh sách agents
- `POST /api/agents` - Tạo agent mới
- `PUT /api/agents/{id}` - Cập nhật agent
- `DELETE /api/agents/{id}` - Xóa agent

## Cấu trúc Database

### Table: landing_pages
- Lưu metadata của landing pages
- Tracking codes và settings

### Table: agents
- Thông tin agents

### Table: landing_files  
- Chi tiết files trong mỗi landing page

### Table: users
- Authentication data

## Files quan trọng
- `main.py` - Entry point
- `app/` - Flask application logic
- `templates/` - Jinja2 templates
- `database.db` - SQLite database
- `published/` - Folder chứa landing pages đã publish