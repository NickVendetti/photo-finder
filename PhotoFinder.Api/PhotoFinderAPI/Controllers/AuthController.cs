using Microsoft.AspNetCore.Mvc;
using PhotoFinderAPI.Data;
using PhotoFinderAPI.Models;
using PhotoFinderAPI.DTOs;

namespace PhotoFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db)
    {
        _db = db;
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

        var response = new UserResponse();
        response.Email = existing.Email;
        response.Id = existing.Id;
        response.Username = existing.Username;
        response.UserType = existing.UserType;
        response.CreatedAt = existing.CreatedAt;
        
        return Ok(response);
    }
    
    
}