# Lecture 32 — Angular Testing, Performance & Deployment

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain what automated testing is and why it matters
- Write unit tests with Vitest using Angular's `TestBed`
- Test signal `input()` and `output()` in isolated component tests
- Mock HTTP calls in service tests using `HttpTestingController`
- Optimise rendering performance with `ChangeDetectionStrategy.OnPush`
- Defer loading of heavy components with Angular's `@defer` blocks
- Understand Server-Side Rendering (SSR) and Static Site Generation (SSG)
- Build a production bundle with `ng build` and deploy an Angular SPA

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Why we test — the fundamentals of automated testing
2. Vitest: Angular's default test runner
3. Unit testing components: `TestBed`, signal inputs/outputs
4. Testing services: `HttpTestingController`
5. Performance: OnPush change detection strategy
6. Performance: `@defer` blocks for lazy loading
7. SSR & SSG with Angular
8. Production builds & deployment

### Part 2 — Practice / Lab (~90–120 min)
1. Unit tests for a signal-based counter component
2. Implement `@defer` for a heavy component
3. ShopAngular Project Part 10: Performance & Deployment

---

## 1. Why We Test — The Fundamentals

### Plain-English Explanation

Imagine you are building a bridge. Before opening it to traffic, you run load tests: apply pressure, shake it, freeze it in winter conditions. You want **confidence** that the bridge won't fail under real-world conditions.

Automated tests do exactly the same thing for your code. They are small programs that verify your code does what you expect — automatically, every time you make a change.

### The Three Types of Tests

```
                    ┌─────────────────────────────────┐
                    │         E2E Tests               │  ← fewest, slowest, most like real users
                    │   (Full app in a real browser)  │
                    │         e.g., Cypress           │
                    ├─────────────────────────────────┤
                    │      Integration Tests          │
                    │   (Multiple units together)     │
                    │       e.g., TestBed             │
                    ├─────────────────────────────────┤
                    │         Unit Tests              │  ← most, fastest, most targeted
                    │   (One component or service)    │
                    │        e.g., Vitest             │
                    └─────────────────────────────────┘
```

- **Unit tests** — test a single function, component, or service in isolation
- **Integration tests** — test how multiple units work together
- **End-to-End (E2E) tests** — simulate real user interactions in a real browser

This lecture focuses on **unit and integration testing** with Angular's testing tools.

### Why Does This Matter?

> [!NOTE]
> Testing is not optional in professional development. It protects you from regression bugs (things that used to work but break after a code change), documents intended behaviour, and gives your team confidence to refactor code safely.

### The Testing Pyramid

In practice, you want many unit tests (fast, cheap), fewer integration tests, and the fewest E2E tests (slow, expensive to maintain).

```
                    ▲
                   /E2E\          ← 5–10% of your tests
                  /─────\
                 / Integ  \       ← 20–30% of your tests
                /──────────\
               / Unit Tests  \    ← 60–70% of your tests
              /--------------\
```

---

## 2. Vitest — Angular's Default Test Runner

### What is Vitest?

Angular replaces the old Karma + Jasmine testing stack with **Vitest** — a blazing-fast, modern test runner. It uses the same config as your Angular app, starts almost instantly, and provides excellent developer experience with watch mode.

### Why Vitest Over Karma?

Karma was the traditional Angular test runner. It required spinning up a real browser for every test run, which was slow. Vitest runs tests in a Node.js environment (using jsdom to simulate the browser), making test startup time near-instant.

### Running Tests

```bash
# Run all tests once
ng test

# Run in watch mode (re-runs on file changes)
ng test --watch

# Run with coverage report
ng test --coverage
```

### Vitest Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

