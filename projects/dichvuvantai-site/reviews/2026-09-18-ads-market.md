# Kiểm tra Ads hôm nay và so sánh thị trường — 18/09/2026

**Kết luận:** số Google Ads đang trả về cho hôm nay là **250.524 VND / 31 click / 239 impression / 6 conversion**, dữ liệu tạm tính. Ưu tiên kiểm tra policy của tài khoản phuhieuxebachgia trước khi mở rộng chi. Chưa đủ dữ liệu kết luận lợi nhuận hoặc sức khỏe toàn giàn.

## Phạm vi và bằng chứng

- Yêu cầu: kiểm tra Ads hôm nay, so sánh thị trường; Phase 6 đọc số liệu và nghiên cứu, không thực thi thay đổi.
- Phạm vi suy từ hồ sơ hiện có: Google Ads dịch vụ vận tải, 3 account 606-385-9174, 139-673-0688, 895-571-1884; không bao gồm Meta Ads.
- Lấy số qua Windsor khoảng 17:10–17:16 ngày 18/09/2026 UTC+07. Hai account có metrics dùng VND, Asia/Saigon. Connector không trả watermark độ mới upstream; thời điểm truy vấn không đồng nghĩa dữ liệu cập nhật đến đúng phút đó.
- Hôm nay: 18/09 chưa hoàn tất. So cùng giờ: hour 0–16 (00:00–16:59), đối chiếu 17/09. Tổng hourly hôm nay khớp tổng daily đang trả về.
- Baseline: 11–17/09 và 04–10/09, ngày lịch hoàn tất nhưng conversions vẫn có thể được bổ sung. Kỳ mở rộng từ khóa: 11–18/09, có ngày chưa hoàn tất.
- Tái sử dụng project/mapping, mẫu ads-health-review, tiêu chuẩn tieuchuan.md, báo cáo ERP buổi sáng và connector Windsor chỉ đọc. Không đổi code, landing, cấu hình, ngân sách, trạng thái Ads hoặc dữ liệu ERP.
- Bằng chứng tổng hợp không chứa dữ liệu khách: [JSON cục bộ](../artifacts/2026-09-18-ads-market-evidence.json). Thư mục artifacts được Git ignore.
- Đây là báo cáo bổ sung hằng ngày và thị trường; giữ nguyên [audit buổi sáng](2026-09-18-ads-health.md), không coi dữ liệu ERP buổi sáng là snapshot mới của buổi chiều.

## 1. Kết quả hôm nay

| Tài khoản / campaign | Chi VND | Impression | Click | Conversion Google | CPC VND |
|---|---:|---:|---:|---:|---:|
| 606 / Manh 270626 | 62.566 | 47 | 8 | 0 | 7.821 |
| 139 / vui trần 1 | 99.545 | 134 | 11 | 6 | 9.050 |
| 139 / Search - Phù hiệu xe - 80k - 15.09.2026 | 88.413 | 56 | 12 | 0 | 7.368 |
| 139 / Search - Thẻ nhận dạng lái xe RFID - 60k | 0 | 2 | 0 | 0 | N/A |
| 139 / Search - Đổi biển vàng - 60k | Không có dòng | — | — | — | — |
| 895 / phuhieuxebachgia | Không có dòng metrics | — | — | — | — |
| **Tổng phần có dữ liệu** | **250.524** | **239** | **31** | **6** | **8.081** |

CTR tổng 12,97%; chi/conversion Google 41.754 VND. Không có dòng không được tự đổi thành số 0. Các số 60k/80k là thành phần tên campaign, không chứng minh ngân sách hiện hành.

6 conversions đều thuộc vui trần 1: action “số điện thoại” = 4, “zalo” = 2. Đây là conversion actions của Google, chưa chứng minh 6 người khác nhau, 4 cuộc gọi thành công, 2 tin Zalo, lead xác minh hay đơn. Chưa đối chiếu lại primary/secondary, cách đếm và cấu hình action trong lần này.

