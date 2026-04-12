using PhotoFinderAPI.Models;
using Microsoft.AspNetCore.Mvc;
using PhotoFinderAPI.Services;

namespace PhotoFinderAPI.Controllers;

// ApiController checks each Request to make sure it passes all requirements needed.
// ApiController automatically checks ModelState and returns 400 when annotations fail, no manual check needed
// if ApiController was not present ---
// if (!ModelState.IsValid)
//      return Badrequest(ModelState);
[ApiController]
[Route("api/[controller]")]
public class PhotographersController : ControllerBase
{
    private readonly IPhotographerService _service;

    public PhotographersController(IPhotographerService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<List<Photographer>> GetAll()
    {
        return Ok(_service.GetAll());
    }
   
    [HttpGet("{id}")]
    public ActionResult<Photographer> GetById(Guid id)
    {
        var item = _service.GetById(id);
        if (item == null)
        {
            return NotFound();
        }
        return Ok(item);
    }

    [HttpPost]
    public ActionResult<Photographer> Create([FromBody] CreatePhotographerRequest photographer)
    {
        var created = _service.Create(photographer);
        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            created
            );
    }

    [HttpPut("{id}")]
    public ActionResult<Photographer> Update(Guid id, [FromBody] Photographer photographer)
    {
        var existing = _service.Update(id, photographer);
        if (existing == null)
        {
            return NotFound();
        }

        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(Guid id)
    {
        var existing = _service.Delete(id);
        if (!existing) 
        {
            return NotFound();
        }

        return NoContent();
    }
}