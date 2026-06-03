# Lecture 25 — Angular Directives & Pipes

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Distinguish between attribute directives and structural directives
- Use built-in attribute directives: `ngClass` and `ngStyle`
- Build custom attribute directives with signal `input()` and the `host:` property
- Understand why structural directives are largely replaced by built-in control flow (`@if`, `@for`)
- Use built-in pipes: `DatePipe`, `CurrencyPipe`, `AsyncPipe`, `JsonPipe`, and more
- Create custom pipes with `@Pipe` and `PipeTransform`
- Understand pure vs impure pipes and their performance implications

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What are directives? Attribute vs structural categories
2. Built-in attribute directives: `ngClass`, `ngStyle`
3. Host element bindings: the modern `host:` property
4. Custom attribute directives with `@Directive` and signal inputs
5. Structural directives vs Modern Control Flow
6. Built-in pipes: Date, Currency, Percent, JSON, Async
7. Custom pipes: `@Pipe`, pure vs impure

### Part 2 — Practice / Lab (~90–120 min)
1. Build a highlight directive with signal input and host binding
2. Create a custom text-truncation pipe
3. ShopAngular Project Part 3: Directives & Pipes

---

## 1. What Are Directives?

### The Plain-English Explanation

A **directive** is an Angular class that adds behaviour to elements in your templates. If a **component** says "here's a piece of UI with a template," a **directive** says "here's additional behaviour I'm attaching to an existing element."

**The analogy:** Think of directives like stickers you put on objects. A "FRAGILE" sticker on a box doesn't change what's in the box — it adds a behaviour instruction. Similarly, an `appHighlight` directive on a `<p>` tag doesn't change the paragraph — it adds hover-highlighting behaviour to it.

### The Three Types of Directives

```
Angular Directives
│
├── Components
│   └── Directives WITH a template (every component you've built!)
│
├── Attribute Directives
│   └── Change the APPEARANCE or BEHAVIOUR of an element
│   └── Examples: ngClass, ngStyle, your custom [appHighlight]
│
└── Structural Directives
    └── Add, remove, or rearrange DOM elements
    └── Old: *ngIf, *ngFor (now replaced by @if, @for)
    └── Custom structural directives (advanced — rare)
```

| Category | Purpose | Example |
|----------|---------|---------|
| **Components** | Define a self-contained UI with template | `<app-product-card />` |
| **Attribute Directives** | Modify an existing element's look/behavior | `<p appHighlight>` |
| **Structural Directives** | Add/remove DOM elements | `*ngFor` (legacy) |

---

## 2. Built-in Attribute Directives

### `[ngClass]` — Conditionally Add/Remove CSS Classes

`ngClass` is perfect when you need to apply **multiple** CSS classes conditionally. It accepts an object where the keys are CSS class names and the values are boolean expressions:

```ts
// ═══════════════════════════════════════════════════════════
// Component Class
// ═══════════════════════════════════════════════════════════

import { Component, signal, NgClass } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [NgClass],
  template: `
    <!-- ngClass with an object literal -->
    <span [ngClass]="{
      'badge':      true,
      'badge-success': orderStatus() === 'delivered',
      'badge-warning': orderStatus() === 'processing',
      'badge-danger':  orderStatus() === 'cancelled',
      'badge-large':   isHighPriority()
    }">
      {{ orderStatus() }}
    </span>

    <!-- ngClass with an array of class names -->
    <div [ngClass]="['card', 'shadow', hasBorder() ? 'bordered' : '']">
      Card content
    </div>

    <!-- ngClass with a string (just one class) -->
    <p [ngClass]="'text-muted'">Muted text</p>
  `
})
export class StatusBadgeComponent {
  orderStatus  = signal<'processing' | 'delivered' | 'cancelled'>('processing');
  isHighPriority = signal(false);
  hasBorder    = signal(true);
}
```

> [!TIP]
> **Prefer the simpler alternatives when possible:**
> - For **one class**: `[class.active]="isActive()"` instead of `[ngClass]="{ active: isActive() }"`
> - For **one style**: `[style.color]="textColor()"` instead of `[ngStyle]="{ color: textColor() }"`
> - Use `ngClass` only when you need to toggle **many** classes at once.

