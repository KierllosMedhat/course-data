# Lecture 42 — Authentication & Authorization in ASP.NET Core 10

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Distinguish between Authentication ("who are you?") and Authorization ("what can you do?").
- Explain the structure of a JSON Web Token (JWT).
- Configure JWT Bearer authentication in an ASP.NET Core API.
- Use ASP.NET Core Identity for user management (registration, login, roles).
- Protect API endpoints using `[Authorize]` attributes and Role-based authorization.
- Implement a secure Refresh Token system.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Authentication vs Authorization
2. JSON Web Tokens (JWT)
3. ASP.NET Core Identity
4. JWT Authentication Setup
5. Authorization (Roles & Policies)
6. Refresh Tokens

### Part 2 — Practice / Lab (~90–120 min)
1. JWT Generation and Validation
2. Protecting Endpoints with Roles
3. ShopAPI Project Part 4: Auth Integration

---

## 1. Authentication vs Authorization

| Concept | Question | Middleware | HTTP Error |
|---------|----------|------------|------------|
| **Authentication** | Who are you? | `UseAuthentication()` | 401 Unauthorized |
| **Authorization** | What can you do? | `UseAuthorization()` | 403 Forbidden |

> [!WARNING]
> `UseAuthentication()` must **always** come before `UseAuthorization()` in your pipeline (`Program.cs`). You can't check what someone is allowed to do before you know who they are!

---

## 2. JSON Web Tokens (JWT)

A JWT is a string sent by the client in the `Authorization` header (`Bearer <token>`). It proves the user is logged in.

It has 3 parts:
1. **Header:** Algorithm used (e.g., HS256).
2. **Payload (Claims):** Data about the user (e.g., `UserId`, `Email`, `Role`).
3. **Signature:** A cryptographic hash verifying the token was created by YOUR server and hasn't been tampered with.

> [!CAUTION]
> JWTs are **encoded**, not encrypted! Anyone can decode the payload. Never put passwords or highly sensitive data inside a JWT payload.

---

## 3. ASP.NET Core Identity

Identity is a built-in membership system for ASP.NET Core.

### Setup
```bash
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

```csharp
// Change DbContext inheritance
public class AppDbContext : IdentityDbContext<IdentityUser> { ... }

// Program.cs
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();
```

Identity gives us access to the `UserManager<IdentityUser>` to create users, check passwords, and manage roles!

---

## 4. JWT Authentication Setup

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

### Configure in Program.cs
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero // Tokens expire EXACTLY when they say they do
        };
    });
```

### Generating a Token
```csharp
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

var token = new JwtSecurityToken(
    claims: claims, // List of user claims
    expires: DateTime.UtcNow.AddMinutes(15),
    signingCredentials: creds
);

string jwt = new JwtSecurityTokenHandler().WriteToken(token);
```

---

## 5. Authorization

Protect your endpoints using attributes!

```csharp
[Authorize] // Any logged-in user
[HttpGet("profile")]
public ActionResult GetProfile() { ... }

[AllowAnonymous] // Anyone (even if controller has [Authorize])
[HttpPost("login")]
public ActionResult Login() { ... }

[Authorize(Roles = "Admin")] // Only users in the Admin role
[HttpDelete("{id}")]
public ActionResult DeleteProduct(int id) { ... }
```

---

## 6. Refresh Tokens

Access tokens (JWTs) should have a short lifespan (e.g., 15 minutes) for security. If a token is stolen, the hacker only has 15 minutes to use it.

When the access token expires, the client uses a **Refresh Token** (stored in the database with a longer lifespan, e.g., 7 days) to get a new access token without making the user log in again.

1. Client sends expired Access Token + valid Refresh Token.
2. Server validates Refresh Token in DB.
3. Server revokes old Refresh Token, issues a new Access Token + new Refresh Token.

---

## 🧪 Practice Labs

### Lab 1 — JWT Generation & Validation (40 min)
1. Add `Microsoft.AspNetCore.Authentication.JwtBearer`.
2. Configure `AddAuthentication().AddJwtBearer()` in `Program.cs`.
3. Create an `AuthController` with a `Login` endpoint that generates a mock JWT.
4. Add `[Authorize]` to a `TestController` and try calling it with and without the token in Swagger.

### Lab 2 — Roles (30 min)
1. Change your `TestController` endpoint to `[Authorize(Roles = "Admin")]`.
2. Generate a token WITH the Admin role claim and test it.
3. Generate a token WITHOUT the Admin role claim and verify you get a 403 Forbidden.

---

## 📝 Assignment: ShopAPI Project — Part 4

Let's secure our eCommerce API!

### Requirements
1. Install Identity and JWT packages.
2. Update your `ShopContext` to inherit from `IdentityDbContext<IdentityUser>`. Run a migration!
3. Register Identity and JWT Authentication in `Program.cs`.
4. Create an `AuthController` with `/register` and `/login` endpoints using the `UserManager`.
5. Secure your `ProductsController`:
   - `GET` requests should be `[AllowAnonymous]`.
   - `POST`, `PUT`, `DELETE` should be `[Authorize(Roles = "Admin")]`.
6. Use Swagger to test logging in, getting a token, and adding a product as an Admin!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Identity Introduction | https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity |
| JWT Bearer Authentication | https://learn.microsoft.com/en-us/aspnet/core/security/authentication/jwt |

---

## 📌 Key Takeaways
- **Authentication** (401) is who you are. **Authorization** (403) is what you can do.
- **JWTs** are standard tokens containing Claims. They are signed, not encrypted.
- **ASP.NET Core Identity** handles users, passwords, and roles out-of-the-box.
- **Refresh Tokens** allow for short-lived access tokens while maintaining a good user experience.

---

**Next Lecture:** [Lecture 43 — Global Error Handling, Logging & API Versioning](./43%20-%20Global%20Error%20Handling,%20Logging%20%26%20API%20Versioning.md)