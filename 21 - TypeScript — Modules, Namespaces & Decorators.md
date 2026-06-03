# Lecture 21 — TypeScript: Modules, Namespaces & TC39 Decorators

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Organise code with ES modules: `import`, `export`, type-only imports, and barrel files
- Understand namespaces (legacy) and when they appear in older codebases
- Write declaration files (`.d.ts`) for untyped JavaScript libraries
- Install community type definitions from DefinitelyTyped (`@types`)
- Write and apply modern ECMAScript (TC39) decorators (TypeScript 5.0+)
- Use modern TC39 Class, Method, Field, and Accessor decorators
- Configure `tsconfig.json` path mapping for clean imports

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. ES Modules in TypeScript: `import`/`export`, type-only imports, barrel files
2. Namespaces: internal modules, legacy usage
3. Declaration files (`.d.ts`) and DefinitelyTyped (`@types`)
4. Modern TC39 Decorators (TS 5.0+)
5. Class, Method, Field, and Accessor Decorators
6. `tsconfig.json` path mapping (`paths` and `baseUrl`)

### Part 2 — Practice & Lab (~90–120 min)
1. Organise a project with barrel exports and path mapping
2. Write declaration files for untyped JavaScript
3. DataForge Project Part 3: Validation Decorators

---

## 1. ES Modules in TypeScript

### Why Do We Need Modules? The Problem First

Imagine writing an entire web application in a single file. That file would quickly grow to tens of thousands of lines. You'd have:
- No clear boundaries between unrelated features
- Name collisions (two functions accidentally called `formatDate`)
- Impossible to find anything or work in a team without constant conflicts
- No way to reuse code between projects without copy-pasting

**Modules** solve all of these problems by letting you split your code into small, focused files. Each file **exports** the things it wants to share and **imports** only what it needs from other files.

**Real-world analogy:** Think of modules like **LEGO bricks**. Each brick (file) has a specific shape and purpose. You can snap them together in any configuration to build complex structures. You can swap one brick for another without rebuilding the whole thing. And you can use the same brick in multiple builds.

```
Without modules:                      With modules:
─────────────────────────────         ─────────────────────────────────────
app.ts (5000 lines)                   src/
  function formatDate() { ... }         ├── utils/
  function formatCurrency() { ... }     │   ├── date.ts    → exports formatDate
  class UserService { ... }             │   └── money.ts   → exports formatCurrency
  class ProductService { ... }          ├── services/
  interface User { ... }                │   ├── user.ts    → exports UserService
  interface Product { ... }             │   └── product.ts → exports ProductService
  // ... 4900 more lines               └── models/
                                            ├── user.ts    → exports User interface
                                            └── product.ts → exports Product interface
```

### Named Exports & Imports

A **named export** makes a specific declaration (function, class, interface, constant) available to other files.

```ts
// ═══════════════════════════════════════════════════════════════
// FILE: src/utils/math.ts
// This file exports two math utility functions.
// ═══════════════════════════════════════════════════════════════

// The 'export' keyword before a declaration makes it importable from other files.
// Without 'export', this function is private to this file.
export function add(a: number, b: number): number {
  return a + b; // Simple addition — returns the sum of two numbers
}

// You can export multiple things from a single file.
export function multiply(a: number, b: number): number {
  return a * b; // Simple multiplication
}

// This function has NO 'export' — it is PRIVATE to this file.
// Other files cannot import or use it.
function internalHelper(): void {
  console.log("I'm only accessible inside math.ts");
}
```

```ts
// ═══════════════════════════════════════════════════════════════
// FILE: src/main.ts
// This file imports from the math utility module.
// ═══════════════════════════════════════════════════════════════

// Named import: use curly braces to specify exactly which exports you want.
// The path './utils/math' is relative to the current file.
// TypeScript adds the .ts extension automatically — you don't include it.
import { add, multiply } from './utils/math';

console.log(add(2, 3));       // 5
console.log(multiply(4, 5));  // 20

// internalHelper(); // ❌ Error: 'internalHelper' is not exported from './utils/math'!
```

### Default Exports vs Named Exports

A **default export** is used when a file has ONE primary thing to export — the "main attraction" of that file.

```ts
// ═══════════════════════════════════════════════════════════════
// FILE: src/models/User.ts
// This file has both a named export (interface) and a default export (class).
// ═══════════════════════════════════════════════════════════════

// Named export — use curly braces when importing
export interface User {
  id:    number;
  name:  string;
  email: string;
}

// Default export — only ONE per file allowed.
// The 'default' keyword marks this as the main export.
export default class UserService {
  private users: User[] = []; // Private array of users — internal state

  addUser(user: User): void {
    this.users.push(user); // Add the user to the internal array
  }

  findAll(): User[] {
    return this.users; // Return all stored users
  }

  findById(id: number): User | undefined {
    return this.users.find(u => u.id === id); // Search by id, return user or undefined
  }
}
```