### `[ngStyle]` — Set Inline Styles Dynamically

`ngStyle` accepts an object where keys are CSS property names and values are the style values:

```ts
@Component({
  selector: 'app-progress-bar',
  imports: [NgStyle],
  template: `
    <div class="progress-track">
      <div
        class="progress-fill"
        [ngStyle]="{
          'width':            progress() + '%',
          'background-color': progressColor(),
          'transition':       'width 0.3s ease',
          'border-radius':    progress() >= 100 ? '8px' : '8px 0 0 8px'
        }"
      ></div>
    </div>
    <p>{{ progress() }}% complete</p>
  `
})
export class ProgressBarComponent {
  progress = input(0, { transform: numberAttribute });

  progressColor = computed(() => {
    const p = this.progress();
    if (p < 33) return '#ef4444'; // red
    if (p < 67) return '#f59e0b'; // yellow
    return '#22c55e';             // green
  });
}
```

### When to Use What

```html
<!-- ✅ Single class toggle → use [class.x] shorthand -->
<button [class.active]="isActive()">Click me</button>

<!-- ✅ Multiple classes → use [ngClass] -->
<div [ngClass]="{ 'a': a(), 'b': b(), 'c': c() }">...</div>

<!-- ✅ Single style → use [style.x] shorthand -->
<p [style.color]="textColor()">Paragraph</p>
<p [style.font-size.px]="fontSize()">Sized text</p>  <!-- Note the .px unit! -->

<!-- ✅ Multiple styles → use [ngStyle] -->
<div [ngStyle]="{ 'color': color(), 'font-size': size() + 'px' }">...</div>
```

---

## 3. Host Element Bindings — The Modern `host:` Property

### What Is the "Host Element"?

When you write `<app-product-card />` in a parent template, Angular creates a real DOM element for it. That element — the custom element tag itself — is the **host element**. A directive's host is the element it's placed on.

For example, if you write:
```html
<p appHighlight>Hover me!</p>
```
...then the `<p>` element is the **host element** of the `appHighlight` directive.

### Old Way vs New Way

Before, you'd use `@HostBinding` and `@HostListener` decorators:

```ts
// ❌ OLD — separate decorators scattered around the class
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  @HostBinding('style.backgroundColor') bg = '';

  @HostListener('mouseenter') onEnter() { this.bg = 'yellow'; }
  @HostListener('mouseleave') onLeave() { this.bg = ''; }
}
```

The modern `host:` property puts everything in **one place** — the decorator:

```ts
// ✅ MODERN — all host bindings in the decorator, not scattered
@Directive({
  selector: '[appHighlight]',
  host: {
    // Property bindings on the host element:
    '[style.backgroundColor]': 'backgroundColor()', // Dynamic style
    '[class.highlighted]':      'isHighlighted()',    // Dynamic class
    '[attr.aria-label]':        '"Highlighted item"', // Attribute binding

    // Event listeners on the host element:
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(click)':      'onClick($event)',
  }
})
export class HighlightDirective {
  // These signals are referenced in the host object above
  backgroundColor = signal('');
  isHighlighted   = signal(false);

  onMouseEnter(): void { /* ... */ }
  onMouseLeave(): void { /* ... */ }
  onClick(event: MouseEvent): void { /* ... */ }
}
```

**Why `host:` is better:**
1. All bindings are visible at a glance in the decorator.
2. Works better with Angular's new incremental compilation.
3. Easier to understand when reviewing code.
4. Supported by Angular Language Service for autocompletion.

---

## 4. Custom Attribute Directives — Building from Scratch

### The Goal

We'll build an `appHighlight` directive that:
1. Accepts a color input (defaults to `'yellow'`).
2. Highlights the host element's background with that color on mouse hover.
3. Removes the highlight when the mouse leaves.

