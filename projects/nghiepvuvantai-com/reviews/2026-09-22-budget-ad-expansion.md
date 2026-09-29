# Điều chỉnh quảng cáo phù hiệu xe và giấy phép vận tải — 22/09/2026

Trạng thái: EXECUTED_WITH_PENDING_AD_REVIEW — người dùng đã chốt và yêu cầu thực thi. Hai ngân sách đã tăng, mẫu phù hiệu đã bật; mẫu giấy phép vận tải đã tạo PAUSED, chưa đủ điều kiện bật vì approval đang UNKNOWN. Readback lúc 14:44:46 ngày 22/09/2026 (UTC+07).

## Phạm vi và bằng chứng

- Tài khoản: Phù hiệu xe nhanh — `139-673-0688`; VND; Asia/Saigon (UTC+07).
- Kỳ chính: 15–21/09/2026, 7 ngày hoàn tất. Windsor Google Ads.
- Không có bằng chứng số dư thanh toán cạn. Lost impression share do ngân sách là giới hạn phân phối theo ngân sách chiến dịch, không chứng minh hết tiền trong tài khoản.
- Chỉ số này là tỷ lệ cơ hội hiển thị bị mất, không phải tỷ lệ click chắc chắn đã mất.
- Tái sử dụng campaign/adgroup/landing hiện có, không tạo campaign mới.

| Chiến dịch | Click | Chi phí VND | Google conversions | Mất hiển thị do ngân sách | Mất hiển thị do Ad Rank |
|---|---:|---:|---:|---:|---:|
| vui trần 1 — 23942905658 | 94 | 530533 | 21 | 61,09% | 7,27% |
| Search - Phù hiệu xe - 80k - 15.09.2026 — 24254559545 | 56 | 584281 | 0 | 55,79% | 1,07% |

Google conversions chưa đối soát với lead/đơn/lợi nhuận ERP. Không dùng làm bằng chứng có 21 khách hoặc đơn hàng.
Kỳ trước 08–14/09: vui trần 1 trả 0 impressions/click/spend; campaign phù hiệu riêng không trả dòng. Kỳ 28 ngày hoàn tất: vui trần 1 có 234 click, 1.738.348,2409 VND, 35 conversions; phù hiệu riêng 56 click, 584.281 VND, 0 conversions. Không diễn giải kỳ trước không có dữ liệu phân phối như hiệu quả ổn định.

## Chất lượng và chính sách

- Ad `812918062554`: ENABLED / APPROVED, Ad Strength POOR.
- Ads `824878278902` và `824864900612`: ENABLED / APPROVED_LIMITED; policy topic `GOVERNMENT_DOCUMENTS_AND_OFFICIAL_SERVICES`; Ad Strength lần lượt AVERAGE và GOOD.
- Ad Strength không đồng nhất với Quality Score, Ad Rank hoặc trạng thái chính sách.
- Snapshot từ khóa ngày 21/09: giấy phép kinh doanh vận tải có điểm 6–8 ở các từ khóa được trả; phù hiệu có 3–8. Một số từ khóa phù hiệu có landing experience BELOW_AVERAGE.
- Query chất lượng tổng hợp 7 ngày trả giá trị >10 do cộng dồn; đã loại bỏ cách đọc này và dùng snapshot 1 ngày theo criterion ID. Giá trị 0 với thành phần null không được coi là điểm chất lượng 0/10.
- Hai landing HTTP 200, nội dung đúng dịch vụ khi kiểm tra bằng HTTP. Chưa kiểm tra tốc độ/mobile trong lần này.
- Hạn chế chính sách cần xác minh/chứng nhận hoặc đề nghị xem xét/loại trừ đúng trường hợp theo https://support.google.com/adspolicy/answer/13156083?hl=vi. Không dùng thay lời quảng cáo để che giấu dịch vụ hoặc né chính sách. Không hứa mẫu mới được duyệt hoặc gỡ hạn chế.
- Auction Insights/đối thủ và hiệu quả ERP chưa kiểm tra trong phạm vi điều chỉnh này.

## Bảng thay đổi đã được người dùng xác nhận

