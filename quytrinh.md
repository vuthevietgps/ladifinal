# Quy trình phát triển và vận hành Landing & Ads

Cập nhật 27/09/2026. Áp dụng cho mọi dự án, cùng hoặc khác nhóm sản phẩm. Project làm việc chung là `ladifinal`; các landing được giữ trong [landing-pages](landing-pages/README.md), ứng dụng quản lý trong [platform](platform/README.md). ERP `htxbachgia.shop` tiếp tục là hệ thống riêng.

Quyền và mức quick/targeted/full theo [nguồn chung ERP–Ladifinal](../htxbachgia.shop/final8-version16/docs/operations/shared-operating-policy.md).
Giữ đường ERP và ngoại lệ Google Ads qua Codex/Windsor trực tiếp theo đính chính
người dùng ngày 27/09; điều kiện theo mục 2 nguồn chung.

## 1. Mục tiêu và ranh giới

```text
Sản phẩm/offer → landing → tracking → kế hoạch Ads → ERP hoặc Windsor được giao thực thi
Click thật → landing/collector → đồng bộ ERP → đối chiếu CRM → chăm sóc → đơn hàng
                                                                    ↓
                                       chi phí / doanh thu / lợi nhuận theo nguồn
```

| Thành phần | Trách nhiệm |
|---|---|
| Landing & Ads | Nội dung, trang đích, domain, tài nguyên, tracking đầu vào, nghiên cứu từ khóa, bản nháp quảng cáo, hồ sơ dự án và kiểm chứng |
| Codex + Windsor | Đọc/discovery và ghi Google Ads trực tiếp theo ngoại lệ được giao cụ thể; pre-read, quyền/phạm vi/ngân sách, readback và lưu bằng chứng |
| ERP | Hệ thống nghiệp vụ, tài chính, mapping và đối soát; validate/approve/execute/audit cho action đi đường ERP |
| Worker ERP | Đọc nguồn click, gửi API ingest và giữ ACK; bản chuẩn trong ERP `deploy/erp-next/` |
| Nhân viên | Đối chiếu khách với lượt truy cập, xác nhận nguồn, chăm sóc và tạo/liên kết đơn trong ERP |

Source landing mới đặt tại `landing-pages/<group-key>/<landing-key>/`; hồ sơ `projects/<project-id>/` tham chiếu đường dẫn này, không sao chép source vào nhiều dự án.

Không phát triển CRM/đơn hàng thứ hai trong landing. Giao diện nhập đơn cũ của Ladifinal chưa bị gỡ trong lần tổ chức này; chuyển dữ liệu hoặc ngừng chức năng đó cần phase riêng. Không ghi đè CRM bằng dữ liệu nhập tay cũ.

## 2. Tổ chức dự án và nhóm sản phẩm

```text
ladifinal/
├── quytrinh.md                         Quy trình chuẩn
├── QUYTAC.md                           Quy cách giao diện/asset/ZIP
├── platform/                           Ứng dụng Flask, Docker, cấu hình và dữ liệu local
├── product-groups/<group-key>/          Kiến thức sản phẩm dùng chung
├── projects/<project-id>/
│   ├── project.json                    Danh tính dự án, domain, nhóm sản phẩm
│   ├── brief.md                        Khách hàng, sản phẩm, đề nghị bán, mục tiêu
│   ├── mapping.csv                     Landing ↔ sản phẩm ↔ tài khoản/nhóm ads
│   ├── ads-plan.md                     Từ khóa, RSA, ngân sách, targeting, đo lường
│   ├── checklist.md                    Tiến độ và bằng chứng nghiệm thu
│   ├── decisions.md                    Quyết định và thay đổi
│   └── (tham chiếu source trong landing-pages/)
├── landing-pages/<group-key>/<landing-key>/  Source HTML/CSS/JS/ảnh theo nhóm sản phẩm
└── docs/architecture/                  Ranh giới và hợp đồng với ERP
```

`project-id` và `group-key` dùng chữ thường không dấu, số, dấu gạch ngang. Chúng không thay thế ID ERP. ID tài khoản/campaign/adgroup lưu dạng chuỗi. Manifest/CSV là hồ sơ phát triển, **chưa được Flask/ERP tự đọc để tạo cấu hình**.

