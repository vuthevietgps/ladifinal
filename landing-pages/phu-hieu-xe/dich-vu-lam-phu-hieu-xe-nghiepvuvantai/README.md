# Phù hiệu xe — nghiepvuvantai.com

Source nhập từ trang đang chạy ngày 18/09/2026, sau đó sửa theo yêu cầu người dùng. Bản này đang ở giai đoạn preview, chưa publish.

- URL đích giữ nguyên: `https://nghiepvuvantai.com/landing/dich-vu-lam-phu-hieu-xe`.
- Hotline/Zalo: `0986284840`.
- [Báo cáo kiểm chứng](../../../projects/nghiepvuvantai-com/reviews/2026-09-18-phu-hieu-landing-tracking.md).
- Nội dung nhấn mạnh kiểm tra điều kiện, hướng dẫn giấy tờ thiếu, báo phí rõ và nhận kết quả rồi mới thanh toán (người dùng xác nhận 18/09/2026).
- Tracking do Ladifinal inject. Source không nhúng Google tag, conversion label hay collector; không đóng gói script kiểm thử.
- Nút Zalo là liên kết trực tiếp, không ghép giấy tờ/biển số vào query URL.
- CSS, JavaScript, ảnh lấy từ cùng bản live; Lucide 1.47.0 được giữ local cùng license trong đầu file.

Preview từ root repo:

```powershell
.venv/Scripts/python.exe -m http.server 8086 --bind 127.0.0.1 --directory landing-pages/phu-hieu-xe/dich-vu-lam-phu-hieu-xe-nghiepvuvantai
```

Mở `http://127.0.0.1:8086/`. Preview không gắn tracking production.
