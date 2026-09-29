# Quy tắc thiết kế và đóng gói Landing Page

Phiên bản 1.2 — 27/09/2026. File này giữ quy cách giao diện/asset/ZIP;
[quytrinh.md](quytrinh.md) giữ các phase. Quyền thực thi và quick/targeted/full theo
[nguồn chung ERP–Ladifinal](../htxbachgia.shop/final8-version16/docs/operations/shared-operating-policy.md).
Dự án mới dùng `landing-pages/<group-key>/<landing-key>/`. Tên trường admin, giới
hạn và route minh họa phải đối chiếu runtime; ví dụ không phải dữ liệu mặc định.

> File nay danh cho AI (Claude, Codex, ChatGPT) doc de thiet ke landing page tuong thich voi he thong ladifinal.
> **Hai bước kỹ thuật:** thiết kế/kiểm chứng rồi đóng gói khi phạm vi đã giao cần đến. Nếu đã yêu cầu đóng gói hoặc triển khai, tiếp tục sau kiểm chứng; không xin lại quyền hoặc bắt nhắc từ “ZIP”. Xuất bản vẫn theo đích và phạm vi đã được giao.
> **CAP NHAT:** Admin hien tai co the tao page ma khong can upload ZIP. Neu khong co ZIP, he thong tao trang mac dinh.
> Tuy nhien, de co landing page day du giao dien/noi dung, van nen chuan bi bo file va dong goi ZIP.

---

## QUY TRINH 2 PHA

### PHA 1: THIET KE & PREVIEW (Mac dinh)

> Yêu cầu chỉ thiết kế kết thúc ở preview. Nếu đã giao đóng gói/triển khai, hoàn tất kiểm chứng rồi tiếp tục bước tương ứng trong cùng tác vụ.

**Viec can lam:**

1. Tao folder voi cau truc chuan (xem muc "Cau truc folder")
2. Viet day du HTML/CSS/JS
3. Noi dung hien thi cho nguoi dung tren landing page (tieu de, mo ta, nut CTA, bang gia, thong bao, ...) **PHAI viet bang tieng Viet co dau**.
4. **BAT BUOC tra ve 1 duong link de test**:
   - Uu tien: chay `python -m http.server 8080` trong folder landing, gui link `http://localhost:8080`
   - Neu da co server Flask dang chay va page da duoc publish: gui link `http://localhost:5000/landing/<subdomain>?debug=1`
   - Neu moi truong khong mo duoc link truc tiep: phai gui ro lenh de user tu chay va URL sau khi chay

5. Tra ve danh sach file da tao/sua (`index.html`, `css/style.css`, `js/script.js`, ...).
6. Báo preview thực sự đã chạy và kiểm chứng, hoặc ghi rõ lệnh/URL dự kiến nếu chưa chạy được. Yêu cầu chỉ thiết kế thì dừng ở kết quả này; yêu cầu đã gồm đóng gói/triển khai thì tiếp tục.
7. Khi người dùng yêu cầu sửa, kiểm tra targeted phần sửa và phụ thuộc theo quy định chung. Giữ phạm vi đã giao, trừ khi người dùng thay đổi hoặc yêu cầu dừng.

Không hỏi lại việc đã được giao rõ. Thiếu quyết định như domain/hotline/đích triển
khai thì hỏi gộp phần thiếu, tiếp tục chuẩn bị phần độc lập.

---

### PHA 2: Đóng gói ZIP theo phạm vi đã giao

> Thực hiện khi đã yêu cầu đóng gói, hoặc khi đóng gói là bước cần thiết cho việc triển khai đã được giao. Không cần một lượt xác nhận riêng sau preview. “OK” được hiểu theo đề nghị và phạm vi cụ thể trước đó; nếu chưa có yêu cầu đóng gói/triển khai thì không suy ra quyền xuất bản.

**Deploy qua phần quản lý landingpage nhận ZIP vẫn bắt buộc có ZIP của bản thiết kế.**
Luồng đầy đủ: kiểm chứng source → tạo ZIP → kiểm tra `index.html`/asset trong archive
→ upload/cập nhật đúng landing trong phần quản lý server → kiểm tra URL live.
“Không xác nhận ZIP riêng” không có nghĩa bỏ đóng gói/upload. Không báo deploy xong
khi mới có ZIP local hoặc khi server chỉ tạo trang mặc định. Thiếu server/landing
đích thì hỏi đúng thông tin thiếu; nếu đã rõ và đã được giao deploy thì làm tiếp.

**Lenh dong goi:**

