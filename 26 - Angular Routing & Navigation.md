# Lecture 26 — Angular Routing & Navigation

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain what a Single Page Application router does and why it exists
- Set up routing with `provideRouter()` and standalone routes
- Define component routes, redirects, and wildcard (404) routes
- Navigate with `routerLink`, `RouterLinkActive`, and the `Router` service
- Read route parameters and query parameters using `withComponentInputBinding()`
- Build nested layouts with child routes and `<router-outlet>`
- Protect routes with functional guards (`CanActivateFn`)
- Lazy-load features with `loadComponent`
- Enable smooth page transitions with `withViewTransitions()`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is a router? The SPA navigation problem
2. Router setup: `provideRouter()`, `Routes` array, `<router-outlet>`
3. Route types: component, redirect, wildcard/404
4. Navigation: `routerLink`, `RouterLinkActive`, programmatic navigation
5. Route parameters with `withComponentInputBinding()`
6. Child routes & nested outlets
7. Functional guards: `CanActivateFn`
8. Lazy loading: `loadComponent`
9. View Transitions API

### Part 2 — Practice / Lab (~90–120 min)
1. Multi-page SPA with nested routes and 404 handling
2. Functional route guards for authentication
3. ShopAngular Project Part 4: Routing & Navigation

---

## 1. What Is a Router? Starting from Zero

### The Problem: Navigation Without Page Reloads

In traditional websites, every link click sends a new request to the server. The server responds with a completely new HTML page, and the browser discards the old page and renders the new one. This is called a **Multi-Page Application (MPA)**.

The problem with MPAs: every navigation causes a full page reload — the browser downloads a new HTML document, parses CSS, re-runs JavaScript, and re-renders everything from scratch. This is slow and jarring.

**Single Page Applications (SPAs) solve this.** In an SPA, the browser loads ONE HTML file once. When the user clicks a "navigation link", Angular intercepts the click, updates the URL in the address bar, and **dynamically swaps out the UI** — no server round-trip, no page reload. The transition is instant.

**Real-world analogy:** Traditional websites are like TV channels — to change the content, you change the channel (reload the page). A SPA with a router is like a smart TV with an on-screen app — the interface changes instantly on the same screen without turning the TV off and on.

### How Angular's Router Works — The Simplified Flow

```
User action                    Angular Router                     Result
──────────────────────────     ────────────────────────────────   ──────────────────
1. Clicks <a routerLink="/products"> →  Router intercepts click    (no page reload!)
2. URL changes to /products    →  Router checks app.routes.ts     (finds the route)
3. Route matches ProductList   →  Router instantiates component   (or lazy-loads it)
4. <router-outlet> is updated  →  ProductListComponent renders    (user sees products)
```

**Why "intercepting" matters:** A normal `<a href="/products">` would trigger a full page reload. `routerLink` replaces the anchor's default behaviour with Angular's router navigation. The URL changes (so the back button works and users can bookmark the page) but the page doesn't reload.

---

## 2. Router Setup — The Three Required Pieces

### Overview

Angular routing requires three things to work:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  THREE PIECES OF ANGULAR ROUTING                                         │
│                                                                          │
│  1. app.routes.ts    ← The "route map" — what URL maps to what component │
│  2. app.config.ts    ← Register the router with provideRouter()          │
│  3. <router-outlet>  ← The "stage" where matched components render       │
└──────────────────────────────────────────────────────────────────────────┘
```

### Step 1 — Define the Routes (`app.routes.ts`)

```ts
// FILE: src/app/app.routes.ts

// Routes is an array type from @angular/router
// Each element defines: what URL → what component
import { Routes } from '@angular/router';

// Import the components that will be rendered for each route
import { HomeComponent }      from './home/home.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { CartComponent }      from './cart/cart.component';
import { NotFoundComponent }  from './not-found/not-found.component';

