# Lab 1: CORS

1. In your .NET API, add `builder.Services.AddCors()`.
2. Add a policy that allows `http://localhost:4200`.
3. Add `app.UseCors("PolicyName")` BEFORE `app.UseAuthentication()`.
4. In your Angular app, create `proxy.conf.json`.
5. Update `angular.json` to use the proxy config.
