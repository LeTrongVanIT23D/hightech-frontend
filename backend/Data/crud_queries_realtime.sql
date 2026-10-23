-- =========================================================================
-- BỘ TRUY VẤN CRUD SQL SERVER TƯƠNG TÁC DỮ LIỆU REALTIME
-- DỰ ÁN: HIGHTECH SPORTS (ASP.NET CORE 8 + NEXT.JS + SQL SERVER)
-- =========================================================================

USE HightechDb;
GO

-- =========================================================================
-- PHẦN 1: BẢNG PRODUCTS (QUẢN LÝ SẢN PHẨM THỂ THAO)
-- =========================================================================

-- 1. [READ] Xem danh sách toàn bộ sản phẩm hiện tại
SELECT Id, Name, Price, OriginalPrice, Category, IsNew, IsSale, Rating, Reviews, CreatedAt
FROM Products
ORDER BY CreatedAt DESC;
GO

-- 2. [CREATE] Thêm một sản phẩm thể thao mới tinh
-- Sau khi chạy lệnh này, F5 lại trang http://localhost:3000 sẽ thấy sản phẩm xuất hiện ngay!
INSERT INTO Products (
    Id, Name, Price, OriginalPrice, Category, Description,
    IsNew, IsSale, Rating, Reviews, CreatedAt,
    ImagesJson, SizesJson, ColorsJson
)
VALUES (
    'P-REALTIME-01',
    N'Giày Chạy Bộ Siêu Nhẹ Nike Pegasus 40 Turbo',
    2850000,
    3500000,
    N'Giày',
    N'Phiên bản giới hạn công nghệ đệm ZoomX siêu đàn hồi, tối ưu tốc độ chạy bộ đường trường.',
    1, -- IsNew: True
    1, -- IsSale: True
    5.0,
    1,
    GETUTCDATE(),
    '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"]',
    '["40", "41", "42", "43"]',
    '[{"Name":"Xanh Neon","Hex":"#39ff14"},{"Name":"Đen","Hex":"#000000"}]'
);
GO

-- 3. [UPDATE] Thay đổi giá sản phẩm & Bật chế độ Flash Sale Realtime
-- Thay đổi giá của sản phẩm có Id = '1' (Air Max Phantom Elite) từ 3.500.000đ xuống 1.990.000đ
UPDATE Products
SET Price = 1990000,
    OriginalPrice = 3500000,
    IsSale = 1,
    Name = N'Air Max Phantom Elite (Flash Sale Hôm Nay)'
WHERE Id = '1';
GO

-- 4. [UPDATE] Đổi danh mục và tăng đánh giá sao (Rating/Reviews)
UPDATE Products
SET Rating = 4.9,
    Reviews = Reviews + 10
WHERE Id = 'P-REALTIME-01';
GO

-- 5. [DELETE] Xóa sản phẩm thử nghiệm vừa tạo
DELETE FROM Products
WHERE Id = 'P-REALTIME-01';
GO


-- =========================================================================
-- PHẦN 2: BẢNG ORDERS & ORDERITEMS (QUẢN LÝ ĐƠN HÀNG REALTIME)
-- =========================================================================

-- 1. [READ] Xem danh sách đơn hàng và trạng thái hiện tại
SELECT Id, TrackingCode, CustomerFullName, CustomerPhone, Total, Status, PaymentMethod, CreatedAt
FROM Orders
ORDER BY CreatedAt DESC;
GO

-- 2. [CREATE] Tạo đơn hàng mới cho khách hàng
INSERT INTO Orders (
    Id, CreatedAt, Subtotal, Discount, ShippingFee, Total,
    CustomerFullName, CustomerPhone, CustomerEmail,
    CustomerAddress, CustomerCity, CustomerNote,
    PaymentMethod, Status, TrackingCode, UserId
)
VALUES (
    'ORD-TEST-999',
    GETUTCDATE(),
    2850000,
    0,
    30000,
    2880000,
    N'Trần Minh Hoàng',
    '0905999888',
    'hoang.tran@gmail.com',
    N'123 Nguyễn Văn Linh',
    N'Đà Nẵng',
    N'Giao hàng giờ hành chính',
    'cod',
    'pending', -- Trạng thái: pending (chờ xử lý)
    'HT-999888',
    'U-001'
);

