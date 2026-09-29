# Kiểm tra trang đích dichvuvantai.site — 2026-09-16

> Hồ sơ lịch sử giữ lại để xử lý lỗi chính sách. Script và fixture của đợt kiểm tra đã đưa ra thư mục khôi phục ngoài project; đây không phải kết quả kiểm tra production sau cleanup.

## Kết luận
Chưa tìm thấy bằng chứng trực tiếp về mã độc hoặc cloaking trong hai trang đích và phần mã phục vụ đã kiểm tra. Chưa xác định được nguyên nhân cụ thể Google gắn CIRCUMVENTING_SYSTEMS và COMPROMISED_SITE. Đây không phải chứng nhận toàn bộ máy chủ sạch mã độc.

## Phạm vi và bằng chứng
- Hai đường dẫn: /landing/the-nhan-dang-lai-xe-rfid và /landing/tu-van-giay-phep-kinh-doanh-van-tai-toan-quoc.
- 8 yêu cầu HTTP với User-Agent desktop, mobile, AdsBot, Googlebot: đều 200, không đổi URL; SHA-256 giống nhau giữa 4 User-Agent cho từng trang. Thử User-Agent không thay thế kiểm tra từ IP thật của Google.
- 13 tài nguyên tham chiếu trong HTML tải thành công, gồm CSS, ảnh, JavaScript và Cloudflare beacon.
- Bản HTML tải bằng curl trùng nội dung với tệp published trên server. Một đợt tải bằng urllib có Cloudflare beacon bổ sung. advanced-tracking.js công khai trùng SHA-256 bản server.
- JavaScript riêng của hai trang xử lý menu, FAQ, cuộn và hiệu ứng. Không tìm thấy eval, atob, iframe, document.write hoặc chuyển hướng window.location trong lượt rà soát published và thư mục JavaScript dùng chung; phép quét mẫu không bao phủ mọi kỹ thuật mã độc.
- Tracking chung có bộ tải Google/Facebook/TikTok; cấu hình hai trang chỉ bật Google Ads, Facebook/TikTok null. Không có căn cứ quy các bộ tải chuẩn này là mã độc.
- Route trang đích đọc cùng tệp HTML, không phân nhánh theo User-Agent/quốc gia. Bộ theo dõi quảng cáo ghi nhận lượt truy cập và gắn script tracking theo cookie/tham số quảng cáo; không thấy chuyển hướng/chặn nội dung tại phần đã đọc. Không phát sinh click giả để thử.
- Docker diff không cho thấy thay đổi mã nguồn ứng dụng so với image đang chạy; thấy bytecode Python, tệp tạm triển khai và dữ liệu mount. Điều này không chứng minh image gốc không có vấn đề.
- /.env, /.git/HEAD, /data/database.db trả 404. robots.txt cũng 404.
- Log có yêu cầu mang User-Agent AdsBot nhận 200/304. Chưa xác minh nguồn IP Google, và log có cả yêu cầu kiểm tra của chúng tôi.
- Có database backup trong uploads/backup-new-landings-20260916T040336Z; chưa có bằng chứng tệp này truy cập công khai.
- Không sửa website, cấu hình server hoặc chiến dịch.

## Phần chưa xác minh
Chưa có báo cáo Security Issues của Search Console, chi tiết tên miền bị đánh dấu trong giao diện Google Ads, trạng thái Safe Browsing trực tiếp, cấu hình Cloudflare WAF đầy đủ, hay kiểm tra động JavaScript trong trình duyệt. Chưa quét toàn bộ host và các dịch vụ khác.

## Bước tiếp theo
Lấy tên miền/URL cụ thể trong Policy details của Google Ads và báo cáo Security Issues của Search Console để đối chiếu. Nếu không có dấu hiệu vi phạm sau kiểm tra, yêu cầu Google xét duyệt thủ công với bằng chứng ở trên; không tuyên bố đã loại bỏ mã độc khi chưa tìm thấy mã độc.

Hướng dẫn chính thức: https://support.google.com/adspolicy/answer/15938376?hl=en

Dữ liệu kiểm tra có thể chạy lại: check_public.py; kết quả: public-results.json.
