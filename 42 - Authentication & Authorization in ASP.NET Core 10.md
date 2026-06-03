# Lecture 42 — Authentication & Authorization in ASP.NET Core 10

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Clearly distinguish between Authentication and Authorization
- Understand the structure and lifecycle of a JSON Web Token (JWT)
- Configure JWT Bearer authentication in an ASP.NET Core API
- Use ASP.NET Core Identity to manage users, passwords, and roles
- Protect API endpoints using the `[Authorize]` attribute and Role-based security
- Implement a secure Refresh Token system for long-lived sessions

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Authentication vs Authorization (The Nightclub Analogy)
2. JSON Web Tokens (JWT): The Digital VIP Pass
3. ASP.NET Core Identity: Built-in User Management
4. JWT Authentication Setup
5. Authorization (Roles & Policies)
6. Security Architecture: Refresh Tokens

### Part 2 — Practice / Lab (~90–120 min)
1. JWT Generation and Validation
2. Protecting Endpoints with Roles
3. ShopAPI Project Part 4: Auth Integration

---

## 1. Authentication vs Authorization

These two terms sound similar but mean entirely different things in software security.

### The Real-World Analogy: The Nightclub

**Authentication (AuthN): "Who are you?"**
You walk up to the bouncer at the front door of a nightclub. The bouncer asks for your ID. You hand them your driver's license. The bouncer verifies the ID is real and matches your face. 
*Result:* You are allowed inside the building.

**Authorization (AuthZ): "What are you allowed to do?"**
Once inside, you try to walk into the VIP lounge. A second bouncer stops you and checks your wristband. You don't have a VIP wristband. The bouncer knows exactly *who* you are (you were authenticated at the front door), but you are *not allowed* in this specific room.
*Result:* Access denied.

### In ASP.NET Core

| Concept | Question | Middleware | HTTP Error |
|---------|----------|------------|------------|
| **Authentication** | Who are you? | `app.UseAuthentication()` | `401 Unauthorized` |
| **Authorization** | What can you do? | `app.UseAuthorization()` | `403 Forbidden` |

> [!WARNING]
> `UseAuthentication()` must **always** come before `UseAuthorization()` in your `Program.cs` pipeline. The bouncer at the VIP room can't check your wristband if you never made it past the front door!

---

## 2. JSON Web Tokens (JWT): The Digital VIP Pass

In traditional web apps, the server remembers who is logged in using Session Cookies (stateful). In modern APIs, servers are **stateless**. The server forgets who you are the moment the request ends.

To solve this, we use a **JSON Web Token (JWT)**. When the user logs in successfully, the server creates a JWT and hands it to the user. For every subsequent request, the user includes the JWT in the HTTP headers (`Authorization: Bearer <token>`). 

### The Structure of a JWT

A JWT is a long string separated by dots into 3 parts: `Header.Payload.Signature`

1. **Header:** Contains metadata (e.g., "I am a JWT and I was signed using the HS256 algorithm").
2. **Payload (Claims):** The actual data about the user. A "claim" is just a fact about the user (e.g., `Name: Alice`, `Role: Admin`, `Exp: 1712345678`).
3. **Signature:** This is the magic. The server takes the Header, Payload, and a **Secret Key** (that only the server knows) and hashes them together. 

When the user sends the token back, the server re-calculates the signature using its Secret Key. If the signatures match, the server knows the token is 100% genuine and hasn't been tampered with!

> [!CAUTION]
> JWTs are **digitally signed**, but they are **NOT encrypted**! Anyone can decode the payload and read the claims using a site like `jwt.io`. **NEVER put passwords, credit cards, or highly sensitive data inside a JWT payload.**

---

## 3. ASP.NET Core Identity: Built-in User Management

You *could* write your own code to hash passwords and store users in a database, but security is hard. **ASP.NET Core Identity** is an out-of-the-box framework that handles user registration, password hashing (using bcrypt/PBKDF2), roles, and database tables for you.

### 1. Installation
```bash
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

### 2. Update the DbContext
Instead of inheriting from `DbContext`, inherit from `IdentityDbContext`. This automatically adds 7 new tables to your database (AspNetUsers, AspNetRoles, etc.).
```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    
    public DbSet<Product> Products { get; set; }
}
```

### 3. Register Identity in Program.cs
```csharp
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();
```

Identity gives us access to a powerful service called `UserManager<IdentityUser>`. You inject this into your controllers to securely create users and check passwords!

---

## 4. JWT Authentication Setup

We need to tell ASP.NET Core how to read the JWTs the frontend sends us.

### 1. Installation
```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

### 2. Configuration in `Program.cs`
We configure the `JwtBearer` middleware to validate the tokens using our Secret Key.

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

// 1. Get the secret key from appsettings.json / User Secrets
var jwtKey = builder.Configuration["Jwt:Key"];
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

// 2. Add Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true, // Must have a valid signature
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = false, // Who generated it
        ValidateAudience = false, // Who is it for
        ValidateLifetime = true, // Must not be expired
        ClockSkew = TimeSpan.Zero // Expire exactly on time
    };
});
```

### 3. Generating a Token (Inside your Login Controller)
When the user successfully logs in, you generate the token:

```csharp
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

