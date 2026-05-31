# Lecture 41 — Entity Framework Core with Web API

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Integrate EF Core 10 into an ASP.NET Core Web API.
- Implement the Repository and Unit of Work patterns.
- Design Data Transfer Objects (DTOs) to prevent over-posting and circular references.
- Map entities to DTOs automatically using AutoMapper.
- Implement offset-based pagination.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Registering `DbContext` with DI
2. The Repository & Unit of Work Patterns
3. DTOs (Data Transfer Objects)
4. AutoMapper Integration
5. Pagination

### Part 2 — Practice / Lab (~90–120 min)
1. Repository & Unit of Work Implementation
2. AutoMapper Setup
3. ShopAPI Project Part 3: EF Core Integration

---

## 1. Registering DbContext with DI

```csharp
// Program.cs
builder.Services.AddDbContext<ShopContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
```

> [!WARNING]
> `DbContext` is registered as **Scoped** by default (one per HTTP request). It is NOT thread-safe, so never register it as Singleton.

---

## 2. Repository & Unit of Work Patterns

If your application has complex business logic, abstracting EF Core behind a Repository makes your code easier to test and maintain.

### Generic Repository Interface
```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IReadOnlyList<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Remove(T entity);
}
```

### Unit of Work
The Unit of Work orchestrates multiple repositories and shares a single `DbContext`.
```csharp
public interface IUnitOfWork
{
    IRepository<Product> Products { get; }
    IRepository<Category> Categories { get; }
    
    // Only the Unit of Work calls SaveChanges!
    Task<int> CompleteAsync(); 
}
```

---

## 3. Data Transfer Objects (DTOs)

Never return your database Entity classes directly from your API!
- **Circular References:** A Product has a Category, a Category has Products... JSON serialization will crash in an infinite loop.
- **Over-posting:** A user shouldn't be able to send an `IsAdmin=true` field when updating their profile.

Create dedicated DTOs for the API contract:
```csharp
// The Database Entity
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public Category Category { get; set; } // Complex
}

// The API Response DTO
public record ProductDto(int Id, string Name, decimal Price, string CategoryName);
```

---

## 4. AutoMapper

Writing `new ProductDto { Name = p.Name, ... }` manually gets tedious. **AutoMapper** automates this!

### 1. Install AutoMapper
```bash
dotnet add package AutoMapper
```

### 2. Create a Profile
AutoMapper automatically maps properties with the same name. It can also "flatten" objects (e.g. `Category.Name` -> `CategoryName`).
```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>(); // Entity -> DTO
        CreateMap<CreateProductDto, Product>(); // DTO -> Entity
    }
}
```

### 3. Use it in the API
```csharp
[HttpGet]
public async Task<ActionResult<List<ProductDto>>> GetProducts()
{
    var products = await _unitOfWork.Products.GetAllAsync();
    var dtos = _mapper.Map<List<ProductDto>>(products);
    return Ok(dtos);
}
```

---

## 5. Pagination

Don't return 10,000 products at once. Use `.Skip()` and `.Take()`.

```csharp
public async Task<List<Product>> GetPagedProductsAsync(int pageIndex, int pageSize)
{
    return await _context.Products
        .Skip((pageIndex - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
}
```

Return the total count in a custom HTTP header (`X-Pagination`) or a wrapper object so the Angular frontend knows how many pages exist!

---

## 🧪 Practice Labs

### Lab 1 — AutoMapper (40 min)
1. Install AutoMapper via NuGet.
2. Create a `User` entity and a `UserDto` record.
3. Create a `MappingProfile` and register AutoMapper in `Program.cs`.
4. Inject `IMapper` into your controller and map a `User` to a `UserDto`.

### Lab 2 — Pagination (40 min)
1. Add `[FromQuery] int page = 1` and `[FromQuery] int pageSize = 10` to your GetAll endpoint.
2. Modify your EF Core query to use `.Skip()` and `.Take()`.
3. Test it in Swagger!

---

## 📝 Assignment: ShopAPI Project — Part 3

Let's integrate EF Core and DTOs into our ShopAPI!

### Requirements
1. Install `Microsoft.EntityFrameworkCore.Sqlite`, `Design`, and `AutoMapper`.
2. Create a `ShopContext` with `Products` and `Categories`. Create migrations and update your database.
3. Create an `IRepository<T>` and `IUnitOfWork`. Register them in DI.
4. Create a `ProductDto` and a `CreateProductDto`.
5. Refactor your `ProductsController` to use `IUnitOfWork` and `IMapper`.
6. Add Pagination to the `GET /api/products` endpoint.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| EF Core Documentation | https://learn.microsoft.com/en-us/ef/core/ |
| AutoMapper | https://docs.automapper.org/ |

---

## 📌 Key Takeaways
- **`AddDbContext`** registers EF Core with a Scoped lifetime.
- **Repository & Unit of Work** patterns cleanly abstract database access.
- **DTOs** are mandatory to prevent circular references and over-posting.
- **AutoMapper** eliminates manual mapping code.
- **Pagination** (`Skip`/`Take`) is essential for performance.

---

**Next Lecture:** [Lecture 42 — Authentication & Authorization in ASP.NET Core 10](./42%20-%20Authentication%20%26%20Authorization%20in%20ASP.NET%20Core%2010.md)