```bash
# Linux/Mac
cd ten-folder-landing && zip -r ../ten-landing.zip .

# Windows PowerShell
cd ten-folder-landing
powershell Compress-Archive -Path * -DestinationPath ../ten-landing.zip -Force
```

**Yeu cau ZIP:**
- `index.html` PHAI nam o **thu muc goc** cua ZIP (khong lot trong subfolder)
- Ten file ZIP ro rang: `phu-hieu-xe-landing.zip`, `giay-phep-vao-pho.zip`
- Sau khi dong goi, AI phai tra ve: ten file ZIP + duong dan day du + lenh kiem tra nhanh (`unzip -l` hoac `tar -tf` neu can)

Cau truc ZIP DUNG:
```
ten-landing.zip
├── index.html          <-- ROOT
├── css/style.css
├── js/script.js
└── images/...
```

Cau truc ZIP SAI:
```
ten-landing.zip
└── ten-folder/         <-- SAI: index.html bi lot
    └── index.html
```

---

## LUU Y VAN HANH (ADMIN HIEN TAI)

- Form admin tao Landing/Homepage hien tai KHONG bat buoc upload ZIP.
- Neu tao moi ma khong co ZIP, he thong se tao 1 trang mac dinh (`index.html`) de page van hoat dong.
- Neu can landing page day du (HTML/CSS/JS/anh theo thiet ke), van phai co bo file va dong goi ZIP de deploy.

---

## CAU TRUC FOLDER BAT BUOC

```
ten-landing/
├── index.html              (bat buoc)
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
    ├── hero.jpg
    ├── logo.png
    └── ...
```

### Quy tac dat ten file:
- Chi chu thuong, so, dau gach ngang: `style-main.css`, `hero-banner.jpg`
- Khong dau cach, ky tu dac biet, tieng Viet co dau
- Duoi file hop le: `.html`, `.htm`, `.css`, `.js`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.ico`, `.txt`, `.json`, `.woff`, `.woff2`, `.ttf`, `.otf`, `.eot`

---

## QUY TAC DUONG DAN ASSET

**BAT BUOC dung duong dan tuyet doi** bat dau bang `/`:

```html
<!-- DUNG - Duong dan tuyet doi -->
<link rel="stylesheet" href="/css/style.css">
<img src="/images/logo.png">
<script src="/js/script.js"></script>

<!-- SAI - Duong dan tuong doi -->
<link rel="stylesheet" href="css/style.css">
<img src="images/logo.png">
```

**Ly do:** He thong tu dong rewrite duong dan khi upload:
- Landing page: `/css/style.css` → `/landing/<subdomain>/css/style.css`
- Homepage: `/css/style.css` giu nguyen

**KHONG rewrite:** URL `http(s)://`, `//domain`, `data:`, `mailto:`, `#anchor`

**TRANH:** `<base href="/">`, duong dan tuong doi, `../`

---

## GIOI HAN HE THONG

| Gioi han | Gia tri |
|----------|---------|
| Kich thuoc toi da moi file | 50MB |
| Tong kich thuoc ZIP | 500MB |
| So file toi da | 500 |
| Do dai subdomain | 1-40 ky tu |
| Ky tu subdomain | a-z, 0-9, dau gach ngang |
| Tu khoa cam | admin, api, www, test, static, login, logout, health... |

---

## TEMPLATE HTML CHUAN

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tieu de trang</title>
    <link rel="stylesheet" href="/css/style.css">
    <!-- Font Awesome (tuy chon) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>

    <!-- HERO SECTION -->
    <section class="hero">
        <h1>Tieu de chinh</h1>
        <p>Mo ta ngan ve dich vu</p>
        <a href="tel:0901234567" class="btn-cta">Goi ngay</a>
    </section>

    <!-- NOI DUNG DICH VU -->
    <section class="services">
        <!-- Danh sach dich vu, uu diem -->
    </section>

    <!-- BANG GIA (neu co) -->
    <section class="pricing">
        <!-- Bang gia dich vu -->
    </section>

    <!-- FORM LIEN HE -->
    <section class="contact">
        <!-- Google Form iframe hoac form HTML -->
        <iframe src="https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true"
                width="100%" height="500" frameborder="0"></iframe>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <p>Lien he: 0901234567 | Zalo: 0901234567</p>
    </footer>

    <!-- NUT CTA CO DINH - BAT BUOC -->
    <div class="fixed-cta">
        <a href="tel:0901234567" class="btn-call">
            <i class="fas fa-phone"></i> Goi ngay
        </a>
        <a href="https://zalo.me/0901234567" class="btn-zalo" target="_blank">
            Zalo tu van
        </a>
    </div>

    <script src="/js/script.js"></script>
