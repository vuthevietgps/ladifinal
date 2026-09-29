# Rà soát ban đầu về khả năng đánh giá giàn Ads — 18/09/2026

Phạm vi: đọc quy trình, hai hồ sơ dự án hiện có và mã nguồn ERP sibling; chưa lấy snapshot Google Ads hoặc dữ liệu production `htxbachgia.shop`. Đây là đánh giá **mức đầy đủ của hồ sơ và khả năng đối chiếu**, không phải kết luận hiệu quả đang chạy. Chuẩn áp dụng tiếp theo: [tieuchuan.md](../../tieuchuan.md).

## Kết quả rà soát

| Hạng mục | Bằng chứng đã đọc | Nhận xét |
|---|---|---|
| Quy trình trước lần bổ sung này | Phase 6 trong quytrinh.md có theo dõi/đối chiếu/tối ưu | Chưa có rubric, điểm, ngưỡng sức khỏe, điều kiện chặn hay mẫu phản hồi. Đã bổ sung Phase 6 và bộ tiêu chuẩn riêng. |
| Danh sách dự án | [Danh mục](../../projects/README.md) | Có 2 hồ sơ lịch sử, danh mục tự ghi chưa đầy đủ mọi website; không coi đây là toàn bộ giàn. |
| Mapping dichvuvantai.site | [CSV](../../projects/dichvuvantai-site/mapping.csv) | 4 dòng historical_unverified, cùng 1 account ID được ghi; thiếu ERP product/group ID và campaign/adgroup/budget ID. Chưa chứng minh tài khoản hiện còn hoạt động hay đủ 3 tài khoản/sản phẩm. |
| Mapping nghiepvuvantai.com | [CSV](../../projects/nghiepvuvantai-com/mapping.csv) | 2 dòng historical_unverified; account ID, ERP product/group ID, campaign/adgroup/budget ID chưa điền. AW khác không chứng minh account khác. |
| Nhận diện account trên ingest | [Kiến trúc](../architecture/landing-ads-erp.md), [DTO ERP](../../../htxbachgia.shop/final8-version16/backend/src/tracking-crm/tracking-ingest.dto.ts) | DTO chưa có accountId/adId; không thể cam kết quy thuộc đa tài khoản đến từng mẫu Ads từ payload này. Cần mapping/bằng chứng riêng và kiểm tra trường hợp mơ hồ. |
| Kết quả tài chính ERP | [Profit enrichment](../../../htxbachgia.shop/final8-version16/backend/src/google-ads/google-ads-profit-enrichment.service.ts), [profit report](../../../htxbachgia.shop/final8-version16/backend/src/ad-group-profit-report/ad-group-profit-report.service.ts) | Có module tái sử dụng theo campaign/adgroup; cần xác minh bản đang chạy, ngày/currency, định nghĩa revenue/net profit và nguồn lead. Sự tồn tại của module chưa chứng minh dữ liệu live đã đủ/đúng. |

## Điểm và kết luận hiện tại

**Điểm sức khỏe production: CHƯA CHẤM.** Chưa có bằng chứng live cho 19 tiêu chí, nên độ phủ bằng chứng production trong lần rà soát này là **0%**; điểm phần kiểm chứng N/A, khoảng có thể đạt 0–100. Đây không phải đánh giá giàn đang đạt 0 điểm hoặc không chạy.

Chưa thể kết luận: số tài khoản hợp lệ/sản phẩm, số Ads thực sự phân phối, tỷ lệ đồng bộ, lead/đơn xác minh, CPL/CPA/ROAS hoặc lợi nhuận. Các hạn chế mã nguồn là căn cứ chuẩn bị kiểm tra, không được coi là sự cố production đã xác nhận.

## Phản hồi ưu tiên

| Ưu tiên | Việc cần hoàn tất | Vai trò phụ trách đề xuất | Hạn đề xuất | Điều kiện nghiệm thu |
|---|---|---|---|---|
| P1 | Kiểm kê toàn bộ sản phẩm/account/campaign/adgroup qua ERP, cập nhật mapping có bằng chứng | Ads + quản trị ERP; chưa chỉ định người | Trước lần chấm điểm live đầu tiên | Phân biệt ID ERP/provider; xác định ≥3 tài khoản hợp lệ/sản phẩm hoặc số thiếu/chưa rõ |
| P1 | Lấy snapshot 7/28 ngày Ads và ERP cùng phạm vi, đối soát chi phí/nguồn/CRM/đơn/lợi nhuận | Ads + CRM + tài chính; chưa chỉ định người | Cùng mốc chốt số của lần audit | Có bảng chênh lệch, độ mới và dữ liệu chưa quy thuộc; không cộng trùng/cấp sai |
| P1 | Kiểm tra staging đường đi source→worker→ERP, retry/cập nhật muộn và mapping đa account | Phụ trách kỹ thuật; chưa chỉ định người | Trước khi xác nhận F1–G2 đạt | Có bằng chứng nghiệm thu; khoảng trống account/adId được xử lý bằng căn cứ hoặc giữ unknown |

Đây là hạn/vai trò đề xuất, chưa phải giao việc đã được người nhận cam kết. Không có sửa runtime, triển khai hoặc thay đổi Ads trong lần bổ sung tài liệu này.

## Kiểm chứng tài liệu và ứng dụng local

- Đã kiểm tra 7 file Markdown của lần thay đổi: UTF-8 hợp lệ, các link local tồn tại, 19 tiêu chí cộng đúng 100 điểm và trọng số trong mẫu báo cáo khớp tiêu chuẩn.
- Chạy từ `platform/ladifinal`: `../../.venv/Scripts/python.exe -m unittest discover -s tests -v` — exit code 0, **7 tests PASS**, database tạm.
- Các kiểm tra trên không xác minh số liệu Ads, phiên bản ERP production hoặc hiệu quả kinh doanh live.
