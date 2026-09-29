# Đánh giá sức khỏe giàn Ads — YYYY-MM-DD

Mẫu theo [tieuchuan.md](../../tieuchuan.md). Khi lưu vào `projects/<project-id>/reviews/`, đổi link này thành `../../../tieuchuan.md`. Không chứa PII/secret hoặc sao chép trạng thái đạt từ lần trước.

## 1. Phạm vi và kết luận

- checkLevel: quick / targeted / full; trigger và nhánh cần kiểm tra: CHƯA CHỐT.
- Evidence dùng lại/làm mới, timestamp, lý do và phần chưa đánh giá: CHƯA XÁC MINH.
- Quick/targeted chỉ điền các phần liên quan, giữ rõ phần chưa kiểm tra; không sao chép PASS hoặc xếp loại toàn giàn từ lần trước. Full xét đủ tiêu chí áp dụng theo tieuchuan.md.
- Audit ID / người đánh giá / người phụ trách: CHƯA XÁC MINH.
- Môi trường, phiên bản triển khai ERP/provider: CHƯA XÁC MINH.
- ERP product ID / group ID / các project liên quan: CHƯA XÁC MINH.
- Kỳ chính / kỳ so sánh / cohort và thời gian trưởng thành: CHƯA XÁC MINH.
- Mốc chốt số / timezone / currency / tỷ giá / độ trễ loại trừ: CHƯA XÁC MINH.
- Mục tiêu CPL/CPA/ROI, ngân sách, ngưỡng mẫu, SLA và thay đổi so với tiêu chuẩn mặc định: CHƯA XÁC MINH. Tham chiếu quyết định đã duyệt trước kỳ.
- Điểm bảo đảm: CHƯA TÍNH; điểm phần kiểm chứng: N/A; độ phủ: CHƯA TÍNH; khoảng điểm: CHƯA TÍNH.
- Điều kiện chặn / kết luận: CHƯA ĐỦ DỮ LIỆU.
- Ba việc ưu tiên: CHƯA ĐÁNH GIÁ.

## 2. Kiểm kê theo sản phẩm

| ERP product ID | Account đã xác minh hợp lệ / mục tiêu ≥3 | Account có impression 7/28 ngày | Chờ chạy / hạn chế / chưa rõ | Tài khoản thiếu để đạt | Bằng chứng, mốc lấy |
|---|---|---|---|---|---|
| CHƯA XÁC MINH | UNKNOWN / 3 | UNKNOWN | UNKNOWN | UNKNOWN | Chưa kiểm kê đủ |

| Provider/account/campaign/adgroup | Adgroup dự kiến chạy | Tổng RSA | ENABLED hiện tại | Đủ điều kiện hiện tại | Có impression trong kỳ | Có click/chi | Có lead xác minh/đơn | Nguyên nhân không phân phối |
|---|---|---|---|---|---|---|---|---|
| CHƯA XÁC MINH | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Chưa có dữ liệu |

Khử trùng account/budget và chốt danh sách dự kiến chạy trước kỳ. Giữ riêng snapshot hiện tại và hoạt động trong kỳ. Nếu không có liên kết đến ad ID, lead/đơn/lợi nhuận từng RSA để N/A, chỉ báo ở cấp đã xác minh.

## 3. Bằng chứng và đối soát ERP

| Nguồn/báo cáo | Phạm vi, bộ lọc, cấp tổng hợp | Thời điểm lấy / watermark | Đầy đủ/thiếu/trễ | Vị trí bằng chứng có phân quyền, không chứa secret |
|---|---|---|---|---|
| Ads inventory / metrics | CHƯA XÁC MINH | UNKNOWN | UNKNOWN | |
| Collector / ACK / ERP visits | CHƯA XÁC MINH | UNKNOWN | UNKNOWN | |
| CRM lead / liên kết đơn | CHƯA XÁC MINH | UNKNOWN | UNKNOWN | |
| ERP chi phí / lợi nhuận / tài chính | CHƯA XÁC MINH | UNKNOWN | UNKNOWN | |

| Account/ngày/nhóm | Chi Ads | Chi ERP | Lệch tiền / % | Visit nguồn / ERP / trùng / trễ | Nguồn chưa rõ | Nguyên nhân / xử lý |
|---|---|---|---|---|---|---|
| CHƯA XÁC MINH | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | |

| Sản phẩm/account/nhóm, kỳ hoặc cohort | Chi | Click / CTA | Lead xác minh | Đơn hợp lệ / hủy / hoàn | Doanh thu thuần | Lợi nhuận sau Ads | CPL / CPA / ROAS / ROI | Lãi/hòa vốn/lỗ/chưa đủ dữ liệu |
|---|---|---|---|---|---|---|---|---|
| CHƯA XÁC MINH | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Chưa đủ dữ liệu |

- Số nhóm có lãi/hòa vốn/lỗ/chưa đủ dữ liệu và tỷ trọng chi từng loại: CHƯA XÁC MINH.
- Chi không có đơn, chưa phân bổ; lead/đơn chưa quy thuộc; tiền tệ chưa quy đổi: CHƯA XÁC MINH.
- Tỷ trọng chi/lead theo account, rủi ro tập trung: CHƯA XÁC MINH.
- Định nghĩa doanh thu/lợi nhuận, Ads đã được trừ chưa, độ trưởng thành: CHƯA XÁC MINH.

