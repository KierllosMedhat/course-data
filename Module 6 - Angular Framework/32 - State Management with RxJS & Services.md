# Lecture 32 — State Management with RxJS & Signals
**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)
---
## 🎯 Learning Objectives
By the end of this lecture, you will be able to:
- Explain what "state" is in plain English and why managing it matters
- Distinguish between component state and application state and decide which to use
- Build centralised shared state with the "signal-in-a-service" pattern
- Use `BehaviorSubject` for reactive state and understand when to prefer it over signals
- Apply immutable state updates using spread operators and array methods
- Create derived selectors with `computed()` and understand memoization
- Bridge between RxJS Observables and Angular Signals with `toSignal()` / `toObservable()`
- Understand NgRx SignalStore for complex global state scenarios
---
## 📋 Agenda
### Part 1 — Theory (~90 min)
1. What is "state" and why does it need managing?
2. Component state vs application state — the decision framework
3. The Signal-in-a-Service pattern (Angular's modern recommendation)
4. BehaviorSubject vs Signals — when to use which
5. Immutable state updates — the golden rule explained deeply
6. Selectors: `computed()` for derived, memoized state
7. NgRx SignalStore overview
### Part 2 — Practice / Lab (~90–120 min)
1. Build a centralised auth state service
2. Derived selectors with computed signals
3. ShopAngular Project Part 9: State Management Refactor
---
## 1. What is "State" and Why Does It Need Managing?
### The Plain-English Explanation
"State" is just a fancy word for **data that changes over time and needs to be reflected in the UI**.
Consider a traffic light. Its state (red, amber, green) dictates how drivers and pedestrians react. In web apps, state behaves similarly.
In a web application, state includes:
- **Is the user logged in?** (authentication state)
- **What items are in the shopping cart?** (cart state)
- **Is this modal dialog open or closed?** (UI state)
- **What products have been loaded from the server?** (server/cache state)
- **Is the data still loading?** (loading state)
### The Problem: Data Scattered Across Components
Imagine a typical e-commerce app with this component tree:
```
AppComponent
├── NavbarComponent          ← needs: current user name, cart item count
├── ProductListComponent     ← needs: products list, cart to add items
│   └── ProductCardComponent ← needs: cart to add items
├── CartSidebarComponent     ← needs: cart items, totals
└── CheckoutComponent        ← needs: cart items, user info
```
If you store the cart inside `ProductListComponent`, how does `NavbarComponent` know the count? How does `CheckoutComponent` access the items? You would have to pass data up through `@Output`, then back down through `@Input`, creating long chains of props — a pattern called **"prop drilling"** that becomes a maintenance nightmare.
### The Solution: Centralised State in a Service
Lift shared state into a **singleton service** that any component can inject:
```
                    ┌────────────────────────────────┐
                    │          CartService            │
                    │  private _items = signal<[]>([])│
                    │  items    = _items.asReadonly() │
                    │  itemCount = computed(...)      │
                    │  totalPrice = computed(...)     │
                    │  add(product) { ... }           │
                    │  remove(id)   { ... }           │
                    └────────────────────────────────┘
                         ▲          ▲          ▲
                inject()  │          │          │  inject()
                          │          │          │
                    NavbarComp  CartSidebar  Checkout
                    (reads itemCount)  (reads items)  (reads items)
```
Every component that needs cart data simply injects `CartService` — no prop drilling required.
### Why Does This Matter?
> [!NOTE]
> Understanding state management is arguably the most important architectural skill in frontend development. Poor state management is the #1 cause of bugs in complex apps — data gets out of sync, UI shows stale values, race conditions occur. A clear state model prevents all of these.
---
## 2. Component State vs Application State
Not all state belongs in a service. Before creating a service, ask: **who needs this data?**
| Feature | Component State | Application State |
|---------|----------------|-------------------|
| **Owner** | Single component class | Centralised injectable service |
| **Lifespan** | Destroyed when component destroys | Survives navigation and route changes |
| **Examples** | Form draft values, accordion expanded, tab index, tooltip visibility | Logged-in user, shopping cart, product list, notifications |
| **Angular tool** | `signal()` inside the component | `signal()` inside a `providedIn: 'root'` service |
| **Sharing** | Not shared — isolated | Shared by any component that injects it |
### The Decision Framework
Ask yourself these questions in order:
```
Is this data only used by ONE component?
       │
      YES → Component state: signal() inside the component itself
       │
       NO ↓
Is it needed across different routes / feature modules?
       │
       NO → Pass via @Input()/@Output() or a shared parent component
       │
      YES ↓
Create a service. Is the state very complex (5+ consumers, 
strict mutation rules, time-travel debugging needed)?
       │
       NO → Signal-in-a-Service pattern (covered in Section 3)
       │
      YES → NgRx SignalStore (covered in Section 7)
```
### Practical Examples
```typescript
@Component({ standalone: true, ... })
export class SearchBarComponent {
  isDropdownOpen = signal(false);
  searchQuery = signal('');
  toggleDropdown(): void {
    this.isDropdownOpen.update(open => !open);
  }
}
@Injectable({ providedIn: 'root' })
export class CartService {
  private _cartItems = signal<CartItem[]>([]);
  cartItems = this._cartItems.asReadonly();
}
```
---
## 3. The Signal-in-a-Service Pattern
### What is This Pattern?
This is **Angular's officially recommended approach** for shared reactive state. The core rules:
1. **Private writable signals** — only the service can modify them
2. **Public read-only signals** — components can only read, never write directly
3. **Public methods** — the *only* allowed way to modify state from outside the service
4. **`computed()` selectors** — derived state that recalculates automatically
This gives you **encapsulation** (components cannot corrupt state accidentally) and **predictability** (all mutations go through defined, named methods).
### Real-World Analogy
Think of a bank account. You cannot directly change your balance; you must use authorized channels (deposit, withdraw). The bank is the service, your balance is the private signal, and deposit/withdraw are the public methods.
### Complete Example: A Todo Store
```typescript
import { Injectable, computed, signal } from '@angular/core';
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}
@Injectable({ providedIn: 'root' })
export class TodoStore {
  private _todos = signal<Todo[]>([]);
  private _loading = signal(false);
  private _errorMessage = signal<string | null>(null);
  todos = this._todos.asReadonly();
  loading = this._loading.asReadonly();
  errorMessage = this._errorMessage.asReadonly();
  completedTodos = computed(() => this._todos().filter(t => t.completed));
  activeTodos    = computed(() => this._todos().filter(t => !t.completed));
  totalCount     = computed(() => this._todos().length);
  completedCount = computed(() => this.completedTodos().length);
  completionRate = computed(() => {
    const total = this.totalCount();
    return total === 0 ? 0 : Math.round((this.completedCount() / total) * 100);
  });
  isEmpty = computed(() => this._todos().length === 0);
  /** Add a new todo with the given title */
  add(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    this._todos.update(todos => [
      ...todos,
      {
        id: Date.now(),
        title: trimmed,
        completed: false,
        createdAt: new Date(),
      }
    ]);
  }
  /** Toggle a todo's completed status */
  toggle(id: number): void {
    this._todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
  /** Update a todo's title text */
  updateTitle(id: number, newTitle: string): void {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    this._todos.update(todos =>
      todos.map(todo => todo.id === id ? { ...todo, title: trimmed } : todo)
    );
  }
  /** Remove a todo by ID */
  remove(id: number): void {
    this._todos.update(todos => todos.filter(todo => todo.id !== id));
  }
  /** Remove all completed todos at once */
  clearCompleted(): void {
    this._todos.update(todos => todos.filter(todo => !todo.completed));
  }
  /** Load todos from an external source (e.g., API response) */
  setTodos(todos: Todo[]): void {
    this._todos.set(todos);
    this._loading.set(false);
    this._errorMessage.set(null);
  }
  setLoading(value: boolean): void { this._loading.set(value); }
  setError(message: string): void  { this._errorMessage.set(message); this._loading.set(false); }
}
```
### Using the Store in a Component
```typescript
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../stores/todo.store';
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="todo-app">
      <h1>My Todos</h1>
      <!-- Stats bar: these all update automatically when the store changes -->
      <p class="stats">
        {{ store.completedCount() }} of {{ store.totalCount() }} completed
        ({{ store.completionRate() }}%)
      </p>
      <!-- Loading and error states -->
      @if (store.loading()) {
        <p>Loading...</p>
      }
      @if (store.errorMessage()) {
        <p class="error">{{ store.errorMessage() }}</p>
      }
      <!-- Add new todo -->
      <div class="add-row">
        <input
          [(ngModel)]="newTitle"
          placeholder="What needs to be done?"
          (keyup.enter)="addTodo()"
        >
        <button (click)="addTodo()" [disabled]="!newTitle.trim()">Add</button>
      </div>
      <!-- Todo list -->
      <ul class="todo-list">
        @for (todo of store.todos(); track todo.id) {
          <li [class.completed]="todo.completed">
            <input
              type="checkbox"
              [checked]="todo.completed"
              (change)="store.toggle(todo.id)"
            >
            <span>{{ todo.title }}</span>
            <button class="delete-btn" (click)="store.remove(todo.id)">🗑</button>
          </li>
        } @empty {
          <li class="empty-state">
            No todos yet. Add one above to get started!
          </li>
        }
      </ul>
      <!-- Clear completed button — only shows when there are completed todos -->
      @if (store.completedCount() > 0) {
        <button class="clear-btn" (click)="store.clearCompleted()">
          Clear {{ store.completedCount() }} completed
        </button>
      }
    </div>
  `
})
export class TodoListComponent {
  store = inject(TodoStore);
  newTitle = '';
  addTodo(): void {
    if (this.newTitle.trim()) {
      this.store.add(this.newTitle);
      this.newTitle = '';
    }
  }
}
```
### Common Mistakes & How to Avoid Them
| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| Making signals public and writable | Any component can corrupt state | Use `private _signal` + `public = _signal.asReadonly()` |
| Mutating state in a component | Changes aren't detected, UI goes stale | Only call public methods on the store |
| Putting everything in a global service | Services become a dumping ground | Ask "does more than one component need this?" |
| Using a JS getter instead of `computed()` | Not reactive — won't trigger updates | Use `computed(() => ...)` for derived values |
---
## 4. BehaviorSubject vs Signals
### What is a BehaviorSubject?
Before Angular Signals were introduced (Angular 16+), `BehaviorSubject` from RxJS was the go-to tool for reactive state management. It remains valid and powerful — especially for asynchronous scenarios.
**What is RxJS?** RxJS (Reactive Extensions for JavaScript) is a library for composing asynchronous, event-based programs using Observable sequences. Think of it as a powerful pipeline for streams of data — you can transform, filter, delay, combine, and react to data flowing over time.
A `BehaviorSubject`:
- Always holds a **current value** (unlike a plain `Subject` which has no memory)
- Emits that current value **immediately** to any new subscriber
- Gives you the full power of **RxJS operators** (`.pipe()`, `debounceTime()`, `switchMap()`, `combineLatest()`, etc.)
### BehaviorSubject vs Signal
A BehaviorSubject acts like a **radio broadcast**: anyone who tunes in hears the current ongoing broadcast immediately. A Signal acts like a **whiteboard**: anyone glancing at it instantly reads the current value, and observers are notified on rewrites.
### BehaviorSubject Example
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
@Injectable({ providedIn: 'root' })
export class CartServiceRxJS {
  private _cartItems$ = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this._cartItems$.asObservable();
  totalItems$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );
  totalPrice$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
  );
  addToCart(product: CartItem): void {
    const current = this._cartItems$.getValue();
    this._cartItems$.next([...current, product]);
  }
  removeFromCart(productId: number): void {
    const current = this._cartItems$.getValue();
    this._cartItems$.next(current.filter(item => item.id !== productId));
  }
}
```
```html
<!-- Template: must use async pipe to unwrap the Observable -->
<!-- 
  The async pipe:
  1. Subscribes to the Observable automatically
  2. Returns the latest emitted value for display
  3. Unsubscribes automatically when the component is destroyed (no memory leaks!)
-->
<p>Items in cart: {{ cartService.totalItems$ | async }}</p>
<p>Total: {{ cartService.totalPrice$ | async | currency }}</p>
```
### Side-by-Side Comparison
| Scenario | Use Signals | Use BehaviorSubject |
|----------|------------|---------------------|
| **Synchronous UI state** | ✅ Simpler syntax, no `async` pipe | Works but verbose |
| **Derived/computed values** | ✅ `computed()` — zero boilerplate | `pipe(map(...))` — more code |
| **HTTP / WebSocket data** | Use `toSignal()` to convert | ✅ Native — RxJS operators shine here |
| **Debouncing user input** | Use `toObservable()` → RxJS | ✅ `debounceTime()` operator |
| **Combining multiple streams** | — | ✅ `combineLatest()`, `merge()`, `zip()` |
| **Template binding** | `{{ store.value() }}` (direct) | `{{ store.value$ \| async }}` (async pipe) |
| **Testing** | ✅ Simpler — synchronous | Requires `TestScheduler` for async tests |
| **Learning curve** | ✅ Lower for beginners | Higher — requires RxJS knowledge |
> [!TIP]
> The modern consensus: **Signals for UI state, RxJS for async streams**. They're complementary, not competing. Use `toSignal()` and `toObservable()` from `@angular/core/rxjs-interop` to bridge them.
### Bridging Signals ↔ RxJS
One of Angular's most powerful features is that Signals and RxJS work seamlessly together. You can convert between them at any point in your data flow.
```typescript
import { Component, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs';
export interface Product {
  id: number;
  name: string;
  price: number;
}
@Component({
  standalone: true,
  template: `
    <!-- Signal input — easy two-way binding -->
    <input
      [value]="searchQuery()"
      (input)="searchQuery.set($any($event.target).value)"
      placeholder="Search products..."
    >
    <!-- No async pipe needed! searchResults is a Signal already -->
    @for (product of searchResults(); track product.id) {
      <div class="result">{{ product.name }} — {{ product.price | currency }}</div>
    }
    @if (searchResults().length === 0 && searchQuery().length > 2) {
      <p>No products found for "{{ searchQuery() }}"</p>
    }
  `
})
export class SearchComponent {
  private http = inject(HttpClient);
  searchQuery = signal('');
  private searchQuery$ = toObservable(this.searchQuery);
  private searchResults$ = this.searchQuery$.pipe(
    debounceTime(300),
    switchMap(query =>
      query.length < 3
        ? []
        : this.http.get<Product[]>(`/api/products/search?q=${query}`)
    )
  );
  searchResults = toSignal(this.searchResults$, { initialValue: [] as Product[] });
}
```
**Data flow visualization:**
```
User types in input
       ↓
searchQuery (Signal)   — simple, reactive, easy to bind
       ↓ toObservable()
searchQuery$ (Observable) — now we have RxJS power
       ↓ debounceTime(300) — wait for user to stop typing
       ↓ switchMap(q => http.get(...)) — cancel old request, start new
searchResults$ (Observable<Product[]>)
       ↓ toSignal(initialValue: [])
searchResults (Signal<Product[]>) — back to signal for clean template syntax
```
---
## 5. Immutable State Updates — The Golden Rule
### Why Immutability is Non-Negotiable
Angular's signal-based change detection works by comparing **object references** (memory addresses), not deep equality. This is intentional — it's extremely fast (just a pointer comparison, not looping through every property).
```
Before:  _todos signal → [array at address 0x1A2B]
After push():  _todos signal → [SAME array at address 0x1A2B] ← signal sees NO change!
After spread: _todos signal → [NEW array at address 0x3C4D]  ← signal detects change ✅
```
**Analogy:** Imagine a tracking system checking if a package's *shipping label* changed. If you add items without changing the label, the tracker assumes nothing happened. You must put items in a **new box with a new label**.
### The Three Essential Immutable Operations
#### Adding an Item
```typescript
this._todos.update(todos => {
  todos.push(newTodo);
  return todos;
});
this._todos.update(todos => [...todos, newTodo]);
this._todos.update(todos => [newTodo, ...todos]);
```
#### Updating an Item
```typescript
this._todos.update(todos => {
  const found = todos.find(t => t.id === id);
  found!.completed = true;
  return todos;
});
this._todos.update(todos =>
  todos.map(todo =>
    todo.id === id
      ? { ...todo, completed: true }
      : todo
  )
);
```
#### Removing an Item
```typescript
this._todos.update(todos => {
  todos.splice(todos.findIndex(t => t.id === id), 1);
  return todos;
});
this._todos.update(todos => todos.filter(todo => todo.id !== id));
```
### Shallow vs Deep Immutability
The spread operator (`...`) creates a **shallow copy** — only the top-level structure is new. Nested objects still share references:
```typescript
const user = {
  id: 1,
  name: 'Alice',
  address: { city: 'Cairo', country: 'Egypt' }
};
const updated = { ...user, name: 'Alice Smith' };
const movedUser = {
  ...user,
  address: { ...user.address, city: 'Alexandria' }
};
```
For deeply nested structures, use `structuredClone()` for a complete independent copy:
```typescript
const deepCopy = structuredClone(complexNestedObject);
deepCopy.nested.deeply.value = 'changed';
```
### Common Mistakes & How to Avoid Them
| Mistake | Symptom | Fix |
|---------|---------|-----|
| `todos.push(newTodo)` in update() | UI doesn't update | Use spread: `[...todos, newTodo]` |
| `item.property = newValue` | UI doesn't update | Use spread: `{ ...item, property: newValue }` |
| `todos.splice(idx, 1)` | UI doesn't update | Use filter: `todos.filter(t => t.id !== id)` |
| Modifying nested objects without spreading them | Nested UI doesn't update | Double-spread: `{ ...obj, nested: { ...obj.nested, key: val } }` |
---
## 6. Selectors — Derived State with `computed()`
### What is a Selector?
A selector is derived state — a value **calculated from other state** that automatically updates when its source data changes. Think of it like a spreadsheet formula: `=SUM(A1:A10)` recalculates itself whenever any of those cells change.
Angular's `computed()` works exactly the same way. It watches its signal dependencies and only recalculates when they change.
### Why Does This Matter?
Without `computed()`, you'd either:
1. **Calculate in the template** — causes repeated calculations on every render cycle
2. **Store a separate variable** — gets out of sync when source data changes
3. **Use a getter** — not reactive, won't trigger Angular's change detection
`computed()` solves all three problems: it calculates once, stays in sync, and is fully reactive.
### Real-World Cart Store with Selectors
```typescript
import { Injectable, computed, signal } from '@angular/core';
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
@Injectable({ providedIn: 'root' })
export class CartStore {
  private _items        = signal<CartItem[]>([]);
  private _promoCode    = signal<string | null>(null);
  private _discountPct  = signal(0);
  items     = this._items.asReadonly();
  promoCode = this._promoCode.asReadonly();
  itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );
  subtotal = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  discountAmount = computed(() =>
    this.subtotal() * (this._discountPct() / 100)
  );
  total = computed(() => this.subtotal() - this.discountAmount());
  isEmpty         = computed(() => this._items().length === 0);
  hasFreeShipping = computed(() => this.subtotal() >= 50);
  hasDiscount     = computed(() => this._discountPct() > 0);
  addItem(product: { id: number; name: string; price: number; imageUrl: string }): void {
    this._items.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl
        }
      ];
    });
  }
  removeItem(productId: number): void {
    this._items.update(items => items.filter(i => i.productId !== productId));
  }
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this._items.update(items =>
      items.map(i => i.productId === productId ? { ...i, quantity } : i)
    );
  }
  applyPromoCode(code: string, discountPercent: number): void {
    this._promoCode.set(code);
    this._discountPct.set(discountPercent);
  }
  removePromoCode(): void {
    this._promoCode.set(null);
    this._discountPct.set(0);
  }
  clearCart(): void {
    this._items.set([]);
    this._promoCode.set(null);
    this._discountPct.set(0);
  }
}
```
### Using Selectors in a Template
```html
<!-- cart-summary.component.html -->
<aside class="cart-summary">
  <h2>Your Order ({{ cart.itemCount() }} items)</h2>
  @if (cart.isEmpty()) {
    <div class="empty-cart">
      <p>🛒 Your cart is empty!</p>
      <a routerLink="/products">Continue Shopping</a>
    </div>
  } @else {
    <!-- Item list -->
    <ul class="cart-items">
      @for (item of cart.items(); track item.productId) {
        <li class="cart-item">
          <img [src]="item.imageUrl" [alt]="item.name" width="60">
          <div class="item-details">
            <strong>{{ item.name }}</strong>
            <!-- Price per unit × quantity -->
            <span>{{ item.price | currency }} × {{ item.quantity }}</span>
          </div>
          <!-- Line total for this item -->
          <span class="item-total">
            {{ item.price * item.quantity | currency }}
          </span>
          <button (click)="cart.removeItem(item.productId)">×</button>
        </li>
      }
    </ul>
    <!-- Order summary calculations — all from computed() selectors -->
    <div class="order-breakdown">
      <div class="row">
        <span>Subtotal</span>
        <span>{{ cart.subtotal() | currency }}</span>
      </div>
      @if (cart.hasDiscount()) {
        <div class="row discount">
          <span>Discount ({{ cart.promoCode() }})</span>
          <span>−{{ cart.discountAmount() | currency }}</span>
        </div>
      }
      <div class="row">
        <span>Shipping</span>
        @if (cart.hasFreeShipping()) {
          <span class="free">FREE 🎉</span>
        } @else {
          <span>$5.99</span>
          <small>(Free over $50)</small>
        }
      </div>
      <div class="row total">
        <strong>Total</strong>
        <strong>{{ cart.total() | currency }}</strong>
      </div>
    </div>
  }
</aside>
```
### Memoization: Why `computed()` is Efficient
`computed()` **caches** its result and only recomputes when a dependency signal changes. This is called **memoization**.
```typescript
total = computed(() => {
  console.log('⚡ Recalculating total...');
  return this.subtotal() - this.discountAmount();
});
for (let i = 0; i < 1000; i++) {
  console.log(cart.total());
}
cart.addItem(product);
console.log(cart.total());
```
Without memoization (e.g., if you used a plain getter), the calculation would run 1001 times instead of 2.
---
## 7. NgRx SignalStore
### When Do You Need More Than Signal-in-a-Service?
Signal-in-a-service handles most Angular apps perfectly. But in large, complex applications you might encounter:
- Tens of services with overlapping or dependent state
- Difficulty tracing which service changed what and when (debugging is hard)
- Need for Redux DevTools time-travel debugging
- Strict enforced patterns across a large development team
That is when **NgRx SignalStore** provides value.
### What is NgRx SignalStore?
NgRx SignalStore is a **signal-native** state management library from the NgRx team. It uses a composable "features" pattern to build stores declaratively. Think of it as an opinionated structure built on top of Angular signals.
```bash
# Install the NgRx Signals package
npm install @ngrx/signals
```
```typescript
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState
} from '@ngrx/signals';
import { computed } from '@angular/core';
interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
}
export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState<TodoState>({
    todos: [],
    filter: 'all',
    loading: false,
  }),
  withComputed(({ todos, filter }) => ({
    filteredTodos: computed(() => {
      const all = todos();
      switch (filter()) {
        case 'active':    return all.filter(t => !t.completed);
        case 'completed': return all.filter(t => t.completed);
        default:          return all;
      }
    }),
    totalCount:     computed(() => todos().length),
    completedCount: computed(() => todos().filter(t => t.completed).length),
    isEmpty:        computed(() => todos().length === 0),
  })),
  withMethods(store => ({
    addTodo(title: string): void {
      patchState(store, {
        todos: [...store.todos(), { id: Date.now(), title, completed: false }]
      });
    },
    toggleTodo(id: number): void {
      patchState(store, {
        todos: store.todos().map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      });
    },
    removeTodo(id: number): void {
      patchState(store, {
        todos: store.todos().filter(t => t.id !== id)
      });
    },
    setFilter(filter: 'all' | 'active' | 'completed'): void {
      patchState(store, { filter });
    }
  }))
);
```
```typescript
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoStore } from './todo.signal-store';
@Component({
  selector: 'app-todo-ngrx',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="todo-app">
      <h1>NgRx Todo</h1>
      <!-- store.completedCount() and store.totalCount() are computed signals -->
      <p>{{ store.completedCount() }}/{{ store.totalCount() }} completed</p>
      <input [(ngModel)]="newTitle" (keyup.enter)="add()" placeholder="New todo...">
      <button (click)="add()">Add</button>
      <!-- Filter buttons call store methods directly -->
      <div class="filters">
        <button (click)="store.setFilter('all')">All</button>
        <button (click)="store.setFilter('active')">Active</button>
        <button (click)="store.setFilter('completed')">Completed</button>
      </div>
      <!-- store.filteredTodos() is a computed signal -->
      @for (todo of store.filteredTodos(); track todo.id) {
        <div class="todo-item">
          <input type="checkbox" [checked]="todo.completed" (change)="store.toggleTodo(todo.id)">
          <span [class.done]="todo.completed">{{ todo.title }}</span>
          <button (click)="store.removeTodo(todo.id)">🗑</button>
        </div>
      }
      @if (store.isEmpty()) {
        <p>No todos match the current filter.</p>
      }
    </div>
  `
})
export class TodoListNgrxComponent {
  store = inject(TodoStore);
  newTitle = '';
  add(): void {
    if (this.newTitle.trim()) {
      this.store.addTodo(this.newTitle);
      this.newTitle = '';
    }
  }
}
```
### When to Choose Each Approach
```
Signal-in-a-Service (recommended starting point):
  ✅ Small to medium apps
  ✅ Up to ~5 components sharing the same state
  ✅ Simple async flows
  ✅ Learning Angular state management
  ✅ Minimal dependencies (no extra packages)
