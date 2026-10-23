# SỔ TAY HƯỚNG DẪN THAO TÁC CRUD TRỰC TIẾP TRÊN SQL SERVER & KIỂM THỬ REALTIME
## DỰ ÁN HIGHTECH SPORTS (ASP.NET CORE 8 + NEXT.JS 15 + SQL SERVER)

> **Mục tiêu:** Hướng dẫn chi tiết cách thực thi các câu lệnh **CRUD (Create - Read - Update - Delete)** trên cơ sở dữ liệu SQL Server, và quan sát dữ liệu thay đổi **trực tiếp Realtime** ngay trên giao diện Website người dùng (`http://localhost:3000`) và Trang Quản Trị Admin (`http://localhost:3000/admin`).

---

## 1. THÔNG SỐ KẾT NỐI CƠ SỞ DỮ LIỆU SQL SERVER

Hệ thống CSDL SQL Server 2022 đang chạy bên trong Docker Container với thông số:

| Thông số | Giá trị |
|---|---|
| **Container Name** | `hightech-sqlserver` |
| **Server / Host** | `localhost,1433` (hoặc `127.0.0.1,1433`) |
| **Tên Database** | `HightechDb` |
| **User đăng nhập** | `sa` |
| **Password** | `YourStrong@Password123` *(hoặc `123456` theo file `appsettings.json`)* |
| **Trust Server Certificate** | `True` (bắt buộc tích chọn khi dùng công cụ ngoài) |

---

## 2. BA PHƯƠNG THỨC KẾT NỐI VÀ CHẠY LỆNH CRUD

###  Cách 1: Chạy trực tiếp từ Terminal / PowerShell (Không cần cài thêm phần mềm)

Bạn có thể mở terminal (PowerShell trên Windows) và thực thi câu lệnh SQL trực tiếp vào container:

#### 1. Mở cửa sổ tương tác trực tiếp (`sqlcmd`):
```powershell
docker exec -it hightech-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -d HightechDb
```
*Sau khi vào giao diện `1>`, bạn gõ lệnh SQL, sau đó gõ `GO` rồi Enter để chạy.*

#### 2. Hoặc chạy nhanh một câu lệnh SQL từ bên ngoài:
```powershell
docker exec -i hightech-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -d HightechDb -Q "SELECT Id, Name, Price, Category FROM Products;"
```

#### 3. Chạy toàn bộ file mẫu có sẵn:
Dự án đã tạo sẵn file script chuẩn [crud_queries_realtime.sql](./backend/Data/crud_queries_realtime.sql):
```powershell
Get-Content backend/Data/crud_queries_realtime.sql | docker exec -i hightech-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -d HightechDb
```

---

###  Cách 2: Kết nối bằng công cụ đồ họa (SSMS / DBeaver / Azure Data Studio / VS Code)

1. Mở **SQL Server Management Studio (SSMS)** hoặc **DBeaver**.
2. Chọn kết nối mới:
   * **Server name**: `localhost,1433`
   * **Authentication**: `SQL Server Authentication`
   * **Login**: `sa`
   * **Password**: `YourStrong@Password123`
   * Vào tab **Options** / **Connection Properties** $\rightarrow$ Tích chọn **Trust server certificate**.
3. Bấm **Connect** $\rightarrow$ Mở rộng mục **Databases** $\rightarrow$ Chọn **`HightechDb`**.
4. Mở file [backend/Data/crud_queries_realtime.sql](./backend/Data/crud_queries_realtime.sql) và bấm **Execute (F5)**.

---

###  Cách 3: Thao tác CRUD qua Swagger UI API (Chuẩn RESTful)

