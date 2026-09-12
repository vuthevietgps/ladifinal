# MÔ TẢ LANDING PAGE: DỊCH VỤ LÀM PHÙ HIỆU XE

> Tài liệu này mô tả đầy đủ cấu trúc, nội dung, UI/UX cho coder build landing page dịch vụ làm phù hiệu xe kinh doanh vận tải.

---

## TỔNG QUAN

- **Mục tiêu:** Chuyển đổi chủ xe tải / doanh nghiệp vận tải thành khách hàng đặt dịch vụ qua Zalo/điện thoại
- **Khách hàng mục tiêu:** Chủ xe tải cá nhân, hộ kinh doanh vận tải, doanh nghiệp có đội xe
- **Device ưu tiên:** Mobile-first (chủ xe chủ yếu dùng điện thoại)
- **Màu sắc chủ đạo:** Xanh dương `#1E5FA8` + Cam `#E07B20`
- **Font:** Sans-serif (Roboto hoặc Inter)
- **CTA chính:** Nhắn Zalo + Gọi điện

---

## CẤU TRÚC TRANG (từ trên xuống)

---

### SECTION 1 — HERO

**Mục đích:** Chốt vấn đề ngay, tạo hành động trong 5 giây đầu

**Layout:** Full-width, background ảnh xe tải trên đường (overlay tối ~50%), text trắng nổi

**Nội dung:**

```
HEADLINE (lớn, bold):
"Xe kinh doanh chưa có phù hiệu?
Xử lý gọn trong 2 ngày — Không cần đến Sở"

SUB-HEADLINE:
"Gửi ảnh hồ sơ qua Zalo → Chúng tôi lo toàn bộ thủ tục → Phù hiệu giao tận tay"

2 NÚT CTA (to, nằm ngang):
[📲 Nhắn Zalo Ngay]   [☎️ Gọi: 0xxx xxx xxx]

TRUST BADGES (hàng icon nhỏ bên dưới):
✅ Đúng quy định pháp luật  |  ✅ Phí trọn gói, không phát sinh  |  ✅ Giao tận nơi toàn quốc
```

**UI notes:**
- Nút Zalo màu xanh Zalo `#0068FF`, nút Gọi màu cam `#E07B20`
- Trust badges nền trắng mờ, bo góc nhẹ
- Mobile: 2 nút xếp dọc full-width

---

### SECTION 2 — PAIN POINT (Nỗi đau / Rủi ro)

**Mục đích:** Tạo urgency, đánh vào nỗi sợ bị phạt

**Tiêu đề section:**
```
"Xe chạy không có phù hiệu — Rủi ro bạn đang chịu MỖI NGÀY"
```

**Layout:** 3 card nằm ngang (mobile: xếp dọc)

| Card 1 | Card 2 | Card 3 |
|--------|--------|--------|
| 🚔 Lái xe bị phạt | 🏢 Chủ xe (tổ chức) | ⚠️ Trừ điểm bằng lái |
| **5–7 triệu đồng** | **8–12 triệu đồng** | **2 điểm / lần** |
| Theo NĐ 168/2024 | Theo NĐ 168/2024 | Trừ trực tiếp bằng lái |

**UI notes:**
- Nền card màu cam nhạt `#FFF3E0`, viền cam, số tiền màu đỏ đậm `#C0392B` font lớn
- Thêm dòng nhỏ cuối section (italic): *"Nguồn: Nghị định 168/2024/NĐ-CP về xử phạt vi phạm giao thông đường bộ"*

---

### SECTION 3 — QUY TRÌNH ⭐ (Trọng tâm nhất)

**Mục đích:** Giải toả nỗi sợ "thủ tục phức tạp, mất nhiều thời gian đi lại"

**Tiêu đề section:**
```
"Bạn chỉ cần làm 1 việc duy nhất
Còn lại chúng tôi lo hết"
```

**Layout:** Timeline 4 bước nằm ngang (mobile: dọc với đường kẻ dọc nối bước)

