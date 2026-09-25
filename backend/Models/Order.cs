using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hightech.Api.Models;

public class OrderItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string OrderId { get; set; } = string.Empty;

    [ForeignKey(nameof(OrderId))]
    public Order? Order { get; set; }

    [Required]
    [MaxLength(50)]
    public string ProductId { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    public string Image { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Size { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Color { get; set; } = string.Empty;

    public int Quantity { get; set; } = 1;
}

public class Order
{
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Subtotal { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Discount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ShippingFee { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }

    [Required]
    [MaxLength(150)]
    public string CustomerFullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string CustomerPhone { get; set; } = string.Empty;

    [MaxLength(100)]
    public string CustomerEmail { get; set; } = string.Empty;

    [MaxLength(255)]
    public string CustomerAddress { get; set; } = string.Empty;

    [MaxLength(100)]
    public string CustomerCity { get; set; } = string.Empty;

    public string? CustomerNote { get; set; }

    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "cod"; // cod, qr_momo, bank_transfer, card

    [MaxLength(50)]
    public string Status { get; set; } = "pending"; // pending, processing, shipping, delivered, cancelled

    [MaxLength(50)]
    public string TrackingCode { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? UserId { get; set; }

    public List<OrderItem> Items { get; set; } = new();
}