// describe() groups related tests together
describe('MyFeature', () => {
  // This runs before EACH test in this describe block
  beforeEach(() => {
    // Setup code — create fresh instances, reset state
  });

  it('should do something specific', () => {
    // ARRANGE — set up the scenario
    const input = 5;

    // ACT — do the thing you're testing
    const result = input * 2;

    // ASSERT — verify the expected outcome
    expect(result).toBe(10);
  });
});
```

> [!TIP]
> Write tests following the **AAA pattern**: **A**rrange (set up data), **A**ct (call the function), **A**ssert (check the result). This makes tests readable and self-documenting.

---

## 3. Unit Testing Components with TestBed

### What is TestBed?

`TestBed` is Angular's testing utility that creates a mini Angular module for your test environment. It lets you:
- Instantiate components in a testing context
- Inject services (or mock versions of them)
- Trigger change detection
- Query the rendered DOM

Think of `TestBed` as a controlled sandbox — a small, isolated version of your Angular app where you control exactly what's available.

### Basic Component Test

Let's test a simple counter component:

```typescript
// counter.component.ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div class="counter">
      <!-- data-testid makes elements easy to find in tests without relying on CSS classes -->
      <p data-testid="count-display">Count: {{ count() }}</p>
      <button (click)="increment()" data-testid="increment-btn">+</button>
      <button (click)="decrement()" data-testid="decrement-btn">-</button>
      <button (click)="reset()"     data-testid="reset-btn">Reset</button>
    </div>
  `
})
export class CounterComponent {
  count = signal(0);

  increment(): void { this.count.update(n => n + 1); }
  decrement(): void { this.count.update(n => n - 1); }
  reset(): void     { this.count.set(0); }
}
```

```typescript
// counter.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let fixture: ComponentFixture<CounterComponent>; // The testing wrapper
  let component: CounterComponent;                 // The actual component instance

  // beforeEach ensures a clean, fresh component for every single test
  beforeEach(async () => {
    // Configure the test module — for standalone components, just import the component
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents(); // Compiles the HTML template

    // Create a component instance inside the test environment
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    // Run initial Angular change detection to render the template
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start with a count of 0', () => {
    // Read the signal value using ()
    expect(component.count()).toBe(0);
  });

  it('should increment the count when + is clicked', () => {
    // ACT — find the button by data-testid and click it
    const btn = fixture.nativeElement.querySelector('[data-testid="increment-btn"]');
    btn.click();
    // Trigger Angular's change detection to re-render the template
    fixture.detectChanges();

    // ASSERT — both the signal value and the displayed text should update
    expect(component.count()).toBe(1);
    const display = fixture.nativeElement.querySelector('[data-testid="count-display"]');
    expect(display.textContent).toContain('Count: 1');
  });

  it('should decrement the count when - is clicked', () => {
    component.count.set(5);    // Start at 5
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('[data-testid="decrement-btn"]');
    btn.click();
    fixture.detectChanges();

    expect(component.count()).toBe(4);
  });

  it('should reset the count to 0', () => {
    component.count.set(99);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('[data-testid="reset-btn"]');
    btn.click();
    fixture.detectChanges();

    expect(component.count()).toBe(0);
  });
});
```

### Testing Signal Inputs and Outputs

```typescript
// rating.component.ts
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-rating',
  standalone: true,
  template: `
    <div class="stars">
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <button
          [class.filled]="star <= currentRating()"
          (click)="rate(star)"
          [attr.data-testid]="'star-' + star"
        >★</button>
      }
    </div>
  `
})
export class RatingComponent {
  currentRating = input<number>(0);      // Signal input from parent
  ratingChange  = output<number>();      // Event emitted to parent
  
  rate(stars: number): void {
    this.ratingChange.emit(stars);
  }
}
```

