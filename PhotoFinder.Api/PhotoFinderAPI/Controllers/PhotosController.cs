using Microsoft.AspNetCore.Mvc;
using PhotoFinderAPI.Models;

namespace PhotoFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhotosController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Photographer>> GetAll()
    {
            return Ok();
    }
}