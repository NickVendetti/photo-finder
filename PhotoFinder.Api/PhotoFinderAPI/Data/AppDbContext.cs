using Microsoft.EntityFrameworkCore;
using PhotoFinderAPI.Models;

namespace PhotoFinderAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Photographer> Photographers { get; set; }
}

