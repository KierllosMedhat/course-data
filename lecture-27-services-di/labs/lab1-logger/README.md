# Lab 1: Logging Service

1. Generate your service: `ng g s logger`.
2. Create an `InjectionToken` named `APP_PREFIX` that provides a default string like `[MyApp]`.
3. Inside `LoggerService`, inject the token: `private prefix = inject(APP_PREFIX)`.
4. Create an `info(msg: string)` method that logs `this.prefix + ' ' + msg`.
