# MO TA SAN PHAM
## Tai lieu muc tieu he thong (System Objectives Document)

- San pham: Landing Page Manager Platform
- Phien ban tai lieu: 1.1
- Ngay cap nhat: 27/02/2026
- Don vi so huu: `[Ten cong ty cua ban]`
- Trang thai: Ban dung de pre-sale va proposal

## 1. Muc dich tai lieu
Tai lieu nay mo ta muc tieu kinh doanh, muc tieu he thong, pham vi cung cap va chi so thanh cong cua Landing Page Manager Platform.  
Muc tieu su dung la lam co so thong nhat cho 3 nhom: Sales, Van hanh trien khai, va Khach hang quyet dinh mua.

## 2. Tong quan dieu hanh
Landing Page Manager Platform la he thong giup doanh nghiep trien khai nhanh cac landing page marketing theo quy trinh ZIP-to-Publish, quan ly tap trung tren admin panel, va tich hop tracking theo tung chien dich.

Gia tri cot loi:
- Rut ngan time-to-market cho chien dich.
- Chuan hoa tracking va giam loi thao tac thu cong.
- Giam phu thuoc vao dev trong van hanh hang ngay.
- De dang mo rong so luong landing page khi doanh nghiep tang truong.

## 3. Van de thi truong can giai quyet
- Dung landing page cham vi phu thuoc lap trinh vien.
- Cac ma tracking bi gan sai/thieu/khong dong nhat.
- Khong co noi quan ly tap trung giua trang chu, landing pages, agent phu trach.
- Kho do luong, kho bao tri khi so chien dich tang nhanh.

## 4. Tam nhin san pham (Vision)
Tro thanh nen tang quan tri landing page gon nhe, de dung, de trien khai, phu hop SMEs va agencies can van hanh nhieu chien dich cung luc voi chi phi hop ly.

## 5. Muc tieu kinh doanh
- Giam thoi gian len song 1 landing page moi xuong muc <= 30 phut sau khi co file ZIP dung chuan.
- Dat ty le landing page co tracking hop le >= 95%.
- Tang nang suat doi marketing/ops toi thieu 2-3 lan so voi quy trinh chen tay.
- San pham hoa de ban theo 3 mo hinh: license, trien khai rieng, managed service.

## 6. Muc tieu he thong
He thong phai dap ung cac muc tieu sau:
- Quan tri landing page tap trung tren web admin.
- Upload va publish website dang ZIP folder.
- Tu dong validate cau truc file va tu dong xu ly asset path.
- Tu dong inject tracking (GA4 ID, Facebook Pixel ID, TikTok Pixel ID, Phone/Zalo/Form tracking variables).
- Phuc vu landing page theo URL dong `/landing/{subdomain}`.
- Quan ly trang thai `active/paused`.
- Quan ly agent phu trach tung landing page.
- Quan ly homepage rieng va co che activate homepage dang su dung.
- Cung cap endpoint `/health` de monitor tinh trang he thong.

## 7. Pham vi cung cap
### 7.1 Trong pham vi (In Scope)
- Admin login va bao ve route quan tri.
- CRUD landing pages.
- CRUD agents.
- Upload ZIP, extract, validate, publish vao thu muc van hanh.
- Quan ly va cap nhat tracking theo landing page.
- Quan ly homepage active.
- API cho cac thao tac quan tri chinh.
- Docker deployment va huong dan van hanh co ban.

### 7.2 Ngoai pham vi (Out of Scope - hien tai)
- Workflow phe duyet nhieu cap.
- Billing/thu phi tu dong tich hop payment gateway.
- Multi-tenant enterprise cap do tach DB hoan toan theo tung tenant.
- Dashboard BI nang cao (cohort, attribution da kenh, LTV).

## 8. Ho so nguoi dung muc tieu
- Chu doanh nghiep SME can chay chien dich lead generation nhanh.
- Doi marketing in-house muon tu chu upload/publish.
- Agency quan ly nhieu landing page cho nhieu nhan su sale.
- Doi van hanh can mot he thong de quan tri tap trung.

## 9. Gia tri khac biet (USP)
- ZIP-to-Publish: trien khai nhanh, it phu thuoc ky thuat.
- Tracking chuan hoa theo tung landing page, giam sai sot.
- Gom homepage + landing + agent trong cung mot he thong.
- Kien truc module ro rang, de nang cap va bao tri.
- Phu hop self-hosted hoac managed deployment.

## 10. Yeu cau phi chuc nang (Non-functional)
### 10.1 Bao mat
- Bat buoc xac thuc admin cho cac API/route quan tri.
- Validate dinh dang cac tracking IDs.
- Chan duong dan nguy hiem khi xu ly va phuc vu file.

### 10.2 Hieu nang
- Asset tinh co cache header.
- Kha nang dap ung tai phu hop mo hinh SMEs/agencies.

### 10.3 San sang va van hanh
- Co `/health` de monitor.
- Ho tro Docker cho moi truong production.
- Co cau truc logs co the theo doi khi su co.

### 10.4 Bao tri mo rong
- Tach route theo blueprint chuc nang.
- De bo sung them module nghiep vu moi.

## 11. KPI thanh cong
- Thoi gian publish landing page moi: <= 30 phut.
- Ty le tracking hop le tren landing dang active: >= 95%.
- Ty le chien dich len song dung deadline: >= 95%.
- Uptime dich vu muc tieu theo thang: >= 99.5%.
- Ty le loi upload ZIP do sai cau truc sau onboarding: <= 10%.

## 12. Mo hinh thuong mai de xuat
### Goi Standard
- Cai dat 1 he thong.
- Dao tao van hanh co ban.
- Bao hanh ky thuat 1-3 thang.

### Goi Professional
- Tuy bien giao dien/luong van hanh.
- Ho tro migration du lieu co ban.
- SLA ho tro gio hanh chinh.

### Goi Managed Service
- Van hanh he thong boi doi ky thuat cua ben cung cap.
- Theo doi suc khoe he thong, backup, cap nhat.
- SLA 24/7 theo hop dong.

## 13. Ke hoach trien khai mau
- Giai doan 1 - Khao sat va chot scope: 1-3 ngay.
- Giai doan 2 - Cai dat va cau hinh moi truong: 1-2 ngay.
- Giai doan 3 - Kiem thu nghiep vu va nghiem thu: 2-5 ngay.
- Giai doan 4 - Dao tao van hanh va ban giao: 0.5-1 ngay.

## 14. Rui ro va bien phap kiem soat
- Rui ro: File ZIP dau vao khong dung chuan.
- Kiem soat: Checklist upload + validation tu dong.

- Rui ro: Nguoi dung nhap sai tracking IDs.
- Kiem soat: Rule validate + mau huong dan nhap lieu.

- Rui ro: Tang tai dot bien khi chay nhieu chien dich.
- Kiem soat: Tang tai nguyen, cache static, quy trinh monitor.

## 15. Tuyen bo gia tri ban hang
Landing Page Manager Platform la giai phap de doanh nghiep va agency trien khai landing page nhanh, do luong chuan, van hanh tap trung, va toi uu chi phi theo thang.  
Day la nen tang phu hop de ban duoi dang trien khai tron goi, cho thue he thong, hoac managed service theo SLA.