```typescript
// rating.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  let fixture: ComponentFixture<RatingComponent>;
  let component: RatingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display 5 stars', () => {
    const stars = fixture.nativeElement.querySelectorAll('button');
    expect(stars.length).toBe(5);
  });

  it('should show filled stars up to currentRating', () => {
    // componentRef.setInput() is THE CORRECT way to set signal inputs in tests
    // Do NOT try: component.currentRating = 3  ← this will not work
    fixture.componentRef.setInput('currentRating', 3);
    fixture.detectChanges();

    // Stars 1, 2, 3 should be filled
    const star3 = fixture.nativeElement.querySelector('[data-testid="star-3"]');
    expect(star3.classList).toContain('filled');

    // Star 4 should NOT be filled
    const star4 = fixture.nativeElement.querySelector('[data-testid="star-4"]');
    expect(star4.classList).not.toContain('filled');
  });

  it('should emit the selected rating when a star is clicked', () => {
    let emittedValue: number | undefined;
    // Subscribe to the output to capture emitted values
    component.ratingChange.subscribe((val: number) => {
      emittedValue = val;
    });

    // Click the 4th star
    const star4 = fixture.nativeElement.querySelector('[data-testid="star-4"]');
    star4.click();

    expect(emittedValue).toBe(4);
  });
});
```

> [!IMPORTANT]
> **Always use `fixture.componentRef.setInput('name', value)`** to set signal inputs in tests. Signal inputs are read-only — you cannot assign to them directly.

### Common Mistakes in Component Testing

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Forgetting `fixture.detectChanges()` | Template doesn't reflect changes | Call `detectChanges()` after setup and after every action |
| Directly assigning signal inputs | TypeScript/runtime error | Use `fixture.componentRef.setInput('name', value)` |
| Not importing required modules in TestBed | Component fails to render | Mirror the component's `imports` in `configureTestingModule` |
| Testing only the class, not the DOM | Missing template bugs | Also assert on `fixture.nativeElement` content |

---

## 4. Testing Services with HttpTestingController

### Why Mock HTTP Calls?

Real HTTP calls in tests are a problem because they are slow, unreliable, and depend on external servers being available. Angular's `HttpTestingController` intercepts HTTP calls and lets you respond with mock data, keeping tests fast and deterministic.

### Step-by-Step Service Test

```typescript
// user.service.ts — the service we'll test
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User { id: number; name: string; email: string; }

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  create(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
```

```typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserService, User } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController; // This intercepts HTTP calls

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),           // Real HttpClient (with mocked transport)
        provideHttpClientTesting(),    // Installs the mock transport layer
        UserService,
      ],
    });

    service  = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Verify no unexpected requests were made after each test
  afterEach(() => httpMock.verify());

  it('should fetch all users', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob',   email: 'bob@example.com' },
    ];

    // STEP 1: Trigger the service call
    let actualUsers: User[] | undefined;
    service.getAll().subscribe(users => { actualUsers = users; });

    // STEP 2: Intercept and inspect the request
    // expectOne() asserts exactly ONE request was made to this URL
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');

    // STEP 3: Respond with mock data (triggers the Observable to emit)
    req.flush(mockUsers);

    // STEP 4: Assert the correct data was received
    expect(actualUsers).toEqual(mockUsers);
    expect(actualUsers?.length).toBe(2);
  });

  it('should POST to create a user', () => {
    const newUser = { name: 'Carol', email: 'carol@example.com' };
    const mockResponse: User = { id: 3, ...newUser };

    let createdUser: User | undefined;
    service.create(newUser).subscribe(user => { createdUser = user; });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    // Verify the correct data was sent in the request body
    expect(req.request.body).toEqual(newUser);

    req.flush(mockResponse);
    expect(createdUser?.id).toBe(3);
  });

  it('should handle 404 errors', () => {
    let errorOccurred = false;

    service.getAll().subscribe({
      next: () => {},
      error: () => { errorOccurred = true; }
    });

    const req = httpMock.expectOne('/api/users');
    // Flush with an error status to simulate a server error
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(errorOccurred).toBe(true);
  });
});
```

