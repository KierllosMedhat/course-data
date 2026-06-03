# Lecture 24 — Components, Data Binding & Lifecycle Hooks

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Use signal-based `input()` and `output()` for component communication
- Create two-way bindable components with `model()`
- Synchronize local editable state with a parent input using `linkedSignal()`
- Run side-effects when signals change using `effect()`
- Access child elements reactively with `viewChild()` and `viewChildren()`
- Implement key lifecycle hooks: `ngOnInit`, `ngOnDestroy`, `afterNextRender`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Signal inputs: `input()`, `.required()`, transforms, aliases
2. Function outputs: `output()`
3. Model inputs for two-way binding (`model()`)
4. Synchronizing local state: `linkedSignal()`
5. Signal side-effects: `effect()`
6. Template reference variables & signal queries: `viewChild()`
7. Lifecycle hooks in a Signal world

### Part 2 — Practice / Lab (~90–120 min)
1. Build a product card component with `input()` and `output()`
2. Implement `linkedSignal()` to manage local state
3. ShopAngular Project Part 2: Product Cards & Cart Logic

---

## 1. Component Communication — The Problem

### Why Do Components Need to Communicate?

In Angular, the UI is a **tree of components**. Each component is isolated — it owns its own data and can't directly reach into another component's properties. This isolation is a feature, not a bug — it makes components independently reusable and testable.

But real UIs need components to work together. A `ProductCard` needs to know *what product to display* (data from the parent). The parent needs to know *when the user clicked "Add to Cart"* (events from the child). This is the classic **parent-child communication** problem.

**Visual: The component tree and data flow**

```
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

## 2. Signal Inputs — `input()`

### Why `input()` Instead of `@Input()`?

Old Angular used the `@Input()` decorator to receive data from a parent. Modern Angular (v17+) uses the `input()` function instead. The key advantage: `input()` creates a **Signal** — meaning the input value is reactive and can be tracked by `computed()`, `effect()`, and `resource()`.

```ts
// ❌ OLD WAY — @Input() decorator (still works, but not reactive)
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export class ProductCard {
  @Input() product!: Product;  // Not reactive — can't be tracked by computed()

  ngOnChanges(changes: SimpleChanges) {
    // You had to use a lifecycle hook just to react to input changes
    console.log('Product changed:', this.product);
  }
}

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

### Optional Inputs — `input(defaultValue)`

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

### Required Inputs — `input.required<T>()`

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

```html
<!-- In the parent: -->
<app-product-card [product]="item" />   <!-- ✅ Required input provided -->
<app-product-card />                    <!-- ❌ Build error: required input 'product' not bound -->
```

### Input Transforms — Processing Values Before Storage

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

```html
<!-- HTML attribute (no square brackets) becomes a boolean — works with booleanAttribute -->
<app-slider disabled />               <!-- disabled = true -->
<app-slider [disabled]="false" />     <!-- disabled = false -->
<app-slider maxValue="50" />          <!-- maxValue = 50 (number, not "50") -->
<app-slider [label]="'  hello  '" />  <!-- label = "hello" (trimmed) -->
```

### Input Aliases — Different External vs Internal Name

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

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE 1: Accessing an optional input's value without handling undefined
export class MyComponent {
  title = input<string>(); // No default = type is 'string | undefined'

  showTitle() {
    console.log(this.title().toUpperCase()); // ❌ Crash if title is undefined!
  }
}

// ✅ FIX: Provide a default value OR use optional chaining
export class MyComponentFixed {
  title = input(''); // ✅ Default empty string — always a string, never undefined

  showTitle() {
    console.log(this.title()?.toUpperCase() ?? 'No title'); // ✅ Safe
  }
}

// ❌ MISTAKE 2: Trying to write to an input signal from inside the component
export class ChildComp {
  value = input(0);

  update() {
    this.value.set(10); // ❌ Error! Input signals are READ-ONLY inside the component.
  }
}

