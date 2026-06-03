# Lecture 29 — HTTP Client & API Integration

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand what an API is and how HTTP works in plain English
- Use Angular's `HttpClient` for typed CRUD operations: `get<T>`, `post<T>`, `put<T>`, `delete<T>`
- Configure HTTP requests with custom headers and query parameters
- Write functional interceptors (`HttpInterceptorFn`) for authentication tokens and logging
- Handle errors gracefully with `catchError`, `retry`, and user-friendly UI states
- Fetch data seamlessly with the modern `rxResource()` and `resource()` APIs in Angular 19+

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is an API and HTTP? (The Big Picture)
2. `HttpClient` in Modern Angular
3. Typed CRUD Operations
4. Request Configuration: Headers & Params
5. Functional Interceptors: Auth Tokens & Middleware
6. Error Handling Patterns
7. The Modern `rxResource` and `resource` APIs

### Part 2 — Practice / Lab (~90–120 min)
1. Build a Typed API Service Layer with full CRUD
2. Implement a JWT Token Interceptor
3. ShopAngular Project Part 7: Connecting to an External API

---

## 1. What is an API and HTTP? (The Big Picture)

### The Real-World Analogy: The Restaurant

Imagine you are sitting at a table in a restaurant. You look at the menu and decide you want a burger. You can't just walk into the kitchen and cook it yourself. Instead, you need a **Waiter** to take your order to the kitchen, and then bring the food back to you.

In web development:
- **You (The Customer):** Your Angular application (the Frontend).
- **The Kitchen:** The database and server logic (the Backend).
- **The Waiter:** The **API** (Application Programming Interface).
- **The Language You Speak to the Waiter:** **HTTP** (Hypertext Transfer Protocol).

### Why Does This Matter?

Modern web applications are distributed. Your Angular app runs in the user's browser, but the data (users, products, orders) lives securely on a server in the cloud. To get that data, or to save new data, your Angular app must send HTTP requests to an API. Without this, your app would be completely static and couldn't save anything permanently!

### The HTTP Verbs (The Waiter's Actions)

When you talk to an API, you use standard HTTP methods to tell it what you want to do:
- **GET:** "Bring me the menu." (Read data)
- **POST:** "I'm giving you my order, please create it in the kitchen." (Create data)
- **PUT / PATCH:** "I want to change my order to a cheeseburger." (Update data)
- **DELETE:** "Cancel my order." (Delete data)

> **Recap: What is an API?**
> - APIs are the middlemen that allow the frontend to talk to the backend.
> - HTTP is the protocol used to send these requests over the internet.
> - CRUD (Create, Read, Update, Delete) maps directly to HTTP verbs (POST, GET, PUT, DELETE).

---

## 2. `HttpClient` in Modern Angular

To make HTTP requests in Angular, we use a built-in service called `HttpClient`. It handles the complex work of establishing a network connection, formatting the request, and parsing the response.

### Providing `HttpClient`

In modern zoneless Angular applications (using standalone components), we configure the `HttpClient` in the application configuration file.

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. This provides the HttpClient service to our entire application
    provideHttpClient()
  ],
};
```

### Injecting and Using `HttpClient`

Once provided, we can inject `HttpClient` into any component or service using the `inject()` function.

```ts
// users.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  template: `<h1>Users</h1>`,
  standalone: true
})
export class UsersComponent implements OnInit {
  // 1. Inject the HttpClient service
  private http = inject(HttpClient);