#### BƯỚC 1 — Chụp & Gửi hồ sơ
- **Icon:** 📸 camera
- **Tiêu đề:** Chụp ảnh & Gửi qua Zalo
- **Mô tả:** Bạn chỉ cần chụp ảnh giấy tờ và gửi cho chúng tôi qua Zalo. Không cần đến văn phòng.
- **Giấy tờ cần gửi:**
  - Ảnh đăng ký xe (mặt trước + sau)
  - Ảnh đăng kiểm xe (còn hạn)
  - CCCD chủ xe (nếu cá nhân) / ĐKKD (nếu công ty)
  - Thông tin thiết bị GPS/hành trình

#### BƯỚC 2 — Kiểm tra miễn phí
- **Icon:** 🔍 kính lúp
- **Tiêu đề:** Chúng tôi kiểm tra hồ sơ
- **Mô tả:** Phản hồi trong vòng 30 phút. Thông báo ngay nếu thiếu giấy tờ và hướng dẫn bổ sung.
- **Badge:** "Miễn phí tư vấn"

#### BƯỚC 3 — Nộp hồ sơ lên Sở GTVT
- **Icon:** 📋 hồ sơ
- **Tiêu đề:** Chúng tôi xử lý toàn bộ
- **Mô tả:** Thay mặt bạn soạn hồ sơ, nộp và làm việc trực tiếp với Sở Giao thông Vận tải. Bạn không cần đi đâu.

#### BƯỚC 4 — Nhận phù hiệu tận tay
- **Icon:** 🎉 hoàn thành
- **Tiêu đề:** Nhận kết quả tận nơi
- **Mô tả:** Giao phù hiệu tận tay hoặc qua bưu điện.
- **Badge nổi bật:** ⏱ "Chỉ 2–3 ngày làm việc"

**Dòng tổng kết bên dưới (lớn, căn giữa, màu xanh):**
```
"Từ lúc gửi ảnh → có phù hiệu trong tay: chỉ 2–3 ngày làm việc"
```

**UI notes:**
- Các bước nối nhau bằng mũi tên `→` hoặc đường kẻ có mũi tên
- Mỗi bước có số thứ tự lớn (01, 02, 03, 04) màu xanh làm điểm nhấn
- Highlight BƯỚC 1 bằng border cam — vì đây là action của khách hàng

---

### SECTION 4 — HỒ SƠ CẦN CHUẨN BỊ

**Mục đích:** Khách tự kiểm tra được ngay, giảm rào cản

**Tiêu đề section:**
```
"Bạn cần chuẩn bị gì?"
```

**Layout:** 2 cột (Tab hoặc 2 card song song)

#### Cột trái — Cá nhân
- Ảnh đăng ký xe (mặt trước + mặt sau)
- Ảnh đăng kiểm xe (còn hạn sử dụng)
- Ảnh CCCD chủ xe
- Thông tin thiết bị giám sát hành trình (GPS/hộp đen)

#### Cột phải — Doanh nghiệp / Công ty
- Ảnh đăng ký xe
- Ảnh đăng kiểm xe
- Giấy đăng ký kinh doanh
- Thông tin thiết bị GPS

**Callout box (nền cam nhạt, icon 💡):**
```
Chưa có GPS/hộp đen?
Chúng tôi tư vấn lắp đặt đúng chuẩn — có thể làm trọn gói cùng phù hiệu.
[Hỏi ngay]
```

---

### SECTION 5 — BẢNG GIÁ

**Mục đích:** Minh bạch giá, xây dựng tin tưởng

**Tiêu đề section:**
```
"Phí dịch vụ — Trọn gói, không phát sinh"
```

**Layout:** Bảng 3 cột hoặc 3 card giá (pricing cards)

