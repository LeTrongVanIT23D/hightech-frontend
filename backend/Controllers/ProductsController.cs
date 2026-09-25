using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hightech.Api.Data;
using Hightech.Api.Models;

namespace Hightech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? sortBy = "default")
    {
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && category.ToLower() != "all")
        {
            query = query.Where(p => p.Category.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(searchLower) || p.Description.ToLower().Contains(searchLower));
        }

        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= maxPrice.Value);
        }

        query = sortBy?.ToLower() switch
        {
            "price-asc" => query.OrderBy(p => p.Price),
            "price-desc" => query.OrderByDescending(p => p.Price),
            "rating" => query.OrderByDescending(p => p.Rating),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var products = await query.ToListAsync();
        var dtos = products.Select(p => MapToDto(p));

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(string id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Không tìm thấy sản phẩm có mã {id}" });
        }

        return Ok(MapToDto(product));
    }

    [HttpGet("categories")]
    public async Task<ActionResult> GetCategories()
    {
        var categories = await _context.Products
            .GroupBy(p => p.Category)
            .Select(g => new
            {
                Name = g.Key,
                Slug = g.Key.ToLower(),
                Count = g.Count(),
                Image = g.Select(p => p.ImagesJson).FirstOrDefault()
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductRequest request)
    {
        var product = new Product
        {
            Id = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString(),
            Name = request.Name,
            Price = request.Price,
            OriginalPrice = request.OriginalPrice,
            Category = request.Category,
            Description = request.Description,
            IsNew = request.IsNew ?? false,
            IsSale = request.IsSale ?? false,
            Images = request.Images,
            Sizes = request.Sizes,
            Colors = request.Colors,
            Rating = 5.0,
            Reviews = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, MapToDto(product));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(string id, [FromBody] CreateProductRequest request)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Không tìm thấy sản phẩm có mã {id}" });
        }

        product.Name = request.Name;
        product.Price = request.Price;
        product.OriginalPrice = request.OriginalPrice;
        product.Category = request.Category;
        product.Description = request.Description;
        product.IsNew = request.IsNew ?? product.IsNew;
        product.IsSale = request.IsSale ?? product.IsSale;
        product.Images = request.Images;
        product.Sizes = request.Sizes;
        product.Colors = request.Colors;

        await _context.SaveChangesAsync();
        return Ok(MapToDto(product));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Không tìm thấy sản phẩm có mã {id}" });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa sản phẩm thành công" });
    }

    private static ProductDto MapToDto(Product p)
    {
        return new ProductDto(
            p.Id,
            p.Name,
            p.Price,
            p.OriginalPrice,
            p.Images,
            p.Category,
            p.Sizes,
            p.Colors,
            p.Description,
            p.IsNew,
            p.IsSale,
            p.Rating,
            p.Reviews
        );
    }
}