NgRx SignalStore (scale up when needed):
  ✅ Large enterprise apps with many feature modules
  ✅ Many consumers sharing the same state (5+)
  ✅ Need for strict, enforced mutation patterns on large teams
  ✅ Want NgRx DevTools for time-travel debugging
  ✅ Complex async side effects
```
> [!NOTE]
> Start with Signal-in-a-Service. Migrate to NgRx SignalStore **incrementally** as complexity demands — you do not need NgRx on day one.
---
## Common Mistakes & How to Avoid Them
### Mistake 1: Over-Using Global State
```typescript
@Injectable({ providedIn: 'root' })
export class GlobalStore {
  isSearchFocused = signal(false);
  dropdownOpen = signal(false);
  hoverIndex = signal(-1);
}
@Component({...})
export class SearchBarComponent {
  isSearchFocused = signal(false);
}
```
### Mistake 2: Mutating State Arrays/Objects Directly
```typescript
addItem(product: Product): void {
  this._items().push(product);
}
addItem(product: Product): void {
  this._items.update(items => [...items, product]);
}
```
### Mistake 3: Exposing Writable Signals Publicly
```typescript
@Injectable({ providedIn: 'root' })
export class CartStore {
  cartItems = signal<Product[]>([]);
}
this.cartStore.cartItems.set([]);
@Injectable({ providedIn: 'root' })
export class CartStore {
  private _cartItems = signal<Product[]>([]);
  cartItems = this._cartItems.asReadonly();
}
```
### Mistake 4: Using a Getter Instead of `computed()`
```typescript
get totalItems(): number {
  return this._items().length;
}
totalItems = computed(() => this._items().length);
```
### Mistake 5: Subscribing Manually Instead of Using `async` or `toSignal()`
```typescript
ngOnInit() {
  this.userService.user$.subscribe(user => {
    this.user = user;
  });
}
user = toSignal(this.userService.user$, { initialValue: null });
```
---
## 🧪 Practice Labs
### Lab 1 — Auth State Service (40 min)
1. Generate a store service: `ng g s stores/auth`.
2. Add private signals: `_user = signal<{name: string; email: string} | null>(null)`, `_loading = signal(false)`, `_error = signal<string | null>(null)`.
3. Add computed selectors:
   - `isAuthenticated = computed(() => this._user() !== null)`
   - `userName = computed(() => this._user()?.name ?? 'Guest')`
4. Add a `login(email: string, password: string): void` method that:
   - Sets loading to true
   - Uses `setTimeout(() => ..., 1500)` to simulate an API call
   - Then sets a mock user and loading to false
5. Add a `logout()` method that clears the user signal.
6. Create two components — `LoginFormComponent` and `NavbarComponent` — both injecting `AuthStore` and reacting to `isAuthenticated()` and `userName()`.
### Lab 2 — Product Store with Filter & Sort (35 min)
1. Create `ProductStore` with `_products = signal<Product[]>([])`, `_loading = signal(false)`, and `_error = signal<string | null>(null)`.
2. Add a `loadProducts()` method that uses `HttpClient` or `fetch` to retrieve products from `https://fakestoreapi.com/products` and updates the `_products` signal.
3. Add `_filterText = signal('')` and `_sortBy = signal<'title' | 'price'>('title')`.
4. Build a `filteredAndSortedProducts = computed(...)` that:
   - Filters products whose title includes `filterText()` (case-insensitive using `.toLowerCase()`)
   - Sorts by title or price depending on `sortBy()`
