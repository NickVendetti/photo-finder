using PhotoFinderAPI.Controllers;
using PhotoFinderAPI.Models;
using PhotoFinderAPI.Services;

namespace PhotoFinderAPI.Tests;

public class MockPhotographerService : IPhotographerService
{
    public static readonly Guid Id1 = Guid.Parse("00000000-0000-0000-0000-000000000001");
    public static readonly Guid Id2 = Guid.Parse("00000000-0000-0000-0000-000000000002");

    private readonly List<Photographer> _photographers = new()
    {
        new Photographer
        {
            Id = Id1, Name = "Test Photographer", Style = "Portrait", Bio = "Test bio", Location = "NYC", Rating = 4.5
        },
        new Photographer
        {
            Id = Id2, Name = "Another Photographer", Style = "Landscape", Bio = "Another bio", Location = "LA",
            Rating = 4.8
        },
    };
    public List<Photographer> GetAll() => _photographers;
    public Photographer? GetById(Guid id) => _photographers.FirstOrDefault(x => x.Id == id);
    public Photographer Create(CreatePhotographerRequest request)
    {
        var photographer = new Photographer
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Style = request.Style,
            Location = request.Location,
            Bio = request.Bio,
            Rating = request.Rating
        };
        _photographers.Add(photographer);
        return photographer;
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