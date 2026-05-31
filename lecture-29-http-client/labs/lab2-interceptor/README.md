# Lab 2: Auth Interceptor

1. Create a function `authInterceptor: HttpInterceptorFn`.
2. Inside it, clone the request and add an `Authorization` header.
3. Register it in `app.config.ts` using `withInterceptors([authInterceptor])`.
4. Check the Network tab to see your header!
