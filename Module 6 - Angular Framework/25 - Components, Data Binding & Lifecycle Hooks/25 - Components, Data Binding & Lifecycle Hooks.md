# Lecture 25 — Components, Data Binding & Lifecycle Hooks

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🛑 Prerequisites

Before beginning this lecture, you should have a solid understanding of:
- **Angular Fundamentals:** Basic component creation, template syntax, modular structure, and bootstrapping an Angular app.
- **TypeScript Basics:** Interfaces, types, basic generics, and classes. You should be comfortable with strongly typed variables and return types.
- **Signals Core Concepts:** You should already be familiar with what `signal()` and `computed()` are from previous lectures. You should understand how signals wrap values and notify consumers upon changes.
- **HTML & CSS:** Basic UI layout skills to understand template structures and style bindings.
- **Reactive Programming Mindset:** An introductory understanding of reactive paradigms where data changes automatically propagate through the UI.

---

## 🎯 Objectives

By the end of this lecture, you will be able to:
- Use signal-based `input()` and `output()` for component communication
- Create two-way bindable components with `model()`
- Synchronize local editable state with a parent input using `linkedSignal()`
- Run side-effects when signals change using `effect()`
- Access child elements reactively with `viewChild()` and `viewChildren()`
- Implement key lifecycle hooks: `ngOnInit`, `ngOnDestroy`, `afterNextRender`
- Understand the modern Angular architectural shift from decorator-based communication to function-based signals.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. **Prerequisites & Objectives** (10 min)
2. **Deep Dive: Component Communication** (60 min)
   - The Component Tree Problem
   - Signal Inputs (`input()`, `.required()`, Transforms, Aliases)
   - Function Outputs (`output()`)
   - Model Inputs (`model()`)
   - Local State Sync (`linkedSignal()`)
   - Side-Effects (`effect()`)
   - Queries (`viewChild()`, `viewChildren()`)
   - Lifecycle Hooks
3. **Think Like a Dev** (15 min)
4. **Before/After Comparisons** (15 min)
5. **Common Mistakes** (15 min)

### Part 2 — Practice / Lab (~90–120 min)
1. Build a product card component with `input()` and `output()`
2. Implement `linkedSignal()` to manage local state
3. ShopAngular Project Part 2: Product Cards & Cart Logic
4. **Interview Prep & Cheat Sheet** (20 min)

---

## 📖 Deep Dive

### 1. Component Communication — The Problem

#### Why Do Components Need to Communicate?

In Angular, the UI is a **tree of components**. Each component is isolated — it owns its own data and can't directly reach into another component's properties. This isolation is a feature, not a bug — it makes components independently reusable and testable.

But real UIs need components to work together. A `ProductCard` needs to know *what product to display* (data from the parent). The parent needs to know *when the user clicked "Add to Cart"* (events from the child). This is the classic **parent-child communication** problem.

**Visual: The component tree and data flow**

```text
                    AppComponent (parent)
                    ┌─────────────────────────────────────┐
                    │  products = signal<Product[]>([...]) │
                    │  cart     = signal<Product[]>([])    │
                    └──────────────┬──────────────────────┘
                                   │
                    ╔══════════════╧══════════════╗
                    ║  Data flows DOWN via input() ║  →  [product]="item"
                    ╚══════════════╤══════════════╝
                                   ▼
                    ProductCardComponent (child)
                    ┌─────────────────────────────────────┐
                    │  product = input.required<Product>() │
                    │  addedToCart = output<Product>()     │
                    └──────────────┬──────────────────────┘
                                   │
                    ╔══════════════╧══════════════╗
                    ║  Events flow UP via output() ║  ←  (addedToCart)="onAdd($event)"
                    ╚═════════════════════════════╝
```

**Rule of thumb:**
- **Data flows DOWN** from parent to child — via `input()`.
- **Events flow UP** from child to parent — via `output()`.
- **Two-way data** flows in both directions — via `model()`.

---

### 2. Signal Inputs — `input()`

