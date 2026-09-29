# Phù hiệu mới — landing và tracking, 18/09/2026

## Phạm vi và nguồn

Người dùng yêu cầu kiểm tra landing, tracking và nhấn mạnh: kiểm tra điều kiện, hướng dẫn giấy tờ còn thiếu, báo phí rõ, nhận kết quả rồi mới thanh toán. Dùng đúng bản HTML/CSS/JS/ảnh tải từ URL đang chạy làm gốc, tái sử dụng giao diện và AdvancedTracking/collector của Ladifinal.

- Google Ads qua Windsor.ai: tài khoản `1396730688` (Phù hiệu xe nhanh), campaign `24254559545`, adgroup `205916274371`, ad đang phân phối `824864900612`.
- URL của ad và trang được đọc: `https://nghiepvuvantai.com/landing/dich-vu-lam-phu-hieu-xe`.
- Đây là trang published tĩnh; template Flask `/phu-hieu-xe` và `/dich-vu-lam-phu-hieu-xe` là đường dẫn khác. Không sửa template đó để thay nhầm trang.
- [Source sửa](../../../landing-pages/phu-hieu-xe/dich-vu-lam-phu-hieu-xe-nghiepvuvantai/index.html), hotline giữ `0986284840`.
- Google tag live: `AW-16690861047`; phone `zSISCMrxvL8cEPen6ZY-`; Zalo `_YWhCPPAvL8cEPen6ZY-`.
- SHA256 AdvancedTracking live trùng source local: `03f459dd07080d94ab5333d0fe40ac05cc0f87d3c49fa50802ea7139657c9f06`.

## Lỗi đã tái hiện và sửa ở source

| Điểm kiểm tra | Bản live tải về | Bản sửa local |
|---|---|---|
| Nút báo giá | Submit form rồi `window.open`, không có liên kết Zalo cho auto-tracking | Liên kết Zalo thật; gửi giấy tờ trong chat |
| Google conversion khi nhấn nút báo giá | 0 | 1, đúng label Zalo |
| Generic `contact_click` ở nút báo giá | 2 (click và submit) | 0, bỏ handler thừa |
| Collector khi nhấn nút báo giá | `form_submit`, không có `zalo` | 1 sự kiện `zalo` |
| Dữ liệu biểu mẫu | Ghép thông tin xe/ghi chú vào query URL Zalo | Không nhập/ghép thông tin khách vào URL |
| Cam kết thanh toán | Chưa có nhận kết quả rồi thanh toán | Nêu rõ ở hero, báo phí, quy trình, FAQ, CTA cuối |
| Canonical/og/schema URL | Trỏ đường dẫn template không có `/landing/` | Đồng nhất URL đích Ads `/landing/dich-vu-lam-phu-hieu-xe` |

Lỗi này có thể làm thiếu chuyển đổi ở nút báo giá; chưa đủ bằng chứng để kết luận nó gây ra toàn bộ số conversion bằng 0 trong Ads. Các CTA dạng liên kết ở trang cũ đã được auto-tracking hỗ trợ.

## Nội dung đã chỉnh

- Đầu trang: “Kiểm tra điều kiện xe, hướng dẫn giấy tờ còn thiếu và báo rõ chi phí trước khi làm. Nhận kết quả rồi mới thanh toán.”
- CTA chính: “Kiểm tra điều kiện qua Zalo”.
- Phần báo phí nói rõ kiểm tra hồ sơ → báo chi phí/phần việc → khách đồng ý → xử lý → nhận kết quả → thanh toán theo phí thống nhất.
- Bỏ form mở Zalo, thay bằng hướng dẫn gửi thông tin/ảnh giấy tờ trong chat.
- Giữ lời giải thích đơn vị tư vấn hỗ trợ hồ sơ, cơ quan có thẩm quyền xét duyệt/cấp phù hiệu. Không thêm giá tiền, thời gian cấp hay bảo đảm đậu.
- Mốc phản hồi 10–30 phút/trong ngày và thông tin văn phòng là nội dung giữ từ live, chưa kiểm chứng lại năng lực vận hành.

## Kiểm chứng và giới hạn

