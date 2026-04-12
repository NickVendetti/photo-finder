using PhotoFinderAPI.Controllers;
using PhotoFinderAPI.Models;

namespace PhotoFinderAPI.Services;

public interface IPhotographerService
{
    List<Photographer> GetAll();
    Photographer? GetById(Guid id);
    Photographer Create(CreatePhotographerRequest photographer);
    Photographer? Update(Guid id, Photographer photographer);
    bool Delete(Guid id);
}