### Dự án mới cùng nhóm sản phẩm

- Tạo hồ sơ dự án riêng, tham chiếu `productGroupKeys` đã có; dùng chung kiến thức sản phẩm/FAQ/tài nguyên có quyền sử dụng, không sao chép cả thư mục nhóm.
- Viết riêng thương hiệu, offer, khách/khu vực, hotline, landing, tài khoản ads, mã chuyển đổi, ngân sách và mapping ERP.
- Nếu chỉ sửa nội dung hoặc thử nghiệm giao diện trên cùng domain/offer, ưu tiên phiên bản landing trong dự án hiện tại; không tạo campaign/adgroup mới chỉ vì thêm URL.
- Có thể dùng chung tài khoản/campaign khi có chủ đích. Khi tổng hợp ngân sách, đếm mỗi campaign/budget thực tế một lần; không cộng lại theo số landing/dự án cùng sử dụng.

### Dự án mới khác nhóm sản phẩm

- Tạo `product-groups/<group-key>/` mới, đối chiếu ID nhóm/sản phẩm chính thức trong ERP.
- Lập brief, thông điệp, từ khóa, phủ định, mục tiêu và mapping mới. Chỉ tái sử dụng kỹ thuật/layout phù hợp.
- Không sao chép giá, cam kết, chứng nhận, conversion label, target CPA hoặc ngân sách của nhóm trước.
- Tách campaign khi cần ngân sách, mục tiêu, khu vực hoặc cách tối ưu riêng; khác nhóm không bắt buộc mở tài khoản Ads mới.

Một dự án có thể tham chiếu nhiều nhóm. Mỗi dòng `mapping.csv` xác định nhóm/sản phẩm của landing hoặc offer. Landing nhiều sản phẩm cần nhiều dòng hoặc quy tắc chọn sản phẩm rõ ràng; không đoán theo tên domain.

## 3. Phase 0 — mở hồ sơ và xác định phạm vi

1. Đọc [danh mục dự án](projects/README.md), chọn hồ sơ hiện có hoặc sao chép [mẫu](projects/_template/README.md); không ghi đè dự án có sẵn.
2. Điền `project.json`, `brief.md`; mục chưa biết để `null`, ô CSV rỗng hoặc `CHƯA XÁC MINH`. Không dùng dữ liệu dự án trước làm mặc định.
3. Kiểm kê landing/campaign/adgroup qua nguồn đọc được phép và danh mục ERP; kiểm tra trùng trước khi tạo.
4. Lập mapping: project → landing/offer → nhóm/sản phẩm ERP → provider/account/campaign/adgroup → tracking/source ERP.
5. Ghi phase được yêu cầu, phần tái sử dụng, đầu ra và điều kiện nghiệm thu vào checklist. Chỉ thực hiện các phase đã nằm trong phạm vi yêu cầu.

**Kiểm chứng:** JSON/CSV đọc được; projectId duy nhất; mappingKey duy nhất trong dự án; đường dẫn đúng; dòng `verified` không có định danh giả/placeholder.

## 4. Phase 1 — phát triển và preview landing

1. Nội dung khớp sản phẩm/offer: khách mục tiêu, lợi ích, giá/điều kiện đã xác minh, quy trình, bằng chứng thật, FAQ, thông tin doanh nghiệp và liên hệ.
2. Làm HTML/CSS/JS theo [QUYTAC.md](QUYTAC.md). Với trang cũ, xác định source hiện hành trước; không dùng snapshot cũ ghi đè.
3. Kiểm tra mobile/desktop, CTA, hotline, Zalo, form, tiếng Việt, asset, lỗi console và tốc độ tải.
4. Trả link preview và file đã sửa. Yêu cầu chỉ thiết kế kết thúc ở preview. Nếu phạm vi đã bao gồm đóng gói/triển khai, tiếp tục những bước đó, không xin lại cùng quyền.
5. Dùng cơ chế inject tracking của ứng dụng; không chèn thêm tag/event snippet gây trùng. Preview dùng cấu hình thử, không phát conversion thật.

