using PhotoFinderAPI.Models;
using Microsoft.AspNetCore.Mvc;
using PhotoFinderAPI.Services;

namespace PhotoFinderAPI.Controllers;

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
    public ActionResult<Photographer> GetById(int id)
    {
        var item = _service.GetById(id);
        if (item == null)
        {
            return NotFound();
        }
        return Ok(item);
    }

    [HttpPost]
    public ActionResult<Photographer> Create([FromBody] Photographer photographer)
    {
        var created = _service.Create(photographer);
        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            created
            );
    }

    [HttpPut("{id}")]
    public ActionResult<Photographer> Update(int id, [FromBody] Photographer photographer)
    {
        var existing = _service.Update(id, photographer);
        if (existing == null)
        {
            return NotFound();
        }

        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var existing = _service.Delete(id);
        if (!existing) 
        {
            return NotFound();
        }

        return NoContent();
    }
}