#### Why `input()` Instead of `@Input()`?

Old Angular used the `@Input()` decorator to receive data from a parent. Modern Angular (v17+) uses the `input()` function instead. The key advantage: `input()` creates a **Signal** — meaning the input value is reactive and can be tracked by `computed()`, `effect()`, and `resource()`.

```ts
// ✅ NEW WAY — input() function (reactive Signal)
import { Component, input, computed } from '@angular/core';

export class ProductCard {
  product = input.required<Product>();  // A Signal that receives its value from the parent!

  // Automatically recomputes whenever product() changes — no lifecycle hook needed!
  displayPrice = computed(() => {
    const price = this.product().price;
    return `$${price.toFixed(2)}`;
  });
}
```

#### Optional Inputs — `input(defaultValue)`

```ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `<span class="badge" [style.background]="color()">{{ label() }}</span>`
})
export class BadgeComponent {
  // Optional input — the parent CAN provide this, but doesn't HAVE to.
  // The argument to input() is the DEFAULT value used when the parent doesn't provide one.
  label = input('New');      // Default: 'New' (a string)
  color = input('#22c55e'); // Default: green hex color
}
```

**In the parent template:**
```html
<!-- Use the default values — no bindings needed -->
<app-badge />                                          <!-- Shows: "New" in green -->

<!-- Override with custom values -->
<app-badge [label]="'Sale'" [color]="'#ef4444'" />    <!-- Shows: "Sale" in red -->

<!-- Use a dynamic signal value -->
<app-badge [label]="product().badge" [color]="badgeColor()" />
```

#### Required Inputs — `input.required<T>()`

If a component MUST have an input to function, use `input.required<T>()`. Angular will give you a **build error** if the parent doesn't provide it:

```ts
import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  onSale: boolean;
}

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  template: `
    <div class="card">
      <!-- product() is guaranteed to be a Product object — never undefined! -->
      <img [src]="product().imageUrl" [alt]="product().name">
      <h3>{{ product().name }}</h3>
      <p class="price">{{ product().price | currency }}</p>
    </div>
  `
})
export class ProductCardComponent {
  // input.required<Product>() means: "A Product MUST be provided by the parent."
  // The <Product> type parameter tells TypeScript what type to expect.
  // Calling product() returns the Product object — never undefined.
  product = input.required<Product>();
}
```

#### Input Transforms — Processing Values Before Storage

Transforms automatically convert the raw input value before storing it in the signal:

```ts
import { Component, input, booleanAttribute, numberAttribute } from '@angular/core';

@Component({ selector: 'app-slider', template: `...` })
export class SliderComponent {
  // booleanAttribute: converts string "true"/"false"/""/"disabled" to a boolean.
  // This lets templates use the attribute without square brackets:
  // <app-slider disabled> instead of <app-slider [disabled]="true">
  disabled = input(false, { transform: booleanAttribute });

  // numberAttribute: converts a string like "42" to the number 42.
  // HTML template attributes are always strings — this handles the conversion.
  maxValue = input(100, { transform: numberAttribute });

  // Custom transform: trim whitespace from string inputs
  label = input('', {
    transform: (value: string) => value.trim()
  });
}
```

#### Input Aliases — Different External vs Internal Name

```ts
@Component({
  selector: '[appHighlight]', // Directive applied as an attribute
  template: `...`
})
export class HighlightDirective {
  // The 'alias' option changes the name used in the PARENT'S TEMPLATE.
  // Parent uses [appHighlight]="'yellow'" in the template,
  // but inside this class, we access it as this.color()
  color = input<string>('yellow', { alias: 'appHighlight' });
}
```

---

### 3. Function Outputs — `output()`

#### Why Outputs? Events Flow Up

A child component needs a way to tell its parent "something happened." Angular uses `output()` for this. The child **emits** an event; the parent **listens** for it.

**Real-world analogy:** A doorbell (child component) has one job — emit a signal when pressed. The house's speaker system (parent) listens for the signal and plays a sound. The doorbell doesn't need to know anything about the speaker system.

