# Kiểm tra hệ thống hiện tại — 18/09/2026

**Kết luận: CHƯA ĐỦ CƠ SỞ KẾT LUẬN HIỆU QUẢ.** Có dữ liệu live và ba điều kiện không đạt đã xác nhận: nhóm biển vàng không có RSA được duyệt; ERP thiếu chi phí đầu kỳ 28 ngày; cả 5 nhóm có chi chưa được gắn sản phẩm. Không kết luận toàn giàn khỏe hoặc lỗ thực từ điểm số/báo cáo hiện có.

## 1. Phạm vi, nguồn và cách đọc kết quả

- Audit ID: `20260918-current-system`; người kiểm tra: Codex theo yêu cầu chủ dự án. Áp dụng [tieuchuan.md](../../../tieuchuan.md), phiên bản 1.0. Repo không có `tieuchi.md`.
- Dự án: `dichvuvantai-site`, `nghiepvuvantai-com`; mở rộng kiểm kê đến ba tài khoản Google Ads kết nối và final URL đang quan sát được, gồm `www.phuhieuxe247.com`. Chưa có hồ sơ dự án riêng cho domain bổ sung trong danh mục hai dự án này.
- ERP live: `http://192.168.100.236:8107`, đọc API đã xác thực; mốc lấy dữ liệu ERP cuối: **09:48:46 ngày 18/09/2026, UTC+07**. Windsor/HTTP đọc trong khoảng 09:41–09:51. Public ERP `https://htxbachgia.shop/` trả 403; đây không phải bằng chứng ERP nội bộ ngừng hoạt động.
- Kỳ chính: **11–17/09/2026**; kỳ so sánh: **04–10/09/2026**; kỳ đối chiếu: **21/08–17/09/2026**, ngày lịch hoàn tất theo UTC+07. Hai tài khoản có metrics dùng VND, `Asia/Saigon`.
- Metrics là **PROVISIONAL**: chưa có SLA trễ provider được phê duyệt, chưa chốt tuổi cohort/hoàn hủy; không coi conversions Google là lead xác minh hoặc đơn. Không có mục tiêu CPL/CPA/ROI, ngân sách thử và trần chi ERP được xác minh cho sản phẩm.
- Đã dùng lại manifest/mapping, collector Flask, worker ERP, API Tracking CRM, `advertising-cost`, `ad-groups`, `profit-classification`, và connector Windsor **chỉ đọc**. Không đổi Ads, không sync/backfill, không deploy hoặc ghi nghiệp vụ ERP. Đăng nhập API có thể tạo audit đăng nhập thông thường.
- Chưa xác minh image/hash đang triển khai, trạng thái container/worker và ACK nguồn. SSH không thiết lập được kết nối đã xác minh host; không bỏ qua kiểm tra host key. Không chạy script kiểm chứng khởi tạo ERP vì script đó có ghi dữ liệu thử và giả định database mới.

## 2. Kiểm kê Ads và sản phẩm

### Tài khoản

| Account | Tên trả về | Chi 28 ngày (VND) | Impression / click 28 ngày | Conversion Google 28 ngày | Chi 7 ngày (VND) |
|---|---|---:|---:|---:|---:|
| 606-385-9174 | phuhieuxe24h | 2.686.149,52 | 1.760 / 317 | 37 | 776.489,97 |
| 139-673-0688 | Phù hiệu xe nhanh | 2.493.246,24 | 2.366 / 280 | 37,5 | 626.320,00 |
| 895-571-1884 | phuhieuxebachgia | UNKNOWN | Không có dòng metrics trả về | UNKNOWN | UNKNOWN |
| **Tổng phần có dữ liệu** | **2 tài khoản** | **5.179.395,76** | **4.126 / 597** | **74,5** | **1.402.809,97** |

