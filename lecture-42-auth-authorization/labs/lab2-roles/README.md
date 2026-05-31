# Lab 2: Roles

1. Update your `TestController` to use `[Authorize(Roles = "Admin")]`.
2. Update your `AuthController` to include an `Admin` role claim when it generates the JWT.
3. Test it.
4. Remove the `Admin` role claim, generate a new token, and test it again. You should receive a 403 Forbidden!
