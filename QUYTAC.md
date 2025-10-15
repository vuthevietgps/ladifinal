# Quy tắc đóng gói và đặt tên cho homepage.zip và ladipage.zip

Tài liệu này hướng dẫn cách chuẩn hóa gói ZIP khi tải lên hệ thống để hiển thị ổn định (CSS/JS/ảnh) và dễ bảo trì.

## 1) Mục tiêu
- Tải lên nhanh, không lỗi cấu trúc (index.html).
- CSS/JS/ảnh luôn load đúng cả với đường dẫn tuyệt đối hoặc tương đối.
- Dễ kiểm thử và gỡ lỗi sau khi upload.

---

## 2) Cấu trúc thư mục bắt buộc trong ZIP
- Bắt buộc phải có `index.html` ở:
  - Thư mục gốc của ZIP, hoặc
  - Chính xác 1 cấp con (ví dụ: `website/index.html`). Hệ thống sẽ tự động nhận diện và "kéo" nội dung từ thư mục con lên.

Ví dụ ĐÚNG:
```
my-landing.zip
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── images/
    └── banner.png
```

Ví dụ SAI (nhiều cấp lồng hoặc thiếu index.html):
```
my-landing.zip
└── dist/
    └── build/
        └── index.html   # ❌ Sâu quá 1 cấp

my-landing.zip
├── page.html            # ❌ Không có index.html
└── assets/
```

---

## 3) Quy ước đường dẫn asset (CSS/JS/ảnh)
- **QUAN TRỌNG**: Bắt buộc dùng đường dẫn tuyệt đối bắt đầu bằng `/` để đảm bảo hoạt động ổn định:
  - CSS: `<link rel="stylesheet" href="/css/style.css">`
  - JS: `<script src="/js/script.js"></script>`
  - Images: `<img src="/images/logo.png">`
- Hệ thống sẽ tự động rewrite khi upload:
  - Với Ladipage: `/css/style.css` → `/landing/<subdomain>/css/style.css`
  - Với Homepage: `/css/style.css` → `/css/style.css` (theo homepage active)
- **TRÁNH** dùng đường dẫn tương đối (`css/style.css`, `./images/logo.png`) vì có thể gây lỗi load tài nguyên.
- Không rewrite các URL dạng `http(s)://`, `//domain`, `data:`, `mailto:`, `#anchor`.
- Tránh dùng `<base href="/">` vì có thể làm sai đường dẫn; luôn dùng `/` cho asset nội bộ.

---

## 3a) CSS Best Practices (Kinh nghiệm thực tế)
- **Tối ưu CSS**: Sử dụng CSS compact/minified để giảm kích thước file:
  ```css
  /* Tốt - Compact style */
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:system-ui,sans-serif;background:#fff}
  
  /* Tránh - CSS quá dài dòng với nhiều khoảng trắng */
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }
  ```
- **CSS Variables**: Sử dụng `:root{}` để định nghĩa màu sắc chung:
  ```css
  :root{--primary:#2563eb;--success:#059669;--gray:#64748b}
  .btn-primary{background:var(--primary)}
  ```
- **Responsive**: Luôn có `@media (max-width:768px){}` cho mobile
- **Performance**: Tránh import font quá nhiều, ưu tiên system fonts

---

## 4) Giới hạn kích thước và định dạng được hỗ trợ
- Tối đa số file: 500
- Tối đa kích thước mỗi file: 50MB
- Tối đa tổng dung lượng: 500MB
- Phần mở rộng được phép (rút gọn):
  - HTML/HTM, CSS, JS
  - Ảnh: PNG, JPG, JPEG, GIF, SVG, WEBP, ICO
  - Fonts: WOFF, WOFF2, TTF, OTF, EOT
  - Khác: JSON, TXT, MAP, PDF
- Không chấp nhận file thực thi/ẩn nguy hiểm, đường dẫn chứa `..` hoặc bắt đầu bằng `/` bên trong ZIP.

---

## 5) Quy tắc đặt tên subdomain (chỉ áp dụng cho Ladipage)
- Chỉ chữ thường, số, dấu gạch ngang `-`.
- Bắt đầu và kết thúc phải là ký tự chữ/số.
- Độ dài 1–40 ký tự.
- Không dùng từ khóa hệ thống (ví dụ): `admin`, `api`, `www`, `test`, `static`, `assets`, `login`, `logout`, `health`, v.v.
- Nếu trùng subdomain đã tồn tại, cần chọn tên khác.

Homepage không cần subdomain—hệ thống tự đặt tên dạng `_homepage_<timestamp>` và có thể thiết lập “Đang dùng”.

---

