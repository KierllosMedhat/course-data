# Lecture 25 — Angular Directives & Pipes

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Distinguish between attribute directives and structural directives
- Use built-in directives: `ngClass`, `ngStyle`
- Build custom attribute directives with signal `input()` and the `host:` property
- Understand structural directives vs built-in control flow (`@if`, `@for`)
- Use built-in pipes: `DatePipe`, `CurrencyPipe`, `AsyncPipe`, `JsonPipe`, and more
- Create custom pipes with `@Pipe` and `PipeTransform`
- Understand pure vs impure pipes and their performance implications

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What are directives? Attribute vs structural
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

Directives are classes that **add behaviour** to elements in your Angular application — they extend HTML with custom attributes and logic.

| Category | Purpose | Examples |
|----------|---------|---------|
| **Components** | Directives with a template | Every component you've built |
| **Attribute Directives** | Change appearance or behaviour | `ngClass`, `ngStyle`, custom highlight |
| **Structural Directives** | Alter the DOM | Legacy `*ngIf`, `*ngFor` (now `@if`, `@for`) |

---

## 2. Built-in Attribute Directives

### `[ngClass]` — Add/Remove CSS Classes Conditionally
```html
<div [ngClass]="{ 'active': isActive, 'highlight': isHighlighted }">
  Conditional classes
</div>
```

### `[ngStyle]` — Set Inline Styles Dynamically
```html
<p [ngStyle]="{ 'color': textColor, 'font-size': fontSize + 'px' }">
  Dynamic inline styling
</p>
```

> [!TIP]
> For simple single-class toggling, prefer `[class.active]="isActive()"` over `ngClass`. For single-style changes, prefer `[style.color]="textColor()"`. 

---

## 3. Host Element Bindings — The Modern `host:` Property

In Angular, the recommended way to bind to the **host element** (the element the directive is applied to) is the `host:` property in the decorator. The older `@HostBinding` and `@HostListener` decorators are discouraged.

```ts
@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': 'backgroundColor()',   // Property binding
    '(mouseenter)': 'onMouseEnter()',                  // Event listener
    '(mouseleave)': 'onMouseLeave()',                  // Event listener
    '[class.active]': 'isActive()',                    // Class binding
  }
})
export class HighlightDirective {
  // ...
}
```

---

## 4. Custom Attribute Directives

Let's build that Highlight Directive:

```ts
import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '[style.backgroundColor]': 'currentColor()'
  }
})
export class HighlightDirective {
  color = input('yellow', { alias: 'appHighlight' });
  
  // Internal state
  currentColor = linkedSignal(() => '');

  onMouseEnter(): void {
    this.currentColor.set(this.color());
  }

  onMouseLeave(): void {
    this.currentColor.set('');
  }
}
```

### Usage
```html
<p appHighlight>Hover me — default yellow</p>
<p [appHighlight]="'lightblue'">Hover me — light blue</p>
```

---

## 5. Structural Directives vs Control Flow

You'll see `*ngIf` and `*ngFor` in older codebases. In modern Angular (v17+), we use `@if` and `@for`. They are built into the template engine and perform much better.

---

## 6. Pipes — Transforming Data in Templates

A **pipe** takes an input value and returns a transformed value for display. Pipes keep your component class clean.

### Syntax
```html
{{ value | pipeName }}
{{ value | pipeName: arg1 : arg2 }}
{{ value | pipe1 | pipe2 }} <!-- chaining -->
```

### Built-in Pipes
- `DatePipe`: `{{ today | date:'short' }}`
- `CurrencyPipe`: `{{ price | currency:'USD' }}`
- `UpperCasePipe`: `{{ name | uppercase }}`
- `JsonPipe`: `{{ object | json }}`

---

## 7. Custom Pipes

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, ellipsis: string = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit) + ellipsis;
  }
}
```

### Pure vs Impure Pipes
By default, all pipes are **pure**. They only re-run when the input *reference* changes.
Impure pipes (`pure: false`) run on every change detection cycle — use sparingly for performance reasons!

---

## 🧪 Practice Labs

### Lab 1 — Highlight Directive (40 min)
1. Generate: `ng g d highlight`
2. Recreate the `appHighlight` directive shown above.
3. Apply it to list items in your app component.

### Lab 2 — Truncate Pipe (30 min)
1. Generate: `ng g p truncate`
2. Implement the `transform` function.
3. Test it on a long paragraph of text.

---

## 📝 Assignment: ShopAngular Project — Part 3

Let's polish ShopAngular with directives and pipes!

### Requirements
1. Open your ShopAngular project.
2. In your `ProductCardComponent`, ensure the price is formatted using the built-in `CurrencyPipe`.
3. Create a custom pipe named `DiscountPipe`. It should accept a price and a discount percentage, and return the newly discounted price. Apply it if a product is on sale!
4. Create a custom directive named `HoverShadowDirective`. It should add a subtle CSS box-shadow to your product cards when the user's mouse enters, and remove it when it leaves. (Use the `host:` property!).
5. Apply your pipe and directive to the template!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Attribute Directives | https://angular.dev/guide/directives/attribute-directives |
| Angular Pipes | https://angular.dev/guide/pipes |

---

## 📌 Key Takeaways
- **Directives** add behavior to elements without their own template.
- The **`host:` property** replaces `@HostBinding`/`@HostListener` — all bindings in one place!
- **Pipes** transform data right before display, keeping components clean.
- **Pure pipes** only recalculate when inputs change.

---

**Next Lecture:** [Lecture 26 — Angular Routing & Navigation](./26%20-%20Angular%20Routing%20%26%20Navigation.md)