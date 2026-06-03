# Lecture 45 — Advanced API Patterns: CQRS, MediatR & Caching

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Apply the CQRS pattern to separate database read logic from write logic
- Use the MediatR library to decouple API Controllers from Business Logic
- Build MediatR Pipeline Behaviors to handle cross-cutting concerns (like Validation) globally
- Centralize complex validation rules cleanly using FluentValidation
- Implement high-performance, stampede-proof caching using `HybridCache`
- Generate compile-time OpenAPI (Swagger) documents using modern .NET Source Generators

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. CQRS: Command Query Responsibility Segregation (The Restaurant Analogy)
2. The Mediator Pattern (MediatR)
3. Centralized Rules with FluentValidation
4. MediatR Pipeline Behaviors
5. High-Performance Caching (`HybridCache`)
6. OpenAPI Source Generation

### Part 2 — Practice / Lab (~90–120 min)
1. Refactor a basic API to CQRS with MediatR
2. Implement FluentValidation as a Pipeline Behavior
3. ShopAPI Project Part 7: CQRS, Validation & Caching

---

## 1. CQRS: Command Query Responsibility Segregation

### The Problem with Traditional CRUD
In a standard CRUD (Create, Read, Update, Delete) application, you use the exact same `Product` class and the exact same `DbContext` to read data as you do to write data.
This is fine for simple apps, but in the real world:
- **Reads** happen 100x more often than writes. We want reads to be extremely fast (cached, no-tracking).
- **Writes** are complex. They require validation, checking business rules, saving to the database, and triggering events.

### The Real-World Analogy: The Restaurant
If you go to a restaurant, you don't walk into the kitchen to look at the ingredients to decide what to eat. 
- You read from a **Menu** (optimized for fast reading). This is the **Query**.
- When you order, you send an **Order Ticket** to the kitchen. The kitchen validates it, cooks it, and updates their inventory. This is the **Command**.

### The CQRS Pattern
CQRS forces you to split your application into two halves:
1. **Commands:** Intent to change state (Create, Update, Delete). Returns void (or an ID).
2. **Queries:** Request for data (Get, List, Search). Returns data. Does not change state.

By splitting them, we can optimize the Read side independently from the Write side!

---

## 2. The Mediator Pattern (MediatR)

If we implement CQRS, our Controllers will have dozens of Services injected into them. To clean this up, we use the **Mediator Pattern**.

Instead of the Controller calling the Database or a Service directly, the Controller sends a Command/Query to a Mediator. The Mediator is a traffic cop; it finds the correct Handler to execute the logic.

```bash
dotnet add package MediatR
```

### The Request and The Handler

```csharp
using MediatR;

// 1. Define the Request (A Query returning a ProductDto)
public record GetProductByIdQuery(int Id) : IRequest<ProductDto>;

// 2. Define the Handler (The kitchen that processes the order)
public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly AppDbContext _db;
    
    public GetProductByIdHandler(AppDbContext db) => _db = db;

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken ct)
    {
        // 1. Fetch from DB
        var product = await _db.Products.FindAsync(request.Id, ct);
        
        // 2. Map to DTO
        return new ProductDto(product.Id, product.Name);
    }
}
```

### Razor-Thin Controllers

Now look at how clean our API Controller is! It doesn't know about EF Core, Repositories, or business logic. It just accepts the HTTP request and hands it to MediatR.

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    public ProductsController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        // MediatR automatically finds the 'GetProductByIdHandler', runs it, and returns the result!
        var result = await _mediator.Send(new GetProductByIdQuery(id));
        return Ok(result);
    }
}
```

---

## 3. Centralized Rules with FluentValidation

Currently, we use Data Annotations (`[Required]`, `[MaxLength]`) directly on our C# classes. This is okay, but it clutters our classes. What if the validation rules are complex (e.g., "End Date must be after Start Date")? Data Annotations fail here.

**FluentValidation** is the industry standard for separating validation rules from your data models.

```bash
dotnet add package FluentValidation.DependencyInjectionExtensions
```

```csharp
using FluentValidation;

// The Command we want to validate
public record CreateProductCommand(string Name, decimal Price) : IRequest<int>;

// The Validator class
public class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        // Fluent API for chaining rules
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required.")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
            
        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than zero.");
    }
}
```

---

## 4. MediatR Pipeline Behaviors

If we are using CQRS and MediatR, **every single request** flows through `_mediator.Send()`. We can inject a piece of middleware *inside* MediatR that intercepts the request before it reaches the handler. This is called an `IPipelineBehavior`.

Let's write a behavior that automatically runs our FluentValidation classes for every single command!

```csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    // Inject all validators we wrote using FluentValidation
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);

            // Run all validators
            var validationResults = await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));
            var failures = validationResults.SelectMany(r => r.Errors).Where(f => f != null).ToList();

            if (failures.Count != 0)
            {
                // If any rule fails, throw an exception! 
                // Our GlobalExceptionHandler from Lecture 43 will catch this and return a 400 Bad Request.
                throw new ValidationException(failures);
            }
        }

        // If validation passes, proceed to the actual Handler!
        return await next();
    }
}
```

---

## 5. High-Performance Caching (`HybridCache`)

Caching saves database trips by storing results in memory. If 1,000 users request the Homepage Products simultaneously, the database shouldn't run 1,000 queries. It should run 1 query and serve the other 999 from RAM.

.NET 9/10 introduces `HybridCache`. It is incredibly robust because it solves the **Cache Stampede** problem. If a cache expires, and 1,000 requests hit simultaneously, `HybridCache` holds 999 of them at the gate, runs 1 database query, updates the cache, and then instantly returns the result to all 1,000 users.

```bash
dotnet add package Microsoft.Extensions.Caching.Hybrid
```

```csharp
// Program.cs
builder.Services.AddHybridCache();
```

### Implementing in a MediatR Handler

```csharp
public class GetProductsHandler : IRequestHandler<GetProductsQuery, List<ProductDto>>
{
    private readonly HybridCache _cache;
    private readonly AppDbContext _db;

