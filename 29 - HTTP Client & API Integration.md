# Lecture 29 — HTTP Client & API Integration

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Use Angular's `HttpClient` for typed CRUD operations: `get<T>`, `post<T>`, `put<T>`, `delete<T>`
- Configure requests with headers and query params
- Write functional interceptors (`HttpInterceptorFn`) for auth tokens and error handling
- Handle errors with `catchError`, `retry`, and user-friendly UI states
- Fetch data seamlessly with the modern `rxResource()` API

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. `HttpClient` in modern Angular
2. Typed CRUD operations
3. Request configuration: headers, params
4. Functional interceptors: Auth tokens, error mapping
5. Error handling patterns
6. The `rxResource` and `resource` APIs

### Part 2 — Practice / Lab (~90–120 min)
1. Build a typed API service layer with full CRUD
2. Implement a JWT token interceptor
3. ShopAngular Project Part 7: Connecting to an API

---

## 1. HttpClient in Modern Angular

`HttpClient` is provided automatically in most modern Angular configurations.

```ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `...`
})
export class UsersComponent {
  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get<any[]>('/api/users').subscribe(data => console.log(data));
  }
}
```

### When You Still Need `provideHttpClient()`
When adding **interceptors**:

```ts
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

---

## 2. Typed CRUD Operations

`HttpClient` is **generic** — every method accepts a type parameter for end-to-end type safety:

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>('/api/products', product);
  }
}
```

---

## 3. Request Configuration

```ts
import { HttpHeaders, HttpParams } from '@angular/common/http';

const headers = new HttpHeaders({
  'Authorization': 'Bearer my-token',
  'Content-Type': 'application/json'
});

const params = new HttpParams()
  .set('page', '1')
  .set('limit', '20');

this.http.get<Product[]>('/api/products', { headers, params });
```

> [!NOTE]
> `HttpHeaders` and `HttpParams` are **immutable**. Every `.set()` returns a **new instance** — always chain: `params = params.set('page', '2')`.

---

## 4. Functional Interceptors

Interceptors are middleware functions that inspect and modify **every** HTTP request/response.

### Auth Interceptor
```ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = 'my-jwt-token'; // Get from AuthService

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};
```

---

## 5. Error Handling Patterns

Use RxJS `catchError` to handle errors gracefully!

```ts
import { catchError, retry, throwError } from 'rxjs';

this.http.get<Product[]>('/api/products').pipe(
  retry(2), // Try up to 2 times before failing!
  catchError(error => {
    console.error('Failed to load products:', error);
    return throwError(() => new Error('Something went wrong.'));
  })
);
```

### The Three States Rule
Always handle **loading**, **success**, and **error** in every async UI component!

---

## 6. The `rxResource` and `resource` APIs

Angular provides the `resource` and `rxResource` functions to fetch asynchronous data and map it directly to signals. 
- Use `resource()` with the native `fetch` Promise API.
- Use `rxResource()` with `HttpClient` Observables.

### Using `rxResource`
```ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  template: `
    @if (products.isLoading()) {
      <p>Loading...</p>
    } @else if (products.error()) {
      <p>Error: {{ products.error() }}</p>
    } @else {
      <ul>
        @for(product of products.value(); track product.id) {
          <li>{{ product.name }}</li>
        }
      </ul>
    }
  `
})
export class ProductListComponent {
  http = inject(HttpClient);

  // Automatically fetches, manages loading/error state, and exposes a Signal!
  products = rxResource({
    loader: () => this.http.get<Product[]>('https://api.example.com/products')
  });
}
```

This drastically reduces boilerplate, removing the need for manual `loading` and `error` signals!

---

## 🧪 Practice Labs

### Lab 1 — Typed API Service Layer (40 min)
1. Generate `ProductService` with `ng g s product`.
2. Define a `Product` interface.
3. Implement `getAll()` using `rxResource()` or `toSignal()`.
4. Connect to `https://fakestoreapi.com/products` as a mock API!

### Lab 2 — JWT Token Interceptor (30 min)
1. Build `authInterceptor` using `HttpInterceptorFn`.
2. Register with `provideHttpClient(withInterceptors([...]))` in `app.config.ts`.
3. Verify the token appears in the Network tab headers when making requests!

---

## 📝 Assignment: ShopAngular Project — Part 7

Let's make ShopAngular real!

### Requirements
1. Update your `ProductService` to fetch data from the Fake Store API: `https://fakestoreapi.com/products`.
2. Use the `rxResource()` API to manage the fetching process, returning a `ResourceRef` containing the products list.
3. Update your `ProductListComponent` to display:
   - A loading spinner when `.isLoading()` is true.
   - An error message if `.error()` has a value.
   - The list of products from `.value()` otherwise.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular HttpClient | https://angular.dev/guide/http |
| Fake Store API | https://fakestoreapi.com/ |

---

## 📌 Key Takeaways
- Always use **typed generics**: `get<Product[]>()` for compile-time safety.
- **Functional interceptors** are the modern approach to attaching Auth tokens.
- `req.clone()` is mandatory — `HttpRequest` objects are **immutable**.
- Always handle **three states**: loading, success, error.
- **`rxResource()`** and **`resource()`** automatically manage loading, error, and value states as Signals!

---

**Next Lecture:** [Lecture 30 — Angular Material & Component Libraries](./30%20-%20Angular%20Material%20%26%20Component%20Libraries.md)