**Kiểm chứng:** mở preview và xác nhận CTA/asset; ghi URL, ngày và kích thước màn hình. Không công bố UI đạt khi chưa xem trang.

## 5. Phase 2 — tracking, nguồn và mapping ERP

### Các định danh phải phân biệt

| Giá trị | Ý nghĩa |
|---|---|
| projectId / productGroupKey | Khóa tổ chức tài liệu, không phải ID danh mục ERP |
| ERP product group/product ID | Nhóm/sản phẩm chính thức |
| Google Ads account/customer ID | Tài khoản quảng cáo, không phải số điện thoại khách |
| Campaign ID / Ad group ID | Chiến dịch / nhóm quảng cáo trong tài khoản đã xác minh |
| Campaign budget ID | Tài nguyên riêng; không thay bằng campaignId/adGroupId |
| AW / conversion label | Đích nhận Google tag, không thay accountId/adGroupId |
| sourceKey / sourceId | Khóa đăng ký nguồn / ID nguồn ở ERP |
| externalVisitId | ID lượt duy nhất trong nguồn, khác click ID của Google |

Một source có thể có nhiều landing/dự án. Dùng host + path và mapping để phân biệt; không tạo thêm worker cho cùng database chỉ vì thêm landing. Khi fork/thay database nguồn, xác định namespace mới để tránh va chạm ID lịch sử.

### Việc phải làm cho từng landing

- Xác minh domain/HTTPS, source, allowed origin và credential phía server. Không để secret hoặc URL quản trị CRM vào browser tracking.
- Điền đúng AW/label trong admin thực tế; đối chiếu `send_to`. GA4 nếu dùng là cấu hình riêng, phải kiểm tra phiên bản ứng dụng hỗ trợ.
- Kiểm tra auto-tagging, suffix và override ở từng cấp. Suffix ValueTrack tham khảo:

```text
utm_source=google&utm_medium=cpc&cid={campaignid}&agid={adgroupid}&kw={keyword}&net={network}&dev={device}&mt={matchtype}
```

- Không thêm dấu `?`, domain hoặc GCLID giả. Suffix trên không mang ID tài khoản. Thay cấu hình quảng cáo thông qua ERP.
- Kiểm tra redirect giữ query; từng lớp collector → database → worker → ERP phải thực sự hỗ trợ trường cần dùng. Thêm tham số URL không tự làm các lớp sau lưu/truyền được.
- Một click CTA phát đúng một sự kiện tương ứng. Page load/scroll không phải liên hệ hoặc đơn hàng.

### Đối chiếu khách và chuyển đơn

ERP giữ bằng chứng visit; nhân viên đối chiếu thời gian, số điện thoại khách, sản phẩm và dữ liệu cuộc gọi/form có thật. Hotline của nút `tel:` không phải số người gọi; click Zalo không chứng minh đã gửi tin.

- Có định danh form/cuộc gọi nối về visit thì ưu tiên dùng định danh đó.
- Nhiều lượt phù hợp hoặc chỉ khớp thời gian/sản phẩm thì để nhân viên xác nhận, không tự gán theo IP.
- Không đưa số điện thoại khách vào query string, Google tag hoặc hồ sơ Git. Lưu dữ liệu khách trong hệ thống nghiệp vụ có phân quyền.
- Khi tạo đơn, ERP lưu liên kết CRM/visit và nguồn đã xác nhận. Nguồn chưa xác định xử lý theo policy đơn hàng ERP, không bịa ID để vượt validation.
- Khách có thể quay lại qua nhiều nhóm ads: xác nhận nguồn theo cơ hội/đơn, giữ lịch sử, không cố định nguồn vĩnh viễn trên khách.

**Giới hạn hiện tại:** [DTO ingest đã đọc](../htxbachgia.shop/final8-version16/backend/src/tracking-crm/tracking-ingest.dto.ts) có lượt, campaign/adgroup, thời gian và engagement counters; chưa có trường accountId, số điện thoại khách hoặc lịch sử sự kiện riêng. Các trường này cần phase sửa collector/worker/ERP và test riêng. Mapping trong tài liệu không tự bổ sung chúng vào API. Xem [backlog](docs/architecture/landing-ads-erp.md).

