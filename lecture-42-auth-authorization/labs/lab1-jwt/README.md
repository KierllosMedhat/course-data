# Lab 1: JWT Generation & Validation

1. Add `Microsoft.AspNetCore.Authentication.JwtBearer`.
2. Configure authentication in `Program.cs`.
3. Build an `AuthController` with a `Login` endpoint that returns a hardcoded JWT.
4. Protect a `TestController` endpoint with `[Authorize]`.
5. Test passing the token in the `Authorization: Bearer <token>` header using Swagger!
