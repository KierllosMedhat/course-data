# Lecture 23 — Angular Architecture & First Application

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain Angular's philosophy and how it differs from React and Vue
- Install the Angular CLI and use its core commands confidently
- Navigate and understand an Angular v21 project structure
- Build standalone components using the `@Component` decorator
- Use Angular's template syntax: interpolation, property binding, and event binding
- Apply the modern control flow syntax: `@if`, `@for`, and `@switch`
- Fetch simple data reactively using the new `resource()` API

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Angular's identity: platform, framework, toolset
2. Angular vs React vs Vue — choosing the right tool
3. Angular CLI deep-dive — your daily driver
4. Project structure in Angular v21 (Zoneless, Standalone)
5. The `@Component` decorator — anatomy of a component
6. Template syntax & Modern Control Flow
7. Reactive Data Fetching with `resource()`

### Part 2 — Practice & Lab (~90–120 min)
1. Generate and explore an Angular v21 project
2. Build a "Hello Angular" app with nested components
3. ShopAngular Project Part 1: Product Listing

---

## 1. What Is Angular?

### The Plain-English Explanation — Starting from Zero

Before any code, let's establish what Angular *actually is* and why it exists.

**The problem Angular solves:** Building large web applications is hard. If every developer on a team makes different decisions about how to organise code, handle forms, fetch data, navigate between pages, and manage state — the codebase quickly becomes an unmaintainable mess. New developers joining the team face a steep learning curve because every project is structured differently.

**Angular is a solution to this problem.** Angular is a **comprehensive, opinionated framework** for building web applications. It is built and maintained by Google, and it has been powering enterprise-grade applications since 2016.

**What "opinionated" means:** Angular has a specific, recommended way to do almost everything. This can feel constraining at first — like a strict teacher. But it means that all Angular projects look and feel the same. Joining a new Angular team is much easier because the folder structure, patterns, and naming conventions are familiar.

**What "comprehensive" means:** Angular ships with everything you need built in:
- A **router** for navigating between pages (no need to find a third-party library)
- An **HTTP client** for fetching data from APIs
- A **forms library** for handling user input and validation
- A **testing framework** integration
- A **build system** via the Angular CLI

**Real-world analogy:**
Imagine building a house. You have two approaches:
- **React** hands you a bag of high-quality bricks and says: "Figure out the rest." You need to find your own roof tiles (router), plumbing (HTTP), doors (forms), and electrical wiring (state management) from different third-party suppliers. Each supplier has their own API and documentation.
- **Angular** is like a complete, pre-approved construction kit. It comes with the bricks AND the roof tiles, plumbing, doors, and electrical wiring — all designed to work together from the start. You follow the building code (Angular conventions) and you get a solid, consistent structure.

### Key Characteristics of Angular v21

Angular v21 represents a major modernisation of the framework — it looks quite different from Angular 1-16:

| Aspect | Angular v21 | What It Means for You |
|--------|-------------|----------------------|
| **Language** | TypeScript (mandatory) | Full type safety everywhere |
| **Rendering** | Ivy renderer | Fast, tree-shakable compiled output |
| **Reactivity** | **Signals** (primary) | Predictable, fine-grained change detection |
| **Change Detection** | **Zoneless** by default | No hidden magic — updates are explicit |
| **Architecture** | **Standalone components** | Simpler, no NgModules needed |
| **Testing** | **Vitest** (default) | Fast, modern unit tests |

> [!NOTE]
> If you've heard of "Zone.js" or "NgModules" — these are OLD Angular concepts. Modern Angular (v17+) is dramatically simpler. We will not use `NgModule` at all in this course. Every component is **standalone**.

### Angular's Three Roles

Angular acts as three things simultaneously:

```
┌─────────────────────────────────────────────────────────────┐
│                        ANGULAR                              │
│                                                             │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│   │  Framework   │  │   Platform   │  │   Toolset    │    │
│   │              │  │              │  │              │    │
│   │  Components  │  │  Web Apps    │  │  CLI         │    │
│   │  Directives  │  │  Mobile (PWA)│  │  Schematics  │    │
│   │  Pipes       │  │  SSR (Next)  │  │  Dev Server  │    │
│   │  Services    │  │  Desktop     │  │  Build Tools │    │
│   └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

- **Framework:** The building blocks you use to build your UI (Components, Directives, Pipes, Services).
- **Platform:** Angular apps can target web browsers, be server-side rendered (SSR), or deployed as Progressive Web Apps (PWAs).
- **Toolset:** The Angular CLI automates code generation, serving, building, and testing.

### Why Does This Matter?

Understanding that Angular is a *complete system* — not just a UI library — changes how you think about it. Learning Angular means learning one integrated system rather than assembling a patchwork of different libraries. The trade-off is a steeper initial learning curve, but a much more structured and maintainable codebase in the long run.

### Section Recap
- Angular is a **batteries-included, opinionated framework** — everything you need is built in.
- Modern Angular uses **Standalone Components** (no NgModules), **Signals** for reactivity, and **Zoneless** change detection.
- Angular plays three roles: UI **framework**, deployment **platform**, and development **toolset**.

---

## 2. Angular vs React vs Vue — Choosing the Right Tool

Before diving into code, let's understand the landscape of modern front-end frameworks so you can make informed decisions:

| Feature | Angular (v21) | React (v19+) | Vue (v3.5+) |
|---------|--------------|--------------|-------------|
| **Type Safety** | TypeScript mandatory | Optional TS | Optional TS |
| **Router** | Built-in, full-featured | React Router (3rd party) | Vue Router (official) |
| **Forms** | Built-in, two approaches | Formik/RHF (3rd party) | VeeValidate (3rd party) |
| **HTTP Client** | Built-in | fetch/axios (3rd party) | fetch/axios (3rd party) |
| **State Management** | Signals + Services | Zustand, Redux, Recoil | Pinia |
| **Learning Curve** | Steeper (more concepts upfront) | Moderate | Gentle |
| **Best For** | Enterprise, large teams | Flexible apps, large ecosystem | Small/medium apps |
| **Backed By** | Google | Meta | Community (Evan You) |

### When to Choose Each

**Choose Angular when:**
- Building large-scale enterprise applications
- Working in large teams where consistency and conventions are critical
- The project requires a strict TypeScript-first, structured architecture
- You want everything handled by one integrated system

**Choose React when:**
- You need maximum flexibility in choosing your own libraries
- You want access to the largest ecosystem of third-party components
- Your team already has React expertise
- You're building an app where the UI is highly custom

**Choose Vue when:**
- You want a gentle learning curve with gradual TypeScript adoption
- You're building small to medium-sized applications
- You prefer a simpler, more approachable template syntax

> [!NOTE]
> In this course, we use Angular because enterprise employers highly value Angular expertise, and because Angular's conventions teach you software architecture patterns (Dependency Injection, Services, Reactive Programming) that transfer to any framework.

---

## 3. The Angular CLI — Your Daily Driver

### What Is the Angular CLI?

The **Angular CLI** (Command Line Interface) is a command-line tool that automates the repetitive parts of Angular development. Without the CLI, you'd have to manually:
- Create every file and write all the boilerplate code
- Configure TypeScript, Webpack, testing, and linting
- Wire up imports between files

The CLI does all of this for you with a single command.

**Real-world analogy:** The Angular CLI is like a professional kitchen with all the prep equipment already set up. Instead of fetching ingredients from scratch, chopping everything by hand, and heating the oven yourself, you just say what dish you want and the kitchen has everything ready.

### Step-by-Step Installation

Follow these steps exactly:

**Step 1: Install the Angular CLI globally on your machine**
```bash
npm install -g @angular/cli@latest
# The -g flag installs it globally, so you can use 'ng' anywhere
```

**Step 2: Verify the installation worked**
```bash
ng version
# Should show Angular CLI version 17 or higher
```

**Step 3: Create a new Angular application**
```bash
ng new shop-angular
# The CLI will ask:
# ? Which stylesheet format would you like to use? → Select "CSS"
# ? Do you want to enable Server-Side Rendering? → Select "No" (for now)
```

**Step 4: Navigate into the project and start the development server**
```bash
cd shop-angular
ng serve --open
# --open automatically opens your browser to http://localhost:4200
```

**What happens when you run `ng serve`:**
1. The CLI starts a development server at `http://localhost:4200`.
2. Angular compiles your TypeScript files to JavaScript.
3. The browser displays your app.
4. **Hot Module Replacement (HMR):** When you save any file, the CLI recompiles only that file and refreshes the browser instantly — no need to manually refresh.

### Core CLI Commands Reference

```bash
# ── Development ──────────────────────────────────────────────
ng serve                              # Start the dev server
ng serve --open                       # Also open the browser automatically
ng serve --port 3000                  # Use a custom port

# ── Code Generation ──────────────────────────────────────────
ng generate component my-component   # Create a component
ng g c my-component                  # Shorthand (g = generate, c = component)
ng g s my-service                    # Generate a service
ng g d my-directive                  # Generate a directive
ng g p my-pipe                       # Generate a pipe
ng g guard my-guard                  # Generate a route guard
ng g interface my-model              # Generate a TypeScript interface

# ── Dry Run: Preview without Creating ────────────────────────
ng g c product-list --dry-run        # Show what would be created — no files made

# ── Build & Test ─────────────────────────────────────────────
ng build                             # Development build
ng build --configuration production  # Optimised production build (minified)
ng test                              # Run unit tests (uses Vitest in modern Angular)
ng lint                              # Lint the project with ESLint

# ── Info ─────────────────────────────────────────────────────
ng version                           # Show Angular CLI and package versions
ng help                              # List all available commands
```

> [!TIP]
> Always run `ng g c my-component --dry-run` first when you're not sure what a `ng generate` command will create. It shows you a preview without writing any files.

### Common Mistakes & How to Avoid Them

```bash
# ❌ MISTAKE: Running 'ng new' inside an existing Angular project
# (causes nested project structure issues)
cd my-app        # Already inside an Angular project!
ng new sub-app   # This creates a project inside a project — usually wrong!

# ✅ FIX: Run 'ng new' in a neutral parent folder, not inside another project
cd ..            # Go up one level, out of my-app
ng new sub-app   # Now creates a fresh, standalone project

# ❌ MISTAKE: Using 'href' for navigation instead of 'routerLink'
<a href="/products">Products</a>
# 'href' causes a full page reload — defeats the purpose of a Single Page App!

# ✅ FIX: Use routerLink for in-app navigation
<a routerLink="/products">Products</a>
# Navigates without reloading — fast!
```

