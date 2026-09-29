# Kiểm tra riêng Phù hiệu xe nhanh — 18/09/2026

## Nguồn và phạm vi

Account Google Ads **139-673-0688**, tên connector trả “Phù hiệu xe nhanh”. Truy vấn mới qua Windsor.ai MCP, connector google_ads, khoảng **17:27–17:29 UTC+07 ngày 18/09/2026**. Đây là dữ liệu Google Ads do Windsor trả, không đọc trực tiếp UI Google Ads, không lấy số chi/click/conversion từ ERP. Không có upstream watermark/cache age nên không khẳng định cập nhật tức thời đến phút truy vấn.

Tái sử dụng hồ sơ nghiepvuvantai-com, bộ truy vấn và [báo cáo chung](../../dichvuvantai-site/reviews/2026-09-18-ads-market.md). Đây là phần bổ sung tập trung, không chấm lại toàn bộ 19 tiêu chí và không thay audit ERP buổi sáng.

[Bằng chứng tổng hợp](../artifacts/2026-09-18-phu-hieu-xe-nhanh-evidence.json) nằm trong artifacts đã ignore. Kỳ ngày 11–18/09, có ngày 18/09 chưa hoàn tất; metrics VND, Asia/Saigon. Keyword/market trong báo cáo trước lấy riêng từ Keyword Planner qua Windsor và website công khai.

## Hôm nay và kỳ đối chiếu

| Campaign | Ngân sách trung bình/ngày hiện tại | Chi hôm nay | Click | Conversion Google | Trạng thái chính hiện tại |
|---|---:|---:|---:|---:|---|
| vui trần 1 | 80.000đ | 99.545đ | 11 | 6 | LIMITED: policy |
| Phù hiệu mới 15/09 | 80.000đ | 88.413đ | 12 | 0 | LIMITED: học giá thầu + policy |
| Biển vàng | 60.000đ | Không có dòng | — | — | LIMITED: học giá thầu + ad bị từ chối |
| RFID | 60.000đ | 0đ | 0 | 0 | LEARNING; 2 impression |
| **Tổng metrics có dữ liệu** | **280.000đ, 4 budget riêng** | **187.958đ** | **23** | **6** | |

192 impressions; CPC 8.172đ, CTR 11,98%. Ngân sách đã đọc từ budget_amount và period=DAILY, không suy từ tên campaign. Budget IDs riêng: 15646928105, 15879361137, 15884402308, 15884402599. Đây là ngân sách trung bình/ngày, không phải bằng chứng trần cứng ERP; chưa đối chiếu lịch sử thay đổi ngân sách hoặc monthly charging limit.

Bộ hourly của lần truy vấn trước, 00:00–16:59 ngày 17/09 riêng account này: 185.087đ / 27 click / 4 conversion. Không dùng số tổng ba tài khoản để so riêng account 139.

| Campaign | Chi 11–18/09 | Click | Conversion Google | Chi/conversion Google |
|---|---:|---:|---:|---:|
| vui trần 1 | 373.168đ | 69 | 19 | 19.640đ |
| Phù hiệu mới | 342.257đ | 26 | 0 | N/A |
| Biển vàng | 94.104đ | 14 | 0 | N/A |
| RFID | 4.749đ | 1 | 0 | N/A |
| **Tổng phần có dữ liệu** | **814.278đ** | **110** | **19** | **42.857đ** |

Phần không có dòng được giữ unknown, không suy thành 0. Tổng kỳ chứa dữ liệu hôm nay tạm tính, không phải cohort đã trưởng thành.

## Phát hiện chính

1. **vui trần 1 đang tạo toàn bộ conversion quan sát của account trong kỳ.** Hôm nay 99.545đ/6 conversion = 16.591đ/conversion. Có một RSA APPROVED và một APPROVED_LIMITED trong adgroup ENABLED; final URL https://nghiepvuvantai.com/. Campaign-level “HAS_ADS_DISAPPROVED” có thể tổng hợp cả adgroup paused; không đồng nghĩa toàn campaign không chạy được.

