# Landing theo sản phẩm

Giữ các bộ source có HTML, CSS, JS và ảnh đi kèm. 11 bộ ban đầu giữ nguyên nội dung khi chuyển; bản phù hiệu nhập từ live và sửa ngày 18/09/2026 được ghi riêng bên dưới. Hotline/domain khác nhau được giữ thành biến thể riêng; không chọn trang chỉ dựa tên gần giống.

| Nhóm | Source | Hotline trong HTML | Ghi chú |
|---|---|---|---|
| Phù hiệu xe | [dich-vu-lam-phu-hieu-xe-nghiepvuvantai](phu-hieu-xe/dich-vu-lam-phu-hieu-xe-nghiepvuvantai/index.html) | 0986284840 | Nhập từ live 18/09/2026, sửa nội dung và CTA tracking; đang preview |
| Biển vàng | [doi-bien-vang](bien-vang/doi-bien-vang/index.html) | 0363614511 | Bản local đang chỉnh sửa, được giữ nguyên |
| Biển vàng | [doi-bien-vang-nghiepvuvantai](bien-vang/doi-bien-vang-nghiepvuvantai/index.html) | 0986284840 | Bản release nghiepvuvantai.com |
| Biển vàng | [doi-bien-vang-phu-hieu-xe](bien-vang/doi-bien-vang-phu-hieu-xe/index.html) | 0986284840 | Nội dung biển vàng kết hợp phù hiệu |
| Biển vàng | [doi-bien-vang-phu-hieu-xe-dichvuvantai](bien-vang/doi-bien-vang-phu-hieu-xe-dichvuvantai/index.html) | 0363614511 | Biến thể hotline riêng |
| Biển vàng | [combo-dich-vu-van-tai-toan-quoc](bien-vang/combo-dich-vu-van-tai-toan-quoc/index.html) | 0363614511 | Combo có biển vàng và giấy phép; giữ một source, không copy sang nhóm khác |
| Thẻ lái xe | [the-nhan-dang-lai-xe-rfid](the-lai-xe/the-nhan-dang-lai-xe-rfid/index.html) | 0363614511 | Bản source local |
| Thẻ lái xe | [the-nhan-dang-lai-xe-rfid-nghiepvuvantai](the-lai-xe/the-nhan-dang-lai-xe-rfid-nghiepvuvantai/index.html) | 0986284840 | Bản release nghiepvuvantai.com |
| Giấy phép | [giay-phep-van-tai](giay-phep-kinh-doanh-van-tai/giay-phep-van-tai/index.html) | 0986284840 | Trang giấy phép |
| Giấy phép | [giay-phep-van-tai-ads-2](giay-phep-kinh-doanh-van-tai/giay-phep-van-tai-ads-2/index.html) | 0986284840 | Biến thể nội dung Ads |
| Giấy phép | [tu-van-giay-phep-kinh-doanh-van-tai-toan-quoc](giay-phep-kinh-doanh-van-tai/tu-van-giay-phep-kinh-doanh-van-tai-toan-quoc/index.html) | 0363614511 | Bản dichvuvantai.site |
| Giấy phép | [trang-chu](giay-phep-kinh-doanh-van-tai/trang-chu/index.html) | 0986284840 | Trang tổng hợp có giấy phép và phù hiệu |

Nhóm thư mục chỉ để tìm source, không phải ID nhóm sản phẩm ERP. Domain cho bản chưa có bằng chứng cần xác minh trước khi publish. Không thay slug URL đang chạy chỉ vì folder local có hậu tố domain.

## Preview một trang

Chạy từ root repo, chọn đúng thư mục trang:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory landing-pages/bien-vang/doi-bien-vang
```

Mở `http://127.0.0.1:8080`. Serve từng trang ở root để `/css`, `/js`, `/images` đúng chuẩn. Không serve toàn repo hoặc thư mục platform có dữ liệu cấu hình.

Đóng ZIP từ nội dung bên trong thư mục trang để `index.html` nằm ở gốc ZIP; theo [QUYTAC.md](../QUYTAC.md).
