# Kế hoạch Ads — bản nháp

Trạng thái: DRAFT. File này không phải approval hoặc execution payload.

## 1. Phạm vi và danh tính

- Project / mappingKey / sản phẩm ERP:
- Tài khoản / currency / timezone đã xác minh:
- Campaign/adgroup có sẵn và lý do tái sử dụng hoặc tạo mới:
- Landing URL và phiên bản:
- Ngân sách chiến dịch/ngày, tổng ngân sách, campaignBudgetId: CHƯA XÁC ĐỊNH.
- Cùng campaign với dự án khác: ghi quan hệ, không cộng ngân sách hai lần.

## 2. Targeting và đo lường

| Hạng mục | Giá trị đề xuất | Bằng chứng / cần xác minh |
|---|---|---|
| Khu vực / tùy chọn hiện diện | | |
| Ngôn ngữ / lịch / mạng phân phối | | |
| Chiến lược giá thầu / giới hạn | | |
| Conversion goal / primary-secondary | | |
| Auto-tagging / suffix / override | | |
| Source ERP / mapping tài khoản và nhóm | | |
| KPI click / lead / đơn / lợi nhuận | | |

## 3. Từ khóa theo nhu cầu

| Adgroup dự kiến hoặc ID thật | Nhu cầu / offer | Từ khóa | Match type | Phủ định và phạm vi | Landing |
|---|---|---|---|---|---|

## 4. Nội dung quảng cáo

| Adgroup / mappingKey | Headlines | Descriptions | Final URL | Assets / bằng chứng cam kết |
|---|---|---|---|---|

Kiểm tra độ dài/số lượng theo contract ERP/provider hiện hành. Mỗi nhóm nội dung phải phù hợp landing và offer; không tự thêm cam kết chưa được xác minh.

## 5. Bảng thay đổi để review

| Action dự kiến | Đối tượng / account | Trước → sau | Ngân sách | Trạng thái | Lý do / bằng chứng |
|---|---|---|---|---|---|

Chiến dịch Google Search mới luôn PAUSED. Kích hoạt là action riêng. Không điền ID giả cho đối tượng chưa tạo; dùng khóa nháp để tham chiếu trong kế hoạch.

## 6. Bàn giao ERP

- Export/plan ID và package reference:
- Schema/business validation:
- Provider validateOnly:
- Approval đúng phạm vi:
- Production flag và policy: do ERP kiểm tra, không tự thay đổi để thử.
- Execution log / readback IDs:
- Phương án rollback theo action ERP được phép, không dùng delete:

Tất cả mục trên ban đầu NOT_RUN. Nếu dùng ChatGPT Web, đầu ra thực thi chỉ là ads_execution_plan.zip theo contract ERP. Không gọi Google Ads API hoặc connector write trực tiếp từ project landing.

## Phù hiệu mới — bản nháp nội dung 18/09/2026

Trạng thái DRAFT, chưa tạo ad. Đề xuất một mẫu RSA bổ sung trong adgroup hiện có `205916274371`, campaign `24254559545`, account `1396730688`. Không tạo thêm campaign, không đề xuất thay ngân sách trong lần sửa nội dung này.

Final URL giữ `https://nghiepvuvantai.com/landing/dich-vu-lam-phu-hieu-xe`. Chỉ dùng sau khi landing đã có thông điệp khớp. Offer nhận kết quả rồi mới thanh toán do người dùng xác nhận trong yêu cầu ngày 18/09/2026; không tự thêm giá tiền hay thời gian cấp.

Headlines (mỗi dòng tối đa 30 ký tự):

1. Hỗ Trợ Thủ Tục Phù Hiệu Xe
2. Kiểm Tra Điều Kiện Xe
3. Hướng Dẫn Giấy Tờ Còn Thiếu
4. Báo Phí Rõ Trước Khi Làm
5. Nhận Kết Quả Rồi Thanh Toán
6. Gửi Hồ Sơ Qua Zalo
7. Tư Vấn Hồ Sơ Phù Hiệu Xe
8. Phù Hiệu Xe Tải, Xe Biển Vàng
9. Cần Cấp Lại Phù Hiệu Xe?
10. Hỏi Trường Hợp Xe Của Bạn

Descriptions (mỗi dòng tối đa 90 ký tự):

1. Kiểm tra điều kiện xe, hướng dẫn giấy tờ còn thiếu. Gửi hồ sơ qua Zalo để được tư vấn.
2. Báo rõ chi phí trước khi làm. Nhận kết quả rồi mới thanh toán theo báo phí thống nhất.
3. Chưa rõ hồ sơ đã đủ? Gửi giấy tờ hiện có để được kiểm tra và hướng dẫn bổ sung.
4. Đơn vị tư vấn, hỗ trợ hồ sơ; không phải cơ quan cấp phù hiệu.

Đánh giá sau khi tracking được kiểm chứng: chi phí liên hệ, tỷ lệ click → liên hệ, liên hệ đủ điều kiện và đơn được ERP xác nhận. Không chọn mẫu chỉ bằng Ad Strength hoặc CTR, không dùng click Zalo làm bằng chứng đã có cuộc hội thoại. Nội dung pháp lý vẫn chịu xét duyệt chính sách Google; ad hiện có APPROVED_LIMITED không có nghĩa nháp này được duyệt.

[Báo cáo landing và tracking](reviews/2026-09-18-phu-hieu-landing-tracking.md). Provider validateOnly, approval và execution: NOT_RUN.

Điều chỉnh theo người dùng: dùng “Hỗ trợ thủ tục phù hiệu xe” để mô tả đúng vai trò hỗ trợ hồ sơ. Đây không phải bằng chứng Google sẽ gỡ nhãn hạn chế hoặc chấp thuận quảng cáo. Cần đối chiếu dịch vụ thực tế với [chính sách giấy tờ và dịch vụ chính phủ](https://support.google.com/adspolicy/answer/13156083?hl=en), thực hiện chứng nhận/đề nghị loại trừ nếu áp dụng. Không đổi từ để che giấu dịch vụ thực tế.