2. **Nhóm Phù hiệu mới gần bằng chi vui trần 1 nhưng chưa có conversion:** 342.257đ/26 click, CPC 13.164đ trong kỳ. Riêng hôm nay CPC còn 7.368đ, nên không lấy CPC kỳ để mô tả mọi click hiện tại. Mẫu ENABLED hiện APPROVED_LIMITED, còn một mẫu APPROVED đang PAUSED. Landing https://nghiepvuvantai.com/landing/dich-vu-lam-phu-hieu-xe. Cần đối chiếu intent/search terms, query/tag, CTA và lead thật; 26 click chưa đủ tự kết luận landing lỗi hoặc nhóm lỗ.

3. **Cả bốn campaign dùng TARGET_SPEND = Tối đa hóa lượt nhấp.** Đây là mục tiêu lấy click trong ngân sách, không phải chiến lược tối đa hóa conversion hoặc lợi nhuận. Đối chiếu [tài liệu Google](https://developers.google.com/google-ads/api/docs/campaigns/bidding/strategy-types). Field campaign_target_spend_cpc_bid_ceiling_micros trả null: chưa xác minh trần CPC, không kết luận chắc chắn không có trần từ null này. Không tự đổi chiến lược khi chưa có lead/đơn tin cậy.

4. **Hai conversion actions ENABLED là “số điện thoại” và “zalo”:** WEBPAGE, ONE_PER_CLICK, primary_for_goal=true, click-through window 90 ngày. Các action cũ loại REMOVED/HIDDEN không tính là đang hoạt động. Cấu hình ONE_PER_CLICK áp dụng từng action; một người có thể phát sinh cả hai nên không đồng nhất số conversion với số khách. Primary=true cũng không đổi thực tế hiện campaign dùng Tối đa hóa lượt nhấp. Kết quả 4 “số điện thoại” + 2 “zalo” hôm nay lấy từ truy vấn conversion breakdown lúc khoảng 17:15; tổng 6 khớp query mới. Chưa xác minh người dùng đã gọi thành công/gửi tin.

5. **Biển vàng:** chỉ một mẫu ENABLED, DISAPPROVED với policy giấy tờ/dịch vụ chính thức theo query trước; 2 mẫu APPROVED đang PAUSED và một mẫu DISAPPROVED cũng PAUSED. Không có mẫu vừa bật vừa được duyệt. **RFID:** mẫu bật APPROVED, campaign đang học; 3 impressions/1 click trong kỳ nên chưa đủ dữ liệu đánh giá.

Cảnh báo CIRCUMVENTING_SYSTEMS/COMPROMISED_SITE của 3 mẫu đang bật đã nêu ở báo cáo chung thuộc **account 895 phuhieuxebachgia**, không phải 4 campaign đang bật account 139. Inventory lịch sử account 139 có mẫu trong campaign PAUSED mang các nhãn cũ; không trộn chúng vào lỗi hiện tại của campaign đang phân phối.

## Từ khóa, mạng và giới hạn kỹ thuật

- Quality Score snapshot: “Giấy Phép Kinh Doanh Vận Tải” trong vui trần 1 = 10; “giay phep kinh doanh van tai” = 8; “phù hiệu xe tải” = 7. Cùng keyword “phù hiệu xe tải” trong campaign mới = 5; “làm phù hiệu xe tải” = 7.
- Không đủ ID criterion/match type trong truy vấn quality rút gọn để ghép một-một chắc chắn với metrics; các điểm chỉ là chẩn đoán. Giá trị 0 connector trả coi là chưa có điểm hữu dụng, không gọi 0/10.
- Query đầy đủ keyword + match type + các thành phần Quality Score + metrics bị connector từ chối; đã tách query quality riêng. Chưa đọc search-term report và danh sách phủ định hiện hành.
- Search partners: vui trần 1 và Phù hiệu mới false; biển vàng và RFID true. Content network false ở cả bốn. Đây là cấu hình khả năng chạy, chưa phân rã chi theo network.
- Positive geo targeting = PRESENCE cả bốn; chưa lấy danh sách địa bàn thực tế. Không suy ra chạy toàn quốc từ trường này.
- Chưa kiểm tra riêng mobile/desktop, speed, tracking thực nghiệm của các landing ở lần tập trung này. Không tạo sự kiện/click CTA thử trên production.
- Không đọc lại ERP, không xác nhận CPL khách thật/CPA đơn/lợi nhuận hoặc chi ERP hôm nay. Tham chiếu audit sáng có giới hạn thời điểm như báo cáo chung.

## Ba việc đề xuất

| Ưu tiên | Hành động đề xuất | Owner / hạn đề xuất | Kiểm tra lại |
|---|---|---|---|
| P1 | Rà Phù hiệu mới: search terms/negative/match type, landing và conversion, rồi đối chiếu lead ERP với vui trần 1 | Ads + tracking/CRM; trong 1 ngày làm việc, chưa phân công tên | Tách click CTA/lead/đơn; xác minh 0 conversion là số thực hay lỗi đo; chốt ngân sách thử và ngưỡng mẫu |
| P1 | Xử lý policy biển vàng và hạn chế của phù hiệu qua quy trình ERP | Ads + người phụ trách nội dung; trong 1 ngày làm việc | RSA đủ điều kiện theo readback và xác nhận có phân phối sau sửa |
| P2 | Rà chiến lược lấy click, trần CPC, keyword Quality Score và test nội dung sau khi đo lường tin cậy | Ads + chủ dự án; sau bước P1 | Mục tiêu lead/đơn được duyệt, thay đổi có ERP validate/approval, đo lại cùng cửa sổ |

Không thay ngân sách, trạng thái, chiến lược hay landing. Không chuyển sang tối ưu conversion chỉ dựa số click điện thoại/Zalo. Đề xuất đọc lại số ngày 18/09 sau khi đủ độ trễ; không tạo automation.

## Bổ sung 18:36 — Chất lượng từng mẫu quảng cáo

Nguồn mới: Windsor → Google Ads, account 139-673-0688; inventory với include_inactive rồi lọc campaign/adgroup/ad đều ENABLED. Metrics cấp ad cho 11–18/09, không cộng lặp với cấp campaign. [Bằng chứng](../artifacts/2026-09-18-creative-quality-evidence.json).

**Nhận định biên tập:** nội dung đúng chủ đề và có CTA rõ nhưng mức thuyết phục chưa đồng đều; nhiều tiêu đề lặp ý, ít bằng chứng khác biệt. Chưa đủ căn cứ đánh giá hiệu quả khách thật. Ad Strength, policy và conversion là ba khía cạnh riêng.

| Mẫu đang bật, đuôi ad ID | Google Ad Strength | Policy | Chi kỳ / click / conversion Google | CTR |
|---|---|---|---|---:|
| vui trần 1 — 062554 | POOR | APPROVED | 146.871đ / 27 / 6 | 9,38% |
| vui trần 1 — 278902 | AVERAGE | APPROVED_LIMITED | 226.297đ / 42 / 13 | 14,00% |
| Phù hiệu mới — 900612 | EXCELLENT | APPROVED_LIMITED | 342.257đ / 26 / 0 | 16,99% |
| RFID — 645512 | GOOD | APPROVED | 4.749đ / 1 / 0 | 33,33% (chỉ 3 impression) |
| Biển vàng — 137323 | GOOD | DISAPPROVED | 94.104đ / 14 / 0 | 19,44% (72 impression trước snapshot) |

Mẫu biển vàng paused khác có 10 impression trong kỳ; vì thế 72 impression của mẫu đang bật không bằng 82 impression toàn campaign. Có phân phối trước đây không có nghĩa hiện đủ điều kiện.

### Đánh giá nội dung và việc cần cải thiện

- **vui trần 1 — 062554:** 12 headline, 4 description. Có nhiều cách nói gần nhau (“Hỗ Trợ Làm Phù Hiệu Xe”, “Hỗ Trợ Phù Hiệu Xe”), pha cả phù hiệu và giấy phép vận tải; headline đầu được ghim. Google gợi ý tăng headline khác biệt, độ liên quan từ khóa và cân nhắc pin. Có 6 conversions/146.871đ = 24.479đ/conversion: không tự tắt vì nhãn POOR. Chỉ bỏ pin nếu không làm mất nội dung bắt buộc.
- **vui trần 1 — 278902:** 15 headline, 4 description; có lợi ích rõ hơn như kiểm tra hồ sơ qua Zalo, báo phí trước và hướng dẫn giấy tờ còn thiếu. 13 conversions/226.297đ = 17.407đ/conversion, kết quả quan sát tốt nhất trong các mẫu này. Chưa phải winner được chứng minh qua thử nghiệm ngẫu nhiên. Asset “Xe Mới, Xe Đổi Biển Số” có topic GOVERNMENT_DOCUMENTS_AND_OFFICIAL_SERVICES; không suy ra chỉ xóa headline này là được duyệt.
- **Phù hiệu mới — 900612:** 15 headline, 4 description, phủ nhiều ý định phù hiệu xe tải và quy trình; có nêu đơn vị tư vấn không phải cơ quan cấp phép. Ad Strength EXCELLENT và CTR 16,99% nhưng 26 click/0 conversion. Lợi ích còn khá chung, nhiều biến thể từ khóa hơn là bằng chứng để chọn nhà cung cấp. Cần kiểm tra toàn luồng keyword → offer/landing → CTA/tag → lead; chưa quy nguyên nhân cho copy hay policy riêng lẻ.
- **RFID — 645512:** 15 headline, 4 description, tập trung đúng sản phẩm và lựa chọn tương thích thiết bị. Nhiều câu “Tìm hiểu”, “Tham khảo”, “Liên hệ” chưa nêu kết quả/điều kiện mua cụ thể. Có thể tăng sức thuyết phục bằng hãng tương thích, hỗ trợ cài, thời gian giao, giá và bảo hành sau khi xác minh offer. Google gợi ý thêm 6 sitelink; chưa kiểm kê sitelink inventory, không mặc định đang không có liên kết. Chỉ 1 click nên chưa xếp hiệu quả.
- **Biển vàng — 137323:** 15 headline, 4 description; phân biệt đơn vị hỗ trợ/cơ quan nhà nước và phí dịch vụ/lệ phí rõ hơn. Tuy vậy DISAPPROVED là chặn khả năng chạy dù Ad Strength GOOD. Cần đối chiếu tính đủ điều kiện của dịch vụ và policy, không đổi cách viết nhằm né kiểm duyệt.

Đánh giá trên là nhận xét đối với snapshot nội dung hiện tại. Chưa kiểm tra lịch sử sửa ad nên không khẳng định toàn bộ metrics trong kỳ do đúng phiên bản câu chữ này tạo ra. Performance label từng asset đều PENDING; chưa có căn cứ chỉ ra headline nào tạo nhiều conversion nhất. “Báo phí rõ”, “kiểm tra miễn phí”, thời gian, bảo hành và mọi cam kết phải khớp thực tế; chưa tự thêm chào giá hoặc bảo đảm kết quả.

Google mô tả [Ad Strength](https://support.google.com/google-ads/answer/9921843) là chỉ dẫn cải thiện quảng cáo, không trực tiếp quyết định đủ điều kiện phân phối. [Quality Score](https://support.google.com/google-ads/answer/6167118) là chẩn đoán cấp keyword, không phải điểm hiệu quả/lợi nhuận của từng mẫu.

**Ưu tiên:** (1) xử lý policy và đối chiếu chuyển đổi Phù hiệu mới; (2) dùng mẫu 278902 làm mốc so sánh quan sát, thử tăng khác biệt cho mẫu POOR; (3) làm rõ offer RFID sau xác minh. Owner đề xuất Ads + sản phẩm/CRM; kế hoạch P1 trong 1 ngày làm việc, thử nội dung P2 tuần kế tiếp. Chưa phân công tên hoặc chốt ngân sách thử. Tất cả mới là đánh giá/đề xuất, chưa sửa quảng cáo.