export const routes: Routes = [
  // REDIRECT: When path is exactly empty string (''), go to '/products'
  // 'full' pathMatch means: ONLY redirect if the ENTIRE path is '' (not any path starting with '')
  { path: '', redirectTo: '/products', pathMatch: 'full' },

  // COMPONENT ROUTE: When path is 'products', render ProductListComponent
  { path: 'products', component: ProductListComponent },

  // PARAMETERIZED ROUTE: ':id' is a route parameter (variable segment)
  // Matches: /products/1, /products/42, /products/abc-def, etc.
  // The value of ':id' is accessible inside ProductDetailComponent
  { path: 'products/:id', component: ProductDetailComponent },

  // SIMPLE ROUTE: No parameters, just a static path
  { path: 'cart', component: CartComponent },

  // WILDCARD ROUTE: '**' matches ANY path not matched above.
  // This MUST be the LAST route — Angular matches top-to-bottom!
  { path: '**', component: NotFoundComponent },
];
```

> [!IMPORTANT]
> **Route order matters!** Angular matches routes from **top to bottom** and stops at the first match. The wildcard `**` route must ALWAYS be last — otherwise it would match everything and no other route would ever work.

### Step 2 — Register the Router (`app.config.ts`)

```ts
// FILE: src/app/app.config.ts

