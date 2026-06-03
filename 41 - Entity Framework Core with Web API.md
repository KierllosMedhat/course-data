# Lecture 41 — Entity Framework Core with Web API

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Integrate EF Core securely into an ASP.NET Core Web API using Dependency Injection
- Understand when and how to implement the Repository and Unit of Work patterns
- Design Data Transfer Objects (DTOs) to prevent over-posting and infinite JSON loops
- Automate object mapping from Entities to DTOs using AutoMapper
- Implement efficient database pagination using `.Skip()` and `.Take()`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Integrating `DbContext` in ASP.NET Core
2. The Repository & Unit of Work Patterns
3. DTOs (Data Transfer Objects): The Plated Meal Analogy
4. AutoMapper: Eliminating Boilerplate
5. Efficient Pagination

### Part 2 — Practice / Lab (~90–120 min)
1. Implementing generic Repositories
2. Configuring AutoMapper Profiles
3. ShopAPI Project Part 3: Database & DTO Integration

---

## 1. Integrating `DbContext` in ASP.NET Core

In a previous lecture, we built a console app and hardcoded the SQLite connection string inside `OnConfiguring`. In a Web API, we configure the database centrally in `Program.cs` so we can securely pull the connection string from `appsettings.json`.

### Step 1: `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=shop.db"
  }
}
```

### Step 2: `Program.cs`

```csharp
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Fetch the connection string securely
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Register the DbContext with the DI Container
builder.Services.AddDbContext<ShopContext>(options =>
{
    options.UseSqlite(connectionString);
});
```

> [!WARNING]
> `AddDbContext` registers your context as **Scoped** by default. This is perfect because it creates a new database connection at the start of an HTTP request and closes it at the end. Never register a `DbContext` as a Singleton, because it is not thread-safe!

---

## 2. The Repository & Unit of Work Patterns

While you *can* inject `ShopContext` directly into your API Controllers, this tightly couples your API to Entity Framework Core. If your application grows complex, abstracting data access behind a Repository is highly recommended.

### The Generic Repository Interface

Instead of writing a repository for every single entity, we write one Generic Repository!

```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IReadOnlyList<T>> GetAllAsync();
    
    // Notice these don't return Task. They just mark the entity as added/removed in memory!
    void Add(T entity);
    void Remove(T entity);
}
```

### The Unit of Work (The Conductor)

If we have multiple repositories (e.g., `ProductRepository` and `OrderRepository`), we need a way to ensure that if we add an Order and update a Product, both changes are saved to the database simultaneously in a single transaction.

The **Unit of Work** holds all the repositories and provides a single method to save changes.

```csharp
public interface IUnitOfWork : IDisposable
{
    IRepository<Product> Products { get; }
    IRepository<Category> Categories { get; }
    
    // The only place where we actually call _context.SaveChangesAsync()
    Task<int> CompleteAsync(); 
}
```

### Controller Usage
```csharp
[HttpPost]
public async Task<IActionResult> CreateProduct(Product product)
{
    // Mark for addition in memory
    _unitOfWork.Products.Add(product);
    
    // Commit to the database
    await _unitOfWork.CompleteAsync(); 
    
    return Ok();
}
```

---

## 3. DTOs (Data Transfer Objects): The Plated Meal Analogy

### The Real-World Analogy

Imagine you order a steak at a restaurant. 
- The **Entity** is the raw slab of meat, the bag of potatoes, and the carton of butter sitting in the kitchen fridge.
- The **DTO (Data Transfer Object)** is the beautifully plated steak with mashed potatoes placed on your table.

You should **never** send raw Entities from your database directly to the user, and you should never accept raw Entities directly from the user's HTTP request.

### Problem 1: Over-posting (Security Flaw)

```csharp
public class User 
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsAdmin { get; set; } // DANGER!
}
```
If a hacker sends `{"name": "Hacker", "isAdmin": true}`, and you bind that directly to the `User` entity, you just gave them admin rights! 

**Solution:** Create a `CreateUserDto` that only contains `Name`.

### Problem 2: Circular References (Infinite Loops)

```csharp
public class Category { public List<Product> Products { get; set; } }
public class Product { public Category Category { get; set; } }
```
If you return a `Product`, the JSON serializer will serialize the `Category`. Inside the Category, it finds the `Product`. Inside the Product, it finds the `Category`... and your API crashes with an infinite loop exception!

### The DTO Solution

Always map Database Entities to API DTOs before returning data.

```csharp
// API Contract (What the frontend sees)
public record ProductDto(int Id, string Name, decimal Price, string CategoryName);