```ts
// ═══════════════════════════════════════════════════════════════
// FILE: src/main.ts — importing from User.ts
// ═══════════════════════════════════════════════════════════════

// Default import: NO curly braces — you can name it anything you want!
import UserService from './models/User';       // Import the default export

// Named import: curly braces required — must match the exported name exactly
import { User }   from './models/User';        // Import the named interface

const service = new UserService();
service.addUser({ id: 1, name: "Alice", email: "alice@example.com" });
console.log(service.findAll()); // [{ id: 1, name: "Alice", email: "..." }]
```

> [!TIP]
> Prefer **named exports** over default exports in most cases. Named exports:
> - Make it immediately obvious what something is called (you can't accidentally rename it on import)
> - Work much better with IDE auto-import features
> - Are easier to search for with "Find All References"
> 
> Reserve default exports for the main class/component of a file (e.g., a React component or Angular service).

### Type-Only Imports — Reducing Bundle Size

TypeScript 3.8 introduced `import type`. This tells the compiler: "I need this symbol for type checking only — please remove it from the compiled JavaScript completely."

**Why does this matter?**  
When you compile TypeScript to JavaScript, all imports remain in the output — even if you only used them for type annotations. With `import type`, the import disappears from the output entirely, resulting in smaller bundles and no unnecessary module loading.

```ts
// ✅ Type-only import — completely removed from compiled JavaScript output.
// This import exists ONLY for TypeScript's type checker.
// At runtime (in JavaScript), this import never runs.
import type { User } from './models/User';

// ✅ Regular import — stays in JavaScript output (needed at runtime because we call 'new').
import UserService from './models/User';

// 'User' is used as a type annotation → fine with 'import type'
function greetUser(user: User): string {
  return `Hello, ${user.name}!`; // 'User' type used for type checking only
}

// 'UserService' is used as a value (we call 'new') → needs a regular import
const service = new UserService(); // Cannot use 'import type' for this!
```

**Common rule of thumb:** If you only use an import in type positions (`: User`, `<User>`, `user: User`), use `import type`. If you use it as a value (call a function, instantiate a class, read a constant), use a regular import.

### Re-Exporting

You can re-export things from one module in another, which is the foundation of "barrel files":

```ts
// Re-export specific named exports from another module
export { add, multiply } from './math';

// Re-export with renaming
export { UserService as default } from './models/User';

// Re-export ALL named exports from a module at once
export * from './validation';

// Re-export types only (no runtime code)
export type { User, Product } from './models';
```

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE 1: Circular imports — File A imports from B, File B imports from A
// This creates a "chicken and egg" dependency cycle that can cause undefined values.
// a.ts: import { something } from './b';
// b.ts: import { something } from './a'; ← Circular!
//
// ✅ FIX: Extract the shared code into a third file (c.ts) that both A and B import from.
// A → C (OK)  and  B → C (OK)  — no cycle!

// ❌ MISTAKE 2: Using CommonJS require() in TypeScript projects
const utils = require('./utils'); // Old Node.js style — avoid in TypeScript!

// ✅ FIX: Always use ES module syntax in TypeScript
import * as utils from './utils';
// OR (with esModuleInterop: true in tsconfig):
import utils from './utils';

// ❌ MISTAKE 3: Forgetting 'type' on type-only imports
import { User } from './User'; // User is an interface — runtime import is wasted!

// ✅ FIX: Use import type for interfaces and type aliases
import type { User } from './User'; // Zero runtime overhead

// ❌ MISTAKE 4: Importing something that isn't exported
// FILE: math.ts has: function internalHelper() { ... } (no 'export')
import { internalHelper } from './math'; // ❌ Error: 'internalHelper' not exported!
```

### Section Recap
- `export` makes a declaration available to other files. `import` brings it in.
- **Named exports** use curly braces: `export function foo()`, `import { foo }`.
- **Default exports** don't use curly braces on import: `export default class X`, `import X`.
- `import type` removes the import from compiled JavaScript — always use it for interfaces and type aliases.
- Prefer named exports for better IDE support and discoverability.

---

## 2. Barrel Files — Clean Import Paths

### The Problem Barrel Files Solve

As a project grows, import paths become longer and more fragile:

```ts
// ❌ Without barrel files — you must know the exact path of every file
import { User }        from '../../models/user/user.model';
import { Product }     from '../../models/product/product.model';
import { Order }       from '../../models/order/order.model';
import { UserService } from '../../services/user/user.service';
import { formatDate }  from '../../utils/date/date-formatter';
```

This has two major problems:
1. **Cognitive load:** You must know the exact file location of every import.
2. **Fragility:** If you move or rename a file, every import path that referenced it breaks.

**The solution:** A **barrel file** is an `index.ts` file in a folder that **re-exports** everything from that folder. It creates a single, clean entry point for the entire folder.

### How Barrel Files Work — Step by Step

**Step 1: Create your individual files with their exports**

```ts
// ═══════════════════════════════════════════════════════════════
// FILE: src/models/user.ts
// ═══════════════════════════════════════════════════════════════
export interface User {
  id:    number;
  name:  string;
  email: string;
}

// A factory function for creating User objects
export class UserFactory {
  static create(name: string, email: string): User {
    return { id: Date.now(), name, email }; // Generate an ID from the current timestamp
  }
}
```

```ts
// ═══════════════════════════════════════════════════════════════
// FILE: src/models/product.ts
// ═══════════════════════════════════════════════════════════════
export interface Product {
  id:    number;
  title: string;
  price: number;
}

export function isInStock(product: Product): boolean {
  return product.price > 0; // Simple placeholder logic
}
```

**Step 2: Create the barrel file (index.ts) in the folder**

```ts
// ═══════════════════════════════════════════════════════════════
// FILE: src/models/index.ts  ← THE BARREL FILE
// This file re-exports EVERYTHING from every model file.
// It creates a single entry point for the 'models' folder.
// ═══════════════════════════════════════════════════════════════

export * from './user';      // Re-export User interface AND UserFactory class
export * from './product';   // Re-export Product interface AND isInStock function

// Add new files here as your project grows:
// export * from './order';
// export * from './category';
```

**Step 3: Import from the folder (not individual files)**

```ts
// ═══════════════════════════════════════════════════════════════
// FILE: src/main.ts
// ═══════════════════════════════════════════════════════════════

// ✅ With barrel — import everything from ONE place!
// TypeScript knows to look for 'index.ts' when you import from a folder path.
import { User, Product, UserFactory, isInStock } from './models';
//                                                    ↑ No specific file needed!

const user    = UserFactory.create("Alice", "alice@example.com");
const product: Product = { id: 1, title: "Laptop", price: 999 };

console.log(user.name);     // "Alice"
console.log(isInStock(product)); // true
```

**Folder structure visual:**

```
BEFORE (no barrel):               AFTER (with barrel):
──────────────────────            ────────────────────────────────────────
src/                              src/
├── models/                       ├── models/
│   ├── user.ts                   │   ├── user.ts       ← individual files
│   └── product.ts                │   ├── product.ts    ← individual files
└── main.ts                       │   └── index.ts      ← barrel file
                                  └── main.ts

Importing:
// Before: need full path            // After: clean folder import
import { User } from                 import { User } from
  '../../models/user';                 '../../models';
```

> [!TIP]
> Barrel files work best when a folder represents a **feature** or **domain** with multiple related exports. Don't create barrel files for folders with only 1–2 files — it adds complexity for no benefit.

---

## 3. Namespaces — The Legacy Approach

### What Are Namespaces?

Before ES modules existed (before 2015), TypeScript invented its own system called **namespaces** (originally called "internal modules") to prevent global name collisions. If you loaded multiple scripts via `<script>` tags, all their functions ended up in the global scope and could conflict.

A namespace wraps related code under a single object name, preventing collisions.

```ts
// The 'namespace' keyword creates a named container for related code.
// Think of it as creating an object literal with its own scope.
namespace Utils {
  // Inside a namespace, use 'export' to make members accessible from outside.
  export function log(msg: string): void {
    console.log(`[LOG] ${msg}`);
  }

  export function warn(msg: string): void {
    console.warn(`[WARN] ${msg}`);
  }

  // This is NOT exported — private to the namespace
  function internalDebug(msg: string): void {
    console.debug(msg);
  }
}

// Access namespace members using dot notation
Utils.log("Server started");  // ✅ "[LOG] Server started"
Utils.warn("Disk almost full"); // ✅ "[WARN] Disk almost full"
// Utils.internalDebug("test"); // ❌ Error: 'internalDebug' is not accessible
```

### Nested Namespaces

```ts
namespace App {
  export namespace Models {
    // A User interface nested inside App.Models
    export interface User {
      id:   number;
      name: string;
    }
  }

  export namespace Services {
    // UserService nested inside App.Services
    export class UserService {
      getUser(id: number): App.Models.User {
        // Must use the full qualified name inside nested namespaces
        return { id, name: "Alice" };
      }
    }
  }
}

// Usage: full qualified names
const service = new App.Services.UserService();
const user    = service.getUser(1);
console.log(user.name); // "Alice"
```

> [!NOTE]
> For **all new projects**, use ES modules (`import`/`export`). Namespaces are a legacy TypeScript feature. You will encounter them in:
> - Older Angular libraries (before v14)
> - Legacy enterprise codebases
> - TypeScript definition files (`*.d.ts`) for some older JavaScript libraries
>
> **Never write new code using namespaces.** ES modules are the standard.

---

## 4. Declaration Files (`.d.ts`) — Typing Untyped JavaScript

### Why Are Declaration Files Needed?

TypeScript needs type information for **every** piece of code you use. But millions of JavaScript libraries were written before TypeScript existed — they have no type information built in.

**Declaration files** (`.d.ts` files) solve this by providing the type information **separately** from the implementation. They tell TypeScript "this JavaScript library has these functions that accept these types and return these types" — without touching the original JavaScript.

**Real-world analogy:** A declaration file is like a **restaurant menu**. The menu doesn't contain food — it tells you what's available, what's in each dish, and how much it costs. The TypeScript declaration file tells you what functions/classes a library has and what types they use, without containing any actual running code.

```
JavaScript library:              Declaration file:
─────────────────────────        ────────────────────────────────────
lodash.js (5000 lines of JS)    @types/lodash/index.d.ts
                                  export function chunk<T>(
                                    array: T[],
                                    size: number
                                  ): T[][];
                                  
                                  export function flatten<T>(
                                    array: T[][]
                                  ): T[];
                                  // (and thousands more type definitions)
```

### DefinitelyTyped — Community-Maintained Types

The TypeScript community maintains type definitions for thousands of popular JavaScript libraries at `github.com/DefinitelyTyped/DefinitelyTyped`. These are published to npm under the `@types/` scope.

```bash
# Install types for the lodash utility library
npm install --save-dev @types/lodash

# Install types for Node.js built-in modules (fs, path, http, etc.)
npm install --save-dev @types/node

# Install types for Express.js web framework
npm install --save-dev @types/express

# Install types for Jest testing framework
npm install --save-dev @types/jest
```

After installation, TypeScript automatically finds them — no extra configuration needed!

```ts
// After 'npm install @types/lodash', TypeScript knows all lodash types!
import _ from 'lodash';

const chunked = _.chunk([1, 2, 3, 4, 5], 2);
// TypeScript knows: chunked is number[][] (array of arrays of numbers)
console.log(chunked); // [[1, 2], [3, 4], [5]]

// TypeScript catches mistakes:
// _.chunk("not an array", 2); // ❌ Error: string is not assignable to T[]
```

### Writing Your Own Declaration File

When a library has no `@types` package, you must write the declaration file yourself. Here's the process step by step:

**Step 1: Identify the JavaScript file you want to type**

```js
// FILE: src/legacy/analytics.js (original JavaScript — you cannot modify this)
// This file has three exported functions with no type information.

function trackEvent(eventName, properties) {
  // In a real library, this would send data to an analytics service
  console.log('Event:', eventName, 'Properties:', properties);
}

function setUserId(id) {
  console.log('Setting user ID to:', id);
}

function pageView(url) {
  console.log('Page view:', url);
}

module.exports = { trackEvent, setUserId, pageView };
```

**Step 2: Create the `.d.ts` file next to the JavaScript file**

```ts
// FILE: src/legacy/analytics.d.ts
// This is the DECLARATION FILE. It has NO implementation code.
// It only DESCRIBES what the JavaScript file exports and their types.

// 'declare module' tells TypeScript: "when someone imports from './analytics',
// here's the type shape of what they get."
declare module './analytics' {
  // Describe each exported function with full type signatures

  // trackEvent: accepts event name (string) and optional properties (object)
  export function trackEvent(
    eventName: string,
    properties?: Record<string, unknown>  // Optional object with any string keys
  ): void;

  // setUserId: accepts a user identifier (string or number)
  export function setUserId(id: string | number): void;

  // pageView: accepts a URL string
  export function pageView(url: string): void;
}
```

**Step 3: TypeScript now understands the JavaScript file**

```ts
// FILE: src/main.ts
// Now we get full type safety when using the legacy JavaScript module!
import { trackEvent, setUserId, pageView } from './legacy/analytics';

setUserId("user-42");                              // ✅ TypeScript: valid string
trackEvent("purchase", { amount: 99.99, item: "Laptop" }); // ✅ Valid
pageView("/products/laptop");                      // ✅ Valid

// TypeScript now catches mistakes:
// setUserId([1, 2, 3]);    // ❌ Error: array is not string | number
// trackEvent(123);         // ❌ Error: number is not string
```

### Declaring Global Variables

Sometimes a library injects global variables via a `<script>` tag. You can teach TypeScript about them:

```ts
// FILE: src/globals.d.ts
// This file tells TypeScript about global variables that exist at runtime
// (injected by build tools, CDN scripts, or server-rendered HTML).

// Global constants injected by the build tool (e.g., Vite/Webpack define plugin)
declare const __APP_VERSION__: string;   // e.g., "2.1.4"
declare const __API_BASE_URL__: string;  // e.g., "https://api.myapp.com"
declare const __BUILD_DATE__: string;    // e.g., "2024-01-15"

// Extend the global 'Window' interface to add properties injected by a CDN script
declare interface Window {
  // A Google Analytics-like analytics library loaded via <script> tag
  myAnalytics: {
    track(event: string, data?: object): void;
    identify(userId: string): void;
  };
  // A chat widget loaded via <script> tag
  Intercom: (command: string, ...args: any[]) => void;
}
```

```ts
// Now TypeScript understands these globals:
console.log(`App version: ${__APP_VERSION__}`);  // ✅ TypeScript knows it's a string
window.myAnalytics.track("login");               // ✅ TypeScript knows this exists
```

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE 1: Using 'any' everywhere in a declaration file
// This defeats the entire purpose of writing the declaration file!
declare module './utils' {
  export function formatDate(value: any): any;  // ❌ What types? Who knows!
}

// ✅ FIX: Be as specific as possible
declare module './utils' {
  export function formatDate(value: Date | string | number, format?: string): string;
}

// ❌ MISTAKE 2: Forgetting the 'export' keyword in declare module
declare module './utils' {
  function formatDate(date: Date): string;  // ❌ Not exported — can't import it!
}

// ✅ FIX: Add 'export'
declare module './utils' {
  export function formatDate(date: Date): string;  // ✅ Now importable
}

// ❌ MISTAKE 3: Putting executable code in a .d.ts file
// declaration files are TYPE-ONLY — they cannot have implementations!
declare module './utils' {
  export function add(a: number, b: number): number {
    return a + b; // ❌ Error: functions in declaration files cannot have bodies!
  }
}
```

---

## 5. Modern TC39 Decorators (TypeScript 5.0+)

### What Is a Decorator? — Starting from Zero

A **decorator** is a special function that you can attach to a class, method, property, or accessor to **modify it, annotate it, or add behaviour around it**. Decorators run when the JavaScript engine first encounters the class definition — not when you call a method or create an instance.

**Real-world analogy:** Think of decorators like **labels you stick on items**:
- A `@Fragile` sticker on a shipping box doesn't change what's inside — it adds handling instructions.
- A `@Manager` badge on an employee doesn't change who they are — it grants them additional access.

Similarly, a `@LogMethod` decorator on a function doesn't change what the function does — it wraps it with logging behaviour around every call.

```
Without decorator:                    With @LogMethod decorator:
────────────────────────              ─────────────────────────────────────────
function add(a, b) {                  Before: "Calling add with [3, 7]"
  return a + b;                         → original function runs →
}                                     After: "add returned: 10"
```

**The big news about TC39 Decorators:**  
In TypeScript 5.0, the language adopted the official **ECMAScript (TC39) standard** for decorators. This matters because:
- They are now **standard JavaScript** — not a TypeScript experiment.
- You **no longer need** `"experimentalDecorators": true` in `tsconfig.json`.
- All modern frameworks (Angular 17+, NestJS) use these standard decorators.
- The old "experimental" decorators have **different syntax** — they are incompatible.

> [!WARNING]
> If your `tsconfig.json` has `"experimentalDecorators": true`, you are using the **old, legacy** decorator system. Remove that flag to use modern TC39 decorators. The two systems have different function signatures and are NOT compatible with each other.

### How the TC39 Decorator Context Works

Every TC39 decorator receives two arguments:
1. The **value** being decorated (the class constructor, method function, etc.)
2. A **context object** with metadata about what's being decorated

```ts
// A decorator is just a function that receives these two arguments:
function ExampleDecorator(
  value: any,               // The thing being decorated (class, method, etc.)
  context: DecoratorContext // Rich metadata object
) {
  console.log("Kind:", context.kind); // 'class' | 'method' | 'field' | 'accessor'
  console.log("Name:", context.name); // The name of the decorated item
  // Return a replacement for 'value', or return nothing to keep the original
}
```

### Class Decorators — Modifying or Annotating the Class

A **class decorator** is applied to the class constructor. It can:
- Replace the class with a new (modified) version
- Add metadata to the class
- Enforce patterns like Singleton

```ts
// ═══════════════════════════════════════════════════════════════
// Example 1: A simple @LogClass decorator
// Runs when the class is DEFINED (not when instances are created)
// ═══════════════════════════════════════════════════════════════

function LogClass(
  value:   any,                   // The class constructor
  context: ClassDecoratorContext  // Metadata — context.name is the class name
): void {
  // This runs immediately when JavaScript loads the file
  console.log(`📦 Class "${String(context.name)}" has been registered!`);
}

// Apply the decorator using the '@' syntax, placed immediately above the class
@LogClass
class UserRepository {
  private users: any[] = [];

  constructor() {
    console.log("UserRepository instance created");
  }
}

// When the file loads, the output is:
// 📦 Class "UserRepository" has been registered!
// (Then, when you do 'new UserRepository()':)
// UserRepository instance created
```

```ts
// ═══════════════════════════════════════════════════════════════
// Example 2: A @Singleton decorator
// Ensures only ONE instance of the class ever exists.
// ═══════════════════════════════════════════════════════════════

function Singleton(
  value:   abstract new (...args: any[]) => any, // The class constructor type
  context: ClassDecoratorContext
) {
  let instance: any = null; // Closure variable — persists between calls

  // Return a new class that wraps the original.
  // 'extends (value as any)' means the new class inherits everything.
  return class extends (value as any) {
    constructor(...args: any[]) {
      if (instance) {
        return instance; // Already exists? Return the same instance!
      }
      super(...args);    // First time? Call the real constructor.
      instance = this;   // Save this as the only instance.
    }
  };
}

@Singleton
class AppConfig {
  constructor(public apiUrl: string) {
    console.log(`Config created: ${apiUrl}`);
  }
}

const config1 = new AppConfig("https://api.example.com"); // "Config created: ..."
const config2 = new AppConfig("https://other.api.com");   // NO output — returns existing!

console.log(config1 === config2); // true — same object!
console.log(config2.apiUrl);      // "https://api.example.com" — first instance wins
```

### Method Decorators — Wrapping Methods with Logic

A **method decorator** wraps a method with additional behaviour. This is the most commonly used decorator type in practice.

**Use cases:** Logging, performance measurement, caching, rate limiting, retry logic, access control.

```ts
// ═══════════════════════════════════════════════════════════════
// @LogMethod decorator — logs what arguments a method receives
// and what value it returns.
// ═══════════════════════════════════════════════════════════════
function LogMethod(
  originalMethod: (...args: any[]) => any, // The original method function
  context: ClassMethodDecoratorContext      // Has context.name (the method name)
): (...args: any[]) => any {

  // Return a NEW function that REPLACES the original method.
  // This wrapper is called every time the method is called.
  return function (this: any, ...args: any[]) {
    const methodName = String(context.name);

    // Log BEFORE calling the original method
    console.log(`▶️  ${methodName}() called with:`, args);

    // Actually call the original method with the same 'this' context and arguments
    const result = originalMethod.apply(this, args);

    // Log AFTER the original method returns
    console.log(`✅  ${methodName}() returned:`, result);

    // Must return the result so the caller gets it!
    return result;
  };
}

// ═══════════════════════════════════════════════════════════════
// @Timing decorator — measures how long a method takes to run
// ═══════════════════════════════════════════════════════════════
function Timing(
  originalMethod: (...args: any[]) => any,
  context: ClassMethodDecoratorContext
): (...args: any[]) => any {

  return function (this: any, ...args: any[]) {
    const label = `⏱️  ${String(context.name)}`;
    console.time(label);                              // Start the timer
    const result = originalMethod.apply(this, args);  // Run the original
    console.timeEnd(label);                           // Stop timer and log duration
    return result;
  };
}

// ═══════════════════════════════════════════════════════════════
// Apply multiple decorators to a class.
// Decorators stack — bottom decorator runs first (innermost wrapper).
// ═══════════════════════════════════════════════════════════════
class Calculator {
  // Multiple decorators on one method:
  // Execution order: @Timing runs first (innermost), @LogMethod runs second (outermost)
  @LogMethod
  @Timing
  add(a: number, b: number): number {
    return a + b; // The original method logic
  }

  @LogMethod
  multiply(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(3, 7);
// Console output (in order):
// ▶️  add() called with: [3, 7]
// ⏱️  add: 0.05ms
// ✅  add() returned: 10
```

### Field (Property) Decorators — Transforming Initial Values

A **field decorator** intercepts how a class field's initial value is set. It receives `undefined` as the `value` argument (since there's no "method" to replace), and returns an **initializer function** that processes the initial value.