| Dịch vụ | Thời gian | Phí |
|---------|-----------|-----|
| Phù hiệu xe tải (xe đầu tiên) | 2–3 ngày | 1.000.000đ |
| Phù hiệu xe tải (từ xe thứ 2) | 2–3 ngày | 900.000đ |
| Phù hiệu xe hợp đồng | 2–5 ngày | Liên hệ |
| Gia hạn / Cấp lại phù hiệu | 2–3 ngày | Liên hệ |
| Gói đội xe (từ 3 xe) | Ưu đãi riêng | Liên hệ |

**Ghi chú nhỏ bên dưới bảng:**
```
* Giá trên chưa bao gồm phí vận chuyển hồ sơ (tính theo thực tế).
* Phí trọn gói — không phát sinh thêm chi phí.
```

**CTA mini:** `[Nhận báo giá chi tiết qua Zalo]`

---

### SECTION 6 — ĐIỂM KHÁC BIỆT (USP)

**Mục đích:** Thuyết phục tại sao chọn mình thay vì tự làm hoặc chọn đối thủ

**Tiêu đề section:**
```
"Tại sao chọn chúng tôi?"
```

**Layout:** 4 card icon (2x2 trên mobile, 4 ngang trên desktop)

| Icon | Tiêu đề | Mô tả |
|------|---------|-------|
| ⚡ | Nhanh nhất | Cam kết 2–3 ngày với xe biển địa phương. Trả tiền nếu trễ hẹn. |
| 📦 | Giao tận nơi | Không cần đến văn phòng lấy một lần duy nhất. Giao qua bưu điện toàn quốc. |
| 💬 | Hỗ trợ 24/7 | Nhắn Zalo bất cứ lúc nào. Phản hồi trong 30 phút trong giờ hành chính. |
| 🔒 | Đúng pháp luật | Theo đúng Nghị định 158/2024/NĐ-CP. Phù hiệu được cấp bởi Sở GTVT chính thức. |

---

### SECTION 7 — SOCIAL PROOF

**Mục đích:** Tăng tin tưởng qua bằng chứng thực tế

**Layout:** Chia 2 phần

#### Phần trên — Số liệu tổng quan (3 stat lớn, căn giữa)
```
500+           30+              4.9 ⭐
Xe đã          Tỉnh thành       Đánh giá
được cấp       phục vụ         Google Maps
phù hiệu
```

#### Phần dưới — Testimonial cards (carousel trên mobile)

Mỗi card gồm:
- Avatar tròn (ảnh hoặc initial)
- Tên + địa phương (VD: *Nguyễn Văn A — Bình Dương*)
- Nội dung feedback (2–3 dòng)
- Số sao ⭐⭐⭐⭐⭐

Gợi ý nội dung feedback mẫu:
```
"Mình gửi ảnh lúc sáng, chiều được báo hồ sơ OK.
3 ngày sau nhận phù hiệu qua bưu điện. Nhanh và
không phải đi đâu, rất tiện cho tài xế bận chạy xe."
```

**Bonus — Live proof nhỏ (optional, hiệu ứng tâm lý tốt):**
```
🟢 Hôm nay đã có 4 khách gửi hồ sơ
```
*(Static text, cập nhật thủ công hoặc random trong range)*

---

### SECTION 8 — CÁC GÓI DỊCH VỤ (Upsell)

**Mục đích:** Tăng giá trị đơn hàng, phục vụ nhiều nhu cầu

**Tiêu đề section:**
```
"Chọn gói phù hợp với bạn"
```

**Layout:** 3 pricing card (card giữa highlight "Phổ biến nhất")

#### Gói Cơ Bản
- Phù hiệu xe tải
- Tư vấn hồ sơ qua Zalo
- Phù hợp: Xe đã có GPS, đã đăng kiểm
- **Giá: từ 900.000đ/xe**

#### Gói Trọn Gói ⭐ (HIGHLIGHT)
- Phù hiệu xe tải
- Tư vấn + kiểm tra hồ sơ
- Giao nhận tận nơi
- Hỗ trợ xử lý phát sinh
- **Giá: Liên hệ báo giá**
- Badge: "Được chọn nhiều nhất"

