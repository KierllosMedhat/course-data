# Lecture 27 — Angular Services & Dependency Injection

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain what a service is and why Angular separates logic from components
- Create services with the Angular CLI and the `@Injectable` decorator
- Understand `providedIn: 'root'` and the singleton pattern
- Use constructor injection and the `inject()` function
- Inject non-class dependencies using `InjectionToken`
- Manage state with `BehaviorSubject` and expose it as observables
- Bridge RxJS and Angular Signals with `toSignal()`
- Handle automatic subscription cleanup
- Write unit tests with mock services

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is a Service?
2. Creating Services & `@Injectable`
3. Dependency Injection System
4. `inject()` vs Constructor Injection
5. `InjectionToken` for Non-Class Dependencies
6. RxJS State Management (BehaviorSubject)
7. Bridging to Signals with `toSignal()`
8. Subscription Cleanup & Testing

### Part 2 — Practice / Lab (~90 min)
1. Lab 1: Logging Service with Configurable Providers
2. Lab 2: Generic CRUD Data Service

---

## 1. What is a Service?

A **service** is a class that handles logic that doesn't belong in a component — data fetching, business rules, state management, logging, etc.

**Analogy:** Components are the **cashier** at a restaurant — they interact with the customer (UI). Services are the **kitchen** — they do the actual work behind the scenes. The cashier shouldn't be cooking, and the kitchen shouldn't be taking orders.

### Why Services?
- **Reusability** — Multiple components can share the same service
- **Separation of concerns** — Components focus on the view; services handle logic
- **Testability** — Services are easy to test in isolation

---

## 2. Creating a Service

```bash
ng generate service services/product
# Creates: src/app/services/product.service.ts
```

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Available everywhere as a singleton
})
export class ProductService {
  private products: Product[] = [];

  getAll(): Product[] {
    return this.products;
  }

  add(product: Product): void {
    this.products.push(product);
  }
}
```

### `providedIn: 'root'`

This registers the service at the **root injector** level, meaning:
- There is exactly **one instance** (singleton) shared across the entire app
- The service is **tree-shakable** — if no component uses it, it's removed from the bundle

---

## 3. Dependency Injection (DI)

Instead of components creating their own service instances (`new ProductService()`), Angular **injects** the service automatically. This is called Dependency Injection.

### Constructor Injection (Classic)

```ts
@Component({ ... })
export class ProductListComponent {
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.products = this.productService.getAll();
  }
}
```

### `inject()` Function (Modern — Preferred)

```ts
@Component({ ... })
export class ProductListComponent {
  private productService = inject(ProductService);

  products = this.productService.getAll();
}
```

> [!TIP]
> **Prefer `inject()`** over constructor injection. It's more concise, works with functional guards/resolvers, and doesn't require the `private` parameter shorthand.

---

## 4. Hierarchical Injectors

Angular's DI system is **hierarchical**. Each level can have its own provider:

```
Root Injector (providedIn: 'root')
  └── Module Injector
       └── Component Injector (providers: [])
            └── Child Component Injector
```

### Component-Level Providers

If you provide a service at the component level, each component instance gets its **own separate instance**:

```ts
@Component({
  selector: 'app-editor',
  providers: [UndoService] // NEW instance per component
})
export class EditorComponent {
  private undo = inject(UndoService);
}
```

| Provider Location | Instance Count | Use When... |
|-------------------|:--------------:|-------------|
| `providedIn: 'root'` | 1 (singleton) | Shared app state, API services |
| Component `providers` | 1 per component | Component-specific state (undo, form state) |

---

## 5. `InjectionToken` — Non-Class Dependencies

You can't inject a plain string or object — Angular needs a unique token to identify it:

```ts
import { InjectionToken } from '@angular/core';

// Define the token
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

// Provide it (in app.config.ts or a module)
providers: [
  { provide: API_BASE_URL, useValue: 'https://api.example.com' }
]

// Inject it
export class ApiService {
  private baseUrl = inject(API_BASE_URL);
}
```

---

## 6. State Management with `BehaviorSubject`

### RxJS Quick Refresher

- **Observable** — A stream of values over time (like a conveyor belt)
- **Subject** — An Observable that you can manually push values into
- **BehaviorSubject** — A Subject that remembers its **current value** and immediately emits it to new subscribers

### State Container Pattern

```ts
@Injectable({ providedIn: 'root' })
export class CartService {
  // Private mutable state
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  // Public read-only observable (components subscribe to this)
  readonly items$ = this.itemsSubject.asObservable();

  // Expose computed values
  readonly itemCount$ = this.items$.pipe(
    map(items => items.length)
  );

  addItem(item: CartItem): void {
    const current = this.itemsSubject.getValue();
    this.itemsSubject.next([...current, item]);
  }

