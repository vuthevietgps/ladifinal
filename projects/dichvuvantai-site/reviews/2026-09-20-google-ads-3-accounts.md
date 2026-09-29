# Kiểm tra Google Ads 3 tài khoản — 20/09/2026

**Kết luận:** `phuhieuxe24h` vẫn đủ điều kiện phân phối nhưng hiệu quả 7 ngày giảm; `Phù hiệu xe nhanh` có 19 chuyển đổi chính từ campaign cũ trong 7 ngày, trong khi campaign phù hiệu mới đã chi 420.590 VND nhưng chưa có chuyển đổi chính; `phuhieuxebachgia` vẫn không đủ điều kiện vì cả 3 quảng cáo đang bật đều bị từ chối. Không có thay đổi nào được thực hiện trên Google Ads.

## Phạm vi và bằng chứng

- Dữ liệu đọc qua Windsor.ai, connector `google_ads`, lúc 22:21 UTC+07 ngày 20/09/2026.
- Tài khoản: `606-385-9174` (`phuhieuxe24h`), `895-571-1884` (`phuhieuxebachgia`), `139-673-0688` (`Phù hiệu xe nhanh`).
- Kỳ 7 ngày hoàn tất: 13–19/09; kỳ trước: 06–12/09; kỳ 28 ngày hoàn tất: 23/08–19/09. Số ngày 20/09 là tạm tính và có thể còn độ trễ.
- Tái sử dụng hồ sơ dự án, mapping hiện có và báo cáo 18/09. Đây là kiểm tra chỉ đọc; không sửa campaign, quảng cáo, ngân sách, landing hoặc ERP.
- `Conversions` là chuyển đổi chính Google Ads; `All conversions` có thể bao gồm hành động phụ. Chưa đối chiếu CRM/ERP nên không coi các số này là lead đã xác minh hoặc đơn hàng.

## 1. Hiệu suất

| Tài khoản | Chi 7 ngày | Impression / click | CTR | Chuyển đổi chính | CPA Google | Chi 28 ngày | Chuyển đổi 28 ngày | CPA 28 ngày |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| phuhieuxe24h | 660.826 | 485 / 82 | 16,91% | 6 | 110.138 | 2.583.185 | 35 | 73.805 |
| Phù hiệu xe nhanh | 892.611 | 878 / 120 | 13,67% | 19 | 46.980 | 2.489.544 | 37 | 67.285 |
| phuhieuxebachgia | Không có dòng | — | — | — | — | Không có dòng | — | — |
| **Tổng phần có dữ liệu** | **1.553.437** | **1.363 / 202** | **14,82%** | **25** | **62.137** | **5.072.729** | **72** | **70.455** |

Đơn vị tiền là VND. Không có dòng dữ liệu của tài khoản 895 không được diễn giải thành chi phí bằng 0; inventory cho thấy tài khoản này không đủ điều kiện phân phối.

### phuhieuxe24h

- Campaign `Manh 270626` (`23973785460`) đang `ELIGIBLE`. Ba quảng cáo đang bật đều `APPROVED`; Ad Strength gồm 2 `AVERAGE`, 1 `POOR`.
- So với 06–12/09: chi giảm 10,5% (738.379 → 660.826), click giảm 15,5% (97 → 82), chuyển đổi giảm 40% (10 → 6), CPA tăng 49,2% (73.838 → 110.138). CPC tăng từ 7.612 lên 8.059 VND.
- Campaign vẫn chạy, nhưng chất lượng chuyển đổi Google đã xấu đi rõ trong tuần gần nhất. Cần đối chiếu search term, vùng/thiết bị, landing và lead thật trước khi đổi giá thầu hoặc ngân sách.
- Conversion value 28 ngày đang bằng 0 dù có 35 conversions, nên chưa thể tính ROAS hoặc so sánh giá trị với tài khoản 139.

### Phù hiệu xe nhanh

| Campaign | Trạng thái hiện tại | Chi 13–19/09 | Click | Conv chính / All conv | Nhận định |
|---|---|---:|---:|---:|---|
| `vui trần 1` | `LIMITED`; 1 ad APPROVED, 1 ad APPROVED_LIMITED | 373.168 | 69 | 19 / 19 | Nguồn chuyển đổi chính tốt nhất quan sát được; CPA 19.640 VND, nhưng vẫn bị giới hạn policy |
| `Search - Phù hiệu xe - 80k - 15.09.2026` | `LEARNING`; ad bật APPROVED_LIMITED | 420.590 | 36 | 0 / 2 | Đã chi nhiều nhưng chưa có chuyển đổi chính; action đang chỉ xuất hiện trong All conversions |
| `Search - Đổi biển vàng - 60k` | `LIMITED`; ad bật DISAPPROVED | 94.104 | 14 | 0 / 1 | Không còn mẫu vừa bật vừa được duyệt; policy GOVERNMENT_DOCUMENTS_AND_OFFICIAL_SERVICES |
| `Search - Thẻ nhận dạng lái xe RFID - 60k` | `LEARNING`; ad bật APPROVED | 4.749 | 1 | 0 / 0 | Dữ liệu quá ít để kết luận hiệu quả |

