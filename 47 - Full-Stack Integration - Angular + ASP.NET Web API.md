# Lecture 47 — Full-Stack Integration: Angular + ASP.NET Web API

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand the Same-Origin Policy and configure CORS securely in ASP.NET Core
- Set up an Angular development proxy (`proxy.conf.json`) for seamless local development
- Build strongly typed Angular services using `HttpClient` that mirror your C# DTOs
- Implement an HTTP Interceptor in Angular to automatically attach JWT tokens globally
- Catch API errors globally using an Error Interceptor and display user-friendly notifications

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. CORS (Cross-Origin Resource Sharing)
2. The Angular Development Proxy
3. Typed HTTP Clients
4. JWT Authentication Flow (Auth Interceptors)
5. Global Error Handling (Error Interceptors)

### Part 2 — Practice / Lab (~90–120 min)
1. Configure CORS & Angular Proxy
2. Interceptor Implementation
3. ShopAPI Project Part 9: Full-Stack Integration

---

## 1. CORS (Cross-Origin Resource Sharing)

### The Problem: Same-Origin Policy
By default, web browsers block web pages from making background HTTP requests to a different domain than the one that served the web page. This is a vital security feature called the **Same-Origin Policy** (it prevents a malicious website from making requests to your bank API while you are logged in).

- Your Angular app runs on: `http://localhost:4200`
- Your API runs on: `https://localhost:5001`
Because the ports are different, these are considered different "Origins". The browser will block the request!

### The Solution: CORS
We must configure our ASP.NET Core API to explicitly tell the browser: *"It's okay, I trust requests coming from localhost:4200!"*

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// 1. Define the CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Trust only our Angular app
              .AllowAnyHeader()  // Allow JWT Auth headers, Content-Type, etc.
              .AllowAnyMethod(); // Allow GET, POST, PUT, DELETE
    });
});

var app = builder.Build();

// 2. Add it to the pipeline
// WARNING: This MUST come BEFORE UseRouting and UseAuthentication!
app.UseCors("AllowAngularFrontend"); 

app.UseAuthentication();
app.UseAuthorization();
```

> [!CAUTION]
> Never use `.AllowAnyOrigin()` in a production API. This completely defeats the purpose of CORS and allows any website on the internet to attempt to use your API!

---

## 2. The Angular Development Proxy

While CORS is the correct solution for Production, dealing with CORS issues during local development can be frustrating. Angular provides a built-in proxy server that solves this perfectly.

It tricks your browser into thinking the API is on the exact same port as your frontend!

### Step 1: Create `proxy.conf.json`
Create this file inside your Angular `src/` folder.

```json
{
  "/api": {
    "target": "https://localhost:5001",
    "secure": false
  }
}
```

### Step 2: Update `angular.json`
Tell Angular to use this proxy when serving the app.

```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "proxyConfig": "src/proxy.conf.json"
  }
}
```

Now, your Angular code makes a request to `http://localhost:4200/api/products`. The proxy intercepts it, silently forwards it to your C# API, and returns the result. The browser never triggers a CORS error because it thinks the request went to port 4200!

---

## 3. Typed HTTP Clients

TypeScript is only useful if we actually use types! Every time you create a DTO or ViewModel in C#, you should create a mirroring Interface in Angular.

```typescript
// 1. Mirror the C# ProductDto
export interface Product {
  id: number;
  name: string;
  price: number;
  categoryName: string;
}

// 2. The Angular Service
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    // Notice we use the relative path '/api'. The proxy handles the rest!
    // We strictly type the GET request to return an Array of Products.
    return this.http.get<Product[]>('/api/products'); 
  }
  
  createProduct(newProduct: Partial<Product>): Observable<number> {
    return this.http.post<number>('/api/products', newProduct);
  }
}
```

---

## 4. JWT Authentication Flow (Auth Interceptors)

### The Interceptor Analogy: The Post Office
Imagine you are mailing 100 letters. Instead of writing your return address on every single envelope manually, you hand them to the Post Office, and a machine automatically stamps your return address on every single envelope as it passes through.

An **HttpInterceptor** is a piece of code that intercepts every single outgoing HTTP request from your Angular app. 

