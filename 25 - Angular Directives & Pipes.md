# Lecture 25 — Angular Directives & Pipes

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 1. 🛑 Prerequisites

Before diving into this lecture, you should have a solid foundation in the following areas:
- **Angular Components:** Creating standalone components, managing state, and using lifecycle hooks.
- **Signals API:** A strong grasp of `signal`, `computed`, and the modern `input()` API, as these are heavily utilized when building custom directives.
- **TypeScript & OOP:** Familiarity with TypeScript classes, interfaces, decorators, and basic object-oriented programming concepts.
- **DOM & CSS:** Understanding how CSS classes, inline styles, and DOM events (like `mouseenter`, `click`, `mouseleave`) work natively in the browser.

---

## 2. 🎯 Objectives

By the end of this lecture, you will be able to:
- **Distinguish** between attribute directives and structural directives, understanding their distinct roles in Angular templates.
- **Master** built-in attribute directives like `ngClass` and `ngStyle` for dynamic styling and layout manipulation.
- **Build custom attribute directives** from scratch, utilizing modern signal-based `input()` and the declarative `host:` property configuration.
- **Explain** the evolution from legacy structural directives (`*ngIf`, `*ngFor`) to modern built-in control flow (`@if`, `@for`).
- **Leverage** Angular's built-in pipes (`DatePipe`, `CurrencyPipe`, `AsyncPipe`, `JsonPipe`, `SlicePipe`, etc.) to format data effortlessly in templates.
- **Create robust custom pipes** by implementing the `PipeTransform` interface and passing multiple arguments.
- **Analyze performance** by understanding the critical difference between pure and impure pipes, and knowing exactly when to use `computed()` signals instead of impure pipes for filtering.

---

## 3. 📋 Agenda

### Part 1 — Theory (~90 min)
1. **The Essence of Directives:** What are they? Attribute vs. Structural categories.
2. **Built-in Attribute Directives:** Deep dive into `ngClass` and `ngStyle`.
3. **Host Element Bindings:** The modern `host:` property vs. legacy decorators.
4. **Custom Attribute Directives:** Building your own behaviors with `@Directive` and signals.
5. **Structural Directives vs. Modern Control Flow:** The shift to `@if`, `@for`, and `@switch`.
6. **Built-in Pipes:** Formatting data dynamically (Date, Currency, Percent, JSON, Async, KeyValue).
7. **Custom Pipes:** `@Pipe`, `PipeTransform`, and the pure vs. impure paradigm.

### Part 2 — Practice / Lab (~90–120 min)
1. **Lab 1:** Build a dynamic highlight directive with signal inputs and host binding.
2. **Lab 2:** Create a reusable custom text-truncation pipe.
3. **Lab 3:** ShopAngular Project Part 3 — Integrating Directives & Pipes.

---

## 4. 🧠 Deep Dive

### 4.1 What Are Directives?
A **directive** is an Angular class that adds or modifies the behavior of elements in your templates. If a **component** says "here is a self-contained piece of UI with a template," a **directive** says "here is some additional behavior I am attaching to an existing DOM element."

**The Three Types of Directives:**
1. **Components:** Directives *with* a template. Every component you build is technically a directive under the hood. They are the primary building blocks of an Angular application.
2. **Attribute Directives:** Change the appearance or behavior of an element. Examples include `ngClass`, `ngStyle`, or a custom `[appHighlight]`. They are applied as attributes on existing HTML tags.
3. **Structural Directives:** Add, remove, or rearrange DOM elements. Historically, these were `*ngIf`, `*ngFor`, and `*ngSwitch`, though modern Angular largely replaces these with built-in template control flow.

### 4.2 Built-in Attribute Directives
Angular provides powerful built-in attribute directives to dynamically manipulate element classes and styles. These should be imported from `@angular/common`.

**`[ngClass]` — Conditionally Add/Remove CSS Classes**
`ngClass` is perfect when you need to apply *multiple* CSS classes conditionally based on complex logic. It typically accepts an object where keys are class names and values are boolean expressions.

