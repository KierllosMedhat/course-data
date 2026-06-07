using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using ShopAPI.Security.Labs;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. IDENTITY CONFIGURATION
// ==========================================

// TODO: Register AppUser and IdentityRole with AppDbContext
// builder.Services.AddIdentity<AppUser, IdentityRole>() ...

// ==========================================
// 2. JWT BEARER AUTHENTICATION CONFIGURATION
// ==========================================

var secretKey = builder.Configuration["JwtSettings:SecretKey"] ?? "super_secret_key_1234567890123456";
var keyBytes = Encoding.UTF8.GetBytes(secretKey);

// TODO: Configure authentication schemes and JWT options
// builder.Services.AddAuthentication(...)
//     .AddJwtBearer(...)

// ==========================================
// 3. AUTHORIZATION POLICIES
// ==========================================

// TODO: Configure authorization policies
// builder.Services.AddAuthorization(options =>
// {
//     options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
// });

builder.Services.AddControllers();

var app = builder.Build();

// ==========================================
// 4. PIPELINE ORDERING (CRITICAL!)
// ==========================================

app.UseHttpsRedirection();

// TODO: Ensure the correct order for authentication and authorization middleware
// Hint: Authentication MUST run before Authorization!
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
