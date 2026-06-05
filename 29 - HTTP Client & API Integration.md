# Lecture 29 — HTTP Client & API Integration

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 1. Prerequisites
Before diving deeply into HTTP Client & API Integration in Angular, ensure you are comfortable with the following core concepts. If any of these feel rusty, review the previous modules before continuing:

- **TypeScript Fundamentals:** Interfaces, Generics (`<T>`), Utility types (`Partial`, `Omit`), and strict typing. You must understand how to define the shape of your data.
- **RxJS Basics:** The Observer pattern, Observables, Subjects, and operators like `map`, `tap`, `switchMap`, and `concatMap`. Understanding how streams of data flow is essential for Angular's HTTP layer.
- **Angular Core Concepts:** Standalone components, dependency injection (`inject()`), and Angular 19 Signals.
- **Basic Networking Concepts:** Understanding what a URL is, the difference between a client (browser) and a server, and the concept of JSON (JavaScript Object Notation).
- **Asynchronous JavaScript:** You should understand Promises, `async/await`, and the event loop, even though Angular relies heavily on RxJS for HTTP.

---

## 2. Objectives
By the end of this comprehensive lecture, you will be able to:
- Explain what an API is, how the HTTP protocol works, and why Single-Page Applications (SPAs) require asynchronous data fetching.
- Master Angular's `HttpClient` for typed CRUD operations (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- Manage HTTP request configurations dynamically by manipulating `HttpHeaders` and `HttpParams`.
- Author functional HTTP Interceptors (`HttpInterceptorFn`) for global concerns like authentication, caching, modifying headers, and logging.
- Implement robust, enterprise-grade error handling strategies using RxJS operators like `catchError`, `retry`, and exponential backoff patterns.
- Adopt the modern Angular 19+ `rxResource` and `resource` APIs to drastically reduce boilerplate when fetching data and wiring it to the template.
- Manage loading, success, and error UI states reactively using Signals, eliminating the need for manual `subscribe()` and memory leak management.
- Understand and resolve common network issues like CORS (Cross-Origin Resource Sharing) and preflight requests.

---

## 3. Agenda
1. **The Big Picture:** What is an API and HTTP?
2. **`HttpClient` Basics:** Providing, Injecting, and Subscribing.
3. **Typed CRUD Operations:** Building a robust API Service Layer.
4. **Advanced Request Configuration:** Mastering `HttpHeaders` and `HttpParams`.
5. **Middleware:** Building Functional Interceptors for Auth and Logging.
6. **Resilience:** Advanced Error Handling Patterns and Retries.
7. **The Modern Way:** `rxResource` and `resource` APIs in Angular 19+.
8. **Security & Browser Mechanisms:** Understanding CORS and Preflight.
9. **Lab Sessions:** Hands-on practice with real-world scenarios.
10. **Interview Prep & Cheat Sheet.**

---

## 4. Deep Dive

### 4.1. The Big Picture: What is an API and HTTP?
To understand APIs, we often look at real-world analogies. The most classic analogy is a restaurant.

Imagine you are a customer sitting at a table in a high-end restaurant. The kitchen is full of ingredients and chefs, but you are not allowed inside. You need a Waiter to take your order to the kitchen and return with your food.

In the context of Web Development:
- **The Customer:** Your Angular application (the Frontend/Client) running in the user's browser.
- **The Kitchen:** The database and server logic (the Backend/Server).
- **The Waiter:** The **API** (Application Programming Interface).
- **The Language You Speak to the Waiter:** **HTTP** (Hypertext Transfer Protocol).

**Why Does This Matter?**
Modern Single-Page Applications (SPAs) are inherently distributed. Your Angular application runs entirely within the user's browser context. However, sensitive data, database access, and complex business logic live on secure servers. Without a secure, standardized way to request and transmit data, your app would be an isolated island, incapable of persistent state. Whenever a user refreshes the page, everything would be lost without an API.

