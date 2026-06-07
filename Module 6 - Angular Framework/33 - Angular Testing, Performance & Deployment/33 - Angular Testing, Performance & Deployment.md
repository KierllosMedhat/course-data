# Lecture 33 — Angular Testing, Performance & Deployment

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 1. 🚦 Prerequisites

Before diving into this comprehensive guide on testing, performance optimization, and deployment in Angular, ensure you have a solid grasp of the following concepts:
- **Angular Fundamentals:** Understanding of standalone components, templates, and structural directives (`@if`, `@for`).
- **Reactive Programming:** Familiarity with RxJS Observables and Angular Signals (`signal()`, `computed()`, `input()`, `output()`).
- **Dependency Injection:** Knowing how to create and inject services using the `inject()` function or constructor injection.
- **Routing:** Basic understanding of Angular's Router and navigation.
- **Environment Setup:** Node.js installed locally, the Angular CLI configured, and a working Angular workspace.

If any of these concepts feel unfamiliar, please review the previous lectures on Angular Architecture and Signals before proceeding.

---

## 2. 🎯 Objectives

By the end of this lecture, you will be empowered to:
- **Articulate the Value of Testing:** Explain what automated testing is, why it is critical for scalable applications, and distinguish between Unit, Integration, and End-to-End (E2E) tests.
- **Master Unit Testing with Vitest:** Write robust unit tests for components using **Vitest** and Angular's `TestBed`.
- **Test Modern Angular Features:** Effectively test signal-based `input()` and `output()` properties in isolated component tests.
- **Isolate Service Logic:** Mock HTTP requests and backend interactions in service tests using the `HttpTestingController`.
- **Optimize Rendering Performance:** Implement `ChangeDetectionStrategy.OnPush` to prevent unnecessary component re-renders and drastically improve application speed.
- **Lazy Load Content:** Reduce initial bundle sizes and improve perceived performance using Angular's declarative `@defer` blocks.
- **Choose the Right Rendering Strategy:** Understand the trade-offs and implementation details of Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG).
- **Deploy to Production:** Build a production-ready bundle with `ng build` and deploy an Angular Single Page Application (SPA) to providers like Netlify, Vercel, or Firebase while handling routing caveats.

---

## 3. 📋 Agenda

**Part 1 — Theory (~90 min)**
1. **Why We Test:** The fundamentals of automated testing and the Testing Pyramid.
2. **Vitest Overview:** Transitioning to Angular's modern default test runner.
3. **Unit Testing Components:** Harnessing `TestBed`, testing DOM interactions, and handling signal inputs/outputs.
4. **Testing Services:** Utilizing `HttpTestingController` for deterministic HTTP mocking.
5. **Performance Optimization (Part 1):** Mastering `OnPush` change detection strategy with Signals.
6. **Performance Optimization (Part 2):** Implementing `@defer` blocks for granular lazy loading.
7. **Rendering Architecture:** Navigating CSR, SSR, and SSG in the Angular ecosystem.
8. **Production & Deployment:** Building the app and conquering SPA routing redirects.

**Part 2 — Practice / Lab (~90–120 min)**
1. Write comprehensive unit tests for a signal-based rating component.
2. Implement `@defer` for a resource-intensive chart component.
3. **ShopAngular Project Part 10:** Apply performance optimizations and deploy the e-commerce application to the cloud.

---

## 4. 🧠 Deep Dive

### 4.1 Why We Test — The Fundamentals

#### Plain-English Explanation
Imagine you are building a bridge. Before opening it to public traffic, you subject it to rigorous load tests: you apply extreme pressure, simulate high winds, and expose it to freezing winter conditions. You do this because you want absolute **confidence** that the bridge will not fail under real-world stress.

Automated tests serve the exact same purpose for your software. They are small programs written alongside your application code that verify your logic behaves precisely as expected—automatically, consistently, and every single time you modify the codebase.

#### The Three Types of Tests (The Testing Pyramid)
The industry standard approach to testing is structured as a pyramid, indicating the volume and scope of tests you should write.

