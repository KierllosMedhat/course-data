using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ShopAPI.Security.Labs.Dtos;

namespace ShopAPI.Security.Labs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;

        public AuthController(UserManager<AppUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        // TODO: Implement user registration
        // Hint:
        // 1. Instantiate AppUser using fields from RegisterDto
        // 2. Call _userManager.CreateAsync(user, dto.Password)
        // 3. Add default role "User" if creation succeeds
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            return null;
        }

        // TODO: Implement user login and token generation
        // Hint:
        // 1. Find user by email: _userManager.FindByEmailAsync(dto.Email)
        // 2. Check password: _userManager.CheckPasswordAsync(user, dto.Password)
        // 3. Generate token using GenerateJwtToken(user)
        // 4. Return the token and expiration
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            return null;
        }

        private string GenerateJwtToken(AppUser user)
        {
            // TODO: Generate a signed JWT token
            // 1. Define claims (e.g. ClaimTypes.NameIdentifier, ClaimTypes.Email)
            // 2. Fetch key from configuration "JwtSettings:SecretKey"
            // 3. Sign key using SecurityAlgorithms.HmacSha256
            // 4. Write and return token using JwtSecurityTokenHandler
            
            return string.Empty;
        }
    }
}
