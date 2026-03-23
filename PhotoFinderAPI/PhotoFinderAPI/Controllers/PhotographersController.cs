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
    // tells ASP.NET "when a GET request comes in, run this method"
    // same as: app.get('/api/photographers', ...) in Express
    [HttpGet]
    
    // ActionResult<List<Photographer>> means:
    // "this method returns either an HTTP response (like 200 OK)
    // AND the data inside it will be a List of Photographer objects"
    public ActionResult<List<Photographer>> GetAll()
    {
        // create an empty list to hold our photographers
        // this is the "shelf" we'll put our photographers on
        var items = new List<Photographer>();
        
        // create 3 hardcoded photographer objects using the Photographer blueprint
        // each property matches what's defined in Photographer.cs   
        var photographer1 = new Photographer { Bio = "I am photographer1", Id = 1, Location = "Atlanta", Name = "Nick", Rating = 5, Style = "Portrait" };
        var photographer2 = new Photographer { Bio = "I am photographer 2", Id = 2, Location = "Columbus", Name = "Summer", Rating = 3, Style = "Wedding" };
        var photographer3 = new Photographer { Bio = "I am photographer 3", Id = 3, Location = "Lagrange", Name = "Miles", Rating = 4, Style = "Sports" };

        // add each photographer to the list
        // same as: items.push(photographer1) in JavaScript
        items.Add(photographer1);
        items.Add(photographer2);
        items.Add(photographer3);
            
        // wrap the list in a 200 OK HTTP response and send it back as JSON
        // same as: res.status(200).json(items) in Express
        return Ok(items);
    }
}

