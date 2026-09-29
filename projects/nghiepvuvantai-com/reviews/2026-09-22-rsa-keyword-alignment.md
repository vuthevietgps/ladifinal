# Mẫu giấy phép vận tải theo nhóm từ khóa riêng — 22/09/2026

## Quyết định và phạm vi

Người dùng yêu cầu cải thiện mẫu Trung bình, tiếp tục bằng Windsor và lưu kinh nghiệm: khi connector không cho sửa đúng phần cần sửa của mẫu/nhóm vừa tạo, tạo bản mới khắc phục; không dùng Computer Use vì tốn token.

Đã dừng luồng giao diện ở bước xem form; chưa nhập/sửa/lưu nội dung trên trình duyệt. Windsor list_actions có create_responsive_search_ad nhưng không có action sửa nội dung RSA. Có update_ad_group, nên không được suy ra mọi thuộc tính nhóm đều không thể sửa.

Tái sử dụng account 139-673-0688, campaign 23942905658 và landing https://nghiepvuvantai.com/. Không đổi ngân sách: campaign này 120.000 VND/ngày; campaign phù hiệu riêng 100.000 VND/ngày theo lần thực thi trước.

## Khắc phục

- Bản trước ad 825579765055 trong nhóm hỗn hợp 198265694580: giao diện báo Trung bình, khuyến nghị bổ sung từ khóa phổ biến; bộ từ khóa gồm phù hiệu và giấy phép.
- Bản mới ad 825662610623 trong nhóm 201136165820 — Giấy phép kinh doanh vận tải - Riêng - 22.09.2026.
- Nhóm mới chỉ dùng 5 từ khóa giấy phép/đăng ký vận tải đã có trong nhóm gốc, giữ match type. Không chuyển hoặc tắt từ khóa gốc đang mang lại chuyển đổi.
- Nội dung mới đưa “Đăng Ký Kinh Doanh Vận Tải” vào headline; các cụm dài “giấy phép kinh doanh vận tải bằng xe ô tô”, “làm giấy phép kinh doanh vận tải”, “xin giấy phép kinh doanh vận tải” vào mô tả. Giữ thông điệp hỗ trợ hồ sơ, không cam kết cấp phép.
- Đây là nhóm bổ sung, chưa phải hoàn tất chuyển toàn bộ từ khóa khỏi nhóm hỗn hợp. Nếu bật sau này, các từ khóa trùng vẫn có thể nhận phân phối ở nhóm cũ; chưa bảo đảm phân luồng riêng tuyệt đối.

## Thực thi và readback

1. create_ad_group: 201136165820, campaign 23942905658, PAUSED, không đặt CPC riêng.
2. push_keywords: thành công 5/5; readback đúng text/match type, keyword ENABLED nhưng nhóm PAUSED nên chưa phân phối.
3. create_responsive_search_ad: 201136165820~825662610623, PAUSED, 15 headline và 4 mô tả.
4. Readback: group PAUSED, ad PAUSED; Ad Strength PENDING; policy approval UNKNOWN; policy findings null. Nội dung và final URL khớp. Chưa xác nhận GOOD, chưa được coi là APPROVED, chưa bật.
5. Ad cũ 825579765055 đã PAUSED trong pre-read; không ghi đè hoặc xóa. Các mẫu live có chuyển đổi được giữ nguyên.

Rollback: giữ/pause group 201136165820 và ad 825662610623. Không xóa. Không đặt lịch tự động kiểm tra/bật.

## Từ khóa

- đăng ký kinh doanh vận tải — EXACT
- giấy phép kinh doanh vận tải bằng xe ô tô — EXACT
- xin giấy phép kinh doanh vận tải — EXACT
- làm giấy phép kinh doanh vận tải — EXACT
- Giấy Phép Kinh Doanh Vận Tải — PHRASE

## Headline

1. Giấy Phép Kinh Doanh Vận Tải
2. Đăng Ký Kinh Doanh Vận Tải
3. Tư Vấn Giấy Phép Vận Tải
4. Hỗ Trợ Hồ Sơ Giấy Phép
5. Giấy Phép Cho Hộ Kinh Doanh
6. Hồ Sơ Doanh Nghiệp Vận Tải
7. Hỗ Trợ Hợp Tác Xã Vận Tải
8. Kiểm Tra Điều Kiện Hồ Sơ
9. Hướng Dẫn Giấy Tờ Còn Thiếu
10. Gửi Hồ Sơ Qua Zalo
11. Tư Vấn Theo Loại Hình Xe
12. Chưa Có Giấy Phép Vận Tải?
13. Chuẩn Bị Hồ Sơ Trước Khi Nộp
14. Theo Dõi Yêu Cầu Bổ Sung
15. Liên Hệ Nghiệp Vụ Vận Tải

## Mô tả

1. Hỗ trợ hồ sơ giấy phép kinh doanh vận tải bằng xe ô tô cho hộ kinh doanh và doanh nghiệp.
2. Cần làm giấy phép kinh doanh vận tải? Gửi hồ sơ qua Zalo để kiểm tra giấy tờ còn thiếu.
3. Tư vấn xin giấy phép kinh doanh vận tải. Hướng dẫn chuẩn bị theo loại hình kinh doanh.
4. Đơn vị hỗ trợ hồ sơ, không phải cơ quan cấp phép. Kết quả do cơ quan có thẩm quyền.