**The HTTP Verbs (The Waiter's Actions):**
When communicating over HTTP, we use specific "methods" or "verbs" to indicate our intent. These map directly to CRUD (Create, Read, Update, Delete) operations.
- **GET (Read):** Retrieve data from the server. (e.g., Load a list of users, fetch a single product). This operation should be *idempotent* (calling it multiple times has the same result).
- **POST (Create):** Send new data to the server to create a resource. (e.g., Register a new user, submit a new order).
- **PUT (Update):** Fully update or replace an existing resource. If you send a PUT request, the entire object is replaced.
- **PATCH (Update):** Partially update an existing resource. (e.g., Changing only a user's password without affecting their email or name).
- **DELETE (Delete):** Remove a resource from the server.

**Status Codes (The Waiter's Response):**
The server always replies with a numeric status code indicating the outcome of your request.
- `2xx` Success:
  - `200 OK`: Request succeeded.
  - `201 Created`: Resource was successfully created (usually follows a POST).
  - `204 No Content`: Action succeeded, but there is no data to return (often used for DELETE).
- `3xx` Redirection:
  - `301 Moved Permanently`: The endpoint has changed.
- `4xx` Client Error (Your fault!):
  - `400 Bad Request`: The data you sent was malformed.
  - `401 Unauthorized`: You need to log in / provide a token.
  - `403 Forbidden`: You are logged in, but you lack permission to do this.
  - `404 Not Found`: The requested URL or ID does not exist.
- `5xx` Server Error (Their fault!):
  - `500 Internal Server Error`: The backend code crashed.
  - `503 Service Unavailable`: The server is down or overloaded.

---

### 4.2. `HttpClient` Basics in Modern Angular
Angular provides a robust, highly extensible module for making HTTP requests called `@angular/common/http`. It handles the underlying `fetch` mechanics, serializes/deserializes JSON automatically, and wraps everything in RxJS Observables. This makes it infinitely more powerful than native JavaScript `fetch()`.

#### Providing `HttpClient` Globally
In modern zoneless and standalone Angular applications, we configure the `HttpClient` centrally in `app.config.ts`. We also enable `withFetch()` which tells Angular to use the modern browser `fetch` API under the hood instead of the legacy `XMLHttpRequest`, improving performance and enabling advanced server-side rendering (SSR) capabilities.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide HttpClient and enable modern fetch API under the hood
    provideHttpClient(withFetch())
  ],
};
```

#### Injecting and Executing Requests
Once provided, you can inject it anywhere using the `inject()` function.

```typescript
// users.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  template: `<h1>Users</h1>`,
  standalone: true
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);

  ngOnInit() {
    // The "Cold Observable" Trap:
    // Calling get() does NOTHING until you subscribe()!
    // Think of an Observable as a blueprint. Until you press 'build' (subscribe), nothing happens.
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe({
      next: (data) => console.log('Data received:', data),
      error: (err) => console.error('Network Error:', err),
      complete: () => console.log('Request stream closed')
    });
  }
}
```

---

### 4.3. Typed CRUD Operations
By default, `http.get()` returns an `Object`. This completely defeats the purpose of using TypeScript. We want our API calls to return strictly typed data structures so we get autocomplete, intellisense, and compile-time validation.

#### Step 1: Define Your Data Models
Create strict TypeScript interfaces matching the JSON structure returned by your backend.

```typescript
// product.model.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  }
}
```

#### Step 2: Create a Dedicated Service (The Repository Pattern)
We **never** make HTTP calls directly inside UI components. We delegate that responsibility to an Injectable service. This pattern is known as the Repository Pattern or Service Layer. It ensures that components focus only on rendering UI, while services handle data fetching. This makes the app easily testable and maintainable.

```typescript
// product.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  // In a real app, this URL usually comes from environment.ts
  private apiUrl = 'https://api.example.com/products';

  // 1. READ (All)
  // We pass <Product[]> to get(), telling TypeScript exactly what to expect
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // 2. READ (Single)
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // 3. CREATE
  // Omit<'id'> because the database will generate the ID, we don't send it
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // 4. UPDATE (PUT replaces the whole object, PATCH updates partial fields)
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, product);
  }

  // 5. DELETE
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