```ts
import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  imports: [NgClass],
  template: `
    <span [ngClass]="{
      'badge': true,
      'badge-success': orderStatus() === 'delivered',
      'badge-warning': orderStatus() === 'processing',
      'badge-danger': orderStatus() === 'cancelled',
      'badge-large': isHighPriority()
    }">
      {{ orderStatus() }}
    </span>
    
    <!-- Arrays are also supported -->
    <div [ngClass]="['card', 'shadow', hasBorder() ? 'bordered' : '']">Content</div>
  `
})
export class StatusBadgeComponent {
  orderStatus = signal<'processing' | 'delivered' | 'cancelled'>('processing');
  isHighPriority = signal(true);
  hasBorder = signal(false);
}
```

**`[ngStyle]` — Set Inline Styles Dynamically**
Similarly, `ngStyle` dynamically sets multiple inline styles based on object mapping.

```ts
import { Component, input, computed } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  imports: [NgStyle],
  template: `
    <div
      class="progress-fill"
      [ngStyle]="{
        'width': progress() + '%',
        'background-color': progressColor(),
        'transition': 'width 0.3s ease',
        'border-radius': progress() >= 100 ? '8px' : '8px 0 0 8px'
      }"
    ></div>
  `
})
export class ProgressBarComponent {
  progress = input(0);
  progressColor = computed(() => {
    const p = this.progress();
    if (p < 33) return '#ef4444'; // red
    if (p < 67) return '#f59e0b'; // yellow
    return '#22c55e'; // green
  });
}
```

### 4.3 Host Element Bindings — The Modern `host:` Property
The "host element" is the DOM element to which a directive is attached. For example, in `<p appHighlight>Hello</p>`, the `<p>` tag is the host. To interact with the host, modern Angular uses the `host:` property inside the `@Directive` decorator. This replaces the old `@HostBinding` and `@HostListener` decorators, grouping all host interactions in one declarative configuration block.

```ts
import { Directive, input, linkedSignal } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    // Property bindings on the host element
    '[style.backgroundColor]': 'currentColor()',
    '[style.transition]': '"background-color 0.2s ease"',
    '[style.cursor]': '"pointer"',
    '[class.highlighted]': 'isHighlighted()',
    
    // Event listeners on the host element
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  }
})
export class HighlightDirective {
  // Aliased input allows the directive to take an assignment directly: [appHighlight]="'red'"
  color = input<string>('yellow', { alias: 'appHighlight' });
  
  currentColor = linkedSignal<string>(() => '');
  isHighlighted = linkedSignal(() => this.currentColor() !== '');

  onMouseEnter(): void { this.currentColor.set(this.color()); }
  onMouseLeave(): void { this.currentColor.set(''); }
}
```

### 4.4 Structural Directives vs. Modern Control Flow
Historically, developers used structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) to manipulate the DOM. These relied on the `*` microsyntax which Angular transformed into `<ng-template>` elements behind the scenes.

Angular v17+ introduced **built-in control flow** (`@if`, `@for`, `@switch`). This syntax is built directly into the template compiler engine, meaning it requires no imports from `@angular/common`, runs significantly faster, provides superior type safety, and is much easier to read since it eliminates the awkward `<ng-container>` wrappers.

### 4.5 Pipes — Transforming Data in Templates
A **pipe** takes an input value, transforms it, and returns the formatted output directly in the template. This keeps your component classes clean and heavily focused on business logic and state management rather than UI formatting boilerplate.