Windsor và lookup ERP cùng thấy **3 tài khoản kết nối**. Tài khoản `895-571-1884` có conversion actions trả về nhưng không có inventory/metrics trong truy vấn kỳ này; không được suy ra bị đình chỉ, mất quyền hoặc chi bằng 0. Chưa kiểm kê đủ quyền quản lý, billing và tính hợp lệ theo từng sản phẩm; **A1 không được PASS chỉ vì có ba tài khoản**.

| Kỳ, phần metrics đã đọc | Chi VND | Impression | Click | Conversion Google |
|---|---:|---:|---:|---:|
| 04–10/09 | 1.010.962,84 | 609 | 124 | 13 |
| 11–17/09 | 1.402.809,97 | 1.202 | 190 | 24 |

Đây là thay đổi đầu phễu, không chứng minh CPA đơn hoặc lợi nhuận cải thiện. Chỉ cộng chi ở cấp adgroup/ngày; truy vấn account/ngày dùng để đối chiếu, không cộng thêm vào tổng.

### Campaign, nhóm và mẫu

Trong dữ liệu trả về có **5 campaign, 5 adgroup và 9 RSA**. Cả 5 campaign/adgroup đều ENABLED tại snapshot. Có 8 RSA ENABLED, 1 PAUSED; policy gồm 5 APPROVED, 2 APPROVED_LIMITED, 2 DISAPPROVED. Cả 9 RSA đều từng có impression trong kỳ 7 và 28 ngày; điều này không có nghĩa cả 9 hiện còn chạy được. Chưa có danh sách dự kiến chạy đã chốt trước kỳ; 5 nhóm active ERP là phạm vi kiểm tra khả năng chạy hiện tại.

| Account / campaign / adgroup | RSA trả về | Snapshot policy / strength | Nhận xét |
|---|---:|---|---|
| 6063859174 / 23973785460 / 195094600782 | 3 | 3 APPROVED; 2 AVERAGE, 1 POOR | Final URL `https://www.phuhieuxe247.com/` |
| 1396730688 / 23942905658 / 198265694580 | 2 | 1 APPROVED/POOR; 1 APPROVED_LIMITED/AVERAGE | Final URL `https://nghiepvuvantai.com/` |
| 1396730688 / 24254559545 / 205916274371 | 1 | APPROVED_LIMITED/EXCELLENT | Final URL `/landing/dich-vu-lam-phu-hieu-xe` |
| 1396730688 / 24260304694 / 200097790053 | 2 | **Cả 2 DISAPPROVED/GOOD** | Một mẫu PAUSED, một ENABLED; **không có RSA được duyệt trong nhóm** |
| 1396730688 / 24260305588 / 198932089863 | 1 | APPROVED/GOOD | Final URL `/landing/the-nhan-dang-lai-xe-rfid` |

Policy topic trả về cho 2 mẫu bị từ chối và 2 mẫu bị hạn chế: `GOVERNMENT_DOCUMENTS_AND_OFFICIAL_SERVICES`, loại `FULLY_LIMITED`. RSA biển vàng: `824751757659` (PAUSED), `824935137323` (ENABLED). Nhóm biển vàng đã chi **94.104 VND ngày 16/09** và ghi 0 conversions trong metrics được đọc; chưa đủ mẫu/tuổi cohort để kết luận hiệu quả riêng nhóm.

Đây là lỗi khả năng chạy đã xác nhận, ưu tiên P1. Chưa có bằng chứng đình chỉ tài khoản hay vi phạm nghiêm trọng đủ áp điều kiện P0. Việc landing có tuyên bố dịch vụ hỗ trợ không tự bảo đảm provider sẽ duyệt; cần xử lý qua luồng ERP và kiểm tra readback.

### Mapping sản phẩm

API `/api/ad-groups` trả cả 5 nhóm với `productCategoryId=null`, `selectedProducts=[]`; `dailyBudget` và `campaignBudgetId` cũng chưa có trên các bản ghi này. Không dùng tên campaign “60k/80k” làm ngân sách hiện hành.

