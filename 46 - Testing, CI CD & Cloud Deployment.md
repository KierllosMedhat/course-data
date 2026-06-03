# Lecture 46 — Testing, CI/CD & Cloud Deployment

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Write isolated Unit Tests using the `xUnit` framework and `Moq`.
- Build robust Integration Tests using `WebApplicationFactory` and real Docker databases via `Testcontainers`.
- Understand the difference between JIT and AOT, and compile your app using .NET Native AOT.
- Containerize a .NET application using a multi-stage Dockerfile.
- Build automated CI/CD pipelines with GitHub Actions to test and deploy your code.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Unit Testing: The Engine on a Stand (xUnit & Moq)
2. Integration Testing: The Full Car (Testcontainers)
3. .NET Native AOT Compilation (JIT vs AOT)
4. Docker Containerization
5. CI/CD with GitHub Actions

### Part 2 — Practice / Lab (~90–120 min)
1. Write Unit & Integration Tests
2. Native AOT & Docker Build
3. ShopAPI Project Part 8: Testing & Deployment

---

## 1. Unit Testing: The Engine on a Stand

### The Real-World Analogy: Testing a Car Engine
Imagine you are an engineer building a new car engine. You don't put the engine inside the car, fill it with gas, attach the wheels, and drive it down the highway just to see if the spark plugs work. If the car doesn't start, was it the engine? The battery? The key?
Instead, you mount the engine on a test stand in a controlled environment. 

**Unit Tests** do exactly this. They test a single class (like a MediatR Handler) in complete isolation. If the class depends on a Database or an Email Service, we don't use the real ones. We create "fake" versions called **Mocks**.

```bash
dotnet new xunit -n ShopAPI.Tests
dotnet add package Moq
dotnet add reference ../ShopAPI/ShopAPI.csproj
```

### The AAA Pattern (Arrange, Act, Assert)
Every good test follows three steps:
1. **Arrange:** Set up the initial state and configure the mocks.
2. **Act:** Call the exact method you want to test.
3. **Assert:** Verify the result matches your expectations.

```csharp
using Xunit;
using Moq;

public class GetProductByIdHandlerTests
{
    [Fact] // XUnit attribute marking this as a test
    public async Task Handle_GivenValidId_ReturnsProductDto()
    {
        // 1. ARRANGE
        // Create a fake database repository
        var mockRepo = new Mock<IProductRepository>();
        
        // Tell the fake what to do when asked for ID 1
        mockRepo.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(new Product { Id = 1, Name = "Laptop" });

        // Inject the fake into our real handler
        var handler = new GetProductByIdHandler(mockRepo.Object);

        // 2. ACT
        var result = await handler.Handle(new GetProductByIdQuery(1), CancellationToken.None);

        // 3. ASSERT
        Assert.NotNull(result);
        Assert.Equal("Laptop", result.Name);
    }
}
```

---

## 2. Integration Testing: The Full Car

While unit tests are fast, they don't prove that your App, your Database, and your APIs all wire together correctly. **Integration Tests** test the entire HTTP request pipeline.

In the past, developers used SQLite "In-Memory" databases for this. **This is a terrible practice** because SQLite behaves differently than SQL Server/PostgreSQL. A query might pass in testing but crash in production!

Modern .NET solves this using **Testcontainers** — a library that automatically spins up a real Docker container of SQL Server specifically for your test, and deletes it when the test finishes!

```bash
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Testcontainers.SqlEdge
```

### WebApplicationFactory
This class spins up your entire `Program.cs` in memory for testing.

```csharp
public class ShopApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    // Define a real SQL Server Docker container
    private readonly SqlEdgeContainer _dbContainer = new SqlEdgeBuilder().Build();

    public async Task InitializeAsync() => await _dbContainer.StartAsync();
    public new async Task DisposeAsync() => await _dbContainer.DisposeAsync();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the real connection string
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<ShopContext>));
            if (descriptor != null) services.Remove(descriptor);

            // Add the DbContext back, but point it to the dynamic Docker container!
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
        // This client routes directly into the in-memory Test API!
        _client = factory.CreateClient(); 
    }

    [Fact]
    public async Task GetProducts_Returns200OK()
    {
        // Act
        var response = await _client.GetAsync("/api/products");
        
        // Assert
        response.EnsureSuccessStatusCode(); // Automatically throws if the API returns 500 or 404!
    }
}
```

---

## 3. .NET Native AOT Compilation

Historically, C# compiles to Intermediate Language (IL). When you run the app, a JIT (Just-In-Time) compiler translates the IL into machine code on the fly. This makes startup slightly slow.

.NET 8/9/10 introduced **Native AOT (Ahead-of-Time) Compilation**. It skips IL entirely and compiles your C# directly into a raw `.exe` or Linux binary, just like C++ or Rust!