  ngOnInit() {
    // 2. Make a GET request to an API endpoint
    // 3. We MUST subscribe to the Observable, otherwise the request is NEVER sent!
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe(
      // 4. This callback runs when the server responds successfully
      (data) => {
        console.log('Received users:', data);
      }
    );
  }
}
```

> [!WARNING]
> **The "Cold Observable" Trap**
> Angular's `HttpClient` methods return RxJS Observables. These are "cold," meaning they are lazy. If you call `this.http.get('/api/users')` but forget to call `.subscribe(...)`, the network request will **never be sent**. Always subscribe!

> **Recap: HttpClient Basics**
> - Provide `HttpClient` globally in `app.config.ts` using `provideHttpClient()`.
> - Inject it into components/services using `inject(HttpClient)`.
> - Always call `.subscribe()` to execute the HTTP request.

---

## 3. Typed CRUD Operations

By default, `HttpClient` returns an `Object`. But TypeScript is all about types! We want our code to know exactly what the shape of the data is so we get autocomplete and compile-time error checking.

`HttpClient` is **generic**, meaning we can pass an interface to its methods to specify the expected return type.

### Step 1: Define Your Interfaces

```ts
// product.model.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
```

### Step 2: Create a Dedicated Service

We rarely put HTTP calls directly in components. Instead, we create a Service. This keeps components clean and allows multiple components to reuse the same data-fetching logic.

```ts
// product.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.example.com/products';

  // 1. READ: GET request returning an array of Products
  getAllProducts(): Observable<Product[]> {
    // We add <Product[]> here so TypeScript knows the exact return type
    return this.http.get<Product[]>(this.apiUrl);
  }

  // 2. READ: GET request returning a single Product
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // 3. CREATE: POST request sending a new product, expecting the created Product back
  // Omit<Product, 'id'> means a Product object without the 'id' property (the DB generates the ID)
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    // We pass the URL and the data body
    return this.http.post<Product>(this.apiUrl, product);
  }

  // 4. UPDATE: PUT request to update an existing product
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // 5. DELETE: DELETE request
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

> **Recap: Typed CRUD**
> - Create interfaces to describe the shape of your API data.
> - Centralize all API calls inside an `@Injectable` service.
> - Pass the interface to the HTTP methods (e.g., `get<Product[]>`) for full type safety.

---

## 4. Request Configuration: Headers & Params

Often, a simple URL isn't enough. You might need to send a secret authentication token, specify the format you want, or add search filters to the URL.

### HttpHeaders

Headers are metadata sent alongside your request. A common use case is telling the server we are sending JSON data, or passing an API key.

```ts
import { HttpHeaders } from '@angular/common/http';

export class ApiService {
  // ...
  getData() {
    // 1. Create a new HttpHeaders object
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'API-Key': 'secret-12345'
    });

    // 2. Pass it in the options object (the second or third argument)
    return this.http.get<Data[]>('/api/data', { headers: headers });
  }
}
```

### HttpParams (Query Strings)

Query parameters are added to the end of a URL like this: `/api/products?category=electronics&limit=10`. Instead of building this string manually, Angular provides `HttpParams`.

```ts
import { HttpParams } from '@angular/common/http';

export class ProductService {
  // ...
  getFilteredProducts(category: string, limit: number) {
    // 1. Create HttpParams. Note: HttpParams is IMMUTABLE!
    // Every .set() creates a brand new object, so you must chain them.
    const params = new HttpParams()
      .set('category', category)
      .set('limit', limit.toString()); // Values must be strings or numbers

    // This generates: GET /api/products?category=shoes&limit=5
    return this.http.get<Product[]>('/api/products', { params: params });
  }
}
```

> [!WARNING]
> **Immutability of HttpParams & HttpHeaders**
> Because they are immutable, doing this **will fail**:
> ```ts
> let params = new HttpParams();
> params.set('page', '1'); // WRONG: This creates a new object and throws it away!
> ```
> Instead, do this:
> ```ts
> let params = new HttpParams();
> params = params.set('page', '1'); // CORRECT: Reassign the variable
> ```

> **Recap: Configuration**
> - Use `HttpHeaders` to send metadata like API keys.
> - Use `HttpParams` to cleanly build query strings for sorting, filtering, and pagination.
> - Remember that both classes are strictly immutable.

---

## 5. Functional Interceptors: Auth Tokens & Middleware

### The Real-World Analogy: The Security Checkpoint

Imagine an airport. Every passenger must pass through security before reaching their gate. If they pass, their ticket is stamped. If they fail, they are turned away.