#### Creating and Emitting Outputs

```ts
// FILE: src/app/product-card/product-card.component.ts

import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

interface Product { id: number; name: string; price: number; imageUrl: string; onSale: boolean; }

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  template: `
    <div class="card">
      <img [src]="product().imageUrl" [alt]="product().name">
      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency }}</p>
      <!-- (click) calls addToCartClick() when the button is clicked -->
      <button (click)="addToCartClick()">Add to Cart</button>
    </div>
  `
})
export class ProductCardComponent {
  // INPUT: receive the Product object from the parent
  product = input.required<Product>();

  // OUTPUT: emit the Product to the parent when the button is clicked.
  // output<Product>() means: "this event carries a Product object."
  addedToCart = output<Product>();

  addToCartClick(): void {
    // .emit() triggers the output event, passing the current product to the parent
    this.addedToCart.emit(this.product());
    // The parent listening with (addedToCart)="handler($event)" receives this product
  }
}
```

#### The Parent Listens for the Event

```ts
// FILE: src/app/product-list/product-list.component.ts

import { Component, signal } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';

interface Product { id: number; name: string; price: number; imageUrl: string; onSale: boolean; }

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  template: `
    <p>Cart: {{ cart().length }} item(s)</p>

    @for (product of products(); track product.id) {
      <!--
        [product]="product"                     → passes product DOWN via input()
        (addedToCart)="onAddToCart($event)"     → listens for the output event
        $event = the value the child emitted    → typed as Product
      -->
      <app-product-card
        [product]="product"
        (addedToCart)="onAddToCart($event)"
      />
    }
  `
})
export class ProductListComponent {
  products = signal<Product[]>([
    { id: 1, name: 'Laptop',  price: 999,   imageUrl: 'laptop.jpg',  onSale: false },
    { id: 2, name: 'Headset', price: 49.99, imageUrl: 'headset.jpg', onSale: true  },
  ]);

  cart = signal<Product[]>([]);

  // This method runs when a ProductCard emits the 'addedToCart' output
  // 'product' is the value the child passed to .emit()
  onAddToCart(product: Product): void {
    // Add the product to the cart — create a NEW array (immutably) with spread syntax
    this.cart.update(current => [...current, product]);
    console.log(`Added "${product.name}" to cart. Total: ${this.cart().length}`);
  }
}
```

#### Outputs with No Value

```ts
export class ModalComponent {
  // output<void>() — signals "something happened" but carries no data
  closed = output<void>();

  closeModal(): void {
    this.closed.emit(); // No argument needed for void outputs
  }
}
```

---

### 4. Model Inputs — Two-Way Binding with `model()`

#### What Is Two-Way Binding?

One-way binding: the parent sends data DOWN (`[input]`) and the child sends events UP (`(output)`).

**Two-way binding combines both directions** into a single binding. When the child changes the value, the parent's variable updates automatically. Perfect for custom form controls.

**The "Banana in a Box" Syntax `[( )]`:**

```html
<!-- Two one-way bindings (explicit): -->
<app-slider [value]="volume" (valueChange)="volume = $event" />

<!-- Two-way binding (shorthand "banana in a box") — same result: -->
<app-slider [(value)]="volume" />
```

#### Creating a Two-Way Bindable Component

```ts
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-custom-slider',
  template: `
    <div class="slider-container">
      <label>Volume: {{ volume() }}</label>
      <input
        type="range"
        [min]="0"
        [max]="100"
        [value]="volume()"
        (input)="onSlide($event)"
      />
      <!-- Visual fill bar -->
      <div class="fill-bar" [style.width.%]="volume()"></div>
    </div>
  `
})
export class CustomSliderComponent {
  // model() creates a writable signal AND automatically creates a 'volumeChange' output.
  // When you call this.volume.set(x):
  //   1. The 'volume' signal updates locally (child re-renders)
  //   2. A 'volumeChange' event is emitted (parent's bound variable updates too)
  volume = model(0); // 0 is the initial/default value

  onSlide(event: Event): void {
    const input = event.target as HTMLInputElement;
    // .set() on a model() signal: updates locally AND notifies the parent
    this.volume.set(Number(input.value));
  }
}
```