### Section Recap
- Install the Angular CLI globally: `npm install -g @angular/cli@latest`
- Create a project: `ng new my-app` — follow the prompts
- Start the dev server: `ng serve --open`
- Generate code: `ng g c component-name`, `ng g s service-name`, etc.
- Use `--dry-run` to preview what `ng generate` would create before it writes files.

---

## 4. Project Structure — Angular v21

### The Biggest Change: No More `app.module.ts`

If you've seen older Angular tutorials or code, you may have encountered `app.module.ts` — a file that registered every component, directive, and service in a central `NgModule` class. This was the old way.

In **Angular v17+**, `NgModules` are gone. Components are now **standalone** by default — they declare their own dependencies directly in the `@Component` decorator. This eliminates a major source of confusion and boilerplate.

**Old vs New at a glance:**

```
OLD Angular (v1-v16):            NEW Angular (v17+):
──────────────────────────       ──────────────────────────────────────
AppModule                        ← Gone! No NgModule needed.
  declarations: [                @Component({
    AppComponent,                  standalone: true, ← default now
    HeaderComponent,               imports: [         ← declare deps here
    ...all components...             HeaderComponent,
  ],                                 NgClass,
  imports: [                         RouterOutlet,
    RouterModule,                  ],
    HttpClientModule,            })
    ...all modules...            export class AppComponent {}
  ]
```

### Folder Structure Walkthrough

When you run `ng new shop-angular`, this is what gets created:

```
shop-angular/
├── src/                             ← All your application code lives here
│   ├── app/
│   │   ├── app.component.ts        ← Root component (the entry point of your UI)
│   │   ├── app.component.html      ← Root template
│   │   ├── app.component.css       ← Root styles
│   │   ├── app.config.ts           ← App-wide configuration (replaces AppModule!)
│   │   └── app.routes.ts           ← Route definitions
│   ├── assets/                     ← Static files: images, fonts, icons
│   ├── index.html                  ← The one and only HTML page (SPA!)
│   ├── main.ts                     ← Entry point — bootstraps the Angular app
│   └── styles.css                  ← Global CSS (not scoped to any component)
├── angular.json                    ← Angular CLI configuration
├── package.json                    ← NPM dependencies
├── tsconfig.json                   ← TypeScript compiler configuration
└── tsconfig.app.json               ← TypeScript config specific to the app
```

### The Three Most Important Files

**`src/main.ts` — The Entry Point**

```ts
// This is the FIRST file that executes when the browser loads your Angular app.
// It has one job: start (bootstrap) the application.

import { bootstrapApplication } from '@angular/platform-browser';
// bootstrapApplication: the Angular function that starts everything

import { appConfig } from './app/app.config';
// appConfig: the configuration object that customises Angular's behaviour

import { AppComponent } from './app/app.component';
// AppComponent: the ROOT component — the top of the component tree

// Start the application!
// 1. Read appConfig (which providers/features to enable)
// 2. Find <app-root> in index.html
// 3. Render AppComponent there
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err)); // Log any startup errors
```

**`src/app/app.config.ts` — Application Configuration**

```ts
// This file replaces the old AppModule. It configures Angular-wide features.

import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter }     from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes }            from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZonelessChangeDetection: use the modern change detection (no Zone.js!)
    // This means Angular ONLY updates the UI when signals/effects say it should.
    provideZonelessChangeDetection(),

    // provideRouter: activate Angular's routing with our route definitions
    provideRouter(routes),

    // provideHttpClient: make the HttpClient service available for injection
    // so any service can use it to make API calls
    provideHttpClient(),
  ]
};
```

**`src/index.html` — The Single HTML Page**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>ShopAngular</title>
    <!-- Angular fills in styles and scripts automatically -->
  </head>
  <body>
    <!-- This is the only HTML element you place manually! -->
    <!-- Angular replaces <app-root> with AppComponent's template. -->
    <app-root></app-root>
  </body>
</html>
```

### The Bootstrap Process — Step by Step

```
Step 1: Browser loads index.html
        ↓
Step 2: Browser finds and loads the compiled JavaScript bundle
        ↓
Step 3: main.ts runs → calls bootstrapApplication(AppComponent, appConfig)
        ↓
Step 4: Angular reads appConfig → activates router, HTTP, zoneless detection
        ↓
Step 5: Angular processes the @Component decorator on AppComponent
        ↓
Step 6: Angular finds <app-root> in index.html
        ↓
Step 7: Angular renders AppComponent's template inside <app-root>
        ↓
