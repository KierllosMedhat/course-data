# Lecture 43 — Global Error Handling, Logging & API Versioning

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Implement Global Exception Handling in ASP.NET Core 8+ using `IExceptionHandler`
- Return standardized API error responses using the ProblemDetails format (RFC 9457)
- Understand the difference between unstructured text logs and Structured Logging
- Integrate Serilog for robust, professional logging to the Console and Files
- Implement API Versioning using `Asp.Versioning` to prevent breaking changes for clients

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Global Exception Handling: The Safety Net
2. The ProblemDetails Standard
3. Logging Basics & Structured Logging
4. Advanced Logging with Serilog
5. API Versioning: Handling Change

### Part 2 — Practice / Lab (~90–120 min)
1. Setup `IExceptionHandler`
2. Integrate Serilog
3. ShopAPI Project Part 5: Errors & Logs

---

## 1. Global Exception Handling: The Safety Net

### The Real-World Analogy: The Circus Safety Net

Imagine you are watching a trapeze artist at the circus. Occasionally, the artist might slip. Without a safety net, they crash into the ground, and the show stops in panic (your API crashes and returns a raw HTML stack trace to the user). 

If you put a safety net underneath the *entire* tent, it doesn't matter where they fall. The net catches them gracefully, and the announcer calms the audience down (your API catches the crash, logs the error, and returns a polite, formatted JSON message).

In ASP.NET Core 8+, the modern safety net is the `IExceptionHandler` interface.

### Step 1: Create Custom Exceptions

First, we create specific exceptions to represent business logic errors.

```csharp
// Thrown when an item is not found in the database
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) {}
}

// Thrown when validation fails
public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message) {}
}
```

### Step 2: Create the Global Handler

```csharp
using Microsoft.AspNetCore.Diagnostics;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        // 1. Log the exact error for the developers
        _logger.LogError(exception, "An unexpected error occurred: {Message}", exception.Message);

        // 2. Determine the HTTP Status Code based on the Exception type
        var statusCode = exception switch
        {
            NotFoundException => StatusCodes.Status404NotFound,
            BadRequestException => StatusCodes.Status400BadRequest,
            UnauthorizedAccessException => StatusCodes.Status403Forbidden,
            _ => StatusCodes.Status500InternalServerError // Fallback for real crashes
        };

        // 3. Set the status code on the response
        context.Response.StatusCode = statusCode;
        
        // (We will write the JSON body in the next section)
        
        // 4. Return true to signify we successfully handled the exception!
        return true; 
    }
}
```

### Step 3: Register in `Program.cs`

```csharp
// Register the service
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

// Add it to the pipeline as early as possible!
app.UseExceptionHandler(opt => { }); 
```

---

## 2. The ProblemDetails Standard

Instead of every company inventing their own custom JSON format for errors, there is an official web standard: **RFC 9457 Problem Details for HTTP APIs**.

### Creating ProblemDetails

Let's update our `GlobalExceptionHandler` to return this standard format:

```csharp
var problem = new ProblemDetails
{
    Status = statusCode,
    Title = "An error occurred while processing your request.",
    Detail = exception.Message,
    Instance = context.Request.Path // Helps track exactly which URL failed
};

// Write the JSON to the response
await context.Response.WriteAsJsonAsync(problem, ct);
```

### Example JSON Response
If a user hits an endpoint that throws a `NotFoundException`, the API returns:

```json
{
  "status": 404,
  "title": "An error occurred while processing your request.",
  "detail": "Product with ID 99 was not found.",
  "instance": "/api/products/99"
}
```

> [!TIP]
> You can also enable ProblemDetails for built-in ASP.NET errors (like 404s for missing routes or 400s for bad JSON) by adding `builder.Services.AddProblemDetails();` to your `Program.cs`.

---

## 3. Logging Basics & Structured Logging

ASP.NET Core provides `ILogger<T>` out of the box.

### Log Levels

Not all logs are equal. We categorize them by severity:
1. **Trace / Debug:** Very noisy. Only used locally during development.
2. **Information:** General flow (e.g., "User logged in", "Order processed").
3. **Warning:** Something unexpected happened, but the app recovered.
4. **Error:** An operation failed (e.g., "Cannot connect to database").
5. **Critical:** The app is crashing or completely unusable!

### Structured Logging (Crucial Concept)

**Unstructured logging** is like writing an essay. It's easy for humans to read, but hard for computers to search.
**Structured logging** is like filling out a form. It separates the message template from the data variables.

```csharp
// ❌ BAD (Unstructured / String Interpolation)
// The ID is baked into the string. If you want to search for all login events, 
// you can't, because every string is completely unique!
_logger.LogInformation($"User {userId} logged in from {ipAddress}.");

// ✅ GOOD (Structured Logging)
// ASP.NET stores the template and the variables separately.
// Now you can query your logs: "Show me all logs where UserId == 50"
_logger.LogInformation("User {UserId} logged in from {IpAddress}.", userId, ipAddress);
```

---

## 4. Advanced Logging with Serilog