- Campaign phù hiệu mới có 2 hành động phụ trong 13–19/09 và thêm 1 hành động `số điện thoại` trong ngày 20/09, nhưng cả 3 đều không nằm trong `Conversions`. Đây là dấu hiệu cấu hình mục tiêu/primary-secondary không nhất quán với campaign cũ và cần kiểm tra trước khi đánh giá hoặc để chiến lược giá thầu học theo chuyển đổi.
- `vui trần 1` tạo toàn bộ 19 chuyển đổi chính trong kỳ. Kết quả này chưa chứng minh 19 khách khác nhau, 19 lead hợp lệ hoặc 19 đơn.
- Mức tăng so với tuần trước không phải so sánh ngang bằng vì các campaign mới chỉ bắt đầu có dữ liệu từ 15–17/09.

### phuhieuxebachgia

Ba campaign đang bật đều `NOT_ELIGIBLE`, mỗi campaign có một quảng cáo đang bật và quảng cáo đó đều `DISAPPROVED`:

| Campaign | Policy hiện tại |
|---|---|
| `Search \| Giấy phép vận tải \| dichvuvantai.site` | CIRCUMVENTING_SYSTEMS, COMPROMISED_SITE |
| `Search \| Thẻ lái xe RFID \| dichvuvantai.site` | CIRCUMVENTING_SYSTEMS, COMPROMISED_SITE |
| `Search \| Đổi biển vàng \| dichvuvantai.site` | CIRCUMVENTING_SYSTEMS, COMPROMISED_SITE, GOVERNMENT_DOCUMENTS_AND_OFFICIAL_SERVICES |

Tình trạng chặn nghiêm trọng đã thấy ngày 18/09 vẫn chưa được giải quyết ở snapshot 20/09. Không có dòng performance trong 7 hoặc 28 ngày.

## 2. Hôm nay 20/09 — tạm tính lúc 22:21

| Tài khoản | Chi | Impression | Click | Conv chính / All conv |
|---|---:|---:|---:|---:|
| phuhieuxe24h | 0 | 8 | 0 | 0 / 0 |
| Phù hiệu xe nhanh | 39.437 | 13 | 5 | 0 / 1 |
| phuhieuxebachgia | Không có dòng | — | — | — |

Một All conversion của Phù hiệu xe nhanh hôm nay là action `số điện thoại` trên campaign phù hiệu mới; nó không được tính là chuyển đổi chính.

## 3. Ưu tiên xử lý

1. **P0 — phuhieuxebachgia:** kiểm tra an toàn domain/redirect/tài nguyên và chi tiết policy, sửa nguyên nhân `COMPROMISED_SITE`/`CIRCUMVENTING_SYSTEMS`, rồi gửi review theo quy trình ERP. Không đổi nội dung nhằm né kiểm duyệt.
2. **P1 — Phù hiệu xe nhanh:** kiểm tra cấu hình campaign goals và primary/secondary của `số điện thoại`/`zalo` cho campaign phù hiệu mới; đối chiếu 420.590 VND với visit, lead và đơn thật trước mọi quyết định ngân sách.
3. **P1 — phuhieuxe24h:** rà search terms, vị trí, thiết bị, landing và chất lượng lead vì CPA tuần tăng 49,2%; chưa tăng ngân sách chỉ dựa trên trạng thái `ELIGIBLE`.

## 4. Giới hạn

- Chưa đọc lại ERP/CRM, doanh thu, biên lợi nhuận hoặc dữ liệu cuộc gọi; CPL thật, CPA đơn, ROAS và lợi nhuận đều `UNKNOWN`.
- Windsor không trả watermark độ mới upstream; thời điểm truy vấn không có nghĩa dữ liệu Google đã chốt đến đúng phút đó.
- Đây là kiểm tra tập trung ba tài khoản, không phải audit đủ 19 tiêu chí/100 điểm theo `tieuchuan.md`.