```text
                    ┌─────────────────────────────────┐
                    │         E2E Tests               │  ← 5–10%: fewest, slowest, most like real users
                    │   (Full app in a real browser)  │
                    │         e.g., Cypress           │
                    ├─────────────────────────────────┤
                    │      Integration Tests          │
                    │   (Multiple units together)     │  ← 20–30%: testing component interactions
                    │       e.g., TestBed             │
                    ├─────────────────────────────────┤
                    │         Unit Tests              │  ← 60–70%: most, fastest, highly targeted
                    │   (One component or service)    │
                    │        e.g., Vitest             │
                    └─────────────────────────────────┘
```

- **Unit Tests:** Test a single isolated function, component, or service. They are fast, cheap to run, and pinpoint the exact source of a failure.
- **Integration Tests:** Verify that multiple units collaborate correctly (e.g., a component and its injected service rendering together in the DOM).
- **End-to-End (E2E) Tests:** Simulate a real user clicking through the application in a headless browser (like Chrome). These provide high confidence but are slow and brittle to maintain.

> [!NOTE]  
> **Why Does This Matter?** Testing is not an optional luxury in professional development. It is the bedrock of maintainable software. Tests protect you from *regression bugs* (features that break when you modify unrelated code), act as living documentation of intended behavior, and give your team the psychological safety required to refactor legacy code aggressively.

### 4.2 Vitest — Angular's Modern Test Runner

#### What is Vitest?
Historically, Angular relied on Karma and Jasmine. This required spinning up an actual browser instance (like Chrome or Firefox) for every single test run, which became excruciatingly slow as projects grew to hundreds of tests. 

Angular has modernized its stack by adopting **Vitest** as the default test runner. Vitest executes tests in a Node.js environment utilizing `jsdom` to simulate browser APIs. This approach eliminates browser startup overhead, resulting in blazing-fast, near-instant test execution while maintaining seamless integration with your Angular workspace configuration.

#### Executing Tests
```bash
# Run the entire test suite once
ng test

# Run tests in watch mode (ideal during development; re-runs automatically on save)
ng test --watch

# Run tests and generate a comprehensive code coverage report (HTML format)
ng test --coverage
```

#### The Structure of a Vitest Suite (The AAA Pattern)
Professional test suites follow the **AAA pattern**: **A**rrange (setup), **A**ct (execute), **A**ssert (verify).

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

// describe() defines a test suite grouping related specifications
describe('Math Utilities', () => {
  
  // beforeEach() executes before EVERY individual test in this block
  beforeEach(() => {
    // Reset state or initialize fresh instances here
  });

  // it() defines a single test case
  it('should correctly double a positive integer', () => {
    // ARRANGE: Set up the specific scenario and data
    const input = 5;

    // ACT: Execute the specific function being tested
    const result = doubleNumber(input);

    // ASSERT: Verify the outcome matches expectations
    expect(result).toBe(10);
  });
});
```

### 4.3 Unit Testing Components with TestBed

#### What is TestBed?
`TestBed` is Angular's powerful testing utility. It constructs an isolated, mock Angular module environment tailored specifically for your test. With `TestBed`, you can:
- Instantiate components in a strictly controlled sandbox.
- Inject real or mocked services.
- Manually trigger Angular's change detection cycle to evaluate templates.
- Traverse and query the rendered DOM to verify visual output.

#### Step-by-Step: Testing a Counter Component
Consider a standalone counter component utilizing Angular Signals:

```typescript
// counter.component.ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div class="counter">
      <!-- We use data-testid attributes to decouple tests from fragile CSS class names -->
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

Here is how we comprehensively test this component:

```typescript
// counter.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let fixture: ComponentFixture<CounterComponent>; // The wrapper around the component and its DOM
  let component: CounterComponent;                 // The actual TypeScript class instance

  // Ensure a pristine environment for every test
  beforeEach(async () => {
    // 1. Configure the isolated testing module
    await TestBed.configureTestingModule({
      imports: [CounterComponent], // Standalone components go in imports
    }).compileComponents();        // Compiles external HTML/CSS if present

    // 2. Instantiate the component
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    
    // 3. Trigger the initial render cycle
    fixture.detectChanges();
  });

  it('should successfully instantiate the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a count of 0', () => {
    // Assert against the internal state
    expect(component.count()).toBe(0);
    
    // Assert against the rendered DOM
    const display = fixture.nativeElement.querySelector('[data-testid="count-display"]');
    expect(display.textContent).toContain('Count: 0');
  });

  it('should increment the count when the + button is clicked', () => {
    // Arrange (state is already 0 from setup)
    
    // Act: Query the button and simulate a click event
    const btn = fixture.nativeElement.querySelector('[data-testid="increment-btn"]');
    btn.click();
    
    // CRITICAL: You must manually tell Angular to update the DOM after an interaction in tests
    fixture.detectChanges();

    // Assert
    expect(component.count()).toBe(1);
    const display = fixture.nativeElement.querySelector('[data-testid="count-display"]');
    expect(display.textContent).toContain('Count: 1');
  });

  it('should allow setting an arbitrary initial state and resetting it', () => {
    // Arrange: Manually manipulate internal state
    component.count.set(99);
    fixture.detectChanges(); // Update DOM to reflect the 99

    // Act
    const btn = fixture.nativeElement.querySelector('[data-testid="reset-btn"]');
    btn.click();
    fixture.detectChanges();

    // Assert
    expect(component.count()).toBe(0);
  });
});
```

