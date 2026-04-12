using PhotoFinderAPI.Models;

namespace PhotoFinderAPI.Services;

public interface IPhotographerService
{
    List<Photographer> GetAll();
    Photographer? GetById(int id);
    Photographer Create(Photographer photographer);
    Photographer? Update(int id, Photographer photographer);
    bool Delete(int id);
}