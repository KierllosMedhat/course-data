# Lecture 32 — Angular Testing, Performance & Deployment

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Write unit tests with Vitest using `TestBed`
- Test signal `input()` and `output()` 
- Mock HTTP calls with `HttpTestingController`
- Optimise performance with OnPush, lazy loading, and `@defer`
- Understand Server-Side Rendering (SSR) and Static Site Generation (SSG) in Angular
- Build for production with `ng build` (esbuild)
- Deploy an Angular app to a hosting provider

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Vitest: Angular's default test runner
2. Unit testing components: `TestBed`, signal inputs/outputs
3. Testing services: `HttpTestingController`
4. Performance: OnPush, `@defer`
5. SSR & SSG (Server Routes)
6. Production builds & Deployment

### Part 2 — Practice / Lab (~90–120 min)
1. Unit tests for a signal-based component
2. Implement `@defer` for a heavy component
3. ShopAngular Project Part 10: Performance & Deployment

---

## 1. Vitest — Angular's Default Test Runner

Angular replaces Karma + Jasmine with **Vitest** — tests start incredibly fast!

```bash
ng test             # Runs your tests!
```

---

## 2. Unit Testing Components

### Basic Component Test
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Testing Signal Inputs & Outputs
```ts
it('should use the input value', () => {
  fixture.componentRef.setInput('initialCount', 10);
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('10');
});

it('should emit on click', () => {
  let emitted: number | undefined;
  fixture.componentInstance.countChanged.subscribe(val => emitted = val);
  
  fixture.nativeElement.querySelector('button').click();
  
  expect(emitted).toBe(1);
});
```

---

## 3. Testing Services with `HttpTestingController`

```ts
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify()); // Ensure no outstanding requests

  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'Alice' }];

    service.getAll().subscribe(users => expect(users).toEqual(mockUsers));

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers); // Respond with mock data!
  });
});
```

---

## 4. Performance Optimisation

### OnPush with Signals
Signals automatically mark OnPush components dirty — no `markForCheck()` needed!

```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>{{ user().name }}</h2>`
})
export class UserCardComponent {
  user = input.required<User>();
}
```

### `@defer` Blocks
Defer loading component code until a trigger condition (like scrolling into view)!

```html
@defer (on viewport) {
  <app-heavy-chart [data]="chartData" />
} @placeholder {
  <div>Chart loading...</div>
} @loading (minimum 500ms) {
  <mat-spinner></mat-spinner>
}
```

---

## 5. Server-Side Rendering (SSR) & Static Site Generation (SSG)

Modern Angular comes with excellent SSR/SSG support out of the box. You can configure this when running `ng new`, or add it later with `ng add @angular/ssr`.

### Why SSR/SSG?
- **SEO:** Search engines see fully rendered HTML immediately.
- **Performance:** Users see the page faster (better First Contentful Paint).

### Prerendering (SSG)
You can tell Angular to pre-render specific routes at build time into static HTML files!
In your `app.routes.server.ts`:
```ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'about',
    renderMode: RenderMode.Prerender // This page will be statically generated!
  },
  {
    path: '**',
    renderMode: RenderMode.Server // Dynamic pages render on the server per request
  }
];
```

---

## 6. Production Builds & Deployment

### Building
```bash
ng build 
```
Angular uses `esbuild` for ultra-fast, tree-shaken, minified production builds.

### Deployment (Netlify/Vercel/Firebase)
If you are deploying a standard SPA (Single Page Application, no SSR), you **must** configure a redirect rule so that deep links don't return a 404!

For example, on Netlify, add a `src/_redirects` file:
```text
/*    /index.html   200
```

---

## 🧪 Practice Labs

### Lab 1 — Unit Tests for Signal Component (45 min)
1. Create a `RatingComponent` with a signal `input()` and `output()`.
2. Write tests using Vitest to ensure clicking a star updates the UI and emits the event.

### Lab 2 — Implement `@defer` (30 min)
1. Find a component in your app that is below the fold (e.g. a footer or a heavy list).
2. Wrap it in `@defer (on viewport)` and verify in the Network tab that the JS chunk only loads when you scroll!

---

## 📝 Assignment: ShopAngular Project — Part 10

It's time to prepare ShopAngular for production!

### Requirements
1. Run `ng test` and ensure your app passes its basic creation tests.
2. Add `ChangeDetectionStrategy.OnPush` to all your components.
3. Wrap your `ProductListComponent`'s product grid in a `@defer (on viewport)` block.
4. Build the app using `ng build`.
5. Deploy your `dist/shop-angular/browser` folder to Netlify, Vercel, or Firebase Hosting. Ensure you add the SPA redirect rule!

**Submission:** Your live URL!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Testing Guide | https://angular.dev/guide/testing |
| Angular Deferrable Views | https://angular.dev/guide/defer |
| Angular SSR | https://angular.dev/guide/ssr |

---

## 📌 Key Takeaways
- **Vitest** replaces Karma for lightning-fast tests.
- Use `componentRef.setInput()` to test signal inputs.
- `HttpTestingController` mocks HTTP — always `verify()` in `afterEach`.
- **OnPush + signals** = automatic, high-performance change detection.
- **`@defer`** defers JS loading until viewport/interaction/idle — critical for performance.
- **SSR/SSG** provides better SEO and initial load times.
- Always configure **SPA redirects** (`/* → /index.html`) on hosting platforms if not using SSR.

---

🎉 **Congratulations!** You've completed **Module 5: Angular Framework** — from first component to deployed production app.

*Next Module: [Module 6 — C# & .NET Fundamentals](./33%20-%20C%23%20Fundamentals.md)*