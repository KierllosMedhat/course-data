# Lecture 26 — Angular Routing & Navigation

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Set up routing with `provideRouter()` and standalone routes
- Define component routes, redirects, and wildcard (404) routes
- Read route parameters and query parameters using `withComponentInputBinding()`
- Build nested layouts with child routes and `<router-outlet>`
- Protect routes with functional guards (`CanActivateFn`)
- Lazy-load features with `loadComponent`
- Enable smooth page transitions with `withViewTransitions()`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Router setup: `provideRouter()`, `Routes` array, `<router-outlet>`
2. Route types: component, redirect, wildcard/404
3. Programmatic Navigation & Route parameters
4. Child routes & nested outlets
5. Functional guards: `CanActivateFn`
6. Resolvers & `withComponentInputBinding()`
7. Lazy loading: `loadComponent`
8. View Transitions API

### Part 2 — Practice / Lab (~90–120 min)
1. Multi-page SPA with nested routes and 404 handling
2. Functional route guards for authentication
3. ShopAngular Project Part 4: Routing & Navigation

---

## 1. Router Setup — `provideRouter()`

In modern Angular, routing uses the standalone API — no `RouterModule.forRoot()` needed.

### Step 1 — Define Routes
```ts
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
];
```

### Step 2 — Register in `app.config.ts`
```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

### Step 3 — Place `<router-outlet>` in Root Template
The `<router-outlet>` is where Angular renders the component matching the current URL.
```html
<nav>
  <a routerLink="/">Home</a>
</nav>
<router-outlet />
```

---

## 2. Route Types

### Component Route
```ts
{ path: 'home', component: HomeComponent }
```

### Redirect Route
```ts
{ path: '', redirectTo: '/home', pathMatch: 'full' }
```

### Wildcard Route (404) — Catch Undefined URLs
```ts
{ path: '**', component: NotFoundComponent }
```
> [!IMPORTANT]
> Route order matters — Angular matches **top-to-bottom**. The wildcard `**` route must always be **last**.

---

## 3. Programmatic Navigation & Route Parameters

Route parameters embed variable parts in the URL:
```ts
{ path: 'product/:id', component: ProductDetailComponent }
```

### Reading Parameters (Modern Way)
By enabling `withComponentInputBinding()`, router parameters are automatically passed as component inputs!

```ts
// app.config.ts
provideRouter(routes, withComponentInputBinding())
```

```ts
// product-detail.component.ts
export class ProductDetailComponent {
  // If the URL is /product/42, this input automatically receives "42"!
  id = input.required<string>();
}
```

### Programmatic Navigation
```ts
import { Router } from '@angular/router';

export class LoginComponent {
  private router = inject(Router);

  goToProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }
}
```

---

## 4. Child Routes & Nested `<router-outlet>`

Child routes organise related views within a parent layout:

```ts
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent, // This component MUST have a <router-outlet>
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];
```

---

## 5. Functional Route Guards

Guards are **functions** used to protect routes.

### Auth Guard
```ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = true; // Check your real auth service

  if (isLoggedIn) {
    return true;
  }
  return router.parseUrl('/login'); // Redirect
};
```

### Applying Guards
```ts
{ path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] }
```

---

## 6. Lazy Loading

Lazy loading delays fetching a component's code until the user navigates to it, reducing initial bundle size:

```ts
{
  path: 'admin',
  loadComponent: () => import('./admin/admin.component').then(c => c.AdminComponent)
}
```

---

## 7. View Transitions — Smooth Page Animations

Angular integrates with the browser's native **View Transitions API**:

```ts
import { provideRouter, withViewTransitions } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
  ],
};
```
**How it works:** The browser captures a screenshot of the old page, updates the DOM, captures the new page, and animates between them. Zero custom CSS needed for a basic cross-fade!

---

## 🧪 Practice Labs

### Lab 1 — Multi-Page SPA with Nested Routes (45 min)
1. Create pages: Home (`/`), Products (`/products`), About (`/about`)
2. Add nested routes: Product List and Product Detail (`/products/:id`)
3. Add a 404 page for `**`
4. Use `RouterLinkActive` with `ariaCurrentWhenActive="page"` to highlight the active navbar link.

### Lab 2 — Functional Route Guards (30 min)
1. Create `authGuard` with `CanActivateFn`.
2. Protect a `/checkout` route so that users cannot visit it without being logged in.

---

## 📝 Assignment: ShopAngular Project — Part 4

Let's add Routing to our e-commerce app!

### Requirements
1. Define the following routes in your `app.routes.ts`:
   - `/` -> Redirects to `/products`
   - `/products` -> `ProductListComponent`
   - `/products/:id` -> `ProductDetailComponent`
   - `/cart` -> `CartComponent`
   - `**` -> `NotFoundComponent`
2. Update your `AppComponent` HTML to have a Navbar with `routerLink`s, and a `<router-outlet>` below it.
3. In `app.config.ts`, ensure `withComponentInputBinding()` and `withViewTransitions()` are enabled.
4. When a user clicks a product on the list, use `routerLink` to navigate to its Detail page!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Routing Overview | https://angular.dev/guide/routing |
| Angular Component Input Binding | https://angular.dev/guide/routing/common-router-tasks#getting-route-information |

---

## 📌 Key Takeaways
- `provideRouter(routes)` in `app.config.ts` replaces `RouterModule.forRoot()`.
- Use `routerLink` instead of `href` to navigate without reloading the page.
- **`withComponentInputBinding()`** is the modern way to read route parameters.
- **Functional guards** (`CanActivateFn`) are the modern way to protect routes.
- **Lazy loading** with `loadComponent` reduces initial bundle size dramatically.
- **`withViewTransitions()`** adds smooth page animations with zero custom CSS.

---

**Next Lecture:** [Lecture 27 — Angular Services & Dependency Injection](./27%20-%20Angular%20Services%20%26%20Dependency%20Injection.md)