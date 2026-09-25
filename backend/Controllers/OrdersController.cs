using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hightech.Api.Data;
using Hightech.Api.Models;

namespace Hightech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders([FromQuery] string? status)
    {
        var query = _context.Orders.Include(o => o.Items).AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all")
        {
            query = query.Where(o => o.Status.ToLower() == status.ToLower());
        }

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(string id)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = $"Không tìm thấy đơn hàng {id}" });
        }

        return Ok(order);
    }

    [HttpGet("tracking/{code}")]
    public async Task<ActionResult<Order>> TrackOrder(string code)
    {
        var cleanCode = code.Trim().ToUpper();
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.TrackingCode.ToUpper() == cleanCode || o.Id.ToUpper() == cleanCode);

        if (order == null)
        {
            return NotFound(new { message = $"Không tìm thấy thông tin vận đơn cho mã: {code}" });
        }

        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (request.Items == null || !request.Items.Any())
        {
            return BadRequest(new { message = "Đơn hàng phải chứa ít nhất 1 sản phẩm" });
        }

        var randomNum = new Random().Next(10000, 99999);
        var orderId = $"HT-{randomNum}";
        var trackingCode = $"VNP-{randomNum}-DN";

        var order = new Order
        {
            Id = orderId,
            CreatedAt = DateTime.UtcNow,
            Subtotal = request.Subtotal,
            Discount = request.Discount,
            ShippingFee = request.ShippingFee,
            Total = request.Total,
            CustomerFullName = request.CustomerInfo.FullName,
            CustomerPhone = request.CustomerInfo.Phone,
            CustomerEmail = request.CustomerInfo.Email,
            CustomerAddress = request.CustomerInfo.Address,
            CustomerCity = request.CustomerInfo.City,
            CustomerNote = request.CustomerInfo.Note,
            PaymentMethod = request.PaymentMethod,
            Status = "pending",
            TrackingCode = trackingCode,
            UserId = request.UserId,
            Items = request.Items.Select(item => new OrderItem
            {
                OrderId = orderId,
                ProductId = item.ProductId,
                Name = item.Name,
                Price = item.Price,
                Image = item.Image,
                Size = item.Size,
                Color = item.Color,
                Quantity = item.Quantity
            }).ToList()
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound(new { message = $"Không tìm thấy đơn hàng {id}" });
        }

        order.Status = request.Status.ToLower();
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật trạng thái đơn hàng thành công", status = order.Status });
    }
}