```ts
// ═══════════════════════════════════════════════════════════════
// @Uppercase decorator — converts the initial value of a string field to uppercase
// ═══════════════════════════════════════════════════════════════
function Uppercase(
  value:   undefined,                // Field decorators always receive 'undefined'!
  context: ClassFieldDecoratorContext // Has context.name (the field name)
) {
  // Return an "initializer" function — it runs when the field is first set.
  // 'initialValue' is the value written in the class definition (e.g., "electronics")
  return function (this: any, initialValue: any) {
    if (typeof initialValue === "string") {
      console.log(`🔤 Field "${String(context.name)}" → uppercased`);
      return initialValue.toUpperCase(); // Transform and return the new initial value
    }
    return initialValue; // Non-string? Return unchanged.
  };
}

class Product {
  @Uppercase
  category: string = "electronics"; // Initial value is "electronics"
  // After @Uppercase runs, category will be "ELECTRONICS"

  constructor(public name: string, public price: number) {}
}

const p = new Product("Laptop", 999);
console.log(p.category); // "ELECTRONICS" — transformed by the decorator!
```

### Accessor Decorators — Intercept Get & Set

When you combine the `accessor` keyword (from Lecture 20) with a decorator, the decorator can **intercept both reading and writing** the property. This is the most powerful field decorator type.