An **Interceptor** is a security checkpoint for your HTTP requests. Every outgoing request and incoming response passes through it. Instead of manually adding an Authentication token to every single `this.http.get()` call in your entire app, an interceptor automatically "stamps" every request with the token.

### Creating a Functional Interceptor

In modern Angular, interceptors are simple functions (`HttpInterceptorFn`).

```ts
// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// 1. Define the interceptor function
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 2. Inject any services we need (e.g., to get the token)
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 3. If we have a token, we must CLONE the request to modify it
  if (token) {
    const authReq = req.clone({
      // We set the Authorization header (the standard way to send tokens)
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    // 4. Send the cloned request onward to the next step (or the server)
    return next(authReq);
  }

  // 5. If no token, just send the original request unchanged
  return next(req);
};
```

> [!IMPORTANT]
> **Why `req.clone()`?**
> The `HttpRequest` object (`req`) is completely immutable. You cannot modify it directly. You must clone it, modify the clone, and pass the clone to `next()`.

### Registering the Interceptor

To make the interceptor active, we must register it when we provide the `HttpClient`.

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Register the interceptor here!
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
};
```

> **Recap: Interceptors**
> - Interceptors act as global middleware for HTTP traffic.
> - They are perfect for attaching JWT auth tokens or global logging.
> - `HttpRequest` is immutable; always use `req.clone()`.
> - Register them in `app.config.ts` using `withInterceptors([])`.

---

## 6. Error Handling Patterns

Things go wrong on the internet. Servers crash, Wi-Fi drops, users are unauthorized. If you don't handle errors, your app will freeze or crash silently.

We handle HTTP errors using RxJS operators inside a `.pipe()`.

### Catching and Retrying Errors

```ts
import { HttpClient } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';

export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>('/api/products').pipe(
      // 1. Retry the request up to 2 times if it fails (great for flaky Wi-Fi)
      retry(2),
      
      // 2. Catch the error
      catchError((error) => {
        // Log it for the developers
        console.error('API Error occurred:', error);
        
        // Return a user-friendly error message to the component
        return throwError(() => new Error('Unable to load products. Please try again later.'));
      })
    );
  }
}
```

### The Three States Rule for UI

Whenever a component fetches data asynchronously, it exists in one of three states. You must handle all three in your HTML template to provide a good user experience.

1. **Loading State:** The request is in flight (show a spinner).
2. **Success State:** Data arrived (show the list).
3. **Error State:** Request failed (show an error message).

```ts
// Old standard way (pre-Signals)
export class ProductComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }
}
```

This works, but it's a lot of boilerplate code! Let's look at the modern solution.

---

## 7. The Modern `rxResource` and `resource` APIs

In Angular 19+, the framework introduced the `resource()` and `rxResource()` APIs. These functions completely automate the "Three States Rule" using Signals!

- `resource()`: Used when fetching data with standard JavaScript `fetch` / Promises.
- `rxResource()`: Used when fetching data with `HttpClient` Observables.

### Simplifying the Component with `rxResource`

Let's refactor the verbose component above using `rxResource`.

```ts
// Modern Angular with Signals and rxResource
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  template: `
    <!-- 1. Handle Loading State -->
    @if (products.isLoading()) {
      <div class="spinner">Loading products...</div>
    } 
    <!-- 2. Handle Error State -->
    @else if (products.error()) {
      <div class="error-box">
        Uh oh! {{ products.error() }}
      </div>
    } 
    <!-- 3. Handle Success State -->
    @else {
      <ul>
        <!-- Use products.value() to get the array of data -->
        @for(product of products.value(); track product.id) {
          <li>{{ product.name }} - ${{ product.price }}</li>
        }
      </ul>
    }
  `
})
export class ProductComponent {
  private http = inject(HttpClient);

