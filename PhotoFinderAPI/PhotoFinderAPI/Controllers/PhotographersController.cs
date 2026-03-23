// "import" the Photographer model so this file knows what a Photographer is
// same idea as: import { Photographer } from "../models/photographers.js"
using PhotoFinderAPI.Models;

// gives us access to ASP.NET tools like [ApiController], [HttpGet], and ControllerBase
using Microsoft.AspNetCore.Mvc;

// declares where this file lives in the project - like an address label
// Controllers folder inside the PhotoFinderAPI project
namespace PhotoFinderAPI.Controllers;

// tells ASP.NET "this class is an API controller"
// like a badge on the door that says "API requests handled here"
[ApiController]

// sets the URL route automatically based on the class name
// PhotographersController -> /api/photographers
[Route("api/[controller]")]

// the controller class itself
// : ControllerBase means we INHERIT built in tools like Ok() and NotFound()
// without this we'd have to write those helper methods ourselves
public class PhotographersController : ControllerBase
{
    // the list lives at the CLASS level so ALL methods can see it
    // built with all 3 photographers already inside it
    private static List<Photographer> _photographers = new List<Photographer>
    {
        new Photographer { Bio = "I am photographer1", Id = 1, Location = "Atlanta", Name = "Nick", Rating = 5, Style = "Portrait" },
        new Photographer { Bio = "I am photographer 2", Id = 2, Location = "Columbus", Name = "Summer", Rating = 3, Style = "Wedding" },
        new Photographer { Bio = "I am photographer 3", Id = 3, Location = "Lagrange", Name = "Miles", Rating = 4, Style = "Sports" }
    };

    // handles GET /api/photographers
    // returns ALL photographers
    [HttpGet]
    public ActionResult<List<Photographer>> GetAll()
    {
        return Ok(_photographers);
    }

    // handles GET /api/photographers/1  or  /api/photographers/2  etc
    // the {id} in the route gets passed in as the id parameter
    [HttpGet("{id}")]
    public ActionResult<Photographer> GetById(int id)
    {
        // search the list for the first photographer whose Id matches
        // returns null if nothing is found
        var item = _photographers.FirstOrDefault(x => x.Id == id);

        // if nothing was found return a 404 Not Found response
        if (item == null)
        {
            return NotFound();
        }

        // if found return a 200 OK response with the photographer
        return Ok(item);
    }
}