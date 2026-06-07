using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);

// 1. Add essential services
builder.Services.AddControllers();

// TODO: Add Production CORS configurations
builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionCorsPolicy", policy =>
    {
        policy.WithOrigins("https://your-production-angular-app.com") // Replace with actual production URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// TODO: Register HybridCache (requires Microsoft.Extensions.Caching.Hybrid NuGet package)
// builder.Services.AddHybridCache();

// TODO: Register Health Checks for SqlServer and Redis
builder.Services.AddHealthChecks()
    .AddCheck("SelfCheck", () => HealthCheckResult.Healthy(), tags: new[] { "live" });
    // TODO: Chain database and caching health checks:
    // .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), name: "SQLServer", tags: new[] { "ready" })
    // .AddRedis(builder.Configuration.GetConnectionString("RedisConnection"), name: "RedisCache", tags: new[] { "ready" });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    // Production Global Exception Handler to avoid stack trace leak
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/problem+json";
            await context.Response.WriteAsJsonAsync(new {
                Status = 500,
                Title = "An unexpected error occurred in production.",
                Detail = "Please contact system administrator if this persists."
            });
        });
    });
    
    app.UseHsts();
}

app.UseHttpsRedirection();

// Use optimized static assets delivery for SPA files
// app.MapStaticAssets(); // ASP.NET Core 10 production optimization

app.UseCors("ProductionCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Map Health Check endpoints
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("live")
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});

app.MapControllers();

app.Run();