5. Create a component with:
   - A text input that calls `store.setFilter($event.target.value)` on input
   - Two sort buttons calling `store.setSortBy('title')` and `store.setSortBy('price')`
   - A product grid looping over `store.filteredAndSortedProducts()`
---
## 📝 Assignment: ShopAngular Project — Part 9
Refactor the ShopAngular app to use the Signal-in-a-Service pattern throughout and hook your state management directly into the FakeStoreAPI.

### Requirements

**Step 1 — Connect ProductStore to FakeStoreAPI**
1. Create a `ProductStore` service that manages `_products = signal<Product[]>([])`, `_loading = signal(false)`, and `_error = signal<string | null>(null)`.
2. Implement a `loadProducts()` method that fetches data from `https://fakestoreapi.com/products` using Angular's `HttpClient` or native `fetch` and updates the state.
3. Remove any hardcoded/mock product data you were using previously.

**Step 2 — Refactor CartService to Signals**
1. Replace any `BehaviorSubject` usage with `private _cartItems = signal<Product[]>([])`.
2. Expose: `cartItems = this._cartItems.asReadonly()`.

**Step 3 — Computed Selectors**
3. Add `totalItems = computed(() => ...)` — sum of all quantities.
4. Add `totalPrice = computed(() => ...)` — sum of all (price × quantity).
5. Add `isEmpty = computed(() => this._cartItems().length === 0)`.