---

### 4.4. Request Configuration: Headers & Params
URLs are not always enough. You often need to send metadata (like authorization tokens, or specifying that you accept JSON) or query strings (like search filters, pagination rules).

#### Managing HttpHeaders
`HttpHeaders` allow you to append metadata to your requests. Note that `HttpHeaders` instances are strictly immutable. Calling `.set()` returns a brand new object.

```typescript
import { HttpHeaders } from '@angular/common/http';

export class ApiService {
  getDataWithCustomHeaders() {
    // Creating headers using chaining (since it's immutable)
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Custom-Platform', 'Angular-Web');

    // Pass the headers object as the options parameter
    return this.http.get<any>('/api/secure-data', { headers });
  }
}
```

#### Managing HttpParams
`HttpParams` handles URL query strings seamlessly, escaping special characters automatically. If you want to request `/api/products?category=shoes&limit=10&sort=desc`, you use `HttpParams`.

```typescript
import { HttpParams } from '@angular/common/http';

export class ProductService {
  getFilteredProducts(category: string, limit: number, sort: string) {
    // HttpParams is IMMUTABLE! Every .set() returns a new object.
    const params = new HttpParams()
      .set('category', category)
      .set('limit', limit.toString()) // Must be converted to string!
      .set('sort', sort);

    // Translates to: GET /api/products?category=shoes&limit=10&sort=desc
    // Notice how clean this is compared to manual string concatenation
    return this.http.get<Product[]>('/api/products', { params });
  }
}
```

---

### 4.5. Functional Interceptors: Auth Tokens & Middleware
Interceptors are powerful middleware for your HTTP pipeline. They intercept outgoing requests before they hit the network, and incoming responses before they reach your `subscribe()` block.

**Common use cases for Interceptors:**
- Attaching JWT (JSON Web Tokens) Authentication headers to every request automatically.
- Global error handling (e.g., redirecting to a login page if a 401 Unauthorized occurs).
- Logging network request times for performance monitoring.
- Caching frequent, unchanging responses.

In modern Angular, interceptors are simply functions (`HttpInterceptorFn`).

#### Creating a JWT Auth Interceptor
Instead of manually typing `headers.set('Authorization', 'Bearer token')` on every single service method, we do it globally.

```typescript
// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken(); // Retrieve token from localStorage or Signal

  // Remember: HttpRequest objects are immutable. We MUST clone them.
  if (token) {
    const clonedReq = req.clone({
      // setHeaders automatically merges these headers with existing ones
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    // Pass the modified cloned request to the next handler
    return next(clonedReq); 
  }

  // Pass unmodified request if no token exists (e.g., login request itself)
  return next(req); 
};
```