**In the parent:**

```ts
@Component({
  imports: [CustomSliderComponent],
  template: `
    <!-- [(volume)]="parentVolume" is equivalent to:
         [volume]="parentVolume" AND (volumeChange)="parentVolume = $event" -->
    <app-custom-slider [(volume)]="parentVolume" />
    <p>Parent sees: {{ parentVolume }}</p>
  `
})
export class AppComponent {
  parentVolume = 50; // Initial volume — when slider moves, this updates automatically!
}
```

---

### 5. Synchronizing Local State — `linkedSignal()`

#### The Problem: Editable Local Copy of a Parent Input

A very common UI pattern: the parent passes initial data, the child lets the user edit it locally, but if the parent's input changes (e.g., user switches to edit a different item), the local edit state should **reset** to match the new input.

Without `linkedSignal()`, you'd need to manually sync in an `effect()` — which can cause circular dependencies. `linkedSignal()` solves this cleanly.

```ts
import { Component, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  template: `
    <h3>Editing: {{ originalUsername() }}</h3>
    <input
      type="text"
      [value]="editableUsername()"
      (input)="editableUsername.set($any($event.target).value)"
    />
    <button (click)="save()">Save</button>
  `
})
export class EditProfileComponent {
  // 1. The parent provides the "source of truth" username (read-only input signal)
  originalUsername = input.required<string>();

  // 2. linkedSignal() creates a WRITABLE signal that:
  //    - Initializes with the value from originalUsername()
  //    - Auto-RESETS to match originalUsername() whenever originalUsername() changes
  //    - Can be written to freely by the user (unlike input() which is read-only)
  editableUsername = linkedSignal(() => this.originalUsername());
  //                             ↑ The "source function" — provides the reset value

  save(): void {
    console.log('Saving:', this.editableUsername());
    // Call an API service here in a real app
  }
}
```

**Visual — `linkedSignal()` lifecycle:**

```text
1. Component mounts:
   originalUsername input → "Alice"
   editableUsername       → "Alice"  ← initialized from source

2. User types "Alice Smith":
   originalUsername input → "Alice"        (parent hasn't changed)
   editableUsername       → "Alice Smith"  (user's local edit — writable!)

3. Parent changes to a different user:
   originalUsername input → "Bob"    (input changed!)
   editableUsername       → "Bob"    (AUTO-RESET to match new input!)
   ("Alice Smith" is discarded — we're editing Bob now)
```

---

### 6. Signal Side-Effects — `effect()`

#### What Is a Side Effect?

A **side effect** is code that interacts with the world outside of computing a return value: writing to localStorage, logging, calling a chart library, updating the URL. `effect()` automatically runs such code whenever its signal dependencies change.

```ts
import { Component, effect, signal } from '@angular/core';

@Component({ selector: 'app-cart', template: `...` })
export class CartComponent {
  items = signal<string[]>([]);

  constructor() {
    // effect() registers a function that:
    // 1. Runs IMMEDIATELY on initialization (captures initial state)
    // 2. Runs AGAIN whenever any signal it reads changes
    effect(() => {
      const currentItems = this.items(); // READ this signal — now it's a dependency!

      // SIDE EFFECT 1: Log to console
      console.log(`Cart updated: ${currentItems.length} items.`);

      // SIDE EFFECT 2: Persist to localStorage
      localStorage.setItem('cart-items', JSON.stringify(currentItems));
    });
  }

  addItem(item: string): void {
    this.items.update(current => [...current, item]);
    // ↑ Changing items() automatically triggers the effect above!
  }
}
```

#### Use Cases for `effect()`

