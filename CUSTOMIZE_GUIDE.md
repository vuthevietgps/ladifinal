# 🎯 Hướng Dẫn Cập Nhật Landing Page: Thẻ Tập Huấn Vận Tải

## 🔗 Link Test Nhanh
```
http://localhost:5000/landing/the-tap-huan-van-tai
```

---

## 📞 Cập Nhật Số Điện Thoại

### Tìm và Thay Thế: `0372555555` → **[Số điện thoại của bạn]**

Xuất hiện tại các vị trí:
1. **Navigation Bar** - Header (Top right button)
2. **Hero Section** - 2 buttons (Tư vấn miễn phí)
3. **Contact Section** - "Gọi Ngay" button
4. **Contact Form** - Phone label
5. **Footer** - Contact info
6. **Fixed Call Button** - Bottom right corner

---

## 📧 Cập Nhật Email

### Tìm và Thay Thế: `info@thetaphuanvantai.vn` → **[Email của bạn]**

Xuất hiện tại:
1. **Contact Section** - Email link
2. **Footer** - Contact info

---

## 🌐 Cập Nhật Địa Chỉ

### Tìm và Thay Thế: `Hà Nội, Việt Nam` → **[Địa chỉ của bạn]**

Xuất hiện tại:
1. **Contact Section** - Address field

---

## ⏰ Cập Nhật Giờ Làm Việc

### Tìm và Thay Thế: `08:00 - 20:00 (Thứ 2 - CN)` → **[Giờ của bạn]**

Xuất hiện tại:
1. **Contact Section** - Working hours

---

## 🔗 Cập Nhật Social Links

### Facebook, Zalo, YouTube URLs

Tìm trong phần **Contact Section** - Social Links:

```html
<a href="#" title="Facebook" class="social-link">
    <i class="fab fa-facebook-f"></i>
</a>

<a href="#" title="Zalo" class="social-link">
    <i class="fab fa-zalo"></i>
</a>

<a href="#" title="YouTube" class="social-link">
    <i class="fab fa-youtube"></i>
</a>
```

**Thay `href="#"` bằng URL thực tế:**
- Facebook: `https://facebook.com/...`
- Zalo: `https://zalo.me/...`
- YouTube: `https://youtube.com/...`

---

## 🖼️ Cập Nhật Hình Ảnh

Hiện tại sử dụng **SVG placeholders**. Để thay bằng hình thật:

### 1. **Hero Image** (bên phải Hero section)
**File**: `images/certificate-placeholder.svg`
**Thay bằng**: Hình thẻ tập huấn thực tế (hoặc mockup)
**Size**: ~400x350px

### 2. **Solution Image** (Benefits section)
**File**: `images/solution-placeholder.svg`
**Thay bằng**: Hình illustation hoặc infographic
**Size**: ~400x300px

**Cách thay:**
1. Xóa file `.svg`
2. Upload hình `.jpg` hoặc `.png` (cùng tên)
3. Tự động sẽ hiển thị

---

## 🎨 Cập Nhật Màu Sắc (Optional)

Nếu muốn thay đổi màu sắc, chỉnh sửa file `css/style.css`:

```css
:root{
  --primary:#1e40af;        /* Xanh dương chính */
  --secondary:#0891b2;      /* Xanh cyan phụ */
  --success:#059669;        /* Xanh lá - CTA */
  --warning:#fbbf24;        /* Vàng - Accent */
  --gray:#64748b;           /* Xám - Text phụ */
  --dark:#1e293b;           /* Đen đậm - Dark text */
  --light:#f8fafc;          /* Trắng nhạt - BG */
}
```

---

## ✏️ Cập Nhật Nội Dung Chính

### **Hero Section - Tiêu Đề & Mô Tả**

File: `index.html` - Tìm dòng:
```html
<h1>Thẻ Tập Huấn Nghiệp Vụ <span class="highlight">Vận Tải</span></h1>
<p class="hero-subtitle">Yêu cầu bắt buộc khi hoạt động kinh doanh vận tải</p>
<p class="hero-description">Hoàn thiện nhanh • Hồ sơ hợp lệ • Phù hợp quy định pháp luật</p>
```

### **Problem Cards** (6 vấn đề)

Tìm section: `<!-- I - INTEREST: Problems Section -->`

Mỗi card:
```html
<div class="problem-card">
    <div class="problem-icon" style="background: linear-gradient(...);">
        <i class="fas fa-[ICON]"></i>
    </div>
    <h3>[TIÊU ĐỀ]</h3>
    <p>[MÔ TẢ]</p>
</div>
```