#### Registering the Interceptor
Interceptors must be registered in the application configuration.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { loggingInterceptor } from './logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      // The order matters! They execute in the array order.
      withInterceptors([authInterceptor, loggingInterceptor]) 
    )
  ]
};
```

---

### 4.6. Resilience: Error Handling Patterns & Retries
When interacting with external APIs, failure is not a possibility—it's an absolute inevitability. Wi-Fi drops, users enter tunnels, servers crash, rate limits are hit, and tokens expire.

If you do not handle errors gracefully, your Angular application will freeze, displaying a blank screen or a perpetual loading spinner. We handle HTTP errors using RxJS operators inside `.pipe()`.

#### CatchError and Retry Logic
```typescript
import { catchError, retry, throwError, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

getReliableData() {
  return this.http.get<Data[]>('/api/flaky-endpoint').pipe(
    // 1. Simple Retry: Retry up to 3 times with a 1-second delay between attempts
    retry({ count: 3, delay: 1000 }),
    
    // 2. Catch the error if all retries fail
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unknown error occurred!';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error (e.g., DNS resolution failed, offline)
        errorMsg = `Client Network Error: \${error.error.message}`;
      } else {
        // Server-side error (e.g., 404, 500)
        errorMsg = `Server Error Code: \${error.status}
Message: \${error.message}`;
      }
      
      console.error('API Error details:', errorMsg);
      
      // Return a user-friendly error observable so the component can show it on screen
      return throwError(() => new Error('Failed to load data. Please check your internet connection and try again.'));
    })
  );
}
```

---

### 4.7. The Modern Way: `rxResource` and `resource`
Prior to Angular 19, developers had to manually manage what we call "The Three States of Data Fetching":
1. `isLoading` (Show a spinner)
2. `data` (Show the list)
3. `error` (Show an alert box)

Managing these three states manually required massive amounts of boilerplate code, and often developers would forget to handle the error state, or forget to set `isLoading = false` in the error block, resulting in infinite spinners.

With Angular 19+, the `rxResource` API completely automates this using the power of Signals.

#### The Legacy Approach (Boilerplate Heavy & Error Prone)
```typescript
@Component({...})
export class LegacyComponent implements OnInit, OnDestroy {
  data: MyData[] = [];
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>(); // Required to prevent memory leaks
  
  constructor(private service: MyService) {}
  
  ngOnInit() {
    this.isLoading = true;
    this.error = null;
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.data = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.isLoading = false; // Easy to forget this!
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(); // Clean up memory leaks
    this.destroy$.complete();
  }
}
```

#### The Modern Approach (Clean, Reactive, Signal-Based)
```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modern-products',
  template: `
    <!-- Control flow natively understands the resource states -->
    @if (productsResource.isLoading()) {
      <div class="spinner">Loading products... Please wait.</div>
    } 
    @else if (productsResource.error()) {
      <div class="alert alert-danger">
        <strong>Oops!</strong> {{ productsResource.error() }}
        <button (click)="productsResource.reload()">Try Again</button>
      </div>
    } 
    @else {
      <ul class="product-grid">
        @for (product of productsResource.value(); track product.id) {
          <li class="card">
            <h3>{{ product.title }}</h3>
            <p>\${{ product.price }}</p>
          </li>
        }
      </ul>
    }
  `
})
export class ModernProductsComponent {
  private http = inject(HttpClient);

  // rxResource automatically subscribes, unsubscribes, and manages loading/error states!
  // It returns a ResourceRef containing computed Signals: .isLoading(), .value(), .error()
  productsResource = rxResource({
    loader: () => this.http.get<Product[]>('https://api.example.com/products')
  });
}
```

**Why is `rxResource` revolutionary?**
- **Zero Subscriptions:** No need to manually `subscribe()` or write `ngOnDestroy` code to prevent memory leaks.
- **Reactive States:** Exposes `.isLoading()`, `.value()`, and `.error()` as highly optimized computed Signals that seamlessly update the UI.
- **Built-in Reloading:** The resource gives you a `.reload()` method built-in, making "Try Again" buttons trivial to implement.

---

### 4.8. Security & Browser Mechanisms: CORS and Preflight
When integrating with APIs, the number one error junior developers face is the dreaded **CORS (Cross-Origin Resource Sharing) Error**.

**What is CORS?**
Browsers enforce a security policy called the *Same-Origin Policy*. By default, a web app running on `http://localhost:4200` is NOT allowed to make an HTTP request to an API running on `http://localhost:3000` or `https://api.github.com`. The origins (domain, port, or protocol) don't match.

**How does CORS fix this?**
The backend API must be configured to send specific HTTP Headers (like `Access-Control-Allow-Origin: *`) to explicitly tell the browser, "Yes, I allow requests from this Angular app."