```ts
// ═══════════════════════════════════════════════════════════
// FILE: src/app/directives/highlight.directive.ts
// ═══════════════════════════════════════════════════════════

import { Directive, input, signal, linkedSignal } from '@angular/core';

@Directive({
  selector: '[appHighlight]', // Applied as an attribute: <p appHighlight>
  host: {
    // Bind the host element's background-color to our signal
    '[style.backgroundColor]': 'currentColor()',
    '[style.transition]':       '"background-color 0.2s ease"',
    '[style.cursor]':           '"pointer"',
    // Listen for mouse events on the host element
    '(mouseenter)':             'onMouseEnter()',
    '(mouseleave)':             'onMouseLeave()',
  }
})
export class HighlightDirective {
  // 'alias' means: in the template, the input is bound using the directive's selector
  // <p [appHighlight]="'lightblue'"> sets the color to 'lightblue'
  // <p appHighlight>  (no binding) uses the default 'yellow'
  color = input<string>('yellow', { alias: 'appHighlight' });

  // Internal state: the currently displayed background color
  // Starts empty (no highlight), updates on hover
  currentColor = linkedSignal<string>(() => ''); // Empty = no highlight

  onMouseEnter(): void {
    // Set the color to the provided input color when the user hovers
    this.currentColor.set(this.color());
  }

  onMouseLeave(): void {
    // Remove the highlight when the mouse leaves
    this.currentColor.set('');
  }
}
```

### Using the Directive in a Template

```ts
// In the COMPONENT that uses the directive, add it to imports
@Component({
  selector: 'app-root',
  imports: [HighlightDirective],
  template: `
    <!-- Default yellow highlight -->
    <p appHighlight>Hover me — default yellow!</p>

    <!-- Custom color via property binding -->
    <p [appHighlight]="'lightblue'">Hover me — light blue!</p>

    <!-- Dynamic color from a signal -->
    <p [appHighlight]="selectedColor()">Hover me — dynamic color!</p>

    <!-- No highlight on this one (directive not applied) -->
    <p>No highlight here</p>
  `
})
export class AppComponent {
  selectedColor = signal('lightcoral');
}
```

### Generating Directives with the CLI

```bash
ng generate directive highlight
# Shorthand:
ng g d highlight
# Creates: src/app/highlight.directive.ts and .spec.ts
```

### A More Advanced Directive — `appTooltip`

```ts
// A tooltip directive that shows a message on hover
@Directive({
  selector: '[appTooltip]',
  host: {
    '[style.position]':          '"relative"',
    '[style.display]':           '"inline-block"',
    '(mouseenter)':              'showTooltip()',
    '(mouseleave)':              'hideTooltip()',
    // Accessibility: announce tooltip content to screen readers
    '[attr.aria-describedby]':   '"tooltip-" + id',
  }
})
export class TooltipDirective {
  // The tooltip text — required input using the directive selector as alias
  message = input.required<string>({ alias: 'appTooltip' });

  // Position: 'top' | 'bottom' | 'left' | 'right'
  position = input<string>('top');

  isVisible = signal(false);
  id = Math.random().toString(36).slice(2); // Unique ID for aria

  showTooltip(): void { this.isVisible.set(true); }
  hideTooltip(): void { this.isVisible.set(false); }
}
```

---

## 5. Structural Directives vs Modern Control Flow

### The Historical Context

In Angular v1 through v16, adding/removing elements from the DOM required **structural directives** — directives with a special `*` syntax:

```html
<!-- ❌ OLD SYNTAX — still works, but not recommended for new code -->
<div *ngIf="isVisible; else hiddenContent">Visible content</div>
<ng-template #hiddenContent>Hidden content</ng-template>

<li *ngFor="let item of items; trackBy: trackById; let i = index">{{ item }}</li>

<div [ngSwitch]="color">
  <p *ngSwitchCase="'red'">Red</p>
  <p *ngSwitchDefault>Other</p>
</div>
```

### The Modern Replacement — Built-in Control Flow

Angular v17+ introduced `@if`, `@for`, and `@switch` which are **built into the template compiler**. They are:
- **Faster** — the compiler can optimise them better.
- **More readable** — no `*`, no `<ng-template>`, no awkward syntax.
- **Type-safe** — TypeScript understands them better.

