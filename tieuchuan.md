# Tiêu chuẩn đánh giá sức khỏe giàn Ads

Phiên bản 1.3 — 27/09/2026. Áp dụng trong [Phase 6 của quy trình](quytrinh.md), theo từng **sản phẩm ERP**, sau đó tổng hợp toàn giàn. Đây là tiêu chuẩn kiểm tra, chấm điểm và phản hồi; chưa phải chức năng tự động trong ERP. Dùng [mẫu báo cáo](projects/_template/ads-health-review.md).

Quyền và ba mức kiểm tra theo [nguồn chung ERP–Ladifinal](../htxbachgia.shop/final8-version16/docs/operations/shared-operating-policy.md).
Hằng ngày dùng quick; thay đổi/lỗi dùng targeted; audit/chấm điểm chính thức dùng
full với đủ 19 tiêu chí áp dụng. Giữ nguyên số tiêu chí, trọng số và ngưỡng; J1 và
điều kiện chặn về quyền được làm rõ theo đường ERP/Windsor đã chọn. Kiểm tra nhanh
không tự cho điểm toàn giàn hoặc cấp quyền thực thi Ads.

## 1. Thế nào là một giàn Ads khỏe?

Giàn khỏe có đủ tài khoản hợp lệ và độ phủ nhu cầu; quảng cáo thực sự phân phối; landing nhận liên hệ tốt; dữ liệu theo được từ quảng cáo đến CRM/đơn; lợi nhuận sau Ads đạt mục tiêu; ngân sách có kiểm soát và lỗi có người xử lý. Nhiều tài khoản, nhiều mẫu Ads, CTR cao hoặc nhiều conversion riêng lẻ chưa đủ chứng minh khỏe.

Tái sử dụng `project.json`, `mapping.csv`, `ads-plan.md`, checklist dự án, collector/worker hiện có và các module ERP `google-ads`, `tracking-crm`, `ad-group-profit-report`. ERP `htxbachgia.shop` là nơi đối chiếu nghiệp vụ và validate/approve/execute action đi đường ERP. Google Ads có ngoại lệ Codex/Windsor trực tiếp theo mục 2 nguồn chung; evidence xác nhận/pre-read/readback thay hồ sơ approval ERP cho riêng đường này.

## 2. Phạm vi và cách đếm

- Chốt sản phẩm bằng `erpProductId`; giữ `erpProductGroupId` riêng. Chưa có ID thì chưa kết luận độ phủ theo sản phẩm từ group-key/domain.
- Kiểm kê toàn bộ tài khoản liên quan, kể cả paused, bị hạn chế và chưa có chi tiêu; chấm khả năng phân phối trên danh sách **dự kiến chạy** đã chốt trước kỳ. Campaign paused có chủ đích không bị coi là lỗi chạy.
- Khóa tài khoản: `provider + adsAccountId`; campaign/adgroup/ad phải kèm tài khoản và quan hệ cha. Không đếm MCC, AW/label, dòng mapping hoặc domain như tài khoản quảng cáo.
- Cùng tài khoản phục vụ nhiều sản phẩm: được tính một lần cho mỗi sản phẩm có mapping riêng đã xác minh; tổng toàn giàn lấy hợp các tài khoản, không cộng lặp. Shared budget đếm một lần theo account + campaignBudgetId.
- Một mẫu RSA được đếm theo ad ID, không theo số headline hay tổ hợp nội dung. Không cộng số campaign với số adgroup/mẫu Ads thành một chỉ số “số Ads”.
- Báo riêng số **tồn tại → ENABLED → đủ điều kiện → có impression trong kỳ → có click/chi tiêu → có lead xác minh → có đơn → có lãi**. “Có phân phối” nghĩa là impression > 0 trong kỳ; trạng thái ENABLED một mình chưa chứng minh điều này.
- Snapshot trạng thái hiện tại và hoạt động trong kỳ là hai cột riêng: mẫu vừa paused vẫn có thể đã phân phối trong kỳ.
- Tổng hợp chi phí từ đúng một cấp dữ liệu (ví dụ ad_group); không cộng đồng thời campaign + ad_group + ad + keyword. Chi phí chưa phân bổ cho sản phẩm phải nằm ở dòng riêng và vẫn được tính vào tổng giàn.

### Yêu cầu tối thiểu 3 tài khoản / 1 sản phẩm

Đây là **yêu cầu nội bộ của chủ dự án**, không phải yêu cầu của Google. Mỗi sản phẩm cần ít nhất **3 tài khoản quảng cáo khác nhau, đã xác minh quyền quản lý, thanh toán, mapping sản phẩm và đủ điều kiện sử dụng theo chính sách**. Có tài khoản trên danh sách nhưng chưa kiểm tra quyền/billing/policy thì chưa tính đạt. Báo thêm số tài khoản thực sự phân phối trong 7/28 ngày; tài khoản chờ chạy có lý do và người phụ trách riêng.

