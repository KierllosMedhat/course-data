# Lecture 40 — Controllers, Routing & Minimal APIs

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Create API endpoints using both traditional **Controllers** and modern **Minimal APIs**.
- Define RESTful routes with HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
- Apply route constraints for URL-level validation.
- Bind data from the route, query string, request body, and headers.
- Validate incoming data with DataAnnotations.
- Return appropriate HTTP status codes (200, 201, 400, 404).

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Controllers vs Minimal APIs
2. Routing & Route Constraints
3. Model Binding (`[FromRoute]`, `[FromBody]`, etc.)
4. Data Validation (DataAnnotations)
5. Action Results (Status Codes)

### Part 2 — Practice / Lab (~90–120 min)
1. Build a CRUD Controller
2. Build CRUD Minimal APIs
3. ShopAPI Project Part 2: Products API

---

## 1. Controllers vs Minimal APIs

ASP.NET Core offers two ways to build HTTP endpoints.

### Traditional Controllers
Organizes endpoints into classes. Excellent for large, complex APIs.
```csharp
[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() { return Ok(new[] { "Laptop", "Mouse" }); }
}
```

### Minimal APIs (.NET 6+)
Defines endpoints directly in `Program.cs` using lambda functions. Extremely fast, lightweight, and perfect for microservices.
```csharp
var app = builder.Build();

app.MapGet("/api/products", () => new[] { "Laptop", "Mouse" });

app.Run();
```

> [!TIP]
> Both approaches are fully supported in .NET 10 and offer the same performance. Minimal APIs are less verbose, but Controllers provide better organizational structure out-of-the-box. We will use a mix of both!

---

## 2. Routing & Constraints

### Attribute Routing (Controllers)
```csharp
[HttpGet]                    // GET /api/products
[HttpGet("{id}")]            // GET /api/products/42
[HttpPost]                   // POST /api/products
[HttpPut("{id}")]            // PUT /api/products/42
[HttpDelete("{id}")]         // DELETE /api/products/42
```

### Minimal API Routing
```csharp
app.MapGet("/api/products", () => ...);
app.MapGet("/api/products/{id}", (int id) => ...);
app.MapPost("/api/products", (Product p) => ...);
app.MapPut("/api/products/{id}", (int id, Product p) => ...);
app.MapDelete("/api/products/{id}", (int id) => ...);
```

### Route Constraints
You can enforce data types directly in the URL route:
```csharp
[HttpGet("{id:int:min(1)}")]  // ID must be an integer >= 1
```
If the constraint fails, the server returns a **404 Not Found**, not a 400 Bad Request.

---

## 3. Model Binding

Model binding automatically maps HTTP request data to C# parameters:

| Attribute / Source | Description |
|--------------------|-------------|
| `[FromRoute]` | Data from the URL path (e.g. `/api/users/1`) |
| `[FromQuery]` | Data from the query string (e.g. `?name=Alice`) |
| `[FromBody]` | Data from the JSON request body |
| `[FromHeader]` | Data from an HTTP header |

*Note: In Minimal APIs, `[AsParameters]` is often used to bind a complex object from the query string or route.*

---

## 4. Validation — DataAnnotations

Always validate incoming data! Never trust the client.

```csharp
public record CreateProductDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Name { get; init; }

    [Range(0.01, 10000.00)]
    public decimal Price { get; init; }
}
```

If a client sends an invalid request, `[ApiController]` (and Minimal API parameter binding) will automatically intercept it and return a **400 Bad Request** with a detailed JSON response explaining the errors!

---

## 5. Action Results (Status Codes)

Always return the correct HTTP status code!

| Helper | Status Code | Meaning |
|--------|-------------|---------|
| `Ok(data)` / `Results.Ok()` | 200 | Success! Here is your data. |
| `CreatedAtAction()` / `Results.Created()` | 201 | Created successfully! Here is the URL to the new resource. |
| `NoContent()` / `Results.NoContent()` | 204 | Success! (But I have nothing to send back). Often used for PUT/DELETE. |
| `BadRequest(error)` / `Results.BadRequest()` | 400 | Invalid input from the client. |
| `NotFound()` / `Results.NotFound()` | 404 | Resource does not exist. |

### Minimal API Example
```csharp
app.MapGet("/api/products/{id}", (int id) =>
{
    var product = db.GetProduct(id);
    if (product is null) return Results.NotFound();
    return Results.Ok(product);
});
```

---

## 🧪 Practice Labs

### Lab 1 — CRUD Controller (45 min)
1. In your `ShopAPI` project, create a `Controllers` folder.
2. Add a `ProductsController` inheriting from `ControllerBase`.
3. Add `[ApiController]` and `[Route("api/[controller]")]`.
4. Implement all 5 CRUD methods (GetAll, GetById, Create, Update, Delete) using an in-memory `List<Product>`.

### Lab 2 — Minimal APIs (45 min)
1. Open `Program.cs`.
2. Re-implement the same 5 CRUD endpoints for a `Category` entity using `app.MapGet`, `app.MapPost`, etc.
3. Group them using `var group = app.MapGroup("/api/categories");`.

---

## 📝 Assignment: ShopAPI Project — Part 2

We need to add the endpoints for managing the Products in our store!

### Requirements
1. Choose either Controllers OR Minimal APIs.
2. Create the full CRUD endpoints for a `Product` entity.
3. Ensure the `CreateProductDto` uses DataAnnotations (`[Required]`, `[Range]`) to validate the price is > 0 and the name is provided.
4. If a user requests a Product ID that doesn't exist, return a `404 Not Found`.
5. When a product is created, return a `201 Created`.
6. Run the app and use the automatically generated Swagger UI (at `/swagger`) to test your endpoints!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Controllers in ASP.NET Core | https://learn.microsoft.com/en-us/aspnet/core/web-api/ |
| Minimal APIs | https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis |
| Validation | https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation |

---

## 📌 Key Takeaways
- ASP.NET Core supports both **Controllers** (class-based) and **Minimal APIs** (lambda-based).
- **Attribute Routing** and **Minimal API Routing** define the URL paths.
- **Model binding** automatically maps JSON/URL data to C# objects.
- **DataAnnotations** provide declarative validation that returns 400 Bad Request automatically.
- Always return appropriate **HTTP Status Codes** (200, 201, 204, 400, 404).

---

**Next Lecture:** [Lecture 41 — Entity Framework Core with Web API](./41%20-%20Entity%20Framework%20Core%20with%20Web%20API.md)