#### Gói Đội Xe
- Từ 3 xe trở lên
- Giá ưu đãi theo số lượng
- Có nhân viên phụ trách riêng
- Báo cáo tiến độ từng xe
- **Giá: Liên hệ**

---

### SECTION 9 — FAQ

**Mục đích:** Giải toả lo ngại, giảm rào cản ra quyết định

**Layout:** Accordion (click mở/đóng từng câu)

| Câu hỏi | Trả lời |
|---------|---------|
| Xe tôi biển tỉnh khác có làm được không? | Được. Tuy nhiên thời gian xử lý sẽ là 5–8 ngày thay vì 2–3 ngày vì cần xác nhận liên tỉnh. |
| Chưa có GPS/hộp đen thì sao? | Bắt buộc phải có GPS trước khi cấp phù hiệu. Chúng tôi có thể tư vấn và hỗ trợ lắp đặt thiết bị đúng chuẩn. |
| Phù hiệu có hiệu lực bao lâu? | Tối đa 7 năm, tùy theo niên hạn còn lại của xe. Nếu niên hạn xe còn ít hơn 7 năm, thời hạn phù hiệu bằng niên hạn xe. |
| Xe tải dưới 3.5 tấn có cần phù hiệu không? | Có. Theo quy định hiện hành, tất cả xe tải tham gia kinh doanh vận tải đều phải có phù hiệu, không phân biệt tải trọng. |
| Phù hiệu hết hạn thì làm như thế nào? | Làm thủ tục cấp lại, quy trình tương tự cấp mới. Nên làm trước 15 ngày khi phù hiệu hết hạn. |
| Tôi cần đến văn phòng không? | Không cần. Toàn bộ quy trình thực hiện qua Zalo. Phù hiệu được giao tận nơi. |

---

### SECTION 10 — CTA CUỐI TRANG

**Mục đích:** Chốt hành động lần cuối với khách còn do dự

**Layout:** Full-width background màu xanh đậm `#1E5FA8`, text trắng

**Nội dung:**
```
HEADLINE:
"Xe đang chạy mà chưa có phù hiệu?"

SUB:
"Liên hệ ngay — Tư vấn miễn phí, làm thủ tục ngay hôm nay"

2 NÚT LỚN:
[📲 Nhắn Zalo Ngay]   [☎️ Gọi: 0xxx xxx xxx]

DÒNG NHỎ BÊN DƯỚI:
"Hoặc để lại số điện thoại — chúng tôi gọi lại trong 15 phút"

FORM MINI:
[Số điện thoại ________] [Gửi]
```

---

## CÁC WIDGET / TÍNH NĂNG TƯƠNG TÁC

### Widget 1 — Máy tính rủi ro (Optional, tăng chuyển đổi)

Đặt trong Section 2 hoặc ngay dưới Hero.

```
"Tính thiệt hại nếu bị phạt"

Bạn có bao nhiêu xe? [Nhập số]

→ Hiển thị kết quả:
Nếu 1 xe bị phạt: 7.000.000đ
Chi phí làm phù hiệu ngay: 900.000đ
→ Tiết kiệm: 6.100.000đ
```

### Widget 2 — Quiz kiểm tra xe (Optional)

Đặt ngay sau Hero, dạng 3 bước nhỏ:

```
Bước 1: Xe bạn là loại gì?
  [Xe tải cá nhân]  [Xe công ty/doanh nghiệp]  [Xe hợp đồng]

Bước 2: Xe đã có GPS chưa?
  [Đã có]  [Chưa có]

Bước 3: Biển số tỉnh nào?
  [Chọn tỉnh ▼]

→ Kết quả:
"Xe của bạn BẮT BUỘC phải có phù hiệu.
Thời gian làm: 2–3 ngày | Phí: từ 900.000đ"
[Làm ngay qua Zalo]
```

---

## CÁC THÀNH PHẦN UX CỐ ĐỊNH