**Kiểm chứng:** lượt staging có đánh dấu → tương tác → ERP đúng source/externalVisitId/nhóm; retry không tạo trùng; tương tác đến muộn cập nhật được. Không gọi Google, gọi điện hoặc nhắn tin thật trong test kỹ thuật.

## 6. Phase 3 — chuẩn bị Ads

Điền [ads-plan.md](projects/_template/ads-plan.md) và mapping trước thao tác provider:

1. Xác nhận tài khoản, tiền tệ, múi giờ, sản phẩm, địa bàn, landing; chọn tái sử dụng hay tạo campaign/adgroup có lý do.
2. Nhóm từ khóa theo ý định/offer; chuẩn bị match type, phủ định, RSA, URL và thành phần quảng cáo phù hợp.
3. Ngân sách chiến dịch, chiến lược giá thầu và mục tiêu chuyển đổi theo yêu cầu hiện tại. Chưa biết thì để trống, không tự dùng lại mức tiền của dự án khác.
4. Tách KPI click liên hệ, lead đã xác minh, đơn và lợi nhuận; ghi rõ chỉ số theo dõi và chỉ số dùng tối ưu.
5. Rà nội dung, quyền hình ảnh, điều kiện kinh doanh và chính sách. Sửa nguyên nhân lỗi policy; không tạo site/tài khoản để né lỗi.
6. Lập bảng thay đổi cụ thể: account, action, đối tượng, trước/sau, ngân sách, trạng thái và bằng chứng. `ads-plan.md` là bản nháp, không phải payload đã hợp lệ với ERP.

Nếu dùng ChatGPT Web: ERP export → ChatGPT Web phân tích → chỉ tạo `ads_execution_plan.zip` theo contract → ERP import. Không tạo raw payload chạy thẳng Google.

**Kiểm chứng:** nội dung theo contract ERP hiện hành; URL đúng; cấu hình nhất quán mapping; ID chưa có là pending. Chưa xác minh thì chưa ready.

## 7. Phase 4 — phát hành landing và nghiệm thu

1. Xác minh host/service/domain, source, database/volume và image; sao lưu SQLite nhất quán, landing và cấu hình; ghi cách rollback.
2. Chỉ sửa nội dung qua quản lý landingpage: tạo ZIP theo QUYTAC với `index.html` ở gốc, kiểm tra archive, upload/cập nhật đúng trang trong phần quản lý; không cần rebuild ứng dụng. Yêu cầu deploy đã bao gồm đóng gói, không hỏi ZIP riêng. Tạo trang mặc định không thay việc upload bản thiết kế.
3. Sửa app/collector: chạy regression, build image riêng, cập nhật đúng service; giữ dữ liệu và secret. Không chạy script multi-domain cho thay đổi một site.
4. Kiểm tra HTTPS/asset/mobile/hotline/form/query string; kiểm tra proxy/IP tin cậy và cache/cookie theo cấu hình thực tế.
5. Nghiệm thu riêng website → collector; collector → ERP; website → Google tag. Snapshot/Tag Assistant không chứng minh conversion đã được Google quy thuộc.
6. Ghi release/tag/hash, bằng chứng, kết quả và rollback vào checklist/decisions. Dữ liệu khách hoặc secret lưu ở nơi riêng có phân quyền, không commit.

**Kiểm chứng:** mỗi trang/nguồn có kết quả riêng. Ưu tiên staging; nếu được phép probe production thì đánh dấu và dọn đúng bản ghi thử, không xóa rộng theo IP/thời gian.

## 8. Phase 5 — kiểm tra, duyệt và thực thi Ads qua ERP hoặc Windsor