-- Thêm chi tiết món hàng vào bảng OrderItems
INSERT INTO OrderItems (
    OrderId, ProductId, Name, Price, Image, Size, Color, Quantity
)
VALUES (
    'ORD-TEST-999',
    '1',
    N'Air Max Phantom Elite',
    2850000,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    '42',
    N'Đen',
    1
);
GO

-- 3. [UPDATE] Chuyển trạng thái đơn hàng sang "Đã giao hàng" (delivered) Realtime
-- Sau khi chạy lệnh này, mở trang Admin http://localhost:3000/admin để thấy trạng thái đổi màu xanh lá!
UPDATE Orders
SET Status = 'delivered'
WHERE Id = 'ORD-TEST-999';
GO

-- 4. [UPDATE] Cập nhật hình thức thanh toán và ghi chú đơn hàng
UPDATE Orders
SET PaymentMethod = 'qr_momo',
    CustomerNote = N'Đã thanh toán qua MoMo thành công'
WHERE Id = 'ORD-TEST-999';
GO

-- 5. [DELETE] Xóa đơn hàng thử nghiệm (Nhờ ràng buộc Cascade nên OrderItems tự động bị xóa theo)
DELETE FROM Orders
WHERE Id = 'ORD-TEST-999';
GO


-- =========================================================================
-- PHẦN 3: BẢNG VOUCHERS (MÃ GIẢM GIÁ KHUYẾN MÃI)
-- =========================================================================

-- 1. [READ] Xem tất cả Voucher đang có hiệu lực
SELECT Code, DiscountPercent, MinSubtotal, Description, ExpiryDate, IsActive
FROM Vouchers;
GO

-- 2. [CREATE] Tạo mã Voucher siêu giảm giá 50%
INSERT INTO Vouchers (
    Code, DiscountPercent, MinSubtotal, Description, ExpiryDate, IsActive
)
VALUES (
    'SALE50VIP',
    50,
    1000000,
    N'Mã tri ân đặc biệt giảm 50% cho đơn từ 1 triệu đồng',
    DATEADD(month, 6, GETUTCDATE()),
    1
);
GO

-- 3. [UPDATE] Kích hoạt hoặc tạm khóa mã giảm giá Realtime
-- Tạm khóa mã (Khách hàng nhập trên web sẽ báo mã không hợp lệ)
UPDATE Vouchers
SET IsActive = 0
WHERE Code = 'SALE50VIP';
GO

-- Mở khóa lại mã
UPDATE Vouchers
SET IsActive = 1
WHERE Code = 'SALE50VIP';
GO

-- 4. [DELETE] Xóa mã Voucher
DELETE FROM Vouchers
WHERE Code = 'SALE50VIP';
GO


-- =========================================================================
-- PHẦN 4: BẢNG USERS (TÀI KHOẢN VÀ PHÂN QUYỀN)
-- =========================================================================

-- 1. [READ] Xem danh sách người dùng trong hệ thống
SELECT Id, Name, Email, Phone, Role, CreatedAt
FROM Users;
GO

-- 2. [CREATE] Tạo một tài khoản nhân viên / Admin mới
INSERT INTO Users (
    Id, Name, Email, PasswordHash, Phone, Address, Role, CreatedAt
)
VALUES (
    'U-STAFF-01',
    N'Nhân Viên Quản Kho',
    'staff@hightech.vn',
    -- Mật khẩu mặc định băm BCrypt của "123456"
    '$2a$11$w1B0z51i1jQcE79oP4sNTe7Qz45MhXFz2F0fA7jF9/eC1g7rK8aGy',
    '0905111222',
    N'Kho Hàng HIGHTECH Đà Nẵng',
    'admin',
    GETUTCDATE()
);
GO

-- 3. [UPDATE] Nâng cấp quyền người dùng thường thành Admin
UPDATE Users
SET Role = 'admin'
WHERE Email = 'an.nguyen@gmail.com';
GO

-- 4. [DELETE] Xóa tài khoản nhân viên vừa tạo
DELETE FROM Users
WHERE Id = 'U-STAFF-01';
GO

-- =========================================================================
-- KIỂM TRA TỔNG QUAN TẤT CẢ DỮ LIỆU
-- =========================================================================
SELECT 
    (SELECT COUNT(*) FROM Products) AS TongSanPham,
    (SELECT COUNT(*) FROM Orders) AS TongDonHang,
    (SELECT COUNT(*) FROM Vouchers) AS TongVoucher,
    (SELECT COUNT(*) FROM Users) AS TongNguoiDung;
GO