**Use case:** Validation — ensure a value stays within valid bounds when written.

```ts
// ═══════════════════════════════════════════════════════════════
// @Range decorator — a "decorator factory" that creates a decorator.
// A decorator factory is a function that RETURNS a decorator function.
// This pattern allows passing arguments to the decorator: @Range(0, 100)
// ═══════════════════════════════════════════════════════════════
function Range(min: number, max: number) {
  // The outer function receives min and max as config.
  // It returns the actual decorator function.
  return function (
    value:   ClassAccessorDecoratorTarget<any, number>, // The auto-generated get/set pair
    context: ClassAccessorDecoratorContext              // Metadata
  ): ClassAccessorDecoratorResult<any, number> {

    return {
      // Wrap the getter — just return the value unchanged
      get(this: any): number {
        return value.get.call(this); // Delegate to the original getter
      },
      // Wrap the setter — VALIDATE before accepting the new value
      set(this: any, newValue: number): void {
        if (newValue < min || newValue > max) {
          // Throw a descriptive error if the value is out of range
          throw new RangeError(
            `"${String(context.name)}" must be between ${min} and ${max}. Got: ${newValue}`
          );
        }
        value.set.call(this, newValue); // Value is valid — pass it to the original setter
      }
    };
  };
}

class Temperature {
  // @Range(-273, 1000) — valid range is absolute zero to 1000°C
  // 'accessor' generates the backing field + getter + setter
  @Range(-273, 1000)
  accessor celsius: number = 20; // Initial value: 20°C
}

const temp = new Temperature();
temp.celsius = 100;              // ✅ Valid — between -273 and 1000
console.log(temp.celsius);       // 100

try {
  temp.celsius = -999;           // ❌ Below absolute zero!
} catch (e) {
  if (e instanceof RangeError) {
    console.error(e.message);   // '"celsius" must be between -273 and 1000. Got: -999'
  }
}
```

