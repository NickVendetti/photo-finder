using PhotoFinderAPI.Models;
using PhotoFinderAPI.Services;

namespace PhotoFinderAPI.Tests;

public class FakePhotographerService : IPhotographerService
{
    private readonly List<Photographer> _photographers = new()
    {
        new Photographer
        {
            Id = 1, Name = "Test Photographer", Style = "Portrait", Bio = "Test bio", Location = "NYC", Rating = 4.5
        },
        new Photographer
        {
            Id = 2, Name = "Another Photographer", Style = "Landscape", Bio = "Another bio", Location = "LA",
            Rating = 4.8
        },
    };
    public List<Photographer> GetAll() => _photographers;
    public Photographer? GetById(int id) => _photographers.FirstOrDefault(x => x.Id == id);
    public Photographer Create(Photographer photographer)
    {
        photographer.Id =_photographers.Max(p => p.Id) + 1;
        _photographers.Add(photographer);
        return photographer;
    }
}