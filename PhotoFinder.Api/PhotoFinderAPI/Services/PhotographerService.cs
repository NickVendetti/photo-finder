using PhotoFinderAPI.Controllers;

namespace PhotoFinderAPI.Services;

using PhotoFinderAPI.Models;

public class PhotographerService : IPhotographerService
{
    private readonly List<Photographer> _photographers =new()
    {
        new Photographer { Bio = "I am photographer1", Id = Guid.NewGuid(), Location = "Atlanta", Name = "Nick", Rating = 5, Style = "Portrait" },
        new Photographer { Bio = "I am photographer 2", Id = Guid.NewGuid(), Location = "Columbus", Name = "Summer", Rating = 3, Style = "Wedding" },
        new Photographer { Bio = "I am photographer 3", Id = Guid.NewGuid(), Location = "Lagrange", Name = "Miles", Rating = 4, Style = "Sports" }
    };

    public List<Photographer> GetAll()
    {
        return _photographers;
    }

    public Photographer? GetById(Guid id)
    {
        return _photographers.FirstOrDefault(x => x.Id == id);
    }

    public Photographer Create(CreatePhotographerRequest photographer)
    {
        var p = new Photographer();
        p.Id = Guid.NewGuid();
        p.Bio = photographer.Bio;
        p.Location = photographer.Location;
        p.Name = photographer.Name;
        p.Rating = photographer.Rating;
        p.Style = photographer.Style;
        
        _photographers.Add(p);
        return p;
    }

    public Photographer? Update(Guid id, Photographer photographer)
    {
        var existing = _photographers.FirstOrDefault(x => x.Id == id);
        
        if (existing == null)
        {
            return null;
        }
        
        existing.Bio = photographer.Bio;
        existing.Name = photographer.Name;
        existing.Rating = photographer.Rating;
        existing.Location = photographer.Location;
        existing.Style = photographer.Style;


        return existing;
    }

    public bool Delete(Guid id)
    {
        var existing = _photographers.FirstOrDefault(x => x.Id == id);

        if (existing == null)
        {
            return false;
        }

        _photographers.Remove(existing);
        return true;
    }
}