### Section Recap
- `provideHttpClientTesting()` installs a mock HTTP transport layer
- `httpMock.expectOne(url)` intercepts the request AND asserts exactly one was made to that URL
- `req.flush(data)` simulates the server responding with data
- `req.flush(msg, { status: 404 })` simulates error responses
- Always call `httpMock.verify()` in `afterEach` to catch unexpected requests

---

## 5. Performance Optimization

### 5.1 OnPush Change Detection

### How Angular's Default Change Detection Works

By default, Angular re-checks a component's template for changes whenever **anything happens** in the application: user events, `setTimeout` callbacks, HTTP responses. This is safe but can be slow in large apps with many components.

**Analogy:** Default change detection is like a shop assistant who checks every shelf in the store every time one customer makes a purchase — safe but exhausting at scale.

`ChangeDetectionStrategy.OnPush` tells Angular: "Only re-check this component when one of these specific things happen":
1. An `@Input` or signal `input()` reference changes
2. An event from *this* component (or its children) fires
3. A signal the template reads emits a new value
4. An Observable bound via `async` pipe emits

### OnPush with Signals

When you use Angular Signals inside a component, signals automatically integrate with OnPush. When a signal's value changes, Angular precisely marks only the affected components as needing a re-render.

```typescript
// product-card.component.ts
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Product {
  id: number; name: string; price: number; imageUrl: string; inStock: boolean;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  // OnPush: only re-render when the product signal input changes
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="product-card">
      <img [src]="product().imageUrl" [alt]="product().name">
      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency }}</p>
      @if (!product().inStock) {
        <span class="badge out-of-stock">Out of Stock</span>
      }
      <button [disabled]="!product().inStock">Add to Cart</button>
    </div>
  `
})
export class ProductCardComponent {
  // Signal input — type-safe, reactive, works perfectly with OnPush
  product = input.required<Product>();
}
```

> [!TIP]
> Always use `ChangeDetectionStrategy.OnPush` when you use Signals. This is Angular's recommended high-performance pattern. The combination means Angular only re-renders a component when its signal data actually changes — making large apps with many components extremely efficient.

### 5.2 `@defer` Blocks — Deferred Loading

### What is Deferred Loading?

When Angular builds your app, all components referenced in a template are bundled together and loaded immediately. For components below the fold or rarely accessed, this wastes initial load time.

`@defer` tells Angular: "Don't load this component's JavaScript until a trigger condition is met."

**Real-world analogy:** When you open a restaurant menu, you don't read every page at once. You start with starters. Only when you decide you want dessert do you flip to that section. `@defer` does the same — component code loads only when needed.

### `@defer` Syntax and Triggers

```html
<!-- 
  Structure of a @defer block:
  @defer (trigger)   → the lazy content
  @placeholder       → shown immediately (before trigger fires)
  @loading           → shown while JS chunk downloads
  @error             → shown if chunk fails to load
-->

<!-- Load when element scrolls into the viewport -->
@defer (on viewport) {
  <!-- This component's JS is NOT in the initial bundle.
       It downloads as a separate chunk when the user scrolls here. -->
  <app-heavy-chart [data]="chartData" />
} @placeholder {
  <!-- A lightweight placeholder shown immediately -->
  <div style="height: 400px; background: #f5f5f5; border-radius: 8px;">
    Chart loading...
  </div>
} @loading (minimum 500ms) {
  <!-- 
    minimum 500ms prevents a flicker for fast connections
    (avoids showing the spinner for just 50ms on a fast network)
  -->
  <div class="spinner">Loading chart...</div>
} @error {
  <p>⚠️ Failed to load chart. Please refresh the page.</p>
}

<!-- Load on user interaction (click, focus, tap) -->
@defer (on interaction) {
  <app-comments-section [postId]="postId" />
} @placeholder {
  <button class="load-comments">Load Comments</button>
}

<!-- Load when browser is idle (nothing else is happening) -->
@defer (on idle) {
  <app-analytics-widget />
}

