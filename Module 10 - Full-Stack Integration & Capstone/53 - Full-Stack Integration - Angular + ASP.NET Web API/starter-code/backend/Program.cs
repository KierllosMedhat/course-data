using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// TODO: Configure CORS in ShopAPI to safely accept requests ONLY from http://localhost:4200 (Angular default port)
// 1. Call builder.Services.AddCors()
// 2. Add a policy named "ShopAppCorsPolicy"
// 3. Chain WithOrigins("http://localhost:4200") to explicitly target your Angular app
// 4. Do NOT use AllowAnyOrigin() as it compromises security
// 5. Allow any header and method to enable JWT authentication and full REST operations
builder.Services.AddCors(options =>
{
    options.AddPolicy("ShopAppCorsPolicy", policy =>
    {
        // TODO: Complete the policy configuration here
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

// TODO: Place app.UseCors("ShopAppCorsPolicy") at the correct order in the middleware pipeline
// - Must be placed BEFORE app.UseAuthentication() and app.UseAuthorization()
// - Must be placed AFTER app.UseRouting() (if explicitly defined)
app.UseCors("ShopAppCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
