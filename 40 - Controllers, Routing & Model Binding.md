# Lecture 40 — Controllers, Routing & Model Binding

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain the role of API Controllers in a modern backend
- Setup Controller classes using `ControllerBase` and the `[ApiController]` attribute
- Route HTTP requests to specific methods using Attribute Routing
- Bind data from HTTP requests (Body, Query, Route, Headers) directly to C# variables
- Return standard HTTP Response Codes using `IActionResult`
- Implement basic data validation using Data Annotations

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is an API Controller? (The Drive-Thru Analogy)
2. Attribute Routing: Directing Traffic
3. HTTP Verbs & Action Methods
4. Model Binding: Extracting Data from Requests
5. Action Results: Sending Proper Responses
6. Data Validation (`ModelState`)

### Part 2 — Practice / Lab (~90–120 min)
1. Build a basic `ProductsController` with hardcoded data
2. Use Postman to test all 5 CRUD operations
3. ShopAPI Project Part 2: Product Controllers & Validation

---

## 1. What is an API Controller?

### The Real-World Analogy: The Drive-Thru Speaker

Imagine a fast-food drive-thru. 
- You pull up in your car (The **HTTP Request** from the frontend).
- You speak your order into the **Speaker System** ("I want a burger").
- The speaker system doesn't cook the burger. It just listens to what you want, translates it for the kitchen, and when the food is ready, hands it back to you (The **HTTP Response**).

In ASP.NET Core, an **API Controller** is the Speaker System. It is the entry point for incoming HTTP requests. It doesn't contain heavy business logic or database queries; it simply receives the request, asks a Service or Repository to do the work, and returns the result to the user.

### Building a Controller

A Web API controller must inherit from `ControllerBase` and should be decorated with `[ApiController]`.

```csharp
using Microsoft.AspNetCore.Mvc;

// 1. The Route attribute determines the URL path (e.g., /api/products)
[Route("api/[controller]")]
// 2. The ApiController attribute enables automatic validation and binding
[ApiController]
// 3. Inherit from ControllerBase (NOT Controller, which is for MVC views with HTML)
public class ProductsController : ControllerBase
{
    // Endpoints go here...
}
```

> [!NOTE]
> `[controller]` is a special token. It is automatically replaced with the name of the class minus the word "Controller". So `ProductsController` becomes `api/products`.

---

## 2. Attribute Routing: Directing Traffic

When a request arrives at `https://api.example.com/api/products/5`, how does ASP.NET know which C# method to run? It uses **Routing**.

We use **Attribute Routing** by placing `[Http...]` attributes directly above our methods.

```csharp
[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    // Matches: GET /api/products
    [HttpGet]
    public string GetAll() 
    {
        return "All products";
    }

    // Matches: GET /api/products/5
    // The "{id}" part is a route parameter!
    [HttpGet("{id}")]
    public string GetById(int id) 
    {
        return $"Product {id}";
    }
}
```

---

## 3. HTTP Verbs & Action Methods

A standard REST API maps the classic CRUD operations (Create, Read, Update, Delete) to specific HTTP Verbs.

| Action | HTTP Verb | Route Example | C# Attribute |
|--------|-----------|---------------|--------------|
| Read (All) | **GET** | `/api/products` | `[HttpGet]` |
| Read (One) | **GET** | `/api/products/{id}` | `[HttpGet("{id}")]` |
| Create | **POST** | `/api/products` | `[HttpPost]` |
| Update | **PUT** | `/api/products/{id}` | `[HttpPut("{id}")]` |
| Delete | **DELETE** | `/api/products/{id}` | `[HttpDelete("{id}")]` |

---

## 4. Model Binding: Extracting Data

When the frontend sends data, where does it come from? It could be in the URL, the Query String, or the JSON Body. **Model Binding** is the magic where ASP.NET extracts that data and puts it directly into your C# variables!

You explicitly tell ASP.NET where to look using binding attributes.

### `[FromRoute]` (The URL Path)
Used to identify a specific resource.
```csharp
// GET /api/products/42
[HttpGet("{id}")]
public string GetProduct([FromRoute] int id) 
{
    return $"Fetching product {id}";
}
```

### `[FromQuery]` (The Query String)
Used for filtering, sorting, or pagination. It comes after the `?` in the URL.
```csharp
// GET /api/products?category=shoes&limit=10
[HttpGet]
public string GetFiltered([FromQuery] string category, [FromQuery] int limit) 
{
    return $"Fetching {limit} items from {category}";
}
```

### `[FromBody]` (The JSON Payload)
Used when the client sends a large JSON object (like filling out a form).
```csharp
public record CreateProductDto(string Name, decimal Price);

// POST /api/products
// Body: { "name": "Laptop", "price": 1200 }
[HttpPost]
public string CreateProduct([FromBody] CreateProductDto newProduct) 
{
    return $"Created {newProduct.Name} for ${newProduct.Price}";
}
```

> [!TIP]
> Thanks to the `[ApiController]` attribute on the class, ASP.NET Core often guesses these correctly automatically. But it is considered a **best practice** to explicitly write them so your code is self-documenting.

---

## 5. Action Results: Sending Proper Responses

When your API finishes, it shouldn't just return a raw string or object. It needs to return a proper HTTP Status Code so the frontend knows if it succeeded or failed!