### Sticky Header / Bar
Luôn hiển thị khi scroll xuống:
```
🔥 Làm phù hiệu hôm nay — nhận kết quả sau 2 ngày   [Zalo ngay] [Gọi ngay]
```
Nền trắng, đổ bóng nhẹ, không che content.

### Floating CTA Button (Mobile)
Nút Zalo và nút Gọi cố định góc dưới màn hình (fixed bottom), hai bên trái phải.

### Exit Intent Popup (Desktop)
Khi di chuột lên thanh địa chỉ trình duyệt:
```
"Khoan đã! Nhận tư vấn miễn phí trước khi rời trang"
[Số điện thoại] [Gửi yêu cầu]
```

---

## CHÚ Ý KỸ THUẬT CHO CODER

| Hạng mục | Yêu cầu |
|----------|---------|
| **Responsive** | Mobile-first. Breakpoint chính: 768px |
| **CTA Zalo** | Link `https://zalo.me/[số điện thoại]` hoặc deep link app |
| **Performance** | Ảnh lazy load, LCP < 2.5s |
| **Analytics** | Gắn pixel Facebook Ads + Google Analytics, track click CTA |
| **SEO** | Title tag: "Dịch vụ làm phù hiệu xe tải – Nhanh 2 ngày – Giao tận nơi" |
| **Schema** | LocalBusiness schema cho SEO |
| **Tracking** | Track event: click Zalo, click Gọi, submit form, scroll depth |

---

## NỘI DUNG FOOTER

```
[Logo] Dịch vụ làm phù hiệu xe | [Địa chỉ] | [Hotline] | [Zalo]

Giờ làm việc: 7:30 – 18:00 (Thứ 2 – Thứ 7) | Hỗ trợ Zalo: 24/7

Căn cứ pháp lý: Nghị định 158/2024/NĐ-CP | Nghị định 168/2024/NĐ-CP

© 2025 [Tên công ty] — Chuyên dịch vụ thủ tục vận tải
```

---

## CHIẾN LƯỢC CONTENT & TRAFFIC

### SEO — Bài blog kéo traffic tự nhiên
Các từ khóa đuôi dài, ít cạnh tranh, intent mua cao:
- "Xe tải dưới 3.5 tấn có cần phù hiệu không?"
- "Bị phạt bao nhiêu khi không có phù hiệu xe tải 2025?"
- "Cần những giấy tờ gì để làm phù hiệu xe tải?"
- "Phù hiệu xe tải hết hạn có bị phạt không?"
- "Làm phù hiệu xe tải ở đâu nhanh và rẻ nhất?"

### Kênh quảng cáo
- **Facebook/Zalo Ads:** Target chủ xe tải, lái xe, hội nhóm vận tải các tỉnh
- **Zalo OA:** Chatbot tự động hỏi loại xe → gửi checklist hồ sơ
- **Referral:** Hoa hồng cho người giới thiệu (garage, đại lý xe, bảo hiểm)
- **Group cộng đồng:** Tham gia hội xe tải, đăng bài tư vấn không spam

---

## ĐỊNH VỊ THƯƠNG HIỆU

Chọn **1 trong 4 góc** để làm điểm nhấn xuyên suốt toàn trang:

| Định vị | Thông điệp chính | Phù hợp khi |
|---------|-----------------|-------------|
| **Nhanh nhất** | "2 ngày, cam kết hoàn tiền nếu trễ" | Quy trình vận hành chuẩn |
| **Dễ nhất** | "Chụp 3 ảnh — còn lại chúng tôi lo" | Khách ngại thủ tục |
| **Đội xe B2B** | Chuyên phục vụ doanh nghiệp 5+ xe | Muốn khách ổn định, giá trị cao |
| **Toàn quốc** | Làm được xe biển tỉnh khác | Ít đối thủ chơi góc này |

---

*Tài liệu tổng hợp từ nghiên cứu thị trường thực tế — căn cứ Nghị định 158/2024/NĐ-CP và 168/2024/NĐ-CP*
