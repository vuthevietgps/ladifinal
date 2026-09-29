# Rà soát landing page biển vàng — 16/09/2026

URL đối chiếu: https://nghiepvuvantai.com/landing/doi-bien-vang
Nguồn: `landing-pages/bien-vang/doi-bien-vang/`.

## Cập nhật triển khai

Đã triển khai trực tiếp qua SSH ngày 16/09/2026 vào container `nghiepvuvantai-com-web`, bản ghi landing ID 16. Đã xác minh URL công khai hiển thị nội dung mới và chỉ có một cấu hình tracking, một thẻ Google Ads. Giữ nguyên Agent, hotline, Zalo và trạng thái trang.

- ZIP: bản ZIP lịch sử ngày 16/09/2026 (đã đưa ra thư mục khôi phục; đóng gói lại từ source khi cần) (index.html ở thư mục gốc).
- Backup trên host: `/opt/websites/sites/nghiepvuvantai-com/uploads/backup-doi-bien-vang-20260916T031535Z/` (trang cũ, bản ghi cấu hình và ZIP triển khai).
- Google Ads: `AW-16690861047`.
- Nhãn gọi điện: `zSISCMrxvL8cEPen6ZY-`.
- Nhãn Zalo: `_YWhCPPAvL8cEPen6ZY-`.
- Ba giá trị được đối chiếu với trang chủ đang hoạt động và bản ghi homepage trên server theo yêu cầu người dùng.
- Đã kiểm thử hai hàm chuyển đổi của mã JavaScript thực tế trên server trong môi trường cô lập: mỗi hành động tạo đúng một sự kiện và đúng send_to; không gửi chuyển đổi thử tới Google. Chưa xác nhận lượt chuyển đổi được Google Ads ghi nhận/ghi công thực tế.

## Kết luận

Nội dung trang trực tiếp khớp bản nguồn trước khi sửa. Trang quảng bá hỗ trợ thủ tục đổi biển số, bao gồm rà soát, kê khai và theo dõi kết quả. Google liệt kê “License plate number” trong phạm vi Government documents and services. Việt Nam không có trong danh sách ngoại lệ khu vực cho nhóm biển số tại thời điểm rà soát. Chỉ sửa nội dung hoặc thêm tuyên bố không phải cơ quan nhà nước không tạo quyền chạy quảng cáo.

Nguồn chính sách: https://support.google.com/adspolicy/answer/13156083?hl=en

## Đã chỉnh trong bản nguồn

- Hiển thị ngay phần đầu trang: website hỗ trợ hồ sơ, không phải cơ quan nhà nước; không cấp biển số hay quyết định kết quả.
- Bổ sung lựa chọn tự thực hiện và liên kết Cổng Dịch vụ công Quốc gia.
- Làm rõ phí hỗ trợ khác lệ phí nhà nước và không phải khoản mua biển số.
- Bỏ cách nói đơn vị hỗ trợ xác nhận thời gian cấp biển; làm rõ không bảo đảm chấp thuận hay xử lý sớm.
- CTA trao đổi ban đầu không yêu cầu gửi ngay ảnh giấy tờ; bổ sung lưu ý về dữ liệu trước khi chia sẻ.
- Giữ rõ dịch vụ đổi biển vàng, không đổi tên dịch vụ để che bản chất hoặc trình bày nội dung khác cho Googlebot.

## Cần hoàn tất trước khi yêu cầu xét duyệt lại

1. Bổ sung tên pháp lý, địa chỉ và thông tin nhận diện đơn vị đúng với hồ sơ xác minh nhà quảng cáo. Hiện chưa được cung cấp, không tự điền dữ liệu giả.
2. Xác nhận phạm vi công việc, phí, điều kiện thanh toán/hoàn tiền và cách xử lý dữ liệu phù hợp hoạt động thực tế; công bố thông tin xác thực trên trang.
3. Đã đưa bản sửa lên hệ thống và kiểm tra nội dung, giao diện cùng cấu hình tracking trên URL công khai.
4. Nếu quảng bá dịch vụ thuộc phạm vi chính sách: kiểm tra tư cách nhà cung cấp được ủy quyền và đăng ký chứng nhận Google; hoàn tất xác minh nhà quảng cáo theo yêu cầu. Giấy đăng ký kinh doanh hoặc ủy quyền của khách hàng không tự chứng minh được chính phủ ủy quyền theo định nghĩa Google.
5. Chỉ xin loại trừ ngoài phạm vi khi dịch vụ thực tế đáp ứng căn cứ đó; không khẳng định dịch vụ nằm ngoài phạm vi chỉ vì dùng từ “tư vấn”.
6. Sau khi đủ điều kiện/chứng nhận, yêu cầu xem xét lại mẫu bị từ chối và kiểm tra đồng thời nội dung mẫu, URL cuối, các tài sản quảng cáo và trạng thái phân phối.

## Mẫu cũ 824750746071

Theo thông tin người dùng: mẫu cũ được duyệt nhưng tạm dừng; mẫu duy nhất đang bật bị từ chối. Đây là lý do chiến dịch bật nhưng không có mẫu đang bật đủ điều kiện, nếu trạng thái cung cấp vẫn hiện hành. Chưa kiểm tra trực tiếp tài khoản Google Ads. Không tự bật lại mẫu cũ: việc từng được duyệt không bảo đảm tuân thủ hiện tại và bật lại có thể phát sinh chi tiêu. Chỉ cân nhắc khôi phục sau khi xác minh trạng thái hiện tại, URL và điều kiện chính sách.