<!-- Load after a time delay -->
@defer (on timer(3000)) {
  <app-cookie-consent />
}

<!-- Prefetch the chunk on hover, but only render on click -->
@defer (on interaction; prefetch on hover) {
  <app-product-quickview [product]="product" />
} @placeholder {
  <button>Quick View</button>
}
```

### Verifying `@defer` Works

1. Open Chrome DevTools → Network tab → filter by "JS"
2. Load the page — the deferred component's chunk should **not** appear
3. Scroll down (for `on viewport`) — watch the chunk download as a separate file

> [!NOTE]
> `@defer` works automatically with Angular's build system. No extra configuration needed. Components inside `@defer` blocks are automatically split into separate JavaScript chunks during `ng build`.

### When to Use `@defer`

| Use Case | Trigger |
|----------|---------|
| Charts, graphs (below the fold) | `on viewport` |
| Comments / reviews section | `on interaction` |
| Analytics/tracking widgets | `on idle` |
| Cookie consent / banners | `on timer(2000)` |
| Heavy modal content | `on interaction` |

### Section Recap
- `ChangeDetectionStrategy.OnPush` limits re-renders to when signal data actually changes
- Signals automatically work with OnPush — no `markForCheck()` needed
- `@defer` lazily loads a component's JavaScript until a trigger fires
- Use `@placeholder`, `@loading`, and `@error` blocks for a smooth user experience
- Verify with Chrome DevTools Network tab that chunks load on demand

---

## 6. Server-Side Rendering (SSR) & Static Site Generation (SSG)

### The Problem with Client-Side Rendering (CSR)

In a standard Angular SPA (CSR), the browser gets a near-empty `index.html` and downloads JavaScript to render the page content. This means:

1. Search engine crawlers initially see an **empty page** — bad for SEO
2. Users see a **blank screen** until JavaScript loads and renders — bad for perceived performance

### Server-Side Rendering (SSR)

With SSR, Angular runs on the server for each request, renders the full HTML, and sends it to the browser. The user sees content immediately, then JavaScript "hydrates" the static HTML into an interactive app.

```bash
ng add @angular/ssr
```

### Static Site Generation (SSG / Prerendering)

SSG pre-renders pages **at build time** into static HTML files served directly. This is the fastest approach for pages that don't depend on the logged-in user.

### Configuring Render Modes per Route

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',                          // Home page
    renderMode: RenderMode.Prerender   // Pre-rendered static HTML at build time
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'products',
    renderMode: RenderMode.Prerender   // Good for SEO — product pages are static
  },
  {
    path: 'dashboard',                 // User-specific content
    renderMode: RenderMode.Server      // Rendered on server per request
  },
  {
    path: '**',
    renderMode: RenderMode.Server      // Fallback
  }
];
```

### Comparison Table

| | CSR | SSR | SSG |
|--|-----|-----|-----|
| **First paint** | Slow | Fast | Fastest |
| **SEO** | Poor | Excellent | Excellent |
| **Dynamic data** | ✅ Full | ✅ Full | ⚠️ Build-time only |
| **Hosting** | Simple static host | Needs Node.js server | Simple static host |
| **Best for** | Apps behind login | Public dynamic content | Marketing pages, docs |

---

## 7. Production Builds & Deployment

### Building for Production

```bash
ng build
```

Angular uses `esbuild` to:
1. **Compile** TypeScript → optimized JavaScript
2. **Tree-shake** — remove unused code
3. **Minify** — compress code (remove whitespace, shorten names)
4. **Chunk** — create separate bundles for lazy routes and deferred components
5. Output everything to `dist/<app-name>/browser/`

### Deploying to Netlify (SPA)

1. Run `ng build`
2. Drag `dist/<app-name>/browser/` folder to Netlify
3. **Add a `_redirects` file** inside `src/`:

```
/* /index.html 200
```