Step 8: Your app is visible in the browser! 🎉
```

> [!TIP]
> **Why is it called a "Single Page App" (SPA)?** Because `index.html` is the ONLY HTML file. When you navigate to `/products` or `/cart`, Angular doesn't load a new HTML file from the server. Instead, it intercepts the navigation and dynamically swaps out the UI — all within the same `index.html` page.

---

## 5. The `@Component` Decorator — Anatomy of a Component

### What Is a Component? Starting from Zero

A **component** is the fundamental building block of Angular's UI. Before we look at code, let's understand the concept.

Think of a webpage as a tree of LEGO bricks, where each brick is a component:

```
┌───────────────────────────────────────────────────────┐
│  AppComponent          ← Root (the whole page)        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  NavbarComponent                                │   │
│  │  ┌─────────────┐  ┌────────────────────────┐   │   │
│  │  │ LogoComponent│  │ NavLinksComponent      │   │   │
│  │  └─────────────┘  └────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ProductListComponent                           │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐     │   │
│  │  │ProductCard│ │ProductCard│ │ProductCard│     │   │
│  │  └───────────┘ └───────────┘ └───────────┘     │   │
│  └─────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

Each `ProductCard` knows nothing about `Navbar` — they are completely independent. This **isolation** is one of the most important architectural benefits of components.

