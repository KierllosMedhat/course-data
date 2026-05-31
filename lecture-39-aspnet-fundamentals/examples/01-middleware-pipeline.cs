// ASP.NET CORE FUNDAMENTALS & MIDDLEWARE — Lecture 39
// Example Program.cs

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Services (Dependency Injection Container)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 2. Configure the HTTP Request Pipeline (Middleware)

// Environment check
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // Developer Exception Page is automatically added in dev mode
}

// Custom inline middleware (Logging)
app.Use(async (context, next) =>
{
    // Do work before the next middleware
    Console.WriteLine($"[Custom Logger] Incoming request: {context.Request.Method} {context.Request.Path}");
    
    // Call the next middleware in the pipeline
    await next(context);
    
    // Do work after the next middleware returns
    Console.WriteLine($"[Custom Logger] Outgoing response status: {context.Response.StatusCode}");
});

// Built-in middleware
app.UseHttpsRedirection(); // Redirects HTTP to HTTPS
// app.UseStaticFiles();   // Serves files from wwwroot

// Map endpoints (Minimal APIs)
app.MapGet("/", () => "Hello from ASP.NET Core Middleware Pipeline!");

app.MapGet("/api/status", () => new { Status = "Healthy", Version = "1.0" });

// Run the application
app.Run();
