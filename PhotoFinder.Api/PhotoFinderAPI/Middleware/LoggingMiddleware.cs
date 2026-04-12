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
        await _next.Invoke(context);  // Pass the request to the next middleware/controller
        Console.WriteLine($"{context.Request.Method} {context.Request.Path} -> {context.Response.StatusCode}");
        


    }
}