Without this, navigating directly to `/products/42` gives a 404 because Netlify looks for a file at that path, which doesn't exist. The redirect tells Netlify to always serve `index.html` and let Angular's router handle it.

Add to `angular.json` assets:
```json
"assets": ["src/favicon.ico", "src/assets", "src/_redirects"]
```

### Deploying to Vercel

1. Connect your GitHub repo to Vercel
2. Set: Build Command = `ng build`, Output Directory = `dist/<app-name>/browser`
3. Vercel handles SPA routing automatically

### Deploying to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to: dist/<app-name>/browser
# Configure as SPA: Yes
firebase deploy
```

> [!WARNING]
> The SPA redirect rule (`/* → /index.html`) is **essential** when deploying an Angular app without SSR. Without it, any URL other than the root will return a 404 on browser refresh or direct navigation.

---

## 🧪 Practice Labs

### Lab 1 — Unit Tests for Signal-Based Component (45 min)
1. Create a `RatingComponent` with:
   - `currentRating = input<number>(0)` — the current rating
   - `ratingChange = output<number>()` — emitted when user clicks a star
   - Template: 5 star buttons with `data-testid="star-N"`
2. Write tests that verify:
   - 5 stars render in the DOM
   - `setInput('currentRating', 3)` causes stars 1–3 to have class `filled`
   - Clicking star 4 emits `ratingChange` with value 4

### Lab 2 — Implement `@defer` (30 min)
1. Find a component in your app below the fold (a chart, long list, or footer).
2. Wrap it in `@defer (on viewport)` with a `@placeholder` and `@loading` section.
3. Open Chrome DevTools → Network → filter JS.
4. Reload the page — the component's chunk should NOT appear.
5. Scroll down and watch it load.

---

## 📝 Assignment: ShopAngular Project — Part 10

### Requirements

**Step 1 — Tests**
1. Run `ng test` and fix any failing tests.
2. Write tests for `CartService` verifying:
   - `addToCart(product)` increases `totalItems()` by 1
   - `removeFromCart(id)` decreases `totalItems()` by 1
   - `clearCart()` resets `totalItems()` to 0

**Step 2 — Performance**
3. Add `ChangeDetectionStrategy.OnPush` to all components.
4. Wrap the product grid in `ProductListComponent` with `@defer (on viewport)`.

**Step 3 — Build & Deploy**
5. Run `ng build` — verify no errors.
6. Add `src/_redirects` with `/*    /index.html   200`.
7. Deploy to Netlify, Vercel, or Firebase.
8. Test that refreshing at `/products` works (not a 404).

**Submission:** Your live URL!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Testing Guide | https://angular.dev/guide/testing |
| Vitest Documentation | https://vitest.dev/ |
| Angular Deferrable Views | https://angular.dev/guide/defer |
| Angular SSR Guide | https://angular.dev/guide/ssr |
| Netlify Redirects | https://docs.netlify.com/routing/redirects/ |

---

## 📌 Key Takeaways

- **Vitest** replaces Karma for lightning-fast Angular tests — run with `ng test`
- Use `TestBed.configureTestingModule()` to create a mini Angular environment for testing
- Use `fixture.componentRef.setInput('name', value)` to set signal `input()` in tests
- `HttpTestingController` intercepts HTTP requests — always `httpMock.verify()` in `afterEach`
- **OnPush + Signals** = Angular's recommended high-performance pattern
- **`@defer`** lazily loads components into separate JS chunks triggered by viewport, interaction, or idle
- **SSR** renders HTML on the server per request; **SSG** pre-renders at build time
- Always configure **SPA redirects** (`/* → /index.html`) when deploying without SSR

---

🎉 **Congratulations!** You've completed **Module 5: Angular Framework** — from first component to deployed production app.

*Next Module: [Module 6 — C# & .NET Fundamentals](./33%20-%20C%23%20Basics%20%E2%80%94%20Syntax,%20Types%20%26%20Control%20Structures.md)*