```html
<!-- ✅ NEW SYNTAX — use this for all new code -->
@if (isVisible()) { <div>Visible content</div> } @else { <div>Hidden content</div> }

@for (item of items(); track item.id; let i = $index) {
  <li>{{ i + 1 }}. {{ item.name }}</li>
}

@switch (color()) {
  @case ('red')  { <p>Red</p> }
  @default       { <p>Other</p> }
}
```

> [!NOTE]
> The old `*ngIf`, `*ngFor`, and `*ngSwitch` directives still exist and work for **backwards compatibility**. If you're working in an older codebase, you'll encounter them. For all new code, use the `@if`, `@for`, `@switch` built-in control flow.

### Custom Structural Directives (Advanced)

You can create your own structural directives, but it's rare. The most common reason is building reusable if/for variants (e.g., a permission-based `*canAccess` directive). These use `TemplateRef` and `ViewContainerRef` — an advanced topic beyond this lecture's scope.

---

## 6. Pipes — Transforming Data in Templates

### What Is a Pipe?

A **pipe** takes an input value, transforms it, and returns the transformed value for display. The transformation stays in the **template** — your component class stays clean.

**The analogy:** Think of a pipe like a coffee machine. You put in coffee beans, it processes them, and you get a cup of espresso. The beans (raw data) go in, the espresso (transformed data) comes out.

```
Raw Data                  Template
─────────                 ────────
timestamp    ──pipe──►  "January 15, 2024"
price: 9.99  ──pipe──►  "$9.99"
text: "HELLO"──pipe──►  "hello"
data: {}     ──pipe──►  '{ "key": "value" }'
```

### Pipe Syntax

```html
<!-- Basic pipe -->
{{ value | pipeName }}

<!-- Pipe with arguments (separated by ':') -->
{{ date | date: 'fullDate' }}
{{ price | currency: 'EUR' : 'symbol' : '1.2-2' }}

<!-- Chaining multiple pipes -->
{{ name | uppercase | slice: 0 : 5 }}
<!-- First uppercases "alice" → "ALICE", then slices → "ALICE" -->
```

### Built-in Pipes — Reference

Angular ships with many useful pipes. They must be imported in the component's `imports` array:

```ts
import {
  DatePipe, CurrencyPipe, PercentPipe, DecimalPipe,
  UpperCasePipe, LowerCasePipe, TitleCasePipe,
  SlicePipe, JsonPipe, AsyncPipe, KeyValuePipe
} from '@angular/common';

@Component({
  imports: [
    DatePipe, CurrencyPipe, PercentPipe, DecimalPipe,
    UpperCasePipe, LowerCasePipe, SlicePipe, JsonPipe
  ],
  template: `...`
})
```

### `DatePipe` — Formatting Dates

```ts
// Component
export class AppComponent {
  today     = new Date();
  birthday  = new Date(1990, 5, 15); // June 15, 1990
  timestamp = 1705363200000;         // Unix timestamp in milliseconds
}
```

```html
<!-- DatePipe with various format strings -->
{{ today     | date }}                  <!-- "Jan 16, 2024" (default) -->
{{ today     | date: 'short' }}         <!-- "1/16/24, 3:30 PM" -->
{{ today     | date: 'longDate' }}      <!-- "January 16, 2024" -->
{{ today     | date: 'fullDate' }}      <!-- "Tuesday, January 16, 2024" -->
{{ today     | date: 'dd/MM/yyyy' }}    <!-- "16/01/2024" (custom format) -->
{{ today     | date: 'HH:mm:ss' }}     <!-- "15:30:45" (time only) -->
{{ birthday  | date: 'MMMM d, y' }}    <!-- "June 15, 1990" -->
{{ timestamp | date: 'mediumDate' }}    <!-- "Jan 16, 2024" -->

<!-- With timezone -->
{{ today | date: 'short' : 'UTC' }}     <!-- In UTC timezone -->
```

### `CurrencyPipe` — Formatting Money