### Visual: Decorator Execution Order

When multiple decorators are stacked on the same element, they apply **bottom-to-top**:

```
@DecoratorA       ← Applied LAST (outermost wrapper — first to intercept incoming calls)
@DecoratorB       ← Applied SECOND
@DecoratorC       ← Applied FIRST (innermost wrapper — closest to the original method)
method() { ... }  ← The original method

Call execution flow:
  DecoratorA intercepts call
    → DecoratorB intercepts call
        → DecoratorC intercepts call
            → Original method runs
        ← DecoratorC post-processing
    ← DecoratorB post-processing
  ← DecoratorA post-processing
```

For class decorators, multiple decorators run **top-to-bottom** at class definition time.

### Common Mistakes & How to Avoid Them

```ts
// ❌ MISTAKE 1: Using legacy 'experimentalDecorators' format with TC39 decorators
// Old decorator function signatures look different from TC39.
// Legacy:  function MyDec(target: any, key: string, descriptor: PropertyDescriptor)
// TC39:    function MyDec(value: Function, context: ClassMethodDecoratorContext)
// They are NOT interchangeable! Mixing them causes confusing runtime errors.
//
// ✅ FIX: Remove "experimentalDecorators": true from tsconfig.json.
// If you see that flag, you're in legacy mode!

// ❌ MISTAKE 2: Trying to use field decorators to access the value directly
function BadFieldDecorator(value: any, context: any) {
  console.log(value); // ❌ 'value' is always undefined for field decorators!
  value.doSomething(); // ❌ Will crash — undefined has no methods!
}

// ✅ FIX: Return an initializer function — that's how you process field values
function GoodFieldDecorator(value: undefined, context: ClassFieldDecoratorContext) {
  return function (this: any, initialValue: any) {
    // 'initialValue' is the actual value — do your processing here
    return initialValue;
  };
}

// ❌ MISTAKE 3: Forgetting to return the result in a method decorator
function BadMethodDecorator(originalMethod: Function, context: any) {
  return function (this: any, ...args: any[]) {
    console.log("Before");
    originalMethod.apply(this, args); // Runs the method BUT...
    // ❌ No 'return'! The caller always gets 'undefined' back!
  };
}

// ✅ FIX: Always return the result
function GoodMethodDecorator(originalMethod: Function, context: any) {
  return function (this: any, ...args: any[]) {
    console.log("Before");
    const result = originalMethod.apply(this, args); // Capture result
    return result; // ✅ Return it!
  };
}
```