import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import {
  provideRouter,               // Core router provider
  withComponentInputBinding,   // Enables automatic route param → component input binding
  withViewTransitions,         // Enables smooth page-to-page animations
} from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),

    // provideRouter(routes) — registers the router with your route definitions
    // withComponentInputBinding() — makes route params automatically available as component inputs
    //   (without this, you'd have to manually inject ActivatedRoute and subscribe to params)
    // withViewTransitions() — enables browser-native smooth page transitions (cross-fade by default)
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
    ),
  ]
};
```

### Step 3 — Place `<router-outlet>` in the Root Template

`<router-outlet>` is the placeholder where Angular renders the matched component:

```ts
// FILE: src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,      // Required: makes <router-outlet> available in the template
    RouterLink,        // Required: makes routerLink directive available
    RouterLinkActive,  // Required: makes routerLinkActive directive available
  ],
  template: `
    <!-- Navigation bar — always visible regardless of the current route -->
    <nav class="navbar">
      <!-- routerLink="/products" → navigates to /products WITHOUT reloading the page -->
      <!-- routerLinkActive="active" → adds the 'active' CSS class when this link's route is current -->
      <a routerLink="/products" routerLinkActive="active">Products</a>
      <a routerLink="/cart"     routerLinkActive="active">Cart</a>
    </nav>

    <!-- router-outlet: Angular renders the matched component HERE -->
    <!-- When URL is /products: ProductListComponent renders here -->
    <!-- When URL is /cart:     CartComponent renders here -->
    <!-- When URL is /products/42: ProductDetailComponent renders here -->
    <router-outlet />
  `
})
export class AppComponent {}
```

**Visual — how router-outlet works:**

```
  ┌───────────────────────────────────────────────────────────────┐
  │  AppComponent (always visible)                                │
  │  ┌─────────────────────────────────────────────────────────┐  │
  │  │  <nav>  Products | Cart  </nav>                         │  │
  │  └─────────────────────────────────────────────────────────┘  │
  │  ┌─────────────────────────────────────────────────────────┐  │
  │  │  <router-outlet />                                      │  │
  │  │                                                         │  │
  │  │  ← When /products → ProductListComponent renders here   │  │
  │  │  ← When /cart     → CartComponent renders here          │  │
  │  │  ← When /**       → NotFoundComponent renders here      │  │
  │  └─────────────────────────────────────────────────────────┘  │
  └───────────────────────────────────────────────────────────────┘
```

### Section Recap
- Angular routing requires three pieces: route definitions, `provideRouter()`, and `<router-outlet>`.
- `path: ''` with `redirectTo` handles the empty URL (root of the app).
- `path: '**'` (wildcard) is the 404 handler — must always be **last**.
- `<router-outlet>` is the rendering target — matched components appear here.
- Import `RouterOutlet`, `RouterLink`, `RouterLinkActive` in any component that uses routing.

---

## 3. Navigation — Links and Programmatic Navigation

### `routerLink` — Navigate Without Reloading

Use `routerLink` instead of `href` for all in-app navigation:

```html
<!-- ❌ WRONG: 'href' causes a full page reload — defeats the purpose of SPA! -->
<a href="/products">Products</a>

<!-- ✅ CORRECT: 'routerLink' navigates without reloading -->
<a routerLink="/products">Products</a>

<!-- Dynamic link using property binding (note the square brackets): -->
<a [routerLink]="['/products', product.id]">View Product</a>
<!-- Generates: /products/42 (if product.id is 42) -->

<!-- Link with query parameters: /products?category=shoes&sort=price -->
<a
  routerLink="/products"
  [queryParams]="{ category: 'shoes', sort: 'price' }"
>Shoes</a>
```

### `routerLinkActive` — Highlight the Current Route

```html
<!-- routerLinkActive="active" adds the 'active' CSS class when this route is current -->
<a routerLink="/products" routerLinkActive="active">Products</a>

<!-- For the HOME link (exact match needed — otherwise '/' matches everything!) -->
<a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>

<!-- Multiple CSS classes: -->
<a routerLink="/cart" routerLinkActive="active font-bold border-b-2">Cart</a>

<!-- Also works on parent elements (not just <a> tags): -->
<li routerLinkActive="active">
  <a routerLink="/products">Products</a>
</li>
```

### Programmatic Navigation — `Router.navigate()`

Sometimes you need to navigate in response to code logic (after a form submission, after login, etc.):

```ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({ selector: 'app-login', template: `...` })
export class LoginComponent {
  // Inject the Router service to navigate programmatically
  private router = inject(Router);

  async onLogin(credentials: { email: string; password: string }): Promise<void> {
    const success = await this.authService.login(credentials);

    if (success) {
      // Navigate to the products page after successful login
      // The array format matches the route definition: ['/products']
      await this.router.navigate(['/products']);
    } else {
      // Stay on login page — show error message
      this.errorMessage.set('Invalid email or password.');
    }
  }

  goToProduct(productId: number): void {
    // Navigate to a dynamic route: /products/42
    this.router.navigate(['/products', productId]);
  }

  goToSearchResults(term: string): void {
    // Navigate with query params: /products?search=laptop
    this.router.navigate(['/products'], {
      queryParams: { search: term }
    });
  }
}
```

### Common Mistakes & How to Avoid Them

```html
<!-- ❌ MISTAKE 1: Using href for in-app navigation -->
<a href="/cart">Go to Cart</a>
<!-- Causes full page reload — app state is lost! -->

<!-- ✅ FIX: Use routerLink -->
<a routerLink="/cart">Go to Cart</a>

<!-- ❌ MISTAKE 2: Using routerLink without importing RouterLink -->
<!-- Error: "Can't bind to 'routerLink' since it isn't a known property of 'a'" -->

<!-- ✅ FIX: Add RouterLink to the component's imports array -->
<!-- @Component({ imports: [RouterLink, RouterLinkActive, RouterOutlet] }) -->
```

---

## 4. Route Parameters — `withComponentInputBinding()`

### What Are Route Parameters?

A route parameter is a variable part of the URL that identifies a specific resource. For example:
- `/products/42` — product with ID 42
- `/users/john-doe` — user with username "john-doe"
- `/orders/ORD-2024-001` — a specific order

The `:id` in `{ path: 'products/:id', component: ProductDetailComponent }` is the parameter placeholder.

### The Modern Way: `withComponentInputBinding()`

When you enable `withComponentInputBinding()` in `app.config.ts`, Angular automatically **injects route parameters directly as component inputs**. This is a huge quality-of-life improvement — no more manually subscribing to `ActivatedRoute`.

```ts
// FILE: src/app/products/product-detail/product-detail.component.ts

import { Component, input, resource } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe],
  template: `
    <!-- Handle the three resource states -->
    @if (productResource.isLoading()) {
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading product details...</p>
      </div>
    }
    @else if (productResource.error()) {
      <div class="error-state">
        <h2>Product Not Found</h2>
        <p>The product with ID "{{ id() }}" does not exist.</p>
        <a routerLink="/products">← Back to Products</a>
      </div>
    }
    @else if (productResource.value(); as product) {
      <div class="product-detail">
        <img [src]="product.image" [alt]="product.title">
        <h1>{{ product.title }}</h1>
        <p class="price">{{ product.price | currency }}</p>
        <p class="description">{{ product.description }}</p>
        <button>Add to Cart</button>
      </div>
    }
  `
})
export class ProductDetailComponent {
  // Because withComponentInputBinding() is enabled in app.config.ts:
  // When the URL is /products/42, Angular automatically sets id() to "42"
  // Note: Route params are ALWAYS strings — convert to number when needed
  id = input.required<string>();

  // resource() reads this.id() — it's a reactive dependency.
  // When id() changes (user navigates to /products/43), resource() auto-re-fetches!
  productResource = resource<Product, string>({
    request: () => this.id(), // Declare 'id' as the reactive dependency
    loader: async ({ request: id }) => {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!response.ok) throw new Error(`Product ${id} not found`);
      return await response.json() as Product;
    }
  });
}
```

**In the parent list component:**

```html
<!-- app-product-list.component.html -->
@for (product of products(); track product.id) {
  <!-- routerLink navigates to /products/1, /products/2, etc. -->
  <a [routerLink]="['/products', product.id]" class="product-card">
    <img [src]="product.image" [alt]="product.title">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | currency }}</p>
  </a>
}
```

### Query Parameters — Filtering and Search

Query parameters (after the `?` in a URL) are used for non-essential information like search terms, filters, and pagination:

```
URL: /products?category=electronics&sort=price&page=2
               └─────────────────── query params ───────────────────┘
```

With `withComponentInputBinding()`, query params also become component inputs automatically:

```ts
@Component({ selector: 'app-product-list', template: `...` })
export class ProductListComponent {
  // Route: /products?category=electronics → category() = 'electronics'
  // Route: /products → category() = '' (default empty string)
  category = input('');    // Maps from query param 'category'
  sort     = input('');    // Maps from query param 'sort'
  page     = input(1, { transform: numberAttribute }); // Maps from 'page', converted to number

  // When category or sort changes, filteredProducts recomputes
  filteredProducts = computed(() => {
    let products = this.allProducts();
    if (this.category()) {
      products = products.filter(p => p.category === this.category());
    }
    // ... sort, paginate etc.
    return products;
  });
}
```

### The Old Way (For Context — Avoid in New Code)

```ts
// ❌ OLD WAY — manually subscribe to ActivatedRoute
import { ActivatedRoute } from '@angular/router';

export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  productId = signal('');

  ngOnInit() {
    // Observable-based — must subscribe and unsubscribe manually
    this.route.params.pipe(
      takeUntilDestroyed()
    ).subscribe(params => {
      this.productId.set(params['id']);
    });
  }
}
```

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE: Treating route params as numbers when they are strings
export class ProductDetailComponent {
  id = input.required<string>(); // ✅ Declared as string — correct

  loadProduct() {
    const numericId = this.id(); // ❌ This is still a string!
    fetch(`/api/products/${numericId}`); // Fine — string in URL is OK

    const parsed = parseInt(this.id()); // ✅ If you need a number, explicitly convert
  }
}

// ❌ MISTAKE: Forgetting withComponentInputBinding() in app.config.ts
// Symptom: id() is always undefined, params don't appear in the component
// Fix:
provideRouter(routes, withComponentInputBinding()) // ✅ Must include this!
```

### Section Recap
- Route params (`:id`) become component inputs automatically with `withComponentInputBinding()`.
- Route params are always **strings** — use `numberAttribute` transform if you need a number.
- Query params also become component inputs with `withComponentInputBinding()`.
- `resource()` with `request: () => this.id()` automatically re-fetches when the param changes.
- Avoid the old `ActivatedRoute.params.subscribe()` pattern in new code.

---

## 5. Child Routes & Nested `<router-outlet>`

### What Are Child Routes?

Child routes let you build **nested layouts**. A parent component provides shared UI (like a sidebar or tabs), and the child routes swap out just a portion of the page inside the parent's `<router-outlet>`.

**Real-world example: A dashboard with tabs**

```
URL: /dashboard/overview   → Dashboard layout + Overview tab content
URL: /dashboard/settings   → Dashboard layout + Settings tab content
URL: /dashboard/analytics  → Dashboard layout + Analytics tab content
```

The Dashboard component stays rendered (keeps its sidebar, header, etc.). Only the content in its `<router-outlet>` changes.

### Defining Child Routes

```ts
// FILE: src/app/app.routes.ts

export const routes: Routes = [
  // The parent route renders DashboardComponent
  {
    path: 'dashboard',
    component: DashboardComponent, // This component MUST have its own <router-outlet>
    children: [
      // When URL is /dashboard (exactly), redirect to /dashboard/overview
      { path: '', redirectTo: 'overview', pathMatch: 'full' },

      // When URL is /dashboard/overview → OverviewComponent renders INSIDE DashboardComponent
      { path: 'overview',   component: OverviewComponent  },

      // When URL is /dashboard/settings → SettingsComponent renders inside DashboardComponent
      { path: 'settings',   component: SettingsComponent  },

      // When URL is /dashboard/analytics
      { path: 'analytics',  component: AnalyticsComponent },
    ]
  },

  // The product detail has a child for reviews
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    children: [
      { path: 'reviews', component: ProductReviewsComponent }
      // URL: /products/42/reviews → ProductDetailComponent + ProductReviewsComponent
    ]
  }
];
```

### The Parent Component — Must Include `<router-outlet>`

```ts
// FILE: src/app/dashboard/dashboard.component.ts

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar — always visible while on /dashboard/* routes -->
      <aside class="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <!-- These links are RELATIVE: 'overview' → /dashboard/overview -->
          <a routerLink="overview"   routerLinkActive="active">Overview</a>
          <a routerLink="settings"   routerLinkActive="active">Settings</a>
          <a routerLink="analytics"  routerLinkActive="active">Analytics</a>
        </nav>
      </aside>

      <!-- The CHILD router-outlet: child components render here -->
      <!-- OverviewComponent / SettingsComponent / AnalyticsComponent -->
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class DashboardComponent {}
// This component has TWO router-outlets:
// 1. The ROOT <router-outlet> in AppComponent renders DashboardComponent.
// 2. DashboardComponent's OWN <router-outlet> renders its children.
```

---

## 6. Functional Route Guards — `CanActivateFn`

### What Is a Route Guard?

A **guard** is a function that runs before Angular navigates to a route. The guard decides: "Is the user allowed to visit this route?" If yes, navigation proceeds. If no, navigation is cancelled (and optionally, the user is redirected).

**Real-world analogy:** A bouncer at a nightclub. Before you enter (before the route activates), the bouncer checks your ID (your auth status). If you're old enough (authenticated), you get in. If not, you're turned away (redirected to login).

**When to use guards:**
- Protecting authenticated routes (the most common use case)
- Preventing navigation when unsaved changes would be lost
- Loading data before the component renders (resolvers)
- Role-based access control (only admins can access `/admin`)

### Creating a Guard

```ts
// FILE: src/app/guards/auth.guard.ts

// CanActivateFn: the type of a functional guard that controls route activation
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

// A functional guard is simply a function that matches the CanActivateFn signature
// Angular calls this function before navigating to the protected route
export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  // Inject services using inject() — works inside functional guards!
  const router = inject(Router);

  // In a real app, inject your AuthService here:
  // const authService = inject(AuthService);
  // const isLoggedIn = authService.isAuthenticated();

  // For now, simulate checking auth (replace with real logic):
  const isLoggedIn = !!localStorage.getItem('auth-token');

  if (isLoggedIn) {
    // Allow navigation — return true
    return true;
  }

  // Deny navigation — redirect to login.
  // 'router.parseUrl('/login')' returns a UrlTree that Angular understands as "redirect here"
  // We also preserve the attempted URL so after login we can redirect back:
  return router.parseUrl(`/login?returnUrl=${state.url}`);
  // state.url = the URL the user tried to visit (e.g. '/checkout')
};
```

### Applying Guards to Routes

```ts
// FILE: src/app/app.routes.ts

export const routes: Routes = [
  { path: 'products',  component: ProductListComponent },

  // canActivate: guards run BEFORE this route activates.
  // The checkout page requires authentication.
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard]   // Array — multiple guards can be listed
  },

  // Protect an entire section with one guard on the parent:
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard], // Must pass BOTH guards
    children: [
      { path: 'users',    component: AdminUsersComponent  },
      { path: 'orders',   component: AdminOrdersComponent },
    ]
  },

  { path: 'login',     component: LoginComponent    },
  { path: '**',        component: NotFoundComponent },
];
```

### `CanDeactivateFn` — Prevent Leaving With Unsaved Changes

```ts
// FILE: src/app/guards/unsaved-changes.guard.ts
import { CanDeactivateFn } from '@angular/router';

// Define an interface that components with unsaved changes must implement
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

// This guard runs WHEN THE USER TRIES TO LEAVE the current route
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component.hasUnsavedChanges()) {
    // Browser native confirm dialog — return false to cancel navigation
    return window.confirm(
      'You have unsaved changes. Are you sure you want to leave?'
    );
  }
  return true; // No unsaved changes — allow navigation
};
```

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE 1: Returning undefined instead of false when denying access
export const authGuard: CanActivateFn = () => {
  const isLoggedIn = false;
  if (!isLoggedIn) {
    // Forgot the return — returns undefined, which Angular treats as 'allow'!
    inject(Router).navigate(['/login']);
  }
  return true;
};

// ✅ FIX: Return router.parseUrl('/login') instead of calling navigate()
export const authGuard: CanActivateFn = () => {
  const isLoggedIn = false;
  if (!isLoggedIn) {
    return inject(Router).parseUrl('/login'); // ✅ Proper redirect
  }
  return true;
};

// ❌ MISTAKE 2: Forgetting to add the guard to the route definition
{ path: 'checkout', component: CheckoutComponent }
// ↑ No 'canActivate' — guard does nothing!

// ✅ FIX: Always add the guard to the route
{ path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] }
```

### Section Recap
- A guard is a **function** matching `CanActivateFn` — returns `true` (allow), `false` (deny), or a `UrlTree` (redirect).
- `canActivate: [guard1, guard2]` — all guards must pass for the route to activate.
- Apply a guard to a parent route to protect ALL child routes in one place.
- Use `router.parseUrl('/login')` to redirect inside a guard, not `router.navigate()`.
- `CanDeactivateFn` guards run when the user tries to LEAVE a route.

---

## 7. Lazy Loading — `loadComponent`

### Why Lazy Load?

When Angular builds your app for production, it bundles ALL components into JavaScript files. If a user visits your site but never goes to the Admin page, they still had to download all the Admin code. For large apps, this can make the initial load slow.

**Lazy loading** delays downloading a component's code until the user actually navigates to its route:

```
Without lazy loading:             With lazy loading:
─────────────────────────────     ─────────────────────────────────────
Initial bundle: 2.5 MB            Initial bundle: 0.8 MB (much faster!)
  - All components bundled in      - Only core components bundled
                                   Admin: downloaded ON DEMAND when visited
```

### `loadComponent` — Lazy Load a Single Component

```ts
// FILE: src/app/app.routes.ts

export const routes: Routes = [
  { path: 'products', component: ProductListComponent }, // Eagerly loaded (always bundled)

  // Lazy loaded — AdminComponent is in a SEPARATE chunk
  // Angular generates: admin.component-[hash].js
  // This file is only downloaded when the user navigates to /admin
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    //             ↑ Dynamic import — returns a Promise<Module>
    //                                                  ↑ Extract the named export
    canActivate: [authGuard]
  },

  // Lazy-loaded routes can have children too:
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      // Children can also be lazy-loaded individually:
      {
        path: 'analytics',
        loadComponent: () => import('./dashboard/analytics/analytics.component')
          .then(m => m.AnalyticsComponent)
      }
    ]
  },
];
```

### Lazy Loading a Group of Routes

```ts
// Instead of loading individual components, load an entire routes file lazily:
{
  path: 'shop',
  loadChildren: () => import('./shop/shop.routes').then(m => m.shopRoutes)
  // This loads the entire shop feature (with all its components) lazily as one chunk
}
```

> [!TIP]
> **When to lazy load:**
> - Any route the average user might NOT visit on their first session (admin panels, settings pages, rarely-used features)
> - Large components with many dependencies
> **Don't lazy load:**
> - The home page / landing page — users always visit this
> - Small components that are always needed

---

## 8. View Transitions — Smooth Page Animations

### What Are View Transitions?

Angular v17+ integrates with the browser's native **View Transitions API**. This automatically animates between routes — old content fades out, new content fades in — with zero custom CSS required for the basic effect.

```ts
// FILE: src/app/app.config.ts

import { provideRouter, withViewTransitions } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(), // ← One line enables smooth page transitions!
    ),
  ]
};
```

**How it works internally:**
1. User clicks a `routerLink`.
2. Browser captures a screenshot of the current page.
3. Angular updates the DOM (renders the new component).
4. Browser captures a screenshot of the new page.
5. Browser animates between the two screenshots (default: cross-fade).
6. The animation completes — user sees the new page.

### Customizing the Transition Animation

```css
/* src/styles.css */

