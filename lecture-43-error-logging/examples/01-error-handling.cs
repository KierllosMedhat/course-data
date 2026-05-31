// GLOBAL ERROR HANDLING & LOGGING — Lecture 43

/*
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// ==========================================
// 1. GLOBAL EXCEPTION HANDLER MIDDLEWARE
// ==========================================
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        // Set standard API error response
        context.Response.ContentType = "application/problem+json";
        
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        
        // Log the actual error internally
        logger.LogError(exception, "An unhandled exception occurred while processing the request.");

        // Determine status code based on exception type
        var statusCode = exception switch
        {
            KeyNotFoundException => StatusCodes.Status404NotFound,
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            _ => StatusCodes.Status500InternalServerError
        };

        context.Response.StatusCode = statusCode;

        // Return a sanitized error object to the client
        var errorResponse = new
        {
            Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
            Title = "An error occurred while processing your request.",
            Status = statusCode,
            TraceId = context.TraceIdentifier
            // Only include exception details in Development!
            // Detail = app.Environment.IsDevelopment() ? exception?.Message : null
        };

        await context.Response.WriteAsJsonAsync(errorResponse);
    });
});

// ==========================================
// 2. SERILOG INTEGRATION (Alternative to built-in logging)
// ==========================================
// Requires: dotnet add package Serilog.AspNetCore
/*
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));
    // E.g. configure writing to console and a rolling file in appsettings.json
*/

// ==========================================
// 3. USING ILOGGER IN A CONTROLLER
// ==========================================
/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("[controller]")]
public class DemoController : ControllerBase
{
    private readonly ILogger<DemoController> _logger;

    public DemoController(ILogger<DemoController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        _logger.LogInformation("Getting data at {Time}", DateTime.UtcNow);
        
        try
        {
            // Do work
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get data");
            throw; // Let the global exception handler catch it
        }
    }
}
*/