```html
{{ 9.99  | currency }}                      <!-- "$9.99" (default USD) -->
{{ 9.99  | currency: 'EUR' }}               <!-- "€9.99" -->
{{ 9.99  | currency: 'GBP' : 'symbol' }}    <!-- "£9.99" -->
{{ 9.99  | currency: 'USD' : 'code' }}      <!-- "USD9.99" -->
{{ 1234567.89 | currency: 'USD' : 'symbol' : '1.2-2' }}
<!-- "$1,234,567.89" — format: minIntegers.minFractions-maxFractions -->

<!-- Negative amounts -->
{{ -29.99 | currency }}  <!-- "-$29.99" -->
```

### `DecimalPipe` — Formatting Numbers

```html
{{ 3.14159 | number }}          <!-- "3.142" (default rounding) -->
{{ 3.14159 | number: '1.2-2' }} <!-- "3.14" (exactly 2 decimal places) -->
{{ 3.14159 | number: '1.5-5' }} <!-- "3.14159" (exactly 5 decimal places) -->
{{ 1234567 | number }}          <!-- "1,234,567" (with commas!) -->
{{ 3       | number: '2.0-0' }} <!-- "03" (at least 2 integer digits) -->
```

### `PercentPipe` — Formatting Percentages

```html
{{ 0.25 | percent }}        <!-- "25%" -->
{{ 0.25 | percent: '1.2' }} <!-- "25.00%" -->
{{ 1.5  | percent }}        <!-- "150%" -->
```

### `SlicePipe` — Slicing Arrays and Strings

```html
<!-- Works on strings -->
{{ "Hello World" | slice: 0 : 5 }}  <!-- "Hello" -->
{{ "Hello World" | slice: 6 }}      <!-- "World" -->

<!-- Works on arrays -->
<!-- products is an array of Product objects -->
{{ products() | slice: 0 : 3 }}  <!-- First 3 products -->
```

### `JsonPipe` — Debug Complex Objects

```html
<!-- Extremely useful for debugging! Shows full object structure in the UI -->
<pre>{{ complexObject | json }}</pre>
<pre>{{ formGroup.value | json }}</pre>
<pre>{{ httpResponse | json }}</pre>
```

### `AsyncPipe` — Subscribe to Observables in Templates

The `AsyncPipe` automatically subscribes to an Observable or Promise and displays the latest emitted value. It also **automatically unsubscribes** when the component is destroyed — preventing memory leaks!

```ts
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, interval } from 'rxjs';

@Component({
  selector: 'app-clock',
  imports: [AsyncPipe, DatePipe],
  template: `
    <!-- async pipe subscribes to the Observable automatically! -->
    <p>Current time: {{ currentTime$ | async | date: 'HH:mm:ss' }}</p>

    <!-- If the observable hasn't emitted yet, async returns null -->
    @if (products$ | async; as products) {
      @for (product of products; track product.id) {
        <div>{{ product.name }}</div>
      }
    } @else {
      <p>Loading...</p>
    }
  `
})
export class ClockComponent {
  // An Observable that emits the current Date every second
  currentTime$ = new Observable<Date>(observer => {
    const intervalId = setInterval(() => observer.next(new Date()), 1000);
    return () => clearInterval(intervalId); // Cleanup on unsubscribe
  });

  products$: Observable<Product[]> = inject(ProductService).getAll();
}
```

---

## 7. Custom Pipes

### When to Write a Custom Pipe

