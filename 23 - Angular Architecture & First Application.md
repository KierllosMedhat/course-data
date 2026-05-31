# Lecture 23 — Angular Architecture & First Application

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain Angular's philosophy and how it differs from React and Vue
- Install the Angular CLI and use core commands
- Navigate and understand an Angular v21 project structure
- Build standalone components using the `@Component` decorator
- Use Angular template syntax: interpolation, property binding, event binding
- Apply the modern control flow syntax: `@if`, `@for`
- Fetch simple data reactively using the new `resource()` API

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Angular's identity: platform, framework, toolset
2. Angular vs React vs Vue comparison
3. Angular CLI deep-dive
4. Project structure in Angular v21 (Zoneless, Standalone)
5. The `@Component` decorator
6. Template syntax & Modern Control Flow
7. Reactive Data Fetching with `resource()`

### Part 2 — Practice & Lab (~90–120 min)
1. Generate and explore an Angular v21 project
2. Build a "Hello Angular" app with nested components
3. ShopAngular Project Part 1: Product Listing

---

## 1. What Is Angular?

**Angular** is an opinionated, batteries-included platform for building scalable web applications. It is maintained by Google.

While React gives you a library and says "figure out the rest," Angular gives you **everything** out of the box — a CLI, a router, form handling, HTTP client, testing tools, and more. 

### Key Characteristics (Angular v21)

| Aspect | Angular v21 |
|--------|------------|
| Language | TypeScript (mandatory) |
| Rendering | Component-based, Ivy renderer |
| Reactivity | **Signals** (primary state primitive) |
| Change Detection | **Zoneless** by default — no more `zone.js` |
| Architecture | **Standalone components** (NgModules are dead) |
| Testing | **Vitest** (default test runner) |

---

## 2. Angular vs React vs Vue

| Feature | Angular (v21) | React (v19+) | Vue (v3.5+) |
|---------|--------------|--------------|-------------|
| Language | TypeScript | JS/TS | JS/TS |
| Routing | Built-in | Third-party | Vue Router |
| Forms | Built-in | Third-party | Third-party |
| State Management | Signals, Services | Zustand, Redux | Pinia |
| Change Detection | Zoneless (Signals) | Manual (`setState`) | Proxy-based |

---

## 3. The Angular CLI

The **Angular CLI** is your primary tool for creating and managing apps.

```bash
npm install -g @angular/cli@latest
ng new my-app
cd my-app
ng serve --open
```

| Command | Shorthand | Purpose |
|---------|-----------|---------|
| `ng generate component my-comp` | `ng g c my-comp` | Scaffold a new component |
| `ng generate service my-srv` | `ng g s my-srv` | Scaffold a service |
| `ng build` | | Create a production build |

---

## 4. Project Structure (v21)

Modern Angular projects are much simpler than older versions.

- **No `app.module.ts`!** Apps are configured in `app.config.ts`.
- Components are **standalone** by default.

```ts
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig);
```

---

## 5. The `@Component` Decorator

Every Angular component is a TypeScript class decorated with `@Component`:

```ts
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root', 
  imports: [HeaderComponent], // Import dependencies directly here!
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'My Store';
}
```

---

## 6. Template Syntax & Modern Control Flow

### Interpolation & Bindings
- **Interpolation `{{ }}`:** Render data (`<h1>{{ title }}</h1>`)
- **Property Binding `[ ]`:** Pass data into a DOM property (`<img [src]="imageUrl">`)
- **Event Binding `( )`:** Listen to DOM events (`<button (click)="save()">`)

### Modern Control Flow (`@if`, `@for`)
Introduced in v17, this replaces `*ngIf` and `*ngFor`.

```html
@if (isLoading) {
  <p>Loading products...</p>
} @else {
  <ul>
    <!-- 'track' is required for performance -->
    @for (product of products; track product.id) {
      <li>{{ product.name }} - ${{ product.price }}</li>
    } @empty {
      <li>No products found.</li>
    }
  </ul>
}
```

---

## 7. Reactive Data Fetching with `resource()`

In Angular v19+, fetching asynchronous data into Signals became incredibly easy using the `resource()` API.

```ts
import { Component, resource } from '@angular/core';

@Component({
  selector: 'app-products',
  template: `
    @if (productsResource.isLoading()) {
      <p>Loading...</p>
    } @else if (productsResource.value(); as products) {
      <ul>
        @for (p of products; track p.id) { <li>{{ p.name }}</li> }
      </ul>
    }
  `
})
export class ProductsComponent {
  // resource() automatically executes the fetch and exposes it as a Signal!
  productsResource = resource({
    loader: async () => {
      const res = await fetch('https://api.example.com/products');
      return await res.json();
    }
  });
}
```

---

## 🧪 Practice Labs

### Lab 1: Generate an Angular v21 Project (30 min)
1. Run `ng new angular-basics`.
2. Inspect the files. Notice the lack of `app.module.ts`.
3. Start the server with `ng serve`.

### Lab 2: Nested Components (45 min)
1. Generate `ng g c navbar` and `ng g c footer`.
2. Import `NavbarComponent` and `FooterComponent` into `AppComponent`'s `imports` array.
3. Use their selectors `<app-navbar>` and `<app-footer>` in `app.component.html`.

---

## 📝 Assignment: ShopAngular Project — Part 1

We are building a full-stack e-commerce app: **ShopAngular**.

### Requirements
1. Generate a new Angular project: `ng new shop-angular`.
2. Generate a component: `ng g c product-list`.
3. In `ProductListComponent`, create a hardcoded array of `Product` objects (id, name, price, imageUrl).
4. Use the `@for` syntax in the HTML to loop over your products and display them as a list.
5. Use `@if` to show a "Sale!" badge if the product's price is under $20.
6. Import and display `<app-product-list>` inside `AppComponent`.
7. **Bonus:** Try using `resource()` to fetch fake products from `https://fakestoreapi.com/products`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Documentation | https://angular.dev |
| Angular Signals & `resource()` | https://angular.dev/guide/signals |

---

## 📌 Key Takeaways
- Angular is an opinionated, batteries-included framework.
- Modern Angular uses **Standalone Components**, meaning NgModules are no longer needed.
- Data flows down via `[propertyBinding]` and events flow up via `(eventBinding)`.
- Use **`@if`** and **`@for`** for control flow.
- Use **`resource()`** for easy, reactive asynchronous data fetching.

---

**Next Lecture:** [Lecture 24 — Components, Data Binding & Lifecycle Hooks](./24%20-%20Components,%20Data%20Binding%20%26%20Lifecycle%20Hooks.md)