The built-in logger only writes to the console by default. In production, you need logs saved to a file or a database. **Serilog** is the industry standard for this.

### 1. Installation
```bash
dotnet add package Serilog.AspNetCore
```

### 2. Program.cs Integration
Replace the default logger completely with Serilog at the very start of your app:

```csharp
using Serilog;

// 1. Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    // Write to a text file, creating a new file every single day
    .WriteTo.File("logs/shopapi-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);
    
    // 2. Tell ASP.NET to use Serilog instead of the built-in logger
    builder.Host.UseSerilog(); 
    
    var app = builder.Build();

    // 3. Add this middleware to automatically log every HTTP request beautifully!
    app.UseSerilogRequestLogging(); 

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
```

---

## 5. API Versioning: Handling Change

### The Analogy: The Grocery Store Layout
Imagine your favorite grocery store suddenly rearranges all the aisles overnight. You walk in to buy milk, and it's gone. You are frustrated and your routine is broken. 
If the store instead opened a "V2" door that led to the new layout, while keeping the "V1" door open for a few months, you could adjust at your own pace.

If you change the structure of your JSON responses, mobile apps that haven't updated yet will crash! We use **API Versioning** to prevent this.

### Implementation

```bash
dotnet add package Asp.Versioning.Mvc
```

```csharp
// Program.cs
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0); // V1.0
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true; // Tells the client via Headers what versions exist
});
```

### In the Controller
We add version numbers to the Route template.

```csharp
[ApiController]
[ApiVersion("1.0")]
[ApiVersion("2.0")] // This controller supports both V1 and V2
[Route("api/v{version:apiVersion}/products")]
public class ProductsController : ControllerBase 
{
    [HttpGet]
    [MapToApiVersion("1.0")]
    public ActionResult GetV1() { return Ok("Old JSON format"); }

    [HttpGet]
    [MapToApiVersion("2.0")]
    public ActionResult GetV2() { return Ok("New JSON format"); }
}
```

Now clients can call `/api/v1/products` or `/api/v2/products`!

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Using `try-catch` inside every single controller method | Use `IExceptionHandler` globally. Only use `try-catch` locally if you plan to fix the error and continue executing. |
| Using string interpolation (`$""`) in ILogger methods | Always use Structured Logging templates: `Log("{Variable}", value)` |
| Logging sensitive data (Passwords, Credit Cards) | Never log Personal Identifiable Information (PII) or secrets. Logs are often viewed by many developers. |
| Breaking the API structure without versioning | If you rename a JSON property that clients rely on, you MUST create a V2 endpoint. |

---

## 🧪 Practice Labs

### Lab 1 — IExceptionHandler (40 min)
1. Create a `GlobalExceptionHandler` implementing `IExceptionHandler`.
2. Write logic to handle an `ArgumentException` and return a 400 Bad Request using `ProblemDetails`.
3. Register it in `Program.cs`.
4. Add a dummy endpoint (`/test-error`) that throws an `ArgumentException` and test it in Swagger. Verify the JSON matches the ProblemDetails standard!

### Lab 2 — Serilog (30 min)
1. Install the `Serilog.AspNetCore` package.
2. Set up the `LoggerConfiguration` to log to both the Console and a rolling File.
3. Replace the host logger with `builder.Host.UseSerilog()`.
4. Add `app.UseSerilogRequestLogging()`.
5. Make some requests in Swagger, check your terminal, and open the generated text file in the `/logs` folder!

---

## 📝 Assignment: ShopAPI Project — Part 5

Let's make our ShopAPI production-ready with proper logging and error handling!

### Requirements
1. Delete your old custom Error Handling Middleware from Part 1.
2. Create a modern `GlobalExceptionHandler` class implementing `IExceptionHandler`.
3. Configure it to return proper `ProblemDetails` JSON responses.
4. Handle your custom `NotFoundException` (return 404) and map all other unknown exceptions to a 500 Internal Server Error.
5. Install Serilog.
6. Configure Serilog in `Program.cs` to write to the Console and a rolling daily file named `shopapi-.txt`.
7. Add `UseSerilogRequestLogging()` to your pipeline to automatically log all incoming HTTP requests and their response times.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| IExceptionHandler | https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling |
| RFC 9457 Problem Details | https://datatracker.ietf.org/doc/html/rfc9457 |
| Serilog | https://serilog.net/ |
| Asp.Versioning | https://github.com/dotnet/aspnet-api-versioning |

---

## 📌 Key Takeaways
- **`IExceptionHandler`** is the modern, clean way to catch exceptions globally without messy middleware.
- **ProblemDetails** standardizes how errors look in your API so frontend developers can parse them predictably.
- **Structured Logging** keeps data variables separate from the message text, making logs easily searchable.
- **Serilog** seamlessly routes your logs to files, databases, and third-party monitoring services.
- **API Versioning** protects client applications from breaking changes when you update your API structure.

---

**Next Lecture:** [Lecture 44 — Real-Time Communication & Background Jobs](./44%20-%20Real-Time%20Communication%20%26%20Background%20Jobs.md)