```ts
// USE CASE 1: Sync dark mode preference to the DOM
export class ThemeService {
  theme = signal<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light'
  );

  constructor() {
    effect(() => {
      localStorage.setItem('theme', this.theme()); // Persist preference
      document.body.classList.toggle('dark-mode', this.theme() === 'dark'); // Apply to DOM
    });
  }
}
```

#### `effect()` Cleanup

If your effect starts a timer or resource, clean up before re-runs:

```ts
constructor() {
  effect((onCleanup) => {
    const id = setInterval(() => console.log('Tick!'), this.intervalMs());
    // Runs before effect re-runs AND when component is destroyed
    onCleanup(() => clearInterval(id));
  });
}
```

---

### 7. Signal Queries — `viewChild()` and `viewChildren()`

#### Template Reference Variables (`#name`)

A `#name` attribute creates a reference to a DOM element or component in the template:

```html
<input #searchInput type="text" placeholder="Search...">
<!-- The reference 'searchInput' can be used elsewhere in the same template -->
<button (click)="searchInput.focus()">Focus</button>
```

#### `viewChild()` — Reactive Query for One Element

`viewChild()` returns a **signal** that resolves to a DOM element or child component:

```ts
import { Component, viewChild, ElementRef, afterNextRender } from '@angular/core';

@Component({
  template: `
    <input #searchInput type="text" placeholder="Search...">
    <button (click)="focusSearch()">Focus Input</button>
  `
})
export class DashboardComponent {
  // viewChild<ElementRef>('searchInput') queries for #searchInput
  // Returns a Signal<ElementRef | undefined>
  searchInput = viewChild<ElementRef>('searchInput');

  constructor() {
    afterNextRender(() => {
      // DOM ready — safe to interact with elements here
      console.log('Input element:', this.searchInput()?.nativeElement);
    });
  }

  focusSearch(): void {
    // Call the signal to get the ElementRef, then .nativeElement for the DOM element
    this.searchInput()?.nativeElement.focus();
  }
}
```

#### `viewChildren()` — Query Multiple Elements

```ts
@Component({
  template: `
    @for (item of items(); track item.id) {
      <div #card class="card">{{ item.name }}</div>
    }
    <button (click)="highlightAll()">Highlight All</button>
  `
})
export class CardListComponent {
  items = signal([{ id: 1, name: 'A' }, { id: 2, name: 'B' }]);
  cards = viewChildren<ElementRef>('card'); // Signal<ReadonlyArray<ElementRef>>

  highlightAll(): void {
    this.cards().forEach(card => {
      card.nativeElement.style.backgroundColor = 'yellow';
    });
  }
}
```

---

### 8. Lifecycle Hooks in a Signal World

#### Component Lifecycle Overview

```text
  Mounts  →  Inputs set  →  View rendered  →  Inputs updated  →  Destroyed
     │            │               │                  │               │
constructor    ngOnInit    afterNextRender       (signals)       ngOnDestroy
```

#### `ngOnInit` — First Initialization

```ts
import { Component, OnInit, input } from '@angular/core';

@Component({ selector: 'app-user-profile', template: `...` })
export class UserProfileComponent implements OnInit {
  userId = input.required<string>();

  // Runs ONCE after all inputs have been set for the first time.
  // In modern Angular, prefer resource() over ngOnInit for data fetching.
  ngOnInit(): void {
    console.log(`Initialized for user: ${this.userId()}`);
  }
}
```

#### `ngOnDestroy` — Cleanup Before the Component Dies

```ts
import { Component, OnDestroy, signal } from '@angular/core';

@Component({ selector: 'app-timer', template: `<p>{{ elapsed() }}s</p>` })
export class TimerComponent implements OnDestroy {
  elapsed = signal(0);
  private intervalId = setInterval(() => this.elapsed.update(n => n + 1), 1000);

  // Runs ONCE right before Angular removes the component from the DOM.
  // CRITICAL: Clear timers, cancel subscriptions — otherwise they keep running and cause memory leaks!
  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Stop the timer!
  }
}
```

#### `afterNextRender()` — After the First DOM Paint

