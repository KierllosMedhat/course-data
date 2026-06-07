using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ShopAPI.Security.Assignment.Dtos;

namespace ShopAPI.Security.Assignment.Controllers
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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // TODO: Implement user registration
            return null;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // TODO: Authenticate user, and if successful:
            // 1. Generate access token (JWT) using GenerateAccessToken(user)
            // 2. Generate refresh token using GenerateRefreshToken()
            // 3. Save refresh token and its expiration (e.g. DateTime.UtcNow.AddDays(7)) to the user entity
            // 4. Save updates via _userManager.UpdateAsync(user)
            // 5. Return both tokens to the client
            
            return null;
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] TokenRequestDto tokenRequest)
        {
            // TODO: Implement the Refresh Token logic
            // 1. Extract ClaimsPrincipal from the expired Access Token using GetPrincipalFromExpiredToken(tokenRequest.AccessToken)
            // 2. Locate the user in the database using the subject/name ID claim
            // 3. Validate that the user's stored refresh token matches tokenRequest.RefreshToken
            // 4. Validate that the user's stored refresh token has not expired (DateTime.UtcNow < user.RefreshTokenExpiryTime)
            // 5. If valid, generate a NEW access token and a NEW refresh token
            // 6. Save the new refresh token and expiry back to the database
            // 7. Return the new access token and refresh token
            
            return null;
        }

        [Authorize]
        [HttpPost("revoke")]
        public async Task<IActionResult> Revoke()
        {
            // TODO: Revoke current user session
            // 1. Get the current user's ID from User.FindFirst(ClaimTypes.NameIdentifier)
            // 2. Load the user from the database
            // 3. Nullify user.RefreshToken and user.RefreshTokenExpiryTime
            // 4. Call _userManager.UpdateAsync(user)
            // 5. Return NoContent()
            
            return null;
        }

        private string GenerateAccessToken(AppUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!)
            };

            var tokenOptions = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15), // Short-lived
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        private string GenerateRefreshToken()
        {
            // Generate a random, cryptographically secure 64-byte string
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidAudience = _config["JwtSettings:Audience"],
                ValidateIssuer = true,
                ValidIssuer = _config["JwtSettings:Issuer"],
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!)),
                ValidateLifetime = false // CRITICAL: We want to inspect claims of an already expired token!
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            
            if (securityToken is not JwtSecurityToken jwtSecurityToken || 
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }
    }

    // Dummy DTO classes to prevent compile errors in AuthController
    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
