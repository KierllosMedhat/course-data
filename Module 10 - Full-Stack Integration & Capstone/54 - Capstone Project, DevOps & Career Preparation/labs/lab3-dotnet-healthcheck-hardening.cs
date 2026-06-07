using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// TODO: Configure Health Checks
// 1. Add builder.Services.AddHealthChecks()
// 2. Add SQL Server check (requires AspNetCore.HealthChecks.SqlServer NuGet)
// 3. Add Redis check (requires AspNetCore.HealthChecks.Redis NuGet)
//
// Example:
// builder.Services.AddHealthChecks()
//     .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), tags: new[] { "ready" })
//     .AddRedis(builder.Configuration.GetConnectionString("RedisConnection"), tags: new[] { "ready" });

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

// TODO: Map the endpoints in the middleware pipeline
// - Map "/health/live" for checking if the web server is running (non-db query)
// - Map "/health/ready" to verify SQL and Redis are responding to requests
//
// Example:
// app.MapHealthChecks("/health/live", new HealthCheckOptions { Predicate = _ => false }); // Returns 200 immediately
// app.MapHealthChecks("/health/ready", new HealthCheckOptions {
//     Predicate = check => check.Tags.Contains("ready")
// });

app.MapControllers();

app.Run();

/*
  TODO Instructions for performance hardening (AsNoTracking):
  
  In your repository or controller implementations, look for read-only queries (like fetching product list or categories).
  Add .AsNoTracking() to the EF Core query before calling .ToListAsync() or .FirstOrDefaultAsync().
  
  Example:
  public async Task<List<ProductDto>> GetProductsAsync()
  {
      return await _dbContext.Products
          .AsNoTracking() // <-- MUST add this for maximum performance and low memory allocation
          .Select(p => new ProductDto(p.Id, p.Name, p.Price))
          .ToListAsync();
  }
*/
