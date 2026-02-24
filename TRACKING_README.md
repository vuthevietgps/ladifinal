# 🎯 Advanced Tracking System - Installation & Usage

## ⚡ Quick Start (3 phút)

### 1️⃣ Lấy Tracking IDs

**Google Analytics 4:**
- Đăng ký tại: https://analytics.google.com/
- Lấy Measurement ID: `G-XXXXXXXXXX`

**Facebook Pixel:**
- Tạo tại: https://business.facebook.com/events_manager  
- Lấy Pixel ID: `1234567890123456`

### 2️⃣ Nhập Vào Ladifinal

Khi tạo Landing Page/Homepage, điền vào:
```
Google Analytics 4 ID: G-XXXXXXXXXX
Facebook Pixel ID:     1234567890123456
```

### 3️⃣ Xong! 🎉

Tất cả tracking tự động hoạt động!

## 📚 Documentation

- 📖 **[TRACKING_SETUP_GUIDE.md](./TRACKING_SETUP_GUIDE.md)** - Hướng dẫn chi tiết
- 📊 **[TRACKING_UPGRADE_SUMMARY.md](./TRACKING_UPGRADE_SUMMARY.md)** - Tổng quan nâng cấp
- 💻 **[demo-tracking-landing/](./demo-tracking-landing/)** - Demo hoạt động

## ✨ Features

✅ Google Analytics 4 integration  
✅ Facebook Pixel integration  
✅ Auto event tracking (clicks, forms, phone, zalo)  
✅ Scroll depth tracking  
✅ Product view/cart tracking  
✅ Custom events support  
✅ Debug mode  
✅ Mobile optimized  

## 🚀 Usage

### Trong HTML của bạn

Tracking code tự động được inject, không cần làm gì!

### Custom Tracking (Optional)

```javascript
// Track product view
tracker.trackProductView('Product Name', 299000);

// Track custom event  
tracker.trackEvent('special_offer', {
    offer_name: 'Flash Sale',
    value: 150000
});
```

## 🔍 Verify

**GA4:** Reports → Realtime (xem ngay)  
**FB Pixel:** Cài Meta Pixel Helper extension

## 📞 Support

Xem [TRACKING_SETUP_GUIDE.md](./TRACKING_SETUP_GUIDE.md) để biết thêm chi tiết.

---

**Version 2.0** | Made with ❤️ for Ladifinal