// Claims are facts about the user we embed in the token
var claims = new List<Claim>
{
    new Claim(ClaimTypes.NameIdentifier, user.Id),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Role, "Admin")
};

var token = new JwtSecurityToken(
    claims: claims,
    expires: DateTime.UtcNow.AddMinutes(15), // Short lifespan!
    signingCredentials: credentials);

string jwt = new JwtSecurityTokenHandler().WriteToken(token);
return Ok(new { Token = jwt });
```

---

## 5. Authorization (Roles & Policies)

Now that the app knows *who* the user is, we use attributes to protect our endpoints.

```csharp
// The whole controller requires the user to be logged in (Valid JWT)
[Authorize] 
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // [AllowAnonymous] overrides the controller. ANYONE can hit this endpoint.
    [AllowAnonymous] 
    [HttpGet]
    public ActionResult GetAll() { ... }

    // Requires the user to be logged in AND have the "Admin" role claim in their JWT
    [Authorize(Roles = "Admin")] 
    [HttpDelete("{id}")]
    public ActionResult DeleteProduct(int id) { ... }
}
```

---

## 6. Security Architecture: Refresh Tokens

Access tokens (JWTs) cannot be easily invalidated. If a hacker steals a user's JWT, they can use it until it expires. Therefore, **JWTs must have a very short lifespan (e.g., 10-15 minutes).**

But forcing the user to log in every 15 minutes is a terrible user experience. Enter **Refresh Tokens**.

1. When the user logs in, they receive **two** tokens:
   - A short-lived JWT (Access Token, expires in 15 mins).
   - A long-lived Refresh Token (a random string, expires in 7 days, stored securely in the Database).
2. The frontend uses the JWT to make API calls.
3. After 15 minutes, the JWT expires. The API returns `401 Unauthorized`.
4. The frontend silently catches the 401, and sends the Refresh Token to the `/refresh` endpoint.
5. The backend verifies the Refresh Token in the database. If it's valid, the backend issues a **brand new** JWT and a **new** Refresh Token.

If a hacker steals the JWT, they only have a few minutes to use it. If they steal the Refresh Token, you can instantly revoke it in the database!

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| `UseAuthorization()` before `UseAuthentication()` | Authentication must always come first in the pipeline. |
| Making the JWT Secret Key too short | The secret key must be at least 16 characters (128 bits) long, but 32 characters (256 bits) is highly recommended for HS256. |
| Putting passwords in the JWT Payload | The payload is base64 encoded, not encrypted. Only put non-sensitive data (ID, Email, Role) in the token. |
| Returning a 1-year valid JWT | Use short-lived JWTs (15 mins) and implement a Refresh Token system for long sessions. |

---

## 🧪 Practice Labs

### Lab 1 — JWT Generation & Validation (40 min)
1. Add `Microsoft.AspNetCore.Authentication.JwtBearer`.
2. Configure `AddAuthentication().AddJwtBearer()` in `Program.cs`. Use a secret key from User Secrets.
3. Create an `AuthController` with a `Login` endpoint. Hardcode a check for `username == "admin"` and `password == "password"`. If successful, generate and return a JWT.
4. Add `[Authorize]` to a `TestController` and try calling it via Swagger. It should fail (401). Paste your generated token into Swagger's authorization modal and try again!

### Lab 2 — Roles (30 min)
1. Change your `TestController` endpoint to `[Authorize(Roles = "Admin")]`.
2. Generate a token WITH the Admin role claim and test it.
3. Generate a token WITHOUT the Admin role claim. Verify you are authenticated, but you get a `403 Forbidden` response!

---

## 📝 Assignment: ShopAPI Project — Part 4

Let's secure our eCommerce backend with ASP.NET Core Identity!

### Requirements
1. Install the Identity and JWT Bearer NuGet packages.
2. Update your `ShopContext` to inherit from `IdentityDbContext<IdentityUser>`. Run a migration to generate the Identity tables in your database.
3. Register Identity and JWT Authentication in `Program.cs`.
4. Create an `AuthController` with `/register` and `/login` endpoints. Use the injected `UserManager<IdentityUser>` to handle the database creation and password checking.
5. Secure your `ProductsController`:
   - `GET` requests should be decorated with `[AllowAnonymous]`.
   - `POST`, `PUT`, and `DELETE` requests should be decorated with `[Authorize(Roles = "Admin")]`.
6. **Bonus:** Seed an Admin role and an Admin user into the database when the application starts.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| ASP.NET Core Identity | https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity |
| JWT Bearer Authentication | https://learn.microsoft.com/en-us/aspnet/core/security/authentication/jwt |
| JWT Debugger | https://jwt.io/ |

---

## 📌 Key Takeaways
- **Authentication (401)** verifies *who* the user is. **Authorization (403)** verifies *what* they are allowed to do.
- **JWTs** are standard, stateless tokens containing verifiable Claims. They are cryptographically signed, but not encrypted.
- **ASP.NET Core Identity** is a robust, out-of-the-box system that handles secure password hashing, roles, and user databases.
- Always use **Refresh Tokens** alongside short-lived JWTs to balance high security with a good user experience.

---

**Next Lecture:** [Lecture 43 — Global Error Handling, Logging & API Versioning](./43%20-%20Global%20Error%20Handling,%20Logging%20%26%20API%20Versioning.md)