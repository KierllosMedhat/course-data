# Lecture 39 — ASP.NET Core Fundamentals & Middleware

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Describe the ASP.NET Core architecture and request pipeline.
- Create Web API projects using the minimal hosting model.
- Build custom middleware with `Use`, `Run`, and custom classes.
- Register services with dependency injection (Transient, Scoped, Singleton, and Keyed Services).
- Configure applications using `appsettings.json`, environment variables, and User Secrets.
- Understand the role of .NET Aspire in cloud-native applications.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. ASP.NET Core Architecture (Kestrel & Middleware Pipeline)
2. Project Structure & `Program.cs`
3. Middleware: Built-in & Custom
4. Dependency Injection & Keyed Services
5. Configuration & Environments
6. Introduction to .NET Aspire

### Part 2 — Practice / Lab (~90–120 min)
1. Create a Web API and trace the pipeline
2. Build a custom RequestTimingMiddleware
3. ShopAPI Project Part 1: Setup & Middleware

---

## 1. ASP.NET Core Architecture

ASP.NET Core uses a composable **middleware pipeline** to process incoming HTTP requests and generate HTTP responses.

```
Incoming HTTP Request
    ↓
Kestrel (cross-platform HTTP server)
    ↓
Middleware 1 (Exception Handling)
    ↓
Middleware 2 (Routing)
    ↓
Middleware 3 (Your API Endpoints)
    ↓
HTTP Response (flows back UP through the pipeline)
```

Each middleware can perform work **before** calling the next component AND **after** it returns.

---

## 2. Project Structure & `Program.cs`

Let's create a new Web API:
```bash
dotnet new webapi -n ShopAPI
```

### The Minimal Hosting Model (`Program.cs`)
Modern ASP.NET Core puts everything into a single file without a `Startup.cs` class.

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Add services to the container (Dependency Injection)
builder.Services.AddControllers();
builder.Services.AddOpenApi(); // For Swagger/OpenAPI docs

var app = builder.Build();

// 2. Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// 3. Run the application
app.Run();
```

---

## 3. Middleware

### `Use` and `Run`
You can define inline middleware:
```csharp
// Use passes control to the next middleware
app.Use(async (context, next) =>
{
    Console.WriteLine("Before next middleware");
    await next(context);
    Console.WriteLine("After next middleware");
});

// Run is terminal (ends the pipeline)
app.Run(async context =>
{
    await context.Response.WriteAsync("Hello World!");
});
```

### Custom Middleware Classes
For complex logic, create a class:
```csharp
public class RequestTimingMiddleware(RequestDelegate next, ILogger<RequestTimingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        await next(context); // Call the next middleware in the pipeline
        sw.Stop();
        
        logger.LogInformation($"Request {context.Request.Path} took {sw.ElapsedMilliseconds}ms");
    }
}

// In Program.cs
app.UseMiddleware<RequestTimingMiddleware>();
```

> [!WARNING]
> Pipeline order matters! Exception handling must be **first** to catch errors from all downstream middleware. Authentication must come **before** authorization.

---

## 4. Dependency Injection (DI)

ASP.NET Core has a built-in IoC (Inversion of Control) container.

### Service Lifetimes
| Lifetime | Created | Use Case |
|----------|---------|----------|
| **Transient** | Every time it's requested | Lightweight, stateless services |
| **Scoped** | Once per HTTP request | DbContext, per-request state |
| **Singleton** | Once for app lifetime | Cache, configuration, thread-safe loggers |

```csharp
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddScoped<AppDbContext>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
```

### Keyed Services (.NET 8+)
If you have multiple implementations of the same interface, you can register them with keys!
```csharp
builder.Services.AddKeyedSingleton<ICacheService, RedisCacheService>("redis");
builder.Services.AddKeyedSingleton<ICacheService, InMemoryCacheService>("memory");

// Injecting it:
public class MyController([FromKeyedServices("redis")] ICacheService cache) { ... }
```

---

## 5. Configuration & Environments

ASP.NET Core reads configuration from multiple sources, overriding in this order (lowest to highest priority):
1. `appsettings.json`
2. `appsettings.{Environment}.json` (e.g. `appsettings.Development.json`)
3. User Secrets (Dev only)
4. Environment variables
5. Command-line arguments

### Reading Configuration
```csharp
// Program.cs
string dbPassword = builder.Configuration["Database:Password"];
```

### User Secrets
Never commit API keys or database passwords to GitHub! Use the Secret Manager for local development:
```bash
dotnet user-secrets init
dotnet user-secrets set "Database:Password" "MySuperSecretPassword"
```

---

## 6. Introduction to .NET Aspire

**.NET Aspire** is an opinionated, cloud-ready stack for building observable, production-ready distributed applications. 
While we are building a single API for now, Aspire allows you to easily orchestrate multiple microservices, databases (like PostgreSQL/Redis), and frontend apps (like our Angular app) locally with a beautiful dashboard!

If you create an Aspire project, it provides:
- **AppHost:** A central project that spins up your API, database containers, and frontend simultaneously.
- **Service Defaults:** Pre-configured telemetry, health checks, and resilience (retries/timeouts).

We will introduce Aspire features as our application grows!

---

## 🧪 Practice Labs

### Lab 1 — Trace the Pipeline (30 min)
1. Run `dotnet new webapi -n PipelineLab`.
2. Open `Program.cs`.
3. Add two inline `app.Use` middleware blocks that print to the console before and after calling `next`.
4. Run the app and observe the console output order!

### Lab 2 — Request Timing Middleware (30 min)
1. Create a `RequestTimingMiddleware` class.
2. Inject an `ILogger` into its primary constructor.
3. Use a `Stopwatch` to measure how long the request takes.
4. Register it in `Program.cs`.

---

## 📝 Assignment: ShopAPI Project — Part 1

We are starting the backend for our E-commerce application!

### Requirements
1. Create a new Web API project: `dotnet new webapi -n ShopAPI`.
2. Add a `GlobalExceptionHandlerMiddleware` class. If an exception occurs during the request, catch it, log it as an Error, and return a 500 Internal Server Error JSON response.
3. Register your custom exception middleware at the very top of the pipeline in `Program.cs`.
4. Add a dummy endpoint (`app.MapGet("/test-error", () => { throw new Exception("Boom!"); });`) to verify your middleware works.

**Submission:** Your project folder!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| ASP.NET Core Fundamentals | https://learn.microsoft.com/en-us/aspnet/core/fundamentals/ |
| Middleware | https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/ |
| .NET Aspire | https://learn.microsoft.com/en-us/dotnet/aspire/ |

---

## 📌 Key Takeaways
- ASP.NET Core uses a composable **middleware pipeline**.
- **Pipeline order** determines behaviour — exception handling first!
- **Keyed Services** allow multiple implementations of the same interface.
- Configuration comes from layered sources — **User Secrets** keep passwords out of source control.
- **.NET Aspire** is the modern way to orchestrate distributed .NET apps.

---

**Next Lecture:** [Lecture 40 — Controllers, Routing & Model Binding](./40%20-%20Controllers,%20Routing%20%26%20Model%20Binding.md)