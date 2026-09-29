# Ứng dụng quản lý landing

Ứng dụng Flask được giữ nguyên trong thư mục này. Cấu trúc `ladifinal/app`, static, templates, tests cùng Docker/Compose được chuyển chung để giữ đường dẫn nội bộ container và volume tương đối.

```text
platform/
├── Dockerfile, .dockerignore
├── docker-compose.yml / docker-compose.prod.yml / docker-compose.template.yml
├── .env.example
├── ladifinal/
│   ├── main.py, requirements.txt
│   ├── app/, static/, templates/, tests/
│   └── dữ liệu local đã có (Git ignore)
└── docs/                 Hướng dẫn tracking
```

## Kiểm thử từ root

```powershell
Push-Location platform/ladifinal
try { ../../.venv/Scripts/python.exe -m unittest discover -s tests -v } finally { Pop-Location }
```

Dependencies nằm trong `ladifinal/requirements.txt`. Môi trường `.venv` hiện có ở root được giữ lại. Không cần cài lại chỉ vì đổi thư mục.

## Chạy local

```powershell
Push-Location platform/ladifinal
try { ../../.venv/Scripts/python.exe main.py } finally { Pop-Location }
```

`main.py` là entrypoint phát triển hiện có. Trước khi chạy, chọn cấu hình/database phù hợp; không dùng môi trường production để test. File `.env.production` được giữ kín ở `platform/`; tên này không được `load_dotenv()` mặc định tự nạp như `.env`. Không in giá trị cấu hình bí mật.

## Docker

Từ root repo:

```powershell
docker build -t landing-ads:local platform
```

Hoặc vào `platform/` rồi build với context `.`. Không build Dockerfile này bằng context gốc repo. Image vẫn dùng `/app/ladifinal/main.py`; các đường dẫn container hiện có được giữ nguyên.

Compose là cấu hình triển khai đã có, có service/domain/network cụ thể. Không chạy để test tùy tiện. Khi dùng local, đường dẫn volume tương đối tính từ `platform/`; dữ liệu local tương ứng đã được chuyển cùng. Server đang chạy không bị thay đổi; cập nhật checkout/deploy server cần đối chiếu đường dẫn host và volume riêng, không thay cả stack chỉ vì cleanup.

## Tracking

- [Theo dõi click và nhập hồ sơ legacy](docs/click-tracking.md)
- [Hợp đồng với ERP](../docs/architecture/landing-ads-erp.md)

Hướng dẫn tracking có thông tin của phiên bản cũ; kiểm tra trường admin thực tế trước khi dùng. CRM/đơn hàng chính thức thuộc ERP, chưa gỡ màn legacy trong lần dọn này. Source landing để phát triển nằm ở `../landing-pages/`, khác dữ liệu runtime `published/`.