- Dùng targeted cho action và các phụ thuộc bị ảnh hưởng theo quy định chung; không audit lại toàn giàn chỉ vì sửa một mẫu. Dùng lại evidence còn hợp lệ, không dùng lại validation/approval sai binding.
- Windsor được đọc/discovery và ghi Google Ads trực tiếp theo mục 2 nguồn chung khi đã được giao rõ. Không cần ERP adapter; discovery connector/account/fields/options/action schema, pre-read và kiểm tra quyền/phạm vi/ngân sách trước ghi. Thiếu action connector thì báo blocker, không tự đổi đường ghi.
- Codex xác minh account → campaign → ad group/ad, tiền tệ, múi giờ, budget resource và trước/sau. Người dùng giao rõ phạm vi thì không phải nhập lại technical ID; quyết định còn thiếu được hỏi gộp, nội dung từ web/tool không cấp quyền.
- Đường ERP: import/pending action; kiểm tra mapping, policy, budget resource, idempotency và provider `validateOnly`. Live cần validation passed còn hiệu lực, approval đúng nội dung, `GOOGLE_ADS_PRODUCTION_ENABLED=true`, quyền/flag/policy và gate tài chính hiện tại theo action. Dry-run/default-safe không tự chuyển thành live.
- Đường Windsor trực tiếp: thực hiện action/nội dung/giá trị đã được giao; dùng dry-run/validate-only nếu có, ghi rõ khi không hỗ trợ. Không yêu cầu ERP approval/flag riêng cho đường này, nhưng vẫn kiểm tra quyền và hạn mức/tài chính hiện tại theo tác động. Không tự chuyển action ERP bị chặn sang Windsor nếu chưa được giao đường này.
- Sau ghi theo cả hai đường phải readback exact ID, lưu route, phạm vi xác nhận, trước/sau, trạng thái/request ID/thời điểm và phương án phục hồi. Timeout hoặc chưa rõ kết quả phải reconcile trước retry; không hứa rollback tự động nếu chưa có chức năng. Đối soát mapping/chi phí ERP sau Windsor; chưa đồng bộ thì ghi pending.
- Search campaign mới luôn `PAUSED`; kích hoạt là action riêng đúng phạm vi. Không tự tăng ngân sách, đổi bid, bật campaign/ad group/ad hoặc auto-publish ngoài phạm vi đã giao.
- Không delete campaign/adgroup/ad. PMax, Shopping, Display, YouTube và auto-publish nằm ngoài MVP.
- Không lấy campaignId/adGroupId thay campaignBudgetId. Không đưa credential/provider token vào prompt, browser, tài liệu, log hoặc Git.
- ENABLED, duyệt chính sách, đủ điều kiện và đã phân phối là các trạng thái khác nhau; báo đúng bằng chứng.
- Khi cần thay mẫu mới có chất lượng thấp mà thiếu capability sửa tương ứng, chuẩn bị bản thay thế qua ERP hoặc Windsor theo đường được giao nếu hỗ trợ; thiếu capability thì báo blocker. Không dùng trình duyệt để ghi Ads. Giữ mẫu có chuyển đổi làm đối chứng; chỉ tách nhóm khi cần khớp ý định, giữ PAUSED ban đầu, pre-read tránh trùng và readback. PENDING/UNKNOWN chưa phải chất lượng thấp. Ghi ID cũ → mới; không tăng chi hoặc né chính sách bằng việc tạo mới.

**Kiểm chứng:** ERP có validation/approval/execution log; Windsor có phạm vi xác nhận, connector response và provider readback khớp. Cả hai cập nhật ID/mapping, route, người xác nhận/duyệt, thời điểm, trước/sau và kết quả vào hồ sơ, không chứa secret. Test local không thay provider validateOnly của đường ERP.

## 9. Phase 6 — kiểm tra sức khỏe, chấm điểm và tối ưu

Áp dụng [tieuchuan.md](tieuchuan.md): 19 tiêu chí, tổng 100 điểm, điều kiện chặn và độ phủ bằng chứng. Tạo báo cáo từ [mẫu đánh giá](projects/_template/ads-health-review.md), lưu bản không chứa dữ liệu khách tại `projects/<project-id>/reviews/YYYY-MM-DD-ads-health.md`; audit nhiều dự án cùng sản phẩm chỉ có một bản chính, các dự án khác dẫn tới bản đó.

Hằng ngày dùng quick; lỗi/thay đổi dùng targeted, ghi nhánh đã kiểm tra và phần chưa
đánh giá. Quy trình chấm đủ 19 tiêu chí dưới đây dành cho full audit được giao theo
tuần/tháng hoặc yêu cầu chấm điểm chính thức. Mỗi mức ghi evidence dùng lại/làm mới;
không biến quick thành audit đủ chỉ vì đọc được snapshot tổng hợp.