**The Preflight Request (OPTIONS):**
If you send a complex request (like a POST with JSON data, or a request with an `Authorization` header), the browser doesn't send it immediately. First, it secretly sends an `OPTIONS` request to the server, asking for permission. This is called a *preflight*.
If the backend doesn't properly handle `OPTIONS` requests and reply with a `200 OK` and the correct CORS headers, the browser blocks your actual POST request, and you see a red CORS error in your console.

*Note: CORS is a **Backend/Server-side** issue. You cannot fix a CORS error by changing your Angular code. The API developer must fix it by configuring their server framework (e.g., Express, ASP.NET, Spring Boot) to allow your Angular origin.*

---

## 5. Think Like a Dev
When architecting an application's data layer, a senior developer thinks structurally and strategically:

- **Isolate the Network Layer:** Never let HTTP details leak into your UI components. The component shouldn't know if data comes from a REST API, a GraphQL endpoint, Firebase, or LocalStorage. It just calls a method on a service and receives data. This allows you to swap out the entire backend later without rewriting a single UI component.
- **Expect Failure:** Assume the network will fail. Always define fallback states, generic error handlers, and retry logic. Never leave the user looking at a blank white screen because a packet dropped in transit.
- **Normalize Data at the Edge:** If an API returns a deeply nested, ugly, or poorly formatted JSON structure, don't let that garbage data pollute your application state. Use RxJS `map` inside your Service to transform it into a clean, flat interface before returning it to the component.
- **Cache Wisely:** Not every request needs to hit the network every single time. Use Interceptors or advanced RxJS (`shareReplay`) to cache static resources (like lists of countries, categories, or configurations) in memory.
- **Keep Payloads Small:** Don't request massive datasets if you don't need them. Use query params to implement server-side pagination and filtering.

---

## 6. Before/After

### BEFORE (Anti-Pattern / Junior Developer)
Putting HTTP logic directly inside the component, skipping TypeScript types, and neglecting memory management.
```typescript
@Component({
  template: `
    <button (click)="load()">Load</button>
    <div *ngIf="data">{{ data | json }}</div>
  `
})
export class BadComponent {
  data: any; // No type safety!
  constructor(private http: HttpClient) {}
  
  load() {
    // Hardcoded URL, no error handling, creates memory leaks if the component is destroyed early
    this.http.get('https://api.com/stuff').subscribe(res => {
      this.data = res; 
    });
  }
}
```

### AFTER (Gold Standard / Senior Developer)
Delegating strictly to a typed Service layer and using modern reactive APIs like `rxResource`.
```typescript
// stuff.service.ts
@Injectable({ providedIn: 'root' })
export class StuffService {
  private http = inject(HttpClient);
  // URL centralized, strictly typed return, error handling built-in
  getStuff(): Observable<Stuff[]> { 
    return this.http.get<Stuff[]>('https://api.com/stuff').pipe(
      retry(2),
      catchError(err => throwError(() => new Error('Failed to load stuff')))
    ); 
  }
}

// stuff.component.ts
@Component({
  template: `
    @if (stuffResource.isLoading()) { <app-spinner /> }
    @else if (stuffResource.error()) { <app-error [msg]="stuffResource.error()" /> }
    @else { <app-stuff-list [items]="stuffResource.value()" /> }
  `
})
export class GoodComponent {
  private stuffService = inject(StuffService);
  // Fully reactive, handles loading/errors natively, zero manual subscriptions
  stuffResource = rxResource({ loader: () => this.stuffService.getStuff() });
}
```

---

## 7. Common Mistakes

