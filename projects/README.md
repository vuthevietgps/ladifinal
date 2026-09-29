# Dự án Landing & Ads

Mỗi dự án có hồ sơ riêng; kiến thức sản phẩm được tham chiếu từ `product-groups/`. Đọc [quy trình](../quytrinh.md) trước khi bắt đầu.

## Hồ sơ hiện có

| Project ID | Domain | Hồ sơ | Trạng thái |
|---|---|---|---|
| `dichvuvantai-site` | dichvuvantai.site | [Mở](dichvuvantai-site/README.md) | Nhập từ tài liệu 15–16/09/2026; cần xác minh lại runtime/mapping |
| `nghiepvuvantai-com` | nghiepvuvantai.com | [Mở](nghiepvuvantai-com/README.md) | Nhập từ tài liệu 09–15/09/2026; không khẳng định chiến dịch đang chạy |

Đây là danh mục khởi đầu từ dữ liệu Ads đã nhập, không phải danh sách đầy đủ mọi website cũ trong repo. Không tự thay đổi các website chưa có hồ sơ.

## Tạo dự án mới

1. Chọn project ID chưa tồn tại; sao chép `_template/` sang tên đó, không sửa trực tiếp mẫu.
2. Điền `project.json`: projectId, name, productGroupKeys, domains. ID ERP/tài khoản chưa biết để trống/null.
3. Cùng nhóm: tham chiếu thư mục nhóm có sẵn. Khác nhóm: sao chép `product-groups/_template/` sang group-key mới rồi bổ sung kiến thức và ID ERP đã xác minh.
4. Điền brief, mapping, ads-plan, checklist và decisions. Khi audit Phase 6, dùng [mẫu đánh giá sức khỏe](./_template/ads-health-review.md) theo [tieuchuan.md](../tieuchuan.md), lưu tại `reviews/YYYY-MM-DD-ads-health.md`. Một nhóm sản phẩm có nhiều dự án; một dự án có thể tham chiếu nhiều nhóm.
5. Tạo `landing-pages/<group-key>/<landing-key>/` tại gốc repo khi phát triển trang; hồ sơ dự án chỉ tham chiếu source. Không copy dữ liệu runtime, credentials hoặc khách hàng sang hồ sơ.
6. Thêm một dòng vào danh mục trên. Chỉ thay đổi hệ thống runtime theo phase riêng đã được yêu cầu.

Ví dụ local, từ gốc repo, chọn tên thật trước khi chạy:

```powershell
$projectKey = 'ten-du-an-moi'
$projectTarget = Join-Path 'projects' $projectKey
if (Test-Path -LiteralPath $projectTarget) { throw 'Project already exists' }
Copy-Item -LiteralPath 'projects/_template' -Destination $projectTarget -Recurse
```

## Cách dùng mapping.csv

Mỗi dòng là một quan hệ landing/offer/sản phẩm/nhóm quảng cáo, không phải bản ghi khách hàng. Một landing có nhiều offer hoặc nhiều nhóm quảng cáo cần nhiều dòng. `mappingKey` ổn định và duy nhất trong dự án. Lưu CSV UTF-8, IDs dạng chuỗi; khi mở bằng Excel phải giữ cột ID dạng text để tránh làm tròn số.

| Cột | Quy tắc |
|---|---|
| projectId, mappingKey | ID dự án và khóa quan hệ |
| productGroupKey | Khớp nhóm được tham chiếu trong project.json; chưa biết để trống |
| erpProductGroupId, erpProductId | ID đã lấy từ ERP; không điền slug vào đây |
| offerKey, landingKey, landingUrl | Offer/trang cụ thể; HTTPS khi đưa live |
| sourceKey | Namespace collector; nhiều landing/dự án có thể dùng chung một source |
| provider, adsAccountId, campaignId, adGroupId | Danh tính provider; accountId không thay bằng AW |
| campaignBudgetId | ID ngân sách thật; không lấy campaign/adgroup ID thay thế |
| conversionId, phoneLabel, zaloLabel | Cấu hình Google tag đã đối chiếu từng trang |
| verificationStatus, evidence | `draft`, `historical_unverified`, `verified` hoặc `retired`; evidence chỉ dẫn nguồn không chứa PII |

`verified` cần đối chiếu đủ các định danh áp dụng và bằng chứng hiện tại. Mapping này chưa tự gửi vào ERP. Không coi sự tồn tại của dòng CSV là accountId đã được ingest, chiến dịch đã tạo hoặc đã được phép chạy.

`private/` và `artifacts/` trong từng dự án đã được Git ignore; không dùng chúng làm secret store. Chỉ lưu tham chiếu secret được quản lý ở server; không lưu plaintext credentials.

## Đánh giá giàn Ads

Phase 6 phải có điểm, độ phủ bằng chứng, đối soát hiệu quả ERP và phản hồi có người/hạn xử lý. Audit theo sản phẩm ERP xuyên các dự án để kiểm tra tối thiểu 3 tài khoản hợp lệ/sản phẩm; không đếm lặp tài khoản hoặc ngân sách. Báo cáo trong Git chỉ chứa kết quả tổng hợp không có dữ liệu khách/secret. Xem [rà soát hồ sơ ban đầu 18/09/2026](../docs/operations/ads-health-baseline-20260918.md); đây chưa phải điểm sức khỏe production.
