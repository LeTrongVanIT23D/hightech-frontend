using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hightech.Api.Data;
using Hightech.Api.Models;

namespace Hightech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsResponse>> GetStats()
    {
        var totalRevenue = await _context.Orders
            .Where(o => o.Status != "cancelled")
            .SumAsync(o => o.Total);

        var totalOrders = await _context.Orders.CountAsync();
        var totalProducts = await _context.Products.CountAsync();
        var totalCustomers = await _context.Users.Where(u => u.Role == "user").CountAsync();

        var recentOrders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .ToListAsync();

        var monthly = new List<MonthlyRevenueDto>
        {
            new("T1", 45000000),
            new("T2", 52000000),
            new("T3", 68000000),
            new("T4", 75000000),
            new("T5", 85000000),
            new("T6", 92000000),
            new("T7", 110000000),
            new("T8", Math.Max(totalRevenue, 125000000))
        };

        return Ok(new DashboardStatsResponse(
            totalRevenue,
            totalOrders,
            totalProducts,
            Math.Max(totalCustomers, 1),
            recentOrders,
            monthly
        ));
    }
}
