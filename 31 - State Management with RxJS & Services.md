# Lecture 31 — State Management with RxJS & Signals

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Distinguish between component state and application state
- Build centralised state with the "signal-in-a-service" pattern
- Use `BehaviorSubject` for reactive state (and know when to prefer it)
- Apply immutable state updates
- Create derived selectors with `computed()`
- Understand NgRx SignalStore for complex global state

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Component state vs application state
2. Signal-in-a-service pattern
3. BehaviorSubject vs Signals
4. Immutable state updates
5. Selectors: `computed()` for derived state
6. NgRx SignalStore overview

### Part 2 — Practice / Lab (~90–120 min)
1. Centralised auth state service
2. Undo/redo with immutable state history
3. ShopAngular Project Part 9: State Management

---

## 1. Component State vs Application State

| Feature | Component State | Application State |
|---------|----------------|-------------------|
| Owner | Single component | Centralised service |
| Lifespan | Destroyed with component | Survives navigation |
| Examples | Form values, UI toggles | User session, Shopping cart |
| Tooling | `signal()`, properties | `providedIn: 'root'` services |

### Decision Flow
1. Only this component needs it? → **Component state** (`signal()`)
2. Siblings/children across routes need it? → **Service**
3. Complex, many consumers? → **NgRx SignalStore**

---

## 2. The Signal-in-a-Service Pattern

Angular's recommended starting point for shared state:

```ts
@Injectable({ providedIn: 'root' })
export class TodoStore {
  // Private writable state
  private _todos = signal<Todo[]>([]);

  // Public read-only selectors
  todos = this._todos.asReadonly();
  completed = computed(() => this._todos().filter(t => t.completed));
  count = computed(() => this._todos().length);

  // Mutations
  add(title: string): void {
    this._todos.update(todos => [...todos, { id: Date.now(), title, completed: false }]);
  }

  remove(id: number): void {
    this._todos.update(todos => todos.filter(t => t.id !== id));
  }
}
```

### Key Principles
- **Encapsulation:** Writable signal is private. Expose `asReadonly()`.
- **Immutability:** Always create new objects/arrays — never mutate!
- **Synchronous:** Signal updates are deterministic and easy to test.

---

## 3. BehaviorSubject vs Signals

`BehaviorSubject` is still valid for async-heavy state and complex RxJS operator chains.

| Scenario | Use Signals | Use BehaviorSubject |
|----------|------------|-------------------|
| Synchronous UI state | ✅ | — |
| Async streams (HTTP, WebSockets) | — | ✅ |
| Template binding | `{{ store.value() }}` | `{{ store.value$ \| async }}` |

> [!TIP]
> The modern consensus: **Signals for UI → RxJS for async → SignalStore for global state**.

---

## 4. Immutable State Updates — The Golden Rule

> **Never mutate state in place.** Always create new objects and arrays.

### Why?
- Angular checks **references**. If you mutate an array in place, Angular doesn't know it changed.
- `computed()` caches its value based on references.

### Techniques
```ts
// Add (Array Spread)
this._todos.update(todos => [...todos, newTodo]);

// Update (Map)
this._todos.update(todos =>
  todos.map(t => t.id === id ? { ...t, completed: true } : t)
);

// Remove (Filter)
this._todos.update(todos => todos.filter(t => t.id !== id));
```

---

## 5. Selectors — Derived State with `computed()`

```ts
@Injectable({ providedIn: 'root' })
export class ProductStore {
  private _products = signal<Product[]>([]);
  private _filter = signal('');

  filteredProducts = computed(() => {
    const filter = this._filter().toLowerCase();
    return filter
      ? this._products().filter(p => p.name.toLowerCase().includes(filter))
      : this._products();
  });

  setFilter(term: string): void { this._filter.set(term); }
}
```

**Memoisation:** `computed()` caches the last result. It only recalculates when `_products` or `_filter` changes!

---

## 6. NgRx SignalStore

The modern, signal-native approach for complex global state:

```ts
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';

export const TodoStore = signalStore(
  { providedIn: 'root' },

  withState({ todos: [], filter: 'all' }),

  withComputed(({ todos }) => ({
    completedCount: computed(() => todos().filter(t => t.completed).length)
  })),

  withMethods((store) => ({
    addTodo(title: string) {
      patchState(store, { todos: [...store.todos(), { title, completed: false }] });
    }
  }))
);
```

### When to Choose SignalStore
- State has **5+ consumers** across different features.
- You want **strict action discipline** to prevent ad-hoc mutations.

> [!NOTE]
> Start with Signal-in-a-service. Migrate to SignalStore **incrementally** as complexity demands.

---

## 🧪 Practice Labs

### Lab 1 — Auth State Service (40 min)
1. Create `AuthStore` with `user`, `loading`, `error` signals.
2. Selectors: `isAuthenticated`, `userName` (computed).
3. Implement a `login()` method that simulates an HTTP request, updating the states correctly.

### Lab 2 — Derived Selectors (35 min)
1. Create a `ProductStore` with an array of products.
2. Add a `filterText` signal.
3. Build a `filteredProducts` computed signal that filters the list!

---

## 📝 Assignment: ShopAngular Project — Part 9

Let's convert our existing ShopAngular app to use the Signal-in-a-Service pattern!

### Requirements
1. Refactor your existing `CartService` (which used `BehaviorSubject` + `toSignal`) into a pure Signal-in-a-Service architecture.
2. The `CartService` should use a `private _cartItems = signal<Product[]>([]);`.
3. Expose the cart as a readonly signal.
4. Implement `computed()` signals for:
   - `totalItems`
   - `totalPrice`
5. Ensure all mutations (add/remove) use immutable updates (spread operator / filter).

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Signals Guide | https://angular.dev/guide/signals |
| NgRx SignalStore Guide | https://ngrx.io/guide/signals/signal-store |

---

## 📌 Key Takeaways
- **Component state** is for single-component data; **application state** is for shared data.
- The **signal-in-a-service** pattern is the modern way to manage shared state.
- **Immutable updates** are mandatory: spread for shallow, `structuredClone` for deep.
- **`computed()`** provides auto-memoised derived state.
- **NgRx SignalStore** is the ultimate tool for complex global state.

---

**Next Lecture:** [Lecture 32 — Angular Testing, Performance & Deployment](./32%20-%20Angular%20Testing,%20Performance%20%26%20Deployment.md)