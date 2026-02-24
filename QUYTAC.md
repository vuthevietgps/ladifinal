# Quy tac thiet ke va dong goi Landing Page

> File nay danh cho AI (Claude, Codex, ChatGPT) doc de thiet ke landing page tuong thich voi he thong ladifinal.
> **QUY TRINH BAT BUOC: 2 PHA** - Thiet ke truoc, test bang link, chi dong goi sau khi user yeu cau ro rang.

---

## QUY TRINH 2 PHA

### PHA 1: THIET KE & PREVIEW (Mac dinh)

> Khi nhan yeu cau thiet ke landing page, **CHI THUC HIEN PHA 1**. KHONG dong goi ZIP.

**Viec can lam:**

1. Tao folder voi cau truc chuan (xem muc "Cau truc folder")
2. Viet day du HTML/CSS/JS
3. **BAT BUOC tra ve 1 duong link de test**:
   - Uu tien: chay `python -m http.server 8080` trong folder landing, gui link `http://localhost:8080`
   - Neu da co server Flask dang chay va page da duoc publish: gui link `http://localhost:5000/landing/<subdomain>?debug=1`
   - Neu moi truong khong mo duoc link truc tiep: phai gui ro lenh de user tu chay va URL sau khi chay

4. Tra ve danh sach file da tao/sua (`index.html`, `css/style.css`, `js/script.js`, ...).
5. **Ket thuc Pha 1** bang cau: *"Da thiet ke xong. Ban co the test tai [link]. Neu ung y va muon dong goi, hay gui prompt dong goi ZIP."*
6. Neu user bao "chua ung", "sua lai", "lam lai", AI quay lai PHA 1, sua code va tra link moi. Van KHONG dong goi ZIP.

**KHONG DUOC** tu dong dong goi ZIP o pha nay.

**Mau phan hoi bat buoc o cuoi PHA 1:**
```
Da thiet ke xong. Ban test tai: http://localhost:8080
Neu ung y, hay gui prompt: "Dong goi ZIP".
Neu chua ung, noi ro muc can sua, toi se viet lai.
```

---

### PHA 2: DONG GOI ZIP (Chi khi nguoi dung yeu cau)

> Chi thuc hien khi nguoi dung yeu cau ro rang ve dong goi, vi du: "dong goi ZIP", "tao file zip", "nen file lai".
> KHONG dong goi neu user chi noi "OK", "duoc", "on roi" ma chua nhac den ZIP.

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

> **QUAN TRONG:** KHONG tu them script Google Analytics, Facebook Pixel, TikTok Pixel vao HTML.

He thong **tu dong inject** tracking code khi upload. Nguoi dung chi nhap ID vao form quan tri:

| Platform | Format ID | Vi du |
|----------|-----------|-------|
| Google Analytics 4 | `G-XXXXXXXXXX` | `G-1A2B3C4D5E` |
| Facebook Pixel | Chuoi 10-20 so | `123456789012345` |
| TikTok Pixel | Chuoi chu + so | `C5JLGR3BVJC2P8DNFHKG` |

**He thong tu dong theo doi:**
- Page view (xem trang)
- Phone click (nhan so dien thoai qua `tel:`)
- Zalo click (nhan link `zalo.me`)
- Form submit (gui form)
- CTA button click (nut `.btn-buy`, `.btn-order`, `.cta-button`)
- Scroll depth (25%, 50%, 75%, 100%)

**Dieu duy nhat can lam:** Dam bao link dien thoai va Zalo dung format chuan:

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

- [ ] Tat ca checklist Pha 1 da dat
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
> Ket thuc: "Da thiet ke xong. Xem tai http://localhost:8080. Neu ung y, bao toi dong goi ZIP."

### Nguoi dung xac nhan:
```
OK, dong goi ZIP cho toi
```

### AI thuc hien (Pha 2):
> Dong goi ZIP, thong bao ten file va vi tri.

---

## KIEM THU SAU KHI UPLOAD LEN HE THONG

- Landing page: mo `/landing/<subdomain>`
- Homepage: mo `/` (root)
- Kiem tra: F12 > Network > tat ca asset tra ve 200 OK
- Header `X-Landing-Subdomain` khop subdomain
- Them `?debug=1` de bo cache khi test
- Debug homepage: `/_debug_active_homepage`

---

## FILE MAU THAM KHAO

- `ladipagetest1/`, `ladipagetest2/` - Cau truc chuan da test thanh cong
- `ho-chieu-service/` - Vi du dich vu lam ho chieu day du tinh nang
- Luon tham khao cac file mau nay khi tao landing page moi