**Built-in Pipes Reference:**
- `DatePipe`: Formats dates. Accepts formatting strings like `'short'`, `'longDate'`, or custom tokens like `'dd/MM/yyyy'`.
- `CurrencyPipe`: Formats money (`{{ price | currency:'EUR':'symbol':'1.2-2' }}`). The last argument dictates minimum and maximum decimal places.
- `DecimalPipe`: Formats numbers with commas and decimal boundaries (`{{ pi | number:'1.2-2' }}`).
- `PercentPipe`: Formats decimals as percentages (`{{ 0.25 | percent }}`).
- `JsonPipe`: Extremely useful for debugging objects (`{{ myObj | json }}`). It outputs the entire JSON tree.
- `AsyncPipe`: Subscribes to Observables/Promises, automatically triggering change detection upon new emissions, and automatically unsubscribing to prevent memory leaks when the component is destroyed.
- `SlicePipe`: Works like JavaScript's `Array.prototype.slice` and `String.prototype.slice`. Useful for truncating arrays to display only the top X items.
- `KeyValuePipe`: Iterates over the keys of an object or Map. Very handy when you need to use an `@for` loop over an object dictionary.

### 4.6 Custom Structural Directives (Advanced)
While Angular's built-in control flow (`@if`, `@for`) handles 99% of structural DOM manipulation, there are rare architectural cases where you might need to build a custom structural directive. The most common use case is a robust permission-based directive (e.g., `*appHasRole="'admin'"`) that strictly removes elements from the DOM if the user lacks the proper authorization (which is vastly more secure than merely hiding them with CSS).

Building a custom structural directive requires injecting `TemplateRef` (the template payload to be conditionally rendered) and `ViewContainerRef` (the DOM container where the template will be inserted).

```ts
import { Directive, input, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  // The specific role required to render the element
  appHasRole = input.required<string>();
  
  // Inject the template payload and the host container
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService); // Simulated service

  constructor() {
    // Re-evaluate whenever the input or the reactive user state changes
    effect(() => {
      const requiredRole = this.appHasRole();
      const userRole = this.authService.currentUserRole();
      
      this.viewContainer.clear(); // Always clear the container first
      
      if (userRole === requiredRole || userRole === 'super_admin') {
        // If authorized, embed the template safely into the live DOM
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
```
Usage in template (note the asterisk `*` prefix, which tells Angular's compiler to implicitly wrap the element in an `<ng-template>` tag behind the scenes):
```html
<button *appHasRole="'admin'" class="btn-danger">Wipe Production Database</button>
```

### 4.7 Custom Pipes and Pure vs. Impure
When built-in pipes aren't enough, you can create custom pipes by implementing the `PipeTransform` interface.

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;

    const days = Math.floor(seconds / 86400);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;

    return `${Math.floor(days / 365)} years ago`;
  }
}
```

**The Pure vs. Impure Performance Imperative:**
- **Pure Pipes (Default `pure: true`):** These are heavily optimized by Angular. A pure pipe only executes when Angular detects a *pure change* to its input argument (e.g., a primitive value changes like `1` to `2`, or an object/array reference completely changes). They cache their results.
- **Impure Pipes (`pure: false`):** Execute during *every single change detection cycle*, regardless of whether the input reference has changed or not. This happens constantly (on every keystroke, mouse movement, timer tick). Using an impure pipe to filter an array of 1,000 items on every keystroke will immediately obliterate application performance and cause severe jank.

---

## 5. 💡 Think Like a Dev

**The "Sticker" Analogy for Directives:**
Think of attribute directives as specialized stickers you put on objects. A "FRAGILE" sticker on a moving box doesn't change what the box inherently is; it adds an instruction for behavior (handle with care). Similarly, slapping `appHighlight` on a `<p>` tag doesn't change the fact that it's a paragraph element, it merely attaches a rich hover-highlighting behavior to it. When conceptualizing features, ask yourself: "Is this a brand new self-contained UI widget (Component) or am I simply altering an existing element's visual behavior (Directive)?"

**The "Lens" Analogy for Pipes:**
Think of a pipe like looking at data through a colored lens. The underlying data model (the raw integer timestamps, raw decimal prices, raw boolean flags) remains completely untouched in your component class. You are simply projecting that pristine data through a lens in the template so the user sees a polished, human-readable format.

**The Performance Budget Principle:**
As an Angular developer, you possess a strict "performance budget" for your templates. Every binding, every interpolated expression, and every pipe adds a tiny fraction of a millisecond to the change detection cycle. While modern hardware is incredibly fast, an interactive enterprise application might run change detection hundreds of times a second. Think of pure pipes and `computed()` signals as highly optimized "caching mechanisms" that aggressively protect your budget. Impure pipes and direct template function calls, conversely, act as "budget leaks" that force the CPU to recalculate the exact same data repeatedly. A senior developer always architects their state so the template view layer performs as little raw calculation as humanly possible.

**The "Template Function Call" Trap vs. Pipes:**
A common pitfall for beginners is calling a component method directly in interpolation (e.g., `{{ calculateTaxTotal() }}`). Because of Angular's change detection strategy, this method fires every single time Angular checks for changes, dragging down performance drastically. Pure pipes, on the other hand, memoize (cache) their results. If the input doesn't change, the pure pipe completely bypasses the function execution and returns the cached result. Therefore, if you have a complex mathematical calculation or data formatting algorithm for presentation, *always* package it into a pure custom pipe or a `computed()` signal instead of binding directly to a component method.

---

## 6. 🔄 Before/After

### Directives: Legacy Decorators vs. Modern `host:` Property

**❌ Before (Angular 15 and earlier): Scattered Host Decorators**
Host bindings were spread throughout the class, making it extremely hard to see all host interactions at a glance, especially in large files.

```ts
@Directive({ selector: '[appHover]' })
export class HoverDirective {
  @HostBinding('class.hovered') isHovered = false;
  @HostBinding('style.color') textColor = 'black';