| ❌ Common Mistake | ✅ The Solution |
|-------------------|-----------------|
| **The Cold Observable Trap.** Calling `http.get()` but forgetting to `.subscribe()`. The request is never actually executed on the network. | Always subscribe to the Observable, or use `rxResource()` / `async` pipe to handle it automatically. |
| **Missing Generic Types.** Leaving `http.get('/url')` without a type parameter, resulting in an `Object` or `any` return type. | Always define and use generic interfaces: `http.get<MyDomainModel>('/url')`. |
| **Mutating Immutable Objects.** Doing `params.set('page', '1')` without assigning the result back to a variable. The param is silently lost. | Reassign immediately: `params = params.set('page', '1');` |
| **Modifying Request Directly.** Trying to modify `req.headers.set(...)` directly inside an Interceptor, which throws an error. | Always use `req.clone()` to create a new, modified request instance. |
| **Ignoring CORS Errors.** Trying to fix a CORS error by changing Angular code, using proxies in production, or installing sketchy browser extensions. | Contact the backend developer to properly configure the server to return `Access-Control-Allow-Origin` headers. |
| **Memory Leaks.** Subscribing in `ngOnInit` and forgetting to unsubscribe in `ngOnDestroy` (in legacy pre-Signal apps). | Adopt `rxResource` or `toSignal` to eliminate manual subscription management entirely. |

---

## 8. Labs

### Lab 1: Building a Typed API Layer (45 mins)
**Scenario:** We are building a Blog reading application. We need to fetch and display posts.
1. Generate a service: `ng generate service services/post`.
2. Define a strict TypeScript interface `Post` matching the JSONPlaceholder API (`id`, `userId`, `title`, `body`).
3. Inject `HttpClient` and create a `getPosts(): Observable<Post[]>` method targeting `https://jsonplaceholder.typicode.com/posts`.
4. In `app.component.ts`, use the modern `rxResource` API to consume this service.
5. In `app.component.html`, implement the modern control flow (`@if`, `@else if`, `@else`) to display a sleek loading message, an error state (test it by breaking the URL), and finally the grid of posts.

### Lab 2: Global Auth Interceptor (45 mins)
**Scenario:** Your enterprise application requires an API key attached to every outgoing request.
1. Create an interceptor file manually: `auth.interceptor.ts`.
2. Write a functional interceptor (`HttpInterceptorFn`) that checks if the request URL includes `jsonplaceholder`.
3. If it does, use `req.clone()` to append an `Authorization` header with the value `Bearer fake-secret-token`.
4. Register the interceptor centrally in `app.config.ts`.
5. Run your app, open the Browser DevTools (Network Tab), click on the posts request, and inspect the Request Headers to verify your token was successfully attached.

### Final Assignment: ShopAngular HTTP Integration (90 mins)
Take your existing ShopAngular e-commerce project and migrate it from static mock data to a live API.
1. Utilize the Fake Store API (`https://fakestoreapi.com/products`).
2. Implement full typed interfaces for Products.
3. Replace the local data array in your `ProductService` with real `HttpClient` calls. Implement a `getProductById(id)` method as well.
4. Refactor the `ProductListComponent` and `ProductDetailComponent` to utilize `rxResource`.
5. Ensure a beautiful loading spinner or skeleton loader is visible while the products are being fetched. Implement a clean error state UI with a "Try Again" reload button.

---

## 9. Interview Prep

**Q1: What is the difference between cold and hot observables in the context of `HttpClient`?**
*A:* `HttpClient` methods return **Cold Observables**. A cold observable does not execute its underlying logic (the HTTP request) until a subscriber actively calls `.subscribe()`. Furthermore, if multiple components subscribe to the exact same Observable instance, it will trigger multiple distinct network requests. Hot observables (like a DOM click event or a `Subject`), conversely, share a single execution across multiple subscribers.

**Q2: How do you protect an Angular application against Cross-Site Request Forgery (CSRF / XSRF)?**
*A:* Angular's `HttpClient` has built-in XSRF protection. By default, if a server sets an `XSRF-TOKEN` cookie during authentication, Angular will automatically read that cookie and attach its value as an `X-XSRF-TOKEN` HTTP header on all mutating requests (POST, PUT, DELETE). The server then verifies this header to ensure the request genuinely originated from the Angular app and not a malicious site.