ERP có danh mục sản phẩm thật, ví dụ:

| Sản phẩm danh mục | ERP product ID | ERP category ID | Mapping vào nhóm Ads |
|---|---|---|---|
| Bộ biển vàng | 6aa4b5188340c83bc0b37da5 | 6aa13a4572f3e6e569416688 | Chưa gắn; không tự suy từ tên adgroup |
| Thẻ lái xe | 6aa13a4572f3e6e5694166c8 | 6aa13a4572f3e6e56941668c | Chưa gắn |
| GPKDVT | 6aa13a4572f3e6e5694166c3 | 6aa13a4572f3e6e569416694 | Chưa gắn |
| Phù hiệu xe trực tiếp | 6aa3d64eb030cec458f27203 | 6aa13a4572f3e6e569416688 | Chưa gắn; còn các sản phẩm kỳ hạn 1–7 năm |

`Bộ biển vàng` hiện thuộc category ERP “Phù hiệu xe”; group-key tài liệu `bien-vang` không thay thế category ID. Chưa thể chấm độ phủ ≥3 account/sản phẩm hoặc phân bổ toàn bộ chi theo sản phẩm. **Toàn bộ 5.179.395,76 VND chi đã đọc còn ở phần chưa xác minh quy thuộc sản phẩm trong audit này.**

## 3. Đối soát Ads ↔ ERP

Đọc `/api/advertising-cost?channel=google`, lọc ngày 21/08–17/09 tại client vì route local không hỗ trợ bộ lọc ngày. Khóa đối chiếu: account chuẩn hóa + ngày + adgroup; không ghép bằng adgroup trần. Giá trị `date` chi phí là nhãn ngày lưu ở UTC midnight, so với ngày provider cùng nhãn; không dịch nhãn ngày thêm 7 giờ.

| Account | Ads 28 ngày | ERP cùng ngày | ERP − Ads | Lệch % |
|---|---:|---:|---:|---:|
| 1396730688 | 2.493.246,24 | 950.579,00 | −1.542.667,24 | −61,87% |
| 6063859174 | 2.686.149,52 | 1.463.193,81 | −1.222.955,71 | −45,53% |
| **Tổng phần đã đọc** | **5.179.395,76** | **2.413.772,81** | **−2.765.622,95** | **−53,40%** |

- Ads có **44 dòng adgroup/ngày** có dữ liệu. ERP có **24 dòng**, từ 04–17/09. Cả 24 dòng chung đều khớp chi trong sai số làm tròn dưới 0,01 VND; không có bù chéo sai lệch.
- **Thiếu 20 dòng của 21/08–03/09**, tổng 2.765.622,95 VND. Đây là thiếu dữ liệu đầu kỳ, không phải chênh lệch của những dòng đã sync. Chưa thực hiện backfill.
- Trong **11–17/09**, hai account lần lượt khớp **626.320,00** và **776.489,97 VND**. Điều này chưa làm F3 PASS toàn kỳ vì thiếu đầu kỳ và trạng thái account/ngày của tài khoản thứ ba chưa rõ.
- `providerFetchedAt` mới nhất của chi ERP: **18/09 lúc 06:00:35 UTC+07**, khoảng 3 giờ 48 phút trước mốc audit; nằm trong 24 giờ. Các Ads options có `lastSeenAt` cùng đợt. `/google-ads/sync/runs/latest` trả rỗng, không dùng riêng route này để kết luận Windsor không sync.

### CRM và liên kết nguồn

Đọc đủ **455/455 lượt** qua 5 trang API Tracking CRM, theo ngày visit UTC+07. Chỉ lưu số tổng hợp; không lưu IP, số khách, tên khách, externalVisitId hoặc payload cá nhân.