  @HostListener('mouseenter')
  onEnter() {
    this.isHovered = true;
    this.textColor = 'blue';
  }

  @HostListener('mouseleave')
  onLeave() {
    this.isHovered = false;
    this.textColor = 'black';
  }
}
```

**✅ After (Modern Angular): Centralized `host:` Object**
All host bindings, classes, styles, and listeners are defined cleanly in the declarative metadata.

```ts
@Directive({
  selector: '[appHover]',
  host: {
    '[class.hovered]': 'isHovered()',
    '[style.color]': 'textColor()',
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()'
  }
})
export class HoverDirective {
  isHovered = signal(false);
  textColor = signal('black');

  onEnter() { this.isHovered.set(true); this.textColor.set('blue'); }
  onLeave() { this.isHovered.set(false); this.textColor.set('black'); }
}
```

### Rendering: Legacy Structural Directives vs. Built-in Control Flow

**❌ Before: Structural Directives**
```html
<div *ngIf="isLoaded; else loadingTpl">
  <ul>
    <li *ngFor="let item of items; trackBy: trackById; let idx = index">
      {{ idx }} - {{ item.name }}
    </li>
  </ul>
</div>
<ng-template #loadingTpl>Loading...</ng-template>

<div [ngSwitch]="status">
  <span *ngSwitchCase="'active'">Active</span>
  <span *ngSwitchDefault>Unknown</span>
</div>
```

**✅ After: Built-in Control Flow**
```html
@if (isLoaded()) {
  <ul>
    @for (item of items(); track item.id; let idx = $index) {
      <li>{{ idx }} - {{ item.name }}</li>
    } @empty {
      <li>No items found.</li>
    }
  </ul>
} @else {
  <div>Loading...</div>
}

@switch (status()) {
  @case ('active') { <span>Active</span> }
  @default { <span>Unknown</span> }
}
```

### Filtering: Impure Pipes vs. Computed Signals

**❌ Before: Using Impure Pipes for Filtering Arrays**
```ts
// Component template:
// <li *ngFor="let user of users | filterByRole:selectedRole">

// Pipe (SLOW! Re-evaluates array iteration on every single mouse movement)
@Pipe({ name: 'filterByRole', pure: false })
export class FilterRolePipe implements PipeTransform {
  transform(users: User[], role: string) {
    return users.filter(u => u.role === role);
  }
}
```

**✅ After: Using Computed Signals for Filtering Arrays**
```ts
// Component template:
// @for (user of filteredUsers(); track user.id) { ... }