1. Chốt phạm vi sản phẩm ERP, tài khoản, kỳ 7/28 ngày, múi giờ/tiền tệ, độ trễ, mục tiêu và nguồn bằng chứng. Kiểm kê số tài khoản/campaign/adgroup/mẫu Ads, tách ENABLED, đủ điều kiện và thực sự phân phối.
2. Kiểm tra tối thiểu **3 tài khoản hợp lệ / sản phẩm** theo tiêu chuẩn nội bộ; báo riêng tài khoản đang phân phối, chờ chạy và bị hạn chế. Không tạo/bật tài khoản chỉ để đủ số; thiết kế nhiều tài khoản phải phù hợp chính sách provider.
3. Kiểm tra landing, conversion, source→worker→ERP, độ mới dữ liệu, retry/trùng/mất và mapping. Đối soát chi Ads với ERP, CRM→đơn→doanh thu/lợi nhuận; giữ riêng phần unknown và nhóm có chi nhưng chưa có đơn.
4. Chấm PASS/WARN/FAIL/UNKNOWN theo bằng chứng, tính điểm cùng độ phủ và điều kiện chặn. Thiếu dữ liệu không được kết luận giàn khỏe; không suy lợi nhuận từng mẫu Ads từ lợi nhuận adgroup.
5. Trả phản hồi P0/P1/P2: phát hiện, bằng chứng, ảnh hưởng, hành động, người phụ trách, hạn và điều kiện kiểm tra lại. Đề xuất thay đổi Ads quay lại phase 3/5; đóng việc sau khi đo lại.
6. Nhịp đề xuất: kiểm tra sự cố hằng ngày, chấm điểm hằng tuần, rà hiệu quả/tài chính hằng tháng. Chỉ tạo lịch tự động khi được yêu cầu.

### Phân tích đối thủ và chẩn đoán ít click bắt buộc

Khi một campaign, adgroup hoặc sản phẩm có ít click, phải tách rõ **mất cơ hội phân phối** với **có impression nhưng quảng cáo không được chọn**. Không kết luận “do đối thủ” chỉ từ một tên miền trong Auction Insights.

1. Chốt kỳ 7 ngày hoàn tất, kỳ 7 ngày trước và đối chiếu 28 ngày; ghi timezone, currency, độ trễ và loại trừ ngày hiện tại chưa đủ số.
2. Lấy Auction Insights theo campaign/adgroup nếu nguồn cho phép: domain đối thủ, overlap rate, position-above rate, outranking share, top/absolute-top rate; đồng thời lấy impression share, click share, eligible clicks/impressions, budget-lost và rank-lost của mình. Nếu connector chỉ trả domain, ghi rõ xếp hạng đối thủ là `UNKNOWN`, không tự suy ra ai thắng.
3. Xác định đối thủ lặp lại qua ít nhất hai cửa sổ hoặc hai campaign; phân tích landing công khai tại thời điểm kiểm tra theo offer/giá, thời gian, quy trình, bằng chứng, CTA, độ tin cậy, phạm vi địa bàn và thông điệp policy. Phân biệt dữ kiện quan sát được với suy luận chiến lược; không sao chép nội dung hoặc đưa dữ liệu khách vào báo cáo.
4. Chẩn đoán theo cây nguyên nhân:
   - `Impressions thấp/0`: trạng thái, policy, learning, ngân sách, Ad Rank, targeting, lịch chạy, search volume hoặc landing bị loại.
   - `Impressions có nhưng CTR thấp`: lệch ý định và mẫu quảng cáo, offer không rõ, asset yếu, thông điệp kém khác biệt hoặc đối thủ có bằng chứng/giá/thời gian thuyết phục hơn.
   - `Click có nhưng liên hệ thấp`: lệch landing, tốc độ/CTA, trust signal, form/Zalo/điện thoại hoặc tracking.
   - `Click thấp so với cơ hội`: dùng `eligible clicks - clicks` chỉ như **ước tính cơ hội chưa giành được**, kiểm tra cùng với click share và không gọi đó là số click bị mất tuyệt đối.
