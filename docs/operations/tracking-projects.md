# Cấu hình tracking tham chiếu theo dự án

Thông tin lịch sử từ hồ sơ 09–16/09/2026, được giữ gọn sau cleanup. Chưa xác minh lại production; không tự áp dụng cho dự án mới.

| Dự án | dichvuvantai.site | nghiepvuvantai.com |
|---|---|---|
| Source key ERP | dichvuvantai-site-20260915 | nghiepvuvantai-com-20260825 |
| Account Ads | 8955711884, cần xác minh lại | Chưa xác minh |
| Hotline | 0363614511 | 0986284840 |
| Google tag | AW-16886013209 | AW-16690861047 |
| Phone label | 5xVQCKa21_ccEJm68PM- | zSISCMrxvL8cEPen6ZY- |
| Zalo label | bhRcCKm21_ccEJm68PM- | _YWhCPPAvL8cEPen6ZY- |

Không lấy AW/label làm accountId; không dùng nhầm bộ mã giữa hai domain. Ngân sách/campaign/adgroup không được điền mặc định từ lịch sử. Không lưu số điện thoại khách vào hồ sơ này.

Luồng lịch sử: collector SQLite → worker read-only mỗi 30 giây → API ingest ERP có xác thực → Tracking CRM. Worker và bản triển khai chuẩn thuộc ERP:

- [nghiepvuvantai connector](../../../htxbachgia.shop/final8-version16/docs/operations/nghiepvuvantai-tracking-live.md)
- [dichvuvantai connector](../../../htxbachgia.shop/final8-version16/deploy/erp-next/dichvuvantai-tracking-deployment.md)
- [Giới hạn DTO và backlog](../architecture/landing-ads-erp.md)

Lịch sử chỉ xác minh lượt và engagement; không chứng minh Google đã quy thuộc conversion, cuộc gọi đã kết nối hoặc khách đã mua. Tài liệu này không phải approval hoặc cấu hình runtime.