// Component class (FAST! Only runs strictly when users or selectedRole changes)
export class UserComponent {
  users = signal<User[]>([]);
  selectedRole = signal<string>('admin');

  filteredUsers = computed(() => {
    const role = this.selectedRole();
    return this.users().filter(u => u.role === role);
  });
}
```

---

## 7. ⚠️ Common Mistakes

1. **Forgetting to Import Pipes/Directives:**
   In modern standalone component architecture, if you use `NgClass`, `DatePipe`, `CurrencyPipe`, or a custom `appHighlight` directive, you *must* explicitly add them to your component's `@Component({ imports: [...] })` array. Otherwise, Angular will fail silently or throw template parsing errors.
   
2. **Overusing `[ngClass]` and `[ngStyle]` for Trivial Tasks:**
   If you only need to toggle a single class, use `[class.active]="isActive()"` instead of `[ngClass]="{'active': isActive()}"`. It is more performant, cleaner, and strictly better typed. The same applies to single styles: `[style.color]="textColor()"` and `[style.width.px]="width()"`.

3. **Writing Impure Pipes for Arrays:**
   It is a major architectural anti-pattern in Angular to write pipes like `SearchFilterPipe` or `SortArrayPipe` with `pure: false`. This causes massive performance bottlenecks. The recommended and industry-standard approach is to always use `computed()` signals to perform array filtering and sorting within the component class.

4. **Mutating Array References when using Pure Pipes:**
   If you use a pure pipe (or standard Angular change detection) and push an item to an array using `array.push(item)`, the pure pipe will **not** trigger. This is because the array's memory reference in RAM hasn't changed. To trigger a pure pipe, you must pass an entirely new reference: `array = [...array, item]`. If using signals, calling `signal.update(arr => [...arr, item])` natively enforces this correct behavior.

5. **Memory Leaks with Observables (Neglecting AsyncPipe):**
   If you manually subscribe to RxJS Observables in your component class using `.subscribe()`, you must remember to implement `ngOnDestroy` and manually unsubscribe to prevent insidious memory leaks. The `AsyncPipe` handles subscription, change detection marking, and unsubscription entirely automatically, making it the safest and cleanest approach for consuming real-time streams in templates.

---

## 8. 🧪 Labs

### Lab 1: Building a Dynamic Highlight Directive (40 min)
**Objective:** Create a reusable directive that modifies host element styling dynamically based on hover state.
1. Use the Angular CLI to generate the directive: `ng g d highlight`
2. Implement signal inputs: `color = input<string>('yellow', { alias: 'appHighlight' });` and `defaultColor = input<string>('transparent');`
3. Use a `linkedSignal` to robustly manage the `currentColor` state, initializing it to the `defaultColor`.
4. Implement the `host:` object in the metadata to bind `[style.backgroundColor]` to `currentColor()`, and meticulously wire up the `(mouseenter)` and `(mouseleave)` event listeners.
5. Apply the directive in your `AppComponent`: `<div [appHighlight]="'lightblue'" defaultColor="lightgray">Hover over this box!</div>`
6. Verify the transition works smoothly without causing errors in the console.

### Lab 2: Building a Reusable Truncate Pipe (30 min)
**Objective:** Create a pure pipe that cleanly truncates long strings of text for UI cards.
1. Generate the pipe via CLI: `ng g p truncate`
2. Implement the `transform()` method to accept `limit: number` and `ellipsis: string`.
3. Add critical guard clauses to handle `null`, `undefined`, empty strings, or strings that are already shorter than the defined limit.
4. Apply the pipe to long text descriptions in your templates: `<p class="description">{{ article.content | truncate: 100 : '... read more' }}</p>`
5. **Bonus:** Write rigorous unit tests in the generated `.spec.ts` file to verify the truncation math, boundary conditions, and null-safety logic.

### Lab 3: ShopAngular Project — Directives & Pipes (Assignment)
**Objective:** Polish the ShopAngular e-commerce UI leveraging standard and custom directives/pipes.
1. **Financial Formatting:** Ensure all product prices across the application use the built-in `CurrencyPipe` with proper localization settings.
2. **Custom `DiscountPipe`:** Construct a custom pipe that calculates and formats a discounted price. In the UI, render the original price with a strikethrough class adjacent to the dynamically calculated discounted price.
3. **Custom `HoverShadowDirective`:** Construct a custom directive that applies an elegant, modern box-shadow (`'0 8px 25px rgba(0,0,0,0.15)'`) to the product card UI upon mouse enter, and elegantly removes it upon mouse leave with CSS transitions.
4. **Time Displays:** Add a `createdAt` date property to your mocked products. Implement the custom `TimeAgoPipe` and display it alongside the standard `DatePipe` formatted creation date to give users a dual context of time.

---

## 9. 💼 Interview Prep

**Q: What is the primary architectural difference between a Component and a Directive in Angular?**
**A:** A Component is essentially a highly specialized directive that possesses its own template (a view layer). It defines a self-contained UI element. An Attribute Directive, however, never possesses a template; instead, it rigidly attaches itself to an existing DOM element (the host) to alter its runtime appearance or behavior.

**Q: Explain the exact difference between pure and impure pipes. Why are impure pipes generally blacklisted in performance audits?**
**A:** A pure pipe strictly re-evaluates its output only when the *memory reference* to its input arguments changes (e.g., primitive value mutation or an entirely new object/array pointer is passed). Because it caches outputs, it is highly optimized. An impure pipe aggressively re-evaluates during *every single change detection cycle*, which can trigger hundreds of times a second. Utilizing impure pipes for heavy computations—like filtering or mapping large arrays—will bottleneck the main thread, resulting in severe application UI lag and poor Lighthouse scores.

**Q: How do you listen to DOM events on the element a directive is attached to?**
**A:** In modern Angular (v17+), the industry standard is to use the declarative `host:` property within the `@Directive` metadata object, defining mappings such as `'(mouseenter)': 'onEnter()'`. Historically, this identical functionality was achieved using the `@HostListener` decorator attached directly to class methods.

**Q: What is the core mechanical purpose of the AsyncPipe?**
**A:** The `AsyncPipe` seamlessly subscribes to an RxJS Observable or a native Promise directly within the template layer, extracting and rendering the latest emitted value. Most critically, it flags the component for change detection upon new emissions, and it automatically unsubscribes the moment the component is destroyed. This prevents notorious memory leaks and eliminates vast amounts of boilerplate subscription tracking logic.

**Q: Why should developers systematically avoid calling component methods directly from template interpolation expressions (e.g., `{{ getFormattedName() }}`)?**
**A:** Under Angular's default change detection strategy, every template expression is blindly re-evaluated during every single cycle. If `getFormattedName()` performs heavy calculation, string manipulation, or array iteration, it will bottleneck the app. Instead, developers should strictly encapsulate this logic within Pure Pipes (which memoize the result) or `computed()` signals, both of which natively guarantee recalculation only when exact dependency inputs shift.

**Q: Explain the precise mechanics of the `@for` block's `track` expression and why it is absolutely vital for rendering performance.**
**A:** The `track` expression inside an `@for` block acts as a mandatory instruction telling the Angular template compiler exactly how to uniquely identify each discrete item in an iterable sequence. Without this strict tracking capability, if an array updates (an item is prepended or reordered), Angular is forced to aggressively destroy and expensively recreate the entire DOM list segment. By providing a stable unique identifier (like `track item.id`), Angular's runtime can intelligently track which specific node moved, leading to highly optimized, surgical DOM mutations.

**Q: When building a structural directive like `*ngIf` from scratch, what specific Angular core services must be injected, and what is their architectural purpose?**
**A:** Building a custom structural directive strictly requires injecting `TemplateRef` and `ViewContainerRef`. The `TemplateRef` represents the actual HTML content payload (the template snippet) that the directive is attached to, which Angular has extracted from the DOM behind the scenes into memory. The `ViewContainerRef` represents the physical location (the DOM container node) where the template should be rendered. You utilize the view container's API methods (specifically `createEmbeddedView(templateRef)` or `clear()`) to dynamically insert or destroy the template snippet from the live DOM tree based on your custom business logic.

---

## 10. 📄 Cheat Sheet

**Built-in Attribute Directives:**
```html
<!-- Single class toggle (Highly Preferred over ngClass) -->
<div [class.active]="isActive()"></div>