| Chỉ số ERP trong phạm vi visit | 28 ngày | 7 ngày |
|---|---:|---:|
| Lượt | 455 | 186 |
| Có adGroupId thô | 388 | 128 |
| Có accountId trong visit | **0** | **0** |
| Có sản phẩm ở hồ sơ liên kết | **0** | **0** |
| Lượt có contact/form counters | 28 | 14 |
| Contact actions cộng dồn | 40 | 19 |
| Form submits | 0 | 0 |
| Hồ sơ lead đã tạo | 13 | 11 |
| Hồ sơ status confirmed / matchConfidence verified | **0 / 0** | **0 / 0** |
| Đơn liên kết từ các hồ sơ này | **0** | **0** |
| Hồ sơ có assignedTo | 0 | 0 |
| Trùng khóa source + externalVisitId trong dữ liệu ERP đã đọc | 0 | 0 |

Hai source đang enabled: `nghiepvuvantai.com` có 452 lượt; `dichvuvantai.site` có 3 lượt. Chưa có bằng chứng loại các probe lịch sử khỏi tập này, nên không gọi toàn bộ là khách thật. Không lấy 455 visit chia cho 597 click Google để đo F1: phạm vi source khác nhau, `phuhieuxe247.com` chưa thấy trong hai source, một click không tương đương một visit.

Không có accountId trong visit và không có mapping sản phẩm khiến luồng hiện tại chưa đáp ứng G1. 388 adGroupId thô có thể hỗ trợ đối chiếu, nhưng chưa chứng minh account/sản phẩm lịch sử đã xác minh. Không tự gán account từ domain/AW hoặc gán khách theo IP.

`latestObserved` trong tập visit kỳ này là 17/09 lúc 16:46:02 UTC+07. Đây là thời điểm bản ghi mới nhất được quan sát **trong tập đã lọc**, không phải heartbeat worker; không thể dùng để kết luận sync bị chậm nhiều giờ. F1 cần mẫu số nguồn, timestamp cập nhật, ACK và đo p95/backlog thực tế.

### Vì sao chưa kết luận lợi nhuận

Endpoint `/api/ads/ad-groups/profit-classification?days=28` dùng cửa sổ trượt **21/08 09:48–18/09 09:48 UTC+07**, khác cửa sổ ngày lịch của audit. Nó báo 5 nhóm `loss`, 0 đơn hoàn tất, 0 doanh thu; tổng `netProfitAfterAds` **−2.413.772,81 VND**, ROI −100%. `dataQuality` trả `syncOk=true`, `tokenIssues=0`, `attributionCoverage=0` và không có notes.

**Đó là kết quả tính trên dữ liệu ERP hiện có, chưa phải lỗ kinh doanh đã kiểm chứng.** Chi ERP thiếu đầu kỳ, CRM chưa có đơn liên kết, chưa chốt cohort/hoàn hủy/tiền thu và mục tiêu ROI. Mã local của báo cáo tự xếp `loss` khi có spend nhưng không có performance/đơn hoàn tất; nó không đợi xác minh độ đầy đủ chi và nguồn đơn.

Ngoài ra, trường `leads` của báo cáo lấy nguồn `chatmessages`/conversation metric, không đếm trực tiếp Tracking CRM leads. Vì vậy `leads=0` không phủ nhận 13 hồ sơ CRM đã tạo. 13 hồ sơ này cũng chưa phải 13 lead xác minh. CPL/CPA/ROAS/ROI thực theo sản phẩm và tỷ trọng chi nhóm lỗ đủ căn cứ: **UNKNOWN**.

## 4. Landing, tracking và kiểm thử