| Action | Đối tượng | Trước → sau |
|---|---|---|
| set_campaign_budget | campaign 23942905658; budget 15646928105 | 80.000 → 120.000 VND/ngày |
| set_campaign_budget | campaign 24254559545; budget 15879361137 | 80.000 → 100.000 VND/ngày |
| create_responsive_search_ad | adgroup 198265694580, campaign 23942905658 | Thêm mẫu giấy phép vận tải bên dưới; tạo PAUSED |
| enable_ad | mẫu mới, sau readback xác nhận APPROVED và không có policy findings | PAUSED → ENABLED; nếu còn pending/limited/disapproved thì giữ PAUSED và báo |
| enable_ad | ad 824739646212, adgroup 205916274371, campaign 24254559545 | PAUSED / APPROVED → ENABLED |

Tổng ngân sách trung bình hai campaign: 160.000 → 220.000 VND/ngày (+60.000; +37,5%). Đây là bước tăng đầu tiên, không bảo đảm hết mất hiển thị và không phải trần chi tiêu cứng mỗi ngày. Mức ngân sách ổn định tương đương 6.688.000 VND / 30,4 ngày cho hai campaign; không phải dự báo hóa đơn tháng hiện tại.

Ưu tiên thêm 40.000 vào campaign hỗn hợp đang có conversions; thêm 20.000 vào phù hiệu riêng vì chưa ghi nhận conversion. Ngân sách vui trần 1 dùng chung cho cả hai dịch vụ, không thể cam kết phần tăng chỉ chi cho giấy phép.

Cả hai budget pre-read đều không shared, reference_count=1. Windsor set_campaign_budget nhận campaign_id theo schema và resolve ngân sách; đã kiểm tra budget resource riêng, không thay campaignBudgetId bằng campaignId. Params amount_micros lần lượt 120000000000 và 100000000000; budget_type=daily; apply_to_shared_budget=false.

## Mẫu giấy phép vận tải mới

Adgroup: `198265694580`. Final URL: https://nghiepvuvantai.com/
Display paths: `giay-phep/van-tai`. Tạo với status=paused.

### Tiêu đề

1. Giấy Phép Kinh Doanh Vận Tải
2. Tư Vấn Giấy Phép Vận Tải
3. Hỗ Trợ Hồ Sơ Giấy Phép
4. Hồ Sơ Vận Tải Bằng Ô Tô
5. Giấy Phép Cho Hộ Kinh Doanh
6. Hỗ Trợ Doanh Nghiệp Vận Tải
7. Hồ Sơ Hợp Tác Xã Vận Tải
8. Chưa Có Giấy Phép Vận Tải?
9. Kiểm Tra Điều Kiện Hồ Sơ
10. Hướng Dẫn Giấy Tờ Còn Thiếu
11. Gửi Hồ Sơ Qua Zalo
12. Tư Vấn Theo Loại Hình Xe
13. Hỗ Trợ Chuẩn Bị Hồ Sơ
14. Theo Dõi Hồ Sơ Bổ Sung
15. Liên Hệ Nghiệp Vụ Vận Tải

### Mô tả

1. Tư vấn giấy phép kinh doanh vận tải. Hỗ trợ kiểm tra điều kiện và chuẩn bị hồ sơ.
2. Hộ kinh doanh, doanh nghiệp, hợp tác xã: gửi giấy tờ qua Zalo để được hướng dẫn.
3. Chưa có giấy phép vận tải? Trao đổi loại hình kinh doanh và hồ sơ hiện có để kiểm tra.
4. Đơn vị hỗ trợ hồ sơ, không phải cơ quan cấp phép. Kết quả do cơ quan có thẩm quyền.

Kiểm tra local: 15 headlines, mỗi headline ≤30 ký tự; 4 descriptions, mỗi description ≤90 ký tự; paths ≤15 ký tự. Nội dung đối chiếu trang chủ đang live, không thêm phí/thời hạn/cam kết kết quả.

## Mẫu phù hiệu có sẵn sẽ bật

Ad `824739646212`, adgroup `205916274371`; pre-read PAUSED / APPROVED. Landing https://nghiepvuvantai.com/landing/dich-vu-lam-phu-hieu-xe