1. Browser Edge headless, toàn bộ request bị chặn/giả lập trong môi trường thử. Dùng HTML/script live làm baseline; inject đúng cấu hình captured chỉ trong harness, không vào source. Không gửi conversion Google hay event lên production, không mở cuộc gọi/chat, không tạo click Ads.
2. Sau tải trang: 0 conversion. Từng liên kết điện thoại/Zalo trên desktop, cả 2 nút cố định mobile và nút báo giá: mỗi nhấn đúng 1 conversion với label tương ứng và 1 event collector tương ứng.
3. FAQ thanh toán mở/đóng; ảnh tải đủ; không lỗi JavaScript. Desktop 1440px, mobile 390px và 320px: không tràn ngang. Đã xem ảnh preview hero desktop/mobile và khối báo giá mobile.
4. `node --check` cho JS của landing. Bộ unittest hiện có của Ladifinal: 7/7 PASS trên database tạm; đây là kiểm chứng mã local, không nghiệm thu ERP live.
5. Google Ads qua Windsor cho biết auto-tagging bật. Suffix/template ở cấp ad và customer trả null. Chưa có bằng chứng cấu hình kế thừa ở campaign/adgroup; không kết luận toàn bộ tài khoản thiếu suffix. Cần đối chiếu URL của lượt click thật để biết `cid/agid` giữ tới collector/ERP.
6. Trang URL trần không có collector không có nghĩa hỏng: Ladifinal chỉ inject collector khi nhận diện paid visit hoặc cookie tương ứng. Không thử GCLID giả trên production.
7. Chưa kiểm chứng event frontend → lưu production → worker ACK → ERP → khách/đơn; chưa xác nhận Google nhận conversion thực. Nhấn Zalo/điện thoại cũng chưa chứng minh khách đã nhắn/gọi thành công.

Bằng chứng local (Git-ignored): `projects/nghiepvuvantai-com/artifacts/phu-hieu-landing-audit/` gồm snapshot, asset manifest, harness, `browser-check-results.json` và ảnh preview. Source không nhúng tag/collector trùng với platform.

## Trạng thái bàn giao

- Preview: `http://127.0.0.1:8086/`.
- Chưa publish landing, chưa thay nội dung quảng cáo/ngân sách live.
- Ưu tiên tiếp theo khi triển khai: đưa đúng source vào slug hiện có; giữ cấu hình tag/label/source, kiểm tra trang live và chờ đối chiếu lượt khách thật. Không tăng ngân sách dựa riêng số click hoặc lỗi tracking vừa phát hiện.
- [Nháp quảng cáo khớp landing](../ads-plan.md#phù-hiệu-mới--bản-nháp-nội-dung-18092026). Mọi action Ads do ERP validate/approve/execute.

## Bổ sung: cách gọi “hỗ trợ thủ tục”

Theo yêu cầu tiếp theo “hãy thể hiện rõ”, thêm khối công bố ngay dưới H1, trước CTA: đơn vị tư vấn/hỗ trợ hồ sơ, không phải cơ quan cấp phù hiệu; nêu rõ bên có thẩm quyền xét duyệt/cấp. Phần báo phí phân biệt phí dịch vụ hỗ trợ hồ sơ với lệ phí nhà nước, giải thích khoản khác nếu có trước khi khách đồng ý. Quy trình và FAQ đồng nhất vai trò; FAQ về đơn vị cấp phép mặc định mở. Description thứ tư của nháp RSA nêu rõ không phải cơ quan cấp phù hiệu. Không thêm mức phí hoặc lời bảo đảm xét duyệt. Tái sử dụng HTML/CSS và FAQ/tracking hiện có; thay đổi chỉ ở preview và nháp.

Theo đề nghị người dùng, đổi H1, title, mô tả, og:title, tên dịch vụ trong schema, tiêu đề nhóm dịch vụ/footer và headline đầu của nháp quảng cáo thành cách diễn đạt hỗ trợ thủ tục/hồ sơ. Giữ lời công bố đơn vị hỗ trợ, không phải cơ quan cấp phù hiệu, và giữ nguyên phạm vi dịch vụ thực tế cùng điều kiện thanh toán. Chỉ sửa preview/nháp.

Đối chiếu [chính sách Google về giấy tờ và dịch vụ chính phủ](https://support.google.com/adspolicy/answer/13156083?hl=en) và [trình bày sai](https://support.google.com/adspolicy/answer/6020955?hl=vi) ngày 18/09/2026: không tìm thấy lệnh cấm riêng cụm “hỗ trợ thủ tục”; đổi từ không đủ chứng minh dịch vụ nằm ngoài phạm vi chính sách. Danh sách có đăng ký xe, biển số và một số giấy phép/giấy thông hành đường bộ; không nêu đích danh phù hiệu xe kinh doanh vận tải Việt Nam. Không tự đồng nhất phù hiệu với biển số hoặc kết luận được miễn. Nếu bị phân loại sai, cần yêu cầu Google xem xét phạm vi; nếu thực tế thuộc diện hạn chế, cần đi đúng quy trình chứng nhận áp dụng. Cam kết nhận kết quả rồi thanh toán phải đúng thực tế, không kèm phí trước không công bố.