## 4. Đối thủ và chẩn đoán ít click

### Phạm vi và số liệu

- Kỳ chính 7 ngày hoàn tất / kỳ trước / đối chiếu 28 ngày: CHƯA XÁC MINH.
- Timezone / currency / độ trễ / ngày chưa chốt: CHƯA XÁC MINH.
- Auction Insights hỗ trợ những trường nào: CHƯA XÁC MINH.
- Impression share / click share / eligible clicks-impressions / budget-lost / rank-lost: CHƯA XÁC MINH.

### Đối thủ lặp lại và chiến lược quan sát được

| Domain / display name | Campaign/adgroup | Cửa sổ xuất hiện | Overlap / position-above / outranking | Landing/URL và thời điểm kiểm tra | Offer, giá, thời gian, bằng chứng, CTA | OBSERVED_FACT / INFERENCE / UNKNOWN | Bằng chứng |
|---|---|---|---|---|---|---|---|
| CHƯA XÁC MINH | | | | | | | |

Chỉ gọi là đối thủ lặp lại khi có ít nhất hai cửa sổ/campaign hoặc có bằng chứng bổ sung. Nếu nguồn chỉ trả domain, không xếp hạng thắng/thua.

### Cây nguyên nhân ít click

| Campaign/adgroup | Trạng thái phễu | Chỉ số thực / kỳ so sánh | Nguyên nhân đã xác nhận | Giả thuyết cần thử | Impact ước tính | Owner/hạn | Phép đo lại |
|---|---|---|---|---|---|---|---|
| CHƯA XÁC MINH | Impression thấp / CTR thấp / liên hệ thấp / click thấp so với cơ hội | | | | | | |

- `CONFIRMED`: có bằng chứng trực tiếp; `HYPOTHESIS`: có dấu hiệu nhưng chưa thử; `UNKNOWN`: thiếu dữ liệu.
- `eligible clicks - clicks` chỉ là ước tính cơ hội chưa giành được, không ghi là số click mất tuyệt đối.
- Không kết luận do đối thủ trước khi loại trừ policy, ngân sách, Ad Rank, targeting, learning, search volume, landing và tracking.

### Kết luận cạnh tranh

- Domain lặp lại cần ưu tiên: CHƯA XÁC MINH.
- Chiến lược đối thủ quan sát được: CHƯA XÁC MINH.
- Nguyên nhân gốc click thấp đã xác nhận: CHƯA XÁC MINH.
- Phần chưa đủ bằng chứng / chỉ là giả thuyết: CHƯA XÁC MINH.
- Ba việc ưu tiên, không tự thực thi live: CHƯA ĐÁNH GIÁ.

## 5. Chấm điểm

| Mã | Trọng số | PASS/WARN/FAIL/UNKNOWN/NOT_APPLICABLE | Số đo thực / ngưỡng | Điểm nhận | Bằng chứng / lý do |
|---|---:|---|---|---|---|
| A1 | 5 | UNKNOWN | | — | |
| A2 | 5 | UNKNOWN | | — | |
| B1 | 5 | UNKNOWN | | — | |
| C1 | 5 | UNKNOWN | | — | |
| C2 | 5 | UNKNOWN | | — | |
| D1 | 5 | UNKNOWN | | — | |
| E1 | 5 | UNKNOWN | | — | |
| E2 | 5 | UNKNOWN | | — | |
| F1 | 5 | UNKNOWN | | — | |
| F2 | 5 | UNKNOWN | | — | |
| F3 | 5 | UNKNOWN | | — | |
| G1 | 5 | UNKNOWN | | — | |
| G2 | 5 | UNKNOWN | | — | |
| H1 | 10 | UNKNOWN | | — | |
| H2 | 5 | UNKNOWN | | — | |
| H3 | 5 | UNKNOWN | | — | |
| I1 | 5 | UNKNOWN | | — | |
| I2 | 5 | UNKNOWN | | — | |
| J1 | 5 | UNKNOWN | | — | |

Ghi W/K/E, công thức và độ phủ theo tiêu chuẩn. NOT_APPLICABLE cần lý do/phạm vi và người xác nhận; UNKNOWN không được đổi thành FAIL hay PASS. Bằng chứng hết hạn phải đánh giá lại.

## 6. Phản hồi và kiểm tra lại

| Ưu tiên / tiêu chí | Thực tế, bằng chứng, tác động | Nguyên nhân đã xác nhận / giả thuyết | Hành động cụ thể | Owner | Hạn | Điều kiện nghiệm thu | Trạng thái / bằng chứng kiểm tra lại |
|---|---|---|---|---|---|---|---|
| CHƯA ĐÁNH GIÁ | | | | CHƯA PHÂN CÔNG | CHƯA CHỐT | | OPEN |

- Ngày kiểm tra lại: CHƯA CHỐT.
- Thay đổi điểm/độ phủ so với kỳ trước và lý do: CHƯA ĐÁNH GIÁ.
- Đề xuất Ads cần quay về Phase 3/5, plan/approval ERP: CHƯA CÓ.
- Dữ liệu thiếu và người cung cấp: CHƯA XÁC MINH.

Không đánh dấu hoàn tất chỉ vì đã có kế hoạch sửa; cần bằng chứng kiểm tra lại. Báo cáo này không cấp quyền bật/tắt Ads hoặc đổi ngân sách.
