using PhotoFinderAPI.Middleware;
using PhotoFinderAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSingleton<IPhotographerService, PhotographerService>();
// builder.Services.AddScoped<IPhotographerService, RealPhotographerService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure the HTTP request pipeline.
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseCors("AllowFrontEnd");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();