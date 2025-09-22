# 📁 HƯỚNG DẪN TẠO FOLDER LANDING PAGE

Tài liệu này hướng dẫn chi tiết cách tạo và chuẩn bị folder landing page để upload vào hệ thống quản lý landing page.

## 🎯 TỔNG QUAN

Hệ thống hỗ trợ 2 cách upload:
1. **File đơn** - Upload index.html + ảnh riêng lẻ
2. **Folder hoàn chỉnh** - Upload file ZIP chứa toàn bộ website

## 📂 CẤU TRÚC FOLDER CHUẨN

### ✅ Cấu trúc được khuyến nghị:

```
landing-page/
├── index.html          # File HTML chính (BẮT BUỘC)
├── css/
│   ├── style.css       # CSS chính
│   └── responsive.css  # CSS responsive (tùy chọn)
├── js/
│   ├── main.js         # JavaScript chính
│   └── plugins.js      # Thư viện JS (tùy chọn)
├── images/
│   ├── logo.png        # Logo
│   ├── banner.jpg      # Ảnh banner
│   ├── product1.jpg    # Ảnh sản phẩm
│   └── ...             # Các ảnh khác
└── assets/             # (Tùy chọn)
    ├── fonts/          # Font chữ
    └── icons/          # Icon
```

### ⚠️ Cấu trúc SAI thường gặp:

```
❌ BAD: landing-page.zip
    └── landing-page/
        └── index.html  # Quá sâu 1 level

✅ GOOD: landing-page.zip
    └── index.html      # Ở root level
```

## 🔧 CHUẨN BỊ FILE ZIP

### Bước 1: Tạo folder với tên dự án
```
fashion-shop/
├── index.html
├── css/
├── js/
└── images/
```

### Bước 2: Kiểm tra file index.html
- File `index.html` phải nằm ở **thư mục gốc**
- Không được nằm trong subfolder

### Bước 3: Nén thành ZIP
- **Cách đúng**: Chọn tất cả file/folder bên trong → Nén
- **Cách sai**: Nén cả thư mục gốc (tạo ra nested folder)

```bash
# Cách đúng với 7-Zip hoặc WinRAR:
# 1. Mở thư mục fashion-shop/
# 2. Chọn tất cả file (Ctrl+A)
# 3. Click phải → Add to archive → fashion-shop.zip

# Hoặc dùng command line:
cd fashion-shop
zip -r ../fashion-shop.zip *
```

## 📋 QUY TẮC VÀ GIỚI HẠN

### File Extensions được hỗ trợ:
- **HTML**: `.html`, `.htm`
- **Styles**: `.css`
- **Scripts**: `.js`
- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.ico`
- **Others**: `.txt`, `.json`

### Giới hạn dung lượng:
- **File đơn**: Tối đa 50MB
- **Tổng dung lượng**: Tối đa 500MB
- **Số lượng file**: Tối đa 500 files

### An toàn:
- Không chứa đường dẫn `../` (path traversal)
- Không chứa file thực thi (`.exe`, `.php`, `.py`)

## 🎨 TEMPLATE LANDING PAGE MẪU

### HTML Structure cơ bản:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tên Landing Page</title>
    
    <!-- HỆ THỐNG SẼ TỰ ĐỘNG INJECT TRACKING CODE VÀO ĐÂY -->
    
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- HỆ THỐNG SẼ TỰ ĐỘNG INJECT TRACKING VARIABLES VÀO ĐÂY -->
    
    <!-- Nội dung trang -->
    <header>
        <h1>Welcome to Landing Page</h1>
    </header>
    
    <main>
        <img src="images/banner.jpg" alt="Banner">
        <p>Nội dung chính...</p>
    </main>
    
    <footer>
        <p>&copy; 2025</p>
    </footer>
    
    <script src="js/main.js"></script>
</body>
</html>
```

### CSS Guidelines:

```css
/* css/style.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
}

/* Responsive design */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
}
```

### JavaScript Integration:

```javascript
// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Sử dụng tracking variables từ hệ thống
    if (window.PHONE_TRACKING) {
        // Cập nhật link gọi điện
        document.querySelectorAll('.phone-link').forEach(el => {
            el.href = 'tel:' + window.PHONE_TRACKING;
        });
    }
    
    if (window.ZALO_TRACKING) {
        // Tích hợp Zalo
        document.querySelectorAll('.zalo-link').forEach(el => {
            el.href = 'https://zalo.me/' + window.ZALO_TRACKING;
        });
    }
});
```

## 🖼️ QUẢN LÝ IMAGES

### Naming Convention:
```
images/
├── logo.png           # Logo chính
├── banner.jpg         # Banner header
├── hero-bg.jpg        # Background hero section
├── product-1.jpg      # Sản phẩm/dịch vụ 1
├── product-2.jpg      # Sản phẩm/dịch vụ 2
├── testimonial-1.jpg  # Khách hàng 1
└── cta-bg.jpg         # Call-to-action background
```