### So cùng khung giờ 00:00–16:59

| Chỉ số | 17/09 | 18/09 | Thay đổi |
|---|---:|---:|---:|
| Chi | 256.245 | 250.524 | −2,23% |
| Impression | 314 | 239 | −23,89% |
| Click | 39 | 31 | −20,51% |
| CPC | 6.570 | 8.081 | +23,00% |
| Conversion Google | 5 | 6 | +20,00% |
| Chi/conversion Google | 51.249 | 41.754 | −18,53% |

Chi gần như ngang hôm qua nhưng mua được ít click hơn. Số conversion nhỏ và chưa chốt; chưa đủ kết luận tối ưu tốt hơn hoặc giá thị trường tăng 23%. Đây là thay đổi CPC của chính tài khoản, chịu ảnh hưởng cơ cấu campaign/keyword và độ trễ.

### Baseline hai tuần

| Chỉ số | 04–10/09 | 11–17/09 |
|---|---:|---:|
| Chi VND | 1.010.962,84 | 1.402.809,97 |
| Impression / click | 609 / 124 | 1.202 / 190 |
| CTR | 20,36% | 15,81% |
| CPC VND | 8.153 | 7.383 |
| Conversion Google | 13 | 24 |
| Chi/conversion Google VND | 77.766 | 58.450 |

vui trần 1 có 13 conversion trên 273.623 VND trong 11–17/09, chi/conversion 21.048 VND; Manh 270626 có 11 trên 776.490 VND, tương ứng 70.590 VND. Chưa xác minh tính tương đương của conversion giữa account nên không lấy chênh lệch này làm lệnh chuyển ngân sách.

Nhóm Phù hiệu mới đã chi 342.257 VND, 26 click và 0 conversion Google trong 16–18/09 tính đến snapshot. Cần kiểm tra intent, landing, conversion và policy; chưa có ngưỡng mẫu/cohort được duyệt để kết luận nhóm lỗ.

## 2. Khả năng phân phối và policy hiện tại

Query inventory bật include_inactive, sau đó lọc campaign và adgroup ENABLED. Kết quả: **8 campaign / 8 adgroup**, 16 mẫu (gồm paused); **11 mẫu ENABLED: 5 APPROVED, 2 APPROVED_LIMITED, 4 DISAPPROVED**. Hôm nay có 4 campaign có impression, 3 có click/chi. Không cộng inventory vào metrics.

| Phát hiện | Bằng chứng mới | Ý nghĩa |
|---|---|---|
| phuhieuxebachgia / giấy phép vận tải | campaign 24256575269, ad 824942410265 ENABLED nhưng DISAPPROVED | Google trả CIRCUMVENTING_SYSTEMS và COMPROMISED_SITE |
| phuhieuxebachgia / RFID | campaign 24251050068, ad 824858029102 ENABLED nhưng DISAPPROVED | Cùng hai nhãn trên |
| phuhieuxebachgia / biển vàng | campaign 24256572410, ad 824942399429 ENABLED nhưng DISAPPROVED | Cùng hai nhãn trên, thêm GOVERNMENT_DOCUMENTS_AND_OFFICIAL_SERVICES |
| 139 / biển vàng | ad 824935137323 ENABLED nhưng DISAPPROVED | GOVERNMENT_DOCUMENTS_AND_OFFICIAL_SERVICES; không có mẫu vừa ENABLED vừa được duyệt trong nhóm |
| 139 / phù hiệu mới và một mẫu vui trần 1 | APPROVED_LIMITED | Cùng policy giấy tờ/dịch vụ chính thức |

