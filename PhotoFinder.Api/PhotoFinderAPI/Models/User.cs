using System.ComponentModel.DataAnnotations;

namespace PhotoFinderAPI.Models;

public class User
{
    public Guid Id { get; set; }
    [Required] [StringLength(100)] public string Username { get; set; } = string.Empty;
    [Required] public string Email { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
    [Required] public string UserType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}