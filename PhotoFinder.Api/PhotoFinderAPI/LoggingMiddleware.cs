namespace PhotoFinderAPI.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // BEFORE the request is handled:
        // You can read context.Request.Method and context.Request.Path here
        Console.WriteLine(context.Request.Method);
        await _next.Invoke(context);  // Pass the request to the next middleware/controller

        // AFTER the response is ready:
        // You can read context.Response.StatusCode here
        Console.WriteLine(context.Response.StatusCode);

        Console.WriteLine(context);
        Console.WriteLine("next test");
    }
}