```ts
import { Component, afterNextRender, viewChild, ElementRef } from '@angular/core';

@Component({ template: `<canvas #chart></canvas>` })
export class ChartComponent {
  chartCanvas = viewChild<ElementRef>('chart');

  constructor() {
    // Runs ONCE right after Angular renders the component for the first time.
    // The DOM elements now exist — safe to initialize third-party libraries.
    afterNextRender(() => {
      const canvas = this.chartCanvas()?.nativeElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        // Initialize your chart library here...
      }
    });
  }
}
```

---

## 🧠 Think Like a Dev

When building modern Angular applications, you must shift your mindset from "when does this property change?" to "what does this data depend on?". 

1. **Smart vs. Dumb Components:** Keep your UI components "dumb". They should simply receive data via `input()` and emit user actions via `output()`. The "smart" container components should handle data fetching and manage the core state using services.
2. **Derive Everything You Can:** If you have `firstName` and `lastName`, do not manually update a `fullName` string. Always use `computed(() => firstName() + ' ' + lastName())`. Let Angular handle the reactivity graph automatically.
3. **Avoid Side Effects When Possible:** Before reaching for `effect()`, ask yourself: "Can I just use `computed()`?" Use `effect()` strictly for integrating with non-reactive APIs (like the DOM, Canvas, or localStorage). Side effects make your code harder to predict and test.
4. **Data Ownership:** If a child needs to modify data, who owns it? If the parent owns it, the child must `output()` the intent to change. If the child only modifies a local draft, use `linkedSignal()`. If both need to stay synced bi-directionally, use `model()`.
5. **Memory Leak Prevention:** Always be paranoid about any asynchronous process you start. If you `setInterval`, if you subscribe to an RxJS Observable, if you register a DOM event listener manually, ensure that it is canceled within `ngOnDestroy()` or `onCleanup()` in an `effect()`.

---

## 🔄 Before/After

How modern Angular (v17+) compares to older Angular codebases:

### Receiving Data
**Before (Decorator):**
```ts
@Input() product: Product;
ngOnChanges() {
  this.display = format(this.product);
}
```
**After (Signal):**
```ts
product = input.required<Product>();
display = computed(() => format(this.product()));
```

### Emitting Events
**Before:**
```ts
@Output() added = new EventEmitter<Product>();
this.added.emit(item);
```
**After:**
```ts
added = output<Product>();
this.added.emit(item);
```

### Querying the DOM
**Before:**
```ts
@ViewChild('myInput') myInput: ElementRef;
ngAfterViewInit() {
  this.myInput.nativeElement.focus();
}
```
**After:**
```ts
myInput = viewChild<ElementRef>('myInput');
constructor() {
  afterNextRender(() => this.myInput()?.nativeElement.focus());
}
```

---

## ⚠️ Common Mistakes

1. **Accessing an Optional Input Without Handling Undefined**
   - *Mistake:* `title = input<string>();` followed by `this.title().toUpperCase()`. Crashes if undefined.
   - *Fix:* Provide a default `title = input('')` or use optional chaining `this.title()?.toUpperCase()`.

2. **Trying to Write to an Input Signal**
   - *Mistake:* `this.myInput.set(10);` (Inputs are read-only!)
   - *Fix:* Use `linkedSignal()` for a local writable copy, or `model()` if the parent should also update.

3. **Forgetting to Call `.emit()`**
   - *Mistake:* Updating local state and assuming the parent knows.
   - *Fix:* Always call `this.myOutput.emit(data)` to notify the parent.

4. **Wrong Output Name in Parent Template**
   - *Mistake:* Child uses `addedToCart = output()`, parent uses `(addToCart)="..."`. Angular silently ignores this binding!
   - *Fix:* Match the exact output property name: `(addedToCart)="..."`.

5. **Updating Signals Inside an `effect()`**
   - *Mistake:* Using `effect()` to sync two signals, e.g., `this.b.set(this.a() * 2);`. This creates anti-patterns and potential infinite loops.
   - *Fix:* Use `computed()` to derive values purely.

6. **Reading `viewChild` in `ngOnInit`**
   - *Mistake:* The DOM hasn't rendered yet during `ngOnInit`, so `viewChild()` might be undefined.
   - *Fix:* Use `afterNextRender()` to guarantee the DOM is ready.

7. **Forgetting to Clean Up Timers**
   - *Mistake:* Starting a `setInterval` in the constructor and never clearing it.
   - *Fix:* Store the interval ID and call `clearInterval()` in `ngOnDestroy()`.

8. **Calling effect() Outside Injection Context**
   - *Mistake:* Trying to instantiate an `effect()` inside a random class method without passing an `Injector`.
   - *Fix:* Always declare `effect()` directly in the constructor or as a class field initializer.

---

## 🧪 Labs

### Lab 1: Product Card with `input()` and `output()` (40 min)
1. Generate: `ng g c product-card`
2. Define a `Product` interface in `src/app/models/product.ts`
3. Add `product = input.required<Product>()` to the component
4. Display `product().name`, `product().price`, and `product().imageUrl` in the template
5. Add `addedToCart = output<Product>()` and an "Add to Cart" button that calls `.emit(this.product())`
6. In `AppComponent`, create a products array, use `@for` with `<app-product-card>`, and listen for `(addedToCart)` to log the product name.

### Lab 2: `linkedSignal()` and `effect()` (40 min)
1. Add `quantity = linkedSignal(() => 1)` to `ProductCardComponent` — it must reset to 1 whenever a new product is bound.
2. Add `+` and `-` buttons to modify `quantity` (min: 1).
3. Add an `effect()` in the constructor that logs `"Quantity for [name] changed to [N]"` on every quantity change.
4. Modify the output to emit `{ product: this.product(), quantity: this.quantity() }`.

### Assignment: ShopAngular Project — Part 2
1. **Extract `ProductCardComponent`:**
   - Move product display code into a standalone `ProductCardComponent`.
   - Use `input.required<Product>()` to receive the product.
   - Show a `<span class="sale-badge">Sale!</span>` with `@if (product().onSale)`.

2. **Add a Cart output:**
   - Add `addedToCart = output<Product>()`.
   - Emit the product when "Add to Cart" is clicked.

3. **Cart state in `ProductListComponent`:**
   - Add `cart = signal<Product[]>([])`.
   - Listen for `(addedToCart)` and add to the cart.
   - Show `Cart ({{ cart().length }})` in a header.

4. **Prevent duplicates (Bonus):**
   - In `onAddToCart()`, check if the product is already in the cart.
   - If it is, show a message instead of adding again.

5. **`effect()` for localStorage (Bonus):**
   - Add an `effect()` that saves the cart to `localStorage` on every change.
   - On initialization, try to restore the cart from `localStorage`.

---

## 💼 Interview Prep

**Q: Explain the difference between `input()` and `model()`.**
*A:* `input()` creates a read-only signal that receives data from the parent. `model()` creates a writable signal that represents two-way binding; when you `.set()` or `.update()` a `model()`, it automatically emits a change event back to the parent to update the parent's source variable. This eliminates the need for manual event boilerplate.

**Q: What is `linkedSignal()` used for?**
*A:* It creates a local writable state that is initialized from a source signal (like a parent input) and automatically resets whenever that source signal changes. It's perfect for building editable forms or local draft states that need to stay logically tied to an external source of truth without manual syncing logic. It resolves circular dependency issues commonly faced with `effect()`.

**Q: Why shouldn't you use `effect()` to update other signals?**
*A:* Updating signals inside an `effect()` can cause unintended circular dependencies, cascading updates, and performance bottlenecks. It breaks the declarative data flow and makes code unpredictable. Instead, derived state should always be created using pure `computed()` signals which evaluate lazily.

**Q: When would you use `afterNextRender()` instead of `ngOnInit()`?**
*A:* `ngOnInit()` runs before the view is fully rendered, meaning DOM elements (like those queried via `viewChild`) might not be available yet. `afterNextRender()` is guaranteed to run after the DOM is painted, making it the correct place to initialize third-party UI libraries like charts or maps that require an actual DOM node to attach to.

**Q: Why do component templates need the `$` event syntax on bindings like `(click)="handler($event)"`?**
*A:* The `$event` is a special template variable exposed by Angular that contains the payload of the event emitted. For native DOM events, it's the `Event` object. For custom `output()` events, it's whatever data was passed into the `.emit()` function.

---

## 📄 Cheat Sheet

```typescript
// --- INPUTS ---
optionalInput = input('default');           // Signal<string>
requiredInput = input.required<User>();     // Signal<User>
boolInput = input(false, { transform: booleanAttribute }); 