**Q3: Explain how to handle HTTP Interceptors in standalone Angular 19.**
*A:* In modern zoneless/standalone Angular, interceptors are written as functional `HttpInterceptorFn` arrow functions rather than class-based services. They take an `HttpRequest` and a `HttpHandlerFn` (usually called `next`). Because HTTP Requests are immutable, you must clone the request using `req.clone({ setHeaders: {...} })` to modify it. Finally, the interceptor must be registered globally in `app.config.ts` using the `provideHttpClient(withInterceptors([myInterceptor]))` function.

**Q4: Why would you use `switchMap` instead of `concatMap` when dealing with HTTP requests?**
*A:* If you are implementing a typeahead search bar, every keystroke triggers an HTTP request. You should use `switchMap` because it cancels the previous pending HTTP request if a new keystroke occurs, ensuring only the latest search result is processed. If you used `concatMap`, it would wait for the first request to finish before starting the second, creating a massive backlog. If you used `mergeMap`, results could arrive out of order, showing old search results over new ones.

**Q5: How do you handle HTTP errors globally instead of in every single component?**
*A:* You implement a global HTTP Interceptor. Inside the interceptor, you pipe the `next(req)` call through a `catchError` operator. If the error is a 401 Unauthorized, you can trigger an auth service to log the user out and redirect to the login page. You can then re-throw the error so individual services can still handle specific cases if needed.

---

## 10. Cheat Sheet

### Basic GET Request (Strictly Typed)
```typescript
// Returns Observable<User[]>
this.http.get<User[]>('https://api.com/users');
```

### POST Request with JSON Body
```typescript
// Sends a new user, expects the created User object in response
this.http.post<User>('https://api.com/users', { name: 'Alice', role: 'Admin' });
```

### Passing Multiple Query Parameters Dynamically
```typescript
let params = new HttpParams();
params = params.set('limit', '10'); // Must reassign!
params = params.set('sort', 'desc');

this.http.get<Data>('/api/items', { params });
```

### Passing Custom Headers
```typescript
const headers = new HttpHeaders().set('Authorization', 'Bearer my-token');
this.http.get<Data>('/api/secure', { headers });
```

### Functional Interceptor Architecture
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = 'my-secret-token';
  const clonedRequest = req.clone({ 
    setHeaders: { Authorization: `Bearer \${token}` } 
  });
  return next(clonedRequest);
};
```

### Providing HttpClient in app.config.ts
```typescript
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(), 
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
};
```

### The Modern rxResource Syntax (Angular 19+)
```typescript
// In the component class
products = rxResource({ 
  loader: () => this.http.get<Product[]>('/api/products') 
});

// In the template
// @if (products.isLoading()) { ... }
// @else if (products.error()) { ... }
// @else { {{ products.value() | json }} }
```

---

## 11. Key Takeaways
- **APIs are the bridge:** They connect the isolated frontend client securely to the centralized backend database.
- **Embrace TypeScript:** Always utilize generics (`<T>`) when calling HTTP methods to leverage strict typing and prevent runtime errors.
- **Service Layer Pattern:** Centralize all network calls inside `@Injectable` services. Keep your components clean, dumb, and strictly focused on rendering UI.
- **Middleware Mastery:** Use functional Interceptors (`HttpInterceptorFn`) to cleanly decouple repetitive, global tasks like authentication token injection and error logging.
- **Strict Immutability:** `HttpRequest`, `HttpHeaders`, and `HttpParams` cannot be directly mutated. You must always use `.clone()` or reassign variables when calling `.set()`.
- **Modern Angular is Highly Reactive:** Migrate away from manual `.subscribe()` calls in components. Embrace the `rxResource` API to automatically handle loading, error, and success states securely and natively via Signals.
- **Expect the Unexpected:** Network requests will fail. Always use `catchError`, implement retries for flaky connections, and provide clear error messages to your users.

---

**Next Lecture:** [Lecture 30 — Angular Material & Component Libraries](./30%20-%20Angular%20Material%20%26%20Component%20Libraries.md)