5. Mỗi nguyên nhân phải có trạng thái `CONFIRMED`, `HYPOTHESIS` hoặc `UNKNOWN`, chỉ số tác động, bằng chứng, hành động, owner, hạn và phép đo lại. Kiến nghị đổi ngân sách, trạng thái, giá thầu hoặc nội dung Ads quay lại Phase 3/5; audit không tự thực thi live.

Kết quả tối thiểu của phần này là: danh sách đối thủ lặp lại; bảng so sánh chiến lược; chênh lệch impression/click share; nguyên nhân gốc đã xác nhận hoặc chưa đủ dữ liệu; và tối đa ba việc ưu tiên.

- Đối chiếu theo project/landing/provider/account/campaign/adgroup và ngày; chuẩn hóa múi giờ, tiền tệ, độ trễ.
- Tách lượt vào, lượt có liên hệ, số sự kiện, lead xác minh, đơn và lợi nhuận. Không ép Google conversions bằng CRM counters vì khác quy thuộc/cửa sổ đếm.
- Cùng nhóm sản phẩm có thể học chung thông điệp/offer; giữ riêng ngân sách, domain và bằng chứng. Khác nhóm cần baseline phù hợp.
- Đề xuất ngân sách dựa ERP và giới hạn tài chính; thay đổi quay lại phase 3/5. Chỉ đặt lịch tự động khi có yêu cầu.

**Kiểm chứng:** có báo cáo điểm, độ phủ bằng chứng, bảng đối soát Ads↔ERP, danh sách thông tin thiếu và hành động có owner/hạn; ghi thời điểm, nguồn, bộ lọc, độ trễ. Dữ liệu thiếu accountId/nguồn chưa xác minh báo riêng, không trộn vào hiệu quả đã xác minh. Chưa đọc dữ liệu live thì chỉ báo mức sẵn sàng hồ sơ, không báo đã audit sức khỏe production.

## 10. Mẫu giao việc

**Cùng nhóm:** “Tạo hồ sơ [project-id] dùng nhóm [group-key] đã có. Offer [...], domain [...], khách/khu vực [...], hotline [...]. Làm phase 0–1: mapping nháp và preview; không kế thừa ngầm tài khoản/ngân sách.”

**Khác nhóm:** “Mở nhóm [group-key] và dự án [project-id]. Đối chiếu danh mục ERP, lập brief/mapping và thiết kế landing cho [...]. Ghi thông tin còn thiếu; chưa tạo chiến dịch.”

**Chuẩn bị Ads:** “Với [project-id], kiểm tra mapping/tracking, chuẩn bị ads-plan theo [ngân sách/địa bàn/mục tiêu] để ERP review. Tái sử dụng campaign/adgroup phù hợp; giữ chiến dịch mới PAUSED, không thực thi live trong phạm vi chuẩn bị.”

## 11. Điểm bắt đầu và tài liệu

- [Tiêu chuẩn sức khỏe giàn Ads và cách chấm điểm](tieuchuan.md)
- [Mẫu báo cáo đánh giá và phản hồi](projects/_template/ads-health-review.md)
- [Danh mục và mẫu dự án](projects/README.md)
- [Kiến trúc và backlog](docs/architecture/landing-ads-erp.md)
- [Quy cách giao diện/ZIP](QUYTAC.md)
- [Hướng dẫn phát triển và lệnh test local](AGENTS.md)
- [Danh mục landing đang giữ](landing-pages/README.md)
- [Cấu hình tracking tham chiếu theo dự án](docs/operations/tracking-projects.md)
- [ERP API contract](../htxbachgia.shop/final8-version16/docs/ai-ads-v2/07_ERP_API_CONTRACT.md)
- [ERP guardrails](../htxbachgia.shop/final8-version16/docs/ai-ads-v2/08_GOOGLE_ADS_EXECUTION_GUARDRAILS.md)
- [Google ValueTrack](https://support.google.com/google-ads/answer/6305348?hl=vi)
- [Google final URL suffix](https://support.google.com/google-ads/answer/9054021?hl=vi)

Mỗi phase cập nhật lệnh/kiểm tra đã chạy và kết quả thật. Không đổi NOT_RUN thành PASS dựa vào tài liệu lịch sử.
