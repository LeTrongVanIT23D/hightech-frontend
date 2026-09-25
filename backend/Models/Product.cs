using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Hightech.Api.Models;

public class ProductColor
{
    public string Name { get; set; } = string.Empty;
    public string Hex { get; set; } = string.Empty;
}

public class Product
{
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    [Required]
    [MaxLength(250)]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? OriginalPrice { get; set; }

    [MaxLength(100)]
    public string Category { get; set; } = "Giày";

    public string Description { get; set; } = string.Empty;

    public bool IsNew { get; set; } = false;

    public bool IsSale { get; set; } = false;

    public double Rating { get; set; } = 5.0;

    public int Reviews { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // JSON Serialized columns for SQL Server
    public string ImagesJson { get; set; } = "[]";
    public string SizesJson { get; set; } = "[]";
    public string ColorsJson { get; set; } = "[]";

    [NotMapped]
    public List<string> Images
    {
        get => string.IsNullOrEmpty(ImagesJson)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(ImagesJson) ?? new List<string>();
        set => ImagesJson = JsonSerializer.Serialize(value ?? new List<string>());
    }

    [NotMapped]
    public List<string> Sizes
    {
        get => string.IsNullOrEmpty(SizesJson)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(SizesJson) ?? new List<string>();
        set => SizesJson = JsonSerializer.Serialize(value ?? new List<string>());
    }

    [NotMapped]
    public List<ProductColor> Colors
    {
        get => string.IsNullOrEmpty(ColorsJson)
            ? new List<ProductColor>()
            : JsonSerializer.Deserialize<List<ProductColor>>(ColorsJson) ?? new List<ProductColor>();
        set => ColorsJson = JsonSerializer.Serialize(value ?? new List<ProductColor>());
    }
}
