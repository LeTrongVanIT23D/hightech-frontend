using System.ComponentModel.DataAnnotations;

namespace Hightech.Api.Models;

public class User
{
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Phone { get; set; }

    [MaxLength(255)]
    public string? Address { get; set; }

    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = "user"; // "admin" or "user"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