**A component has three parts:**
1. **Template (HTML)** — What the user sees.
2. **Styles (CSS)** — How it looks (automatically scoped — won't leak to other components!).
3. **Class (TypeScript)** — The data (signals, properties) and behaviour (methods).

### The `@Component` Decorator — Every Property Explained

```ts
// FILE: src/app/app.component.ts

// Import the tools we need from Angular's core package
import {
  Component,              // The decorator that turns a class into a component
  signal,                 // Creates a reactive Signal value
  computed,               // Creates a derived Signal value
  ChangeDetectionStrategy // Controls WHEN Angular re-renders this component
} from '@angular/core';

// Import child components we want to use in this template
import { HeaderComponent }      from './header/header.component';
import { ProductListComponent } from './product-list/product-list.component';

// The @Component decorator is the MOST IMPORTANT part.
// It configures what this component IS and how it LOOKS.
@Component({
  // ── 1. SELECTOR ──────────────────────────────────────────────────────
  // The CSS selector for this component.
  // <app-root> in index.html will be replaced by this component's template.
  // Convention: use 'app-' prefix to avoid conflicts with native HTML elements.
  selector: 'app-root',

  // ── 2. TEMPLATE ──────────────────────────────────────────────────────
  // For complex templates, reference an external .html file:
  templateUrl: './app.component.html',
  // For simple templates, write HTML directly (inline):
  // template: `<h1>{{ title }}</h1>`,

  // ── 3. STYLES ────────────────────────────────────────────────────────
  // External CSS file:
  styleUrl: './app.component.css',
  // OR inline styles:
  // styles: [`h1 { color: navy; font-size: 2rem; }`],

  // ── 4. IMPORTS ───────────────────────────────────────────────────────
  // List ALL other standalone components/directives/pipes used in THIS template.
  // This replaces the old NgModule 'declarations' and 'imports' arrays.
  imports: [
    HeaderComponent,      // <app-header> can now be used in this template
    ProductListComponent, // <app-product-list> can be used in this template
  ],

  // ── 5. CHANGE DETECTION STRATEGY ─────────────────────────────────────
  // OnPush = Angular ONLY re-renders this component when:
  // - An input signal changes
  // - A computed signal changes
  // - An event is triggered inside the component
  // This is the recommended setting when using Signals.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // ── Component Properties (Data) ──────────────────────────────────────
  title = 'My Shop App'; // Plain string — not reactive (doesn't change)

  // signal() creates a REACTIVE value. When this changes, the template auto-updates.
  // 0 is the initial value.
  count = signal(0);

  // computed() creates a DERIVED value — automatically recalculates when 'count' changes.
  // () => this.count() * 2 is the formula.
  doubled = computed(() => this.count() * 2);

  // ── Component Methods (Behaviour) ────────────────────────────────────
  increment(): void {
    // signal.update() applies a function to the current value.
    // 'current' is the current value; we return current + 1 as the new value.
    this.count.update(current => current + 1);
  }
}
```

The corresponding template file:

```html
<!-- FILE: src/app/app.component.html -->

<!-- Use the HeaderComponent by its selector 'app-header' -->
<!-- Angular renders HeaderComponent's template here -->
<app-header />

<!-- Main content area -->
<main>
  <!-- {{ expression }} is called INTERPOLATION — evaluates the expression and displays it -->
  <h1>{{ title }}</h1>

  <!-- Note: Signal values MUST be called like functions: count() not count -->
  <p>Count: {{ count() }}</p>
  <p>Doubled: {{ doubled() }}</p>

  <!-- (click) is event binding — calls increment() when the button is clicked -->
  <button (click)="increment()">Add One</button>

  <!-- Use ProductListComponent by its selector 'app-product-list' -->
  <app-product-list />
</main>
```

### Style Scoping — How Angular Keeps CSS Isolated

Angular **automatically scopes** component CSS so styles never accidentally affect other components.

**How it works:** Angular adds a unique attribute to every element in a component's template, and rewrites the CSS rules to only match elements with that attribute.

```
Your code:             Angular compiles to:
──────────────         ─────────────────────────────────────────
<div class="card">  →  <div class="card" _nghost-app-c1>

.card { color: red }   .card[_nghost-app-c1] { color: red }
                       ↑ Only matches cards in THIS component!
```

This means you can write `.card { color: red }` in ten different components and they won't interfere with each other — each component's `card` style only affects elements inside that component.

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE 1: Forgetting to call signal values as functions
@Component({
  template: `<p>{{ count }}</p>` // ❌ count is not called — displays the Signal OBJECT, not the value!
})
class MyComp {
  count = signal(42);
}

// ✅ FIX: Always call signals like functions: count()
@Component({
  template: `<p>{{ count() }}</p>` // ✅ Displays 42
})
class MyComp {
  count = signal(42);
}

// ❌ MISTAKE 2: Forgetting to add a component to the 'imports' array
@Component({
  imports: [],  // ❌ Missing ProductCardComponent!
  template: `<app-product-card />`
  // TypeScript error: 'app-product-card' is not a known element
})

// ✅ FIX: Add every used component to imports
@Component({
  imports: [ProductCardComponent], // ✅ Now Angular knows about this component
  template: `<app-product-card />`
})

// ❌ MISTAKE 3: Using the component selector as an HTML class or ID
// In the template: <div class="app-root">  ← this is NOT how you use components!
// In the template: <div id="app-root">     ← this is also wrong!

// ✅ FIX: Use the selector exactly as specified in @Component({ selector: 'app-root' })
// In the template: <app-root />            ← this is correct!
```

### Section Recap
- A component = **TypeScript class** + **HTML template** + **CSS styles**.
- The `@Component` decorator configures: `selector`, `template`, `styles`, `imports`, `changeDetection`.
- Add `ChangeDetectionStrategy.OnPush` when using Signals — it's more performant.
- CSS is automatically **scoped** per component — styles never leak to other components.
- Always call signal values as functions: `this.count()` and `{{ count() }}` in templates.

---

## 6. Template Syntax & Modern Control Flow

### The Three Core Binding Mechanisms

Angular templates are HTML with special syntax for connecting the template to the component class.

**The fundamental data flow pattern:**
```
TypeScript Class (the source of truth)    ←→    Template (the view)
─────────────────────────────────────           ────────────────────────
Properties/Signals           ───→    Displayed via Interpolation {{ }}
Properties/Signals           ───→    Set DOM properties via [property]="value"
Events                       ←───    Raised by (event)="handler()"
Two-way (model inputs)       ←──→    Managed via [(property)]="value"
```

**ASCII diagram — binding directions:**

```
  Component Class                         Template (HTML)
  ───────────────                         ───────────────
  title = "Hello"    →  [data out]  →    {{ title }}         Interpolation
  imageUrl = "..."   →  [data out]  →    [src]="imageUrl"    Property Binding
  method()           ←  [data in]   ←    (click)="method()"  Event Binding
  count = signal(0)  ↔  [two-way]   ↔    [(count)]="count"   Two-way (models)
```

### Interpolation `{{ }}`

Interpolation evaluates a TypeScript expression and displays its string representation:

```html
<!-- In the component class: title = 'My Shop' -->
<h1>{{ title }}</h1>                     <!-- "My Shop" -->

<!-- For signals, always call them: count() -->
<p>Items: {{ cartItems() }}</p>          <!-- e.g. "3" -->

<!-- You can use expressions, not just variables: -->
<p>Tax: {{ price() * 0.2 | number:'1.2-2' }}</p>   <!-- Calculates and formats inline -->
<p>Hello, {{ user()?.name ?? 'Guest' }}</p>          <!-- Optional chaining + nullish coalescing -->
```

### Property Binding `[property]="expression"`

Property binding sets a DOM property to the value of a TypeScript expression. Note: properties (not attributes):

```html
<!-- Set the 'src' DOM property to the value of 'product.imageUrl' -->
<img [src]="product.imageUrl" [alt]="product.name">

<!-- Set the 'disabled' DOM property to a boolean signal value -->
<button [disabled]="isLoading()">Save</button>

<!-- Conditionally add/remove a CSS class using [class.className]="booleanExpression" -->
<div [class.active]="isSelected()">Card</div>
<div [class.on-sale]="product.onSale">Product</div>

<!-- Set an inline style using [style.property]="value" -->
<p [style.color]="textColor">Hello</p>
<p [style.font-size.px]="fontSize()">Sized text</p>   <!-- .px adds the unit -->

<!-- Bind any HTML attribute using [attr.name] — for non-DOM-property attributes -->
<input [attr.aria-label]="'Search for ' + category()">
```

> [!TIP]
> **Property vs Attribute** — an important distinction:
> - `src`, `disabled`, `value`, `checked` are **DOM properties** — use `[src]`, `[disabled]`, etc.
> - `aria-*`, `data-*`, `colspan` are **HTML attributes** without a matching DOM property — use `[attr.aria-label]`, `[attr.colspan]`, etc.

### Event Binding `(event)="handler()"`

Event binding listens for DOM events and calls a method on the component class:

```html
<!-- Listen for click events -->
<button (click)="addToCart(product)">Add to Cart</button>

<!-- Listen for input events (user typing in a field) -->
<input (input)="onSearch($event)" placeholder="Search...">
<!-- $event is the native DOM Event object -->

<!-- Listen for specific key combinations -->
<input (keyup.enter)="submitSearch()">    <!-- Only when Enter key is pressed -->
<input (keydown.escape)="clearSearch()"> <!-- Only when Escape key is pressed -->

<!-- Listen for form submission -->
<form (ngSubmit)="onSubmit()">...</form>
```

### Modern Control Flow — `@if`, `@for`, `@switch`

Angular v17+ introduced a built-in control flow syntax. It replaces the old `*ngIf` and `*ngFor` structural directives.

**Why the change?**
- The old `*ngIf` syntax was confusing (the `*` had special meaning that wasn't obvious)
- `<ng-template>` for `else` blocks was verbose and hard to read
- The new syntax is intuitive — it looks like regular programming control flow

#### `@if` — Conditional Rendering

```html
<!-- Show different content based on a condition -->
@if (isLoggedIn()) {
  <!-- This block only renders when isLoggedIn() returns true -->
  <p>Welcome back, {{ user()?.name }}!</p>
  <button (click)="logout()">Log Out</button>
}
@else if (isLoading()) {
  <!-- Optional: another condition -->
  <p>Checking your session...</p>
}
@else {
  <!-- The fallback — shown when none of the above conditions are true -->
  <a routerLink="/login">Log In</a>
}
```

**Old vs New comparison:**
```html
<!-- ❌ OLD — confusing *ngIf with template reference -->
<p *ngIf="isLoggedIn; else loggedOut">Welcome!</p>
<ng-template #loggedOut><a href="/login">Log In</a></ng-template>

<!-- ✅ NEW — clean, readable, just like if/else in TypeScript -->
@if (isLoggedIn()) {
  <p>Welcome!</p>
} @else {
  <a routerLink="/login">Log In</a>
}
```

#### `@for` — List Rendering

```html
<!-- Render a list of products -->
<!-- 'track' is REQUIRED — it tells Angular how to identify each item for efficient updates -->
<ul>
  @for (product of products(); track product.id) {
    <!-- 'product' is available as a local variable inside the block -->
    <li>
      <img [src]="product.imageUrl" [alt]="product.name">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price | currency }}</p>
      <button (click)="addToCart(product)">Add to Cart</button>
    </li>
  } @empty {
    <!-- Shown when the list is empty -->
    <li class="empty-state">
      No products found. Try a different search.
    </li>
  }
