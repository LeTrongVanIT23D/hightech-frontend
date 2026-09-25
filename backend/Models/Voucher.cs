using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hightech.Api.Models;

public class Voucher
{
    [Key]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    public int DiscountPercent { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal MinSubtotal { get; set; }

    [MaxLength(255)]
    public string Description { get; set; } = string.Empty;

    public DateTime ExpiryDate { get; set; } = DateTime.UtcNow.AddMonths(3);

    public bool IsActive { get; set; } = true;
}
