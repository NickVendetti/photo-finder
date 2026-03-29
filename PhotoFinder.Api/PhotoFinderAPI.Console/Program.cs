using System;
using System.Runtime.InteropServices.JavaScript;
using PhotoFinderAPI.Console;


class Program
{
    static void Main()
    {
        Photographer p = new Photographer();
        Lens lens = new Lens(1.2, 85);
        Camera camera = new Camera(lens);
        p.AddCamera(camera);
        Camera foundCamera = p.GetByFocalLength(85);

    }
}
