# Landing & Ads ↔ ERP

Đối chiếu mã local ngày 17/09/2026. Đây là ranh giới và backlog phát triển; không khẳng định toàn bộ bản local đang chạy trên production.

## Phần tái sử dụng

| Phần | Source hiện tại |
|---|---|
| Flask landing, inject tracking | `platform/ladifinal/app/routes/landing_routes.py`, `homepage_routes.py`, `file_handler.py` |
| Collector / click / event / nhập đơn legacy | `platform/ladifinal/app/click_tracking_repository.py`, `platform/ladifinal/app/routes/click_tracking_routes.py` |
| Tracking frontend | `platform/ladifinal/static/` |
| CRM, ingest, visit/event/lead/order link | ERP `backend/src/tracking-crm/` |
| Tạo/liên kết/cập nhật đơn | ERP `TestOrder2Service` qua `TrackingCrmService` |
| Worker nguồn đọc-only và ACK | ERP `deploy/erp-next/tracking-worker*.py` |
| Ads governance | ERP `google-ads`, `ai-marketing`, các module approval/execution hiện có |

## Hợp đồng đang có

[DTO ingest](../../../htxbachgia.shop/final8-version16/backend/src/tracking-crm/tracking-ingest.dto.ts) nhận batch visits (tối đa 50) qua `/api/tracking-ingest/visits`, có guard phía ERP. Payload mô tả dữ liệu, không tự cấp quyền cho source.

- Lượt: externalVisitId, occurredAt, observedAt, landingHost/path/name và IP/country tùy chọn.
- Ads: provider, clickIdType/clickId, campaignId, adGroupId, keyword/network/device/matchType.
- Engagement: pageViews, engagedSeconds, maxScroll, contactActions, formSubmits.
- Chống trùng visit theo sourceId + externalVisitId trong ERP; source phải đăng ký/được xác thực và đúng origin.
- Worker snapshot có ACK, chưa phải transactional outbox. Không tự sinh event/timestamp riêng từ counters; dữ liệu bị xóa trước khi worker đọc có thể bị mất.

Hồ sơ project/mapping là tài liệu quản lý, chưa được nối tự động vào collector/ERP. Không gửi nguyên mapping.csv hoặc project.json như một ingest payload.

## Tài khoản, điện thoại và quy thuộc

DTO trên **chưa có accountId, số điện thoại khách hoặc danh sách event chi tiết**. Không được mô tả chúng là đã đồng bộ chỉ vì có cột trong tài liệu hoặc trong màn nhập tay Ladifinal.

Provider + accountId + adGroupId sau khi xác minh là danh tính nhóm dùng để đối chiếu; campaignId kiểm tra quan hệ trong tài khoản. AW/label không thay accountId. Một domain có thể nhận quảng cáo từ nhiều tài khoản, nên không gán cố định một tài khoản theo domain khi chưa có bằng chứng đủ.

Hotline/đích Zalo khác số khách. Thời gian vào trang khác thời gian cuộc gọi. Ghép gần thời gian/sản phẩm chỉ tạo ứng viên để nhân viên xác nhận. Không tự ghép theo IP; một khách có nhiều lượt và nhiều đơn, cần giữ lịch sử theo từng cơ hội/đơn.

## Phase tích hợp tiếp theo — chưa triển khai trong lần hợp nhất

| Việc | Thay đổi cần xem xét | Nghiệm thu |
|---|---|---|
| Account identity | Nguồn cấu hình/bằng chứng → collector → database → worker → DTO/ERP; nhiều tài khoản cùng domain | Hai account cùng domain không bị gán nhầm; dữ liệu cũ chưa biết vẫn unknown |
| Phone/form/call evidence | Xác định nguồn số khách thật, phân quyền/retention và hợp đồng truyền riêng; không lấy từ tel: hotline | Có căn cứ nối visit; không lộ PII qua URL/tag/log; trường hợp thiếu/đa nghĩa vẫn chưa xác minh |
| Event history | Stable event ID, occurredAt thật, source namespace và retry | Event đến muộn/đến trước visit/gửi lại không trùng hoặc mất |
| Mapping sản phẩm/offer | Nhiều nhóm/cùng nhóm, nhiều landing/account theo thời gian | Không suy ra sản phẩm chỉ từ domain hoặc adGroupId thô |
| CRM attribution | Lưu lựa chọn/căn cứ/người xác nhận và lịch sử nguồn theo cơ hội/đơn | Khách quay lại không ghi đè nguồn đơn cũ; tạo đơn lại không trùng |
| Nguồn đồng bộ bền vững | Cân nhắc outbox/cursor/retry/backoff/quan sát hàng đợi thay vì giả định snapshot đủ | ERP tạm dừng vẫn phục hồi được; không mất sự kiện trước khi ACK |
| Ngừng nhập đơn legacy | Đối chiếu/backfill có ownership rõ; chuyển thao tác về ERP | Không ghi đè CRM, không tự tạo đơn từ mọi ad_visit_orders |

Mỗi việc là phase riêng cần đọc module hiện tại, kiểm tra khả năng tái sử dụng và test có ý nghĩa. Hợp nhất thư mục không tự cấp quyền sửa ERP, migration database hoặc triển khai live.

## Ads execution

Landing & Ads chuẩn bị brief/keyword/content/mapping/kế hoạch. Theo
[quy định chung ngày 27/09/2026](../../../htxbachgia.shop/final8-version16/docs/operations/shared-operating-policy.md),
đường ERP giữ Financial Control, provider `validateOnly`, approval, production flag,
readback và audit. Ngoại lệ Google Ads qua Codex/Windsor trực tiếp được giữ theo
đính chính người dùng; điều kiện cụ thể tại mục 2 nguồn chung.

Windsor plugin đọc/discovery và ghi action hỗ trợ khi đã được giao rõ, qua pre-read,
kiểm tra quyền/phạm vi/ngân sách và readback. Không cần ERP adapter cho đường trực
tiếp; thiếu action connector thì báo blocker, không tự đổi transport. Lưu bằng chứng
route và đối soát ERP sau ghi. ChatGPT Web chỉ tạo `ads_execution_plan.zip`.
Search campaign mới `PAUSED`; không delete/auto-publish hoặc tự tăng ngân sách/bật
đối tượng ngoài phạm vi. Không đưa lệnh ghi provider hay credential vào script landing.

## Mốc lịch sử cần đối chiếu trước khi vận hành

- [Connector nghiepvuvantai](../../../htxbachgia.shop/final8-version16/docs/operations/nghiepvuvantai-tracking-live.md)
- [Connector dichvuvantai](../../../htxbachgia.shop/final8-version16/deploy/erp-next/dichvuvantai-tracking-deployment.md)
- [Nguyên tắc AI Ads](../../../htxbachgia.shop/final8-version16/docs/ai-ads-v2/01_SYSTEM_OVERVIEW.md)

Các tài liệu này chứa mốc và kết quả cũ. Đọc lại bản đang chạy và xác minh đúng môi trường trước mọi thay đổi.