</ul>
```

**Special variables available inside `@for`:**

```html
@for (item of items(); track item.id; let idx = $index) {
  <!-- $index: 0, 1, 2, ... (current position, 0-based) -->
  <!-- $first: boolean — true for the first item -->
  <!-- $last:  boolean — true for the last item -->
  <!-- $even:  boolean — true for even-indexed items (0, 2, 4...) -->
  <!-- $odd:   boolean — true for odd-indexed items (1, 3, 5...) -->
  <li [class.first]="$first" [class.last]="$last">
    {{ idx + 1 }}. {{ item.name }}
  </li>
}
```

> [!IMPORTANT]
> **`track` in `@for` is mandatory** — Angular will throw an error if you omit it. `track` tells Angular which property uniquely identifies each item so it can update only the changed items instead of re-rendering the whole list. Always use `track item.id` (or whichever unique identifier your objects have). Use `track $index` only for arrays of primitive values (strings, numbers) that have no unique ID.

#### `@switch` — Multiple Conditions

```html
@switch (order.status) {
  @case ('pending') {
    <span class="badge badge-yellow">⏳ Pending</span>
  }
  @case ('shipped') {
    <span class="badge badge-blue">📦 Shipped</span>
  }
  @case ('delivered') {
    <span class="badge badge-green">✅ Delivered</span>
  }
  @case ('cancelled') {
    <span class="badge badge-red">❌ Cancelled</span>
  }
  @default {
    <span class="badge">Unknown</span>
  }
}
```

### Common Mistakes & How to Avoid Them

```html
<!-- ❌ MISTAKE 1: Missing 'track' in @for -->
@for (item of items(); ) {   <!-- Syntax error — 'track' is required! -->
  <li>{{ item.name }}</li>
}

<!-- ✅ FIX: Always include track -->
@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
}

<!-- ❌ MISTAKE 2: Tracking by object reference (items re-created = whole list re-renders) -->
@for (item of items(); track item) {   <!-- 'item' is an object — reference changes on refetch! -->

<!-- ✅ FIX: Track by a stable unique ID, not the object itself -->
@for (item of items(); track item.id) {

<!-- ❌ MISTAKE 3: Setting a DOM attribute with property binding when it doesn't have a DOM property -->
<td [colspan]="3">...</td>   <!-- ❌ 'colspan' is an HTML attribute, not a DOM property! -->

<!-- ✅ FIX: Use [attr.] prefix for HTML-only attributes -->
<td [attr.colspan]="3">...</td>   <!-- ✅ Uses attribute binding -->
```

### Section Recap
- **Interpolation `{{ }}`** displays data. Call signals: `{{ count() }}`.
- **`[property]="value"`** sets DOM properties. **`[attr.name]="value"`** sets HTML attributes.
- **`(event)="handler()"`** listens for DOM events. `$event` is the native event object.
- **`@if`** replaces `*ngIf` — cleaner `if/else if/else` blocks.
- **`@for`** replaces `*ngFor` — always use `track item.id`.
- **`@switch`** replaces `[ngSwitch]` — clean multi-condition rendering.

---

## 7. Reactive Data Fetching with `resource()`

### The Problem — Manual State Management is Tedious

Fetching async data (like an API response) requires managing three separate states:
1. **Loading** — the request is in flight
2. **Success** — the data arrived
3. **Error** — something went wrong

Without `resource()`, you'd write this manually in every component:

```ts
// ❌ The old, verbose way — lots of boilerplate
export class ProductListComponent implements OnInit {
  isLoading = signal(false);   // Track loading state manually
  error     = signal<string | null>(null);  // Track errors manually
  products  = signal<Product[]>([]);  // Track data manually

  ngOnInit() {
    this.isLoading.set(true);
    fetch('https://api.example.com/products')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        this.products.set(data);
        this.isLoading.set(false);
      })
      .catch(err => {
        this.error.set(err.message);
        this.isLoading.set(false);
      });
  }
}
// That's 15+ lines just to fetch one list! Multiply by every component that fetches data...
```

### The Solution: `resource()` (Angular v19+)

`resource()` handles all three states automatically and exposes them as signals:

```ts
// FILE: src/app/product-list/product-list.component.ts

