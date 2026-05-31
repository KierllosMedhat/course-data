# Lecture 43 — Global Error Handling, Logging & API Versioning

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Implement Global Exception Handling in ASP.NET Core using `IExceptionHandler`.
- Return standardized errors using ProblemDetails (RFC 9457).
- Understand Structured Logging and log levels.
- Integrate Serilog for robust logging (Console, File).
- Implement API Versioning using Asp.Versioning.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Global Exception Handling (`IExceptionHandler`)
2. ProblemDetails Standard
3. Logging Basics (`ILogger<T>`)
4. Advanced Logging with Serilog
5. API Versioning

### Part 2 — Practice / Lab (~90–120 min)
1. Setup `IExceptionHandler`
2. Integrate Serilog
3. ShopAPI Project Part 5: Errors & Logs

---

## 1. Global Exception Handling

In the past, developers used custom middleware or try-catch blocks everywhere. ASP.NET Core 8+ introduced `IExceptionHandler`, a much cleaner, composable way to handle errors globally!

### Custom Exceptions
First, create specific exceptions for your business logic:
```csharp
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) {}
}
```

### The Exception Handler
```csharp
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        _logger.LogError(exception, "An unexpected error occurred.");

        var statusCode = exception switch
        {
            NotFoundException => StatusCodes.Status404NotFound,
            UnauthorizedAccessException => StatusCodes.Status403Forbidden,
            _ => StatusCodes.Status500InternalServerError
        };

        context.Response.StatusCode = statusCode;
        
        // Return true to signify we handled the exception!
        return true; 
    }
}
```

### Registration (Program.cs)
```csharp
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
// ...
app.UseExceptionHandler(opt => { }); // Adds it to the pipeline
```

---

## 2. ProblemDetails Standard

Instead of returning custom JSON for errors, we should return **ProblemDetails** (RFC 9457), a standardized format for HTTP errors.

```csharp
var problem = new ProblemDetails
{
    Status = statusCode,
    Title = "An error occurred",
    Detail = exception.Message,
    Instance = context.Request.Path
};

await context.Response.WriteAsJsonAsync(problem, ct);
```

To enable this globally for built-in ASP.NET errors (like 404s for missing routes):
```csharp
builder.Services.AddProblemDetails();
```

---

## 3. Logging Basics

ASP.NET Core provides `ILogger<T>` out of the box.

### Log Levels
1. **Trace / Debug:** Very detailed, for development only.
2. **Information:** General flow of the application.
3. **Warning:** Something unexpected happened, but the app didn't crash.
4. **Error:** An operation failed (e.g., database connection lost).
5. **Critical:** The app is crashing!

### Structured Logging
Always use placeholders instead of string interpolation! It allows log analyzers to query your logs better.
```csharp
// ❌ BAD
_logger.LogInformation($"User {userId} logged in.");

// ✅ GOOD (Structured)
_logger.LogInformation("User {UserId} logged in.", userId);
```

---

## 4. Advanced Logging with Serilog

The built-in logger is basic. **Serilog** allows us to write logs to "Sinks" (Console, Files, Databases) easily.

```bash
dotnet add package Serilog.AspNetCore
```

### Program.cs Integration
```csharp
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/app.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog(); // Replaces built-in logger

// Later in the pipeline...
app.UseSerilogRequestLogging(); // Logs every HTTP request beautifully!
```

---

## 5. API Versioning

As your API grows, you will introduce breaking changes. Versioning prevents breaking old mobile apps or integrations.

```bash
dotnet add package Asp.Versioning.Mvc
```

```csharp
// Program.cs
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});
```

### In the Controller
```csharp
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/products")]
public class ProductsController : ControllerBase { ... }
```

---

## 🧪 Practice Labs

### Lab 1 — IExceptionHandler (40 min)
1. Create a `GlobalExceptionHandler` implementing `IExceptionHandler`.
2. Handle `ArgumentException` and return a 400 Bad Request using `ProblemDetails`.
3. Register it in `Program.cs`.
4. Add a dummy endpoint that throws an `ArgumentException` and test it in Swagger.

### Lab 2 — Serilog (30 min)
1. Install `Serilog.AspNetCore`.
2. Set up the `LoggerConfiguration` to log to the Console and a File.
3. Add `app.UseSerilogRequestLogging()`.
4. Make some requests and check your `/logs` folder!

---

## 📝 Assignment: ShopAPI Project — Part 5

Let's make our ShopAPI production-ready!

### Requirements
1. Replace your custom Error Handling Middleware from Part 1 with a modern `GlobalExceptionHandler` implementing `IExceptionHandler`.
2. Return proper `ProblemDetails` JSON responses.
3. Handle a custom `NotFoundException` (return 404) and all other exceptions (return 500).
4. Install Serilog.
5. Configure Serilog to write to the Console and a rolling daily file.
6. Add `UseSerilogRequestLogging()` to your pipeline to log all incoming requests.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| IExceptionHandler | https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling |
| Serilog | https://serilog.net/ |
| API Versioning | https://github.com/dotnet/aspnet-api-versioning |

---

## 📌 Key Takeaways
- **`IExceptionHandler`** is the modern way to catch exceptions globally.
- **ProblemDetails** standardizes how errors look in your API.
- **Structured Logging** is critical for searching logs later.
- **Serilog** easily logs to files, databases, and third-party services.
- **API Versioning** protects clients from breaking changes.

---

**Next Lecture:** [Lecture 44 — Real-Time Communication & Background Jobs](./44%20-%20Real-Time%20Communication%20%26%20Background%20Jobs.md)