- Kiểm tra HTTPS GET của **9 URL**, gồm 6 URL trong mapping và 3 URL bổ sung từ inventory Ads; cả 9 trả 200. Kiểm tra **57 tham chiếu asset cùng host, tính theo từng trang**, đều trả 200. Chỉ kiểm tra tài nguyên tham chiếu trực tiếp trong HTML, chưa bao phủ CSS URL lồng, CDN và asset tải động.
- Hotline/Zalo trên 4 trang `dichvuvantai.site` khớp manifest dự án; 4 trang `nghiepvuvantai.com` dùng biến thể riêng đúng manifest. `phuhieuxe247.com` có biến thể riêng, chưa có manifest tương ứng để xác minh nghiệp vụ. Không trộn hotline giữa dự án.
- AW quan sát trong HTML: `AW-16886013209` tại dichvuvantai, `AW-16690861047` tại nghiepvuvantai. Không thấy chuỗi AW trong HTML trả về của phuhieuxe247; **chưa kết luận thiếu tracking** vì tag có thể nạp động. Chưa thử click CTA hoặc conversion thật.
- Đã xem DOM và ảnh viewport **1265×712** của landing biển vàng nghiepvuvantai: trang hiển thị, có CTA cố định, tuyên bố dịch vụ hỗ trợ và đường dẫn dịch vụ công. Chưa nghiệm thu mobile, mọi form, tốc độ so baseline, consent/tag và console toàn bộ trang; **D1/E1 vẫn UNKNOWN**.
- Conversion actions ENABLED đọc được: account 606 có 2 CONTACT primary, ONE_PER_CLICK, cửa sổ 90 ngày; account 139 tương tự; account 895 có hai click gọi/Zalo primary ONE_PER_CLICK 30 ngày và một CONTACT primary MANY_PER_CLICK 30 ngày. Chưa chứng minh campaign dùng đúng goal hoặc có đếm trùng, chưa đối chiếu label/send_to với event thực. Không tính action REMOVED/HIDDEN là cấu hình tối ưu đang dùng.
- Cả hai manifest và CSV đọc được, mappingKey không trùng. **6/6 dòng mapping lịch sử chưa verified**, thiếu product/campaign/adgroup ID; hồ sơ Ads còn DRAFT. Kiểm tra 7 source landing thấy đủ asset HTML trực tiếp; `node --check` **12/12 file JS PASS**.
- Flask regression: **7/7 PASS**, database tạm. Worker ERP `test-tracking-worker.py`: **3/3 PASS**, gồm retry và tương tác muộn với nguồn/ACK tạm và mocked sender. Chưa phải test khôi phục production hoặc cả hai worker deployed.
- Mã local ingest/worker chưa truyền accountId, số khách hay lịch sử event; schema ERP có trường accountId không đồng nghĩa DTO đã nhận. Ingest có unique source+visit, transaction và cập nhật engagement mới hơn; chưa xác minh index/phiên bản deployed bằng phép thử database.

## 5. Bảng 19 tiêu chí

Đây là **bảng kiểm chung của phạm vi hiện trạng đã đọc**, chưa phải điểm từng sản phẩm ERP: nhóm Ads chưa mapping sản phẩm nên không được gán điểm/chi vào từng product ID. FAIL chỉ cho điều kiện không đạt có bằng chứng; UNKNOWN không có nghĩa hệ thống thực tế đã hỏng.