#### Testing Signal Inputs and Outputs
Modern Angular relies heavily on signal-based inputs and standard outputs. Testing them requires specific syntax.

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
  currentRating = input<number>(0); 
  ratingChange  = output<number>(); 
  
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

  it('should reactively update when the currentRating input changes', () => {
    // 🚨 IMPORTANT: You CANNOT assign to a signal input like `component.currentRating = 3`
    // You MUST use `fixture.componentRef.setInput()`
    fixture.componentRef.setInput('currentRating', 3);
    fixture.detectChanges(); // Apply the input change to the template

    // Verify correct styling
    const star3 = fixture.nativeElement.querySelector('[data-testid="star-3"]');
    expect(star3.classList).toContain('filled');

    const star4 = fixture.nativeElement.querySelector('[data-testid="star-4"]');
    expect(star4.classList).not.toContain('filled');
  });

  it('should emit the ratingChange output when a star is clicked', () => {
    // Arrange: Setup a spy/listener for the emitted value
    let emittedValue: number | undefined;
    component.ratingChange.subscribe((val: number) => {
      emittedValue = val;
    });

    // Act
    const star4 = fixture.nativeElement.querySelector('[data-testid="star-4"]');
    star4.click();

    // Assert
    expect(emittedValue).toBe(4);
  });
});
```

### 4.4 Testing Services with HttpTestingController

Real HTTP requests in tests introduce latency, flakiness, and require complex backend setup. Angular solves this elegantly with the `HttpTestingController`, a utility that intercepts outgoing requests and allows you to supply synthetic responses synchronously. This way, we strictly test the logic of the service, not the actual network connectivity.

```typescript
// user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User { id: number; name: string; }

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  create(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
}
```

```typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserService, User } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),           // Standard HttpClient provider
        provideHttpClientTesting(),    // Overrides transport to intercept requests for tests
        UserService,
      ],
    });

    service  = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // CRITICAL: Ensure no outstanding HTTP requests remain after a test completes
  afterEach(() => httpMock.verify());

  it('should fetch and return a list of users via GET', () => {
    const mockUsers: User[] = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

    // STEP 1: Subscribe to the service method. (It won't execute until the mock responds).
    let actualUsers: User[] | undefined;
    service.getAll().subscribe(users => { actualUsers = users; });

    // STEP 2: Assert that exactly ONE GET request was made to the correct endpoint
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');

    // STEP 3: "Flush" (resolve) the request with our mock data
    req.flush(mockUsers);

    // STEP 4: Assert the service correctly returned the mock data
    expect(actualUsers).toEqual(mockUsers);
  });

  it('should correctly handle POST requests to create a user', () => {
    const newUser = { name: 'Carol' };
    const mockResponse: User = { id: 3, name: 'Carol' };

    let createdUser: User | undefined;
    service.create(newUser).subscribe(user => { createdUser = user; });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    // Verify the correct payload was attached to the request body
    expect(req.request.body).toEqual(newUser);

    req.flush(mockResponse);
    expect(createdUser?.id).toBe(3);
  });

  it('should elegantly handle HTTP 404 errors', () => {
    let errorOccurred = false;

    service.getAll().subscribe({
      next: () => {},
      error: () => { errorOccurred = true; }
    });

    const req = httpMock.expectOne('/api/users');
    
    // Simulate a server error response
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(errorOccurred).toBe(true);
  });
});
```

### 4.5 Performance Optimization: OnPush Change Detection

#### The Cost of Default Change Detection
By default, Angular utilizes a conservative and robust change detection strategy. Whenever *any* asynchronous event occurs anywhere in the application (a button click, a `setTimeout` completing, an HTTP response arriving), Angular recursively traverses the entire component tree, checking every single binding in every template to see if the view needs updating.
While safe and incredibly developer-friendly, this exhaustive checking becomes a severe performance bottleneck in large, complex applications, causing lagging UIs and draining battery life on mobile devices.

#### The OnPush Solution
`ChangeDetectionStrategy.OnPush` informs Angular that a component is highly predictable. It instructs Angular to completely skip checking this component (and all of its child components) unless one of the following specific triggers occurs:
1. The reference of an `@Input()` object changes, or the value of a signal `input()` explicitly changes.
2. A DOM event (like a click) is triggered from *within* the component itself or one of its descendants.
3. An Observable bound in the template via the `async` pipe emits a new value.
4. A signal accessed within the template emits a new value.

#### The Synergy of OnPush and Signals
When you combine `OnPush` with Angular Signals, you achieve surgical precision in rendering. Because signals are inherently reactive, Angular knows *exactly* which signal is read in which template. When a signal updates, Angular marks only that specific component as "dirty," bypassing the rest of the application entirely.

```typescript
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  // 🚀 PERFORMANCE UPGRADE: Only re-render when necessary
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="product-card">
      <h3>{{ product().name }}</h3>
      <p>{{ product().price }}</p>
    </div>
  `
})
export class ProductCardComponent {
  // Utilizing signal inputs guarantees OnPush will react correctly when data changes
  product = input.required<{name: string, price: number}>();
}
```

> [!TIP]  
> **Golden Rule of Performance:** Always enforce `ChangeDetectionStrategy.OnPush` when architecting components using Signals. This combination guarantees minimal re-renders, preventing janky animations and ensuring exceptional scalability as your application grows.

### 4.6 Performance Optimization: @defer Blocks

#### The Concept of Deferred Loading
In a standard build process, all components referenced in a template are bundled into the main JavaScript payload and downloaded immediately upon page load. If your homepage contains a complex, resource-heavy charting component located entirely "below the fold" (requiring scrolling to see), the user is forced to download and parse its code before they can even interact with the visible top of the page. This severely degrades the Initial Load Time and Core Web Vitals metrics.

The `@defer` block introduces declarative lazy loading directly within the HTML template. It instructs the Angular compiler to extract the enclosed component's code into a separate JavaScript chunk, which is only downloaded when a specific condition (trigger) is met.

#### @defer Syntax and Lifecycle
A `@defer` block manages multiple states to ensure a seamless user experience across varied network conditions:

```html
<!-- Trigger: Download the chunk only when this area scrolls into the user's viewport -->
@defer (on viewport) {
  <app-heavy-interactive-chart [data]="metrics" />
} 
@placeholder {
  <!-- Displayed immediately on initial load. Usually a lightweight skeleton UI. -->
  <div class="skeleton-chart">Scroll down to view metrics</div>
} 
@loading (minimum 500ms) {
  <!-- Displayed while the JavaScript chunk is actively downloading over the network.
       The 'minimum' duration prevents rapid flickering on fast connections. -->
  <div class="spinner">Fetching chart application...</div>
} 
@error {
  <!-- Displayed if the network request for the chunk fails -->
  <div class="alert alert-danger">Failed to load the chart module.</div>
}
```

