# Lecture 39 — ASP.NET Core Fundamentals & Middleware

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Describe the ASP.NET Core architecture and how requests flow through the pipeline
- Create Web API projects using the modern minimal hosting model
- Build custom middleware with inline `Use` / `Run` statements and custom classes
- Register and inject services using Dependency Injection (Transient, Scoped, Singleton)
- Configure your application securely using `appsettings.json` and User Secrets
- Understand the role of .NET Aspire in orchestrating modern cloud-native applications

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. ASP.NET Core Architecture: The Water Filter Analogy
2. Project Structure & The Minimal Hosting Model (`Program.cs`)
3. Middleware: The Request Pipeline
4. Dependency Injection & Service Lifetimes
5. Configuration & Secure Environments
6. Introduction to .NET Aspire

### Part 2 — Practice / Lab (~90–120 min)
1. Create a Web API and trace the pipeline
2. Build a custom RequestTimingMiddleware
3. ShopAPI Project Part 1: Setup & Middleware

---

## 1. ASP.NET Core Architecture: The Water Filter Analogy

### The Real-World Analogy: The Water Treatment Plant

Imagine water flowing from a muddy river (the Internet) into a treatment plant (your Server). Before the water reaches a home (your Application Logic), it passes through a series of filters in a pipe:
1. **Filter 1:** Removes large debris (Security checks / CORS).
2. **Filter 2:** Adds chlorine (Authentication).
3. **Filter 3:** Directs the water to the right neighborhood (Routing).

Finally, the clean water reaches the home. If there's an issue at any point (e.g., Filter 2 detects poison), the water is immediately rejected and sent back.

### The Middleware Pipeline

ASP.NET Core uses this exact concept. An incoming HTTP request passes through a series of **Middleware** components.

```
Incoming HTTP Request
      ↓
[ Kestrel Web Server ]
      ↓
[ Exception Handling Middleware ]
      ↓
[ Authentication Middleware ]
      ↓
[ Routing Middleware ]
      ↓
[ Your Controller / Endpoint Logic ]
      ↓
HTTP Response flows back UP through the same pipeline!
```

Every middleware has two chances to act:
1. **On the way in:** It can inspect or modify the incoming request.
2. **On the way out:** It can inspect or modify the outgoing response.

---

## 2. Project Structure & The Minimal Hosting Model

Let's create a new Web API from the command line:

```bash
dotnet new webapi -n ShopAPI
```

### The Magic of `Program.cs`

In modern .NET (since .NET 6), the entire setup of your web application happens in a single file called `Program.cs` using top-level statements. It is divided into three distinct phases:

```csharp
// PHASE 1: The Builder
// This creates the foundation of our application
var builder = WebApplication.CreateBuilder(args);

// --- ADD SERVICES TO THE CONTAINER (Dependency Injection) ---
// We register all the "tools" our app needs here
builder.Services.AddControllers(); 
builder.Services.AddOpenApi(); // Adds Swagger documentation

// PHASE 2: The Build
// The foundation is complete, we build the actual app
var app = builder.Build();

// --- CONFIGURE THE HTTP REQUEST PIPELINE (Middleware) ---
// ORDER MATTERS HERE! The order you write them is the order they execute.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // Only show Swagger docs in development mode
}

app.UseHttpsRedirection(); // Force HTTP traffic to HTTPS
app.UseAuthorization();    // Check if the user is allowed
app.MapControllers();      // Route the request to the correct controller

// PHASE 3: Run
// Start listening for incoming requests!
app.Run();
```

---

## 3. Middleware: The Request Pipeline

You can write your own middleware to do things like logging requests, measuring performance, or handling errors globally.

### Inline Middleware (`Use` and `Run`)

You can write quick middleware directly in `Program.cs`.

- **`Use`:** Does some work, and then passes control to the `next` middleware in the pipe.
- **`Run`:** Terminal middleware. It does work and immediately returns the response (the pipeline stops here).

```csharp
// 1. A middleware that logs and passes control to the next one
app.Use(async (context, next) =>
{
    Console.WriteLine("--> Request entered our custom middleware.");
    
    // Pass control to the next filter in the pipe
    await next(context); 
    
    Console.WriteLine("<-- Response is flowing back out!");
});

// 2. A terminal middleware
app.Run(async context =>
{
    // Because we used Run, this is the end of the line. 
    // Any middleware registered after this will NEVER execute!
    await context.Response.WriteAsync("Hello World!");
});
```

### Custom Middleware Classes

For complex logic, inline functions get messy. Instead, write a class!

```csharp
public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;

    // The runtime injects the 'next' middleware into the constructor
    public RequestTimingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ILogger<RequestTimingMiddleware> logger)
    {
        var stopwatch = Stopwatch.StartNew();
        
        // Let the rest of the pipeline run
        await _next(context); 
        
        stopwatch.Stop();
        logger.LogInformation($"Request to {context.Request.Path} took {stopwatch.ElapsedMilliseconds}ms");
    }
}

// Register it in Program.cs
app.UseMiddleware<RequestTimingMiddleware>();
```

> [!WARNING]
> **Order Matters!**
> If you put Authentication middleware *after* Routing, your routes will execute without knowing who the user is! Always think about the logical order of the pipeline.

---

## 4. Dependency Injection & Service Lifetimes

ASP.NET Core has a built-in Dependency Injection (DI) container. You register your services (like Database connections, Email senders) in `Program.cs`, and ASP.NET Core automatically provides them to your controllers when needed.

### Service Lifetimes

When you register a service, you must tell ASP.NET Core how long that service should live.