/* Customize the cross-fade timing: */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 300ms;
  animation-timing-function: ease-in-out;
}

/* Create a slide-in effect instead of cross-fade: */
::view-transition-old(root) {
  animation: slide-out 300ms ease-in-out both;
}
::view-transition-new(root) {
  animation: slide-in 300ms ease-in-out both;
}

@keyframes slide-out { to { transform: translateX(-100%); } }
@keyframes slide-in  { from { transform: translateX(100%); } }
```

---

## 🧪 Practice Labs

### Lab 1 — Multi-Page SPA with Nested Routes (45 min)

1. Create pages: Home (`/`), Products (`/products`), About (`/about`)
2. Add nested routes under a `dashboard` parent:
   - `/dashboard/overview` → `OverviewComponent`
   - `/dashboard/settings` → `SettingsComponent`
3. Add a 404 page for `**`
4. Add `routerLinkActive="active"` to navbar links and style `.active` in CSS
5. Enable `withViewTransitions()` and notice the smooth page transitions

### Lab 2 — Auth Guard (30 min)

1. Create `authGuard` with `CanActivateFn`.
2. Add `{ path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] }`.
3. Test: trying to visit `/checkout` while not logged in should redirect to `/login`.
4. Simulate login with `localStorage.setItem('auth-token', 'test')` in the browser console and try again.

---

## 📝 Assignment: ShopAngular Project — Part 4

Let's add routing to our e-commerce app!

### Requirements

1. **Define routes in `app.routes.ts`:**
   - `/` → redirects to `/products`
   - `/products` → `ProductListComponent`
   - `/products/:id` → `ProductDetailComponent`
   - `/cart` → `CartComponent`
   - `**` → `NotFoundComponent`

2. **Update `AppComponent`:**
   - Add a navigation bar with `routerLink` links to Products and Cart
   - Add `<router-outlet />` below the navbar
   - Use `routerLinkActive="active"` to highlight the current page's link

3. **Enable features in `app.config.ts`:**
   - `withComponentInputBinding()` — for automatic param binding
   - `withViewTransitions()` — for smooth page transitions

4. **Product Detail page:**
   - `ProductDetailComponent` receives `id = input.required<string>()`
   - Use `resource()` to fetch from `https://fakestoreapi.com/products/{id}`
   - Handle loading, error, and success states

5. **Bonus — Lazy load the Cart and Admin routes**

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Routing Overview | https://angular.dev/guide/routing |
| Component Input Binding | https://angular.dev/guide/routing/common-router-tasks#getting-route-information |
| Route Guards | https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access |
| Lazy Loading | https://angular.dev/guide/ngmodules/lazy-loading |

---

## 📌 Key Takeaways

- Angular routing requires THREE pieces: route definitions, `provideRouter()`, and `<router-outlet>`.
- `routerLink` navigates WITHOUT reloading the page — never use `href` for in-app navigation.
- `routerLinkActive="active"` automatically adds a CSS class to the link matching the current route.
- **`withComponentInputBinding()`** makes route params and query params available as component `input()` signals — no more manual `ActivatedRoute` subscriptions.
- **`CanActivateFn`** guards protect routes — return `true` to allow, `UrlTree` to redirect.
- **`loadComponent`** lazy-loads component code on demand — reduces initial bundle size.
- **`withViewTransitions()`** enables browser-native page animations with zero custom CSS.
- Route order matters — wildcard `**` must ALWAYS be last.

---

**Next Lecture:** [Lecture 27 — Angular Services & Dependency Injection](./27%20-%20Angular%20Services%20%26%20Dependency%20Injection.md)