// ✅ FIX: Use linkedSignal() for a local writable copy (covered in Section 5)
export class ChildCompFixed {
  valueFromParent = input(0);
  localValue = linkedSignal(() => this.valueFromParent()); // Writable local copy

  update() {
    this.localValue.set(10); // ✅ Updates local copy only
  }
}
```

### Section Recap
- `input(default)` — optional input with a fallback. Returns `Signal<T>`.
- `input.required<T>()` — required input. Build error if parent doesn't provide it. Returns `Signal<T>`.
- Input signals are **read-only** inside the child component.
- `transform` — automatically converts raw input values (string → boolean, string → number).
- `alias` — changes the template-facing name without changing the internal property name.

---

## 3. Function Outputs — `output()`

### Why Outputs? Events Flow Up

A child component needs a way to tell its parent "something happened." Angular uses `output()` for this. The child **emits** an event; the parent **listens** for it.

**Real-world analogy:** A doorbell (child component) has one job — emit a signal when pressed. The house's speaker system (parent) listens for the signal and plays a sound. The doorbell doesn't need to know anything about the speaker system.

### Creating and Emitting Outputs

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

### The Parent Listens for the Event

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

**The data flow step by step:**
1. User clicks "Add to Cart" in `ProductCard`.
2. `addToCartClick()` runs → calls `this.addedToCart.emit(this.product())`.
3. Angular sees the parent has `(addedToCart)="onAddToCart($event)"`.
4. Angular calls `onAddToCart(product)` in the parent.
5. `onAddToCart` adds the product to the cart signal.
6. Template re-renders with the updated `cart().length`.

### Outputs with No Value

```ts
export class ModalComponent {
  // output<void>() — signals "something happened" but carries no data
  closed = output<void>();

  closeModal(): void {
    this.closed.emit(); // No argument needed for void outputs
  }
}
```

```html
<app-modal (closed)="onModalClosed()" />
```

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE 1: Forgetting to call .emit() — parent is never notified
export class CounterComponent {
  incremented = output<number>();
  count = signal(0);

  increment() {
    this.count.update(n => n + 1);
    // ❌ Missing: this.incremented.emit(this.count());
    // Parent never knows the count changed!
  }
}

// ✅ FIX: Always emit after updating
increment() {
  this.count.update(n => n + 1);
  this.incremented.emit(this.count()); // ✅ Parent is notified
}

// ❌ MISTAKE 2: Wrong output name in parent template (silent failure!)
// Child: addedToCart = output<Product>();
// Parent: (addToCart)="..." ← 'addToCart' ≠ 'addedToCart'
// Angular silently ignores the binding — no error, no output!
<app-product-card (addToCart)="..." />   // ❌ Wrong name

// ✅ FIX: Match the exact output property name
<app-product-card (addedToCart)="..." />  // ✅ Exact match
```

### Section Recap
- `output<T>()` creates an event channel that the child can emit values through.
- Call `.emit(value)` to trigger the event and notify the parent.
- The parent listens with `(outputName)="handler($event)"` — `$event` is the emitted value.
- `output<void>()` for events that don't carry data.
- Output names must match exactly between child and parent template.

---

## 4. Model Inputs — Two-Way Binding with `model()`

### What Is Two-Way Binding?

One-way binding: the parent sends data DOWN (`[input]`) and the child sends events UP (`(output)`).

**Two-way binding combines both directions** into a single binding. When the child changes the value, the parent's variable updates automatically. Perfect for custom form controls.

**The "Banana in a Box" Syntax `[( )]`:**

```html
<!-- Two one-way bindings (explicit): -->
<app-slider [value]="volume" (valueChange)="volume = $event" />

<!-- Two-way binding (shorthand "banana in a box") — same result: -->
<app-slider [(value)]="volume" />
```

### Creating a Two-Way Bindable Component

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

## 5. Synchronizing Local State — `linkedSignal()`

### The Problem: Editable Local Copy of a Parent Input

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