| Mã | Trọng số | Kết quả | Bằng chứng và giới hạn |
|---|---:|---|---|
| A1 | 5 | UNKNOWN | 3 account kết nối; chưa đủ danh sách hợp lệ theo mỗi sản phẩm, billing/quyền/policy chưa chốt |
| A2 | 5 | UNKNOWN | Đọc được dữ liệu không chứng minh đủ quyền, bảo vệ, billing và phương án gián đoạn |
| B1 | 5 | UNKNOWN | Ads-plan còn DRAFT; chưa rà đủ keyword/phủ định/vùng/lịch/ý định |
| C1 | 5 | FAIL | Trong 5 nhóm hiện active, biển vàng không có RSA được duyệt. Cả 5 có impression trong kỳ; chưa có roster dự kiến trước kỳ |
| C2 | 5 | UNKNOWN | 2 POOR, 3 AVERAGE, 3 GOOD, 1 EXCELLENT; chưa đủ review offer/assets và kế hoạch thử/ngân sách |
| D1 | 5 | UNKNOWN | 9 URL và 57 tham chiếu asset HTTP đạt; chưa đủ mobile/form/baseline/tất cả luồng liên hệ |
| E1 | 5 | UNKNOWN | AW đọc được ở hai domain; chưa thử mỗi tương tác một event và đúng send_to/redirect |
| E2 | 5 | UNKNOWN | Đã đọc primary/count/window; chưa chứng minh goal phù hợp và conversion quy thuộc/không trùng |
| F1 | 5 | UNKNOWN | Có 455 ERP visits; thiếu mẫu số nguồn, ACK, p95 và backlog |
| F2 | 5 | UNKNOWN | 0 duplicate ERP; test worker retry/muộn đạt; chưa thử phục hồi/đầy đủ production |
| F3 | 5 | FAIL | Thiếu 20 dòng chi đầu kỳ, 2.765.622,95 VND; 24 dòng chung khớp, kỳ 7 ngày khớp phần có dữ liệu |
| G1 | 5 | FAIL | 5/5 nhóm chi chưa mapping sản phẩm; 0/455 visits có accountId, không có mapping lịch sử đã xác minh thay thế |
| G2 | 5 | UNKNOWN | 13 hồ sơ, 0 verified, 0 đơn liên kết; không có mẫu lead xác minh để tính SLA/95%, cần rà tồn |
| H1 | 10 | UNKNOWN | ERP báo −2,414 triệu nhưng dữ liệu chi/nguồn/cohort chưa đủ, thiếu mục tiêu ROI |
| H2 | 5 | UNKNOWN | Chưa có lead xác minh/đơn đủ căn cứ và mục tiêu CPL/CPA; conversion Google không thay được |
| H3 | 5 | UNKNOWN | Phân loại 5 loss của ERP chưa đủ tin cậy; chưa có ngân sách thử và tuổi cohort |
| I1 | 5 | UNKNOWN | Chưa xác minh ngân sách thật, budget ID, trần chi và tiền khả dụng; metadata ERP đang trống |
| I2 | 5 | UNKNOWN | Hai account có metrics chiếm khoảng 51,86%/48,14% chi 28 ngày; thiếu account thứ ba, phân bổ sản phẩm và lead/ROI |
| J1 | 5 | UNKNOWN | Đã thấy 2 DISAPPROVED, 2 APPROVED_LIMITED; chưa đọc approval/execution audit, mức nghiêm trọng và owner xử lý |

**W=100, K=15, E=0**: 3 FAIL, 16 UNKNOWN; độ phủ tiêu chí đủ căn cứ kết luận **15%**; điểm phần đã kiểm chứng **0/100**; điểm bảo đảm **0/100**, khoảng khả dĩ **0–85**. Các số 0 này phản ánh chỉ kiểm chứng trọn điều kiện không đạt, **không phải điểm hiệu quả thực của 85% chưa đo**. Bằng chứng từng phần của UNKNOWN không cộng vào K.

Không xếp loại “nguy cơ cao/yếu/khỏe” từ cận dưới khi độ phủ chưa đủ 90%. Điều kiện chặn hiệu quả đã có: thiếu chi, thiếu mapping và chưa đủ quy thuộc CRM/đơn. Chưa xác nhận sự cố P0.

## 6. Ba việc ưu tiên và nghiệm thu

Vai trò/hạn dưới đây là đề xuất, chưa phải cá nhân đã nhận việc. Không tự tạo lịch, gửi thông báo người khác hoặc thay đổi Ads.