  // rxResource automatically creates a ResourceRef containing Signals for 
  // isLoading, value, and error!
  products = rxResource({
    // The loader function MUST return an Observable (because we use rxResource)
    loader: () => this.http.get<Product[]>('https://api.example.com/products')
  });
}
```

### Why is this revolutionary?
1. We deleted `isLoading`, `errorMessage`, and `products` arrays from our component class.
2. We didn't have to manually `.subscribe()`.
3. The component is entirely reactive and seamlessly integrated with Angular's Signal change detection.

> **Recap: Error Handling & Resources**
> - Use RxJS `catchError` in services to catch network issues.
> - The UI must handle Loading, Success, and Error states.
> - `rxResource()` handles these three states automatically, exposing them as reactive Signals (`.isLoading()`, `.value()`, `.error()`).

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| **Forgetting to subscribe()** to an `HttpClient` call. The request never fires! | Always call `.subscribe()` in your component, or use `rxResource()`/`async` pipe to automatically subscribe. |
| Not providing the type parameter (e.g. `http.get('/url')`) resulting in an `Object` type. | Always define generic types: `http.get<MyInterface>('/url')`. |
| Mutating `HttpParams` incorrectly (`params.set(...)` without reassignment). | Remember they are immutable. Always assign: `params = params.set(...)`. |
| Modifying the `HttpRequest` directly inside an interceptor (Causes errors). | Always clone it: `const newReq = req.clone({ setHeaders: ... });` |
| Failing to show a loading spinner when a request is in progress. | Use the "Three States Rule" or `rxResource().isLoading()`. |

---

## 🧪 Practice Labs

### Lab 1 — Typed API Service Layer (40 min)
1. Generate a new service: `ng g s services/post`.
2. Define an interface `Post` matching the JSONPlaceholder API (`userId`, `id`, `title`, `body`).
3. Inject `HttpClient`.
4. Create a method `getPosts()` that makes a typed GET request to `https://jsonplaceholder.typicode.com/posts`.
5. In a component, use `rxResource` to fetch the data and display it using an `@for` loop.

### Lab 2 — JWT Token Interceptor (30 min)
1. Create a new file `auth.interceptor.ts`.
2. Write an `HttpInterceptorFn` that adds a fake token header: `Authorization: Bearer fake-jwt-123`.
3. Register the interceptor in `app.config.ts`.
4. Run your app, open Chrome DevTools → Network Tab, click on a network request, and verify that the `Authorization` header is present in the Request Headers.

---

## 📝 Assignment: ShopAngular Project — Part 7

Let's connect ShopAngular to a real external API so it displays real data!

### Requirements
1. Define a `Product` interface based on the structure returned by `https://fakestoreapi.com/products`.
2. Update your `ProductService` to remove the hardcoded dummy data array.
3. Inject `HttpClient` into `ProductService`.
4. Create a `getProducts()` method that makes a GET request to the Fake Store API.
5. In your `ProductListComponent`, use the `rxResource()` API to manage the fetching process.
6. Update your component's HTML template to:
   - Display a loading spinner or skeleton loader when `.isLoading()` is true.
   - Display an error message card if `.error()` has a value.
   - Display the grid of product cards from `.value()` otherwise.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular HttpClient Docs | https://angular.dev/guide/http |
| RxJS Error Handling | https://rxjs.dev/guide/error-handling |
| Fake Store API (Free API for testing) | https://fakestoreapi.com/ |
| JSONPlaceholder (Free API for testing) | https://jsonplaceholder.typicode.com/ |

---

## 📌 Key Takeaways
- **APIs and HTTP** allow your frontend to communicate with backend databases.
- Always use **typed generics**: `get<Product[]>()` to enforce compile-time safety.
- **Functional interceptors** (`HttpInterceptorFn`) are the modern approach to attaching global headers, like Auth tokens.
- `HttpRequest`, `HttpHeaders`, and `HttpParams` are **immutable** — you must clone or reassign them when modifying.
- Always handle the **three states** in your UI: loading, success, error.
- **`rxResource()`** is the modern, Signal-based way to fetch data, automatically managing loading, error, and value states without manual subscriptions.

---

**Next Lecture:** [Lecture 30 — Angular Material & Component Libraries](./30%20-%20Angular%20Material%20%26%20Component%20Libraries.md)