### Section Recap
- **TC39 Decorators** (TS 5.0+) are standard JavaScript — no `experimentalDecorators` flag needed.
- A decorator is a **function** that receives the decorated value and a context object.
- **Class decorators** can replace or annotate the entire class constructor.
- **Method decorators** wrap methods — return a new function to replace the original.
- **Field decorators** receive `undefined` as value — return an initializer function to transform the initial value.
- **Accessor decorators** wrap both getter and setter of `accessor` fields.
- Stacked decorators apply **bottom-to-top**.

---

## 6. Path Mapping — Clean Import Paths

### The Problem: Relative Path Hell

As a project grows, imports from deeply nested files become long and unreadable:

```ts
// ❌ Real code from a medium-sized Angular application
import { UserService }       from '../../../services/user/user.service';
import { AuthGuard }         from '../../../guards/auth/auth.guard';
import { ValidationUtils }   from '../../../../shared/utils/validation.utils';
import { ButtonComponent }   from '../../../../shared/components/button/button.component';
import { UserModel }         from '../../../models/user.model';
```

Problems with relative paths:
1. **Hard to read** — you must count `../` to understand where files are.
2. **Hard to refactor** — move ONE file and every import that referenced it breaks.
3. **Hard to write** — you must know the exact depth to get the right number of `../`.

