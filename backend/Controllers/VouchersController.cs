using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hightech.Api.Data;
using Hightech.Api.Models;

namespace Hightech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VouchersController : ControllerBase
{
    private readonly AppDbContext _context;

    public VouchersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Voucher>>> GetVouchers([FromQuery] bool? onlyActive = false)
    {
        var query = _context.Vouchers.AsQueryable();
        if (onlyActive == true)
        {
            query = query.Where(v => v.IsActive && v.ExpiryDate > DateTime.UtcNow);
        }

        var vouchers = await query.ToListAsync();
        return Ok(vouchers);
    }

    [HttpPost("apply")]
    public async Task<ActionResult<ApplyVoucherResponse>> ApplyVoucher([FromBody] ApplyVoucherRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
        {
            return BadRequest(new ApplyVoucherResponse(false, "Vui lòng nhập mã giảm giá", null, null));
        }

        var code = request.Code.Trim().ToUpper();
        var voucher = await _context.Vouchers.FirstOrDefaultAsync(v => v.Code.ToUpper() == code);

        if (voucher == null)
        {
            return Ok(new ApplyVoucherResponse(false, "Mã giảm giá không tồn tại", null, null));
        }

        if (!voucher.IsActive)
        {
            return Ok(new ApplyVoucherResponse(false, "Mã giảm giá đã tạm ngưng sử dụng", null, null));
        }

        if (voucher.ExpiryDate < DateTime.UtcNow)
        {
            return Ok(new ApplyVoucherResponse(false, "Mã giảm giá đã hết hạn sử dụng", null, null));
        }

        if (request.Subtotal < voucher.MinSubtotal)
        {
            return Ok(new ApplyVoucherResponse(
                false,
                $"Đơn hàng chưa đạt mức tối thiểu {voucher.MinSubtotal:N0}₫ để dùng mã này",
                null,
                null
            ));
        }

        var discountAmount = Math.Round(request.Subtotal * voucher.DiscountPercent / 100);
        return Ok(new ApplyVoucherResponse(
            true,
            $"Áp dụng thành công mã {voucher.Code}: Giảm {voucher.DiscountPercent}%",
            voucher.DiscountPercent,
            discountAmount
        ));
    }

    [HttpPost]
    public async Task<ActionResult<Voucher>> CreateVoucher([FromBody] Voucher voucher)
    {
        voucher.Code = voucher.Code.Trim().ToUpper();
        if (await _context.Vouchers.AnyAsync(v => v.Code.ToUpper() == voucher.Code))
        {
            return BadRequest(new { message = $"Mã voucher {voucher.Code} đã tồn tại" });
        }

        _context.Vouchers.Add(voucher);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetVouchers), new { code = voucher.Code }, voucher);
    }

    [HttpPut("{code}/toggle")]
    public async Task<IActionResult> ToggleVoucher(string code)
    {
        var cleanCode = code.Trim().ToUpper();
        var voucher = await _context.Vouchers.FirstOrDefaultAsync(v => v.Code.ToUpper() == cleanCode);
        if (voucher == null)
        {
            return NotFound(new { message = $"Không tìm thấy voucher {code}" });
        }

        voucher.IsActive = !voucher.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã cập nhật trạng thái voucher", isActive = voucher.IsActive });
    }

    [HttpDelete("{code}")]
    public async Task<IActionResult> DeleteVoucher(string code)
    {
        var cleanCode = code.Trim().ToUpper();
        var voucher = await _context.Vouchers.FirstOrDefaultAsync(v => v.Code.ToUpper() == cleanCode);
        if (voucher == null)
        {
            return NotFound(new { message = $"Không tìm thấy voucher {code}" });
        }

        _context.Vouchers.Remove(voucher);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa voucher thành công" });
    }
}
