using System;
using Microsoft.AspNetCore.Identity;

namespace ShopAPI.Security.Labs
{
    // TODO: Inherit from IdentityUser to extend the user model with custom properties
    public class AppUser : IdentityUser
    {
        // TODO: Add custom properties for first name, last name, and user creation timestamp
        // public string FirstName { get; set; } = string.Empty;
        // public string LastName { get; set; } = string.Empty;
        // public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
