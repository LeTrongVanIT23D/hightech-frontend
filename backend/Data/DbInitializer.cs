using Hightech.Api.Models;
using System.Text.Json;

namespace Hightech.Api.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        context.Database.EnsureCreated();

        // 1. Seed Users
        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new User
                {
                    Id = "U-ADMIN",
                    Name = "Admin HIGHTECH",
                    Email = "admin@hightech.vn",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Phone = "19001234",
                    Address = "Trụ sở HIGHTECH Sports, Đà Nẵng",
                    Role = "admin",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = "U-001",
                    Name = "Nguyễn Văn An",
                    Email = "an.nguyen@gmail.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Phone = "0905123456",
                    Address = "456 Lê Duẩn, Q. Thanh Khê, Đà Nẵng",
                    Role = "user",
                    CreatedAt = DateTime.UtcNow
                }
            };
            context.Users.AddRange(users);
            context.SaveChanges();
        }

        // 2. Seed Vouchers
        if (!context.Vouchers.Any())
        {
            var vouchers = new List<Voucher>
            {
                new Voucher
                {
                    Code = "HIGHTECH10",
                    DiscountPercent = 10,
                    MinSubtotal = 500000,
                    Description = "Giảm 10% cho đơn hàng từ 500.000₫",
                    ExpiryDate = DateTime.UtcNow.AddYears(1),
                    IsActive = true
                },
                new Voucher
                {
                    Code = "SPORTVIP20",
                    DiscountPercent = 20,
                    MinSubtotal = 2000000,
                    Description = "Giảm 20% cho đơn hàng từ 2.000.000₫",
                    ExpiryDate = DateTime.UtcNow.AddYears(1),
                    IsActive = true
                }
            };
            context.Vouchers.AddRange(vouchers);
            context.SaveChanges();
        }

        // 3. Seed Products
        if (!context.Products.Any())
        {
            var products = new List<Product>
            {
                new Product
                {
                    Id = "1",
                    Name = "Air Max Phantom Elite",
                    Price = 3500000,
                    OriginalPrice = 4200000,
                    Category = "Giày",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
                        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
                        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800"
                    },
                    Sizes = new List<string> { "39", "40", "41", "42", "43", "44" },
                    Colors = new List<ProductColor>
                    {
                        new() { Name = "Đỏ", Hex = "#ff0000" },
                        new() { Name = "Đen", Hex = "#000000" },
                        new() { Name = "Trắng", Hex = "#ffffff" }
                    },
                    Description = "Giày chạy bộ cao cấp với đệm Air Max thế hệ mới, mang lại sự êm ái tối đa. Thiết kế khí động học giúp tối ưu hiệu suất chạy. Upper mesh thoáng khí, đế ngoài cao su bền bỉ.",
                    IsNew = true,
                    IsSale = true,
                    Rating = 4.8,
                    Reviews = 256
                },
                new Product
                {
                    Id = "2",
                    Name = "UltraBoost X Pro",
                    Price = 4200000,
                    OriginalPrice = 4800000,
                    Category = "Giày",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
                        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800"
                    },
                    Sizes = new List<string> { "39", "40", "41", "42", "43" },
                    Colors = new List<ProductColor>
                    {
                        new() { Name = "Đen", Hex = "#000000" },
                        new() { Name = "Xám", Hex = "#888888" }
                    },
                    Description = "Công nghệ Boost mang lại khả năng hoàn trả năng lượng vượt trội. Thiết kế ôm chân với Primeknit 360, đế Continental™ cho độ bám tốt trên mọi bề mặt.",
                    IsNew = true,
                    IsSale = false,
                    Rating = 4.9,
                    Reviews = 412
                },
                new Product
                {
                    Id = "3",
                    Name = "Dri-FIT Tech Pro Tee",
                    Price = 750000,
                    OriginalPrice = 950000,
                    Category = "Quần áo",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800",
                        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"
                    },
                    Sizes = new List<string> { "S", "M", "L", "XL", "XXL" },
                    Colors = new List<ProductColor>
                    {
                        new() { Name = "Đen", Hex = "#000000" },
                        new() { Name = "Trắng", Hex = "#ffffff" },
                        new() { Name = "Xanh navy", Hex = "#1e3a5f" }
                    },
                    Description = "Áo tập luyện công nghệ Dri-FIT thấm hút mồ hôi cực nhanh, giữ cơ thể luôn khô ráo. Vải co giãn 4 chiều mang lại sự thoải mái tối đa trong mọi chuyển động.",
                    IsNew = false,
                    IsSale = true,
                    Rating = 4.6,
                    Reviews = 189
                },
                new Product
                {
                    Id = "4",
                    Name = "Flex Stride 2-in-1 Shorts",
                    Price = 850000,
                    OriginalPrice = 1050000,
                    Category = "Quần áo",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800"
                    },
                    Sizes = new List<string> { "S", "M", "L", "XL" },
                    Colors = new List<ProductColor>
                    {
                        new() { Name = "Đen", Hex = "#000000" },
                        new() { Name = "Xám đậm", Hex = "#333333" }
                    },
                    Description = "Quần chạy bộ 2 trong 1 tích hợp lớp lót nén cơ, giảm rung lắc cơ bắp khi vận động cường độ cao. Túi khóa kéo chống nước bảo vệ điện thoại tiện lợi.",
                    IsNew = true,
                    IsSale = false,
                    Rating = 4.7,
                    Reviews = 143
                },
                new Product
                {
                    Id = "5",
                    Name = "Pro Elite Training Duffel",
                    Price = 1200000,
                    OriginalPrice = 1500000,
                    Category = "Phụ kiện",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"
                    },
                    Sizes = new List<string> { "One Size" },
                    Colors = new List<ProductColor>
                    {
                        new() { Name = "Đen", Hex = "#000000" },
                        new() { Name = "Xám quân đội", Hex = "#4a5568" }
                    },
                    Description = "Túi trống thể thao 45L chất liệu Cordura chống rách và chống nước. Ngăn riêng để giày có lỗ thông khí, quai đeo đệm êm ái giảm áp lực vai.",
                    IsNew = false,
                    IsSale = true,
                    Rating = 4.9,
                    Reviews = 320
                },
                new Product
                {
                    Id = "6",
                    Name = "HydroShield 1L Water Bottle",
                    Price = 450000,
                    OriginalPrice = 550000,
                    Category = "Phụ kiện",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800"
                    },
                    Sizes = new List<string> { "1000ml" },
                    Colors = new List<ProductColor>
                    {
                        new() { Name = "Đen mờ", Hex = "#1a1a1a" },
                        new() { Name = "Đỏ thể thao", Hex = "#ff0000" }
                    },
                    Description = "Bình nước giữ nhiệt thép không gỉ 18/8, giữ lạnh 24h và giữ nóng 12h. Nắp bật một chạm tiện lợi khi đang tập luyện, không chứa BPA.",
                    IsNew = false,
                    IsSale = false,
                    Rating = 4.5,
                    Reviews = 98
                },
                new Product
                {
                    Id = "7",
                    Name = "Speed Rope Pro 3.0",
                    Price = 350000,
                    OriginalPrice = 450000,
                    Category = "Thiết bị",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800"
                    },
                    Sizes = new List<string> { "3m có thể điều chỉnh" },
                    Colors = new List<ProductColor>
                    {
                        new() { Name = "Đỏ - Đen", Hex = "#ff0000" }
                    },
                    Description = "Dây nhảy tốc độ cao với vòng bi kép 360 độ, dây cáp thép bọc PVC chống xoắn. Tay cầm hợp kim nhôm chống trượt, phù hợp tập cardio và boxing.",
                    IsNew = true,
                    IsSale = true,
                    Rating = 4.8,
                    Reviews = 175
                },
                new Product
                {
                    Id = "8",
                    Name = "Resistance Bands Set 5-in-1",
                    Price = 520000,
                    OriginalPrice = 650000,
                    Category = "Thiết bị",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800"
                    },
                    Sizes = new List<string> { "Set 5 mức lực" },
                    Colors = new List<ProductColor>
                    {
                        new() { Name = "Đa màu", Hex = "#ff0000" }
                    },
                    Description = "Bộ dây kháng lực cao su thiên nhiên 100% gồm 5 mức từ 10 lbs đến 50 lbs. Kèm móc treo cửa, quai cổ chân và túi đựng tiện lợi khi đi du lịch.",
                    IsNew = false,
                    IsSale = false,
                    Rating = 4.7,
                    Reviews = 210
                }
            };
            context.Products.AddRange(products);
            context.SaveChanges();
        }

        // 4. Seed Orders
        if (!context.Orders.Any())
        {
            var sampleOrder = new Order
            {
                Id = "HT-98421",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                Subtotal = 3500000,
                Discount = 350000,
                ShippingFee = 0,
                Total = 3150000,
                CustomerFullName = "Nguyễn Văn An",
                CustomerPhone = "0905123456",
                CustomerEmail = "an.nguyen@gmail.com",
                CustomerAddress = "456 Lê Duẩn, Q. Thanh Khê",
                CustomerCity = "Đà Nẵng",
                CustomerNote = "Giao giờ hành chính giúp tôi",
                PaymentMethod = "cod",
                Status = "shipping",
                TrackingCode = "VNP-98421-DN",
                UserId = "U-001",
                Items = new List<OrderItem>
                {
                    new OrderItem
                    {
                        ProductId = "1",
                        Name = "Air Max Phantom Elite",
                        Price = 3500000,
                        Image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
                        Size = "42",
                        Color = "Đỏ",
                        Quantity = 1
                    }
                }
            };
            context.Orders.Add(sampleOrder);
            context.SaveChanges();
        }
    }
}
