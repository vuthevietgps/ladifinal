# Checklist thực hiện

Trạng thái hợp lệ: NOT_RUN, PASS, FAIL, BLOCKED, NOT_APPLICABLE (ghi lý do). Mỗi kết quả có thời gian, môi trường, người/lệnh kiểm tra và bằng chứng. Không sao chép PASS từ dự án khác.

| Phase | Kiểm tra / đầu ra | Trạng thái | Bằng chứng / bước tiếp |
|---|---|---|---|
| 0 | Brief, projectId, nhóm sản phẩm và phạm vi | NOT_RUN | |
| 0 | JSON/CSV hợp lệ, mapping không trùng | NOT_RUN | |
| 1 | Preview mobile/desktop, tiếng Việt, CTA/asset | NOT_RUN | |
| 1 | Nội dung/giá/cam kết có bằng chứng | NOT_RUN | |
| 2 | Domain/source và tài khoản/nhóm ERP đúng | NOT_RUN | |
| 2 | Suffix giữ cid/agid/click ID qua redirect | NOT_RUN | |
| 2 | Mỗi CTA một event, page load không conversion | NOT_RUN | |
| 2 | Visit/engagement nguồn → ERP khớp | NOT_RUN | |
| 2 | Retry không trùng, tương tác muộn được nhận | NOT_RUN | |
| 2 | Thiếu accountId/phone/event có kế hoạch riêng | NOT_RUN | |
| 2 | Nhiều lượt phù hợp không tự gán khách theo IP | NOT_RUN | |
| 2 | CRM → đơn giữ nguồn xác nhận (staging ERP) | NOT_RUN | |
| 3 | Kế hoạch Ads, keyword/RSA/URL, budget/KPI | NOT_RUN | |
| 4 | Backup, đúng site/service, ZIP/runtime regression | NOT_RUN | |
| 4 | HTTPS/asset/query/collector sau publish | NOT_RUN | |
| 4 | Rollback đã ghi, dữ liệu test dọn chính xác | NOT_RUN | |
| 5 | ERP schema/business/provider validateOnly passed | NOT_RUN | |
| 5 | ERP approval/production flag/policy/idempotency | NOT_RUN | |
| 5 | Search mới PAUSED, readback IDs/cấu hình đúng | NOT_RUN | |
| 5 | Kích hoạt riêng nếu có phạm vi cho phép | NOT_RUN | |
| 5 | Windsor direct action có xác nhận, pre-read và provider readback | PASS | 22/09/2026 14:27 UTC+07: campaign RFID `24260305588` từ ENABLED → PAUSED; rollback bằng `enable_campaign` |
| 6 | Kiểm tra phân phối và conversion khi có dữ liệu thật | NOT_RUN | |
| 6 | Đối chiếu chi phí/lead/đơn/lợi nhuận cùng phạm vi | NOT_RUN | |

## Lệnh và kết quả

Ghi lệnh thực tế, exit code, số test, môi trường và giới hạn. Không dán secret, payload khách hoặc dữ liệu production vào file.

## Phù hiệu mới, 18/09/2026 — phạm vi riêng

Các hàng NOT_RUN ở trên vẫn áp dụng cho nghiệm thu toàn dự án. Kết quả sau chỉ dành cho bản phù hiệu mới:

| Kiểm tra | Trạng thái | Môi trường / bằng chứng |
|---|---|---|
| Đúng URL Ads, domain, hotline | PASS | Windsor + HTML public; [audit](reviews/2026-09-18-phu-hieu-landing-tracking.md) |
| 4 thông điệp người dùng chốt | PASS | Source mới; cam kết nhận kết quả rồi thanh toán theo yêu cầu hiện hành |
| Mobile 320/390 và desktop 1440, ảnh, FAQ | PASS | Browser offline; screenshots đã xem |
| Page load 0 conversion, mỗi CTA đúng 1 conversion/event | PASS | Google script chặn, collector giả lập; không gửi production |
| JS syntax, collector/unit regression | PASS | node --check; unittest 7/7, database tạm |
| JSON/CSV/source references | PASS | Parse JSON/CSV, kiểm tra đường dẫn và mappingKey |
| Conversion tới Google / visit tới ERP / lead tới đơn | NOT_RUN | Cần bằng chứng production từ khách thật |
| Publish / Ads validateOnly / approval / execution | NOT_RUN | Chưa thực hiện |
