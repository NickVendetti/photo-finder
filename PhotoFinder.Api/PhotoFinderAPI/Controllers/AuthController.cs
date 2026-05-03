using Microsoft.AspNetCore.Mvc;
using PhotoFinderAPI.Data;
using PhotoFinderAPI.Models;
using PhotoFinderAPI.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace PhotoFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        var existing = _db.Users.FirstOrDefault(x => x.Email == request.Email);
        if (existing != null)
        {
            return Conflict("Email already in use.");
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var u = new User();
        u.Id = Guid.NewGuid();
        u.Email = request.Email;
        u.Username = request.Username;
        u.Password = hashedPassword;
        u.UserType = request.UserType;

        _db.Users.Add(u);
        _db.SaveChanges();
        var response = new UserResponse();
        response.Id = u.Id;
        response.Username = u.Username;
        response.Email = u.Email;
        response.UserType = u.UserType;
        response.CreatedAt = u.CreatedAt;


        return CreatedAtAction(
            nameof(Register),
            new { id = u.Id },
            response
        );
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var existing = _db.Users.FirstOrDefault(x => x.Email == request.Email);
        if (existing == null)
        {
            return NotFound();
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, existing.Password))
        {
            return Unauthorized("Incorrect Password");
        }

        var claims = new List<Claim>
        {
            new Claim("id", existing.Id.ToString()),
            new Claim("email", existing.Email),
            new Claim("usertype", existing.UserType)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiryMinutes"])),
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        var response = new UserResponse();
        response.Email = existing.Email;
        response.Id = existing.Id;
        response.Username = existing.Username;
        response.UserType = existing.UserType;
        response.CreatedAt = existing.CreatedAt;

        response.Token = tokenString;
        
        return Ok(response);
    }
    
    
}