| Ưu tiên / tiêu chí | Hành động và lý do | Owner đề xuất | Hạn đề xuất | Điều kiện kiểm tra lại |
|---|---|---|---|---|
| P1 / C1, C2, J1 | Rà topic Government Documents của hai RSA biển vàng và hai RSA hạn chế; xác minh phạm vi dịch vụ/điều kiện provider, chuẩn bị phương án nội dung hoặc xử lý xét duyệt qua ERP | Phụ trách Google Ads + người duyệt ERP; CHƯA PHÂN CÔNG | Lập phương án trước 21/09/2026 | Nhóm dự kiến chạy có ≥1 RSA đủ điều kiện, readback policy; nếu chủ đích dừng thì cập nhật roster có lý do, không coi ENABLED là đã chạy |
| P1 / F3, H1–H3 | Chuẩn bị backfill đúng 20 dòng 21/08–03/09 qua ERP; bổ sung cảnh báo kỳ thiếu dữ liệu, định nghĩa leads và cửa sổ ngày cho báo cáo lợi nhuận | Kỹ thuật ERP + tài chính; CHƯA PHÂN CÔNG | Lập phương án trước 21/09/2026, chốt hạn sửa theo phụ thuộc | Đối soát từng account/ngày ≤1% và ≤10.000 VND; đủ trạng thái ngày/account; không đánh lỗ chắc chắn từ dữ liệu chưa đầy đủ |
| P1 / A1, F1–F2, G1–G2 | Xác minh mapping 5 nhóm vào product ID thật; đối chiếu 13 hồ sơ và phân công chăm sóc; xác minh source cho phuhieuxe247, đo nguồn/ACK/p95 và căn cứ nhận diện account. Hoàn thiện quyền/billing để đánh giá 3 account/sản phẩm | Chủ sản phẩm + CRM + kỹ thuật tracking; CHƯA PHÂN CÔNG | Lập phương án trước 21/09/2026 | 100% đối tượng chi có mapping duy nhất; paid visit nhận diện ≥95%; lead/đơn nguồn ≥95% khi có mẫu; SLA ≥90%; nguồn→ERP ≥99%, p95 ≤15 phút, không tồn >60 phút chưa xử lý |

Kiểm tra lại đề xuất **21/09/2026**, hoặc ngay sau khi có bằng chứng sửa/backfill. P2 về mobile/tốc độ và thử thông điệp đưa vào kế hoạch sau khi owner chốt phạm vi. Chưa có hạng mục nào được đánh dấu đã sửa.

## 7. Hồ sơ bằng chứng và kiểm chứng báo cáo

Bằng chứng aggregate cục bộ nằm trong `projects/dichvuvantai-site/artifacts/` (Git ignore):

- `health-audit-20260918-ads.json`: field/query scope, inventory, metrics ngày, policy, conversion configuration; không chứa dữ liệu khách.
- `health-audit-20260918-erp.json`: dữ liệu danh mục, tổng CRM đã ẩn định danh khách, chi phí và kết quả profit API.
- `health-audit-20260918-erp-groups.json`: metadata mapping/nhóm Ads trả về từ ERP.
- `health-audit-20260918-reconciliation.json`: 24 dòng khớp, 20 dòng thiếu, chi tiết account/ngày/adgroup.
- `health-audit-20260918-checks.json`, `health-audit-20260918-live-pages.json`: kiểm tra local và HTTP công khai.
- `read-erp-health.ps1`: script đọc API và chỉ xuất aggregate; lấy credential đã lưu vào bộ nhớ, không chứa secret. Không chạy ngoài phạm vi audit nếu chưa kiểm tra lại môi trường.

Các tài liệu nguồn: [mapping dichvuvantai](../mapping.csv), [mapping nghiepvuvantai](../../nghiepvuvantai-com/mapping.csv), [ranh giới collector/ERP](../../../docs/architecture/landing-ads-erp.md), [baseline hồ sơ trước audit live](../../../docs/operations/ads-health-baseline-20260918.md). Audit này bổ sung bằng chứng live, không thay đổi sự kiện lịch sử trong baseline.
