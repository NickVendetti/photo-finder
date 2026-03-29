namespace PhotoFinderAPI.Console;

public class Camera
{
    private Lens _lens;

    public Lens Lense => _lens;

    public Camera(Lens l)
    {
        _lens = l;
    }
}