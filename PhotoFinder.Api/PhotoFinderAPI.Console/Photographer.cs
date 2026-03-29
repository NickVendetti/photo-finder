namespace PhotoFinderAPI.Console;

public class Photographer
{
    private List<Camera> _cameras = new List<Camera>();

    public void AddCamera(Camera c)
    {
        _cameras.Add(c);
    }

    public Camera GetByFocalLength(int mm)
    {
        var camera = _cameras.Find(c => c.Lense.FocalLength == mm);
        return camera;
    }
}