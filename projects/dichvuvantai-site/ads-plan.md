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