</body>
</html>
```

---

## CSS CHUAN

```css
/* Reset & Base */
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,sans-serif;color:#333}

/* CSS Variables */
:root{
    --primary:#2563eb;
    --danger:#e74c3c;
    --success:#27ae60;
    --warning:#f39c12;
    --dark:#2c3e50;
    --light:#f8f9fa;
    --zalo:#0068ff;
}

/* Container */
.container{max-width:1200px;margin:0 auto;padding:0 15px}

/* NUT CTA CO DINH - BAT BUOC */
.fixed-cta{
    position:fixed;bottom:0;left:0;right:0;
    display:flex;z-index:9999;
}
.fixed-cta a{
    flex:1;padding:14px;text-align:center;
    color:#fff;text-decoration:none;font-weight:bold;font-size:16px;
}
.btn-call{background:var(--danger)}
.btn-zalo{background:var(--zalo)}

/* Responsive */
@media(max-width:768px){
    /* Tablet & mobile */
}
@media(max-width:480px){
    /* Mobile nho */
}
```

---

## TRACKING - KHONG TU THEM SCRIPT

> **QUAN TRONG:** KHONG tu them script tracking vao HTML neu khong duoc user yeu cau ro.

He thong tu dong inject tracking khi tao/cap nhat page.
Form quan tri hien tai co cac o lien quan tracking:

| Truong | Format | Vi du |
|--------|--------|-------|
| Facebook Pixel ID | Chuoi 10-20 so | `123456789012345` |
| TikTok Pixel ID | Chuoi chu + so | `C5JLGR3BVJC2P8DNFHKG` |
| Ma chuyen doi Google Ads (AW) | So hoac `AW-<so>` | `16590250699` hoac `AW-16590250699` |
| Nhan chuyen doi SDT | Chu + so + `_` + `-` | `GoKSCL2gqoEcEMvF7OY9` |
| Nhan chuyen doi Zalo | Chu + so + `_` + `-` | `nuf0CMCgqoEcEMvF7OY9` |
| Global Site Tag (Legacy - Optional) | Doan script/ma tuy chinh | Script tuy bien them |

Tên trường và khả năng GA4/Google tag phải đối chiếu form/runtime hiện hành; không
kết luận thiếu chức năng từ mô tả form cũ. Không tự chèn script thứ hai để bù trường chưa tìm thấy.

### Google Ads conversion (chi tiet can nho)

Ban can dung 2 nhom ma:
1. Google tag goc (vi du `AW-16590250699`)
2. Event conversion cho tung hanh dong (`send_to: 'AW-.../LABEL'`)

Noi lay ma:
- Google Ads -> Muc tieu -> Luot chuyen doi
- Tao conversion website
- Chon cai dat thu cong de lay:
  - Doan Google tag base
  - Doan event snippet

Noi dien tren form admin:
- `Ma chuyen doi` trong Google Ads -> o `Ma chuyen doi Google Ads (AW)`.
- `Nhan chuyen doi` cho hanh dong goi dien -> o `Nhan chuyen doi SDT`.
- `Nhan chuyen doi` cho hanh dong Zalo -> o `Nhan chuyen doi Zalo`.

Co che he thong:
- He thong tu khoi tao Google tag AW va tu ban su kien conversion cho `tel:` va `zalo.me` theo dung `send_to: AW-.../LABEL`.
- `Global Site Tag (Legacy - Optional)` chi dung khi can chen them script tuy bien.
- Khong can copy event snippet vao HTML thu cong neu da dien dung 3 o tren.

Các trường riêng sau thuộc giao diện cũ, kiểm tra phiên bản đang chạy trước khi hướng dẫn:
- `Phone Tracking`
- `Form Tracking`
- `Zalo/Messenger Tracking`

Việc đo Phone/Zalo/Form phải kiểm chứng qua handler thực tế (`tel:`, `zalo.me`,
`form submit`); có trường hoặc có script không chứng minh đã nhận sự kiện. CTA click
không tự là lead xác minh/đơn; kiểm tra collector và Google tag riêng, không đếm trùng.

**He thong tu dong theo doi:**
- Page view (xem trang)
- Phone click (nhan so dien thoai qua `tel:`)
- Zalo click (nhan link `zalo.me`)
- Form submit (gui form)
- CTA button click (nut `.btn-buy`, `.btn-order`, `.cta-button`)
- Scroll depth (25%, 50%, 75%, 100%)

**Dieu can lam de do conversion Google Ads dung:**
1. Dien dung `Ma chuyen doi Google Ads (AW)`.
2. Dien `Nhan chuyen doi SDT` va `Nhan chuyen doi Zalo` dung label trong Google Ads.
3. Dam bao link dien thoai va Zalo dung format chuan:

```html
<a href="tel:0901234567">Goi ngay</a>
<a href="https://zalo.me/0901234567">Nhan tin Zalo</a>
```

---

## MAU PHONG CACH

### Mau sac thuong dung:
- **Do khan cap**: `#e74c3c` - nut CTA, canh bao
- **Xanh tin cay**: `#2563eb` - header, thong tin
- **Xanh la**: `#27ae60` - gia, uu dai
- **Cam hanh dong**: `#f39c12` - badge, khuyen mai
- **Zalo**: `#0068ff` - nut Zalo

