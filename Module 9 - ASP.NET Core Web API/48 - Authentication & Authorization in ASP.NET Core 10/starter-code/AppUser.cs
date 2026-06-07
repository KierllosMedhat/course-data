using System;
using Microsoft.AspNetCore.Identity;

namespace ShopAPI.Security.Assignment
{
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        // TODO: Define properties for storing the Refresh Token and its Expiry Date
        // public string? RefreshToken { get; set; }
        // public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}