```
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

## 6. Signal Side-Effects — `effect()`

### What Is a Side Effect?

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

### Use Cases for `effect()`

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

// USE CASE 2: Update a third-party chart library when data changes
export class ChartComponent {
  chartData = signal<number[]>([10, 20, 30, 40, 50]);
  private chartInstance: any = null;

  constructor() {
    afterNextRender(() => {
      this.chartInstance = new SomeChartLibrary(document.querySelector('#chart'), {
        data: this.chartData()
      });
    });

    effect(() => {
      if (this.chartInstance) {
        this.chartInstance.updateData(this.chartData()); // Re-render chart on data change
      }
    });
  }
}
```

> [!WARNING]
> **Never update other signals inside an `effect()`!** This creates circular dependencies and potential infinite loops.
> ```ts
> effect(() => {
>   const a = this.signalA();
>   this.signalB.set(a * 2); // ❌ Anti-pattern! Use computed() instead.
> });
> ```
> **Use `computed()` for derived values:**
> ```ts
> signalB = computed(() => this.signalA() * 2); // ✅ Pure, no side effects
> ```

### `effect()` Cleanup

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

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE: Calling effect() outside the injection context
export class MyComponent {
  doSomething() {
    effect(() => { /* ... */ }); // ❌ Error! Must be in constructor/field initializer
  }
}

// ✅ FIX: Call effect() in the constructor or as a class field
export class MyComponentFixed {
  private logger = effect(() => {  // ✅ Field initializer — injection context
    console.log('Signal changed:', this.mySignal());
  });
}
```

### Section Recap
- `effect(() => { ... })` — runs when signals it reads change. Runs immediately on init.
- Use for: localStorage, third-party library updates, DOM manipulation, logging.
- **Never** update other signals inside `effect()` — use `computed()` instead.
- Use `onCleanup(() => ...)` to clean up timers/resources between runs.

---

## 7. Signal Queries — `viewChild()` and `viewChildren()`

### Template Reference Variables (`#name`)

A `#name` attribute creates a reference to a DOM element or component in the template:

```html
<input #searchInput type="text" placeholder="Search...">
<!-- The reference 'searchInput' can be used elsewhere in the same template -->
<button (click)="searchInput.focus()">Focus</button>
```

### `viewChild()` — Reactive Query for One Element

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
    //    ↑ call signal  ↑ optional chain   ↑ actual DOM element
  }
}
```

### `viewChild()` for Child Components

```ts
@Component({
  imports: [VideoPlayerComponent],
  template: `
    <app-video-player #player />
    <button (click)="togglePlay()">Play/Pause</button>
  `
})
export class AppComponent {
  player = viewChild<VideoPlayerComponent>('player');
  // Returns Signal<VideoPlayerComponent | undefined>

  togglePlay(): void {
    this.player()?.toggle(); // Call a method on the child component directly!
  }
}
```

### `viewChildren()` — Query Multiple Elements

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

## 8. Lifecycle Hooks in a Signal World

### Component Lifecycle Overview

```
  Mounts  →  Inputs set  →  View rendered  →  Inputs updated  →  Destroyed
     │            │               │                  │               │
