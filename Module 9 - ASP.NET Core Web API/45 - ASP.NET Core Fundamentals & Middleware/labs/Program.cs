using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using EnterpriseShopAPI.Middleware;
using EnterpriseShopAPI.Labs;

var builder = WebApplication.CreateBuilder(args);

// =========================================================================
// SERVICES REGISTRATION (Dependency Injection Container)
// =========================================================================

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// TODO: Lab 2 - Register your Guid Generators with their correct lifetimes:
// 1. ITransientGenerator -> TransientGenerator (Transient)
// 2. IScopedGenerator -> ScopedGenerator (Scoped)
// 3. ISingletonGenerator -> SingletonGenerator (Singleton)

var app = builder.Build();

// =========================================================================
// MIDDLEWARE PIPELINE CONFIGURATION
// =========================================================================

// TODO: Lab 1 - Register the GlobalExceptionMiddleware at the very beginning of the pipeline
// Hint: app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

// TODO: Lab 1 - Add a dummy endpoint "/crash" to test the global exception middleware
// Hint: app.MapGet("/crash", () => { ... });

app.MapControllers();

app.Run();
