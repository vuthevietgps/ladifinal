# Huong Dan Cai Dat Ma Tracking

Huong dan chi tiet cach lay va cai dat ma theo doi (tracking) cho Google Analytics 4, Facebook Pixel va TikTok Pixel tren he thong Landing Page.

---

## 1. Google Analytics 4 (GA4)

### Buoc 1: Tao tai khoan Google Analytics

1. Truy cap [https://analytics.google.com](https://analytics.google.com)
2. Dang nhap bang tai khoan Google
3. Nhan **"Bat dau do luong"** (Start measuring)
4. Dien ten tai khoan (vi du: "Landing Pages Cong Ty")
5. Nhan **Tiep theo**

### Buoc 2: Tao Property (Thuoc tinh)

1. Dien ten property (vi du: "Landing Phu Hieu Xe")
2. Chon mui gio: **(GMT+07:00) Ha Noi**
3. Chon don vi tien te: **VND**
4. Nhan **Tiep theo**

### Buoc 3: Tao Data Stream

1. Chon nen tang: **Web**
2. Nhap URL website (vi du: `https://domain-cua-ban.com`)
3. Dien ten stream (vi du: "Landing Page Stream")
4. Nhan **Tao stream**

### Buoc 4: Lay Measurement ID

1. Sau khi tao stream, ban se thay **Measurement ID** co dang: `G-XXXXXXXXXX`
2. Vi du: `G-1A2B3C4D5E`
3. **Sao chep ma nay**

### Buoc 5: Dan vao he thong

1. Vao trang quan tri Landing Page
2. Tim muc **"Analytics & Tracking"**
3. Dan ma vao o **"Google Analytics 4 ID"**
4. Vi du: `G-1A2B3C4D5E`

### Kiem tra hoat dong

- Vao Google Analytics > **Realtime** (Thoi gian thuc)
- Mo landing page tren trinh duyet khac
- Kiem tra xem co hien thi nguoi dung dang hoat dong khong

### Cac su kien tu dong theo doi

He thong se tu dong theo doi cac su kien sau qua GA4:

| Su kien | Mo ta |
|---------|-------|
| `page_view` | Xem trang |
| `call_clicked` | Nhan so dien thoai |
| `zalo_clicked` | Nhan lien ket Zalo |
| `form_submit` | Gui form |
| `click` | Nhan nut CTA |
| `scroll` | Do sau cuon trang (25%, 50%, 75%, 90%, 100%) |
| `view_item` | Xem san pham |
| `add_to_cart` | Them vao gio hang |

---

## 2. Facebook Pixel

### Buoc 1: Tao Facebook Pixel

1. Truy cap [https://business.facebook.com/events_manager](https://business.facebook.com/events_manager)
2. Dang nhap bang tai khoan Facebook Business
3. Nhan **"Ket noi nguon du lieu"** (Connect Data Sources)
4. Chon **"Web"**
5. Chon **"Facebook Pixel"**
6. Nhan **Ket noi**

### Buoc 2: Dat ten Pixel

1. Dien ten Pixel (vi du: "Landing Phu Hieu Xe Pixel")
2. Nhap URL website (vi du: `https://domain-cua-ban.com`)
3. Nhan **Tiep tuc**

### Buoc 3: Lay Pixel ID

1. Sau khi tao, vao **Settings** (Cai dat) cua Pixel
2. Tim muc **"Pixel ID"** - day la chuoi so co 15-16 chu so
3. Vi du: `123456789012345`
4. **Sao chep ma nay**

Hoac lay nhanh:
1. Vao Events Manager > Chon Pixel cua ban
2. Nhan **Settings**
3. O dau trang se hien thi **Dataset ID** (chinh la Pixel ID)

### Buoc 4: Dan vao he thong

1. Vao trang quan tri Landing Page
2. Tim muc **"Analytics & Tracking"**
3. Dan ma vao o **"Facebook Pixel ID"**
4. Vi du: `123456789012345`

### Kiem tra hoat dong

1. Cai dat **Facebook Pixel Helper** (extension Chrome):
   [https://chrome.google.com/webstore/detail/facebook-pixel-helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper)
2. Mo landing page
3. Nhan vao icon Pixel Helper tren trinh duyet
4. Kiem tra xem Pixel da hoat dong chua (hien mau xanh)

### Cac su kien tu dong theo doi

He thong se tu dong gui cac su kien Facebook Pixel sau:

| Su kien Facebook | Khi nao | Mo ta |
|------------------|---------|-------|
| `PageView` | Khi mo trang | Dem luot xem trang |
| `Contact` | Nhan goi dien / Zalo | Theo doi lien he |
| `Lead` | Gui form | Theo doi khach hang tiem nang |
| `ViewContent` | Xem san pham | Theo doi quan tam san pham |
| `AddToCart` | Them gio hang | Theo doi hanh vi mua hang |

### Tao doi tuong tuy chinh (Custom Audience)

Sau khi Pixel hoat dong, ban co the:
1. Vao **Audiences** trong Facebook Ads Manager
2. Tao **Custom Audience** tu nguoi da truy cap landing page
3. Tao **Lookalike Audience** de tim khach hang tuong tu
4. Su dung cho chien dich quang cao Retargeting

---

## 3. TikTok Pixel

### Buoc 1: Tao TikTok Pixel

1. Truy cap [https://ads.tiktok.com](https://ads.tiktok.com)
2. Dang nhap tai khoan TikTok Ads
3. Vao menu **Assets** > **Events** > **Web Events**
4. Nhan **"Manage"** (Quan ly)
5. Nhan **"Set Up Web Events"** (Thiet lap su kien web)

### Buoc 2: Chon phuong thuc cai dat

1. Chon **"TikTok Pixel"**
2. Nhan **Next**
3. Chon **"Manually Install Pixel Code"** (Cai dat thu cong)
4. Dat ten Pixel (vi du: "Landing Phu Hieu Xe")

### Buoc 3: Lay Pixel ID

1. Sau khi tao, he thong se hien thi **Pixel ID**
2. Day la chuoi ky tu co dang: `CXXXXXXXXXXXXXXXXX`
3. Vi du: `C5JLGR3BVJC2P8DNFHKG`
4. **Sao chep ma nay**

Hoac lay tu danh sach Pixel:
1. Vao **Assets** > **Events** > **Web Events**
2. Tim Pixel cua ban trong danh sach
3. Nhan vao ten Pixel
4. Pixel ID hien thi o phan **Overview**

### Buoc 4: Dan vao he thong

1. Vao trang quan tri Landing Page
2. Tim muc **"Analytics & Tracking"**
3. Dan ma vao o **"TikTok Pixel ID"**
4. Vi du: `C5JLGR3BVJC2P8DNFHKG`

### Kiem tra hoat dong

1. Cai dat **TikTok Pixel Helper** (extension Chrome):
   [https://chrome.google.com/webstore/detail/tiktok-pixel-helper](https://chrome.google.com/webstore/detail/tiktok-pixel-helper)
2. Mo landing page
3. Nhan vao icon TikTok Pixel Helper
4. Kiem tra xem Pixel da nhan su kien chua

Hoac kiem tra trong TikTok Ads Manager:
1. Vao **Assets** > **Events**
2. Chon Pixel cua ban
3. Xem tab **Diagnostics** de kiem tra trang thai

### Cac su kien tu dong theo doi

He thong se tu dong gui cac su kien TikTok Pixel sau:

| Su kien TikTok | Khi nao | Mo ta |
|----------------|---------|-------|
| `page` | Khi mo trang | Dem luot xem trang |
| `Contact` | Nhan goi dien / Zalo | Theo doi lien he |
| `SubmitForm` | Gui form | Theo doi gui form |
| `ViewContent` | Xem san pham | Theo doi quan tam san pham |
| `AddToCart` | Them gio hang | Theo doi hanh vi mua hang |

---

## 4. Cai dat dong thoi nhieu Pixel

Ban co the cai dat **dong thoi ca 3 nen tang** tren cung mot landing page. He thong se tu dong:

- Load script cua tung nen tang rieng biet
- Gui su kien song song den ca 3 nen tang
- Khong anh huong toc do tai trang (tat ca deu load **async**)

### Vi du cau hinh day du:

```
Google Analytics 4 ID:  G-1A2B3C4D5E
Facebook Pixel ID:      123456789012345
TikTok Pixel ID:        C5JLGR3BVJC2P8DNFHKG
```

---

## 5. Cac truong tracking tuy chinh

Ngoai 3 nen tang chinh, he thong con ho tro cac truong tuy chinh:

| Truong | Muc dich |
|--------|----------|
| **Global Site Tag** | Dan bat ky doan ma tracking nao khac (Google Tag Manager, Hotjar, v.v.) |
| **Phone Tracking** | Ma tracking tuy chinh khi nhan so dien thoai |
| **Form Tracking** | Ma tracking tuy chinh khi gui form |
| **Zalo/Messenger Tracking** | Ma tracking tuy chinh khi nhan Zalo/Messenger |

### Vi du su dung Global Site Tag voi Google Tag Manager:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

---

## 6. Luu y quan trong

1. **Chi can nhap ID** - He thong tu dong load script, khong can dan toan bo doan code
2. **Khong trung lap** - Neu da nhap GA4 ID thi khong can dan them gtag script vao Global Site Tag
3. **Kiem tra sau khi luu** - Luon kiem tra Pixel Helper sau khi cai dat de dam bao hoat dong
4. **Mot Pixel cho nhieu trang** - Co the dung chung mot Pixel ID cho nhieu landing page
5. **De trong neu khong dung** - Cac truong tracking deu la tuy chon, khong bat buoc

## 7. Cac loi thuong gap

| Loi | Nguyen nhan | Cach xu ly |
|-----|-------------|------------|
| Pixel khong hoat dong | Sai ID | Kiem tra lai ID, dam bao copy dung |
| GA4 khong nhan du lieu | Sai format | Phai bat dau bang `G-` (vi du: G-1A2B3C4D5E) |
| FB Pixel bao loi | Sai format | Phai la chuoi so 10-20 ky tu |
| TikTok khong tracking | Pixel chua duoc kich hoat | Vao TikTok Ads Manager kiem tra trang thai Pixel |
| Trung lap su kien | Dan ca ID lan script | Chi nhap ID, bo doan script trong Global Site Tag |