constructor    ngOnInit    afterNextRender       (signals)       ngOnDestroy
```

### The Hooks That Matter in Modern Angular

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

> [!TIP]
> In modern Angular, `ngOnInit` is rarely needed. If you're using it to fetch data, switch to `resource()` — it handles loading/error states automatically and re-fetches when signals change.

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

### Hooks You No Longer Need (With Signals)

| Old Hook | Old Purpose | Modern Replacement |
|----------|-------------|-------------------|
| `ngOnChanges` | React when `@Input()` changes | `computed()` or `effect()` reading `input()` signals |
| `ngAfterViewInit` | Access view children after render | `afterNextRender()` + `viewChild()` signals |
| `ngAfterContentInit` | React when projected content arrives | `afterNextRender()` + `contentChild()` signals |

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE 1: Reading viewChild in ngOnInit (might not be set yet)
export class MyComp implements OnInit {
  myElement = viewChild<ElementRef>('el');

  ngOnInit() {
    this.myElement()?.nativeElement.focus(); // ❌ Might be undefined in ngOnInit!
  }
}

// ✅ FIX: Use afterNextRender() — DOM is guaranteed ready
constructor() {
  afterNextRender(() => {
    this.myElement()?.nativeElement.focus(); // ✅ DOM is fully rendered
  });
}

// ❌ MISTAKE 2: Forgetting to clean up timers — causes memory leaks!
export class LeakyComponent {
  constructor() {
    setInterval(() => this.doWork(), 1000); // ❌ Runs forever — even after component is destroyed!
  }
}

// ✅ FIX: Always store the ID and clear in ngOnDestroy
export class CleanComponent implements OnDestroy {
  private id = setInterval(() => this.doWork(), 1000);
  ngOnDestroy(): void { clearInterval(this.id); } // ✅ Cleaned up!
}
```

### Section Recap
- **`ngOnInit`** — runs once after inputs are set. Prefer `resource()` for data fetching.
- **`ngOnDestroy`** — runs once before destruction. **Always** clean up timers and subscriptions here.
- **`afterNextRender()`** — runs once after the first DOM render. Use for third-party library initialization.
- `ngOnChanges` → replaced by `computed()`/`effect()` with `input()` signals.
- `ngAfterViewInit` → replaced by `afterNextRender()` + `viewChild()`.

---

## 🧪 Practice Labs

### Lab 1: Product Card with `input()` and `output()` (40 min)

1. Generate: `ng g c product-card`
2. Define a `Product` interface in `src/app/models/product.ts`
3. Add `product = input.required<Product>()` to the component
4. Display `product().name`, `product().price`, and `product().imageUrl` in the template
5. Add `addedToCart = output<Product>()` and an "Add to Cart" button that calls `.emit(this.product())`
6. In `AppComponent`, create a products array, use `@for` with `<app-product-card>`, and listen for `(addedToCart)` to log the product name

### Lab 2: `linkedSignal()` and `effect()` (40 min)

1. Add `quantity = linkedSignal(() => 1)` to `ProductCardComponent` — resets to 1 whenever a new product is bound
2. Add `+` and `-` buttons to modify `quantity` (min: 1)
3. Add an `effect()` in the constructor that logs `"Quantity for [name] changed to [N]"` on every quantity change
4. Modify the output to emit `{ product: this.product(), quantity: this.quantity() }`

---

## 📝 Assignment: ShopAngular Project — Part 2

Let's make ShopAngular interactive!

### Requirements

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

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Signals Guide | https://angular.dev/guide/signals |
| `input()` and `output()` | https://angular.dev/guide/components/inputs |
| `linkedSignal()` | https://angular.dev/guide/signals/linked-signal |
| `effect()` | https://angular.dev/guide/signals/side-effects |
| Angular Lifecycle Hooks | https://angular.dev/guide/components/lifecycle |

---

## 📌 Key Takeaways

- **`input(default)` and `input.required<T>()`** replace `@Input()` — they return reactive Signals.
- Data flows **down** via `[input]="value"` bindings in the template.
- **`output<T>()`** replaces `@Output() EventEmitter<T>` — call `.emit(value)` to notify the parent.
- Events flow **up** via `(outputName)="handler($event)"` in the parent template.
- **`model()`** enables two-way binding — `[(propertyName)]="value"` syntax.
- **`linkedSignal()`** creates a writable local copy of an input that auto-resets when the source changes.
- **`effect()`** runs side-effects when signals change. **Never** update signals inside an `effect()`.
- **`viewChild()`** is a reactive signal query for DOM elements and child components.
- **`ngOnDestroy()`** is critical — always clean up timers and subscriptions to prevent memory leaks.

---

**Next Lecture:** [Lecture 25 — Angular Directives & Pipes](./25%20-%20Angular%20Directives%20&%20Pipes.md)