Kiểm tra độ dài local: toàn bộ headline ≤30 ký tự, mô tả ≤90 ký tự, display path giay-phep/van-tai ≤15 ký tự mỗi đoạn.

## Vì sao điểm thấp vẫn có chuyển đổi

Kỳ 15–21/09/2026, dữ liệu Windsor theo ad:
- 812918062554: POOR, 33 click, 181.421 VND, 7 conversions, CPA khoảng 25.917 VND.
- 824878278902: AVERAGE, 61 click, 349.112 VND, 14 conversions, CPA khoảng 24.937 VND.
- 824864900612: GOOD, 56 click, 584.281 VND, 0 conversions.

Phân loại conversions của 2 mẫu đầu: 12 mục “số điện thoại”, 9 mục “zalo”, category CONTACT. Chưa đối soát khách/đơn/lợi nhuận ERP, không khẳng định conversion là cuộc gọi đã kết nối hoặc cuộc hội thoại Zalo.

Ad Strength là chẩn đoán mức đa dạng và độ liên quan nội dung/từ khóa, không trực tiếp tính Ad Rank, Quality Score hoặc thắng đấu giá. Điểm tốt không bảo đảm CPA tốt; CPA/lead thật/đơn/lợi nhuận mới là bằng chứng hiệu quả. Dữ liệu trên có mẫu nhỏ và khác phân phối, không phải thử nghiệm ngẫu nhiên chứng minh mẫu GOOD kém hơn.
Nguồn: https://support.google.com/google-ads/answer/9921843?hl=en

## Bổ sung sau ảnh phản hồi của người dùng — 15:10 UTC+07

Ảnh nhóm 201136165820 hiển thị Ad Strength Trung bình; keyword coverage chưa đầy đủ, sitelinks chưa đạt. Việc tách nhóm chưa đủ để khẳng định GOOD. Google hướng dẫn 6+ sitelinks có thể cải thiện Ad Strength; không bảo đảm điểm hoặc hiệu quả chuyển đổi.

Đã kiểm tra các section thực trên trang chủ HTTP 200 và thêm 6 sitelinks bằng create_ad_asset, level=ad_group, ad_group_id=201136165820. Mỗi link có 2 dòng mô tả phù hợp nội dung đích, không thêm cam kết/giá. Các link nhảy tới phần riêng trên cùng trang; việc tạo thành công chưa chứng minh được duyệt hoặc chắc chắn được phân phối cùng lúc.

| Asset ID | Tên | Đích trên https://nghiepvuvantai.com/ |
|---|---|---|
| 423808970123 | Giấy phép vận tải | #giay-phep-van-tai |
| 423909055102 | Giấy tờ cần chuẩn bị | #ho-so |
| 423909046771 | Câu hỏi thường gặp | #faq |
| 423909078040 | Liên hệ tư vấn hồ sơ | #contact |
| 423809036258 | Kiểm tra tình trạng xe | #kiem-tra-xe |
| 423992267835 | Phù hiệu sau giấy phép | #phu-hieu-xe |

Connector xác nhận tạo và gắn đúng nhóm thành công 6/6. Query asset cùng ad_group_id trả rỗng; query theo 6 asset_id xác minh đủ nội dung và trạng thái REVIEW_IN_PROGRESS, approval null. Quan hệ gắn nhóm được xác nhận bởi response action, chưa có independent readback relation từ query này.

Readback ad 825662610623 sau bổ sung vẫn PENDING / UNKNOWN; group và ad PAUSED. Không báo đã GOOD. Các cụm “Xin/Làm Giấy Phép Kinh Doanh Vận Tải” dài 32 ký tự, vượt headline 30, đã hiện diện đầy đủ trong mô tả. Không tạo thêm nhóm/RSA hoặc sửa từ khóa chỉ để nâng điểm. Ngân sách và mẫu live giữ nguyên. Chưa đặt lịch tự động.

Nguồn sitelinks: https://support.google.com/google-ads/answer/2375416?hl=en và https://support.google.com/adspolicy/answer/1054210?hl=en.

## Kích hoạt theo lệnh người dùng — 15:13:32 UTC+07

Người dùng gửi ảnh đúng nhóm có Độ mạnh quảng cáo “Tốt” và yêu cầu “Ok hãy bật nhóm quảng cáo này lên”. Lệnh hiện hành cho phép bật nhóm cùng mẫu mới; thay cho kế hoạch trước đó giữ PAUSED chờ approval. Độ mạnh Tốt trên ảnh không được coi là bằng chứng xét duyệt chính sách.

Pre-read xác nhận account 139-673-0688, campaign 23942905658 ENABLED, group 201136165820 PAUSED, ad 825662610623 PAUSED. Thực thi enable_ad và enable_ad_group qua Windsor đều thành công. Readback xác nhận campaign/group/ad đều ENABLED. API vẫn trả Ad Strength PENDING, approval UNKNOWN, policy findings null; chưa có bằng chứng mẫu đã được duyệt hoặc đã phân phối. Google tiếp tục kiểm soát xét duyệt/đủ điều kiện.

Không có action đổi ngân sách trong lần kích hoạt; nhóm dùng chung mức 120.000 VND/ngày đã chốt của vui trần 1. Bản cũ 825579765055 không được bật. Rollback: pause_ad_group 201136165820 và pause_ad 201136165820~825662610623. Chưa đặt lịch theo dõi tự động.