- **Pros:** Instant startup time (<50 milliseconds), incredibly low memory usage (often <50MB RAM). Perfect for Docker and AWS Lambdas!
- **Cons:** Slower compile times. Some Reflection features are not supported.

To enable it, just add one line to your `.csproj`:
```xml
<PropertyGroup>
  <PublishAot>true</PublishAot>
</PropertyGroup>
```

---

## 4. Docker Containerization

To deploy an API to AWS, Azure, or Railway, you must package it. A Docker container is a lightweight, standalone, executable package that includes everything needed to run your app (Code, .NET Runtime, Linux OS).

### The Multi-Stage Dockerfile (Optimized for AOT)
We use a "multi-stage" build. Stage 1 has the massive .NET SDK to compile the code. Stage 2 only contains the tiny native binary!

```dockerfile
# STAGE 1: Build Environment
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src

# Copy code and restore packages
COPY . .
RUN dotnet restore

# Publish using AOT for Alpine Linux
RUN dotnet publish -c Release -r linux-musl-x64 -o /app/publish

# STAGE 2: Runtime Environment (Super Small!)
FROM mcr.microsoft.com/dotnet/runtime-deps:10.0-alpine AS runtime
WORKDIR /app

# Copy ONLY the final native binary from Stage 1
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["./ShopAPI"] 
```

---

## 5. CI/CD with GitHub Actions

Continuous Integration (CI) and Continuous Deployment (CD) are automated pipelines. Every time you push to GitHub, a server should automatically build your code, run your tests, and if everything passes, deploy it to the cloud.

Create a file in your repository: `.github/workflows/deploy.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ] # Run whenever code is pushed to main

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup .NET 10
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: '10.0.x'
        
    - name: Run Tests
      # If tests fail, the entire pipeline stops and turns red!
      run: dotnet test
      
    - name: Build Docker Image
      # Only runs if the tests passed
      run: docker build -t my-shop-api .
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Mocking everything in a test | Mocks are brittle. Use Mocks for external dependencies (DBs, Emails) but test real logic where possible. |
| Using SQLite In-Memory for Integration tests | Use Testcontainers. SQLite has different syntax and constraints than SQL Server/Postgres. |
| Not using multi-stage Docker builds | Your final Docker image will be 800MB+ because it includes the .NET SDK. Multi-stage AOT builds result in <50MB images! |
| Deploying broken code manually | Always set up a CI pipeline (GitHub actions) that runs `dotnet test` before any deployment. |

---

## 🧪 Practice Labs

### Lab 1 — Unit Tests (45 min)
1. Add a new `xUnit` project to your solution.
2. Add the `Moq` NuGet package.
3. Write a test for your `GetProductsQueryHandler`. Mock the `IUnitOfWork` to return a fake list of 3 products. Assert that the handler returns exactly 3 DTOs.

### Lab 2 — Docker & AOT (45 min)
1. Add `<PublishAot>true</PublishAot>` to your Web API `.csproj`.
2. Create a `Dockerfile` using the multi-stage Alpine template provided.
3. Open your terminal, run `docker build -t myapi .`
4. Run `docker run -p 8080:8080 myapi`. Watch how fast it starts up!

---

## 📝 Assignment: ShopAPI Project — Part 8

Let's test and deploy our eCommerce Backend!

### Requirements
1. Add a `ShopAPI.Tests` xUnit project.
2. Write at least 3 Unit Tests using Moq (e.g., testing that your `CreateProductCommand` throws an error if the Database fails, or succeeds and returns the correct ID).
3. Set up `WebApplicationFactory` and write at least 1 Integration Test that makes an HTTP GET request to `/api/products` and asserts it returns a `200 OK`.
4. Enable AOT compilation in your `ShopAPI`.
5. Write a multi-stage Dockerfile to build your API.
6. Push your code to GitHub and create a GitHub Action workflow to automatically run `dotnet test` and `docker build` on every push!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| xUnit Documentation | https://xunit.net/ |
| Moq Framework | https://github.com/moq/moq |
| Testcontainers for .NET | https://testcontainers.com/modules/dotnet/ |
| GitHub Actions for .NET | https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-net |

---

## 📌 Key Takeaways
- **Unit Tests** test logic in complete isolation using fakes (Mocks).
- **Integration Tests** verify the entire system. **Testcontainers** provides real, disposable Docker databases for accurate testing!
- **Native AOT** compiles C# directly to native machine code, bypassing JIT for incredible startup performance and tiny sizes.
- **Docker** ensures your app runs exactly the same on your laptop, the CI server, and in the cloud.
- **GitHub Actions** automates your quality control (testing) and deployment (CI/CD).

---

**Next Lecture:** [Lecture 47 — Full-Stack Integration — Angular + ASP.NET Web API](./47%20-%20Full-Stack%20Integration%20-%20Angular%20+%20ASP.NET%20Web%20API.md)