### **Benefits List** (6 lợi ích)

Tìm section: `<!-- D - DESIRE: Solution Section -->`

Mỗi benefit:
```html
<li>
    <i class="fas fa-check-circle"></i>
    <span><strong>[TIÊU ĐỀ]</strong> - [MÔ TẢ CHI TIẾT]</span>
</li>
```

### **Process Steps** (4 bước)

Tìm section: `<!-- Process Section -->`

Mỗi bước:
```html
<div class="timeline-step">
    <div class="step-number">1</div>
    <div class="step-content">
        <h3>[TIÊU ĐỀ]</h3>
        <p>[MÔ TẢ]</p>
        <div class="step-icon">
            <i class="fas fa-[ICON]"></i>
        </div>
    </div>
</div>
```

---

## 🧪 Test Sau Khi Cập Nhật

### **1. Browser Test**
```
URL: http://localhost:5000/landing/the-tap-huan-van-tai
Browsers: Chrome, Firefox, Safari
Devices: Desktop, Tablet, Mobile
```

### **2. DevTools Check (F12)**
- **Network tab**: Tất cả file CSS/JS/images phải trả 200 OK
- **Console**: Không có error đỏ
- **Responsive**: Test trên mobile 320px, 480px, 768px

### **3. Form Test**
- Điền form đầy đủ
- Nhấn "Gửi Thông Tin"
- Kiểm tra WhatsApp message mở đúng

### **4. Link Test**
- Click tất cả menu links (smooth scroll)
- Click tất cả buttons
- Test phone call button (tel: link)

### **5. Cache Clear**
```
Ctrl+Shift+Delete (Windows/Linux)
Cmd+Shift+Delete (Mac)
```

---

## 📦 Upload Lên Production

### **Cách 1: Upload ZIP**

1. Tạo ZIP từ thư mục:
```powershell
Compress-Archive -Path 'ladipagetest-vantai\*' -DestinationPath 'ladipagetest-vantai.zip' -Force
```

2. Mở Admin Panel: `http://localhost:5000/admin-panel-xyz123`

3. Chọn "Tạo Landing Page Mới"

4. Fill form:
   - **Subdomain**: `the-tap-huan-van-tai`
   - **Page Type**: `Landing`
   - **Upload ZIP**: `ladipagetest-vantai.zip`
   - Tracking (optional)

5. Submit

### **Cách 2: Upload Qua API**

```bash
curl -X POST http://localhost:5000/api/landingpages \
  -F "subdomain=the-tap-huan-van-tai" \
  -F "page_type=landing" \
  -F "file=@ladipagetest-vantai.zip"
```

---

## 🐛 Troubleshooting

### **Problem: CSS/Images không load**
**Solution**: 
- Kiểm tra F12 Network tab
- Đảm bảo tất cả asset dùng đường dẫn `/css/`, `/js/`, `/images/`
- Không dùng `../` hoặc đường dẫn tương đối

### **Problem: Form không gửi được**
**Solution**:
- Kiểm tra console (F12)
- Kiểm tra phone number format
- Đảm bảo JavaScript enabled

### **Problem: Mobile layout bị lệch**
**Solution**:
- Clear cache
- Test trên incognito/private mode
- Kiểm tra viewport meta tag

### **Problem: Font không hiển thị đúng**
**Solution**:
- Kiểm tra Google Fonts CDN link
- Đảm bảo network có internet
- Fallback fonts: `system-ui, sans-serif`

---

## 📞 Support

**Nếu cần hỗ trợ cập nhật:**
- Tất cả hệ thống theo QUYTAC.md
- CSS/JS minified - tối ưu
- Responsive mobile-first
- Font-Awesome icons toàn bộ

---

## ✅ Checklist Hoàn Thành

- [ ] Cập nhật số điện thoại
- [ ] Cập nhật email
- [ ] Cập nhật địa chỉ
- [ ] Cập nhật giờ làm việc
- [ ] Cập nhật social links
- [ ] Thay hình ảnh SVG (optional)
- [ ] Thay đổi màu sắc (optional)
- [ ] Cập nhật nội dung (optional)
- [ ] Test trên desktop
- [ ] Test trên mobile
- [ ] Test form
- [ ] Clear cache
- [ ] Upload ZIP
- [ ] Kiểm tra link live

---

**Status**: 🟢 Ready to Deploy & Customize
