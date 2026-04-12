namespace PhotoFinderAPI.Services;

using PhotoFinderAPI.Models;

public class MockPhotographerService : IPhotographerService
{
    private readonly List<Photographer> _photographers =new()
    {
        new Photographer { Bio = "I am photographer1", Id = 1, Location = "Atlanta", Name = "Nick", Rating = 5, Style = "Portrait" },
        new Photographer { Bio = "I am photographer 2", Id = 2, Location = "Columbus", Name = "Summer", Rating = 3, Style = "Wedding" },
        new Photographer { Bio = "I am photographer 3", Id = 3, Location = "Lagrange", Name = "Miles", Rating = 4, Style = "Sports" }
    };

    public List<Photographer> GetAll()
    {
        return _photographers;
    }

    public Photographer? GetById(int id)
    {
        return _photographers.FirstOrDefault(x => x.Id == id);
    }

    public Photographer Create(Photographer photographer)
    {
        var newId = _photographers.Max(x => x.Id) + 1; 
        photographer.Id = newId;
        _photographers.Add(photographer);
        return photographer;
    }

    public Photographer? Update(int id, Photographer photographer)
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

    public bool Delete(int id)
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