To do this, we return `IActionResult` (or `ActionResult<T>`) and use built-in helper methods.

### Success Codes (200s)
```csharp
[HttpGet]
public IActionResult GetEverything()
{
    var list = new[] { "Apple", "Banana" };
    
    // Returns HTTP 200 OK along with the JSON array
    return Ok(list); 
}

[HttpPost]
public IActionResult CreateSomething()
{
    // Returns HTTP 201 Created
    return Created(); 
}
```

### Client Error Codes (400s)
```csharp
[HttpGet("{id}")]
public IActionResult GetSingle(int id)
{
    if (id < 1) 
    {
        // Returns HTTP 400 Bad Request
        return BadRequest("ID must be greater than zero."); 
    }

    var product = database.Find(id);
    if (product == null)
    {
        // Returns HTTP 404 Not Found
        return NotFound(); 
    }

    return Ok(product);
}
```

---

## 6. Data Validation (`ModelState`)

You should **never** trust data sent by the frontend. A malicious user could bypass the Angular validation and send bad data directly to your API using Postman.

We use **Data Annotations** on our DTO (Data Transfer Object) classes to enforce rules.

### Step 1: Annotate the Class
```csharp
using System.ComponentModel.DataAnnotations;

public class CreateUserDto
{
    [Required(ErrorMessage = "Username is required!")]
    [StringLength(20, MinimumLength = 3)]
    public string Username { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Range(18, 99)]
    public int Age { get; set; }
}
```

### Step 2: Receive it in the Controller
Because of the `[ApiController]` attribute on your controller, you don't even have to write `if (!ModelState.IsValid)`. ASP.NET Core will automatically intercept the bad request and instantly return a `400 Bad Request` with a detailed JSON error message detailing exactly which fields failed validation!

```csharp
[HttpPost]
public IActionResult CreateUser([FromBody] CreateUserDto dto)
{
    // If the data reaches this line, it is 100% valid!
    // The API Controller rejected it automatically if it wasn't.
    
    // Save to database...
    return Ok("User created successfully!");
}
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Inheriting from `Controller` instead of `ControllerBase` | `Controller` includes view-rendering logic for MVC websites. For APIs, always use `ControllerBase` to save memory. |
| Forgetting `[ApiController]` | Without it, automatic Model Binding validation won't work, and you'll have to manually check `ModelState.IsValid` in every method. |
| Returning raw objects (`public Product Get()`) | Return `ActionResult<Product>` so you can return `NotFound()` if the item doesn't exist. |
| Trusting the client | Always use Data Annotations (`[Required]`, `[MaxLength]`) on any data coming from `[FromBody]`. |

---

## 🧪 Practice Labs

### Lab 1 — Basic Products Controller (40 min)
1. Create a `ProductsController` inheriting from `ControllerBase`.
2. Add the `[ApiController]` and `[Route("api/[controller]")]` attributes.
3. Create a static `List<string>` inside the controller with 3 mock products.
4. Implement `[HttpGet]` to return the whole list wrapped in `Ok()`.
5. Implement `[HttpGet("{id}")]` to return a single item by index, or `NotFound()` if out of bounds.
6. Implement `[HttpPost]` that takes a `[FromBody] string newProduct` and adds it to the list.

### Lab 2 — Testing with Postman (20 min)
1. Run your API.
2. Open Postman or Swagger.
3. Make a GET request to `/api/products`.
4. Make a POST request with a JSON body: `"New Phone"` and ensure it gets added!

---

## 📝 Assignment: ShopAPI Project — Part 2

Let's build the controllers for our E-commerce backend!

### Requirements
1. Create a `ProductsController`.
2. For now, create a static hardcoded `List<Product>` inside the controller to act as a fake database.
3. Create a `CreateProductDto` record with properties for `Name` (Required, Max length 50), `Price` (Range 0.01 to 10000), and `Description`.
4. Implement all 5 standard CRUD endpoints (`GetAll`, `GetById`, `Create`, `Update`, `Delete`).
5. Ensure `GetById`, `Update`, and `Delete` return `NotFound()` if the product ID doesn't exist in your list.
6. Test your validations by trying to POST a product with an empty name or negative price via Swagger. Confirm that ASP.NET Core returns a 400 Bad Request automatically!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| ASP.NET Core Controllers | https://learn.microsoft.com/en-us/aspnet/core/web-api/ |
| Model Binding | https://learn.microsoft.com/en-us/aspnet/core/mvc/models/model-binding |
| Action Return Types | https://learn.microsoft.com/en-us/aspnet/core/web-api/action-return-types |

---

## 📌 Key Takeaways
- **API Controllers** (`ControllerBase`) act as the entry point for HTTP requests.
- **Attribute Routing** (`[Route]`) maps URLs directly to C# methods.
- **Model Binding** attributes (`[FromQuery]`, `[FromBody]`, `[FromRoute]`) explicitly define where incoming data should be extracted from.
- **Action Results** (`Ok()`, `NotFound()`, `BadRequest()`) ensure you send the correct HTTP Status Codes back to the client.
- **Data Annotations** paired with `[ApiController]` provide zero-effort, automatic validation for incoming JSON payloads.

---

**Next Lecture:** [Lecture 41 — Entity Framework Core with Web API](./41%20-%20Entity%20Framework%20Core%20with%20Web%20API.md)