### The Solution: `tsconfig.json` Path Mapping

TypeScript allows you to define **path aliases** — shortcuts that map a short, memorable name to a real file path.

**Step 1: Configure `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",

    // 'baseUrl' is the root that all path aliases are relative to
    "baseUrl": "./src",

    // 'paths' defines the aliases
    "paths": {
      "@models/*":     ["models/*"],          // @models/user → src/models/user
      "@services/*":   ["services/*"],        // @services/user → src/services/user
      "@guards/*":     ["guards/*"],          // @guards/auth → src/guards/auth
      "@utils/*":      ["shared/utils/*"],    // @utils/date → src/shared/utils/date
      "@components/*": ["shared/components/*"] // @components/button → ...
    }
  }
}
```

**How it works:**
- `"baseUrl": "./src"` — all path aliases are resolved relative to the `src/` folder.
- `"@models/*"` — this is the **alias** (starts with `@` by convention, though any prefix works).
- `["models/*"]` — the **real path** it maps to (relative to `baseUrl`).
- The `*` is a wildcard that captures the rest of the path.

**Step 2: Use the aliases in your code**

```ts
// ✅ AFTER path mapping — clean, readable, refactor-safe imports
import { UserService }       from '@services/user/user.service';
import { AuthGuard }         from '@guards/auth/auth.guard';
import { ValidationUtils }   from '@utils/validation.utils';
import { ButtonComponent }   from '@components/button/button.component';
import { UserModel }         from '@models/user.model';
```