#### Powerful Trigger Mechanisms
- `on viewport`: Triggers when the block (or a specifically designated element) enters the visible screen area. Essential for images, footers, and complex widgets positioned lower on the page.
- `on interaction`: Triggers upon user engagement (click, touch, focus). Ideal for heavy modals, extensive comments sections, or expandable "Read More" components.
- `on idle`: Triggers when the browser has finished critical tasks and is sitting idle. Good for preloading analytics or supplementary background features.
- `on timer(2000ms)`: Triggers after a specific delay. Useful for non-critical elements like delayed popup banners, promotional modals, or cookie consent forms.
- `prefetch on hover`: A powerful secondary trigger that downloads the code eagerly when a user hovers over an element, but only renders it when a primary condition (like `on interaction`) is met. This ensures an instantaneous perceived loading experience.

### 4.7 SSR, SSG, and Deployment Strategies

#### Rendering Paradigms Explained
Understanding how your HTML is delivered to the user is crucial for performance and SEO.

1. **Client-Side Rendering (CSR):** 
   - **How it works:** The server sends a nearly empty `index.html` file containing a `<app-root></app-root>` tag and a link to the JavaScript bundle. The browser downloads the JS, boots Angular, executes the code, and renders the UI dynamically on the client device.
   - **Pros:** Excellent for highly interactive, private dashboards behind a login wall where SEO is irrelevant. Low server computational cost.
   - **Cons:** Search Engine Optimization (SEO) suffers dramatically because crawlers initially see blank HTML. Slower First Contentful Paint (FCP), especially on low-end mobile devices.

2. **Server-Side Rendering (SSR):**
   - **How it works:** A Node.js server intercepts the incoming request, runs the Angular application *on the server*, generates fully populated HTML representing the initial view, and sends it to the browser. The browser displays this HTML instantly, then downloads the JS and "hydrates" the static HTML to make it fully interactive.
   - **Pros:** Instant First Contentful Paint. Flawless SEO indexability. Ideal for public-facing dynamic content (e.g., e-commerce product pages, news articles).
   - **Cons:** Requires running, scaling, and maintaining a Node.js server environment. Higher infrastructure and hosting costs.

3. **Static Site Generation (SSG / Prerendering):**
   - **How it works:** Angular generates fully populated HTML pages during the `ng build` compilation process. These static files are then uploaded and served directly by a lightweight CDN.
   - **Pros:** Unbeatable speed and extreme security. No active application server required. Perfect for marketing pages, documentation, and blogs.
   - **Cons:** Cannot handle dynamic data that changes frequently without triggering a completely new build process.

#### Preparing for Production Deployment
To prepare your application for public release, run the production build command:
```bash
ng build
```
Angular utilizes the modern `esbuild` bundler to execute a sophisticated optimization pipeline:
- **AOT Compilation:** Translates Angular templates into highly optimized, executable TypeScript/JavaScript.
- **Tree-Shaking:** Scans the dependency graph and completely removes unused code and library functions to minimize payload size.
- **Minification:** Aggressively compresses the remaining code (removing whitespace, shortening variable names).
- **Chunking:** Generates separate files for lazy-loaded routes and `@defer` blocks to enable code splitting.
The optimized application is output to the `dist/<app-name>/browser/` directory.

#### Deployment Steps & The SPA Routing Trap
When deploying a CSR Single Page Application to static hosts (Netlify, Vercel, Firebase), you must configure rewrite rules. 
If a user navigates directly to `https://yourapp.com/products/42`, the static server looks for a folder named `products` containing a file named `42`. Since these don't exist (only `index.html` exists physically), the server returns a fatal 404 Error.
You must instruct the server to redirect all unmatched routes back to `index.html`, allowing Angular's internal router to take over, parse the URL, and render the correct view.

