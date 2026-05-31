# Lab 2: Angular Interceptors

1. Create a function `export const authInterceptor: HttpInterceptorFn = (req, next) => { ... }`.
2. Get the token from `localStorage`.
3. Clone the request and add the `Authorization` header.
4. Add it to `provideHttpClient(withInterceptors([authInterceptor]))` in `app.config.ts`.
