# Lab 2: Request Timing Middleware

1. Create a new class `RequestTimingMiddleware`.
2. Add a primary constructor that injects `RequestDelegate` and `ILogger<RequestTimingMiddleware>`.
3. Implement `public async Task InvokeAsync(HttpContext context)`.
4. Wrap `await next(context)` with a `Stopwatch` and log the elapsed milliseconds.
5. Register it in `Program.cs` with `app.UseMiddleware<RequestTimingMiddleware>()`.
