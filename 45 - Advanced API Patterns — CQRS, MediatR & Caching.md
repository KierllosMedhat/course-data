# Lecture 45 — Advanced API Patterns: CQRS, MediatR & Caching

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Apply the CQRS pattern to separate Read and Write logic.
- Use MediatR to decouple API Controllers from Business Logic.
- Build MediatR Pipeline Behaviors for cross-cutting concerns (Logging, Validation).
- Centralize validation using FluentValidation.
- Implement high-performance caching using `HybridCache`.
- Generate compile-time OpenAPI (Swagger) documents using .NET Source Generators.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. CQRS (Command Query Responsibility Segregation)
2. The Mediator Pattern (MediatR)
3. Pipeline Behaviors & FluentValidation
4. High-Performance Caching (`HybridCache`)
5. OpenAPI Source Generation

### Part 2 — Practice / Lab (~90–120 min)
1. Refactor API to CQRS with MediatR
2. Add FluentValidation
3. ShopAPI Project Part 7: CQRS & Caching

---

## 1. CQRS (Command Query Responsibility Segregation)

In a traditional CRUD app, you use the same `Product` model to read and write to the database.
In CQRS, you split them:
- **Commands:** Intent to change state (Create, Update, Delete). Returns void (or an ID).
- **Queries:** Request for data (Get, List, Search). Returns data. Does not change state.

Why?
- Reads happen 100x more often than writes. We can optimize reads (caching, No-Tracking) without affecting write logic (validation, transactions).

---

## 2. The Mediator Pattern (MediatR)

Instead of the Controller calling the Database or a Service directly, the Controller sends a Command/Query to a Mediator. The Mediator finds the correct Handler to execute the logic.

```bash
dotnet add package MediatR
```

### The Query & The Handler
```csharp
// 1. Define the Request
public record GetProductByIdQuery(int Id) : IRequest<ProductDto>;

// 2. Define the Handler
public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly AppDbContext _db;
    public GetProductByIdHandler(AppDbContext db) => _db = db;

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken ct)
    {
        var product = await _db.Products.FindAsync(request.Id, ct);
        return new ProductDto(product.Id, product.Name);
    }
}
```

### Razor-Thin Controllers
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
        var result = await _mediator.Send(new GetProductByIdQuery(id));
        return Ok(result);
    }
}
```

---

## 3. Pipeline Behaviors & FluentValidation

Because every request goes through `_mediator.Send()`, we can inject logic *around* it. This is called a Pipeline Behavior.

### FluentValidation
Instead of `[Required]` attributes polluting our models, we put validation in separate classes.
```bash
dotnet add package FluentValidation
dotnet add package FluentValidation.DependencyInjectionExtensions
```

```csharp
public class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Price).GreaterThan(0);
    }
}
```

### The Validation Behavior
We can write a MediatR Behavior that runs FluentValidation automatically BEFORE the Handler is called. If validation fails, it throws an exception (which our `IExceptionHandler` from Lecture 43 will catch and turn into a 400 Bad Request!).

---

## 4. High-Performance Caching (`HybridCache`)

Caching saves database trips by storing results in memory. .NET 9/10 introduces `HybridCache`, a robust system that handles memory caching (L1), distributed caching like Redis (L2), and prevents "cache stampedes".

```bash
dotnet add package Microsoft.Extensions.Caching.Hybrid
```

```csharp
// Program.cs
builder.Services.AddHybridCache();

// Inside a MediatR Handler:
public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken ct)
{
    return await _cache.GetOrCreateAsync(
        $"product-{request.Id}", // Cache Key
        async cancelToken => await _db.GetProductFromDbAsync(request.Id, cancelToken),
        cancellationToken: ct
    );
}
```

If the product is in the cache, it returns it instantly. If not, it runs the DB query, saves it to the cache, and returns it!

---

## 5. OpenAPI Source Generation

Historically, Swashbuckle was used to generate Swagger UI by reflecting over your code at runtime. 
In modern .NET, we can generate OpenAPI documents at **compile time** using Source Generators! This makes the app start much faster and trims down the binary size.

```bash
dotnet add package Microsoft.AspNetCore.OpenApi
```

```csharp
// Program.cs
builder.Services.AddOpenApi(); // Generates the OpenAPI spec

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // Serves the .json spec
    // You can pair this with Scalar or SwaggerUI to render the UI!
}
```

---

## 🧪 Practice Labs

### Lab 1 — MediatR Setup (40 min)
1. Install MediatR and register it in `Program.cs`.
2. Create a `CreateProductCommand` and its Handler.
3. Update your `ProductsController` to use `_mediator.Send()`.

### Lab 2 — FluentValidation (30 min)
1. Install FluentValidation.
2. Write a Validator for your `CreateProductCommand`.
3. Add it to DI and run the validator manually in your Controller. (Bonus: Try writing a MediatR `IPipelineBehavior` to run it automatically!)

### Lab 3 — HybridCache (30 min)
1. Install `Microsoft.Extensions.Caching.Hybrid`.
2. Register it in `Program.cs`.
3. Wrap your `GetProductsQueryHandler` logic in `_cache.GetOrCreateAsync`.
4. Add a breakpoint to your DB query and verify it only hits the database once!

---

## 📝 Assignment: ShopAPI Project — Part 7

Let's modernize our ShopAPI architecture!

### Requirements
1. Refactor your API to use **MediatR**. Your controllers should only contain `_mediator.Send()` calls.
2. Implement **FluentValidation** for your Create and Update commands.
3. Use **HybridCache** to cache the results of your `GET` endpoints.
4. When a product is Created, Updated, or Deleted, use `_cache.RemoveAsync` to clear the cached data!
5. Swap out Swashbuckle for the modern `.AddOpenApi()` source generator.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MediatR | https://github.com/jbogard/MediatR |
| FluentValidation | https://docs.fluentvalidation.net/ |
| HybridCache | https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid |
| OpenAPI in .NET | https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/ |

---

## 📌 Key Takeaways
- **CQRS** separates Read logic (Queries) from Write logic (Commands).
- **MediatR** is a library that implements the Mediator pattern, making Controllers razor-thin.
- **Pipeline Behaviors** allow you to apply logic (like Validation) globally across all requests.
- **FluentValidation** moves validation rules out of models and into dedicated classes.
- **HybridCache** provides high-performance, stampede-proof caching.
- **OpenAPI Source Generators** build your API docs at compile-time instead of runtime.

---

**Next Lecture:** [Lecture 46 — Testing, CI/CD & Cloud Deployment](./46%20-%20Testing,%20CI%20CD%20%26%20Cloud%20Deployment.md)