Không bắt buộc bật đồng thời cả 3 để đạt số lượng. Không tạo tài khoản/domain để né đình chỉ hoặc nhân bản cùng offer nhằm chiếm vị trí quảng cáo. Phân vùng địa bàn/offer chỉ là thiết kế cần được kiểm tra, không tự bảo đảm tuân thủ. Google cấm tìm lợi thế đấu giá không công bằng, bao gồm cố hiển thị nhiều quảng cáo của cùng doanh nghiệp tại một vị trí quảng cáo; xem [Unfair advantage](https://support.google.com/adspolicy/answer/15936768) và [Abusing the ad network](https://support.google.com/adspolicy/answer/6020954?hl=en), đối chiếu ngày 18/09/2026.

Nếu chỉ có 1–2 tài khoản hợp lệ: A1 chưa đạt, nêu thiếu bao nhiêu và phương án phù hợp; không tự mở/bật tài khoản cho đủ chỉ tiêu. Nếu chưa đủ bằng chứng về danh sách đầy đủ: A1 là UNKNOWN, không khẳng định sản phẩm thực tế chỉ có 1–2 tài khoản.

## 3. Bằng chứng và cửa sổ đánh giá

Mỗi lần kiểm tra ghi audit ID, người kiểm tra, sản phẩm/dự án/tài khoản, môi trường, mốc chốt số, múi giờ, tiền tệ, phạm vi ngày và phiên bản ngưỡng. Ghi cả tài khoản không đọc được; không loại khỏi phạm vi để tăng điểm.

- **Hằng ngày:** kiểm tra sự cố landing, billing/policy, chi tiêu bất thường, đồng bộ và tồn lead.
- **Hằng tuần:** chấm điểm, xem 7 ngày hoàn tất và so với 7 ngày trước; đối chiếu thêm 28 ngày để tránh kết luận từ một ngày.
- **Hằng tháng:** kiểm tra hiệu quả theo sản phẩm, biên lợi nhuận, hoàn/hủy, mức phụ thuộc tài khoản, chất lượng mapping và quyền quản lý.
- Đơn có chu kỳ chốt dài: thêm cohort theo ngày nhận lead/click với thời gian trưởng thành đã thống nhất. Báo cáo theo ngày đơn phục vụ vận hành, không mặc nhiên là ROAS của cohort click cùng ngày.
- Trừ khoảng trễ báo cáo đã đo/đã quy định trước khi gọi số liệu là hoàn tất. Dữ liệu mới, attribution chưa chốt hoặc không đủ mẫu ghi `PROVISIONAL`/UNKNOWN; không suy ra “0 đơn” từ thiếu dữ liệu.
- Mỗi bằng chứng có nguồn, thời điểm lấy, bộ lọc, cấp tổng hợp và mức đầy đủ. Bằng chứng cũ ngoài SLA không dùng để PASS hiện tại. Export chỉ chứa dữ liệu tổng hợp cần thiết, không chứa token/điện thoại khách/IP/payload khách trong Git hoặc báo cáo.

Lịch trên là nhịp vận hành đề xuất, không tự tạo automation. Ngưỡng số dưới đây là **mặc định nội bộ cho lần audit đầu**, không phải chuẩn ngành hoặc cấu hình live. Ghi điều chỉnh có lý do trong `decisions.md` trước kỳ đánh giá; không đổi ngưỡng sau khi thấy kết quả để làm đẹp điểm. CPA/ROAS/ROI, trần chi và ngân sách thử phải lấy mục tiêu được duyệt riêng của sản phẩm.

## 3.1. Phân tích đối thủ và nguyên nhân chuyên sâu của ít click

Đây là phần bắt buộc khi campaign/adgroup có click thấp, giảm click bất thường hoặc mất impression share. Mục tiêu là xác định click thấp do **không đủ cơ hội**, **không thắng phiên đấu giá**, **mẫu quảng cáo không hấp dẫn** hay **tracking/landing không ghi nhận đúng**.

### Phạm vi và dữ liệu tối thiểu

- Dùng kỳ 7 ngày hoàn tất, kỳ 7 ngày trước và đối chiếu 28 ngày; ghi rõ timezone, currency, độ trễ, ngày chưa chốt và mục tiêu đã duyệt.
- Ở cấp campaign/adgroup, lấy tối thiểu: impressions, clicks, CTR, CPC, spend, conversions theo định nghĩa provider, search impression share, search click share, eligible clicks/impressions, budget-lost impression share, rank-lost impression share, top/absolute-top share, status, serving status, policy reason, learning/bidding status.
- Ở Auction Insights, lấy nếu nguồn cho phép: domain/display name, overlap rate, position-above rate, outranking share, top-of-page rate, absolute-top rate và kỳ áp dụng. Nếu nguồn chỉ trả domain, vẫn ghi domain nhưng các kết luận về thứ hạng, mức chồng lấp hoặc đối thủ thắng phải là `UNKNOWN`.
- Không cộng click/impression của campaign, adgroup, ad và keyword chồng lên nhau. Không dùng ngày hiện tại chưa đủ số để kết luận giảm click.

### Cách xác định đối thủ đáng phân tích

Một domain được gọi là **đối thủ lặp lại** khi xuất hiện trong ít nhất hai cửa sổ so sánh, hai campaign cùng offer hoặc có thêm bằng chứng tìm kiếm/landing công khai. Bảng phân tích phải có:

| Nhóm | Nội dung cần ghi | Không được suy ra |
|---|---|---|
| Auction | Domain, campaign, cửa sổ, impression share của mình, overlap/position-above/outranking nếu có | Domain xuất hiện một lần = đối thủ mạnh nhất |
| Offer | Giá/phí, thời gian, phạm vi, điều kiện, bảo hành/hoàn phí nếu công khai | Giá hoặc cam kết không có bằng chứng |
| Message | Hook, keyword, lợi ích, cảnh báo rủi ro, CTA, trust signal | Hiệu quả doanh thu từ nội dung landing |
| Landing | URL, heading, quy trình, form/Zalo/điện thoại, tốc độ và trạng thái truy cập tại thời điểm kiểm tra | Thứ hạng quảng cáo hoặc conversion rate của đối thủ |
| Policy | Cách diễn đạt tư vấn/hỗ trợ, phân biệt với cơ quan cấp phép, cảnh báo nội dung nhạy cảm | Đối thủ được duyệt policy chỉ vì vẫn thấy trên web |

Chỉ sử dụng thông tin công khai, ghi ngày/giờ và URL; không đăng nhập, không thu thập PII, không sao chép nguyên văn để đưa vào quảng cáo. Tách `OBSERVED_FACT`, `INFERENCE` và `UNKNOWN` trong báo cáo.

### Cây chẩn đoán click thấp

| Tình trạng | Nguyên nhân cần kiểm tra | Bằng chứng xác nhận |
|---|---|---|
| Impression thấp hoặc bằng 0 | Campaign/ad bị pause, policy, learning, ngân sách, Ad Rank, target/lịch chạy, search volume, landing không đủ điều kiện | Status/serving/policy, budget-lost, rank-lost, daily trend, search eligibility, readback provider |
| Impression có nhưng CTR thấp | Query không đúng ý định, headline/offer yếu, thiếu giá/thời gian/bằng chứng, asset kém, đối thủ nổi bật hơn | CTR theo query/device/geo, ad text/assets, Auction Insights, landing/message match |
| Click có nhưng liên hệ thấp | CTA khó thấy, landing chậm/lệch lời hứa, thiếu trust signal, form/Zalo/điện thoại lỗi, event không ghi nhận | Probe mobile/desktop, console/network, event log, CTA-to-lead funnel |
| Click thấp so với cơ hội | Search click share thấp, eligible clicks cao, ngân sách/rank mất impression, hoặc kỳ so sánh sai | `eligible clicks - clicks` chỉ là ước tính; đối chiếu click share, impression share, budget/rank loss và kỳ đầy đủ |

Nguyên nhân phải ghi một trong ba trạng thái: `CONFIRMED` (có bằng chứng trực tiếp), `HYPOTHESIS` (có dấu hiệu nhưng cần thử) hoặc `UNKNOWN` (chưa đủ dữ liệu). Mỗi dòng cần impact, owner, hạn và phép đo lại. Không dùng “đối thủ cạnh tranh” làm nguyên nhân gốc nếu chưa loại trừ policy, ngân sách, Ad Rank, search volume, tracking và landing.

### Điều kiện kết luận

Audit chỉ được kết luận “mất nhiều click do đối thủ” khi có đồng thời: (1) click/impression share giảm so với kỳ đầy đủ; (2) Auction Insights có bằng chứng cạnh tranh phù hợp; (3) đã loại trừ hoặc định lượng phần mất do ngân sách, rank, policy, targeting và tracking. Nếu connector thiếu chỉ số đối thủ, kết luận tối đa là “có domain cạnh tranh xuất hiện, chưa xác định vị trí/thắng thua”.

Kiến nghị đổi ngân sách, trạng thái, bidding, keyword, RSA hoặc landing phải quay lại Phase 3/5 và ERP validate/approve/execute; tiêu chuẩn này chỉ tạo chẩn đoán và kế hoạch kiểm tra lại.

## 4. Bảng tiêu chí — 100 điểm

PASS khi đạt toàn bộ điều kiện của dòng; WARN khi đã có đủ bằng chứng và chỉ có thiếu sót một phần không nghiêm trọng, phải ghi rõ phần đạt/chưa đạt; FAIL khi không đạt điều kiện chính hoặc có lỗi nghiêm trọng; UNKNOWN khi thiếu bằng chứng. Không chấm WARN thay cho thiếu dữ liệu.

| Mã | Tiêu chí | Điểm | Điều kiện PASS và bằng chứng cần kiểm tra |
|---|---|---:|---|
| A1 | Độ phủ tài khoản theo sản phẩm | 5 | ≥3 tài khoản hợp lệ theo mục 2; danh sách có account ID, ERP product ID, chủ quản, phạm vi và lần xác minh gần nhất. Dưới 3 là FAIL khi đã kiểm kê đủ. |
| A2 | Quyền quản lý và khả năng tiếp tục vận hành | 5 | 100% tài khoản tính vào A1 có chủ quản, quyền truy cập cần thiết, billing hợp lệ, bảo vệ tài khoản và phương án xử lý gián đoạn; không dùng token hết hạn hoặc tài khoản bị đình chỉ làm dự phòng đạt chuẩn. |
| B1 | Cấu trúc và độ phủ ý định tìm kiếm | 5 | 100% ý định ưu tiên đã chốt trong ads-plan được phủ bằng adgroup/landing phù hợp; keyword, phủ định, vùng và lịch chạy được rà soát; không tạo nhóm/mẫu trùng chỉ để tăng số lượng. Khi click thấp phải có kỳ so sánh và đối chiếu Auction Insights hoặc ghi rõ dữ liệu đối thủ là UNKNOWN. |
| C1 | Số nhóm/mẫu có thể chạy và đang phân phối | 5 | 100% adgroup dự kiến chạy có ≥1 RSA đủ điều kiện; ≥90% adgroup dự kiến chạy có impression trong 7 ngày hoàn tất; phần chưa chạy có nguyên nhân cụ thể. Báo số mẫu ở từng trạng thái, số ngày không phân phối và ngân sách bị hạn chế; phân loại riêng policy, budget, rank, targeting, learning và search volume. |
| C2 | Chất lượng mẫu và thử nghiệm | 5 | Mỗi adgroup dự kiến chạy có nội dung đúng offer, đủ asset liên quan, kiểm tra Ad Strength và kế hoạch thử thông điệp; không để cảnh báo nội dung quan trọng chưa xử lý. Mục tiêu nội bộ 2 RSA khác biệt/nhóm khi đủ ngân sách thử; trường hợp 1 RSA cần lý do về lượng dữ liệu/ngân sách được ghi trước kỳ. Khi CTR thấp phải có so sánh message/offer/CTA và landing công khai của đối thủ lặp lại, hoặc ghi UNKNOWN. |
| D1 | Landing và khả năng nhận liên hệ | 5 | Tất cả landing nhận Ads hoạt động HTTPS, mobile/desktop, asset, hotline/Zalo/form và thông điệp/giá đúng; không có luồng liên hệ bị hỏng. Có bằng chứng preview/probe được phép và ghi tốc độ tải so với baseline của trang. |
| E1 | Đúng và đủ tracking đầu vào | 5 | Đúng AW/label/send_to theo landing/account, query qua redirect, source/host/path; từng tương tác thử phát đúng một event dự kiến; page load/scroll không bị tính là lead/đơn. Có kết quả riêng website→collector và website→tag. |
| E2 | Conversion phục vụ tối ưu có ý nghĩa | 5 | Phân biệt CTA click, lead xác minh và đơn; primary/secondary, cửa sổ và cách đếm đã đối chiếu đúng mục tiêu; không cộng trùng nhiều conversion action cho cùng kết quả kinh doanh. Tag nhận sự kiện và provider quy thuộc conversion có bằng chứng riêng. |
| F1 | Nguồn → worker → ERP đầy đủ, đúng hạn | 5 | Sau khoảng trễ: ≥99% visit của nguồn trong phạm vi có mặt ở ERP theo sourceId + externalVisitId; độ trễ p95 ≤15 phút, không còn bản ghi tồn quá 60 phút không có xử lý. Đo observedAt/ACK hoặc timestamp cập nhật phù hợp, không dùng thời gian click cũ để đo trễ cập nhật mới. Thiếu đo lường là UNKNOWN. |
| F2 | Đồng bộ bền vững, không trùng/mất | 5 | Retry không tạo trùng visit; cập nhật tương tác muộn được nhận; ACK sau ghi thành công, có theo dõi backlog/lỗi và bằng chứng thử phục hồi an toàn. Counters không bị nhận nhầm là lịch sử event đầy đủ. |
| F3 | Chi phí Ads khớp ERP | 5 | 100% account-ngày trong phạm vi có trạng thái dữ liệu rõ; snapshot Ads/chi phí không cũ hơn 24 giờ; đối soát cùng cấp/múi giờ/tiền tệ: lệch ≤1% và ≤10.000 VND mỗi account-ngày sau chốt số. Mức tiền này chỉ áp dụng VND; ngoại tệ phải chốt ngưỡng và tỷ giá riêng trước kỳ. Không chấp nhận bù chéo sai lệch giữa tài khoản/ngày. |
| G1 | Nhận diện nguồn và sản phẩm | 5 | 100% đối tượng có chi tiêu có mapping hiện hành duy nhất provider/account/campaign/adgroup→ERP product/offer; ≥95% paid visits nhận diện được account/nhóm/sản phẩm bằng bằng chứng hợp lệ; phần unknown tách riêng. Không suy account từ AW, domain hoặc ID thô không kiểm tra. |
| G2 | CRM, chăm sóc và liên kết đơn | 5 | ≥95% lead xác minh có nguồn đã xác nhận; ≥95% đơn từ các lead này giữ liên kết nguồn; ≥90% lead được tiếp nhận trong SLA sản phẩm (mặc định 15 phút trong giờ trực, ngoài giờ tính từ ca kế tiếp). Có người phụ trách và danh sách tồn đã ẩn dữ liệu khách. |
| H1 | Lợi nhuận thực sau Ads | 10 | Kỳ/cohort đủ trưởng thành, attribution/chi phí tin cậy; lợi nhuận sau Ads dương và ROI đạt mục tiêu ERP đã duyệt; kiểm tra hoàn/hủy, giá vốn, phí và tiền thu. Thiếu mục tiêu hoặc căn cứ tính lợi nhuận: UNKNOWN; biết chắc lợi nhuận âm trên kỳ đầy đủ: FAIL. |
| H2 | Hiệu quả phễu và chi phí chuyển đổi | 5 | CPL lead xác minh, CPA đơn hợp lệ và tỷ lệ chốt đạt mục tiêu sản phẩm; báo cùng mẫu số, độ trễ và cỡ mẫu. CTR/CPC/conversions Google dùng chẩn đoán, không thay kết quả ERP. |
| H3 | Tỷ trọng chi tiêu đem lại kết quả | 5 | Tỷ trọng chi trên nhóm lỗ và phần chưa đủ dữ liệu nằm trong ngân sách thử/rủi ro đã duyệt; báo số nhóm có lãi/hòa vốn/lỗ/chưa đủ dữ liệu và tỷ trọng chi từng loại. Có kế hoạch xử lý nhóm vượt hạn mức, không chỉ báo số mẫu đang ENABLED. |
| I1 | Ngân sách và dòng tiền | 5 | Chi thực tế/pacing phù hợp ngân sách và giới hạn tài chính ERP, shared budget không cộng lặp; không bỏ sót ngày/nhóm có chi nhưng không có đơn; đề xuất tăng chi có căn cứ lợi nhuận và tiền khả dụng. |
| I2 | Rủi ro tập trung và ngân sách học | 5 | Báo tỷ trọng chi/lead/lợi nhuận theo account; mặc định cảnh báo khi một account chiếm >70% chi hoặc lead xác minh. Đạt khi nằm trong giới hạn đã chốt và các phép thử đủ ngân sách/mẫu; nếu chủ đích tập trung phải ghi chấp nhận rủi ro trước kỳ, không ép chia tiền đều cho đủ 3 tài khoản. |
| J1 | Chính sách, kiểm soát thay đổi và xử lý lỗi | 5 | Không có lỗi policy nghiêm trọng chưa xử lý; quyền và bằng chứng đầy đủ theo đường thực thi: approval/audit cho ERP, phạm vi xác nhận/pre-read/readback cho Windsor trực tiếp theo nguồn chung; có người kiểm tra theo nhịp, cảnh báo và kế hoạch P0/P1/P2 với owner/hạn; lỗi đã sửa được kiểm tra lại. Với ít click phải định lượng phần ảnh hưởng của policy trước khi quy cho đối thủ. Mọi thay đổi live đi qua Phase 3/5. |

Tổng: **100 điểm, 19 tiêu chí**. C2 tham khảo [hướng dẫn RSA của Google](https://support.google.com/google-ads/answer/9921843?hl=en), đọc 18/09/2026: khuyến nghị hiện tại là ít nhất 2 RSA Good/Excellent với final URL riêng; Ad Strength là phản hồi chất lượng nội dung, không chứng minh phân phối hay lợi nhuận. Không tự tạo landing/URL mới chỉ để đủ số.

### Cách tính điểm và xếp loại

- Hệ số: PASS = 1; WARN = 0,5; FAIL = 0. A1 chỉ PASS/FAIL/UNKNOWN. UNKNOWN không có điểm chất lượng, phải tính vào phần chưa kiểm chứng.
- `W` = tổng trọng số áp dụng (mặc định 100); `K` = trọng số đã kiểm chứng (PASS/WARN/FAIL); `E` = tổng trọng số × hệ số của phần đã kiểm chứng.
- **Độ phủ bằng chứng** = `100 × K/W`; **điểm phần đã kiểm chứng** = `100 × E/K` khi K > 0, nếu K = 0 ghi N/A.
- **Điểm bảo đảm theo toàn bộ tiêu chuẩn** = `100 × E/W`; khoảng điểm còn có thể đạt = `[100 × E/W, 100 × (E + W - K)/W]`. Phải hiển thị cả độ phủ, không gọi cận dưới là hiệu quả thực của phần chưa đo.
- NOT_APPLICABLE chỉ dành cho thành phần thực sự ngoài phạm vi đã chốt, kèm lý do/người xác nhận, loại trọng số khỏi W. Không dùng để bỏ A1, tracking, đồng bộ, attribution, hiệu quả hoặc ngân sách trên sản phẩm có chi tiêu. Sản phẩm chưa chạy có thể audit mức sẵn sàng nhưng không xếp loại sức khỏe kinh doanh.
- Ví dụ minh họa: W=100, K=80, E=64 → độ phủ 80%, điểm phần kiểm chứng 80/100, điểm bảo đảm 64/100, khoảng 64–84. Kết luận **chưa đủ bằng chứng**, không gọi giàn này khỏe.

Xếp loại theo điểm bảo đảm: ≥85 khỏe; 70–<85 cần cải thiện; 50–<70 yếu; <50 nguy cơ cao. Chỉ xếp loại này khi độ phủ ≥90%, không có chặn dưới đây và không có UNKNOWN ở A1, D1, E1, F1–F3, G1–G2, H1–H3, I1, J1. Để gọi **khỏe** còn phải A1=PASS và H1=PASS; nếu điểm cao nhưng A1 hoặc H1 chưa đạt, kết luận tối đa “cần cải thiện”.

**Điều kiện chặn, ưu tiên trước điểm số:**

1. Có bằng chứng vi phạm policy nghiêm trọng, lộ dữ liệu/secret, thay đổi Ads trái quyền/điều kiện của đường ERP hoặc ngoại lệ Windsor đã chọn, chi vượt giới hạn cứng ERP hoặc landing/liên hệ chính hỏng trong khi còn chi: `KHÔNG KHỎE — P0`.
2. Mất/trùng dữ liệu nghiêm trọng, gán sai account/sản phẩm/đơn, không đối soát được chi phí hoặc dữ liệu hiệu quả chưa trưởng thành/không đáng tin: `CHƯA ĐỦ CƠ SỞ KẾT LUẬN HIỆU QUẢ`, dù phần chất lượng khác có điểm cao.
3. Thiếu bằng chứng quan trọng: `CHƯA ĐỦ DỮ LIỆU`; vẫn báo lỗi đã xác nhận và kế hoạch thu thập, không ghi FAIL cho thực tế chưa biết.

Tổng toàn giàn báo từng sản phẩm, tổng tiền và lỗi chặn. Có thể tính điểm bình quân theo chi tiêu đã quy thuộc nhưng phải công bố phần chưa phân bổ; không dùng bình quân che một sản phẩm lỗi P0/thiếu bằng chứng. Chỉ kết luận toàn giàn khỏe khi mọi sản phẩm đang chi tiêu đều đủ điều kiện khỏe.

## 5. Đối chiếu hiệu quả trong ERP htxbachgia.shop

### Nguồn và khả năng tái sử dụng đã đọc trong mã local

Đã đối chiếu mã ngày 18/09/2026; **chưa xác minh phiên bản này đang chạy production**. Endpoint dưới đây là route của mã local, dùng khi đã xác minh phiên bản/quyền truy cập; không thử đăng nhập bằng thông tin đoán hoặc mở dữ liệu khách ra ngoài.

| Việc | Module/bằng chứng | Cách sử dụng và giới hạn |
|---|---|---|
| Kiểm kê account/campaign/adgroup/RSA | [Google Ads controller](../htxbachgia.shop/final8-version16/backend/src/google-ads/google-ads.controller.ts), GET `/api/google-ads/lookups/...`, `/api/google-ads/sync/runs/latest` | Đối chiếu ID và thời điểm sync; lookup hoặc sync thành công không tự chứng minh có impression. |
| Chi phí, phân phối, conversions theo ngày | [Daily metric schema](../htxbachgia.shop/final8-version16/backend/src/google-ads/schemas/google-ads-daily-metric.schema.ts) | Có customerId/campaignId/adGroupId/adId, level, date, costMicros/costVnd, clicks/impressions/conversions, lastSyncAt. Cần export/report đọc được phép, không suy có public endpoint chỉ từ schema. |
| Visit, liên hệ và nguồn | [Ingest DTO](../htxbachgia.shop/final8-version16/backend/src/tracking-crm/tracking-ingest.dto.ts), [CRM controller](../htxbachgia.shop/final8-version16/backend/src/tracking-crm/tracking-crm.controller.ts) | Đối chiếu source + externalVisitId, CRM và liên kết đơn. DTO chưa có accountId/adId/số khách/lịch sử event chi tiết; phải có bằng chứng mapping riêng hoặc để unknown. |
| Lãi/lỗ nhóm | [Profit classification](../htxbachgia.shop/final8-version16/backend/src/ad-group-profit-report/ads-ad-group-profit-classification.controller.ts), GET `/api/ads/ad-groups/profit-classification?days=28` | Có spend, leads, orders, netProfitAfterAds, roi, status/reason. `leads` ở module này có thể dựa hội thoại/provider metrics, không mặc định là lead xác minh của Tracking CRM. `isActive` không phải bằng chứng provider đang phân phối. |
| Báo cáo tài chính theo kỳ | [Profit report controller](../htxbachgia.shop/final8-version16/backend/src/ad-group-profit-report/ad-group-profit-report.controller.ts), GET `/api/ad-group-profit-report/performance` với startDate/endDate/adGroupIds | Kiểm tra chi phí ngày không có đơn, chi chưa phân bổ và các bộ lọc đơn. Không lấy riêng nhóm có đơn rồi coi là toàn bộ chi. Kiểm tra phạm vi thực của days API ở trên trước khi so hai báo cáo. |
| Ghép kết quả ERP vào Ads | [Profit enrichment service](../htxbachgia.shop/final8-version16/backend/src/google-ads/google-ads-profit-enrichment.service.ts) | Ghép campaign/ad_group từ đơn theo ngày Việt Nam; bỏ trường hợp adGroupId mơ hồ. Có erpEnrichedAt/profitUpdatedAt, cần đọc độ mới cùng lastSyncAt. Đây là service cập nhật dữ liệu; audit chỉ đọc kết quả hiện có, không tự gọi enrichment. |

### Quy trình đối soát bắt buộc

1. Chốt danh sách sản phẩm/account/campaign/adgroup, nguồn, kỳ, múi giờ và currency. Với nhiều dự án cùng sản phẩm, kiểm kê hợp nhất và khử trùng; map theo thời gian hiệu lực để không đổi nguồn lịch sử khi chuyển landing.
2. Lấy snapshot Ads và báo cáo ERP cùng phạm vi, ghi watermark/lastSyncAt/erpEnrichedAt. Tách dữ liệu chưa đến hạn cập nhật, thiếu ngày hoặc thiếu quyền đọc.
3. Đối chiếu chi Ads ↔ chi ghi nhận ERP theo account-ngày và adgroup; so số tuyệt đối và %, điều tra phần lệch. Nếu chi provider=0, dùng lệch tuyệt đối, không chia 0. Không mặc định tên `costVnd` chứng minh ngoại tệ đã đổi đúng.
4. Đối chiếu visit nguồn ↔ ERP bằng ID, rồi lead đã xác minh ↔ đơn theo liên kết nghiệp vụ. Không ép Google clicks=visits hoặc Google conversions=lead/đơn; ghi lý do khác attribution, đếm, consent và độ trễ. Hotline không phải số khách, không ghép theo IP/thời gian để đạt tỷ lệ.
5. Lấy đơn/tiền thu/hoàn hủy/giá vốn/phí theo định nghĩa ERP đã thống nhất. Kiểm tra snapshot tài chính còn provisional hay đã chốt. Tách nguồn chưa xác nhận, đơn không quy thuộc và chi không có đơn thành các dòng riêng.
6. Lập bảng theo sản phẩm→account→campaign→adgroup; cấp ad chỉ báo chỉ số provider/lead nếu có liên kết thật. **Không chia đều lợi nhuận adgroup cho từng mẫu RSA.** Mã enrichment hiện chỉ ghép cấp campaign/ad_group; lợi nhuận từng ad để N/A khi thiếu căn cứ.
7. Ghi kết quả chênh lệch, lỗi, điểm và kế hoạch; kiến nghị đổi ngân sách/trạng thái quay về Phase 3/5 theo đường ERP hoặc ngoại lệ Windsor được giao; không tự ghi chỉ từ kết quả audit.

### Chỉ số và công thức

| Chỉ số | Định nghĩa dùng trong báo cáo |
|---|---|
| Tỷ lệ sync visit | Số visit nguồn đã có ở ERP / tổng visit nguồn trong phạm vi đã qua khoảng trễ; không dùng số click Google làm mẫu số. Kiểm tra cập nhật engagement riêng. |
| CPL xác minh | Tổng chi Ads trong phạm vi / số lead đã xác minh và quy thuộc trong phạm vi. |
| CPA đơn | Tổng chi Ads / số đơn hợp lệ theo trạng thái được ERP xác nhận; giữ số hủy/hoàn riêng. |
| Tỷ lệ chốt | Số lead xác minh có ít nhất một đơn hợp lệ / tổng lead xác minh trong cùng cohort; một lead nhiều đơn vẫn tính một lần ở tử số. |
| ROAS ERP | Doanh thu thuần được quy thuộc theo định nghĩa đã chốt / chi Ads; báo riêng ROAS provider. |
| Lợi nhuận sau Ads | Doanh thu thuần − giá vốn − phí/chi phí vận hành được tính trong phạm vi − chi Ads; hoàn/hủy áp dụng theo ERP. Nếu dùng netProfitAfterAds đã trừ Ads thì **không trừ Ads lần hai**. |
| ROI Ads | Lợi nhuận sau Ads / chi Ads ×100%; gọi đúng ROI sau Ads, không lẫn gross margin hoặc ROAS. |
| Tỷ lệ nhóm có lãi | Số nhóm có lợi nhuận sau Ads >0 / số nhóm có chi và đủ bằng chứng để kết luận; báo cả số nhóm chưa đủ dữ liệu trên tổng số nhóm có chi. |
| Tỷ trọng chi nhóm lỗ | Chi của các nhóm xác định lỗ / toàn bộ chi Ads trong phạm vi; chi nhóm chưa đủ dữ liệu/không quy thuộc phải có tỷ trọng riêng. |

Mẫu số bằng 0 → N/A và ghi nguyên nhân, không ghi hiệu quả =0. Có chi nhưng chưa có đơn sau khi cohort đã trưởng thành và dữ liệu đầy đủ: ghi “chưa có đơn”, CPA không hữu hạn; chi đó vẫn giảm lợi nhuận. Thiếu mục tiêu CPL/CPA/ROI hoặc ngưỡng mẫu tối thiểu phải được bổ sung trước khi kết luận đạt H1–H3.

**Lưu ý mã hiện có:** enrichment cộng `depositAmount + codAmount + manualPayment` vào revenue; điều này chưa tự chứng minh doanh thu thuần/đã thu tiền theo chuẩn tài chính. Nó lấy realizedGrossProfit/realizedNetProfit hoặc fallback grossProfit/netProfit, đếm orders và hủy/hoàn; schema có confirmedOrders nhưng hàm này chưa tính trường đó. Không dùng số mặc định 0 hoặc tên trường làm bằng chứng “0 đơn xác nhận”/“không có lợi nhuận”. Đối chiếu báo cáo nghiệp vụ trước khi cho điểm H1–H2.

## 6. Phản hồi sau mỗi lần kiểm tra

Mỗi vấn đề ghi: **tiêu chí → thực tế → bằng chứng/thời gian → ngưỡng → tác động → nguyên nhân đã xác nhận hoặc giả thuyết → hành động → owner → hạn → cách kiểm tra lại**. Tách dữ kiện khỏi suy luận. Chỉ đóng khi kiểm tra lại đạt; giữ điểm trước/sau và bằng chứng mới.

- **P0:** sự cố đang gây thất thoát, không nhận được liên hệ, lộ dữ liệu, vi phạm nghiêm trọng hoặc chi vượt giới hạn cứng. Báo ngay cho người phụ trách; dừng/đổi Ads theo đường ERP hoặc ngoại lệ Windsor đã được giao và đủ điều kiện tương ứng.
- **P1:** mất/mơ hồ attribution, lệch chi/sync, thiếu 3 tài khoản, nhóm tiêu tiền nhưng không có kết quả sau đủ mẫu. Mặc định lập phương án trong 1 ngày làm việc, hạn sửa cụ thể theo owner/phụ thuộc.
- **P2:** cải thiện nội dung, tốc độ, độ phủ, thử nghiệm. Đưa vào tuần kế tiếp, có KPI đánh giá lại.

Báo cáo kết thúc với tối đa 3 việc ưu tiên, thông tin còn thiếu và ngày kiểm tra lại. Ghi “chưa đo” nếu chưa có số liệu, không tạo một điểm sức khỏe production từ hồ sơ lịch sử.
