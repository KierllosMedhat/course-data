// AUTHENTICATION & AUTHORIZATION — Lecture 42
// Program.cs Example configuration for JWT Bearer Authentication

/*
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Authentication Services
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// 2. Add Authorization Services
builder.Services.AddAuthorization(options =>
{
    // Custom Policy Example
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();

// 3. Add Auth Middleware to Pipeline (MUST be between UseRouting and UseEndpoints/MapControllers)
app.UseAuthentication(); // Verifies WHO you are
app.UseAuthorization();  // Verifies WHAT you can do

app.MapControllers();
app.Run();
*/

// ==========================================
// CONTROLLER EXAMPLE
// ==========================================
/*
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
// [Authorize] at the class level secures all endpoints by default
[Authorize]
public class SecureDataController : ControllerBase
{
    [HttpGet("public")]
    [AllowAnonymous] // Overrides class-level [Authorize]
    public IActionResult GetPublicData()
    {
        return Ok("Anyone can see this.");
    }

    [HttpGet("protected")]
    public IActionResult GetProtectedData()
    {
        // Accessing the claims of the currently authenticated user
        var userId = User.FindFirst("sub")?.Value;
        return Ok($"This is protected data for user {userId}.");
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")] // Requires the Admin role
    // [Authorize(Policy = "AdminOnly")] // Alternative using policy
    public IActionResult GetAdminData()
    {
        return Ok("Only admins can see this.");
    }
}
*/