**Netlify Deployment Fix:** 
1. Add a file precisely named `_redirects` inside your `src/` folder.
2. Add `src/_redirects` to the `assets` array within your `angular.json` file to ensure it gets copied to the build folder.
3. The content of `_redirects` must be exactly:
```text
/*    /index.html   200
```

---

## 5. 💭 Think Like a Dev

**The Milestone: Frontend Developer Portfolio**
At this point, you have crossed a massive threshold. You now have fully functional, real-world, API-driven applications deployed live on the internet. You are officially ready to apply for Junior Frontend roles *before* even starting the upcoming C# backend module. Be proud of the interactive, high-performance portfolio you have built!

**The Mindset Shift for Testing:**
Novice developers often view testing as an annoying chore, asking, "Why write double the code to accomplish one feature?" Professional developers view tests as executable documentation and an essential safety net. 
When encountering a bug in production, a senior engineer does not immediately hack away at the application code. First, they write a failing test case that perfectly replicates the bug's conditions. Then, they systematically modify the application code until the test passes. This disciplined practice mathematically guarantees that the exact same bug can never reappear undetected in the future.

**The Mindset Shift for Performance:**
Performance is not an afterthought or a band-aid applied at the end of a development cycle. It is a fundamental architectural decision made on day one. By adopting `ChangeDetectionStrategy.OnPush` across your application from inception, you force yourself to write predictable, immutable, and reactive code using Signals. When adding new features, constantly ask yourself: "Does the user absolutely need this code right now, or can I wrap it in a `@defer` block to prioritize initial load speed and improve the Core Web Vitals?"

---

## 6. 🔄 Before / After

### Before: Unoptimized, Eagerly Loaded Component
```typescript
@Component({
  selector: 'app-product-list',
  standalone: true,
  // RELIES ON DEFAULT CHANGE DETECTION: Inefficient for large lists
  template: `
    <div *ngFor="let p of products">
      {{ p.name }} - {{ calculateDiscount(p.price) }}
    </div>
    <!-- EAGER LOAD: Blocks initial page render even if hidden completely off-screen -->
    <app-heavy-recommendations [productId]="p.id"></app-heavy-recommendations>
  `
})
export class ProductList {
  @Input() products: Product[];
  
  // ANTI-PATTERN: Calling a function directly in the template during default change detection.
  // This executes potentially hundreds of times per second during unrelated interactions.
  calculateDiscount(price: number) {
    return price * 0.9;
  }
}
```

