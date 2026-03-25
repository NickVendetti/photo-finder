using PhotoFinderAPI.Models;

namespace PhotoFinderAPI.Services;

public interface IPhotographerService
{
    List<Photographer> GetAll();
    Photographer? GetById(int id);
}