### Optimization Tips:
- **JPEG**: Cho ảnh có nhiều màu (photos)
- **PNG**: Cho ảnh có transparency (logo, icons)
- **WebP**: Format hiện đại, nhẹ hơn
- **Kích thước**: Tối ưu trước khi upload

## 🔄 TRACKING & ANALYTICS

Hệ thống sẽ tự động inject:

### Global Site Tag (Google Analytics)
```html
<!-- Sẽ được inject vào <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Tracking Variables
```javascript
// Sẽ được inject vào <body>
<script>
window.PHONE_TRACKING = '0901234567';
window.ZALO_TRACKING = 'zalo.me/0901234567';
window.FORM_TRACKING = 'form_id_123';
</script>
```

## ✅ CHECKLIST TRƯỚC KHI UPLOAD

### 📋 Files & Structure
- [ ] File `index.html` ở thư mục gốc
- [ ] Tất cả link CSS/JS/Images hoạt động
- [ ] Không có broken links
- [ ] File ZIP không vượt quá 500MB
- [ ] Tổng số file < 500

### 🎨 Content & Design
- [ ] Responsive design (mobile-friendly)
- [ ] Fast loading time
- [ ] SEO friendly (title, meta, alt tags)
- [ ] Call-to-action rõ ràng

### 🔧 Technical
- [ ] Valid HTML (no errors)
- [ ] Cross-browser compatible
- [ ] Optimized images
- [ ] Minified CSS/JS (optional)

## 🚀 QUY TRÌNH UPLOAD

### Bước 1: Chuẩn bị
1. Tạo folder theo cấu trúc chuẩn
2. Test local trước khi upload
3. Nén thành file ZIP

### Bước 2: Upload
1. Vào admin panel
2. Chọn "Thêm Landing Page"
3. Chọn "Folder hoàn chỉnh"
4. Upload file ZIP
5. Điền thông tin tracking

### Bước 3: Verification
1. Kiểm tra URL: `/landing/subdomain`
2. Test trên mobile & desktop
3. Verify tracking codes
4. Test call-to-action

## 🛠️ TROUBLESHOOTING

### ❌ Lỗi thường gặp:

**1. "Không tìm thấy index.html"**
```
Nguyên nhân: File index.html nằm trong subfolder
Giải pháp: Đảm bảo index.html ở root level của ZIP
```

**2. "Ảnh không hiển thị"**
```
Nguyên nhân: Đường dẫn sai trong HTML
Sai: src="/images/logo.png"
Đúng: src="images/logo.png" hoặc src="./images/logo.png"
```

**3. "CSS không load"**
```
Nguyên nhân: Đường dẫn CSS sai
Sai: href="/css/style.css"
Đúng: href="css/style.css" hoặc href="./css/style.css"
```

**4. "File quá lớn"**
```
Giải pháp:
- Nén ảnh trước khi upload
- Sử dụng online image compressor
- Convert sang WebP format
```

## 📚 RESOURCES & TOOLS

### Online Tools:
- **HTML Validator**: https://validator.w3.org/
- **Image Compression**: https://tinypng.com/
- **Mobile Test**: https://search.google.com/test/mobile-friendly
- **Page Speed**: https://pagespeed.web.dev/

### Recommended Libraries:
- **CSS Framework**: Bootstrap, Tailwind CSS
- **Icons**: Font Awesome, Feather Icons
- **Fonts**: Google Fonts
- **Animations**: AOS (Animate On Scroll)

## 💡 BEST PRACTICES

### Performance:
1. **Optimize images** trước khi upload
2. **Minify CSS/JS** để giảm dung lượng
3. **Lazy loading** cho ảnh
4. **CDN** cho thư viện external

### SEO:
1. **Title tag** meaningful
2. **Meta description** hấp dẫn
3. **Alt tags** cho tất cả ảnh
4. **Structured data** (JSON-LD)

### Conversion:
1. **Clear call-to-action**
2. **Trust signals** (testimonials, certificates)
3. **Mobile optimization**
4. **Fast loading speed**

### Security:
1. **Sanitize inputs** nếu có form
2. **HTTPS only** links
3. **No inline scripts** (security)
4. **Content Security Policy**

---

## 🔗 EXAMPLES

Tham khảo các template mẫu trong thư mục:
- `/published/vongtay-shopee/` - E-commerce landing page
- `/published/shop-thoi-trang/` - Fashion landing page
- `/fashion-shop/` - Template hoàn chỉnh

---

**📞 Hỗ trợ**: Nếu gặp vấn đề, hãy liên hệ admin để được hỗ trợ chi tiết.

**📅 Cập nhật**: Document này được cập nhật thường xuyên để phản ánh tính năng mới.