import { Component, resource } from '@angular/core';
// 'resource' is imported from '@angular/core'

import { CurrencyPipe } from '@angular/common';

// Define the shape of the data we expect from the API
interface Product {
  id:    number;
  title: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe],
  template: `
    <h2>Products</h2>

    <!-- State 1: Loading -->
    @if (productsResource.isLoading()) {
      <div class="spinner">⏳ Loading products...</div>
    }

    <!-- State 2: Error -->
    @else if (productsResource.error()) {
      <div class="error-state">
        <p>❌ Failed to load products.</p>
        <!-- .reload() manually triggers a fresh fetch -->
        <button (click)="productsResource.reload()">Try Again</button>
      </div>
    }

    <!-- State 3: Success — data is available -->
    @else {
      <ul class="product-grid">
        @for (product of productsResource.value(); track product.id) {
          <li class="product-card">
            <img [src]="product.image" [alt]="product.title">
            <h3>{{ product.title }}</h3>
            <p>{{ product.price | currency }}</p>
          </li>
        } @empty {
          <li>No products available.</li>
        }
      </ul>
    }
  `
})
export class ProductsComponent {
  // resource() automatically:
  // 1. Calls the 'loader' function on component initialization
  // 2. Sets isLoading() to true while the request is pending
  // 3. Sets value() to the returned data on success
  // 4. Sets error() to the thrown error on failure
  productsResource = resource<Product[], void>({
    // 'loader' is an async function that fetches the data.
    // It MUST return a Promise.
    loader: async () => {
      // Step 1: Make the HTTP request using the browser's native fetch API
      const response = await fetch('https://fakestoreapi.com/products');

      // Step 2: Check if the response was successful (status 200-299)
      // If not, throw an error — resource() will catch it and set .error()
      if (!response.ok) {
        throw new Error(`API error! Status: ${response.status}`);
      }

      // Step 3: Parse the JSON body and return it
      // The 'as Product[]' tells TypeScript the shape of the data
      return await response.json() as Product[];
    }
  });
}
```

### `resource()` — Reactive Re-fetching

The most powerful feature of `resource()` is **automatic re-fetching** when a signal dependency changes. If the `loader` function reads a signal, and that signal changes, `resource()` re-runs the loader automatically:

```ts
// Step 1: Create a signal that holds the current product ID
// (e.g., driven by the router URL — covered in Lecture 26)
export class ProductDetailComponent {
  // This signal holds which product's ID we want to view
  productId = signal(1); // Start with product ID 1

  // Step 2: resource() reads 'this.productId()' inside the loader.
  // Angular notices this dependency.
  productResource = resource({
    loader: async () => {
      // 'this.productId()' is READ here — resource() tracks this dependency!
      const id = this.productId();
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!response.ok) throw new Error(`Product ${id} not found`);
      return await response.json() as Product;
    }
  });

  // Step 3: When productId changes, resource() automatically re-fetches!
  nextProduct(): void {
    this.productId.update(id => id + 1);
    // ↑ This triggers automatic re-fetch for the next product!
  }

  prevProduct(): void {
    this.productId.update(id => Math.max(1, id - 1));
  }
}
```

### `resource()` API Reference

| Signal/Method | Type | What It Does |
|---------------|------|--------------|
| `.isLoading()` | `Signal<boolean>` | `true` while the request is in flight |
| `.value()` | `Signal<T \| undefined>` | The fetched data (`undefined` before first success) |
| `.error()` | `Signal<unknown>` | The thrown error, or `undefined` if no error |
| `.status()` | `Signal<ResourceStatus>` | `Idle`, `Loading`, `Resolved`, `Error`, `Reloading` |
| `.reload()` | `() => void` | Manually trigger a fresh fetch |

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE 1: Forgetting to handle the 'undefined' case of .value()
@Component({
  template: `
    <!-- If .value() is undefined (before data loads), .length will throw! -->
    <p>{{ productsResource.value().length }} products</p>   <!-- ❌ Error if undefined! -->
  `
})

// ✅ FIX: Always guard with @if or use the nullish coalescing operator
@Component({
  template: `
    <!-- Option A: Only show when data is available -->
    @if (productsResource.value(); as products) {
      <p>{{ products.length }} products</p>
    }
    <!-- Option B: Use fallback value -->
    <p>{{ (productsResource.value()?.length ?? 0) }} products</p>
  `
})

// ❌ MISTAKE 2: Using resource() without handling the loading/error states
@Component({
  template: `
    @for (p of productsResource.value(); track p.id) {
      <li>{{ p.name }}</li>
    }
    <!-- What happens when loading? Or when there's an error? Nothing visible! -->
  `
})
// ✅ FIX: Always handle all three states
@Component({
  template: `
    @if (productsResource.isLoading()) { <p>Loading...</p> }
    @else if (productsResource.error()) { <p>Error!</p> }
    @else { <!-- render list here --> }
  `
})

// ❌ MISTAKE 3: Forgetting 'async' on the loader function
productsResource = resource({
  loader: () => {          // ❌ Missing 'async'!
    return fetch('/api');  // Returns a Promise — resource() expects a Promise from async
  }
});
// ✅ FIX: loader MUST be async (or explicitly return a Promise)
productsResource = resource({
  loader: async () => {   // ✅ async/await works correctly
    const r = await fetch('/api');
    return r.json();
  }
});
```

