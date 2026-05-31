# Lecture 24 — Components, Data Binding & Lifecycle Hooks

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Use signal-based `input()` and `output()` for component communication
- Create two-way bindable components with `model()`
- Synchronize state derived from inputs using the new `linkedSignal()`
- Perform side-effects when signals change using `effect()`
- Access child elements with signal queries: `viewChild()` and `viewChildren()`
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

## 1. Signal Inputs — `input()`

In modern Angular, we use the **signal-based `input()` function** instead of `@Input()`. It is fully reactive!

```ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h3>{{ name() }}</h3>
      <p>{{ email() }}</p>
    </div>
  `
})
export class UserCardComponent {
  // Optional input with a default value
  name = input('Unknown User');

  // Required input — build error if parent doesn't provide it!
  avatarUrl = input.required<string>();
  
  // Transform input (e.g. string to boolean)
  isActive = input(false, { transform: booleanAttribute });
}
```

### Reading Inputs
Call the signal function — `this.name()` returns the current value. Inputs are **read-only** from within the component.

---

## 2. Function Outputs — `output()`

Outputs let child components **emit events** to parent components. No more `@Output` or `EventEmitter`!

```ts
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-rating',
  template: `
    <button (click)="submitRating(5)">★★★★★</button>
  `
})
export class RatingComponent {
  ratingSubmitted = output<number>();

  submitRating(value: number): void {
    this.ratingSubmitted.emit(value);
  }
}
```

### Parent Listening
```html
<app-rating (ratingSubmitted)="onRating($event)" />
```

---

## 3. Model Inputs — Two-Way Binding (`model()`)

Model inputs enable **two-way binding** using the `[( )]` "banana-in-a-box" syntax. They are **writable** signals!

```ts
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-custom-slider',
  template: `
    <input type="range"
           [value]="volume()"
           (input)="onInput($event)" />
    <span>{{ volume() }}</span>
  `
})
export class CustomSliderComponent {
  // model() creates a writable signal that also emits back to the parent
  volume = model(0);

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.volume.set(Number(input.value)); // Updates locally AND in parent!
  }
}
```

### Parent Usage
```html
<app-custom-slider [(volume)]="parentVolume" />
```

---

## 4. Synchronizing Local State — `linkedSignal()`

Often, you receive an input from a parent, but you need a local, editable copy of it. If the parent input changes, the local copy should reset to match the parent.

Angular v19+ introduces `linkedSignal()` for exactly this!

```ts
import { Component, input, linkedSignal } from '@angular/core';

@Component({
  // ...
})
export class EditProfileComponent {
  // The parent provides the starting username
  originalUsername = input.required<string>();
  
  // Create a writable local signal that resets whenever originalUsername changes!
  editableUsername = linkedSignal(() => this.originalUsername());
  
  save() {
    console.log("Saving: ", this.editableUsername());
  }
}
```

---

## 5. Signal Side-Effects — `effect()`

Sometimes you need to run code _only when a signal changes_, like saving to `localStorage` or updating a 3rd party charting library.

```ts
import { Component, effect, signal } from '@angular/core';

export class CartComponent {
  items = signal<string[]>([]);
  
  constructor() {
    effect(() => {
      // This will automatically re-run whenever 'this.items()' changes!
      console.log(`The cart has ${this.items().length} items.`);
      localStorage.setItem('cart', JSON.stringify(this.items()));
    });
  }
}
```

> [!WARNING]
> Do NOT use `effect()` to update other signals! If you find yourself updating a signal inside an `effect`, you probably want a `computed()` or a `linkedSignal()` instead.

---

## 6. Signal Queries — `viewChild()`

Signal queries return **reactive signals** that point to a DOM element or child component:

```ts
import { Component, viewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <input #searchInput type="text" placeholder="Search...">
    <button (click)="focusSearch()">Focus</button>
  `
})
export class DashboardComponent {
  // Query a single element by its template reference variable '#searchInput'
  searchInput = viewChild<ElementRef>('searchInput');

  focusSearch(): void {
    this.searchInput()?.nativeElement.focus();
  }
}
```

---

## 7. Lifecycle Hooks in a Signal World

Because we now use `input()`, `computed()`, and `linkedSignal()`, the old `ngOnChanges` and `ngAfterViewInit` hooks are rarely needed!

### The Big Three

1. **`ngOnInit` — Setup & Data Fetching:** Runs once after inputs are initialized.
2. **`ngOnDestroy` — Cleanup:** Runs right before the component dies (e.g. to clear intervals).
3. **`afterNextRender` — DOM Access:** Runs once after the browser renders.

```ts
import { Component, OnInit, OnDestroy, afterNextRender } from '@angular/core';

export class TimerComponent implements OnInit, OnDestroy {
  intervalId: any;

  constructor() {
    afterNextRender(() => {
      console.log('DOM is painted and ready!');
    });
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => console.log('Tick'), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
```

---

## 🧪 Practice Labs

### Lab 1 — Product Card with `input()` and `output()` (40 min)
1. Generate a standalone `ProductCardComponent`.
2. Accept inputs: `name` (string), `price` (number).
3. Emit `addToCart` via `output<string>()` when a button is clicked.
4. Pass data into it from `AppComponent`.

### Lab 2 — `linkedSignal()` and `effect()` (40 min)
1. In `ProductCardComponent`, create a `linkedSignal()` named `quantity` that defaults to 1.
2. Create `+` and `-` buttons to modify `quantity`.
3. Add an `effect()` that logs "Quantity updated to X" whenever `quantity()` changes.

---

## 📝 Assignment: ShopAngular Project — Part 2

Let's make ShopAngular interactive!

### Requirements
1. Extract your product display from Part 1 into a standalone `ProductCardComponent`.
2. Pass the `Product` object into the card using `input.required<Product>()`.
3. Add an `AddToCart` button to the card. When clicked, it should `emit()` the product via an `output()`.
4. In `AppComponent` (or `ProductListComponent`), listen for that event and add the product to a `cartSignal`.
5. Display the total number of items in the cart in a simple Navigation Bar at the top!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Signals Guide | https://angular.dev/guide/signals |
| `linkedSignal()` | https://angular.dev/guide/signals/linked-signal |

---

## 📌 Key Takeaways
- **`input()` and `output()`** replace `@Input` and `@Output`.
- **`model()`** is for two-way binding.
- **`linkedSignal()`** synchronizes local, editable state with a parent input.
- **`effect()`** runs side-effects automatically when tracked signals change.
- **`viewChild()`** is a reactive way to grab elements from the DOM.

---

**Next Lecture:** [Lecture 25 — Directives & Pipes](./25%20-%20Directives%20%26%20Pipes.md)