**Step 4 — Immutable Mutations**
6. `addToCart(product)` — use spread: `[...items, product]`.
   - If the product already exists in the cart, increment its quantity instead.
7. `removeFromCart(productId)` — use filter: `items.filter(i => i.id !== productId)`.
8. `updateQuantity(productId, qty)` — use map: `items.map(i => i.id === productId ? {...i, qty} : i)`.

**Step 5 — Update the UI**
9. Update `ProductListComponent` to trigger `loadProducts()` on initialization and display products from the `ProductStore`.
10. In `CartSidebarComponent`, display `cartService.totalItems()` and `cartService.totalPrice() | currency` — no `| async` pipe needed.
11. Use `@if (cartService.isEmpty())` to show an empty cart message.
12. In `NavbarComponent`, display the cart badge using `cartService.totalItems()`.
---
## 🔗 Resources
| Resource | Link |
|----------|------|
| Angular Signals Guide | https://angular.dev/guide/signals |
| `computed()` Signals | https://angular.dev/guide/signals#computed-signals |
| RxJS Interop (`toSignal`) | https://angular.dev/guide/rxjs-interop |
| NgRx SignalStore Guide | https://ngrx.io/guide/signals/signal-store |
| RxJS BehaviorSubject | https://rxjs.dev/api/index/class/BehaviorSubject |
---
## 📌 Key Takeaways
- **Component state** is for data a single component owns; **application state** belongs in a `providedIn: 'root'` service
- The **signal-in-a-service pattern**: private writable signals → public `asReadonly()` → mutation methods
- **Immutable updates are mandatory** — spread and filter create new references; mutation prevents change detection
- **`computed()`** provides auto-memoized derived state that only recalculates when dependencies change
- **Signals for sync state, RxJS for async streams** — bridge them with `toSignal()` and `toObservable()`
- **NgRx SignalStore** is for complex global state at scale — start without it and add it when needed
---
**Next Lecture:** [Lecture 33 — Angular Testing, Performance & Deployment](./33%20-%20Angular%20Testing%2C%20Performance%20%26%20Deployment.md)
### 📚 Extensive Tutorials & Resources
- **Angular University:** [In-Depth Angular Tutorials](https://blog.angular-university.io/)
- **FreeCodeCamp:** [Angular for Beginners Course](https://www.freecodecamp.org/news/angular-for-beginners-course/)
- **Angular.dev:** [Official Angular Documentation](https://angular.dev/)
