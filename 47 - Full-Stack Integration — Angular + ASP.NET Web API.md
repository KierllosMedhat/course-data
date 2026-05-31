# Lecture 47 — Full-Stack Integration: Angular + ASP.NET Web API

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Configure CORS in ASP.NET Core to allow requests from an Angular frontend.
- Set up an Angular development proxy (`proxy.conf.json`) to bypass CORS locally.
- Use the Angular `HttpClient` to communicate with the .NET API.
- Implement an HTTP Interceptor in Angular to automatically attach JWT tokens.
- Handle API errors gracefully on the frontend.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. CORS (Cross-Origin Resource Sharing)
2. Angular Development Proxy
3. Typed HTTP Clients in Angular
4. JWT Authentication Flow (Interceptors)
5. Error Handling & ProblemDetails

### Part 2 — Practice / Lab (~90–120 min)
1. Configure CORS & Angular Proxy
2. JWT Interceptor implementation
3. ShopAPI Project Part 9: Full-Stack Integration

---

## 1. CORS (Cross-Origin Resource Sharing)

By default, web browsers block web pages from making requests to a different domain than the one that served the web page. This is a security feature called the **Same-Origin Policy**.
Since your Angular app runs on `localhost:4200` and your API runs on `localhost:5001`, requests will be blocked!

We must tell the API to allow requests from the Angular app's origin.

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Only allow Angular!
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAngular"); // MUST be before UseAuthentication/UseAuthorization
app.UseAuthentication();
```

> [!WARNING]
> Never use `.AllowAnyOrigin()` in production. Always specify the exact URLs of your frontend!

---

## 2. Angular Development Proxy

While CORS is the correct solution for production, during development, it can be annoying. Angular provides a local proxy that tricks the browser into thinking the API is on the same domain (`localhost:4200`).

Create a file `proxy.conf.json` in your Angular `src` folder:
```json
{
  "/api": {
    "target": "https://localhost:5001",
    "secure": false
  }
}
```

Update `angular.json` to use it:
```json
"serve": {
  "options": {
    "proxyConfig": "src/proxy.conf.json"
  }
}
```

Now, when Angular makes a request to `/api/products`, the proxy intercepts it and forwards it to `https://localhost:5001/api/products`. The browser sees a same-origin request and doesn't complain!

---

## 3. Typed HTTP Clients in Angular

Always create TypeScript interfaces that perfectly mirror your C# DTOs!

```typescript
// Interfaces mirror C# DTOs
export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    // Notice we use the relative path '/api', the proxy will handle the rest!
    return this.http.get<Product[]>('/api/products'); 
  }
}
```

---

## 4. JWT Authentication Flow (Interceptors)

When a user logs in, the API returns a JWT. We store this token (e.g., in `localStorage` or memory).
Instead of manually adding the token to the `Authorization: Bearer <token>` header of every single request, we use an **Interceptor**.

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // Get your token

  if (token) {
    // Clone the request and add the header
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  // If no token, just send the original request
  return next(req);
};
```

Register the interceptor in `app.config.ts`:
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
```

---

## 5. Error Handling & ProblemDetails

If the API returns a 400 Bad Request using our `ProblemDetails` format (from Lecture 43), we can catch it globally using an Error Interceptor and display a Toast notification!

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 400 && error.error.detail) {
        // Display the ProblemDetails detail message!
        alert(`API Error: ${error.error.detail}`); 
      } else if (error.status === 401) {
        alert("You need to login!");
      }
      return throwError(() => error);
    })
  );
};
```

---

## 🧪 Practice Labs

### Lab 1 — CORS Setup (30 min)
1. Add CORS to your `ShopAPI` in `Program.cs`.
2. Allow requests from `http://localhost:4200`.
3. Try making a request from a plain HTML/JS page running on a different port.

### Lab 2 — Angular Auth Interceptor (40 min)
1. Create an Angular app.
2. Create an `AuthService` that saves a dummy token to `localStorage`.
3. Create an `authInterceptor`.
4. Make an HTTP request and use the browser's Network Tab to verify the `Authorization` header is attached!

---

## 📝 Assignment: ShopAPI Project — Part 9

Time to bring it all together!

### Requirements
1. Set up CORS in your `ShopAPI` to accept requests from your `ShopApp` frontend.
2. Set up the `proxy.conf.json` in your Angular app.
3. In Angular, create a `ProductService` with methods to GET, POST, PUT, and DELETE products.
4. Create an `authInterceptor` in Angular to attach the JWT for protected endpoints.
5. Create an `errorInterceptor` to globally catch API errors and display a user-friendly message!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| CORS in ASP.NET Core | https://learn.microsoft.com/en-us/aspnet/core/security/cors |
| Angular Proxying | https://angular.dev/tools/cli/serve#proxying-to-a-backend-server |
| Angular Interceptors | https://angular.dev/guide/http/interceptors |

---

## 📌 Key Takeaways
- **CORS** is enforced by the *browser*, not the server. The server must explicitly allow the browser's origin.
- The **Angular Proxy** is a great tool for development to avoid CORS issues entirely.
- **Interceptors** are the perfect place to globally attach JWT tokens to outbound requests.
- Catching errors globally in an interceptor prevents you from writing error-handling code in every component.

---

**Next Lecture:** [Lecture 48 — Capstone Project, DevOps & Career Preparation](./48%20-%20Capstone%20Project,%20DevOps%20%26%20Career%20Preparation.md)