# Mẫu dự án mới

Sao chép cả thư mục này thành `projects/<project-id>/`. Điền [project.json](project.json), [brief](brief.md), [mapping](mapping.csv), [ads-plan](ads-plan.md), [checklist](checklist.md) và [decisions](decisions.md).

Kiến thức dùng chung ở `product-groups/<group-key>/`; tham chiếu một hoặc nhiều group-key trong manifest. Cùng nhóm vẫn xác minh riêng tài khoản, domain, mã chuyển đổi, ngân sách, hotline và mapping. Nhóm khác cần brief/từ khóa/KPI riêng.

Tạo `landing-pages/<group-key>/<landing-key>/` tại gốc repo khi bắt đầu thiết kế. Không sao chép dữ liệu khách thật, token, database hay cấu hình live vào mẫu.

Mẫu này chỉ tạo hồ sơ phát triển, không provision website, source ERP hay Google Ads. Mặc định `draft`; chưa có approval, ngân sách hoặc lịch chạy.

Khi làm Phase 6, sao chép [ads-health-review.md](ads-health-review.md) thành `reviews/YYYY-MM-DD-ads-health.md` trong hồ sơ dự án và chấm theo [tieuchuan.md](../../tieuchuan.md). Audit hợp nhất các dự án cùng sản phẩm, giữ một bản báo cáo chính; các bản khác chỉ tham chiếu. Không sao chép điểm/PASS của lần trước khi chưa kiểm tra lại.
