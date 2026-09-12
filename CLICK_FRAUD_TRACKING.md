# Theo dõi IP truy cập từ Google Ads

Tính năng này ghi nhận lượt vào website có dấu hiệu đến từ Google Ads, tổng hợp theo IP và tạo danh sách **đề xuất kiểm tra/chặn thủ công**. Hệ thống không kết nối và không tự thay đổi tài khoản Google Ads.

## Điều kiện hoạt động

- Website phải đi qua Cloudflare proxy/tunnel để ứng dụng nhận IP gốc qua `CF-Connecting-IP`.
- Origin không nên được public trực tiếp. Nếu origin vẫn truy cập trực tiếp được, người gửi request có thể giả header IP.
- Không dùng quy tắc `Cache Everything` cho HTML landing page. Nếu đang có cache rule tùy chỉnh, hãy bypass cache cho request chứa `gclid`, `wbraid`, `gbraid` hoặc `utm_medium=cpc` để request đầu tiên luôn tới ứng dụng.
- Google Ads nên bật auto-tagging để URL có `gclid`. Hệ thống cũng nhận `wbraid`, `gbraid` hoặc cặp UTM `utm_source=google&utm_medium=cpc`.

## Final URL Suffix đề xuất

Trong Google Ads, thêm Final URL Suffix:

```text
utm_source=google&utm_medium=cpc&cid={campaignid}&agid={adgroupid}&kw={keyword}&net={network}&mt={matchtype}&dev={device}
```

Không tự thêm `gclid`; Google Ads sẽ thêm khi auto-tagging được bật.

## Trang quản trị

Sau khi đăng nhập, mở:

```text
/admin-panel-xyz123/click-fraud
```

Trang quản trị hỗ trợ:

- Chọn khoảng thời gian 1–90 ngày.
- Lọc theo mức rủi ro.
- Tìm theo IP, campaign, keyword hoặc landing page.
- Xem lý do chấm điểm cho từng IP.
- Sao chép các IP đã chọn.
- Xuất TXT để dán vào Google Ads hoặc CSV để kiểm tra chi tiết.

## Chuyển đổi và thông tin đơn hàng

Trong trang theo dõi IP, chọn **Lọc chuyển đổi · Nhập khách hàng & đơn hàng**.
Chế độ này hiển thị từng lượt truy cập, giữ riêng click ID và ID nhóm quảng cáo,
không gộp đơn hàng theo IP. Chọn **Nhập / sửa** để ghi tên khách hàng, tên người nhận,
số điện thoại, địa chỉ giao hàng, tổng giá bán, tiền cọc, COD, giá vốn/báo giá nhà cung cấp
và ghi chú. Mỗi lượt có một hồ sơ, có thể sửa tiếp khi tư vấn/chốt đơn.

- Bộ lọc: tất cả, có/chưa có tín hiệu liên hệ, bấm gọi, bấm Zalo, bấm Messenger,
  gửi form, đã lưu thông tin, đã xác nhận đơn. Bộ lọc này không bị giới hạn bởi mức rủi ro IP.
- Tìm theo tên khách/người nhận, điện thoại, IP, click ID, ID nhóm, chiến dịch hoặc landing.
- Hiển thị giờ Việt Nam (UTC+7), mới nhất theo giờ liên hệ hoặc giờ vào trang.
- Kênh và giờ sự kiện chỉ có từ khi cập nhật; dữ liệu cũ vẫn lọc được theo tổng liên hệ/form.
- Bấm liên hệ/gửi form chưa xác nhận cuộc gọi, tin nhắn hay đơn hàng thực tế.
  Nhân viên tự đối chiếu và chọn trạng thái **Đã xác nhận đơn**; không tự gán khách theo IP/thời điểm.
- Số tiền là số nguyên VND không âm; ô trống khác số 0. COD nhập độc lập;
  nút tính COD chỉ điền giá bán trừ cọc khi nhân viên bấm.
- Lưu yêu cầu đăng nhập và CSRF; có kiểm tra phiên bản để ngăn ghi đè khi hai người cùng sửa.
- Bảng `ad_visit_orders` lưu dữ liệu nhập thủ công, `ad_visit_events` lưu kênh/giờ liên hệ.
  Hai bảng được tạo tự động, không cần xóa database cũ. Lượt đã có hồ sơ và các sự kiện
  đi kèm được giữ khi dọn log; chọn **Tất cả dữ liệu còn lưu** để tìm hồ sơ ngoài 90 ngày.
- Cookie liên kết lượt vẫn có hạn 30 phút như trước. Liên hệ sau khi cookie hết hạn
  hoặc ở trình duyệt khác không tự nối về lượt cũ. CSV/TXT ở chế độ IP vẫn là báo cáo rủi ro,
  không chứa thông tin đơn hàng.

## Cách chấm điểm IP

Điểm được cộng từ nhiều tín hiệu, không dựa vào một lần thoát trang đơn lẻ:

- Nhiều lượt vào từ Ads trong kỳ.
- Tỷ lệ lượt không có tương tác rõ ràng từ 80% trở lên.
- Từ 3 lượt trở lên trong vòng 10 phút.
- Nhiều click ID khác nhau đến từ cùng IP.
- Không có hành động liên hệ/gửi form.
- IP nằm ngoài danh sách quốc gia mục tiêu.
- Lặp lại cùng user-agent với tần suất cao.

Mức `Trung bình` và `Cao` được đưa vào danh sách đề xuất. Người dùng vẫn phải kiểm tra trước khi chặn vì IP nhà mạng, văn phòng hoặc Wi-Fi công cộng có thể được nhiều khách thật sử dụng chung.

## Biến môi trường

```env
CLICK_TRACKING_ENABLED=true
TRUST_CLOUDFLARE_IP=true
CLICK_TRACKING_RETENTION_DAYS=90
CLICK_TRACKING_ALLOWED_COUNTRIES=VN
```

- `CLICK_TRACKING_ENABLED`: bật/tắt toàn bộ tính năng.
- `TRUST_CLOUDFLARE_IP`: đọc IP từ `CF-Connecting-IP`; chỉ bật khi origin được bảo vệ sau Cloudflare.
- `CLICK_TRACKING_RETENTION_DAYS`: số ngày giữ dữ liệu, giới hạn tối đa trong code là 365 ngày.
- `CLICK_TRACKING_ALLOWED_COUNTRIES`: mã quốc gia ISO, phân cách bằng dấu phẩy. Để trống nếu không muốn chấm điểm theo quốc gia.

## Dữ liệu được lưu

SQLite lưu IP, thời gian, click ID, thông tin ValueTrack/UTM, quốc gia, user-agent, landing page và các tín hiệu tương tác tổng quát. Công cụ không thu thập nội dung form, số điện thoại hay dữ liệu người dùng nhập.

Script tương tác chỉ được chèn trong phiên bắt đầu từ Google Ads và theo dõi:

- Thời gian hoạt động trên trang.
- Mức cuộn trang.
- Click vào liên kết liên hệ.
- Sự kiện gửi form.

Hãy cập nhật chính sách quyền riêng tư của website và giới hạn quyền truy cập trang quản trị phù hợp với quy định áp dụng.

## Chạy kiểm thử

```powershell
cd ladifinal
..\.venv\Scripts\python.exe -m unittest discover -s tests -v
```
