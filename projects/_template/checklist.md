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
| 6 | Kiểm tra phân phối và conversion khi có dữ liệu thật | NOT_RUN | |
| 6 | Đối chiếu chi phí/lead/đơn/lợi nhuận cùng phạm vi | NOT_RUN | |
| 6 | Kiểm kê hợp nhất theo ERP product ID; ≥3 tài khoản hợp lệ/sản phẩm | NOT_RUN | Theo tieuchuan.md A1; chưa biết không coi là đạt |
| 6 | Kiểm đếm campaign/adgroup/RSA: ENABLED, eligible, phân phối, có kết quả | NOT_RUN | |
| 6 | Đối soát nguồn→ERP, độ mới, retry/trùng/mất và unknown attribution | NOT_RUN | |
| 6 | Báo cáo 19 tiêu chí/100 điểm, độ phủ bằng chứng và điều kiện chặn | NOT_RUN | Mẫu ads-health-review.md |
| 6 | Phản hồi P0/P1/P2 có owner/hạn, kiểm tra lại và điểm trước/sau | NOT_RUN | |

## Lệnh và kết quả

Ghi lệnh thực tế, exit code, số test, môi trường và giới hạn. Không dán secret, payload khách hoặc dữ liệu production vào file.
