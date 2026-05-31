# Lecture 46 — Testing, CI/CD & Cloud Deployment

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Write Unit Tests using xUnit and Moq.
- Write Integration Tests using `WebApplicationFactory` and Testcontainers.
- Compile your application ahead-of-time using .NET Native AOT.
- Build CI/CD pipelines with GitHub Actions.
- Containerize your API using Docker.
- Deploy to the cloud (Azure / Railway).

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Unit Testing (xUnit & Moq)
2. Integration Testing & Testcontainers
3. .NET Native AOT Compilation
4. Docker Containerization
5. CI/CD with GitHub Actions

### Part 2 — Practice / Lab (~90–120 min)
1. Write Unit & Integration Tests
2. Native AOT & Docker Build
3. ShopAPI Project Part 8: Testing & Deployment

---

## 1. Unit Testing (xUnit & Moq)

Unit tests isolate a single class to ensure it works correctly.
We use **Moq** to "fake" dependencies like the Database.

```bash
dotnet new xunit -n ShopAPI.Tests
dotnet add package Moq
dotnet add reference ../ShopAPI/ShopAPI.csproj
```

### Arrange, Act, Assert
```csharp
[Fact]
public async Task GetProduct_ReturnsProduct_WhenIdExists()
{
    // Arrange
    var mockDb = new Mock<IProductRepository>();
    mockDb.Setup(repo => repo.GetByIdAsync(1))
          .ReturnsAsync(new Product { Id = 1, Name = "Laptop" });

    var handler = new GetProductByIdHandler(mockDb.Object);

    // Act
    var result = await handler.Handle(new GetProductByIdQuery(1), CancellationToken.None);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("Laptop", result.Name);
}
```

---

## 2. Integration Testing & Testcontainers

Integration tests run the full API pipeline (Controllers, MediatR, Database).
Instead of a fake database, modern .NET 10 uses **Testcontainers** — actual Docker containers spun up just for your test!

```bash
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Testcontainers.SqlEdge
```

### WebApplicationFactory
```csharp
public class ShopApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly SqlEdgeContainer _dbContainer = new SqlEdgeBuilder().Build();

    public async Task InitializeAsync() => await _dbContainer.StartAsync();
    public new async Task DisposeAsync() => await _dbContainer.DisposeAsync();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Replace the real connection string with the Testcontainer's connection string!
            services.RemoveAll<DbContextOptions<ShopContext>>();
            services.AddDbContext<ShopContext>(options =>
                options.UseSqlServer(_dbContainer.GetConnectionString()));
        });
    }
}
```

### The Test
```csharp
public class ProductApiTests : IClassFixture<ShopApiFactory>
{
    private readonly HttpClient _client;

    public ProductApiTests(ShopApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_Returns200OK()
    {
        var response = await _client.GetAsync("/api/products");
        response.EnsureSuccessStatusCode(); // Throws if not 2xx
    }
}
```

---

## 3. .NET Native AOT Compilation

.NET 10 has massive improvements for **AOT (Ahead-of-Time)** compilation.
Instead of JIT (Just-In-Time) compilation on the server, your app is compiled directly to native machine code.

- **Pros:** Tiny memory footprint (MBs instead of GBs), instant startup time (<50ms). Perfect for Serverless/Containers!
- **Cons:** Slower build times, reflection behaves differently.

To enable AOT, simply add this to your `.csproj`:
```xml
<PropertyGroup>
  <PublishAot>true</PublishAot>
</PropertyGroup>
```

---

## 4. Docker Containerization

To deploy our API anywhere, we put it in a Docker container.

### Multi-Stage Dockerfile (with AOT support)
```dockerfile
# 1. Build environment
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src
COPY . .
# Publish using AOT for Alpine Linux
RUN dotnet publish -c Release -r linux-musl-x64 -o /app/publish

# 2. Runtime environment
FROM mcr.microsoft.com/dotnet/runtime-deps:10.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["./ShopAPI"] # Native binary!
```

---

## 5. CI/CD with GitHub Actions

Continuous Integration / Continuous Deployment automatically runs our tests and deploys our code when we push to `main`.

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy API
on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup .NET 10
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: '10.0.x'
        
    - name: Run Tests
      run: dotnet test
      
    - name: Build Docker Image
      run: docker build -t shopapi .
      
    # Add steps here to push to DockerHub and deploy to Azure/Railway!
```

---

## 🧪 Practice Labs

### Lab 1 — Unit Tests (45 min)
1. Create a `Tests` project.
2. Use Moq to mock your `IUnitOfWork` or `DbContext`.
3. Write a test for your `GetProductsQueryHandler`.

### Lab 2 — Docker & AOT (45 min)
1. Add `<PublishAot>true</PublishAot>` to your API.
2. Create a Dockerfile.
3. Build the image: `docker build -t myapi .`
4. Run the image: `docker run -p 8080:8080 myapi`. Witness the instant startup!

---

## 📝 Assignment: ShopAPI Project — Part 8

Let's test and deploy our ShopAPI!

### Requirements
1. Add an xUnit Test Project.
2. Write at least 3 Unit Tests for your MediatR Handlers.
3. Write at least 1 Integration Test using `WebApplicationFactory`.
4. Enable AOT compilation in your `ShopAPI`.
5. Write a multi-stage Dockerfile to build your API.
6. Push your code to GitHub and create a GitHub Action to automatically build and test your code on every push!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| xUnit | https://xunit.net/ |
| Moq | https://github.com/moq/moq |
| Testcontainers | https://testcontainers.com/ |
| Native AOT in ASP.NET Core | https://learn.microsoft.com/en-us/aspnet/core/fundamentals/native-aot |

---

## 📌 Key Takeaways
- **Unit Tests** test logic in isolation using Mocks.
- **Integration Tests** test the whole system. **Testcontainers** provides real Docker databases for testing!
- **Native AOT** compiles C# to native machine code for incredible performance and tiny sizes.
- **Docker** ensures your app runs exactly the same everywhere.
- **GitHub Actions** automates your testing and deployment pipelines.

---

**Next Lecture:** [Lecture 47 — Full-Stack Integration — Angular + ASP.NET Web API](./47%20-%20Full-Stack%20Integration%20%E2%80%94%20Angular%20+%20ASP.NET%20Web%20API.md)