<!-- Multiple conditional classes via ngClass object -->
<div [ngClass]="{'active': isActive(), 'disabled': isDisabled()}"></div>

<!-- Single style toggle (Highly Preferred over ngStyle) -->
<div [style.color]="textColor()" [style.width.px]="widthInPixels()"></div>

<!-- Multiple conditional styles via ngStyle object -->
<div [ngStyle]="{'background-color': bgColor(), 'font-size': size() + 'px'}"></div>
```

**Common formatting Pipes:**
```html
{{ today | date:'medium' }}         <!-- Outputs: "Jan 16, 2024, 3:30:45 PM" -->
{{ price | currency:'USD' }}        <!-- Outputs: "$9.99" -->
{{ ratio | percent:'1.1-2' }}       <!-- Outputs: "25.5%" -->
{{ config | json }}                 <!-- Outputs entire object string tree -->
{{ data$ | async }}                 <!-- Unwraps observable safely -->
```

**Modern Directive Scaffold (`host:` approach):**
```ts
import { Directive, input, linkedSignal } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  host: {
    '[attr.aria-label]': 'text()',
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '[class.tooltip-active]': 'isVisible()'
  }
})
export class TooltipDirective {
  text = input.required<string>({ alias: 'appTooltip' });
  isVisible = linkedSignal(() => false);
  