// Controller
[HttpGet]
public async Task<ActionResult<List<ProductDto>>> Get()
{
    var products = await _db.Products.Include(p => p.Category).ToListAsync();
    
    // Manual mapping
    var dtos = products.Select(p => new ProductDto(
        p.Id, p.Name, p.Price, p.Category.Name
    )).ToList();
    
    return Ok(dtos);
}
```

---

## 4. AutoMapper: Eliminating Boilerplate

Manual mapping (`p.Name = dto.Name`) becomes tedious when you have 30 properties. **AutoMapper** is a popular library that does this automatically using Reflection.

### 1. Installation

```bash
dotnet add package AutoMapper
```

### 2. Create a Mapping Profile

AutoMapper automatically maps properties with identical names. It also has a superpower called "Flattening". If your DTO has a property called `CategoryName`, AutoMapper will automatically look for `entity.Category.Name`!

```csharp
using AutoMapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Source -> Destination
        CreateMap<Product, ProductDto>(); 
        
        // Reverse mapping for creating
        CreateMap<CreateProductDto, Product>(); 
    }
}
```

### 3. Register and Use in the API

```csharp
// Program.cs
// Tells AutoMapper to scan the assembly for classes inheriting from 'Profile'
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
```

```csharp
// Controller
private readonly IMapper _mapper;

public ProductsController(IMapper mapper) { _mapper = mapper; }

[HttpGet]
public async Task<IActionResult> GetProducts()
{
    var products = await _unitOfWork.Products.GetAllAsync();
    
    // One line of code transforms the entire list!
    var data = _mapper.Map<IReadOnlyList<ProductDto>>(products);
    
    return Ok(data);
}
```

---

## 5. Efficient Pagination

If your database has 1 million products, you cannot return them all in one `GET` request. The server will run out of memory, and the user's browser will crash. 

We use **Offset-based Pagination** using LINQ's `.Skip()` and `.Take()`.

### The Logic

To get Page 3, where each page has 10 items:
- We want items 21 through 30.
- We **Skip** the first 20 items: `Skip((3 - 1) * 10)`
- We **Take** 10 items: `Take(10)`

### The Implementation

```csharp
[HttpGet]
public async Task<IActionResult> GetPagedProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
{
    // Maximum page size to prevent abuse
    if (pageSize > 50) pageSize = 50;

    // Execute query in the database
    var products = await _context.Products
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
        
    return Ok(products);
}
```

> [!NOTE]
> It is also good practice to return the **Total Count** of items in the database, so the Angular frontend knows exactly how many pages exist to render the `[1] [2] [3] [4]` pagination buttons.

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Returning raw database Entities from an API | Always map to DTOs to prevent circular references and data leaks. |
| Making `.Add()` asynchronous in a generic repository | Adding to EF Core memory is synchronous (`_context.Set<T>().Add(entity)`). Only `SaveChangesAsync()` needs to be awaited. |
| Calling `SaveChanges` inside a Repository loop | Use the Unit of Work pattern so `SaveChanges` is only called once at the very end of the HTTP request. |
| Writing 50 lines of manual mapping code | Install and configure AutoMapper profiles. |

---

## 🧪 Practice Labs

### Lab 1 — AutoMapper (40 min)
1. Install the `AutoMapper` package.
2. Create an `Employee` entity (Id, Name, Salary, Department).
3. Create an `EmployeeDto` (Id, Name, DepartmentName) - deliberately hiding the Salary!
4. Create a `MappingProfile`.
5. Write a Controller endpoint that loads employees, maps them to DTOs using `IMapper`, and returns them. Ensure the Salary is not in the JSON response!

### Lab 2 — Pagination (40 min)
1. Add `page` and `pageSize` query parameters to a GET endpoint.
2. Apply `.Skip()` and `.Take()` to the EF Core query.
3. Test it via Postman or Swagger by requesting `?page=2&pageSize=5`.

---

## 📝 Assignment: ShopAPI Project — Part 3

Let's integrate EF Core and DTOs into our actual ShopAPI backend!

### Requirements
1. Install the required EF Core and AutoMapper packages.
2. Build the `ShopContext` containing `Products` and `Brands`. Add a SQLite connection string to `appsettings.json`.
3. Create the Generic `IRepository<T>` and the `IUnitOfWork`. Register them in DI as `Scoped`.
4. Create a `ProductDto` and a `CreateProductDto`.
5. Set up AutoMapper profiles mapping between your entities and DTOs.
6. Refactor your `ProductsController`:
   - Inject `IUnitOfWork` and `IMapper`.
   - Update `GetAll` to return DTOs and implement Pagination (`Skip`/`Take`).
   - Update `Create` to accept a `CreateProductDto`, map it to an entity, add it via UnitOf Work, and save.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| EF Core DbContext | https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/ |
| AutoMapper Docs | https://docs.automapper.org/en/stable/ |
| Repository Pattern in ASP.NET Core | https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design |

---

## 📌 Key Takeaways
- **`AddDbContext`** centrally configures EF Core via Dependency Injection (Scoped lifetime).
- **The Generic Repository** abstracts duplicate EF Core code (`GetAll`, `GetById`).
- **The Unit of Work** ensures multiple database changes happen in a single, safe transaction.
- **DTOs** are mandatory! Never return your internal database entities to the public internet.
- **AutoMapper** replaces manual `dto.Name = entity.Name` code with clean, profile-based configurations.
- **Pagination** uses `.Skip()` and `.Take()` to fetch data in small chunks, keeping your API lightning fast.

---

**Next Lecture:** [Lecture 42 — Authentication & Authorization in ASP.NET Core 10](./42%20-%20Authentication%20%26%20Authorization%20in%20ASP.NET%20Core%2010.md)