  removeItem(id: number): void {
    const current = this.itemsSubject.getValue();
    this.itemsSubject.next(current.filter(item => item.id !== id));
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }
}
```

```ts
// In a component — subscribe to the cart
@Component({ ... })
export class CartComponent {
  private cartService = inject(CartService);
  items$ = this.cartService.items$;
  count$ = this.cartService.itemCount$;
}
```

```html
<!-- In the template — use async pipe for automatic subscription management -->
<div *ngFor="let item of items$ | async">{{ item.name }}</div>
<span>Items in cart: {{ count$ | async }}</span>
```

---

## 7. `toSignal()` — Bridging RxJS and Signals

Angular Signals are the newer reactive primitive. `toSignal()` converts an Observable to a Signal:

```ts
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ ... })
export class CartComponent {
  private cartService = inject(CartService);

  // Convert Observable → Signal
  items = toSignal(this.cartService.items$, { initialValue: [] });
  count = toSignal(this.cartService.itemCount$, { initialValue: 0 });
}
```

```html
<!-- No async pipe needed — just read the signal directly -->
<div *ngFor="let item of items()">{{ item.name }}</div>
<span>Items: {{ count() }}</span>
```

> [!NOTE]
> `toSignal()` automatically subscribes and unsubscribes when the component is destroyed. No cleanup needed.

---

## 8. Subscription Cleanup

Subscriptions that aren't cleaned up cause memory leaks. Options:

| Method | Best For |
|--------|---------|
| `async` pipe | Template bindings (auto-unsubscribes) |
| `toSignal()` | Signal-based components (auto-unsubscribes) |
| `DestroyRef` + `takeUntilDestroyed()` | Manual subscriptions in `ngOnInit` |

```ts
// Modern cleanup with takeUntilDestroyed
export class MyComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.dataService.getData().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => this.process(data));
  }
}
```

---

## 9. Testing Services

```ts
describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should start with empty cart', () => {
    expect(service.items$.subscribe(items => expect(items).toEqual([])));
  });

  it('should add an item', () => {
    service.addItem({ id: 1, name: 'Widget', price: 9.99 });
    service.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].name).toBe('Widget');
    });
  });
});
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Creating service instances with `new` | Always use Angular DI (`inject()` or constructor injection) |
| Exposing `BehaviorSubject` directly | Expose `.asObservable()` so consumers can't call `.next()` |
| Forgetting to unsubscribe | Use `async` pipe, `toSignal()`, or `takeUntilDestroyed()` |
| Putting HTTP calls in components | Move all data fetching to services |
| Using `Subject` when you need the current value | Use `BehaviorSubject` — it remembers and emits the latest value |

---

## 🧪 Practice Labs

### Lab 1 — Logging Service with Configurable Providers (40 min)
1. Create a `LoggingService` with methods `info()`, `warn()`, `error()`
2. Create an `InjectionToken<LogLevel>` where `LogLevel = 'debug' | 'info' | 'warn' | 'error'`
3. The service should only log messages at or above the configured level
4. Provide different `LogLevel` values in development vs production

### Lab 2 — Generic CRUD Data Service (50 min)
1. Create a generic `DataService<T>` that uses `BehaviorSubject<T[]>` for state
2. Implement `getAll()`, `getById(id)`, `add(item)`, `update(item)`, `delete(id)`
3. Expose data as both an Observable (`items$`) and a Signal (`items = toSignal(...)`)
4. Use this service in a component to manage a list of `Todo` items

---

## 📝 Assignment: ShopAngular Project — Part 5: Cart Service

### Requirements
1. Create `CartService` with `BehaviorSubject<CartItem[]>` for state
2. Implement: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`
3. Add computed observables: `totalPrice$` and `itemCount$`
4. Convert all observables to signals using `toSignal()`
5. Create a `CartComponent` that displays all items with quantity controls
6. Add a cart badge in the navbar showing `itemCount`
7. Write unit tests for all `CartService` methods

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular DI Guide | https://angular.dev/guide/di |
| RxJS Official Docs | https://rxjs.dev/ |
| Angular Signals | https://angular.dev/guide/signals |

---

## 📌 Key Takeaways
- **Services** separate business logic from components — components display, services compute
- **`providedIn: 'root'`** creates a singleton service shared across the entire app
- **`inject()`** is the modern, preferred way to request dependencies
- **`BehaviorSubject`** is the foundation for state management — it remembers and emits the current value
- Always expose **`asObservable()`** to prevent external code from pushing values
- **`toSignal()`** bridges RxJS Observables to Angular Signals with automatic cleanup
- **Always clean up subscriptions** — use `async` pipe, `toSignal()`, or `takeUntilDestroyed()`

---

**Next Lecture:** [Lecture 28 — Angular Forms: Template-Driven & Reactive](./28%20-%20Angular%20Forms%20-%20Template-Driven%20%26%20Reactive.md)