## 6) Tracking và chèn mã (tùy chọn)
- Có thể nhập:
  - Global Site Tag (GA) → được chèn vào trước `</head>` của tất cả file HTML.
  - Phone/Zalo/Form tracking → được chèn vào trước `</body>`.
- Khuyến nghị: viết sạch, gọn, tránh script chặn render.

---

## 7) Lưu trữ sau upload
- File được lưu trên đĩa, KHÔNG lưu binary trong database.
- Thư mục đích (mặc định theo `docker-compose.yml`):
  - Host (Windows): `published/<subdomain>` trong thư mục dự án.
  - Container: `/app/published/<subdomain>`.
- Xóa landing từ Admin sẽ xóa cả thư mục tương ứng.

---

## 8) Kiểm thử sau khi upload
- Ladipage: mở `/landing/<subdomain>`.
  - DevTools → Network → kiểm tra `style.css` trả 200.
  - Header `X-Landing-Subdomain` phải khớp subdomain.
  - Có thể thêm `?debug=1` để bỏ cache tĩnh khi test.
- Homepage: mở `/` (root).
  - Asset tĩnh trả về kèm header `X-Homepage-Subdomain` chỉ ra thư mục homepage đang dùng.
- Endpoint hỗ trợ debug: `/_debug_active_homepage` (trả về active homepage + danh sách ứng viên + tình trạng tồn tại index.html).

---

## 9) Lỗi thường gặp và cách khắc phục
- "Không tìm thấy index.html": Hãy đảm bảo `index.html` ở gốc ZIP hoặc đúng 1 cấp con.
- "Subdomain không hợp lệ/đã tồn tại": Đổi tên theo quy tắc, tránh từ khóa hệ thống.
- **"CSS/ảnh không load"**: 
  - ✅ **Giải pháp**: Dùng đường dẫn tuyệt đối `/css/style.css`, `/images/logo.png`
  - ❌ **Tránh**: Đường dẫn tương đối `css/style.css`, `./images/logo.png`
  - 🔍 **Debug**: F12 → Network → kiểm tra Request URL phải là `/landing/<subdomain>/css/style.css`
- "CSS bị lỗi format": 
  - Tham khảo `ladipagetest1/css/style.css` và `ladipagetest2/css/style.css` để học cấu trúc đúng
  - Sử dụng CSS compact, ít khoảng trắng
  - Dùng CSS variables `:root{}`
- "Dưới 200 nhưng giao diện vẫn cũ": Cache trình duyệt. Dùng `?debug=1` hoặc Ctrl+F5.
- "Dung lượng vượt quá": Giảm kích thước ảnh, nén WebP, minify CSS/JS.

---

## 10) Thực hành tốt (Best Practices)
- **Đường dẫn**: Bắt buộc dùng đường dẫn tuyệt đối `/css/`, `/js/`, `/images/` cho asset nội bộ.
- **CSS Structure**: Tham khảo `ladipagetest1` và `ladipagetest2` để học cấu trúc CSS đúng chuẩn.
- **Tối ưu hóa**: 
  - CSS: Sử dụng format compact, CSS variables, responsive design
  - Images: WebP format, nén kích thước phù hợp
  - JS: Minify nếu có thể
- **File naming**: Tránh ký tự lạ, ưu tiên ASCII, dấu `-` hoặc `_`.
- **Testing**: 
  - Kiểm tra F12 → Network → đảm bảo tất cả asset load 200 OK
  - Test trên mobile và desktop
  - Xóa cache trình duyệt khi test
- **Tránh**: Service worker/PWA, `<base href>`, đường dẫn tương đối cho asset chính.

---

## 11) Tạo ZIP trên Windows (PowerShell)
Có thể nén trực tiếp từ thư mục dự án (ví dụ thư mục `ladipagetest1`):

```powershell
Compress-Archive -Path 'ladipagetest1\*' -DestinationPath 'ladipagetest1.zip' -Force
```

**Checklist trước khi nén:**
- ✅ `index.html` ở thư mục gốc
- ✅ Tất cả asset dùng đường dẫn tuyệt đối `/css/`, `/js/`, `/images/`
- ✅ CSS đã tối ưu (compact format, CSS variables)
- ✅ Không có file README.md hoặc file không cần thiết
- ✅ Test local trước khi nén

---

**File mẫu tham khảo:**
- `ladipagetest1/` và `ladipagetest2/` - Cấu trúc chuẩn đã test thành công
- `ho-chieu-service/` - Ví dụ dịch vụ làm hộ chiếu với đầy đủ tính năng

**Lưu ý quan trọng**: Luôn tham khảo cấu trúc của `ladipagetest1` và `ladipagetest2` khi tạo landing page mới để tránh lỗi CSS và asset loading.
