# Lecture 27 — Angular Services & Dependency Injection

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Create injectable services with `@Injectable({ providedIn: 'root' })`
- Inject dependencies using the modern `inject()` function
- Understand Angular's hierarchical injector system
- Create type-safe `InjectionToken` for non-class dependencies
- Use RxJS `BehaviorSubject` for reactive state management
- Integrate RxJS streams seamlessly with Angular Signals (`toSignal`)
- Auto-clean subscriptions with `takeUntilDestroyed()`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Angular services: `@Injectable`, singletons, `providedIn: 'root'`
2. Dependency injection: `inject()` vs constructor injection
3. Hierarchical injectors & Provider types
4. `InjectionToken` for non-class dependencies
5. RxJS Refresher: Observable, Subject, BehaviorSubject, operators
6. Bridging RxJS and Signals: `toSignal`
7. Auto-cleanup with `takeUntilDestroyed()`

### Part 2 — Practice / Lab (~90–120 min)
1. Logging service with configurable providers
2. Generic CRUD data service using RxJS & Signals
3. ShopAngular Project Part 5: Cart Service

---

## 1. What Are Angular Services?

A **service** is a TypeScript class decorated with `@Injectable()` that provides reusable logic, data, or state:

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'   // Automatically available application-wide
})
export class LoggerService {
  log(message: string): void {
    console.log(`[Logger] ${message}`);
  }
}
```

### Key Characteristics
- **Singleton** when `providedIn: 'root'` — one shared instance, created lazily.
- **Tree-shakable** — only included in the bundle if actually used.
- **Decoupled from components** — services own logic and state, not templates.

---

## 2. Injecting Services — The `inject()` Function

In modern Angular, we use the `inject()` function rather than constructor injection.

```ts
import { Component, inject } from '@angular/core';

@Component({ /* ... */ })
export class AppComponent {
  private logger = inject(LoggerService);

  doSomething(): void {
    this.logger.log('Action performed!');
  }
}
```

---

## 3. Hierarchical Injectors

Angular uses a **hierarchy** that mirrors the component tree. A service provided at the component level will create a new instance of the service for *every* instance of that component!

```ts
@Component({
  providers: [UserService],   // Each instance gets its OWN UserService!
})
export class UserPanelComponent {
  private userService = inject(UserService);
}
```

---

## 4. Injection Tokens

TypeScript interfaces don't exist at runtime — you can't use them as DI tokens. `InjectionToken` solves this for configuration objects or URLs:

```ts
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: () => ({
    apiUrl: 'https://api.example.com'
  })
});
```

### Injecting
```ts
export class HeaderComponent {
  private config = inject(APP_CONFIG);
  apiUrl = this.config.apiUrl;
}
```

---

## 5. RxJS Refresher for Angular

### Observable — A Stream of Values
```ts
const stream$ = new Observable<string>(subscriber => {
  subscriber.next('Hello');
  subscriber.complete();
});
```

### BehaviorSubject — An Observable with a Current Value
```ts
import { BehaviorSubject } from 'rxjs';

const state$ = new BehaviorSubject<number>(0);   // Initial value required
state$.subscribe(val => console.log(val));        // Logs 0 immediately
state$.next(5);                                    // Logs 5
```

---

## 6. Bridging RxJS and Signals: `toSignal`

While Signals are great for synchronous state, RxJS is still king for async events (like HTTP requests). Modern Angular allows you to effortlessly bridge the two!

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  // 1. Fetch data as an Observable
  private products$ = this.http.get<Product[]>('/api/products');

  // 2. Convert to a Signal for use in templates!
  // Requires an initialValue so the signal has something to return immediately.
  products = toSignal(this.products$, { initialValue: [] });
}
```

---

## 7. Auto-Cleanup with `takeUntilDestroyed()`

If you *must* manually subscribe to an Observable, you need to clean it up to prevent memory leaks. The modern way is `takeUntilDestroyed()`:

```ts
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class TimerComponent {
  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())   // Auto-unsubscribes on destroy!
      .subscribe(n => console.log(n));
  }
}
```

---

## 🧪 Practice Labs

### Lab 1 — Logging Service (30 min)
1. Generate `LoggerService` with `ng g s logger`.
2. Create an `InjectionToken` for `APP_PREFIX`.
3. Implement `info()`, `warn()`, `error()` methods that log to the console using the prefix.
4. Inject it into a component and log a message!

### Lab 2 — Generic CRUD Data Service with RxJS (40 min)
1. Create a `DataService` with a `BehaviorSubject` storing a list of items.
2. Implement `addItem()` and `removeItem()`.
3. Expose the `BehaviorSubject` as an Observable (`items$`).
4. In a component, inject the service and convert `items$` to a Signal using `toSignal()`!

---

## 📝 Assignment: ShopAngular Project — Part 5

It's time to build a robust Shopping Cart using Services and RxJS!

### Requirements
1. Generate a `CartService` (`ng g s cart`).
2. Inside, use a `BehaviorSubject<Product[]>` to hold the cart items.
3. Implement methods: `addToCart(product: Product)` and `removeFromCart(id: string)`.
4. Expose the cart as a signal using `toSignal()` so components can easily read it.
5. In your `ProductCardComponent`, when the "Add to Cart" output fires, the parent should call `CartService.addToCart()`.
6. In your `CartComponent`, display the items by reading the signal from the `CartService`.
7. **Bonus:** Add a `totalPrice` `computed()` signal to the `CartService`!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Dependency Injection | https://angular.dev/guide/di |
| Angular RxJS Interop | https://angular.dev/guide/signals/rxjs-interop |

---

## 📌 Key Takeaways
- **Services** are `@Injectable({ providedIn: 'root' })` — singletons, tree-shakable.
- Use **`inject()`** for dependency injection — cleaner than constructor injection.
- **`InjectionToken<T>`** is the type-safe way to inject config, constants, and non-class values.
- **`BehaviorSubject`** is the core of reactive state management with RxJS.
- **`toSignal()`** is the modern way to turn async RxJS streams into synchronous Signals.
- **`takeUntilDestroyed()`** prevents memory leaks by auto-unsubscribing.

---

**Next Lecture:** [Lecture 28 — Angular Forms — Template-Driven & Reactive](./28%20-%20Angular%20Forms%20%E2%80%94%20Template-Driven%20%26%20Reactive.md)