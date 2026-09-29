# Landing & Ads — hướng dẫn làm việc

## Đọc trước khi làm

Nguồn chung cho quyền và mức kiểm tra: `../htxbachgia.shop/final8-version16/docs/operations/shared-operating-policy.md`.
Áp dụng quick cho kiểm tra thường ngày, targeted cho thay đổi/lỗi, full cho audit
được giao; không dùng mức kiểm tra để miễn quyền/tài chính trước ghi live.

1. `quytrinh.md`: quy trình và phạm vi các phase.
2. `projects/README.md` và hồ sơ dự án đang làm.
3. `QUYTAC.md` khi tạo/sửa landing, asset, CTA hoặc tracking.
4. `docs/architecture/landing-ads-erp.md` khi liên quan đồng bộ/CRM.

## Cấu trúc chính thức

- Source landing: `landing-pages/<group-key>/<landing-key>/`; xem `landing-pages/README.md`. Giữ nguyên biến thể hotline/domain, không ghi đè lẫn nhau.
- Flask: `platform/ladifinal/app/`; frontend tracking `platform/ladifinal/static/`; templates `platform/ladifinal/templates/`.
- Tests: `platform/ladifinal/tests/`. Docker và Compose trong `platform/`; build context là thư mục `platform`, không phải gốc repo.
- Runtime local/database/published/uploads giữ trong `platform/`, không trộn với source landing hoặc commit vào Git.
- Hồ sơ từng dự án: `projects/<project-id>/`, tạo từ `_template/`; tham chiếu source landing thay vì copy nhiều nơi.
- Kiến thức nhóm: `product-groups/<group-key>/`. Group-key tổ chức tài liệu, không thay ID nhóm sản phẩm ERP.
- ERP sibling: `../htxbachgia.shop/final8-version16/`. CRM, đơn hàng, API ingest và worker chuẩn vẫn thuộc ERP.

## Quy tắc

- Làm theo phase đã yêu cầu; trước sửa nêu module tái sử dụng, sau sửa báo file, kiểm chứng và việc còn thiếu. Không xin lại quyền đã có trong yêu cầu hiện hành.
- Dự án cùng nhóm có thể dùng chung kiến thức/template; domain, hotline, account, conversion label, ngân sách và approval phải xác minh riêng.
- Landing & Ads chuẩn bị nội dung/kế hoạch. ERP giữ đầy đủ validate/approve/execute cho đường ERP. Theo đính chính người dùng ngày 27/09, giữ ngoại lệ Google Ads qua Codex/Windsor trực tiếp ở mục 2 nguồn chung; không cần ERP adapter. Không gọi Google Ads API thô hoặc dùng trình duyệt/script làm đường ghi thay thế.
- Trước ghi Windsor: discovery connector/account/action schema, pre-read và xác minh đúng account/campaign/ad group/budget resource. Chỉ ghi action/nội dung/giá trị đã được giao rõ, không đoán phần thiếu; kiểm tra quyền/ngân sách, dùng dry-run nếu có, readback và lưu bằng chứng route=windsor_direct. Không hỏi lại quyết định đã được giao.
- Nếu dùng ChatGPT Web trong luồng AI Ads, đầu ra thực thi chỉ là `ads_execution_plan.zip` đúng contract ERP.
- Search campaign mới luôn PAUSED. Đường ERP cần provider validateOnly passed, approval, `GOOGLE_ADS_PRODUCTION_ENABLED=true` và policy; đường Windsor giữ điều kiện riêng của nguồn chung, không bị chặn vì ERP thiếu adapter/flag. Cả hai kiểm tra quyền và giới hạn tài chính theo tác động ngay trước ghi. Nếu connector thiếu action hoặc không bảo đảm PAUSED thì báo blocker, không tự đổi transport.
- Không PMax/Shopping/Display/YouTube, auto-publish Ads hoặc delete campaign/adgroup/ad trong MVP. Không lấy campaignId/adGroupId thay campaignBudgetId.
- Không đưa secret hoặc dữ liệu khách thật vào Git, browser, tài liệu, log hay response.
- Hotline không phải số điện thoại khách. Không tự gán khách theo IP/thời gian; nguồn URL cần ERP đối chiếu.
- Không đổi nội dung landing hoặc cấu hình live chỉ vì tổ chức lại thư mục. Giữ biến thể theo domain/hotline và ID lượt/source lịch sử.

## Kinh nghiệm sửa Ads qua ERP hoặc Windsor

- Khi quảng cáo/nhóm vừa tạo có chất lượng thấp và đường đã chọn thiếu action sửa tương ứng, chuẩn bị bản thay thế trong phạm vi đã giao qua ERP hoặc ngoại lệ Windsor. Thiếu capability tạo thì báo blocker. Không chuyển sang Computer Use hay tự động hóa trình duyệt để sửa Ads.
- Discovery action schema trước; chỉ tạo mới khi thực sự thiếu action chỉnh phần cần sửa. Nhóm mới chỉ cần khi cấu trúc/từ khóa của nhóm cũ không phù hợp; không tạo lặp chỉ để chờ điểm cập nhật.
- Tái sử dụng landing/campaign/ngân sách đã xác minh. Tạo PAUSED, kiểm tra nội dung, từ khóa, policy và Ad Strength bằng readback. PENDING/UNKNOWN không phải chất lượng thấp và không được báo là GOOD khi chưa có bằng chứng.
- Giữ mẫu/nhóm cũ vừa tạo ở PAUSED nếu đã PAUSED; không tự xóa, tắt hoặc ghi đè mẫu đang có chuyển đổi chỉ vì Ad Strength thấp. Không tăng thêm ngân sách khi thay mẫu. Không dùng tạo mới để né chính sách.
- Ghi ID cũ → mới, nguyên nhân, nội dung khắc phục và kết quả vào hồ sơ dự án. Chi tiết thực thi xem quytrinh.md.
- Khi tách nhóm, kiểm tra sitelink thực sự áp dụng cho nhóm mới; không mặc định kế thừa các liên kết gắn riêng ở nhóm cũ. Nếu đường ERP/Windsor đã chọn hỗ trợ thêm asset thì bổ sung vào nhóm hiện có theo quyền tương ứng, không tạo thêm RSA/nhóm chỉ để khắc phục asset thiếu. Từ khóa dài quá 30 ký tự đưa vào mô tả đúng nghĩa; không cắt méo hoặc đổi targeting chỉ để nâng điểm. Điểm trên form chỉnh sửa và readback API có thể khác; ghi rõ nguồn và thời điểm.

## Kiểm chứng kỹ thuật

Từ root, dùng môi trường Python hiện có:

```powershell
Push-Location platform/ladifinal
try { ../../.venv/Scripts/python.exe -m unittest discover -s tests -v } finally { Pop-Location }
```

Test dùng database tạm. Khi sửa/move landing, kiểm tra đủ asset HTML/CSS và `node --check` cho JS, preview trang khi có sửa giao diện. Khi sửa cấu trúc, kiểm tra link tài liệu và source path JSON/CSV. Không chạy deploy hoặc Ads live trong test.

Các thư mục `ads/legacy`, `landingpages-thanh-pham` và hướng dẫn deploy rời rạc đã dọn khỏi project. Không tạo lại cấu trúc cũ.