Use a custom pipe when:
- You need the same data transformation in multiple templates.
- The transformation is **display-only** (doesn't belong in the component class).
- You want the transformation to be **testable** in isolation.

### Creating a Custom Pipe Step-by-Step

**Step 1: Generate the pipe**
```bash
ng generate pipe truncate
# Creates: src/app/truncate.pipe.ts and truncate.pipe.spec.ts
```

**Step 2: Implement the pipe**

```ts
// ═══════════════════════════════════════════════════════════
// FILE: src/app/pipes/truncate.pipe.ts
// ═══════════════════════════════════════════════════════════

import { Pipe, PipeTransform } from '@angular/core';

// @Pipe decorator declares this as a pipe
@Pipe({
  name: 'truncate', // The name used in templates: {{ text | truncate }}
})
export class TruncatePipe implements PipeTransform {
  // 'transform' is the single required method
  // 'value' is what comes before the pipe: {{ value | truncate }}
  // Additional arguments come after colons: {{ value | truncate: 100 : '...' }}
  transform(
    value: string,             // The input value
    limit: number = 50,        // First argument: max length (default: 50)
    ellipsis: string = '...'   // Second argument: the suffix (default: '...')
  ): string {
    // Guard: handle null/undefined/empty input gracefully
    if (!value) return '';

    // If the string is within the limit, return it unchanged
    if (value.length <= limit) return value;

    // Cut the string at 'limit' characters and add the ellipsis
    return value.substring(0, limit) + ellipsis;
  }
}
```

**Step 3: Use the pipe in a template**

```ts
// Import it in the component's imports array
@Component({
  selector: 'app-product-card',
  imports: [TruncatePipe, CurrencyPipe],
  template: `
    <div class="card">
      <h3>{{ product().name }}</h3>

      <!-- Truncate description to 80 characters -->
      <p>{{ product().description | truncate: 80 }}</p>

      <!-- Truncate with a custom ellipsis -->
      <p class="preview">{{ product().description | truncate: 50 : ' [read more]' }}</p>

      <p class="price">{{ product().price | currency }}</p>
    </div>
  `
})
export class ProductCardComponent { /* ... */ }
```

### A More Advanced Custom Pipe — `timeAgo`

```ts
// ═══════════════════════════════════════════════════════════
// FILE: src/app/pipes/time-ago.pipe.ts
// ═══════════════════════════════════════════════════════════

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    // Convert various date formats to a Date object
    const date = new Date(value);
    const now   = new Date();

    // Difference in seconds
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60)   return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400)return `${Math.floor(seconds / 3600)} hours ago`;

    const days = Math.floor(seconds / 86400);
    if (days === 1)     return 'Yesterday';
    if (days < 7)       return `${days} days ago`;
    if (days < 30)      return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365)     return `${Math.floor(days / 30)} months ago`;

    return `${Math.floor(days / 365)} years ago`;
  }
}
```

```html
<!-- Usage in template -->
<p class="comment-date">{{ comment.createdAt | timeAgo }}</p>
<!-- Output examples: "2 minutes ago", "Yesterday", "3 weeks ago" -->
```

### A Pipe with Complex Logic — `discountPrice`

```ts
@Pipe({ name: 'discountPrice' })
export class DiscountPricePipe implements PipeTransform {
  // Calculates the discounted price and formats it
  transform(
    originalPrice: number,
    discountPercent: number = 0,
    currency: string = 'USD'
  ): string {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount must be between 0 and 100');
    }

    const discounted = originalPrice * (1 - discountPercent / 100);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(discounted);
  }
}
```

```html
<!-- Usage -->
<p>Original: {{ product().price | currency }}</p>
<p>Sale price: {{ product().price | discountPrice: 20 }}</p>
<!-- If price is 99.99 and discount is 20%, output: "$79.99" -->
```

### Pure vs Impure Pipes

This is a crucial performance concept:

| | Pure Pipe (default) | Impure Pipe (`pure: false`) |
|--|---------------------|---------------------------|
| **Re-runs when** | Input **reference** changes | Every change detection cycle |
| **Performance** | ✅ Excellent | ⚠️ Can be slow |
| **Use case** | Any simple transformation | Filtering arrays, async data |

```ts
// ✅ Pure pipe (default) — recalculates only when 'value' reference changes
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string { /* ... */ }
}

// ⚠️ Impure pipe — recalculates on EVERY change detection cycle!
// Only use when you must react to internal object/array mutations.
@Pipe({ name: 'filter', pure: false })
export class FilterPipe implements PipeTransform {
  transform(items: Product[], searchTerm: string): Product[] {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
```

> [!WARNING]
> Impure pipes run on **every change detection cycle** — which can be hundreds of times per second in an interactive application. Use them sparingly! Instead, consider filtering data in the component class using a `computed()` signal, and binding the result to the template.

```ts
// ✅ BETTER: Filter in the component class using computed()
export class ProductListComponent {
  allProducts = signal<Product[]>([]);
  searchTerm  = signal('');

  // This only recomputes when allProducts or searchTerm changes
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allProducts().filter(p =>
      p.name.toLowerCase().includes(term)
    );
  });
}
```

---

## 🧪 Practice Labs

### Lab 1 — Highlight Directive (40 min)

1. Generate: `ng g d highlight`
2. Recreate the `appHighlight` directive shown in Section 4.
3. Add an additional optional input `defaultColor = input('transparent')` — the background color when NOT hovering.
4. Update the `host:` binding to use `defaultColor()` when not hovered.
5. In `AppComponent`, apply the directive to several elements with different colors and test the hover effect.

### Lab 2 — Truncate Pipe (30 min)

1. Generate: `ng g p truncate`
2. Implement the `transform()` function as shown in Section 7.
3. Write **unit tests** for the pipe in the generated `.spec.ts` file:
   - Test with text shorter than the limit — should return unchanged.
   - Test with text longer than the limit — should truncate and add `'...'`.
   - Test with an empty string — should return `''`.
   - Test with a custom ellipsis argument.
4. Run `ng test` to verify the tests pass.

---

## 📝 Assignment: ShopAngular Project — Part 3

Let's polish ShopAngular with directives and pipes!

### Requirements

1. **CurrencyPipe on prices:** In `ProductCardComponent`, ensure every price is formatted using the built-in `CurrencyPipe`. Display `$29.99` instead of `29.99`.

2. **Custom `DiscountPipe`:**
   - Generate: `ng g p discount`
   - Accepts `(price: number, discountPercent: number)` and returns the discounted price as a formatted string.
   - In `ProductCardComponent`, if `product().onSale` is `true`, show both:
     - The original price with strikethrough styling.
     - The discounted price (use 20% as the discount amount).

3. **Custom `HoverShadowDirective`:**
   - Generate: `ng g d hover-shadow`
   - Uses the `host:` property to listen for `mouseenter` and `mouseleave`.
   - On `mouseenter`: set `box-shadow` to `'0 8px 25px rgba(0,0,0,0.15)'`.
   - On `mouseleave`: remove the shadow.
   - Apply it to your product card's container `<div>`.

4. **Time display:** Add a `createdAt: Date` field to your `Product` interface. In the card, display the date using `DatePipe` with the format `'MMMM d, y'` (e.g., "January 15, 2024").

5. **Bonus — `timeAgo` pipe:** Create the `TimeAgoPipe` shown in Section 7 and display it alongside the formatted date: `"Created January 15, 2024 (3 days ago)"`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Attribute Directives | https://angular.dev/guide/directives/attribute-directives |
| Angular Built-in Pipes | https://angular.dev/guide/pipes |
| Angular Custom Pipes | https://angular.dev/guide/pipes/transform-data |
| Angular `DatePipe` format tokens | https://angular.dev/api/common/DatePipe#pre-defined-format-options |

---

## 📌 Key Takeaways

- **Directives** add behaviour to elements without their own template — "stickers" that add functionality.
- Use **`[class.x]`** for single class toggles and **`[ngClass]`** for multiple conditional classes.
- The **`host:` property** is the modern way to bind to the host element — all bindings in one place.
- Always include directives in the component's **`imports` array** — they are standalone too!
- **Pipes** transform data right before display — keep component classes clean.
- **Pure pipes** only recalculate when the input reference changes — great performance by default.
- **Avoid impure pipes** — use `computed()` signals in the component class instead.
- The `@if`, `@for`, `@switch` **control flow** replaces `*ngIf` and `*ngFor` in modern Angular.

---

**Next Lecture:** [Lecture 26 — Angular Routing & Navigation](./26%20-%20Angular%20Routing%20&%20Navigation.md)