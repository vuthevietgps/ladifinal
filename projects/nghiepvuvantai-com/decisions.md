# Nhật ký dự án

| Thời gian | Việc | Kết quả / bằng chứng | Việc còn lại |
|---|---|---|---|
| 2026-09-17 | Nhập hồ sơ Landing & Ads | docs/operations/tracking-projects.md | Xác minh runtime, ID nhóm/sản phẩm ERP và mapping quảng cáo |
| 2026-09-18 | Phù hiệu mới: lấy source từ live, sửa 4 thông điệp và CTA Zalo | [Audit landing/tracking](reviews/2026-09-18-phu-hieu-landing-tracking.md); browser offline + unittest local | Chưa publish; cần kiểm chứng attribution production/ERP |
| 2026-09-22 14:27 UTC+07 | Theo lệnh người dùng, pause trực tiếp qua Windsor campaign `24260305588` — Search - Thẻ nhận dạng lái xe RFID - 60k, account `139-673-0688` | Pre-read `ENABLED`, ngân sách 60.000 VND/ngày, 8 click và 221.633 VND/7 ngày, 0 conversion; connector trả thành công; provider readback `PAUSED`. Rollback: action `enable_campaign` đúng campaign nếu người dùng yêu cầu | Chưa tăng ngân sách hoặc tạo RSA. Cần xác nhận giá trị ngân sách đích và nội dung/landing/ad group; ưu tiên đánh giá `vui trần 1` vì 94 click/17 conversion trong 7 ngày |

| 2026-09-22 14:44 UTC+07 | Người dùng chốt tăng ngân sách và bổ sung Ads qua Windsor, account `139-673-0688` | `23942905658`: 80.000 → 120.000 VND/ngày; `24254559545`: 80.000 → 100.000 VND/ngày, đã readback. Ad phù hiệu `824739646212` đã ENABLED / APPROVED. Tạo RSA giấy phép `825579765055` trong group `198265694580`, PAUSED / UNKNOWN; nội dung khớp kế hoạch. [Chi tiết và rollback](reviews/2026-09-22-budget-ad-expansion.md) | Mẫu giấy phép chưa bật do chưa xác nhận APPROVED; chưa đặt lịch tự động. Chính sách của mẫu cũ và hiệu quả sau thay đổi chưa được giải quyết/xác minh |

| 2026-09-22 | Theo yêu cầu tối ưu và dùng Windsor, tạo bản mới theo nhóm từ khóa riêng; lưu kinh nghiệm vào AGENTS.md và quytrinh.md | Nhóm `201136165820`, 5 từ khóa; ad `825662610623`, 15 headlines/4 descriptions. Readback group/ad PAUSED, strength PENDING, approval UNKNOWN. [Bằng chứng và nội dung](reviews/2026-09-22-rsa-keyword-alignment.md) | Chưa thể xác nhận GOOD hoặc bật khi chưa xét duyệt; không đổi mẫu có chuyển đổi, không tăng ngân sách thêm |

Ghi chú lần nhập hồ sơ 17/09: không thực thi Ads hoặc triển khai server trong lần nhập hồ sơ đó. Các action production về sau được ghi riêng trong bảng trên, không chuyển test snapshot thành nghiệm thu live.

### 22/09/2026 15:13 UTC+07 — Bật nhóm giấy phép vận tải riêng

Theo lệnh người dùng sau ảnh Độ mạnh “Tốt”, đã enable group 201136165820 và ad 825662610623, account 139-673-0688 / campaign 23942905658. Windsor trả thành công, provider readback cả nhóm và ad ENABLED. API vẫn PENDING / UNKNOWN về strength/approval; chưa xác nhận phân phối. Không đổi ngân sách. [Bằng chứng và rollback](reviews/2026-09-22-rsa-keyword-alignment.md).

### 22/09/2026 15:22 UTC+07 — Thêm mẫu phù hiệu dịch vụ

Theo yêu cầu tăng thêm 1 mẫu, tạo rồi bật RSA 825582425911 trong nhóm 205916274371 / campaign 24254559545. Readback campaign/group/ad ENABLED; nhóm hiện 3 mẫu ENABLED và 1 PAUSED. Mẫu mới PENDING / UNKNOWN về strength/approval. Không đổi ngân sách; readback cuối 100.000 VND/ngày. [Nội dung và rollback](reviews/2026-09-22-phu-hieu-additional-rsa.md).