    public GetProductsHandler(HybridCache cache, AppDbContext db)
    {
        _cache = cache;
        _db = db;
    }

    public async Task<List<ProductDto>> Handle(GetProductsQuery request, CancellationToken ct)
    {
        // GetOrCreateAsync checks the cache first.
        // If it's missing, it runs the database query, saves it to cache, and returns it.
        return await _cache.GetOrCreateAsync(
            "all-products", // Cache Key
            async cancelToken => await FetchFromDatabaseAsync(cancelToken),
            cancellationToken: ct
        );
    }

    private async Task<List<ProductDto>> FetchFromDatabaseAsync(CancellationToken ct)
    {
        // Heavy DB Query here
        return await _db.Products.Select(p => new ProductDto(p.Id, p.Name)).ToListAsync(ct);
    }
}
```

> [!TIP]
> When you update or delete a product, make sure to call `_cache.RemoveAsync("all-products")` in your Create/Update Command handlers to clear the stale data!

---

## 6. OpenAPI Source Generation

Historically, developers used the `Swashbuckle` library to generate Swagger UI. Swashbuckle worked by using Reflection to scan your controllers while the app was running. This slowed down startup time.

In modern .NET, Microsoft provides built-in OpenAPI support using **Source Generators**. This generates the API documentation at compile-time!

```bash
dotnet add package Microsoft.AspNetCore.OpenApi
```

```csharp
// Program.cs
// This generates the OpenAPI schema during compilation
builder.Services.AddOpenApi(); 

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Serves the schema at /openapi/v1.json
    app.MapOpenApi(); 
    
    // (Optional) You can pair this with a UI package like Scalar or SwaggerUI 
    // to render the visual webpage for testing!
}
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Creating generic MediatR handlers | MediatR is designed for highly specific Use Cases (e.g., `CreateProductHandler`, `ArchiveOrderHandler`). Do not try to make a generic `CrudHandler<T>`. |
| Caching user-specific data globally | Ensure your Cache Keys include the User ID (e.g., `cart-user-42`) if the data is private. |
| Forgetting to invalidate the cache | If you use `HybridCache` to cache a list of products, you must `RemoveAsync` that cache key whenever a new product is added. |

---

## 🧪 Practice Labs

### Lab 1 — MediatR Setup (40 min)
1. Install the `MediatR` package and register it in `Program.cs` using `builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));`.
2. Create a `CreateProductCommand` record and its corresponding `IRequestHandler`.
3. Update your `ProductsController` to inject `IMediator` and use `_mediator.Send()`.

### Lab 2 — FluentValidation (30 min)
1. Install `FluentValidation.DependencyInjectionExtensions`.
2. Write a `CreateProductValidator` class for your `CreateProductCommand`. Ensure the price is > 0.
3. Inject `IValidator<CreateProductCommand>` into your Controller and run `validator.ValidateAsync(command)` manually. If it fails, return a `BadRequest()`. (We will automate this with a Pipeline Behavior in the assignment!)

### Lab 3 — HybridCache (30 min)
1. Install `Microsoft.Extensions.Caching.Hybrid`.
2. Wrap your `GetProductsQueryHandler` database logic inside `_cache.GetOrCreateAsync`.
3. Put a `Console.WriteLine("DB HIT!")` inside the database query method. Hit the endpoint 5 times in Postman and verify it only prints to the console once!

---

## 📝 Assignment: ShopAPI Project — Part 7

Let's modernize our ShopAPI architecture using Enterprise Patterns!

### Requirements
1. **CQRS:** Refactor your `ProductsController` to use MediatR. Create separate folders for `Queries` and `Commands`. You should have classes like `GetAllProductsQuery`, `CreateProductCommand`, and their respective Handlers.
2. **Validation Behavior:** Implement the `ValidationBehavior` class provided in the lecture notes. Register it in `Program.cs`. Delete all Data Annotations from your DTOs and replace them with FluentValidation `AbstractValidator` classes. Verify that invalid requests automatically return a 400 Bad Request!
3. **Caching:** Use `HybridCache` in your `GetAllProductsQueryHandler` to cache the product list. In your `CreateProductCommandHandler`, call `_cache.RemoveAsync` to wipe the cache so the new product shows up on the next request.
4. **OpenAPI:** Remove Swashbuckle (if present) and replace it with Microsoft's native `.AddOpenApi()` source generator.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MediatR GitHub | https://github.com/jbogard/MediatR |
| FluentValidation | https://docs.fluentvalidation.net/ |
| .NET HybridCache | https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid |
| OpenAPI Source Generators | https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/ |

---

## 📌 Key Takeaways
- **CQRS** explicitly separates Read operations (Queries) from Write operations (Commands), allowing independent optimization.
- **MediatR** implements the Mediator pattern, making API Controllers razor-thin and acting as a central nervous system for your app.
- **Pipeline Behaviors** allow you to wrap every MediatR request with global logic, such as automatic Validation or Logging.
- **FluentValidation** cleanly separates business validation rules from data structures.
- **HybridCache** is a modern, high-performance caching solution that natively prevents cache stampedes.
- **OpenAPI Source Generators** build your Swagger documentation at compile-time, boosting startup speed.

---

**Next Lecture:** [Lecture 46 — Testing, CI/CD & Cloud Deployment](./46%20-%20Testing,%20CI%20CD%20%26%20Cloud%20Deployment.md)