### Bundler Configuration Required

> [!WARNING]
> TypeScript path mapping is a **compile-time only** feature. TypeScript understands the aliases and resolves types correctly, but the compiled JavaScript output still contains the alias strings (e.g., `@services/...`). Your bundler or runtime must also be configured to resolve them.

**For Vite projects (`vite.config.ts`):**

```ts
import { defineConfig } from 'vite';
import path from 'path'; // Node.js 'path' module for resolving absolute paths

export default defineConfig({
  resolve: {
    alias: {
      // The left side matches the alias, the right side is the real absolute path.
      '@models':     path.resolve(__dirname, './src/models'),
      '@services':   path.resolve(__dirname, './src/services'),
      '@guards':     path.resolve(__dirname, './src/guards'),
      '@utils':      path.resolve(__dirname, './src/shared/utils'),
      '@components': path.resolve(__dirname, './src/shared/components'),
    }
  }
});
```

**For Node.js projects (without a bundler):**

```bash
# Install the tsconfig-paths package
npm install -D tsconfig-paths

# Run TypeScript directly with path resolution
npx ts-node -r tsconfig-paths/register src/main.ts
```

### Section Recap
- Path aliases (`@models/`, `@services/`) replace ugly relative paths with clean, readable shortcuts.
- Configure aliases in `tsconfig.json` under `compilerOptions.paths` + `baseUrl`.
- You **must also configure your bundler** (Vite/Webpack) — TypeScript alone doesn't make the aliases work at runtime.
- Use `@` as the prefix convention for aliases to distinguish them from npm package names.

---

## 🧪 Practice Labs

### Lab 1: Barrel Files & Path Mapping (40 min)

1. Create a folder structure:
   ```
   src/
   ├── models/
   │   ├── user.ts    (exports User interface + UserFactory class)
   │   ├── product.ts (exports Product interface)
   │   └── index.ts   (barrel file — re-exports both)
   └── main.ts
   ```
2. Add `"paths": { "@models/*": ["models/*"] }` to your `tsconfig.json`.
3. Import from `@models` in `main.ts` instead of relative paths.
4. Verify TypeScript picks up the correct types.

### Lab 2: Writing Declaration Files (30 min)

1. Create `src/legacy/currency.js` with:
   ```js
   function formatCurrency(amount, symbol) { return symbol + amount.toFixed(2); }
   module.exports = { formatCurrency };
   ```
2. Write `src/legacy/currency.d.ts` that declares the type signature of `formatCurrency`.
3. Import and use `formatCurrency` in `main.ts` — verify TypeScript catches wrong argument types.

### Lab 3: Method Decorator (30 min)

1. Build a `@Memoize` decorator that caches the results of a function call.
2. The first time the function is called with certain arguments, compute the result.
3. The second time the SAME arguments are passed, return the cached result.
4. Test with an expensive-looking function: `fibonacci(n)`.

---

## 📝 Assignment: DataForge Project — Part 3

Add validation decorators to your DataForge project.

### Requirements
1. Create a `decorators` folder in your DataForge project.
2. Write a `@LogMethod` decorator that logs the method name, arguments, and return value for every call.
3. Write a `@Validate` class decorator that checks all `string` properties are non-empty before methods run.
4. Apply `@LogMethod` to the `add()` and `update()` methods of your `Repository` class from Part 2.
5. Verify that the log output appears in the console when you call `add()` or `update()`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| TypeScript Handbook — Modules | https://www.typescriptlang.org/docs/handbook/2/modules.html |
| TypeScript Handbook — Declaration Files | https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html |
| TC39 Decorators Proposal | https://github.com/tc39/proposal-decorators |
| TypeScript 5.0 — TC39 Decorators | https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html |
| DefinitelyTyped | https://github.com/DefinitelyTyped/DefinitelyTyped |

---

## 📌 Key Takeaways

- **ES Modules** (`import`/`export`) are the standard for organising TypeScript code — one responsibility per file.
- Use `import type` for interfaces and type aliases — they are erased from the compiled JavaScript.
- **Barrel files** (`index.ts`) create clean folder-level APIs by re-exporting from a single entry point.
- **Namespaces** are a legacy TypeScript feature — use them only when reading/maintaining old code.
- **Declaration files** (`.d.ts`) provide type information for JavaScript libraries without modifying them.
- **TC39 Decorators** (TS 5.0+) are the standard — no `"experimentalDecorators"` flag needed.
- Decorators stack **bottom-to-top** — the bottom decorator is the innermost wrapper.
- **Path mapping** (`@models/`, `@services/`) in `tsconfig.json` eliminates fragile relative paths — but you must also configure your bundler.

---

**Next Lecture:** [Lecture 22 — TypeScript with Modern Tooling & Testing](./22%20-%20TypeScript%20with%20Modern%20Tooling%20&%20Testing.md)