1. Mở trình duyệt truy cập: [http://localhost:5000/swagger](http://localhost:5000/swagger) (hoặc link Render của bạn: `https://<ten-service>.onrender.com/swagger`).
2. Toàn bộ các API CRUD được gom nhóm rõ ràng:
   * **`/api/products`**: Thêm mới (`POST`), Xem danh sách (`GET`), Cập nhật (`PUT`), Xóa (`DELETE`).
   * **`/api/orders`**: Tạo đơn hàng (`POST`), Tra cứu theo mã tracking (`GET`), Cập nhật trạng thái (`PATCH`).
   * **`/api/vouchers`**: Tạo mã giảm giá (`POST`), Áp dụng voucher (`POST`).

---

## 3. BỘ CÂU LỆNH CRUD SQL MẪU TƯƠNG TÁC REALTIME

### 3.1 Bảng Sản Phẩm (`Products`)

####  [READ] Xem danh sách sản phẩm:
```sql
USE HightechDb;
SELECT Id, Name, Price, OriginalPrice, Category, IsSale, Rating 
FROM Products;
```

####  [CREATE] Thêm một đôi giày mới tinh:
```sql
USE HightechDb;
INSERT INTO Products (
    Id, Name, Price, OriginalPrice, Category, Description,
    IsNew, IsSale, Rating, Reviews, CreatedAt,
    ImagesJson, SizesJson, ColorsJson
)
VALUES (
    'P-REALTIME-99',
    N'Giày Chạy Bộ Siêu Nhẹ Nike Pegasus 40 Turbo',
    2850000,
    3500000,
    N'Giày',
    N'Phiên bản giới hạn công nghệ đệm ZoomX siêu đàn hồi, tối ưu tốc độ chạy bộ đường trường.',
    1, 1, 5.0, 1, GETUTCDATE(),
    '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"]',
    '["40", "41", "42", "43"]',
    '[{"Name":"Xanh Neon","Hex":"#39ff14"},{"Name":"Đen","Hex":"#000000"}]'
);
```

#### ✏️ [UPDATE] Đổi giá sản phẩm Flash Sale Realtime:
```sql
USE HightechDb;
-- Giảm giá đôi Air Max Phantom Elite (Id = '1') xuống còn 1.990.000₫
UPDATE Products
SET Price = 1990000,
    OriginalPrice = 3500000,
    IsSale = 1,
    Name = N'Air Max Phantom Elite (Flash Sale Hôm Nay)'
WHERE Id = '1';
```

#### 🗑️ [DELETE] Xóa sản phẩm mẫu:
```sql
USE HightechDb;
DELETE FROM Products
WHERE Id = 'P-REALTIME-99';
```

---

### 3.2 Bảng Đơn Hàng (`Orders` & `OrderItems`)

####  [READ] Xem đơn hàng và trạng thái hiện tại:
```sql
USE HightechDb;
SELECT Id, TrackingCode, CustomerFullName, CustomerPhone, Total, Status, PaymentMethod, CreatedAt
FROM Orders
ORDER BY CreatedAt DESC;
```

#### ✏️ [UPDATE] Cập nhật trạng thái đơn hàng sang "Đã giao hàng" (delivered):
```sql
USE HightechDb;
UPDATE Orders
SET Status = 'delivered'
WHERE Id = 'ORD-001';
```
*(Các trạng thái hợp lệ của đơn hàng: `pending`, `processing`, `shipping`, `delivered`, `cancelled`)*.

---

### 3.3 Bảng Mã Giảm Giá (`Vouchers`)

####  [CREATE] Tạo mã giảm giá 50% tri ân khách hàng:
```sql
USE HightechDb;
INSERT INTO Vouchers (Code, DiscountPercent, MinSubtotal, Description, ExpiryDate, IsActive)
VALUES ('SALE50VIP', 50, 1000000, N'Giảm 50% đơn từ 1.000.000₫', DATEADD(month, 6, GETUTCDATE()), 1);
```

#### ✏️ [UPDATE] Tạm khóa hoặc mở khóa mã Voucher Realtime:
```sql
USE HightechDb;
-- Khóa mã (khách nhập trên web sẽ báo lỗi)
UPDATE Vouchers SET IsActive = 0 WHERE Code = 'SALE50VIP';

-- Kích hoạt lại
UPDATE Vouchers SET IsActive = 1 WHERE Code = 'SALE50VIP';
```

---

## 4. KỊCH BẢN THỰC CHIẾN: KIỂM THỬ THAY ĐỔI REALTIME TRÊN GIAO DIỆN WEB

Để trình diễn thuyết phục khi báo cáo đồ án hoặc nghiệm thu sản phẩm:

```mermaid
flowchart LR
    A["1. MỞ GIAO DIỆN WEB<br/>http://localhost:3000"] --> B["2. CHẠY LỆNH SQL UPDATE<br/>Đổi giá từ 3.5tr -> 1.99tr"]
    B --> C["3. F5 / CHUYỂN TRANG WEB<br/>Dữ liệu lập tức thay đổi Realtime!"]
```

### Kịch bản 1: Cập nhật giá sản phẩm Flash Sale
1. Mở trình duyệt vào trang chủ: `http://localhost:3000`.
2. Quan sát sản phẩm đầu tiên: **Air Max Phantom Elite** đang có giá là `3.500.000₫`.
3. Mở Terminal chạy lệnh:
   ```powershell
   docker exec -i hightech-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -d HightechDb -Q "UPDATE Products SET Price = 1990000, Name = N'Air Max Phantom Elite (Flash Sale)' WHERE Id = '1';"
   ```
4. Quay lại trình duyệt và F5: Giá sản phẩm trên giao diện chuyển thành **`1.990.000₫`** ngay lập tức!

### Kịch bản 2: Thay đổi trạng thái đơn hàng trên Dashboard Quản Trị (Admin)
1. Mở trang quản trị: `http://localhost:3000/admin`.
2. Vào mục Quản lý đơn hàng, quan sát đơn hàng đang ở trạng thái `pending` (Chờ xử lý - màu vàng).
3. Mở Terminal chạy lệnh:
   ```powershell
   docker exec -i hightech-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -d HightechDb -Q "UPDATE Orders SET Status = 'delivered' WHERE Id = 'ORD-001';"
   ```
4. F5 lại trang Admin: Đơn hàng chuyển ngay sang trạng thái **Đã giao hàng** (màu xanh lá) và số liệu thống kê doanh thu được cập nhật theo thời gian thực!

---

## 5. BẢNG TỔNG HỢP CÁC TRƯỜNG DỮ LIỆU CẦN LƯU Ý KHI THAO TÁC

| Bảng | Cột dữ liệu | Kiểu dữ liệu | Lưu ý quan trọng |
|---|---|---|---|
| `Products` | `ImagesJson` | `NVARCHAR(MAX)` | Định dạng mảng JSON: `["https://link-anh-1.jpg", "https://link-anh-2.jpg"]` |
| `Products` | `SizesJson` | `NVARCHAR(MAX)` | Định dạng mảng JSON: `["39", "40", "41", "42"]` |
| `Products` | `ColorsJson` | `NVARCHAR(MAX)` | Mảng JSON đối tượng: `[{"Name":"Đen","Hex":"#000000"}]` |
| `Orders` | `Status` | `NVARCHAR(50)` | Nhận các giá trị chuẩn: `pending`, `processing`, `shipping`, `delivered`, `cancelled` |
| `Orders` | `PaymentMethod` | `NVARCHAR(50)` | Các hình thức: `cod`, `qr_momo`, `bank_transfer`, `card` |
| `Users` | `Role` | `NVARCHAR(20)` | Phân quyền: `admin` (quản trị viên) hoặc `user` (khách hàng thông thường) |
| `Vouchers` | `IsActive` | `BIT` | `1` là đang hoạt động, `0` là đã tạm ngưng |
