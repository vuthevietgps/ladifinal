# 📊 Hướng Dẫn Setup Advanced Tracking System

## 🎯 Tổng Quan

Hệ thống tracking mới hỗ trợ:
- ✅ **Google Analytics 4 (GA4)** - Tracking chi tiết hành vi người dùng
- ✅ **Facebook Pixel** - Tối ưu ads & retargeting
- ✅ **Auto Event Tracking** - Tự động track clicks, forms, scroll
- ✅ **Custom Events** - Tracking tùy chỉnh cho business logic

## 🚀 Quick Start

### Bước 1: Lấy Google Analytics 4 ID

1. Truy cập https://analytics.google.com/
2. Tạo tài khoản GA4 nếu chưa có
3. Vào **Admin** → **Data Streams** → Chọn hoặc tạo Web stream
4. Copy **Measurement ID** (Format: `G-XXXXXXXXXX`)

### Bước 2: Lấy Facebook Pixel ID

1. Truy cập https://business.facebook.com/events_manager
2. Chọn **Data Sources** → **Pixels**
3. Tạo Pixel mới hoặc chọn Pixel hiện có
4. Copy **Pixel ID** (Format: `1234567890123456`)

### Bước 3: Cấu Hình Trong Ladifinal

Khi tạo/chỉnh sửa Landing Page hoặc Homepage:

```
┌─────────────────────────────────────────┐
│ Advanced Analytics & Tracking           │
├─────────────────────────────────────────┤
│ Google Analytics 4 ID: G-XXXXXXXXXX     │
│ Facebook Pixel ID:     1234567890123456 │
└─────────────────────────────────────────┘
```

**Chỉ cần điền 2 field trên là xong!** ✨

## 📈 Features Tự Động

### 1. Page View Tracking
```javascript
// Tự động track khi trang load
✅ GA4: page_view event
✅ Facebook: PageView event
```

### 2. Button Click Tracking
```javascript
// Tự động track tất cả CTA buttons
✅ .btn-buy, .btn-order, .cta-button
✅ Track: event name, button text, element type
```

### 3. Phone Call Tracking
```javascript
// Tự động track khi click số điện thoại
✅ <a href="tel:0901234567">
✅ GA4: call_clicked event
✅ Facebook: Contact event
```

### 4. Zalo Click Tracking
```javascript
// Tự động track Zalo links
✅ https://zalo.me/xxxxx
✅ GA4: zalo_clicked event
✅ Facebook: Contact event
```

### 5. Form Submission Tracking
```javascript
// Tự động track mọi form submit
✅ GA4: form_submit event
✅ Facebook: Lead event (conversion)
```

### 6. Scroll Depth Tracking
```javascript
// Track scroll depth: 25%, 50%, 75%, 90%, 100%
✅ Hiểu được user engagement
```

## 🛠️ Advanced Usage

### Custom Event Tracking

Trong landing page HTML của bạn, có thể thêm custom tracking:

```html
<script>
// Đảm bảo tracker đã load
if (window.tracker) {
    // Track product view
    tracker.trackProductView('Áo Sơ Mi Premium', 299000);
    
    // Track add to cart
    tracker.trackAddToCart('Áo Sơ Mi Premium', 299000);
    
    // Track custom event
    tracker.trackEvent('special_offer_view', {
        offer_name: 'Flash Sale 50%',
        offer_value: 150000
    });
}
</script>
```

### Manual Button Tracking

```html
<button onclick="if(window.tracker) tracker.trackClick(this, 'Order Now', 'cta')">
    Đặt Hàng Ngay
</button>
```

## 📊 Metrics Bạn Sẽ Thấy

### Google Analytics 4 Dashboard

```
📈 Realtime
   └─ Active users on site
   └─ Current page views

📊 Events
   ├─ page_view
   ├─ click
   ├─ call_clicked
   ├─ zalo_clicked
   ├─ form_submit
   └─ scroll (25%, 50%, 75%, 90%, 100%)

🎯 Conversions
   ├─ form_submit (Lead)
   ├─ call_clicked (Contact)
   └─ zalo_clicked (Contact)

👥 User Behavior
   └─ Engagement rate
   └─ Scroll depth
   └─ Time on page
```

### Facebook Events Manager

```
📊 Standard Events
   ├─ PageView
   ├─ Contact (Phone & Zalo)
   ├─ Lead (Form Submit)
   ├─ ViewContent (Products)
   └─ AddToCart

💰 Conversion Tracking
   └─ Setup Custom Conversions based on events
   └─ Optimize ads for Lead/Contact events

🎯 Audiences
   └─ Create custom audiences
   └─ Retargeting visitors who viewed products
   └─ Lookalike audiences
```

## 🔍 Debug Mode

Để kiểm tra tracking hoạt động:

```javascript
// Thêm vào URL
?debug=true

// Hoặc trong Console
window.TRACKING_CONFIG = {
    gaId: 'G-XXXXXXXXXX',
    fbPixelId: '1234567890123456',
    debug: true,  // ← Bật debug mode
    autoTrack: true
};

// Reload tracker
window.tracker = new AdvancedTracking(window.TRACKING_CONFIG);
```

Console sẽ show:
```
[AdvancedTracking] Initializing Advanced Tracking...
[AdvancedTracking] GA4 initialized: G-XXXXXXXXXX
[AdvancedTracking] Facebook Pixel initialized: 1234567890123456
[AdvancedTracking] Page view tracked: /
[AdvancedTracking] Auto-tracking setup complete
[AdvancedTracking] Event tracked: click {...}
```

## 🎓 Best Practices

### 1. Setup Conversions trong GA4

```
Admin → Events → Mark as conversion:
✅ form_submit
✅ call_clicked  
✅ zalo_clicked
```

### 2. Setup Facebook Conversions

```
Events Manager → Custom Conversions:
├─ Lead: When form_submit event occurs
├─ Contact: When call_clicked OR zalo_clicked
└─ Interest: When scroll depth >= 75%
```

### 3. Integration với Facebook Ads

```
Ads Manager → Campaign:
├─ Optimization: Lead/Contact conversion
├─ Tracking: Use Pixel
└─ Attribution: 7-day click, 1-day view
```

## 🔥 Conversion Optimization Tips

### A/B Testing với GA4

```javascript
// Track variant
tracker.trackEvent('ab_test_view', {
    test_name: 'homepage_v1',
    variant: 'green_button'
});
```

### Event Value Tracking

```javascript
// Track business value
tracker.trackEvent('high_value_action', {
    value: 500000,  // VND
    currency: 'VND'
});
```

## 📱 Mobile Tracking

Tracking tự động hoạt động trên mobile với:
- ✅ Touch events
- ✅ Mobile số điện thoại (`tel:`)
- ✅ Zalo app deep links
- ✅ Mobile form submits

## 🚨 Troubleshooting

### Không thấy data trong GA4?

1. Kiểm tra **Measurement ID** đúng format `G-XXXXXXXXXX`
2. Đợi 24-48h để data hiển thị đầy đủ
3. Dùng **Realtime** report để test ngay lập tức
4. Check browser không block tracking (AdBlock, etc.)

### Facebook Pixel không hoạt động?

1. Cài **Meta Pixel Helper** extension
2. Kiểm tra Pixel ID là số 15-16 chữ số
3. Verify trong Events Manager → Test Events
4. Check privacy settings trên browser

### Events không được track?

1. Bật debug mode: `window.TRACKING_CONFIG.debug = true`
2. Check Console logs
3. Verify element có đúng class/selector
4. Test manually: `tracker.trackEvent('test', {})`

## 💡 Examples

### Landing Page với Full Tracking

```html
<!DOCTYPE html>
<html>
<head>
    <title>Áo Sơ Mi Premium</title>
    <!-- Auto-injected by system -->
    <script>
        window.TRACKING_CONFIG = {
            gaId: 'G-ABC123XYZ',
            fbPixelId: '123456789012345',
            debug: false,
            autoTrack: true
        };
    </script>
    <script src="/static/js/advanced-tracking.js" defer></script>
</head>
<body>
    <h1>Áo Sơ Mi Cao Cấp</h1>
    
    <!-- Auto-tracked -->
    <button class="btn-buy">Mua Ngay 299.000đ</button>
    
    <!-- Auto-tracked -->
    <a href="tel:0901234567">📞 Gọi Tư Vấn</a>
    
    <!-- Auto-tracked -->
    <a href="https://zalo.me/0901234567">💬 Chat Zalo</a>
    
    <!-- Auto-tracked -->
    <form>
        <input type="text" name="name" placeholder="Họ tên">
        <input type="tel" name="phone" placeholder="Số ĐT">
        <button type="submit">Đăng Ký</button>
    </form>
    
    <script>
        // Custom product tracking
        if (window.tracker) {
            tracker.trackProductView('Áo Sơ Mi Premium', 299000);
        }
    </script>
</body>
</html>
```

## 🎉 Kết Quả Mong Đợi

Sau khi setup đúng, bạn sẽ có:

✅ **Realtime Data**: Xem user đang làm gì trên site  
✅ **Conversion Funnel**: Hiểu được customer journey  
✅ **ROI Tracking**: Tính được chi phí quảng cáo hiệu quả  
✅ **Retargeting**: Chạy ads cho người đã truy cập  
✅ **Optimization**: Data-driven decision making  

## 🆘 Support

Gặp vấn đề? Check:
1. Console logs với debug mode
2. GA4 Realtime report
3. Facebook Pixel Helper extension
4. Test Events trong Events Manager

---

**Made with ❤️ for Ladifinal Platform**  
*Version 2.0 - Advanced Tracking System*