**Ưu tiên P0 kiểm tra cảnh báo policy nghiêm trọng của account 895.** Đây là trạng thái từ Google; chưa có kiểm chứng kỹ thuật site bị xâm nhập và chưa có bằng chứng đình chỉ account. Xử lý nguyên nhân và hồ sơ review theo [chính sách Google](https://support.google.com/adspolicy/answer/6020954?hl=en), mọi thay đổi Ads qua ERP.

Khác báo cáo sáng: query include_inactive đọc được inventory account 895 và thêm mẫu paused. Nhóm biển vàng 139 thực tế có 2 mẫu APPROVED đang PAUSED (824750746071, 824850896131), ngoài 2 mẫu DISAPPROVED. Vì vậy mô tả chính xác là “không có RSA đang bật và được duyệt”, không phải “không tồn tại RSA được duyệt”. Không tự bật mẫu paused.

GET công khai khoảng 17:14 trả HTTP 200 cho nghiepvuvantai.com/, trang RFID của domain này, www.phuhieuxe247.com/ và trang biển vàng dichvuvantai.site. Đây chỉ là kiểm tra HTTP, không xác minh mobile/JS/CTA/tag, redirect có điều kiện, an toàn site hay giải quyết nhãn COMPROMISED_SITE.

## 3. So sánh thị trường tìm kiếm Việt Nam

Nguồn: Google Keyword Planner qua Windsor, account 606 (VND); Việt Nam geo 2704, tiếng Việt 1040, GOOGLE_SEARCH. IDs đối chiếu tài liệu Google. Search volume là trung bình lịch sử 12 tháng theo mô tả connector; connector không trả cụ thể những tháng cấu thành. Không phải nhu cầu riêng ngày 18/09.

| Từ khóa | Lượt tìm/tháng ước tính | Cạnh tranh 0–100 | Dải giá thầu đầu trang lịch sử, VND |
|---|---:|---:|---:|
| phù hiệu xe tải | 720 | 25 | 3.449–6.563 |
| phù hiệu xe hợp đồng | 390 | 36 | 3.451–5.169 |
| làm phù hiệu xe tải | 50 | 55 | 3.564–18.488 |
| giấy phép kinh doanh vận tải | 590 | 21 | 4.573–33.869 |
| dịch vụ làm giấy phép kinh doanh vận tải | 30 | 68 | 17.299–71.640 |
| thẻ lái xe rfid | 50 | 51 | 428–2.491 |
| đổi biển vàng | 40 | 4 | Không có số |
| dịch vụ đổi biển vàng | 10 | 33 | 3.038–11.441 |

Chuyển bid micros sang VND bằng chia 1.000.000. Không cộng volume các biến thể vì có thể trùng/cùng nhu cầu. Dải bid không phải CPC bình quân ngành, không phải giá phải trả và không bảo đảm vị trí; [Google giải thích chỉ số lịch sử và dự báo](https://support.google.com/google-ads/answer/3022575?hl=en-uk).

Đối chiếu thực tế 11–18/09:
- Keyword “phù hiệu xe tải” account 606: 704.246,97 VND / 95 click = **7.413 VND/click**, cao hơn cận trên tham khảo 6.563 VND khoảng 13%. Tín hiệu để kiểm tra search terms, match type, vị trí, thiết bị và vùng; không chứng minh trả đắt hơn mọi đối thủ.
- “làm phù hiệu xe tải” nhóm mới account 139: 264.750 / 20 = **13.238 VND/click**, nằm trong dải lịch sử rộng 3.564–18.488; 0 conversions quan sát. Vấn đề cần kiểm tra là chuyển đổi và ý định truy vấn, chưa đủ cơ sở nói bị mua click quá đắt.
- Keyword “Giấy Phép Kinh Doanh Vận Tải” trong vui trần 1: 73.122 / 16 = **4.570 VND/click**, 6 conversions; đây là keyword cần đối chiếu lead thật trước khi cân nhắc ưu tiên.
- RFID có nhu cầu từ khóa riêng nhỏ hơn phù hiệu; mới 1 click trong 11–18/09 nên chưa đánh giá hiệu quả hoặc mở rộng từ CPC đơn lẻ.

### Áp lực đấu giá trong chính phạm vi đủ điều kiện của tài khoản

Ưu tiên số ngày 17/09 để tránh tổng hợp sai tỷ lệ:

| Campaign | Search impression share | Mất do budget | Mất do rank |
|---|---:|---:|---:|
| Manh 270626 | 32,96% | 6,74% | 60,30% |
| vui trần 1 | 42,38% | 57,62% | 0% trả về |
| Phù hiệu mới | 32,90% | 67,10% | 0% trả về |

Manh cần kiểm tra Ad Rank/chất lượng/giá thầu theo từ khóa; thêm ngân sách đơn thuần chưa xử lý phần mất do rank. Hai campaign còn lại có tín hiệu giới hạn ngân sách ngày đó nhưng cần xác minh hiệu quả ERP và trần chi trước khi đề xuất tăng. Share không phải thị phần toàn ngành và không cộng tỷ lệ giữa campaign.

Query tỷ lệ không chia ngày cho 11–17/09 trả một số bộ tỷ lệ không khép 100% (ví dụ vui trần 1 = 33,07% + 32,96% + 45,01%). Không dùng các số tổng hợp đó để phân rã nguyên nhân; đã đối chiếu lại theo ngày như bảng trên. Auction Insights theo domain bị connector/API từ chối do tổ hợp metric không hỗ trợ. **Chưa có căn cứ nêu tên đối thủ cùng đấu giá hoặc thị phần từng đối thủ.**

## 4. So sánh chào giá và thông điệp công khai

Các đơn vị dưới đây là website/listing so sánh, chưa chứng minh cạnh tranh trực tiếp trong cùng phiên đấu giá.

| Nguồn | Quan sát công khai | Hàm ý |
|---|---|---|
| [Landing đang chạy phuhieuxe247.com](https://www.phuhieuxe247.com/) | HTTP live: phí dịch vụ phù hiệu 200.000đ/năm, thời gian 2–3 ngày, gửi hồ sơ Zalo | Giá headline thấp; cần xác nhận phạm vi phí, điều kiện và mức sinh lời thực |
| [Vạn Trường Phát](https://vantruongphat.vn/) | Gói 1 năm 800.000đ, 3 năm 1,5 triệu, 5 năm 2 triệu, 7 năm 2,4 triệu; chào hồ sơ online, 2 ngày | Cạnh tranh bằng gói dài hạn, quy trình và tốc độ; chênh giá headline 200k vs 800k chưa chứng minh hai gói tương đương |
| [Hành Trang Bác Tài / Shopee](https://shopee.vn/Th%E1%BA%BB-L%C3%A1i-Xe-%C4%90a-N%C4%83ng-RFID-Qu%E1%BA%B9t-%C4%90%C6%B0%E1%BB%A3c-C%C3%A1c-H%E1%BB%99p-%C4%90en.-Shop-H%E1%BB%97-Tr%E1%BB%A3-Nh%E1%BA%ADp-Th%C3%B4ng-Tin-L%C3%A1i-Xe.-B%E1%BA%A3o-H%C3%A0nh-1-%C4%90%E1%BB%94I-1.-i.60772502.55550178182) | Kết quả web hiển thị 219.000đ, hỗ trợ nhập thông tin và bảo hành đổi thẻ | Thông điệp đáng thử nếu đáp ứng thật: kiểm tra tương thích, hỗ trợ cài, bảo hành; giá listing chưa gồm xác minh phí giao hàng/checkout |
| [Tô Châu Đông Á](https://tochaudonga.com/shop/lam-phu-hieu-xe-nhanh-tai-hoang-mai-ha-noi.html) | Chào nhận hồ sơ Zalo, làm trọn gói, giao kết quả tại nhà; chưa lấy được báo giá tương đương | “Nhanh/rẻ/toàn quốc” phổ biến, cần bằng chứng dịch vụ và phạm vi phí rõ hơn |

Trang RFID nghiepvuvantai.com được GET 200; chưa thấy giá trong các đoạn giá trích xuất. Bản source local cũng thiên về kiểm tra tương thích. Chưa có giá/offer được chủ dự án xác nhận để kết luận đắt/rẻ hơn listing 219k.

Không dùng chào giá hoặc lời hứa thời hạn của nhà bán làm xác nhận pháp lý. Loại nguồn giamsathanhtrinh247.com khỏi so sánh giá: search cache còn hiện 790k nhưng mở hiện tại là trang domain có thể đang rao bán.

## 5. ERP, điểm và giới hạn

Lần này không đăng nhập/đọc lại ERP. Audit lúc 09:48 ngày 18/09 đã ghi: 5 nhóm có chi chưa gắn sản phẩm, chi ERP 28 ngày thiếu 20 dòng đầu kỳ tổng 2.765.622,95 VND, CRM chưa xác minh liên kết đơn. Đây là bằng chứng buổi sáng cần đọc lại trước quyết định, không suy tiếp thành tình trạng ERP 17:16. Chi ERP hôm nay, lệch Ads↔ERP hôm nay, lead xác minh, đơn, doanh thu, CPL thật, CPA đơn, ROAS/ROI: **UNKNOWN**.

Chấm phạm vi bằng chứng mới theo tieuchuan.md, không thay điểm audit sáng:

| Tiêu chí | Trọng số | Trạng thái | Lý do |
|---|---:|---|---|
| C1 | 5 | FAIL | 4/8 nhóm campaign/adgroup ENABLED không có RSA vừa ENABLED vừa được duyệt; chưa chốt đủ danh sách dự kiến chạy |
| A1, A2, B1, C2, D1, E1, E2, F1, F2, F3, G1, G2, H2, H3, I1, I2, J1 | 85 | UNKNOWN | Chưa kiểm tra đủ từng điều kiện trong snapshot bổ sung; HTTP 200 và danh sách kết nối không đủ PASS |
| H1 | 10 | UNKNOWN | Thiếu tài chính, attribution, cohort và mục tiêu đã chốt |

W=100, K=5, E=0: độ phủ 5%; điểm phần kiểm chứng 0/100, điểm bảo đảm 0/100, khoảng còn có thể đạt 0–95. **Không xếp hạng hiệu quả từ điểm này**; 95% trọng số chưa kiểm chứng lại. Cảnh báo nghiêm trọng Google của account 895 cần xử lý P0 theo tiêu chuẩn, nhưng không suy ra đã có sự cố xâm nhập/đình chỉ.

## 6. Ba việc ưu tiên

| Ưu tiên | Việc | Owner đề xuất / hạn đề xuất | Điều kiện kiểm tra lại |
|---|---|---|---|
| P0 | Kiểm tra 3 ad bị từ chối của account 895: policy detail, domain/redirect/tài nguyên, đối chiếu Search Console hoặc chẩn đoán có quyền; chuẩn bị phương án sửa/review qua ERP | Người quản trị Ads + kỹ thuật website; bắt đầu trong 18/09, chưa phân công tên | Xác định nguyên nhân có bằng chứng; readback policy sau xử lý; không chỉ dựa HTTP 200 |
| P1 | Xử lý biển vàng 139 không có mẫu bật được duyệt; rà nhóm phù hiệu mới 342.257đ/26 click/0 conversion; đối chiếu conversion, lead và chi ERP | Ads + CRM/ERP; kế hoạch trong 1 ngày làm việc | Policy/intent/tracking được kiểm tra; mapping và chi khớp; mục tiêu/mẫu đủ căn cứ trước đổi ngân sách |
| P2 | Cải thiện offer dựa cạnh tranh: rõ phí và điều kiện, tương thích/bảo hành RFID, quy trình nhận hồ sơ; chuẩn bị thử nghiệm có giới hạn | Marketing + phụ trách sản phẩm; tuần kế tiếp | Offer được xác nhận, KPI lead/đơn và ngân sách thử được duyệt tại ERP |

Mốc đề xuất đọc lại: 19/09 cho số ngày 18/09 sau độ trễ đã xác minh; đọc lại policy ngay sau xử lý. Không tạo lịch tự động. Chưa thay đổi Ads hay triển khai website.