// --- OUTPUTS ---
onClick = output<number>();                 // output<T>
onClick.emit(42);                           // Emitting

// --- MODEL (Two-Way Binding) ---
value = model(0);                           // Used with [(value)]="parentVar"
this.value.set(10);                         // Updates local AND parent

// --- LINKED SIGNAL ---
draft = linkedSignal(() => this.input());   // Writable, auto-resets on input change

// --- EFFECT ---
constructor() {
  effect((onCleanup) => {
    console.log(this.someSignal());         // Runs on init & when signal changes
    onCleanup(() => { /* Cleanup logic */ });
  });
}

// --- QUERIES ---
myDiv = viewChild<ElementRef>('myDiv');     // <div #myDiv></div>

// --- LIFECYCLE ---
ngOnInit() { /* Inputs are ready */ }
constructor() { afterNextRender(() => { /* DOM is ready */ }); }
ngOnDestroy() { /* Cleanup timers/subs */ }
```

---

## 📌 Key Takeaways

- **`input()` and `input.required<T>()`** return reactive Signals instead of static values.
- Data flows **down** via `[input]="value"` bindings in the template.
- **`output<T>()`** completely replaces `@Output() EventEmitter<T>`.
- Events flow **up** via `(outputName)="handler($event)"` in the parent template.
- **`model()`** elegantly enables two-way binding using the `[(propertyName)]="value"` syntax without manual boilerplate.
- **`linkedSignal()`** simplifies local draft states that rely on external data.
- **`effect()`** handles interactions outside the Angular reactive context. **Never** update signals inside an `effect()`.
- **`viewChild()`** provides a reactive, signal-based approach to querying the DOM elements and child components.
- Modern Angular prioritizes a **signal-first** mental model over legacy lifecycle hooks (`ngOnChanges`, `ngAfterViewInit`).
- **Always clean up timers and subscriptions in `ngOnDestroy()`** to maintain performance and avoid memory leaks.

---

**Next Lecture:** [Lecture 26 — Angular Directives & Pipes](../26%20-%20Angular%20Directives%20%26%20Pipes/26%20-%20Angular%20Directives%20%26%20Pipes.md)
### 📚 Extensive Tutorials & Resources
- **Angular.dev:** [Component Communication with Inputs & Outputs](https://angular.dev/guide/components/inputs-outputs)
- **Angular University:** [Angular Component Communication: The Complete Guide](https://blog.angular-university.io/angular-component-communication/)
- **Angular.dev:** [Angular Component Lifecycle Hooks](https://angular.dev/guide/components/lifecycle)
- **Angular University:** [Angular Lifecycle Hooks Guide: From OnInit to OnDestroy](https://blog.angular-university.io/angular-lifecycle-hooks/)
- **Angular.dev:** [Two-Way Binding with the model() API](https://angular.dev/guide/components/two-way-binding)
- **Angular University:** [Angular linkedSignal: Writable Local State Sync](https://blog.angular-university.io/angular-linked-signal/)
- **FreeCodeCamp:** [Understanding Angular Components and Lifecycle Hooks](https://www.freecodecamp.org/news/understanding-angular-components-and-lifecycle-hooks/)
