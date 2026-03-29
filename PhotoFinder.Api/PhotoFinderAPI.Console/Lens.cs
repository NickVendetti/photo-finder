namespace PhotoFinderAPI.Console;

public class Lens
{
    private double _aperture;
    private int _focalLength;

    public int FocalLength => _focalLength;

    public Lens(double aperture, int fl)
    {
        _aperture = aperture;
        _focalLength = fl;
    }
}