  show() { this.isVisible.set(true); }
  hide() { this.isVisible.set(false); }
}
```

**Robust Custom Pipe Scaffold:**
```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ 
  name: 'myPipe',
  pure: true // Default behavior, explicit for readability
})
export class MyPipe implements PipeTransform {
  transform(value: string | number, param1: string = 'default'): string {
    if (!value) return '';
    // Implement robust transformation logic here
    return `${value} transformed with ${param1}`;
  }
}
```

---

## 11. 📌 Key Takeaways

- **Directives act as behavior modifiers:** They serve as logical "stickers" you apply directly to existing DOM elements, granting them entirely new capabilities, event listeners, or dynamic styling behaviors without needing a heavyweight component wrapper.
- **Embrace Modern Host Bindings:** The `host:` object configuration inside the `@Directive` decorator is the strictly centralized, modern standard for interacting with host elements, superseding the historically scattered `@HostBinding` and `@HostListener` decorators.
- **Pipes govern formatting:** Pipes act as lenses that take raw programmatic data and gracefully transform it strictly for the user interface, meticulously keeping your TypeScript component files completely free of string-manipulation and date-formatting logic overhead.
- **Relentlessly Prioritize Pure Pipes:** Angular's pure pipes are highly optimized via memoization. Always avoid creating impure pipes (`pure: false`), especially for array filtering or sorting. Instead, delegate all complex array logic to hyper-efficient `computed()` signals directly within the component class.
- **Strictly Adopt Built-in Control Flow:** For conditionally rendering any DOM element structures, perpetually favor the modern built-in compiler syntaxes (`@if`, `@for`, `@switch`) over their slower, more verbose legacy structural directive counterparts (`*ngIf`, `*ngFor`).
- **AsyncPipe is non-negotiable:** When dealing with continuous Observables in UI templates, `AsyncPipe` is an absolute necessity for clean, automated, leak-free subscriptions and reliable change detection triggering.

---

**Next Lecture:** [Lecture 26 — Angular Routing & Navigation](./26%20-%20Angular%20Routing%20&%20Navigation.md)