### Section Recap
- `resource()` automatically manages loading, success, and error states as signals.
- Use `.isLoading()`, `.value()`, and `.error()` in your template for the three states.
- The `loader` function must be `async` and return a `Promise`.
- If the `loader` reads a signal, `resource()` **automatically re-fetches** when that signal changes.
- Use `.reload()` to manually trigger a fresh fetch (e.g., for a "Retry" button).

---

## 🧪 Practice Labs

### Lab 1: Generate and Explore an Angular v21 Project (30 min)

1. Run: `ng new angular-basics` (choose CSS, no SSR).
2. Open the project in VS Code and read these files carefully:
   - `src/main.ts` — trace the bootstrap sequence step by step.
   - `src/app/app.config.ts` — notice: no NgModule, just providers.
   - `src/app/app.component.ts` — read every `@Component` property.
3. Start the dev server: `ng serve --open`.
4. Modify the `title` property in `app.component.ts` and watch the browser update.
5. Add a `count = signal(0)` and a button that increments it. Verify the template shows the updated count.

### Lab 2: Nested Components (45 min)

1. Generate two new components:
   ```bash
   ng g c navbar
   ng g c footer
   ```
2. Add navigation links HTML to `navbar.component.html`.
3. Add copyright text to `footer.component.html`.
4. Import both into `AppComponent`'s `imports` array.
5. Use their selectors in `app.component.html`:
   ```html
   <app-navbar />
   <main><!-- your content --></main>
   <app-footer />
   ```
6. Verify both components render correctly.
7. Add CSS styles in `navbar.component.css` and verify they DON'T affect other components (CSS isolation!).

---

## 📝 Assignment: ShopAngular Project — Part 1

Build the foundation of **ShopAngular** — a full-stack e-commerce application you'll develop across Lectures 23–29.

### Requirements

**1. Generate the project:**
```bash
ng new shop-angular
# Choose: CSS, No SSR
```

**2. Create the Product interface** in `src/app/models/product.ts`:
```ts
export interface Product {
  id:          number;
  name:        string;
  price:       number;
  imageUrl:    string;
  description: string;
  onSale:      boolean;
}
```

**3. Generate:** `ng g c product-list`

**4. In `ProductListComponent`:**
- Create `products = signal<Product[]>([...])` with 5 hardcoded products.
- Use `@for` to display each product's name and price.
- Use `@if` inside the `@for` to show a `<span class="sale-badge">Sale!</span>` badge when `product.onSale` is `true`.
- Add an `@empty` block that shows "No products available."

**5. Import** `ProductListComponent` into `AppComponent` and add `<app-product-list />` to the template.

**6. Bonus:** Use `resource()` to fetch from `https://fakestoreapi.com/products`. Handle all three states (loading spinner, error message with retry button, product list).

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Official Documentation | https://angular.dev |
| Angular Signals Guide | https://angular.dev/guide/signals |
| Angular `resource()` API | https://angular.dev/guide/signals/resource |
| Angular CLI Commands | https://angular.dev/tools/cli |
| Fake Store API (practice) | https://fakestoreapi.com |

---

## 📌 Key Takeaways

- **Angular** is a batteries-included, opinionated framework — router, HTTP, forms, testing all built in.
- Modern Angular (v17+) uses **Standalone Components** — no NgModules, no `declarations` array.
- The **bootstrap sequence**: `index.html` → `main.ts` → `appConfig` → `AppComponent` → your UI.
- The `@Component` decorator configures: `selector`, `template/templateUrl`, `styles/styleUrl`, `imports`, `changeDetection`.
- CSS is automatically **scoped** per component — styles never leak to other components.
- **Interpolation `{{ }}`**, **Property Binding `[x]`**, and **Event Binding `(e)`** are the three core binding mechanisms.
- Use **`@if`**, **`@for`** (with `track`!), and **`@switch`** for control flow — not `*ngIf`/`*ngFor`.
- **`resource()`** handles loading/error/data states automatically — zero manual state management.

---

**Next Lecture:** [Lecture 24 — Components, Data Binding & Lifecycle Hooks](./24%20-%20Components,%20Data%20Binding%20&%20Lifecycle%20Hooks.md)
