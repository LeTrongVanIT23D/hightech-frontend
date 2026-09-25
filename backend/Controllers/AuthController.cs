using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Hightech.Api.Data;
using Hightech.Api.Models;

namespace Hightech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Identifier) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new AuthResponse(false, "Vui lòng nhập email/SĐT và mật khẩu", null, null));
        }

        var identifier = request.Identifier.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.Email.ToLower() == identifier || (u.Phone != null && u.Phone == identifier));

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new AuthResponse(false, "Email hoặc mật khẩu không chính xác", null, null));
        }

        var token = GenerateJwtToken(user);
        var userDto = new UserDto(user.Id, user.Name, user.Email, user.Phone, user.Address, user.Role);

        return Ok(new AuthResponse(true, "Đăng nhập thành công", token, userDto));
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new AuthResponse(false, "Vui lòng điền đầy đủ họ tên, email và mật khẩu", null, null));
        }

        var email = request.Email.Trim().ToLower();
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == email))
        {
            return BadRequest(new AuthResponse(false, "Email này đã được sử dụng", null, null));
        }

        var user = new User
        {
            Id = $"U-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() % 100000:D5}",
            Name = request.Name.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Phone = request.Phone?.Trim(),
            Address = request.Address?.Trim(),
            Role = "user",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        var userDto = new UserDto(user.Id, user.Name, user.Email, user.Phone, user.Address, user.Role);

        return Ok(new AuthResponse(true, "Đăng ký tài khoản thành công", token, userDto));
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserDto(u.Id, u.Name, u.Email, u.Phone, u.Address, u.Role))
            .ToListAsync();

        return Ok(users);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _config["Jwt:Key"] ?? "HightechSportsSuperSecretKeyForJwtTokenAuthentication2026!@";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "hightech-api",
            audience: _config["Jwt:Audience"] ?? "hightech-frontend",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
