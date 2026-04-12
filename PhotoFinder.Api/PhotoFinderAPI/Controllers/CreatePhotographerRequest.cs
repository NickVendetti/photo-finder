namespace PhotoFinderAPI.Controllers;

public class CreatePhotographerRequest
{
    public string Name { get; set; } = string.Empty;
    public string Style { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public double Rating { get; set; }
}