### Attaching the JWT Token
When a user logs in, we save their JWT (e.g., in `localStorage`). We use an interceptor to automatically attach this token to the `Authorization` header of every request!

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Get the token from storage
  const token = localStorage.getItem('jwt_token');

  if (token) {
    // 2. You cannot mutate the original request, you must clone it!
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // 3. Send the modified request to the server
    return next(clonedRequest);
  }

  // If there is no token (e.g., user is not logged in), send original request
  return next(req);
};
```

**Registering the Interceptor (Angular 15+ Standalone):**
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};
```

---

## 5. Global Error Handling (Error Interceptors)

Just as we intercept outgoing requests, we can intercept incoming responses. If our C# API returns a `ProblemDetails` error (Lecture 43), we shouldn't have to write error handling logic in every single Angular component. We can catch it globally!

```typescript
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Handle 401 Unauthorized globally
      if (error.status === 401) {
        alert("Your session has expired. Please log in again.");
        // Redirect to login page here...
      }
      
      // Handle 400 Bad Request globally (assuming ProblemDetails format)
      if (error.status === 400 && error.error && error.error.detail) {
        alert(`Error: ${error.error.detail}`);
      }
      
      // Pass the error down the chain in case a specific component wants to handle it
      return throwError(() => error);
    })
  );
};
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Forgetting the "Bearer " prefix | In your Auth Interceptor, the header value must literally be `Bearer YOUR_TOKEN`. The space is required! |
| Placing `UseCors()` after `UseRouting()` | CORS middleware must execute very early in the C# pipeline to properly intercept pre-flight OPTIONS requests. |
| Hardcoding `https://localhost:5001` in every Angular service | Use relative paths (`/api/...`) combined with `proxy.conf.json` for development, and Angular Environments (`environment.ts`) for production URLs. |

---

## 🧪 Practice Labs

### Lab 1 — CORS Setup (30 min)
1. Add the CORS middleware to your `.NET API` in `Program.cs`. Allow requests from `http://127.0.0.1:5500`.
2. Create a basic `index.html` file on your desktop and serve it using VS Code Live Server (which runs on port 5500).
3. Write vanilla `fetch()` javascript to hit your API. It should succeed!
4. Change the CORS policy to only allow `http://localhost:4200`, refresh your HTML page, and verify the browser explicitly blocks the request.

### Lab 2 — Angular Auth Interceptor (40 min)
1. Create a dummy Angular app.
2. Manually save a fake token string: `localStorage.setItem('jwt_token', 'test_token');`
3. Write the `jwtInterceptor` as shown in the notes and register it in `app.config.ts`.
4. Make an HTTP request to any API. Open Chrome DevTools -> Network Tab, click the request, look at the Request Headers, and verify `Authorization: Bearer test_token` is present!

---

## 📝 Assignment: ShopAPI Project — Part 9

Let's integrate our Angular ShopApp with our .NET ShopAPI!

### Requirements
1. **API Configuration:** Configure CORS in your `ShopAPI` to safely accept requests from your `ShopApp` frontend (`localhost:4200`).
2. **Angular Proxy:** Set up the `proxy.conf.json` in your Angular app so you don't have to hardcode `https://localhost:5001` in your services.
3. **HTTP Services:** Create an Angular `ProductService` with strong TypeScript interfaces mirroring your C# DTOs. Implement methods to GET all products and POST a new product.
4. **Auth Interceptor:** Create an `authInterceptor` to attach the JWT token stored in `localStorage` to all outgoing requests.
5. **Error Interceptor:** Create an `errorInterceptor` to globally catch 400 and 401 errors from the API, displaying a user-friendly JavaScript `alert()` or Toast message.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| CORS in ASP.NET Core | https://learn.microsoft.com/en-us/aspnet/core/security/cors |
| Angular Dev Server Proxy | https://angular.dev/tools/cli/serve#proxying-to-a-backend-server |
| Angular Http Interceptors | https://angular.dev/guide/http/interceptors |

---

## 📌 Key Takeaways
- **CORS** is a browser security mechanism. The server must explicitly "whitelist" the frontend's origin URL.
- The **Angular Proxy** simplifies local development by making the API appear as if it is running on the same domain as the frontend.
- **Typed HTTP Clients** ensure frontend safety by making TypeScript interfaces mirror backend DTOs exactly.
- **Interceptors** act like a Post Office machine, automatically modifying outgoing requests (adding Tokens) and intercepting incoming responses (Global Error Handling).

---

**Next Lecture:** [Lecture 48 — Capstone Project, DevOps & Career Preparation](./48%20-%20Capstone%20Project,%20DevOps%20%26%20Career%20Preparation.md)