| Lifetime | Method | When is a new instance created? | The Analogy | Use Cases |
|----------|--------|---------------------------------|-------------|-----------|
| **Transient** | `AddTransient` | Every single time it is requested. | A paper cup. Use it once, throw it away. | Lightweight services, math calculators. |
| **Scoped** | `AddScoped` | Once per HTTP request. | A restaurant table. Yours for the meal, then cleared. | Database Contexts (`DbContext`), user session data. |
| **Singleton** | `AddSingleton` | Only once for the entire life of the application. | The restaurant building itself. Shared by everyone forever. | Global caches, configuration settings. |

```csharp
// Examples of registering services in Program.cs
builder.Services.AddTransient<IEmailSender, SmtpEmailSender>();
builder.Services.AddScoped<IProductRepository, SqlProductRepository>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
```

---

## 5. Configuration & Secure Environments

You rarely hardcode values like Database Passwords or API Keys in your C# code. Instead, you use configuration files.

### Priority of Configuration

ASP.NET Core reads configuration from multiple places. If the same setting exists in multiple places, the higher priority source wins:

1. **`appsettings.json`** (Lowest priority - Base settings)
2. **`appsettings.Development.json`** (Overrides base settings for Dev)
3. **User Secrets** (Local developer secrets)
4. **Environment Variables** (Server-level settings)
5. **Command-line arguments** (Highest priority)

### Reading from appsettings.json

```json
// appsettings.json
{
  "PaymentGateway": {
    "ApiKey": "public-key-123",
    "TimeoutSeconds": 30
  }
}
```

```csharp
// Program.cs
string apiKey = builder.Configuration["PaymentGateway:ApiKey"];
int timeout = builder.Configuration.GetValue<int>("PaymentGateway:TimeoutSeconds");
```

### The Secret Manager (User Secrets)

**NEVER** put database passwords or private API keys in `appsettings.json` because that file gets committed to GitHub! For local development, use User Secrets. These are stored safely outside your project folder.

```bash
# Initialize secrets for this project
dotnet user-secrets init

# Save a secret safely on your local machine
dotnet user-secrets set "Database:Password" "SuperSecret123!"
```

---

## 6. Introduction to .NET Aspire

Building modern cloud apps means you usually need a database (SQL), a cache (Redis), a frontend (Angular), and an API. Starting all of these locally is a nightmare.

**.NET Aspire** is an opinionated framework for building cloud-native apps. 

If you use an Aspire template, it creates an **AppHost** project. When you press play:
1. It automatically spins up Docker containers for your SQL Database and Redis Cache.
2. It starts your Angular frontend.
3. It starts your .NET Web API.
4. It connects them all together securely.
5. It opens a beautiful dashboard showing logs, metrics, and network traces for your entire system.

We will integrate Aspire features as our ShopAPI grows!

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Committing passwords to GitHub | Store local passwords using `dotnet user-secrets set` |
| Calling `app.Run()` in the middle of the pipeline | Use `app.Use()` unless you intentionally want to terminate the request immediately. |
| Registering a `DbContext` as a Singleton | Database contexts are not thread-safe! Always register them as `Scoped`. |
| Putting Exception Handling middleware at the bottom | Exception handling must be the **first** middleware added, so it wraps the entire pipeline and catches errors from anywhere. |

---

## 🧪 Practice Labs

### Lab 1 — Trace the Pipeline (30 min)
1. Run `dotnet new webapi -n PipelineLab`.
2. Open `Program.cs`.
3. Add two inline `app.Use` middleware blocks before `app.MapControllers()`.
4. Make them print to the console *before* and *after* calling `await next(context)`.
5. Run the app, hit an endpoint, and observe the nested console output order!

### Lab 2 — Global Error Handler Middleware (30 min)
1. Create a `GlobalErrorMiddleware` class.
2. Wrap `await _next(context)` in a `try/catch` block.
3. If an exception is caught, set `context.Response.StatusCode = 500` and write a JSON error message to the response.
4. Register it at the very top of your pipeline in `Program.cs`.

---

## 📝 Assignment: ShopAPI Project — Part 1

Let's start building the robust backend for our E-commerce application!

### Requirements
1. Create a new Web API project: `dotnet new webapi -n ShopAPI`.
2. Add a `GlobalExceptionHandlerMiddleware` class. If an exception occurs during the request, catch it, log it using `ILogger`, and return a 500 Internal Server Error JSON response securely (don't leak stack traces to the user).
3. Register your custom exception middleware at the very top of the pipeline in `Program.cs`.
4. Add a dummy endpoint (`app.MapGet("/test-error", () => { throw new Exception("Boom!"); });`) to verify your middleware catches the crash and returns the JSON successfully.
5. Initialize user secrets for the project and store a dummy secret: `"Jwt:SecretKey"`. Read it in `Program.cs` and print it to the console on startup to verify it works.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| ASP.NET Core Middleware | https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/ |
| Dependency Injection in .NET | https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection |
| Safe Storage of App Secrets | https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets |

---

## 📌 Key Takeaways
- ASP.NET Core uses a composable **middleware pipeline** like a water filtration system.
- **Pipeline order** determines behaviour — exception handling must be first!
- **Transient** (new every time), **Scoped** (per request), and **Singleton** (forever) determine how long injected services live.
- Configuration comes from layered sources. **User Secrets** keep passwords out of source control.
- **.NET Aspire** is the modern way to orchestrate distributed .NET apps locally and in the cloud.

---

**Next Lecture:** [Lecture 40 — Controllers, Routing & Model Binding](./40%20-%20Controllers,%20Routing%20%26%20Model%20Binding.md)
