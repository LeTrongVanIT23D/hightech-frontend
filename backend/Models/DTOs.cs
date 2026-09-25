namespace Hightech.Api.Models;

public record RegisterRequest(
    string Name,
    string Email,
    string Password,
    string? Phone,
    string? Address
);

public record LoginRequest(
    string Identifier,
    string Password
);

public record AuthResponse(
    bool Success,
    string Message,
    string? Token,
    UserDto? User
);

public record UserDto(
    string Id,
    string Name,
    string Email,
    string? Phone,
    string? Address,
    string Role
);

public record ProductDto(
    string Id,
    string Name,
    decimal Price,
    decimal? OriginalPrice,
    List<string> Images,
    string Category,
    List<string> Sizes,
    List<ProductColor> Colors,
    string Description,
    bool? IsNew,
    bool? IsSale,
    double Rating,
    int Reviews
);

public record CreateProductRequest(
    string Name,
    decimal Price,
    decimal? OriginalPrice,
    List<string> Images,
    string Category,
    List<string> Sizes,
    List<ProductColor> Colors,
    string Description,
    bool? IsNew,
    bool? IsSale
);

public record CreateOrderItemRequest(
    string ProductId,
    string Name,
    decimal Price,
    string Image,
    string Size,
    string Color,
    int Quantity
);

public record CustomerInfoRequest(
    string FullName,
    string Phone,
    string Email,
    string Address,
    string City,
    string? Note
);

public record CreateOrderRequest(
    List<CreateOrderItemRequest> Items,
    decimal Subtotal,
    decimal Discount,
    decimal ShippingFee,
    decimal Total,
    CustomerInfoRequest CustomerInfo,
    string PaymentMethod,
    string? UserId
);

public record UpdateOrderStatusRequest(
    string Status
);

public record ApplyVoucherRequest(
    string Code,
    decimal Subtotal
);

public record ApplyVoucherResponse(
    bool Valid,
    string Message,
    int? DiscountPercent,
    decimal? DiscountAmount
);

public record DashboardStatsResponse(
    decimal TotalRevenue,
    int TotalOrders,
    int TotalProducts,
    int TotalCustomers,
    List<Order> RecentOrders,
    List<MonthlyRevenueDto> MonthlyRevenue
);

public record MonthlyRevenueDto(
    string Month,
    decimal Revenue
);