### Font: Uu tien font he thong
```css
font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
```

### Icon: Font Awesome qua CDN
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
```

---

## KIEM TRA TRUOC KHI BAO "DA XONG PHA 1"

Landing mới kiểm tra đủ checklist dưới đây. Sửa landing hiện có dùng targeted theo
phần thay đổi và phụ thuộc; ghi rõ evidence còn hợp lệ được dùng lại. Sửa shared
template phải xét các landing phụ thuộc. Không đóng lỗi chỉ dựa vào preview cũ.

- [ ] `index.html` o thu muc goc
- [ ] Tat ca asset dung duong dan tuyet doi (`/css/`, `/js/`, `/images/`)
- [ ] Responsive tren mobile (Chrome DevTools > Toggle device)
- [ ] Co nut CTA co dinh (goi dien + Zalo) o cuoi man hinh
- [ ] Link `tel:` va `zalo.me` dung so dien thoai duoc yeu cau
- [ ] KHONG co script tracking (GA, FB, TikTok) trong HTML
- [ ] Anh da toi uu (< 500KB/anh, uu tien WebP)
- [ ] Trang tai nhanh, khong loi console
- [ ] CSS dung format compact, co responsive

## KIEM TRA TRUOC KHI DONG GOI ZIP (PHA 2)

- [ ] Checklist Pha 1 đủ bằng chứng còn hợp lệ cho phiên bản đóng gói; phần thay đổi đã kiểm tra lại
- [ ] `index.html` nam o root cua ZIP (khong lot trong subfolder)
- [ ] Khong co file thua (README, .DS_Store, node_modules, ...)
- [ ] Ten ZIP ro rang, khong dau cach

---

## VI DU PROMPT

### Nguoi dung yeu cau thiet ke:
```
Thiet ke landing page cho dich vu "Phu hieu xe tai":
- SDT: 0901234567, Zalo: 0901234567
- Dich vu: Lam phu hieu xe tai, xe khach
- Gia: Tu 2.500.000d
- Mau sac: Do + trang
```

### AI tra loi (Pha 1):
> Tao folder, viet code HTML/CSS/JS, cho link preview.
> Báo link preview đã kiểm chứng và kết quả. Với yêu cầu chỉ thiết kế, kết thúc ở preview; không yêu cầu một câu xác nhận đóng gói theo mẫu bắt buộc.

### Nguoi dung xac nhan:
```
OK, dong goi ZIP cho toi
```

### AI thuc hien (Pha 2):
> Dong goi ZIP, thong bao ten file va vi tri.

Nếu prompt ban đầu đã là “Thiết kế và đóng gói landing ...”, thực hiện cả hai bước
sau kiểm chứng, không chờ thêm câu “OK, đóng gói ZIP”. Nếu đã yêu cầu triển khai,
tiếp tục Phase 4 của quytrinh.md với đích đã xác minh và kiểm tra URL sau phát hành.

---

## KIEM THU SAU KHI UPLOAD LEN HE THONG

- Neu khong upload ZIP, page moi se la trang mac dinh (khong phai giao dien landing da thiet ke).
- Landing page: mo `/landing/<subdomain>`
- Homepage: mo `/` (root)
- Kiem tra: F12 > Network > tat ca asset tra ve 200 OK
- Header `X-Landing-Subdomain` khop subdomain
- Them `?debug=1` de bo cache khi test
- Debug homepage: `/_debug_active_homepage`

---

## FILE MAU THAM KHAO

- Xem [danh mục landing](landing-pages/README.md) để chọn source tham khảo đúng nhóm sản phẩm.
- Source chuẩn nằm tại `landing-pages/<group-key>/<landing-key>/`.
- Ứng dụng quản lý, tracking và Docker nằm trong `platform/`; không đưa mã ứng dụng vào ZIP landing.