### After: High-Performance, Lazily Loaded Component
```typescript
@Component({
  selector: 'app-product-list',
  standalone: true,
  // 🚀 OPTIMIZED: Restricts change detection cycles exclusively to signal updates or events
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Utilizing the highly optimized @for block syntax with explicit tracking -->
    @for (p of products(); track p.id) {
      <!-- Pre-computed values replace expensive template function calls -->
      <div>{{ p.name }} - {{ p.discountedPrice }}</div>
      
      <!-- 🚀 OPTIMIZED: Only downloads code when the user physically scrolls near it -->
      @defer (on viewport) {
        <app-heavy-recommendations [productId]="p.id" />
      } @placeholder {
        <div class="skeleton">Loading personalized recommendations...</div>
      }
    }
  `
})
export class ProductList {
  // 🚀 OPTIMIZED: Utilizing signals natively integrates perfectly with OnPush
  products = input.required<Product[]>();
}
```

---

## 7. ❌ Common Mistakes

| Mistake | Impact | How to Fix |
|---|---|---|
| **Forgetting `fixture.detectChanges()`** | Tests fail inexplicably because the DOM never updates to reflect the internal component state changes you simulated. | Always explicitly call `fixture.detectChanges()` immediately after simulating an action or updating an input. |
| **Assigning to `input()` directly in tests** | Code like `component.myInput = 5;` throws a strict TypeScript error or fails silently because signal inputs are read-only. | Exclusively use `fixture.componentRef.setInput('myInput', 5);` to update signal inputs within your test suite. |
| **Omitting `httpMock.verify()`** | Your tests might report passing even if unwanted, hidden HTTP requests were fired by your service, leading to highly flaky test suites. | Always invoke `httpMock.verify()` inside the overarching `afterEach` block. |
| **Forgetting SPA routing rules on deployment** | Direct navigation to deep links (like `/dashboard`) returns a fatal 404 Error on static hosts like Netlify or Firebase. | Implement a rewrite rule (e.g., a `_redirects` file) pointing `/*` to `index.html`. |
| **Calling heavy functions in templates** | Combined with Default Change Detection, template functions execute constantly, crippling application framerates and locking the UI. | Precompute values using Angular Pipes or `computed()` signals within the component class instead. |

---

## 8. 💻 Labs

### Lab 1: Unit Test a Rating Component (45 min)
1. Generate a standalone `RatingComponent` using the Angular CLI.
2. Define the component contract: `currentRating = input<number>(0)` and `ratingChange = output<number>()`.
3. Create a template displaying 5 interactive star buttons using the `@for` directive. Apply a dynamic CSS class based on whether the star index is less than or equal to the `currentRating`. Add distinct `data-testid` attributes to each button to facilitate testing.
4. Construct a Vitest suite to assert the following behaviors:
   - The default component state accurately renders exactly 5 stars in the DOM.
   - Executing `fixture.componentRef.setInput('currentRating', 3)` correctly applies the active CSS class to exactly 3 stars.
   - Simulating a user click on a specific star accurately emits the correct numeric value via the `ratingChange` output.

### Lab 2: Implement Deferred Loading (30 min)
1. Identify a large, non-critical, or below-the-fold component within your existing project (e.g., a complex footer, an interactive Google map, or a detailed D3 charting component).
2. Refactor its usage in the parent template by completely wrapping it in a `@defer (on viewport)` block.
3. Design and implement a visually appealing skeleton screen within the `@placeholder` block and a loading spinner within the `@loading` block.
4. **Verification:** Open Google Chrome DevTools, navigate to the Network tab, filter the requests by 'JS', and forcefully reload the page. Confirm the component's JavaScript chunk is completely absent initially. Then, visually watch the chunk download dynamically as you scroll the component into view.

### Lab 3: ShopAngular Final Polish & Deployment (60 min)
1. **Comprehensive Performance Audit:** Convert every single component in the ShopAngular application to enforce `ChangeDetectionStrategy.OnPush`. Verify the application's core functionality remains intact.
2. **Aggressive Lazy Loading:** Implement `@defer` for the heavy "Product Reviews" and "Related Products" sections located at the bottom of the Product Details page.
3. **Production Build:** Execute `ng build` and systematically resolve any lingering compilation errors.
4. **Cloud Deployment:** Create a free Netlify account. Construct the requisite `_redirects` file within `src/` and ensure your `angular.json` is updated to bundle it. Drag the generated contents of `dist/<app-name>/browser/` into Netlify's deployment zone. Finally, verify that refreshing a direct deep link works flawlessly.

---

## 9. 🎤 Interview Prep

**Q: Explain the exact, technical difference between `TestBed.createComponent()` and `TestBed.inject()`.**
> `TestBed.createComponent(Type)` is explicitly utilized to instantiate a Component alongside its dedicated `ComponentFixture`. This fixture acts as a critical wrapper, providing essential APIs for interacting with the component's rendered DOM and manually triggering change detection cycles. Conversely, `TestBed.inject(Token)` is utilized to retrieve an instantiated singleton instance of a Service or an InjectionToken directly from the current active testing injector environment without concerning itself with DOM representation.

**Q: Why is `ChangeDetectionStrategy.OnPush` considered a non-negotiable best practice for enterprise Angular applications?**
> `OnPush` forcefully breaks Angular's default, exhaustive behavior of recursively checking the entire component tree on every single event cycle. It explicitly instructs Angular to skip checking a component unless its specific input references change, it fires an internal DOM event, or an explicitly bound signal/observable emits a new value. This surgical, localized approach drastically reduces CPU overhead and ensures scalable, high-framerate performance as applications grow in complexity.

**Q: Detail the specific process of mocking an HTTP request within an Angular service test.**
> First, carefully configure the testing module by providing `provideHttpClientTesting()` alongside the standard `provideHttpClient()`. Next, inject the `HttpTestingController` into your test suite. Execute the service method you intend to test, then use `httpMock.expectOne('/api/url')` to intercept the outgoing request and assert its HTTP method. Finally, invoke `req.flush(mockData)` to simulate the backend's response synchronously, resolving the observable and allowing you to assert the final data state.

**Q: What is the primary architectural purpose of `@defer` blocks in modern Angular templates?**
> `@defer` provides declarative, highly granular lazy loading of component JavaScript directly within the HTML template structure. It commands the Angular compiler to extract the enclosed component into a discrete JS chunk, explicitly delaying its download over the network until a precisely specified interaction or viewport trigger occurs. This heavily minimizes the initial JavaScript payload, accelerates the Time to Interactive (TTI) metric, and vastly improves overall Core Web Vitals.

---

## 10. 🚀 Key Takeaways

- **Frontend Developer Portfolio Milestone:** You have successfully built, optimized, and deployed live, real-world API-driven applications. You are now officially ready to apply for Junior Frontend roles even before moving on to the C# module!
- **Tests are Executable Documentation:** Unit tests rigorously secure isolated behaviors (components and services), while integration and E2E tests secure entire user workflows. Together, they form the ultimate safety net for confident refactoring.
- **Harness Vitest and TestBed Together:** Combine Vitest's blistering execution speed with TestBed's isolated module environments to comprehensively evaluate components, mock complex dependencies, and perfectly simulate realistic user interactions.
- **Respect Signal Immutability in Tests:** Signal inputs are strictly read-only by design. Always explicitly update them via `fixture.componentRef.setInput()` during test execution.
- **Isolate Network Calls:** Unit tests must remain fast and deterministic. Never hit a live backend during a unit test; seamlessly intercept and mock requests using the highly reliable `HttpTestingController`.
- **Default to OnPush Reactivity:** Architect your applications using `ChangeDetectionStrategy.OnPush` in tandem with Angular Signals to achieve out-of-the-box, highly optimized reactivity and minimal DOM re-renders.
- **Lazy Load Aggressively:** Utilize `@defer` blocks extensively for any content positioned below the fold or hidden behind complex interactions to aggressively minimize the initial JS payload size and improve perceived loading speeds.
- **Select the Optimal Rendering Paradigm:** Deploy CSR for private, interactive dashboards; SSR for SEO-critical, highly dynamic public-facing pages; and SSG for static content that rarely changes.
- **Conquer the SPA Routing Trap:** Always remember that deploying Single Page Applications to static hosts mandates configuring explicit URL rewrite rules (like Netlify's `_redirects`), ensuring direct navigation and page refreshes function flawlessly without 404 errors.
**Next Module:** [Lecture 34 — Database Concepts & Relational Design](../../Module%207%20-%20Database%20%26%20MSSQL/34%20-%20Database%20Concepts%20%26%20Relational%20Design/34%20-%20Database%20Concepts%20%26%20Relational%20Design.md)

### 📚 Extensive Tutorials & Resources
- **Source:** [Angular University - Angular Testing Course: The Complete Guide](https://blog.angular-university.io/angular-testing/)
- **Source:** [Angular University - Angular Server-Side Rendering (SSR) Guide](https://blog.angular-university.io/angular-server-side-rendering/)
- **Source:** [Angular.dev - Testing Angular Applications](https://angular.dev/guide/testing)
- **Source:** [Angular.dev - Angular Performance Guide](https://angular.dev/guide/performance)
- **Source:** [Angular.dev - Deferred Loading with @defer](https://angular.dev/guide/templates/defer)
- **Source:** [Angular University - Angular Defer Blocks Guide](https://blog.angular-university.io/angular-defer/)
