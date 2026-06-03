# Lecture 27 – Angular Services & Dependency Injection

---

**Course:** Fullstack Web Development  
**Instructor:** (Your Instructor's Name)  
**Duration:** ~3 hours (lecture + labs)

---

## Table of Contents

1. [Learning Objectives](#learning-objectives)
2. [Agenda](#agenda)
3. [What Is a Service?](#what-is-a-service)
4. [Creating a Service with the Angular CLI](#creating-a-service-with-the-angular-cli)
5. [The `@Injectable` Decorator](#the-injectable-decorator)
6. [providedIn: 'root' and the Singleton Pattern](#providedin-root-and-the-singleton-pattern)
7. [Understanding the Angular Injector System](#understanding-the-angular-injector-system)
8. [Hierarchical Injectors](#hierarchical-injectors)
9. [Component-Level Providers](#component-level-providers)
10. [The `inject()` Function vs Constructor Injection](#the-inject-function-vs-constructor-injection)
11. [InjectionToken — Injecting Non-Class Dependencies](#injectiontoken--injecting-non-class-dependencies)
12. [RxJS Refresher for Angular](#rxjs-refresher-for-angular)
13. [Subject vs BehaviorSubject](#subject-vs-behaviorsubject)
14. [BehaviorSubject as a State Container](#behaviorsubject-as-a-state-container)
15. [toSignal() — Bridging RxJS and Angular Signals](#tosignal--bridging-rxjs-and-angular-signals)
16. [Automatic Subscription Cleanup](#automatic-subscription-cleanup)
17. [Dependency Injection in Tests](#dependency-injection-in-tests)
18. [Lab 1 — Logging Service with Configurable Providers](#lab-1--logging-service-with-configurable-providers)
19. [Lab 2 — Generic CRUD Data Service with RxJS & Signals](#lab-2--generic-crud-data-service-with-rxjs--signals)
20. [Assignment — ShopAngular Project Part 5: Cart Service](#assignment--shopangular-project-part-5-cart-service)
21. [Key Takeaways](#key-takeaways)
22. [Resources](#resources)
23. [Common Mistakes & How to Avoid Them](#common-mistakes--how-to-avoid-them)

---

## Learning Objectives

By the end of this lecture you will be able to:

- Explain what an Angular **service** is and why we need it
- Generate a service using the Angular CLI and understand the generated files
- Understand the `@Injectable` decorator and why it exists
- Explain what `providedIn: 'root'` means and why it creates a **singleton**
- Describe Angular's **injector tree** and how it resolves dependencies
- Choose between **root-level** and **component-level** providers appropriately
- Use the modern **`inject()`** function instead of constructor injection
- Create and use an **`InjectionToken<T>`** for non-class dependencies
- Understand **Observables**, **Subject**, and **BehaviorSubject** in the context of Angular state
- Convert Observables to Signals with **`toSignal()`**
- Clean up subscriptions automatically with **`takeUntilDestroyed()`**
- Write unit tests that use Angular's **`TestBed.inject()`**

---

## Agenda

| # | Topic | Estimated Time |
|---|-------|---------------|
| 1 | What is a service? Analogy & concept | 15 min |
| 2 | CLI generation & `@Injectable` | 10 min |
| 3 | `providedIn: 'root'` & singleton pattern | 15 min |
| 4 | Angular injector system & hierarchy | 20 min |
| 5 | Component-level providers | 10 min |
| 6 | `inject()` vs constructor injection | 15 min |
| 7 | `InjectionToken<T>` | 15 min |
| 8 | RxJS refresher: Observable, Subject, BehaviorSubject | 25 min |
| 9 | `toSignal()` and `takeUntilDestroyed()` | 20 min |
| 10 | DI in tests | 10 min |
| 11 | **Lab 1** – Logging Service | 30 min |
| 12 | **Lab 2** – CRUD Data Service | 40 min |
| 13 | Assignment overview | 10 min |

---

## What Is a Service?

### The Problem: Shared Logic Across Components

Imagine you are building a shopping app. You have three separate components:

- `ProductListComponent` — shows all products
- `CartComponent` — shows the current cart
- `NavbarComponent` — shows a badge with the cart item count

Each component needs to **know about the cart**. Where do you store the cart data?

**Option A (bad):** Store it in `CartComponent` and pass it everywhere via `@Input`/`@Output`. This gets messy very fast — you end up passing data through many layers of components that don't actually care about it (this is called **"prop drilling"**).

**Option B (good):** Put the cart logic in a **service** — a single, shared place that any component can ask for data from.

---

### 🍽️ The Restaurant Analogy

> **Think of your Angular app as a restaurant.**

| Restaurant | Angular App |
|-----------|-------------|
| The **kitchen** | A **service** |
| **Waiters** (components) | **Components** |
| Food orders | Data / state |
| The kitchen *cooks once* and every waiter can pick it up | A service *computes/stores data once* and every component can use it |

In a restaurant, every waiter doesn't have their own private kitchen — that would be wasteful and inconsistent. There is **one shared kitchen** that all waiters rely on.

Similarly, in Angular:
- Every component does **not** hold its own copy of shared data
- Instead, they all **inject the same service** (the shared kitchen)

> [!NOTE]
> A **service** in Angular is simply a TypeScript class that holds:
> - **Shared logic** (like formatting, validation, HTTP calls)
> - **Shared state** (like cart items, the current user, app configuration)
>
> Components call the service; they don't duplicate the logic themselves.

---

### Component Logic vs Service Logic

Not all logic belongs in a service. Here is how to decide:

| This belongs in a **Component** | This belongs in a **Service** |
|--------------------------------|-------------------------------|
| Displaying data on screen | Fetching data from an API |
| Handling button clicks locally | Managing state shared across components |
| Local UI state (e.g., is a dropdown open?) | Business logic (e.g., calculating totals) |
| Template-specific formatting | Authentication & authorization checks |
| Animations and transitions | Logging and analytics |

> [!TIP]
> A good rule of thumb: **if two or more components need the same data or logic, put it in a service.**

---

### Why Does This Matter?

Without services:
- You end up with **duplicate logic** in multiple components
- Changing a business rule means editing **many files** instead of one
- Sharing state between unrelated components is very hard
- Testing is difficult because logic is buried inside components

With services:
- Logic lives in **one place** (DRY — Don't Repeat Yourself)
- Any component can use the service without knowing how it works internally
- You can **replace or mock** a service in tests easily
- Code is more **maintainable** and **scalable**

---

### Section Recap

- A service is a **shared class** containing logic and/or state
- Components are like waiters; services are like the shared kitchen
- Use a service when **multiple components need the same data or behaviour**
- Services keep components **thin and focused** on presentation

---

## Creating a Service with the Angular CLI

### Step 1: Run the Generator

Open your terminal in the root of your Angular project and run:

```bash
# 'ng generate service' creates a new service file
# 'core/logger' means: place it in src/app/core/ and name it logger
ng generate service core/logger

# Or the shorthand alias:
ng g s core/logger
```

> [!NOTE]
> It is a very common convention to place services inside a `core/` folder. This folder typically holds singleton services, guards, and interceptors — things that are used application-wide but not tied to any single feature.

---

### Step 2: Understand the Generated Files

The CLI will create two files:

```
src/
└── app/
    └── core/
        ├── logger.service.ts        ← The service class itself
        └── logger.service.spec.ts   ← A test file (we'll look at this later)
```

Let's open `logger.service.ts`:

```ts
// Angular's core library — provides all the fundamental building blocks
import { Injectable } from '@angular/core';

// @Injectable marks this class as something Angular's DI system can manage
// The metadata tells Angular HOW and WHERE to provide this service
@Injectable({
  // 'root' means: register this service in the application's root injector
  // (We'll explain what this means in detail very soon)
  providedIn: 'root'
})
export class LoggerService {

  // The class body is empty right now — we'll fill it in
  constructor() { }

}
```

That's it! Angular already knows how to create and share this service throughout your whole application. The `@Injectable({ providedIn: 'root' })` decorator does all the heavy lifting.

---

### Step 3: Add Methods to the Service

Let's make our `LoggerService` actually do something:

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  // We store log history in a private array so nothing outside can corrupt it
  private logs: string[] = [];

  /**
   * Logs an informational message to the console and stores it.
   * @param message - The message to log
   */
  log(message: string): void {
    // Build a timestamped log string
    const entry = `[INFO] ${new Date().toISOString()} — ${message}`;

    // Store the log entry in our internal history array
    this.logs.push(entry);

    // Also print it to the browser developer console
    console.log(entry);
  }

  /**
   * Logs a warning message (slightly different formatting for visibility)
   */
  warn(message: string): void {
    const entry = `[WARN] ${new Date().toISOString()} — ${message}`;
    this.logs.push(entry);
    console.warn(entry);  // console.warn prints in yellow in most browsers
  }

  /**
   * Logs an error message.
   */
  error(message: string): void {
    const entry = `[ERROR] ${new Date().toISOString()} — ${message}`;
    this.logs.push(entry);
    console.error(entry); // console.error prints in red
  }

  /**
   * Returns a copy of all stored logs.
   * We return a copy (spread) so callers can't mutate our internal array.
   */
  getLogs(): string[] {
    return [...this.logs]; // spread creates a shallow copy
  }

}
```

---

### Section Recap

- Use `ng generate service <path/name>` to scaffold a service
- The CLI creates the `.service.ts` file and a `.spec.ts` test file
- The generated service has `@Injectable({ providedIn: 'root' })` by default
- You add your shared logic as **methods** and shared state as **properties** on the class

---

## The `@Injectable` Decorator

### What Is a Decorator?

A **decorator** is a special TypeScript syntax that starts with `@` and sits directly above a class (or method, or property). It is a function that Angular calls at runtime to attach **metadata** to the class.

Think of a decorator like a **sticky label** you put on a product. The label tells people important information about the product without changing what the product actually is.

```ts
// @Component is a decorator — it tells Angular "this class is a component"
@Component({ ... })
export class MyComponent { }

// @Injectable is a decorator — it tells Angular "this class can be injected"
@Injectable({ ... })
export class MyService { }
```

---

### Why Does `@Injectable` Exist?

When Angular's **Dependency Injection system** needs to create an instance of your service, it must know:

1. **Where** to provide it (root? a specific module? a specific component?)
2. **Whether** this class itself has dependencies it needs Angular to supply

`@Injectable` accomplishes both:

```ts
@Injectable({
  // This tells Angular WHERE to register the service
  // 'root' = the top-level, application-wide injector
  providedIn: 'root'
})
export class CartService {

  // CartService itself needs LoggerService
  // Angular reads this and knows it must supply a LoggerService when creating CartService
  private logger = inject(LoggerService);

}
```

> [!IMPORTANT]
> Even if your service has **no dependencies of its own**, you should still add `@Injectable` to it. Why? Because:
> 1. It's required if another service wants to inject YOUR service
> 2. It documents intent — it makes it clear this class participates in DI
> 3. In some Angular configurations, omitting it can cause runtime errors

---

### The `@Injectable` Options Object

```ts
@Injectable({
  // WHERE to provide the service — most common options:
  //   'root'    → application root injector (singleton across the whole app)
  //   'any'     → a new instance for each lazy-loaded module
  //   SomeModule → provided in a specific NgModule (older approach)
  //   null      → do NOT register automatically; must be manually provided
  providedIn: 'root'
})
```

---

### Section Recap

- `@Injectable` is a **decorator** — a metadata label Angular reads at runtime
- It tells Angular: (1) where to provide the service and (2) that this class can have dependencies injected into it
- Always add `@Injectable` to every service class

---

## `providedIn: 'root'` and the Singleton Pattern

### What Is a Singleton?

A **singleton** is a design pattern where only **one single instance** of a class exists in memory at any given time.

Instead of creating a new object every time you need it, everyone shares the **same object**.

```
Without singleton:                    With singleton (Angular root service):
──────────────────                    ─────────────────────────────────────
Component A → new CartService()       Component A ──┐
Component B → new CartService()       Component B ──┼──► THE SAME CartService instance
Component C → new CartService()       Component C ──┘
(3 separate instances with           (1 shared instance with
 different state — INCONSISTENT)      consistent state — CORRECT)
```

---

### What Does `providedIn: 'root'` Actually Do?

When you write `providedIn: 'root'`, you are telling Angular:

1. **Register this service in the root injector** — the highest-level injector in the application
2. **Create the service lazily** — only instantiate it the first time something requests it (not at app startup)
3. **Share the same instance** — every component, directive, pipe, or other service that requests it gets the exact same object

```ts
@Injectable({
  providedIn: 'root'  // ← registers in root injector as a singleton
})
export class CartService {
  // This items array is SHARED across the whole application
  // No matter which component accesses the service, they see the same array
  private items: CartItem[] = [];
}
```

---

### Lazy Creation

> [!TIP]
> Angular does NOT create your service at app startup. It creates it **the first time** a component or other service asks for it. This is called **lazy instantiation** and it means unused services don't waste memory.

---

### Tree-Shakable Providers

"Tree-shaking" is the process where the JavaScript bundler (like Webpack or esbuild) **removes unused code** from your final build, keeping bundle sizes small.

When you use `providedIn: 'root'`, Angular can **tree-shake** your service if it is never actually used anywhere:

```ts
// If nothing in your app ever injects LoggerService,
// the bundler can remove it entirely from the production bundle!
@Injectable({
  providedIn: 'root'  // ← enables tree-shaking
})
export class LoggerService { ... }
```

The older way of registering services (in an NgModule's `providers` array) was **not tree-shakable**, meaning unused services would still end up in your bundle. `providedIn: 'root'` is the modern, preferred approach.

---

### Visualising the Singleton

```
APP STARTUP
───────────
  Root Injector created (empty registry)


FIRST COMPONENT REQUESTS CartService
──────────────────────────────────────
  Root Injector: "I don't have CartService yet"
  Root Injector: "Let me create one..."
  CartService instance #1 created → stored in registry


SECOND COMPONENT REQUESTS CartService
───────────────────────────────────────
  Root Injector: "I already have CartService!"
  Root Injector: → returns the SAME CartService instance #1


THIRD COMPONENT REQUESTS CartService
──────────────────────────────────────
  Root Injector: → returns the SAME CartService instance #1
```

---

### Section Recap

- `providedIn: 'root'` creates a **singleton** — one shared instance for the entire app
- The instance is created **lazily** (only when first requested)
- Root-provided services are **tree-shakable** — unused ones get removed from the bundle
- All components that inject the service share the **same state and memory**

---

## Understanding the Angular Injector System

### What Is an Injector?

An **injector** is like a **smart factory and registry** built into Angular. Its job is:

1. Keep a **map** of "token → instance" (registry)
2. When something asks for a token, **look it up** in the map
3. If it doesn't exist yet, **create it** (and cache it for next time)
4. If creation requires other dependencies, **recursively resolve those too**

```
Something asks Angular: "Give me CartService"
              ↓
         [ INJECTOR ]
              ↓
   Look up 'CartService' in registry
              ↓
   Found? → Return cached instance
   Not found? → Read metadata → Create instance → Cache → Return
```

---

### How Angular Resolves a Dependency

Let's trace exactly what happens when a component injects a service:

```ts
// ProductListComponent needs both CartService and LoggerService
@Component({ ... })
export class ProductListComponent {
  private cart = inject(CartService);     // Step 1: ask injector for CartService
  private logger = inject(LoggerService); // Step 2: ask injector for LoggerService
}
```

**Step-by-step resolution:**

1. Angular sees `inject(CartService)` inside `ProductListComponent`
2. Angular checks the **component-level injector** of `ProductListComponent` first
3. Not found there → Angular checks the **parent component's injector**
4. Not found → Angular keeps walking up the component tree
5. Eventually reaches the **root injector**
6. Root injector has `CartService` (because of `providedIn: 'root'`)
7. Root injector returns the existing `CartService` singleton
8. Angular assigns it to `this.cart`

This "walk up the tree until found" behaviour is called **hierarchical injection**.

---

### The Injector Tree (ASCII Diagram)

```
┌─────────────────────────────────────────┐
│           ROOT INJECTOR                 │
│  (Holds all root-provided services)     │
│  CartService, LoggerService, AuthService│
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐  ┌─────▼──────┐
│  AppComponent│  │  (lazy mod)│
│  (injector)  │  │  injector  │
└──────┬───────┘  └────────────┘
       │
   ┌───┴───────────────┐
   │                   │
┌──▼──────────┐  ┌─────▼──────────┐
│ProductList  │  │  CartComponent  │
│Component    │  │  (injector)     │
│(injector)   │  └────────────────┘
└─────────────┘

When ProductListComponent needs CartService:
1. Check ProductListComponent injector → not there
2. Check AppComponent injector → not there
3. Check Root Injector → FOUND → return singleton
```

> [!IMPORTANT]
> Angular always searches **bottom-up**: it starts at the requesting component and walks **up** toward the root. It uses the **first match it finds**. This is what allows component-level providers to override root-level ones.

---

### Section Recap

- An **injector** is Angular's built-in smart factory — it creates and caches service instances
- Angular has a **tree of injectors** mirroring the component tree
- When a dependency is requested, Angular searches **bottom-up** from the requesting component
- The **root injector** is at the very top and holds `providedIn: 'root'` services

---

## Hierarchical Injectors

### Why Have Multiple Injectors?

Sometimes you want a **different instance** of a service for a specific part of your UI. For example:

- A `FormStateService` that holds the state of a form — you want a **fresh instance** every time the form component is created, not a shared global one
- A `DragDropService` that tracks which item is being dragged — each independent drag-drop zone should have its own instance

Angular's hierarchical injector system makes this possible.

---

### Root Injector vs Component Injector

```
┌──────────────────────────────────────────────────────────┐
│                    ROOT INJECTOR                         │
│                                                          │
│  Services registered here are shared across the ENTIRE   │
│  application. All components share the same instance.    │
│                                                          │
│  Example: AuthService, CartService, LoggerService        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                  COMPONENT INJECTOR                      │
│                                                          │
│  Services registered here are scoped to THAT component   │
│  and its children. Each time the component is created,   │
│  a NEW instance of the service is created.               │
│                                                          │
│  Example: FormStateService, LocalDragService             │
└──────────────────────────────────────────────────────────┘
```

---

### Section Recap

- Angular has a **tree of injectors**, not just one
- The **root injector** provides globally shared singletons
- **Component injectors** provide local instances scoped to one component subtree
- Angular resolves dependencies by walking **up the injector tree**

---

## Component-Level Providers

### How to Register a Service at Component Level

You register a service at the component level using the `providers` array inside the `@Component` decorator:

```ts
import { Component } from '@angular/core';
import { FormStateService } from './form-state.service';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',

  // By listing FormStateService here, we tell Angular:
  // "Create a NEW instance of FormStateService specifically for this component
  //  and all of its child components."
  providers: [FormStateService]
})
export class CheckoutFormComponent {

  // This component gets its OWN private FormStateService instance
  // NOT the one from the root injector
  private formState = inject(FormStateService);

}
```

> [!WARNING]
> If `FormStateService` also has `providedIn: 'root'` in its `@Injectable`, the component's `providers` array **overrides** that for this component subtree. The component and its children will get a **new, separate instance** — not the root singleton.

---

### Real-World Example: Why This Is Useful

Imagine a page with two independent accordion components side by side:

```
┌─────────────────────────────────────────────┐
│                  Page                        │
│                                              │
│  ┌──────────────┐    ┌──────────────┐        │
│  │  AccordionA  │    │  AccordionB  │        │
│  │              │    │              │        │
│  │ AccordionSvc │    │ AccordionSvc │        │
│  │ (instance 1) │    │ (instance 2) │        │
│  └──────────────┘    └──────────────┘        │
│                                              │
│  Each accordion has its own INDEPENDENT      │
│  state — opening one doesn't affect the other│
└─────────────────────────────────────────────┘
```

```ts
@Component({
  selector: 'app-accordion',
  template: `...`,

  // Each accordion gets its own AccordionService instance
  providers: [AccordionService]
})
export class AccordionComponent {
  private accordion = inject(AccordionService);
  // This service tracks which panel is open for THIS accordion only
}
```

---

### Lifecycle of a Component-Level Service

> [!IMPORTANT]
> A component-level service is **created when the component is created** and **destroyed when the component is destroyed**. This is different from root-level services which persist for the lifetime of the application.

```
Component Created → Component Injector Created → Service Instance Created
      │
      │   ... component is active ...
      │
Component Destroyed → Service Instance Destroyed → Memory Freed
```

This automatic cleanup is one of the advantages of component-level providers.

---

### Section Recap

- Register a service in `@Component({ providers: [...] })` to make it **component-scoped**
- Each time the component is created, a **new service instance** is created
- Child components of that component share the **same component-level instance**
- The service is **destroyed** when the component is destroyed — automatic cleanup
- Use this when you need **isolated state** per component instance

---

## The `inject()` Function vs Constructor Injection

### Two Ways to Inject Dependencies

Angular has supported **constructor injection** since its earliest days. But Angular 14 introduced the modern **`inject()` function**. Let's understand both.

---

### Traditional Approach: Constructor Injection

In the older Angular style, you declare dependencies as constructor parameters:

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class ProductService {

  // Angular reads the constructor parameter types using TypeScript decorators
  // and automatically provides matching instances
  constructor(
    private http: HttpClient,      // Angular injects HttpClient here
    private logger: LoggerService  // Angular injects LoggerService here
  ) {
    // By the time this code runs, both http and logger are already available
    this.logger.log('ProductService created');
  }

  getProducts() {
    return this.http.get('/api/products');
  }

}
```

**How it works:** Angular reads the TypeScript type metadata (enabled by `emitDecoratorMetadata` in `tsconfig.json`) to know which tokens to inject.

---

### Modern Approach: The `inject()` Function

Since Angular 14, you can use the `inject()` function anywhere inside an **injection context**:

```ts
import { Injectable, inject } from '@angular/core'; // inject comes from @angular/core
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class ProductService {

  // inject() is called at the field-initialisation level, which runs
  // inside the injection context — this is perfectly safe
  private http = inject(HttpClient);          // modern inject() call
  private logger = inject(LoggerService);     // modern inject() call

  constructor() {
    // Constructor body is now clean — no dependency declarations needed
    this.logger.log('ProductService created');
  }

  getProducts() {
    return this.http.get('/api/products');
  }

}
```

---

### Why Is `inject()` Preferred in Modern Angular?

> [!IMPORTANT]
> The Angular team recommends `inject()` over constructor injection for modern code. Here's why:

| Feature | Constructor Injection | `inject()` Function |
|---------|----------------------|---------------------|
| Works in class fields | ❌ No | ✅ Yes |
| Works in functional guards/resolvers | ❌ No | ✅ Yes |
| Requires `emitDecoratorMetadata` in tsconfig | ✅ Yes (extra config) | ❌ No |
| Verbosity | More verbose (params list) | More concise |
| Readable in large classes | Can be harder to scan | Each field is self-documenting |
| Usable outside a constructor | ❌ No | ✅ Yes (in injection context) |
| Works with `abstract class` base classes | Tricky | ✅ Easy |

```ts
// inject() shines when writing base classes that subclasses extend:

// Base class
abstract class BaseComponent {
  // Subclasses automatically inherit this — no constructor forwarding needed!
  protected logger = inject(LoggerService);
}

// Child class doesn't need to re-declare or forward constructor params
@Component({ ... })
export class ProductComponent extends BaseComponent {
  // this.logger is already available from BaseComponent!
  ngOnInit() {
    this.logger.log('ProductComponent initialized');
  }
}
```

---

### What Is an "Injection Context"?

`inject()` can only be called during Angular's DI resolution phase. Valid injection contexts are:

1. **During class field initialization** (most common)
2. **Inside a constructor**
3. **Inside factory functions** passed to `provideX()` utilities
4. **Inside `runInInjectionContext()`**

```ts
@Component({ ... })
export class MyComponent {
  // ✅ VALID — field initialiser runs in injection context
  private svc = inject(MyService);

  constructor() {
    // ✅ VALID — constructor runs in injection context
    const svc2 = inject(MyService);
  }

  ngOnInit() {
    // ❌ INVALID — lifecycle hooks run AFTER injection context ends
    // This will throw: "inject() must be called from an injection context"
    const svc3 = inject(MyService);
  }
}
```

> [!WARNING]
> **Never call `inject()` inside lifecycle hooks** (`ngOnInit`, `ngAfterViewInit`, etc.) or event handlers. It will throw a runtime error. Only call it at field initialisation time or inside the constructor.

---

### Section Recap

- **Constructor injection** is the classic approach — dependencies as constructor parameters
- **`inject()` function** is the modern approach — cleaner, more flexible, no decorator metadata needed
- `inject()` only works inside an **injection context** (field initialiser or constructor)
- `inject()` is preferred for new Angular code, especially with base classes and functional APIs

---

## InjectionToken — Injecting Non-Class Dependencies

### The Problem: Interfaces Don't Exist at Runtime

In TypeScript, interfaces are a **compile-time only** feature. When TypeScript compiles to JavaScript, all interfaces are completely erased — they leave no trace in the compiled output.

```ts
// TypeScript source:
interface AppConfig {
  apiUrl: string;
  maxRetries: number;
}

// Compiled JavaScript output:
// (nothing — the interface is gone!)
```

Because Angular's DI system works at **runtime** (in JavaScript), it cannot use an interface as a dependency token. There's nothing to look up!

```ts
// ❌ THIS WILL NOT WORK — cannot inject by interface type
@Component({ ... })
export class MyComponent {
  // AppConfig doesn't exist at runtime — Angular has nothing to look up
  private config = inject(AppConfig); // COMPILE ERROR or runtime failure
}
```

---

### The Solution: `InjectionToken<T>`

An `InjectionToken` is a **real runtime object** (not an interface) that you can use as a DI key. It preserves your TypeScript type information while being an actual JavaScript value Angular can track.

```ts
import { InjectionToken } from '@angular/core';

// First, define the shape of your configuration with an interface
interface AppConfig {
  apiUrl: string;
  maxRetries: number;
  debugMode: boolean;
}

// Create an InjectionToken — this IS a real runtime JavaScript object
// The string 'AppConfig' is just a description for debugging purposes
// The generic <AppConfig> tells TypeScript what type this token provides
export const APP_CONFIG = new InjectionToken<AppConfig>('AppConfig');
```

> [!NOTE]
> By convention, `InjectionToken` constants are named in `UPPER_SNAKE_CASE`. This visually distinguishes them from regular class names and makes it immediately obvious they are DI tokens.

---

### Registering the Token with a Factory Function

Once you have the token, you register a **provider** that tells Angular what value to associate with it:

```ts
// app.config.ts (or wherever you bootstrap your app)
import { ApplicationConfig } from '@angular/core';
import { APP_CONFIG, AppConfig } from './app-config.token';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideRouter, provideHttpClient, etc. ...

    {
      // The token that Angular will use as the lookup key
      provide: APP_CONFIG,

      // useValue: supply a static value directly
      useValue: {
        apiUrl: 'https://api.myapp.com',
        maxRetries: 3,
        debugMode: false
      } satisfies AppConfig // 'satisfies' ensures type safety without widening
    }
  ]
};
```

You can also use a **factory function** for dynamic values:

```ts
{
  provide: APP_CONFIG,
  // useFactory: Angular calls this function to produce the value
  // This is useful when the value depends on other services or runtime conditions
  useFactory: () => ({
    apiUrl: window.location.hostname === 'localhost'
      ? 'http://localhost:3000'  // development API
      : 'https://api.myapp.com', // production API
    maxRetries: 3,
    debugMode: window.location.hostname === 'localhost'
  } satisfies AppConfig)
}
```

---

### Injecting the Token

```ts
import { Component, inject } from '@angular/core';
import { APP_CONFIG } from './app-config.token';

@Component({
  selector: 'app-root',
  template: `<p>API URL: {{ config.apiUrl }}</p>`
})
export class AppComponent {

  // inject() takes the InjectionToken directly — not a class, but a token object
  // TypeScript knows the return type is AppConfig because of the generic <AppConfig>
  protected config = inject(APP_CONFIG);

  ngOnInit() {
    console.log('API URL:', this.config.apiUrl);       // 'https://api.myapp.com'
    console.log('Max Retries:', this.config.maxRetries); // 3
  }
}
```

---

### Common Use Cases for `InjectionToken`

| Use Case | Token Example |
|----------|--------------|
| App-wide configuration | `APP_CONFIG` |
| Environment variables | `ENVIRONMENT` |
| Feature flags | `FEATURE_FLAGS` |
| API base URL | `API_BASE_URL` |
| Logging configuration | `LOG_LEVEL` |
| Abstract service interface (strategy pattern) | `STORAGE_SERVICE` |

---

### Section Recap

- TypeScript **interfaces are erased at runtime** — they cannot be DI tokens
- `InjectionToken<T>` is a **real runtime object** that Angular can use as a DI key
- Name injection tokens in `UPPER_SNAKE_CASE` by convention
- Register the token with a `useValue` or `useFactory` provider
- Inject it using `inject(YOUR_TOKEN)` — TypeScript knows the correct type

---

## RxJS Refresher for Angular

### Why Does Angular Use RxJS?

Angular heavily uses **RxJS** (Reactive Extensions for JavaScript), a library for working with **asynchronous data streams**.

Think of RxJS as a **water pipe system**:

```
Traditional callback/promise:
  You ask for water → wait → get one glass → done

RxJS Observable:
  You install a tap (subscribe) → water flows continuously → you get
  each drop as it arrives → you can turn off the tap when done (unsubscribe)
```

An **Observable** is like a pipe that can emit:
- **One value** (like a single HTTP response)
- **Many values over time** (like mouse click events or WebSocket messages)
- **An error** (if something goes wrong)
- **A completion signal** (no more values)

---

### The Observable Basics

```ts
import { Observable, of } from 'rxjs';

// 'of' creates an Observable that immediately emits the given values and completes
const numbers$ = of(1, 2, 3, 4, 5);
//               ↑
//               The $ suffix is a strong convention for Observables
//               It visually signals "this is a stream, not a plain value"

// An Observable does NOTHING until you subscribe to it
// It is lazy — no work is done until there's a subscriber
numbers$.subscribe({
  next: (value) => console.log('Got:', value),  // called for each emitted value
  error: (err) => console.error('Error:', err), // called if an error occurs
  complete: () => console.log('Done!')           // called when the stream ends
});

// Output:
// Got: 1
// Got: 2
// Got: 3
// Got: 4
// Got: 5
// Done!
```

---

### The `$` Naming Convention

> [!TIP]
> The `$` suffix on a variable name is a widely-adopted Angular/RxJS convention to signal "this variable holds an Observable". It is NOT required by the language, but it greatly improves code readability:

```ts
// Without $ convention — unclear which are streams:
const user = inject(UserService).currentUser;
const products = productService.getProducts();
const cartCount = cartService.itemCount;

// With $ convention — immediately obvious which are Observables:
const user$ = inject(UserService).currentUser$;        // Observable<User>
const products$ = productService.getProducts$();       // Observable<Product[]>
const cartCount$ = cartService.itemCount$;             // Observable<number>
```

---

### Hot vs Cold Observables (Brief Overview)

```
COLD Observable (default):                 HOT Observable:
─────────────────────────                  ─────────────────
- Each subscriber gets its own stream      - All subscribers share ONE stream
- Like a Netflix movie (each viewer        - Like a live TV broadcast (you tune
  starts from the beginning)                 in and see whatever is on NOW)
- of(), from(), http.get()                 - Subject, BehaviorSubject, EventEmitter
```

---

### Section Recap

- **RxJS** is a library for working with async data streams
- An **Observable** is a lazy stream that emits values over time
- Use the `$` suffix convention on Observable variables
- Observables do nothing until **subscribed to**
- **Hot** Observables share a stream; **Cold** Observables create a new stream per subscriber

---

## Subject vs BehaviorSubject

### What Is a Subject?

A **Subject** is both an **Observable** (you can subscribe to it) AND an **Observer** (you can push values into it). It is the bridge between the "reactive" world and the regular imperative world.

```ts
import { Subject } from 'rxjs';

// Create a Subject that emits strings
const clicks$ = new Subject<string>();

// Subscribe BEFORE emitting values
clicks$.subscribe(val => console.log('Subscriber 1:', val));

// Push a value into the subject using .next()
clicks$.next('button-clicked');  // Subscriber 1: button-clicked
clicks$.next('link-clicked');    // Subscriber 1: link-clicked

// Subscribe AFTER some values have been emitted
clicks$.subscribe(val => console.log('Subscriber 2:', val));

clicks$.next('icon-clicked');
// Subscriber 1: icon-clicked
// Subscriber 2: icon-clicked
// (Subscriber 2 missed the first two emissions — it wasn't subscribed yet)
```

The key limitation of `Subject`: **late subscribers miss past values**.

---

### What Is a BehaviorSubject?

A **BehaviorSubject** is a special kind of Subject that:

1. **Requires an initial value** when created
2. **Always holds the most recent value** (called the "current value")
3. **Immediately emits the current value** to any new subscriber

```ts
import { BehaviorSubject } from 'rxjs';

// BehaviorSubject MUST be given an initial value
// Here the initial cart count is 0
const cartCount$ = new BehaviorSubject<number>(0);

// Subscribe — immediately receives the current value (0)
cartCount$.subscribe(count => console.log('Count:', count));
// Output: Count: 0   ← immediately gets the current value

// Push a new value
cartCount$.next(3);
// Output: Count: 3

// Later subscriber also gets the current value immediately
cartCount$.subscribe(count => console.log('Late subscriber:', count));
// Output: Late subscriber: 3   ← gets current value, NOT 0
```

---

### Subject vs BehaviorSubject Comparison

```
SUBJECT:                              BEHAVIORSUBJECT:
────────                              ────────────────
Created with:  new Subject<T>()       Created with: new BehaviorSubject<T>(initialValue)
Initial value: ❌ None                Initial value: ✅ Required
Current value: ❌ Not stored          Current value: ✅ Always stored
Late subscribers: miss past values    Late subscribers: get current value immediately
.getValue():   ❌ Not available       .getValue(): ✅ Synchronously reads current value
Use for:       Events (fire & forget) Use for: State (what is the current state?)


Example use cases:
Subject         → button clicks, form submissions, transient notifications
BehaviorSubject → cart items, current user, selected theme, loading state
```

---

### Getting the Value Synchronously

`BehaviorSubject` has a `.getValue()` method that returns the **current value synchronously** (without subscribing):

```ts
const cartCount$ = new BehaviorSubject<number>(0);

cartCount$.next(5);

// Synchronously read the current value — no subscription needed
const currentCount = cartCount$.getValue(); // returns 5 immediately
console.log(currentCount); // 5
```

> [!WARNING]
> Use `.getValue()` sparingly. It is not "reactive" — reading a value once doesn't mean you'll be notified when it changes. Prefer subscribing or using `toSignal()` for reactive updates.

---

### Section Recap

- A **Subject** can both emit values (observer) and be subscribed to (observable)
- A **Subject** does not replay past values to late subscribers
- A **BehaviorSubject** always has a **current value** and replays it to new subscribers
- Use **BehaviorSubject** for state; use **Subject** for transient events
- `.getValue()` synchronously reads the current value of a BehaviorSubject

---

## BehaviorSubject as a State Container

### Building a Cart Service with BehaviorSubject

This is where it all comes together. A `BehaviorSubject` is the perfect tool for managing shared state in an Angular service:

```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators'; // 'map' transforms Observable emissions

// Define the shape of a cart item
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root' // singleton — one cart for the whole app
})
export class CartService {

  // PRIVATE BehaviorSubject — only THIS service can push new values
  // It starts with an empty array (no items in cart)
  // The underscore prefix (_) is a naming convention for the "private source"
  private _items$ = new BehaviorSubject<CartItem[]>([]);

  // PUBLIC Observable — components can subscribe to it (READ-ONLY)
  // We expose the BehaviorSubject AS an Observable so external code
  // can listen but cannot call .next() and mutate state directly
  readonly items$ = this._items$.asObservable();

  // Derived Observable: automatically recalculates when items change
  // 'map' transforms each CartItem[] emission into a total number
  readonly totalPrice$ = this._items$.pipe(
    map(items =>
      // reduce iterates over every item and sums up price × quantity
      items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    )
  );

  // Derived Observable: count of distinct items in cart
  readonly itemCount$ = this._items$.pipe(
    map(items =>
      items.reduce((total, item) => total + item.quantity, 0)
    )
  );

  /**
   * Adds a product to the cart. If it already exists, increments quantity.
   */
  addItem(product: { id: number; name: string; price: number }): void {
    // Get the current list of items synchronously
    const currentItems = this._items$.getValue();

    // Check if this product is already in the cart
    const existingItem = currentItems.find(item => item.id === product.id);

    let newItems: CartItem[];

    if (existingItem) {
      // Product already in cart — create a new array with updated quantity
      // We use .map() to avoid mutating the existing array (immutability!)
      newItems = currentItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 } // spread + override quantity
          : item // leave other items unchanged
      );
    } else {
      // New product — add it with quantity 1
      newItems = [...currentItems, { ...product, quantity: 1 }];
    }

    // Push the new array into the BehaviorSubject — all subscribers are notified
    this._items$.next(newItems);
  }

  /**
   * Removes one unit of an item. If quantity reaches 0, removes it entirely.
   */
  removeItem(productId: number): void {
    const currentItems = this._items$.getValue();

    const newItems = currentItems
      .map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 } // decrement
          : item
      )
      .filter(item => item.quantity > 0); // remove items with 0 quantity

    this._items$.next(newItems);
  }

  /**
   * Empties the cart completely.
   */
  clearCart(): void {
    this._items$.next([]); // push an empty array — cart is now empty
  }

  /**
   * Returns the current items synchronously (useful for form submission etc.)
   */
  getSnapshot(): CartItem[] {
    return this._items$.getValue();
  }

}
```

---

### Using the Cart Service in a Component

```ts
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common'; // needed to use | async in templates
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe], // AsyncPipe is needed for the 'async' pipe in template

  template: `
    <h2>Your Cart</h2>

    <!-- The 'async' pipe subscribes to items$ automatically
         and also UNSUBSCRIBES automatically when the component is destroyed -->
    @if ((cartService.items$ | async) as items) {
      @for (item of items; track item.id) {
        <div class="cart-item">
          <span>{{ item.name }}</span>
          <span>Qty: {{ item.quantity }}</span>
          <span>{{ item.price * item.quantity | currency }}</span>

          <!-- Call service methods directly from the template -->
          <button (click)="cartService.removeItem(item.id)">−</button>
        </div>
      }

      <div class="cart-total">
        <!-- async pipe on totalPrice$ gives us the latest total -->
        Total: {{ cartService.totalPrice$ | async | currency }}
      </div>

      <button (click)="cartService.clearCart()">Clear Cart</button>
    }
  `
})
export class CartComponent {
  // We make it 'protected' so the template can access it
  // (Templates can't access 'private' members)
  protected cartService = inject(CartService);
}
```

---

### The Immutability Principle

> [!IMPORTANT]
> Notice that we **never mutate** existing arrays. Instead, we always create **new arrays** with `.map()`, spread (`...`), and `.filter()`. This is the **immutability principle** and it's critical for correct reactive behaviour.
>
> If you mutate the existing array (e.g., `currentItems.push(item)`) the BehaviorSubject's `.next()` call won't trigger change detection properly because the array **reference** hasn't changed — Angular sees the same object.

```ts
// ❌ WRONG — mutates existing array, may not trigger updates
addItem(product: CartItem): void {
  const items = this._items$.getValue();
  items.push(product);         // mutating the existing array!
  this._items$.next(items);    // same reference — Angular might not detect change
}

// ✅ CORRECT — creates a new array, always triggers updates
addItem(product: CartItem): void {
  const items = this._items$.getValue();
  this._items$.next([...items, product]); // new array reference — always detected
}
```

---

### Section Recap

- Store state in a **private** `BehaviorSubject` — only the service can change it
- Expose a **public** `Observable` (via `.asObservable()`) for read-only access by components
- Use **derived Observables** with `pipe(map(...))` for computed values
- **Never mutate** existing arrays — always create new ones
- Use `.getValue()` when you need the current value synchronously (e.g., before calling `.next()`)

---

## `toSignal()` — Bridging RxJS and Angular Signals

### What Is the Problem?

Angular introduced **Signals** as a simpler, more efficient reactivity system. Signals are synchronous and don't need subscription management. But we often have existing Observables (like our BehaviorSubject streams) that we want to use in our templates.

`toSignal()` converts an Observable into a Signal — giving us the best of both worlds.

---

### Why `toSignal()` Is Useful

```ts
// WITHOUT toSignal — using the async pipe
// Verbose template syntax, separate pipe needed
template: `{{ (items$ | async)?.length }}`

// WITH toSignal — using a Signal
// Clean, simple template access — just like a regular property
template: `{{ items().length }}`
```

---

### Basic Usage of `toSignal()`

```ts
import { Component, inject } from '@angular/core';
// toSignal is imported from the interop package, not core
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-badge',
  template: `
    <!-- Call the signal like a function — no | async needed -->
    <span class="badge">{{ itemCount() }}</span>
  `
})
export class CartBadgeComponent {

  private cartService = inject(CartService);

  // toSignal() subscribes to the Observable and wraps it as a Signal
  // The Signal automatically updates whenever the Observable emits
  protected itemCount = toSignal(
    this.cartService.itemCount$,  // the Observable to convert
    { initialValue: 0 }           // value to use before first emission
  );
  //                              ↑
  // If your Observable might not emit synchronously, provide an initialValue
  // Otherwise the Signal's type will include 'undefined'

}
```

---

### The `initialValue` Option

> [!IMPORTANT]
> **Why `initialValue` matters:** If your Observable doesn't emit a value synchronously (e.g., HTTP requests), the Signal starts as `undefined`. This can cause template errors if you try to access properties on it.

```ts
// Observable that emits async (e.g., HTTP):
const products$ = http.get<Product[]>('/api/products');

// Without initialValue — type is Signal<Product[] | undefined>
const products = toSignal(products$);
// Accessing products() before data arrives → undefined → potential errors!

// With initialValue — type is Signal<Product[]>
const products = toSignal(products$, { initialValue: [] as Product[] });
// Accessing products() before data arrives → [] → safe!
```

---

### Why `toSignal()` Requires an Injection Context

`toSignal()` internally calls `inject(DestroyRef)` to automatically clean up the subscription when the component is destroyed. Because `inject()` requires an injection context, **`toSignal()` must also be called in an injection context**.

```ts
@Component({ ... })
export class MyComponent {
  // ✅ VALID — field initialiser is in injection context
  protected items = toSignal(this.items$, { initialValue: [] });

  constructor() {
    // ✅ VALID — constructor is in injection context
    const count = toSignal(this.count$, { initialValue: 0 });
  }

  ngOnInit() {
    // ❌ INVALID — lifecycle hooks are outside injection context
    // This will throw an error!
    const data = toSignal(this.data$);
  }
}
```

---

### Using Signals in Templates

Once you have a Signal, use it in the template by **calling it like a function** (with parentheses):

```html
<!-- Signal usage — call it like a function -->
<p>Items in cart: {{ itemCount() }}</p>

<!-- Observable usage with async pipe (older style) -->
<p>Items in cart: {{ itemCount$ | async }}</p>

<!-- Signals also work with control flow -->
@if (itemCount() > 0) {
  <span class="badge">{{ itemCount() }}</span>
}
```

---

### Full Example: Service + `toSignal()` + Template

```ts
// product-list.component.ts
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `
    <div class="product-grid">
      <!-- products() reads the current Signal value -->
      @for (product of products(); track product.id) {
        <div class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.price | currency }}</p>

          <button (click)="addToCart(product)">
            Add to Cart
          </button>
        </div>
      }

      <!-- Show loading state if no products yet -->
      @if (products().length === 0) {
        <p>Loading products...</p>
      }
    </div>
  `
})
export class ProductListComponent {

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Convert the products Observable to a Signal with empty array as initial value
  protected products = toSignal(
    this.productService.products$,
    { initialValue: [] }
  );

  protected addToCart(product: any): void {
    this.cartService.addItem(product);
  }

}
```

---

### Section Recap

- `toSignal()` converts an **Observable into a Signal** for cleaner template usage
- Import it from `@angular/core/rxjs-interop`
- Always provide an **`initialValue`** for Observables that don't emit synchronously
- `toSignal()` must be called in an **injection context** (field initialiser or constructor)
- Call a Signal in the template with `()` parentheses — no `async` pipe needed

---

## Automatic Subscription Cleanup

### Why Subscription Cleanup Matters

Every time you call `.subscribe()` on an Observable, you create a connection. If you don't break that connection when you're done, the subscriber keeps receiving emissions even after the component is destroyed.

This is a **memory leak** — the destroyed component stays in memory because the Observable still holds a reference to it.

```
Component Destroyed
    ↓
[ Component Object still in memory because Observable still references it ]
    ↓
User navigates to this route 5 more times
    ↓
5 more component instances in memory, all subscribing to the same Observable
    ↓
Browser slows down, memory grows continuously → MEMORY LEAK
```

---

### Option 1: Using the `async` Pipe (Automatic)

The simplest way to avoid memory leaks is to use the `async` pipe in templates. Angular manages the subscription and automatically unsubscribes when the component is destroyed:

```html
<!-- Angular subscribes when this renders and unsubscribes when component is destroyed -->
<p>{{ items$ | async | json }}</p>
```

---

### Option 2: `toSignal()` (Automatic)

As we saw earlier, `toSignal()` automatically cleans up its subscription when the component is destroyed. If you use `toSignal()`, you don't need to worry about cleanup at all.

---

### Option 3: `takeUntilDestroyed()` Operator

When you need to subscribe manually (e.g., to react to emissions with side effects), use `takeUntilDestroyed()`:

```ts
import { Component, inject, OnInit } from '@angular/core';
// takeUntilDestroyed comes from the rxjs-interop package
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../services/cart.service';

@Component({ ... })
export class CartSummaryComponent {

  private cartService = inject(CartService);

  constructor() {
    // takeUntilDestroyed() must be called in an injection context
    // It gets a reference to DestroyRef automatically via inject()
    this.cartService.items$
      .pipe(
        takeUntilDestroyed() // ← automatically completes this subscription
      )                       //   when the component is destroyed
      .subscribe(items => {
        // Do something reactive with the items
        console.log('Cart updated, items count:', items.length);

        // Example: save to localStorage on every cart change
        localStorage.setItem('cart', JSON.stringify(items));
      });
  }

}
```

---

### Option 4: `DestroyRef` for Cleanup Outside Constructor

Sometimes you need to set up subscriptions in a method called from `ngOnInit` or elsewhere outside the constructor. You can inject `DestroyRef` and use it manually:

```ts
import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ ... })
export class MyComponent implements OnInit {

  private destroyRef = inject(DestroyRef); // inject in field initialiser (valid context)
  private cartService = inject(CartService);

  ngOnInit(): void {
    // Now we can use takeUntilDestroyed with the destroyRef we captured earlier
    this.cartService.items$
      .pipe(
        takeUntilDestroyed(this.destroyRef) // pass the DestroyRef explicitly
      )
      .subscribe(items => {
        console.log('Items changed:', items);
      });
  }

}
```

> [!NOTE]
> `takeUntilDestroyed()` without an argument captures `DestroyRef` via `inject()` internally. When called **outside** an injection context (like in `ngOnInit`), you must pass the `DestroyRef` explicitly as shown above.

---

### The Old Manual Way (for Reference Only)

Before these modern utilities existed, developers had to unsubscribe manually:

```ts
// ❌ OLD APPROACH — shown for historical reference, avoid in modern Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({ ... })
export class OldStyleComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    // Manually track each subscription
    this.subscription.add(
      someObservable$.subscribe(val => console.log(val))
    );
  }

  // Must implement OnDestroy and manually clean up!
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // easy to forget!
  }

}

// ✅ MODERN APPROACH — use toSignal() or takeUntilDestroyed()
// No ngOnDestroy needed — cleanup is automatic
```

---

### Section Recap

- **Not unsubscribing causes memory leaks** — destroyed components stay in memory
- The `async` pipe unsubscribes automatically when the component is destroyed
- `toSignal()` also automatically cleans up subscriptions
- `takeUntilDestroyed()` is the go-to operator for manual subscriptions
- Inject `DestroyRef` explicitly when you need cleanup outside an injection context
- Avoid the old `ngOnDestroy` + manual `Subscription` pattern in modern Angular

---

## Dependency Injection in Tests

### Why Test DI?

When unit testing a component or service, you usually don't want to use the **real** implementation of dependencies. For example:

- You don't want real HTTP calls in unit tests (slow, brittle, requires a server)
- You don't want real analytics calls (they would pollute your analytics data)
- You want to control what data the service returns (so you can test specific scenarios)

Angular's **`TestBed`** provides a testing environment that mirrors the DI system, letting you swap real services with **mock versions**.

---

### Basic Test Setup with `TestBed.inject()`

```ts
// cart.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {

  // 'service' will hold the instance we're testing
  let service: CartService;

  beforeEach(() => {
    // TestBed.configureTestingModule() sets up a mini Angular environment
    TestBed.configureTestingModule({
      // We don't need any special providers here because CartService
      // uses providedIn: 'root' and has no complex dependencies
    });

    // TestBed.inject() is the testing equivalent of inject() in a component
    // It asks the testing injector for an instance of CartService
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    // Jasmine 'expect' assertion — the service should exist
    expect(service).toBeTruthy();
  });

  it('should start with an empty cart', (done) => {
    // Subscribe to the items$ Observable and check the initial value
    service.items$.subscribe(items => {
      expect(items.length).toBe(0); // cart should be empty initially
      done(); // tell Jasmine the async test is complete
    });
  });

  it('should add an item to the cart', (done) => {
    const mockProduct = { id: 1, name: 'Test Product', price: 9.99 };

    // Call the service method we want to test
    service.addItem(mockProduct);

    service.items$.subscribe(items => {
      expect(items.length).toBe(1);                    // one item in cart
      expect(items[0].name).toBe('Test Product');      // correct name
      expect(items[0].quantity).toBe(1);               // quantity starts at 1
      done();
    });
  });

  it('should increment quantity when same item added twice', (done) => {
    const mockProduct = { id: 1, name: 'Widget', price: 5.00 };

    service.addItem(mockProduct);
    service.addItem(mockProduct); // add same product again

    service.items$.subscribe(items => {
      expect(items.length).toBe(1);       // still one unique item
      expect(items[0].quantity).toBe(2);  // but quantity is 2
      done();
    });
  });

});
```

---

### Testing with Mock Services

```ts
// component-with-service.spec.ts
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs'; // 'of' creates an Observable that emits given values
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';

// Create a mock — a fake version of ProductService that we control
const mockProductService = {
  products$: of([                          // 'of' creates a test Observable
    { id: 1, name: 'Widget', price: 9.99 },
    { id: 2, name: 'Gadget', price: 19.99 }
  ])
};

describe('ProductListComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],      // import the standalone component

      providers: [
        {
          provide: ProductService,          // "when someone asks for ProductService..."
          useValue: mockProductService      // "...give them our mock instead"
        }
      ]
    }).compileComponents();
  });

  it('should display products from the service', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges(); // trigger change detection

    const compiled = fixture.nativeElement as HTMLElement;

    // Check that the mock products appear in the rendered HTML
    expect(compiled.textContent).toContain('Widget');
    expect(compiled.textContent).toContain('Gadget');
  });

});
```

---

### Section Recap

- `TestBed.inject()` is the testing equivalent of `inject()` — it asks the test injector for a service
- Use `providers: [{ provide: RealService, useValue: mockService }]` to swap dependencies with mocks
- Mocks let you **control inputs** and **verify outputs** without real side effects
- Always test that the service works correctly before testing components that use it

---

## Lab 1 — Logging Service with Configurable Providers

**Duration:** ~30 minutes  
**Goal:** Build a `LoggerService` that supports different log levels and is configurable via an `InjectionToken`.

---

### Lab 1 Requirements

**Part A: Basic Logger**

1. Generate a new service: `ng generate service core/logger`
2. Add a `log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void` method
3. Store a `private history: string[]` array of all log entries
4. Expose a `getHistory(): string[]` method that returns a copy
5. Inject the service into `AppComponent` and log a message in the constructor

**Part B: Configurable Log Level**

6. Create an `InjectionToken<'info' | 'warn' | 'error'>` called `LOG_LEVEL`
7. Register it in `app.config.ts` with `useValue: 'info'`
8. Inject `LOG_LEVEL` into `LoggerService`
9. Modify the `log()` method to only print messages at or above the configured level
   - `'error'` only prints errors
   - `'warn'` prints warnings and errors
   - `'info'` prints everything

**Part C: Bonus**

10. Create a `LogViewerComponent` that injects `LoggerService` and displays the history
11. Use `toSignal()` to expose the history as a Signal (you'll need a `BehaviorSubject<string[]>` in the service)

---

### Lab 1 Starter Code

```ts
// src/app/core/log-level.token.ts
import { InjectionToken } from '@angular/core';

// Define the possible log levels
export type LogLevel = 'info' | 'warn' | 'error';

// Create the injection token
export const LOG_LEVEL = new InjectionToken<LogLevel>('LOG_LEVEL');
```

```ts
// src/app/core/logger.service.ts
import { Injectable, inject } from '@angular/core';
import { LOG_LEVEL, LogLevel } from './log-level.token';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  // Inject the configured log level
  private logLevel = inject(LOG_LEVEL);

  // TODO: Add history array and BehaviorSubject

  private shouldLog(level: LogLevel): boolean {
    // TODO: Implement logic to check if a given level should be logged
    // based on this.logLevel
    return true; // placeholder
  }

  log(message: string, level: LogLevel = 'info'): void {
    // TODO: Implement
  }

}
```

```ts
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LOG_LEVEL } from './core/log-level.token';

export const appConfig: ApplicationConfig = {
  providers: [
    // TODO: Add LOG_LEVEL provider here
    provideRouter([])
  ]
};
```

---

## Lab 2 — Generic CRUD Data Service with RxJS & Signals

**Duration:** ~40 minutes  
**Goal:** Create a reusable, generic service that manages a list of items and exposes them as both Observables and Signals.

---

### Lab 2 Requirements

**Part A: Create the Generic Service**

1. Generate: `ng generate service core/store`
2. Make `StoreService<T extends { id: number }>` a generic class
3. Use a private `BehaviorSubject<T[]>` to hold items
4. Expose:
   - `items$` — public Observable of all items
   - `count$` — derived Observable of item count
   - `add(item: T): void`
   - `update(id: number, changes: Partial<T>): void`
   - `remove(id: number): void`
   - `getById(id: number): T | undefined`

**Part B: Create a Product-Specific Service**

5. Generate: `ng generate service features/products/product`
6. Extend `StoreService<Product>` where `Product = { id: number; name: string; price: number; inStock: boolean }`
7. Add a `loadProducts(): void` method that adds 5 mock products

**Part C: Create a Component Using Signals**

8. Generate: `ng generate component features/products/product-list`
9. Inject `ProductService`
10. Use `toSignal()` to create `products` and `count` signals
11. Display products in a table; add buttons to remove items
12. Use `takeUntilDestroyed()` to log every item list change to the console

---

### Lab 2 Starter Code

```ts
// src/app/core/store.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// T must have an 'id' property of type number
// This constraint lets us use item.id to find and update items
@Injectable({
  providedIn: 'root'
})
export class StoreService<T extends { id: number }> {

  // Private source — only mutated through our methods
  private _items$ = new BehaviorSubject<T[]>([]);

  // Public read-only streams
  readonly items$ = this._items$.asObservable();
  readonly count$ = this._items$.pipe(map(items => items.length));

  add(item: T): void {
    const current = this._items$.getValue();
    this._items$.next([...current, item]);
  }

  update(id: number, changes: Partial<T>): void {
    const current = this._items$.getValue();
    this._items$.next(
      current.map(item =>
        item.id === id
          ? { ...item, ...changes } // merge changes into the matching item
          : item
      )
    );
  }

  remove(id: number): void {
    const current = this._items$.getValue();
    this._items$.next(
      current.filter(item => item.id !== id) // keep all items EXCEPT the one to remove
    );
  }

  getById(id: number): T | undefined {
    return this._items$.getValue().find(item => item.id === id);
  }

}
```

---

## Assignment — ShopAngular Project Part 5: Cart Service

**Project:** ShopAngular  
**Part:** 5 of 7  
**Due:** Next class  
**Estimated Time:** 2–3 hours

---

### Overview

In this assignment you will build a **fully functional Cart Service** for your ShopAngular project. This service will be the central state manager for the shopping cart, used by the navbar (item count badge), the product list (add to cart buttons), and the cart page (full cart view with checkout).

---

### Requirements

#### Requirement 1: Create the CartService

Generate the service and set it up as a singleton:

```bash
ng generate service features/cart/cart
```

- Place it in `src/app/features/cart/`
- Ensure it has `@Injectable({ providedIn: 'root' })`
- Define and export a `CartItem` interface with: `id`, `name`, `price`, `quantity`, `imageUrl`

> [!TIP]
> **Hint:** Export `CartItem` from the same file or from a separate `cart.types.ts` file. Keeping types alongside their service makes the code easier to find.

---

#### Requirement 2: Implement State with BehaviorSubject

Inside `CartService`:

- Add `private _items$ = new BehaviorSubject<CartItem[]>([])`
- Expose `readonly items$ = this._items$.asObservable()`
- Derive and expose:
  - `readonly totalPrice$` — sum of `price × quantity` for all items
  - `readonly itemCount$` — sum of all quantities

> [!TIP]
> **Hint:** Use `this._items$.pipe(map(items => items.reduce(...)))` for both derived streams. The `reduce` function is perfect for summing values across an array.

---

#### Requirement 3: Implement Cart Mutator Methods

Add these methods to `CartService`:

- `addItem(product: Omit<CartItem, 'quantity'>): void`
  - If item already in cart, increment quantity
  - If new item, add with `quantity: 1`
- `removeItem(id: number): void`
  - Decrement quantity; remove if quantity reaches 0
- `clearCart(): void`
  - Reset to empty array

> [!TIP]
> **Hint:** Always call `this._items$.getValue()` first to get the current state. Remember to never mutate the array — always create a new one with spread syntax or `.map()`.

---

#### Requirement 4: Connect to NavbarComponent

In your `NavbarComponent`:

- Inject `CartService`
- Use `toSignal(cartService.itemCount$, { initialValue: 0 })` to create an `itemCount` signal
- Display a badge that shows the count (hide it when count is 0)

```html
<!-- Example badge in navbar template -->
@if (itemCount() > 0) {
  <span class="cart-badge">{{ itemCount() }}</span>
}
```

> [!TIP]
> **Hint:** The badge should disappear when the cart is empty. Use `@if` with the signal value to conditionally render it.

---

#### Requirement 5: Connect to ProductListComponent

In your `ProductListComponent`:

- Add an "Add to Cart" button to each product card
- On click, call `cartService.addItem(product)`
- Show a brief visual feedback when item is added (e.g., button text changes to "Added ✓" for 2 seconds)

> [!TIP]
> **Hint for visual feedback:** Use a `Set<number>` to track which product IDs were recently added. On `addItem()`, add the ID to the set, then use `setTimeout(() => set.delete(id), 2000)` to remove it. Bind the button class to `addedIds.has(product.id)`.

---

#### Requirement 6: Build the CartPageComponent

Create `ng generate component features/cart/cart-page` with:

- A list of cart items (name, price, quantity, subtotal, remove button)
- A cart summary (total items, total price)
- A "Clear Cart" button
- A "Proceed to Checkout" button (can be a placeholder for now)
- An empty state message when cart is empty

> [!TIP]
> **Hint:** Use `toSignal()` to convert `items$` and `totalPrice$` to signals. Access them in the template with `items()` and `totalPrice()`. Use `@for` with `track item.id` for efficient rendering.

---

#### Requirement 7: Persist Cart State

Modify `CartService` to persist and restore the cart from `localStorage`:

- On initialization, load any saved cart from `localStorage`
- Every time `_items$` changes, save the new state to `localStorage`

```ts
// Hint for localStorage initialization:
constructor() {
  const saved = localStorage.getItem('shopangular-cart');
  if (saved) {
    try {
      // JSON.parse might throw if the data is corrupted
      this._items$.next(JSON.parse(saved) as CartItem[]);
    } catch {
      localStorage.removeItem('shopangular-cart'); // clear bad data
    }
  }

  // Hint for saving — subscribe in the constructor:
  this._items$
    .pipe(takeUntilDestroyed()) // clean up when app is destroyed (rare but good practice)
    .subscribe(items => {
      localStorage.setItem('shopangular-cart', JSON.stringify(items));
    });
}
```

> [!WARNING]
> **Always wrap `JSON.parse` in a try-catch** when reading from localStorage. The data could be corrupted or from an older version of your app with a different structure.

---

### Submission Checklist

Before submitting, verify:

- [ ] `CartService` is a singleton (root-provided)
- [ ] `CartItem` interface is exported and used consistently
- [ ] Cart state is managed with a private `BehaviorSubject`
- [ ] Components access state via the public `Observable` or `toSignal()` Signals
- [ ] All cart mutations create **new arrays** (immutability respected)
- [ ] NavBar shows the item count badge using a Signal
- [ ] Products page has working "Add to Cart" functionality
- [ ] Cart page shows all items, totals, and a clear button
- [ ] Cart persists across page refreshes (localStorage)
- [ ] No memory leaks (all subscriptions use `async` pipe, `toSignal()`, or `takeUntilDestroyed()`)

---

## Key Takeaways

1. **Services are shared, components are local.** Put anything that two or more components need into a service.

2. **`@Injectable({ providedIn: 'root' })` creates a singleton.** One instance, shared everywhere, lazy-created, tree-shakable.

3. **Angular has a tree of injectors.** Dependency resolution walks bottom-up from the requesting component to the root.

4. **Use `inject()` over constructor injection** for cleaner, more flexible code in modern Angular.

5. **`InjectionToken<T>` is the answer when interfaces aren't enough.** TypeScript interfaces disappear at runtime; tokens don't.

6. **`BehaviorSubject` is your best friend for shared state.** Private source, public observable, derived streams for computed values.

7. **Never mutate arrays in state management.** Always create new arrays to ensure change detection works correctly.

8. **`toSignal()` bridges the RxJS and Signals worlds.** Use it to write clean, pipe-free templates.

9. **Always clean up subscriptions.** Use `async` pipe, `toSignal()`, or `takeUntilDestroyed()` — never leak memory.

10. **`TestBed.inject()` is `inject()` for tests.** Mock your dependencies with `useValue` to isolate what you're testing.

---

## Resources

### Official Documentation

- [Angular Services & DI Guide](https://angular.dev/guide/di) — Official Angular DI docs
- [Angular `inject()` API](https://angular.dev/api/core/inject) — Full API reference
- [Angular Signals](https://angular.dev/guide/signals) — Signal system overview
- [toSignal API](https://angular.dev/api/core/rxjs-interop/toSignal) — RxJS interop docs
- [takeUntilDestroyed](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed) — Cleanup operator
- [RxJS Documentation](https://rxjs.dev/) — Full RxJS reference
- [BehaviorSubject API](https://rxjs.dev/api/index/class/BehaviorSubject) — BehaviorSubject docs

### Recommended Reading

- [Angular University: RxJS Patterns](https://blog.angular-university.io/rxjs-higher-order-mapping/) — Advanced RxJS patterns
- [Angular Dependency Injection in Depth](https://angular.dev/guide/di/dependency-injection-providers) — Provider types explained
- [InjectionToken patterns](https://angular.dev/guide/di/dependency-injection-providers#using-an-injectiontoken-object) — Official token guide

### Tools

- [Angular DevTools](https://angular.dev/tools/devtools) — Browser extension to inspect component tree and injectors
- [RxJS Marbles Visualizer](https://rxmarbles.com/) — Visual tool for understanding RxJS operators

---

## Common Mistakes & How to Avoid Them

| # | Mistake | Why It's a Problem | How to Avoid It |
|---|---------|-------------------|-----------------|
| 1 | Calling `inject()` inside `ngOnInit` or `ngAfterViewInit` | `inject()` requires an injection context. Lifecycle hooks run after DI is complete. | Only call `inject()` at field initialisation time or inside the constructor. |
| 2 | Mutating a BehaviorSubject's array directly (`items.push(...)`) | Same array reference → Angular doesn't detect the change. | Always spread (`[...items, newItem]`) or use `.map()`/`.filter()` to create new arrays. |
| 3 | Exposing a BehaviorSubject publicly (`public items$ = new BehaviorSubject(...)`) | External code can call `.next()` and corrupt state unpredictably. | Keep BehaviorSubject private (`private _items$`) and expose only `.asObservable()`. |
| 4 | Not providing `initialValue` to `toSignal()` | Signal type becomes `T \| undefined`. Accessing properties on `undefined` causes errors. | Always provide `{ initialValue: [] }` (or appropriate default) for async Observables. |
| 5 | Forgetting `async` pipe or `toSignal()` — subscribing manually without cleanup | Memory leaks — destroyed components stay in memory, causing performance degradation. | Always use `async` pipe, `toSignal()`, or `takeUntilDestroyed()` for subscription management. |
| 6 | Using a TypeScript interface as an injection token | Interfaces are erased at runtime — Angular can't look them up in the injector. | Use `InjectionToken<InterfaceType>` instead of the interface itself as the token. |
| 7 | Calling `toSignal()` outside an injection context | `toSignal()` calls `inject(DestroyRef)` internally — requires injection context. | Call `toSignal()` at field initialiser level or in the constructor. |
| 8 | Adding `providedIn: 'root'` AND listing the service in a `providers` array | The `providers` array will create a second, separate instance of the service. | Don't double-register. Use either `providedIn: 'root'` OR a `providers` array — not both. |
| 9 | Not wrapping `JSON.parse(localStorage...)` in try-catch | Corrupted or outdated data causes an unhandled exception that crashes the app. | Always use `try-catch` when parsing external data (localStorage, URL params, etc.). |
| 10 | Using `Subject` instead of `BehaviorSubject` for state | Late subscribers (e.g., components that load after the first emission) miss the current state. | Use `BehaviorSubject` for state; use `Subject` only for transient events. |
| 11 | Calling `getValue()` everywhere instead of subscribing | `getValue()` is a snapshot — you won't be notified of future changes. | Subscribe or use `toSignal()` for reactive updates; use `getValue()` only for one-time reads before a `.next()` call. |
| 12 | Creating a large service that does too many unrelated things | Violates Single Responsibility Principle; hard to test and maintain. | Split services by domain: `CartService`, `AuthService`, `ProductService` — not one giant `AppService`. |