Headlines: Dịch Vụ Làm Phù Hiệu Xe | Hỗ Trợ Hồ Sơ Phù Hiệu Xe | Tư Vấn Phù Hiệu Xe Tải | Hồ Sơ Xe Biển Vàng | Kiểm Tra Hồ Sơ Qua Zalo | Báo Phí Trước Khi Xử Lý | Hỗ Trợ Hồ Sơ Toàn Quốc | Tư Vấn Cấp Lại Phù Hiệu | Hỗ Trợ Gia Hạn Phù Hiệu | Nghiệp Vụ Vận Tải | Gửi Hồ Sơ Nhận Tư Vấn | Hướng Dẫn Giấy Tờ Cần Có

Descriptions:
1. Tư vấn, hỗ trợ chuẩn bị hồ sơ phù hiệu xe tải, xe biển vàng. Liên hệ để được rà soát.
2. Gửi ảnh giấy tờ qua Zalo. Kiểm tra điều kiện và báo phí trước khi nhận xử lý hồ sơ.
3. Hỗ trợ hồ sơ cấp mới, cấp lại, gia hạn phù hiệu xe. Tư vấn qua điện thoại và Zalo.
4. Đơn vị hỗ trợ hồ sơ, không phải cơ quan cấp phép. Kết quả do cơ quan có thẩm quyền.

## Thực thi và kiểm chứng sau xác nhận

1. Pre-read lại ngân sách/status và kiểm tra chưa có mẫu giống nội dung để tránh tạo trùng.
2. Thực hiện từng action đúng schema; nếu timeout thì readback trước retry.
3. Readback budget amounts, resource, ad IDs/status/policy; cập nhật decisions.md.
4. Rollback: hai ngân sách về 80.000/ngày; pause mẫu vừa bật và mẫu mới. Không delete.
5. Sau khi có dữ liệu đủ, đối chiếu ngân sách-lost, CPC, conversions và lead ERP. Việc kiểm tra lại chưa được đặt lịch tự động.

## Kết quả thực thi 22/09/2026, 14:44 UTC+07

Người dùng xác nhận: “Chốt. Thực thi Đi, Tạo các mẫu quảng cáo tốt và tăng ngân sách lên”. Thực thi trực tiếp bằng Windsor, đúng account 139-673-0688 và schema đã discovery; connector không cung cấp validate-only cho các action này.

| Action | Đối tượng | Kết quả connector | Provider readback |
|---|---|---|---|
| set_campaign_budget | 23942905658 / budget 15646928105 | Thành công; 120000000000 micros | 120.000 VND/ngày, campaign ENABLED |
| set_campaign_budget | 24254559545 / budget 15879361137 | Thành công; 100000000000 micros | 100.000 VND/ngày, campaign ENABLED |
| enable_ad | 205916274371~824739646212 | Thành công | ENABLED / APPROVED; policy findings null |
| create_responsive_search_ad | 198265694580~825579765055 | Thành công, PAUSED | PAUSED / UNKNOWN; policy findings null; URL và 15 tiêu đề / 4 mô tả khớp kế hoạch |

Ngân sách campaign phù hiệu trả giá trị cũ trong readback ngay sau action; lần đọc lại sau đó đã trả 100.000. Không gửi lại action hoặc tăng thêm tiền.

Chưa enable ad 825579765055: UNKNOWN không phải APPROVED, null policy findings chưa chứng minh hoàn tất xét duyệt. Theo kế hoạch được chốt, chỉ bật khi readback APPROVED và không có policy findings. Chưa có tác vụ tự động theo dõi/bật sau xét duyệt.

Tổng hai campaign đã xác minh: 220.000 VND/ngày. Không thay đổi bid, targeting, landing hoặc campaign RFID. Chưa có bằng chứng về hiệu quả sau thay đổi.

Rollback: set_campaign_budget daily amount_micros=80000000000 cho từng campaign; pause_ad 205916274371~824739646212. Mẫu mới đang PAUSED; nếu đã được bật về sau thì pause_ad 198265694580~825579765055. Không xóa quảng cáo. Connector không trả request ID riêng; bằng chứng là phản hồi thành công và readback resource/IDs như bảng.
