using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// TODO: Add CORS policy configuration
// 1. Call builder.Services.AddCors()
// 2. Define a policy named "AllowVanillaFrontend"
// 3. Configure the policy to trust your specific frontend origin (e.g. "http://127.0.0.1:5500" or "http://localhost:5500")
// 4. Set AllowAnyHeader() and AllowAnyMethod()
//
// Example structure:
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowVanillaFrontend", policy =>
//     {
//         policy.WithOrigins("http://127.0.0.1:5500")
//               .AllowAnyHeader()
//               .AllowAnyMethod();
//     });
// });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// TODO: Enable CORS in the middleware pipeline
// 1. Call app.UseCors("AllowVanillaFrontend")
// 2. Make sure it is positioned correctly in the pipeline:
//    - It MUST be placed BEFORE app.UseAuthorization() and MapControllers()
//    - It should run before authentication/authorization middleware

app.UseAuthorization();

app.MapControllers();

app.Run();
