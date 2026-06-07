# Lecture 22 — TypeScript: Modules, Namespaces & TC39 Decorators

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🚦 Prerequisites

Before diving into this lecture, you should be comfortable with:
1. **JavaScript ES6 Modules:** Understanding basic `import` and `export` syntax in standard JavaScript environments.
2. **TypeScript Fundamentals:** Familiarity with static typing, interfaces, and the basic compilation step (`tsc`).
3. **Object-Oriented Programming (OOP) in TypeScript:** Solid knowledge of classes, methods, properties, inheritance, and access modifiers (`public`, `private`).
4. **Tooling Basics:** Knowing how to configure a fundamental `tsconfig.json` file for project setups.

---

## 🎯 Objectives & Agenda

### Learning Objectives
By the end of this comprehensive lecture, you will be able to:
- **Organise code effectively** using ES modules, separating concerns across distinct files cleanly.
- **Optimise bundle sizes** using type-only imports and type-only exports.
- **Implement barrel files** to create clean, aggregated module entry points that hide folder complexity.
- **Understand the history and legacy usage** of TypeScript Namespaces and when to avoid them.
- **Bridge TypeScript with untyped JavaScript** by writing custom declaration files (`.d.ts`) and leveraging the DefinitelyTyped (`@types`) ecosystem.
- **Master Metaprogramming** by applying modern ECMAScript (TC39) Class, Method, Field, and Accessor decorators.
- **Eliminate relative path hell** through intelligent `tsconfig.json` path mapping aliases.

### 📋 Agenda
1. **Deep Dive into ES Modules:** `import`/`export`, default vs named exports, type-only imports, and structuring logic.
2. **Barrel Files:** Aggregating folder exports for clean architectural APIs.
3. **Namespaces:** Understanding the legacy internal module system.
4. **Declaration Files (`.d.ts`):** Providing static types to untyped third-party libraries and global variables.
5. **Modern TC39 Decorators (TS 5.0+):** Metaprogramming patterns across classes, methods, fields, and accessors.
6. **Path Mapping:** Configuring clean, absolute-like imports via `paths` and `baseUrl`.
7. **Think Like a Developer:** Real-world architectural decision-making scenarios.
8. **Before vs After:** Comparing legacy or poorly structured code with modern, clean code patterns.
9. **Common Mistakes & How to Avoid Them:** A structured troubleshooting guide for modules and decorators.
10. **Practice Labs, Assignment & Interview Prep:** Hands-on challenges and career readiness to solidify your knowledge.

---

## 1. Deep Dive into ES Modules

### The 'Why': The Problem First

Imagine attempting to write a modern, complex web application within a single file. That file would quickly balloon to tens of thousands of lines of code. The consequences of this approach are dire:
- **No clear boundaries:** Unrelated features (like User authentication, Product catalogs, and Database connections) are hopelessly mixed together.
- **Catastrophic Name Collisions:** Two separate features might accidentally define a helper function called `formatDate()`, breaking the application.
- **Merge Conflicts:** A team of developers working on the exact same file will constantly overwrite each other's changes in version control.
- **Zero Reusability:** You cannot easily extract a piece of logic to share across different projects without brute-force copy-pasting.

**Modules** solve these architectural nightmares by letting you split your code into small, focused, and completely isolated files. Each file **exports** only the public API it explicitly wants to share, and **imports** only what it strictly needs from other files.

### Named Exports & Imports

A **named export** explicitly makes a declaration (like a function, class, interface, or constant) available to other files. A single file can contain multiple named exports.

```typescript
// ═══════════════════════════════════════════════════════════════
// FILE: src/utils/math.ts
// ═══════════════════════════════════════════════════════════════

// The 'export' keyword makes this function accessible from the outside.
export function add(a: number, b: number): number {
  return a + b; 
}

// Multiple named exports are perfectly valid and common.
export function multiply(a: number, b: number): number {
  return a * b;
}

// NO 'export' keyword here. 
// This function is strictly PRIVATE to the math.ts file.
// It is physically impossible to import this elsewhere.
function internalHelper(): void {
  console.log("I am isolated inside math.ts");
}
```

Importing these requires you to use the exact names defined in the export, wrapped in curly braces.

```typescript
// ═══════════════════════════════════════════════════════════════
// FILE: src/main.ts
// ═══════════════════════════════════════════════════════════════

// Named import: Curly braces require an exact matching of names.
import { add, multiply } from './utils/math';

console.log(add(10, 5));      // Output: 15
console.log(multiply(10, 5)); // Output: 50

// internalHelper(); // ❌ Compiler Error: 'internalHelper' is not exported.
```

### Default Exports vs Named Exports

A **default export** is designated when a file has exactly ONE primary entity to export. It represents the singular "main attraction" of the module.

```typescript
// ═══════════════════════════════════════════════════════════════
// FILE: src/services/UserService.ts
// ═══════════════════════════════════════════════════════════════

export interface User {
  id: number;
  name: string;
}

// Default export — only ONE per file is permitted by the compiler.
export default class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }
}
```

When importing a default export, you omit the curly braces. Because it is the default, you are free to name it whatever you like upon importing:

```typescript
// ═══════════════════════════════════════════════════════════════
// FILE: src/app.ts
// ═══════════════════════════════════════════════════════════════

// Default import: NO curly braces. We can invent the name here.
import CustomUserServiceName from './services/UserService';

// Named import: Curly braces required to match the exact interface name.
import { User } from './services/UserService';

const service = new CustomUserServiceName();
service.addUser({ id: 1, name: "Alice" });
```

> [!TIP]
> **Best Practice for Scalability:** Prefer **named exports** over default exports. Named exports enforce consistent naming across the codebase, prevent import mismatch errors between developers, and provide significantly superior IDE refactoring and auto-import support. Reserve default exports exclusively for files representing a single visual component (e.g., a React page).

### Type-Only Imports — Optimising Bundle Size

TypeScript 3.8 introduced the excellent `import type` syntax. It explicitly tells the TypeScript compiler: *"I am importing this symbol exclusively for static type checking purposes. I guarantee I will not use it as an executable value. Please remove it entirely from the compiled JavaScript output."*

**Why is this architectural feature critical?**  
When TypeScript compiles code down to JavaScript, standard imports remain in the emitted output to be resolved dynamically at runtime by Node or the browser. If you only use an imported class or interface to annotate a function parameter, the JavaScript runtime engine has absolutely no use for it. Using `import type` guarantees zero runtime overhead and prevents accidentally loading massive files just for a type signature.

```typescript
// ✅ Type-only import: Erased entirely from the compiled JavaScript bundle.
import type { User } from './models/User';

// ✅ Regular import: Persists in the JavaScript bundle (needed for instantiation).
import UserService from './services/UserService';

// 'User' is used only in a type position. 'import type' is perfect here.
function printUser(user: User): void {
  console.log(user.name);
}

// 'UserService' is used as a runtime value (we call 'new' on it). 
// 'import type' would cause a crash here.
const service = new UserService();
```

---

## 2. Barrel Files — Clean Architecture

### The Problem: Fragmented and Deep Imports

As a modular project scales, the sheer number of imported files becomes overwhelming. Importing related files individually becomes tedious and creates massive, unreadable blocks of import statements at the very top of your files.

```typescript
// ❌ Without a barrel file - fragile and verbose
import { User } from '../../models/user';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { Invoice } from '../../models/invoice';
import { Receipt } from '../../models/receipt';
```

### The Solution: Aggregating Exports via Barrels

A **barrel file** is essentially an `index.ts` file deliberately placed inside a directory. Its primary and sole responsibility is to re-export the contents of the various internal files within that directory. It serves as a unified "public API" for that folder, abstracting away the internal file structure from consumers.

**Step 1: Create the individual modules**
```typescript
// src/models/user.ts
export interface User { id: string; name: string; }

// src/models/product.ts
export interface Product { id: string; price: number; }
```

**Step 2: Create the Barrel File**
```typescript
// src/models/index.ts (The Barrel File)
// Re-exporting everything from sibling files
export * from './user';
export * from './product';
export * from './order';
export * from './invoice';
```

**Step 3: Import cleanly from the directory**
```typescript
// src/main.ts
// ✅ TypeScript automatically resolves to the index.ts file when pointing to a folder!
import { User, Product, Order, Invoice } from './models';
```

> [!WARNING]
> **Use Barrels Strategically:** Avoid creating barrel files for shallow directories (1-2 files) to prevent unnecessary indirection. Also, avoid circular dependency loops: files inside the barrel's folder must import from siblings using direct relative paths (`./user`), not via the barrel itself.

---

## 3. Namespaces: The Legacy System

### What Are Namespaces?

Before ES6 modules (2015), TypeScript invented **namespaces** (internal modules) to solve global scope pollution in browser environments where sequentially loaded scripts frequently overwrote each other's variables.

A namespace essentially wraps related code into a single, globally accessible JavaScript object, simulating module encapsulation.

```typescript
namespace ValidationLogic {
  // This constant is deeply hidden inside the namespace closure.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // You must explicitly export to make it accessible outside the namespace.
  export function isEmailValid(email: string): boolean {
    return emailRegex.test(email);
  }
}

// Access the exported function via object dot notation
const isValid = ValidationLogic.isEmailValid("test@example.com");
```

### Nested Namespaces

Namespaces can be deeply nested, mimicking folder structures entirely within a single file.

```typescript
namespace App {
  export namespace Models {
    export interface Customer { id: number; }
  }
}

const customer: App.Models.Customer = { id: 1 };
```

> [!CAUTION]
> **Legacy Notice:** Namespaces are overwhelmingly considered outdated for modern application development. Modern bundler tools (Webpack, Vite, Rollup) rely entirely on standard ES Modules (`import`/`export`) for tree-shaking and dead-code elimination. You must understand namespaces because you will frequently encounter them in older enterprise codebases and inside complex declaration files, but you should **never** write new application logic using namespaces.

---

## 4. Declaration Files (`.d.ts`)

### The 'Why': Bridging Typed and Untyped Worlds

TypeScript strictly requires explicit type information to guarantee safety and provide autocomplete. However, the JavaScript ecosystem contains millions of legacy libraries written in plain Vanilla JavaScript, entirely lacking any static types.

**Declaration files (`.d.ts`)** definitively solve this dilemma. They provide a separate, side-car file containing *only* type definitions, without altering the underlying JavaScript implementation whatsoever. 

**Analogy:** A `.d.ts` file is exactly like a **restaurant menu**. The menu itself doesn't contain the actual food (the executable runtime logic); it merely describes in great detail what is available to order (the function signatures, properties, and parameter types) so you don't order something that doesn't exist.

### DefinitelyTyped (`@types`)

For popular libraries (Lodash, Express, Jest, React), the community maintains high-quality declaration files in the DefinitelyTyped GitHub repository, published under `@types` on NPM.

```bash
# Install the vanilla JS library
npm install lodash

# Install the community-maintained TypeScript definitions
npm install --save-dev @types/lodash
```
Once installed, the TypeScript compiler instantly and automatically recognizes the types when you import the library. No additional configuration is needed.

### Writing Custom Declaration Files

When you use an obscure, proprietary, or internal JavaScript library that has no `@types` package, you must step up and write your own declaration file.

**The Original Vanilla JavaScript (`math-utils.js`):**
```javascript
// This is pure JS. No types exist here.
function calculateDiscount(price, discountPercentage) {
  return price - (price * (discountPercentage / 100));
}
module.exports = { calculateDiscount };
```

**The Custom Ambient Declaration (`math-utils.d.ts`):**
```typescript
// We declare the module shape. 
// Absolutely NO implementation body is allowed here!
declare module './math-utils' {
  export function calculateDiscount(price: number, discountPercentage: number): number;
}
```

Now, importing from `./math-utils` in your standard `.ts` files will yield full compiler type safety, preventing you from accidentally passing strings into a math function.

### Typing Global Variables

Sometimes, old-school libraries or modern build tools inject variables directly onto the `window` object or the global scope via `<script>` tags or Webpack DefinePlugin. You can declare these globally so TypeScript stops complaining.

```typescript
// FILE: global.d.ts (placed at the root of the project)

// Declare a constant injected by Webpack during the build process
declare const __API_BASE_URL__: string;

// Extend the existing global Window interface
declare interface Window {
  GoogleAnalytics: {
    trackEvent(eventName: string): void;
  };
}

// Usage in app.ts is now completely error-free
console.log(__API_BASE_URL__);
window.GoogleAnalytics.trackEvent("User Login Completed");
```

---

## 5. Modern TC39 Decorators (TS 5.0+)

### The 'Why': Elegant Metaprogramming

A **decorator** is a specialized function attached to a class, method, field, or accessor. It modifies or intercepts behavior declaratively, cleanly handling cross-cutting concerns (logging, validation, caching) without polluting business logic.

> [!IMPORTANT]
> **Major Architectural Shift:** TypeScript 5.0 introduced full, native support for the official **ECMAScript (TC39) Decorators standard**. Older versions of TypeScript relied heavily on a legacy, experimental implementation that required `"experimentalDecorators": true` in `tsconfig.json`. The new standard is vastly superior but is mathematically incompatible with the old one. **Ensure your modern projects remove the experimental flag entirely.**

### Understanding Decorator Context

TC39 decorators receive two parameters:
1. The `value` being decorated (function or class).
2. A `context` object containing metadata (like `context.kind` and `context.name`).

### 1. Class Decorators

A class decorator runs exactly once when the class is first defined by the JavaScript engine. It can completely replace the constructor or silently add hidden metadata.

```typescript
// ═══════════════════════════════════════════════════════════════
// Class Decorator Example: Singleton Pattern
// ═══════════════════════════════════════════════════════════════

function Singleton<T extends abstract new (...args: any) => any>(
  value: T,
  context: ClassDecoratorContext
) {
  let instance: any = null;

  // We return an entirely new class that extends the original constructor
  return class extends value {
    constructor(...args: any[]) {
      if (instance) {
        return instance; // Return the deeply cached instance
      }
      super(...args);
      instance = this;   // Save the new instance for future calls
    }
  };
}

@Singleton
class DatabaseConnection {
  constructor(public id: string = Math.random().toString()) {
    console.log("Database Connection Established.");
  }
}

const db1 = new DatabaseConnection(); // Logs: "Database Connection Established."
const db2 = new DatabaseConnection(); // Logs nothing!
console.log(db1 === db2); // Output: true! Both variables share the exact same instance.
```

### 2. Method Decorators

Method decorators wrap an existing method, allowing you to intercept calls before they reach the original function, alter the arguments, or manipulate the return value.

```typescript
// ═══════════════════════════════════════════════════════════════
// Method Decorator Example: Execution Timer
// ═══════════════════════════════════════════════════════════════

function MeasureExecution(
  originalMethod: Function,
  context: ClassMethodDecoratorContext
) {
  const methodName = String(context.name);

  // We return a brand new wrapper function that replaces the original method
  return function (this: any, ...args: any[]) {
    const start = performance.now();
    
    // Execute the original method securely
    const result = originalMethod.apply(this, args);
    
    const end = performance.now();
    console.log(`⏱️ [${methodName}] executed seamlessly in ${(end - start).toFixed(4)}ms`);
    
    return result; // Critical: You MUST return the result to the original caller!
  };
}

class ReportGenerator {
  @MeasureExecution
  generate(rows: number): string {
    let sum = 0;
    for (let i = 0; i < rows; i++) sum += i; // Simulate a heavy computation task
    return `Financial report successfully generated for ${rows} rows.`;
  }
}

const report = new ReportGenerator();
report.generate(5000000); // Logs: ⏱️ [generate] executed seamlessly in X.XXXXms
```

### 3. Field Decorators

Field decorators manage the initial assignment of a class property. They receive `undefined` as the `value` and must return an **initializer function**.

```typescript
// ═══════════════════════════════════════════════════════════════
// Field Decorator Example: Force Uppercase
// ═══════════════════════════════════════════════════════════════

function ForceUppercase(
  value: undefined, 
  context: ClassFieldDecoratorContext
) {
  // Return the initializer function that processes the initial assignment value
  return function (initialValue: any) {
    if (typeof initialValue === "string") {
      return initialValue.toUpperCase();
    }
    return initialValue;
  };
}

class ProductRecord {
  @ForceUppercase
  sku: string = "lap-5001-blk"; // This will instantly be converted to uppercase
}

const p = new ProductRecord();
console.log(p.sku); // Output: "LAP-5001-BLK"
```

### 4. Accessor Decorators (Auto-Accessors)

When utilizing the modern `accessor` keyword on a property, TypeScript automatically generates a hidden private backing field along with a getter and setter. Accessor decorators are tremendously powerful because they can intercept both the read (get) and the write (set) operations continuously throughout the object's lifecycle.

```typescript
// ═══════════════════════════════════════════════════════════════
// Accessor Decorator Example: Number Range Validation
// ═══════════════════════════════════════════════════════════════

// This structure is a "Decorator Factory" — a function that RETURNS the actual decorator.
// It allows us to pass custom configuration arguments like min and max.
function MinMax(min: number, max: number) {
  return function (
    value: ClassAccessorDecoratorTarget<any, number>,
    context: ClassAccessorDecoratorContext
  ): ClassAccessorDecoratorResult<any, number> {
    
    return {
      get(this: any) {
        return value.get.call(this);
      },
      set(this: any, newValue: number) {
        // Intercept the assignment. If it's invalid, throw a fatal error.
        if (newValue < min || newValue > max) {
          throw new RangeError(`Critical Error: Value must remain between ${min} and ${max}`);
        }
        // If valid, proceed with the original setter assignment
        value.set.call(this, newValue);
      }
    };
  };
}

class Thermostat {
  @MinMax(10, 30)
  accessor temperature: number = 20;
}

const t = new Thermostat();
t.temperature = 25; // ✅ OK
// t.temperature = 5; // ❌ Immediately Throws RangeError
```

---

## 6. Path Mapping

### The 'Why': Eliminating Relative Path Hell

In massive enterprise projects, importing files from deeply nested directories results in confusing, fragile, and outright ugly paths:

```typescript
// Nightmare scenario
import { DateFormatter } from '../../../../shared/utils/formatters/DateFormatter';
```

If you refactor the architecture and move the importing file to a new directory, the fragile relative import shatters. Path mapping allows you to define clean, alias-based absolute paths relative to your overall project root.

### Configuring `tsconfig.json`

Set up the aliases using `baseUrl` and `paths`. By standard convention, aliases begin with the `@` symbol to clearly differentiate them from external npm packages.

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@models/*": ["domain/models/*"],
      "@utils/*": ["shared/utils/*"],
      "@components/*": ["ui/components/*"]
    }
  }
}
```

Instantly, your imports become pristine and decoupled from folder depth:

```typescript
import { DateFormatter } from '@utils/formatters/DateFormatter';
```

> [!WARNING]
> **Crucial Implementation Detail:** TypeScript's path mapping resolves paths **only during compilation**. Emitted JS files retain the raw alias string. You must configure your build bundler (Webpack, Vite, Rollup) or runtime (e.g., `tsconfig-paths`) to resolve these aliases.

**Vite Configuration Example (`vite.config.ts`):**
```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@models': path.resolve(__dirname, './src/domain/models')
    }
  }
});
```

---

## 🧠 Think Like a Developer

**Scenario 1: Resolving Paralyzing Circular Dependencies**  
*The Situation:* You have an `Order.ts` class file that imports `Customer.ts`, but `Customer.ts` simultaneously imports `Order.ts` to strictly type an array of past orders. Variables randomly evaluate as `undefined` at runtime.  
*The Expert Decision:* "This is a classic circular dependency loop. The domain entity classes are far too tightly coupled. I will immediately create a separate `types.ts` file containing pure, implementation-free interfaces. Both `Order.ts` and `Customer.ts` will use `import type` to pull definitions from the `types.ts` file. Since types are completely erased at runtime, the execution circular dependency chain is broken, and the runtime evaluation succeeds flawlessly."

**Scenario 2: Safely Typing an Obscure Third-Party Script**  
*The Situation:* The Marketing department aggressively insists on adding a proprietary tracking script via a CDN. The script injects an `AnalyticsTrack` object directly onto the global window. Your strict TS compiler screams with errors, blocking the CI pipeline.  
*The Expert Decision:* "I cannot change the remote CDN script, and disabling compiler strictness is unacceptable. I will elegantly create an ambient declaration file `global.d.ts` at the root of my project. I will use `declare interface Window { AnalyticsTrack: { log: (event: string) => void; }; }`. This bridges the structural gap perfectly, granting me rich intellisense and compiler safety without touching the impenetrable implementation logic."

**Scenario 3: Implementing Robust Cross-Cutting Validation**  
*The Situation:* You have 15 different API service classes, and each internal method desperately needs to ensure the user is actively authenticated before proceeding. You currently have `if (!authContext) throw new UnauthorizedError();` copy-pasted 50 times across the codebase.  
*The Expert Decision:* "Rampant copy-pasting violates DRY (Don't Repeat Yourself) principles and severely clutters the core business logic. I will implement a powerful TC39 Method Decorator called `@RequireAuth`. I'll apply this decorator declaratively directly above any method that requires authentication. The decorator will cleanly intercept the call, check the auth state globally, and either throw a centralized error or seamlessly pass execution to the original method."

---

## ⚖️ Before vs After

### 1. Legacy Namespaces vs Modern ES Modules

**Before: Legacy Namespaces (Pollutes Global Scope, severely hard to tree-shake)**
```typescript
// validation.ts
namespace Validation {
  export function isString(val: any) { return typeof val === 'string'; }
}

// app.ts
/// <reference path="validation.ts" />
console.log(Validation.isString("test")); // Highly coupled to the global scope
```

**After: ES Modules (Explicit, clean architectural boundaries, perfectly tree-shakable)**
```typescript
// validation.ts
export function isString(val: any) { return typeof val === 'string'; }

// app.ts
import { isString } from './validation';
console.log(isString("test")); // Independent and verifiable
```

### 2. Experimental Decorators vs TC39 Decorators

**Before: Experimental Decorators (TypeScript < 5.0)**
```typescript
// Cryptic signature relying on internal PropertyDescriptors
function LogExperimental(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(propertyKey, "called");
    return original.apply(this, args);
  }
}
```

**After: Standardized TC39 ECMAScript Decorators (TypeScript 5.0+)**
```typescript
// Clean, standardized signature with dedicated Context objects
function LogTC39(originalMethod: Function, context: ClassMethodDecoratorContext) {
  return function(this: any, ...args: any[]) {
    console.log(String(context.name), "called");
    return originalMethod.apply(this, args);
  }
}
```

---

## ⚠️ Common Mistakes & How to Avoid Them

| The Mistake | The Consequence | The Expert Fix |
|-------------|-----------------|----------------|
| **Exporting `any` in `.d.ts` Files** | Utterly defeats the entire purpose of adding type checking; the compiler remains completely blind to fatal runtime errors. | Explicitly define the interfaces to the highest degree possible, or use `unknown` if the type is truly dynamic, forcing downstream code to use strict type-guards. |
| **Mixing Decorator Paradigms** | Cryptic runtime application crashes such as `"Cannot read properties of undefined (reading 'apply')"`. | Choose a single system and stick to it. For modern apps, rigorously ensure `"experimentalDecorators": true` is **absent** from `tsconfig.json` to properly use native TC39 decorators. |
| **Forgetting to return the result in Method Decorators** | The decorated method executes perfectly, but it inexplicably returns `undefined` to the calling function, breaking the application silently. | Always reliably capture the result of `originalMethod.apply(this, args)` to a variable and explicitly `return result;` at the end of the wrapper function. |
| **Using Path Mapping without Bundler Configuration** | TypeScript compiles without errors, but Node or the browser crashes immediately stating `Module not found: @utils/math`. | Carefully mirror your exact `tsconfig.json` paths mapping rules within your build tool (Webpack aliases, Vite resolve aliases, or `tsconfig-paths` for native Node). |
| **Creating Circular Barrels** | Variables evaluate randomly to `undefined` because File A imports the barrel to reach File B, but File B hasn't loaded into memory yet. | Inside a specific feature directory, files should import from their internal sibling files directly via relative paths (`./helper`), avoiding imports from the parent barrel file `index.ts`. |

---

## 💻 Practice Labs & Assignments

### Lab 1: Establishing Type-Safe Legacy Code (30 mins)
**Objective:** Provide iron-clad safety for an incredibly old JavaScript utility.
1. Create a file `src/legacy/encryption.js` exporting the following: `function hash(str, salt) { return str + salt; }`.
2. Write an accompanying `src/legacy/encryption.d.ts` file declaring this exact module and strictly enforcing that both arguments must be of type `string` and it inherently returns a `string`.
3. Import the newly typed function within `main.ts`. Attempt to erroneously pass a number variable to the `salt` parameter. Confirm that the TypeScript compiler violently throws a type mismatch error.

### Lab 2: Building an Intelligent Accessor Decorator (45 mins)
**Objective:** Validate raw input data seamlessly and automatically using property decorators.
1. Create a robust class named `UserAccount`.
2. Add an `accessor email: string` property to handle email addresses.
3. Build a `@ValidEmail` decorator factory. It should meticulously intercept the `set` operation.
4. If the new incoming value does not contain an `@` symbol anywhere, throw a `TypeError("Invalid Email format provided")`. Otherwise, elegantly permit the assignment to succeed.
5. Thoroughly test it by instantiating `UserAccount` and attempting to assign both valid formats and entirely invalid email formats.

### Assignment: The DataForge Advanced Decorator Suite
**Context:** Your evolving DataForge backend system desperately needs automated telemetry and validation without completely cluttering the delicate business logic.
1. **Telemetry Matrix:** Create a `@MeasurePerformance` method decorator. Tactically apply it to your heaviest API methods (like fetching massive datasets or sorting routines). It should `console.log` the exact milliseconds taken to execute the routine.
2. **Ironclad Validation:** Create an `@IsUUID` accessor decorator. Strategically apply it to the `id` field of your core database entities to strictly ensure they match a 36-character UUID regex pattern before allowing any updates to process.
3. **Architecture Polish:** Configure `paths` within your `tsconfig.json` to intelligently map `@decorators` to your decorators directory, and update your repository imports universally to use this pristine, scalable alias.

---

## 🎤 Interview Prep

**Q1: How precisely does `import type` impact the final JavaScript bundle, and in what scenarios should you rigorously use it?**
**Answer:** `import type` is completely erased by the compiler during the emission phase, leaving absolutely zero trace in the resulting JavaScript. You should relentlessly use it anytime you import a class, interface, or type alias strictly for static type annotation purposes, as it significantly reduces final bundle size and effectively prevents accidental execution side-effects from the imported file.

**Q2: What exactly is a "barrel file", and what specific architectural problem does it elegantly solve?**
**Answer:** A barrel file is an `index.ts` file that re-exports multiple related modules from a specific directory. It beautifully solves the problem of wildly cluttered import statements and deep file path coupling, allowing consumer modules to import multiple interconnected symbols from a single, unified directory endpoint.

**Q3: Describe the fundamental technical difference between the legacy TypeScript decorators and the modern TC39 standard.**
**Answer:** Legacy decorators relied heavily on an experimental compiler flag and possessed function signatures heavily tied to archaic `PropertyDescriptor` manipulation. The modern TC39 standard is a finalized, native ECMAScript proposal fully built into TS 5.0+. TC39 decorators receive the actual target `value` and a rich, unified `context` object containing extensive metadata, providing a drastically cleaner, highly standardized metaprogramming API.

**Q4: If you attempt to import a legacy JavaScript library that entirely lacks types, how does TypeScript react, and how can you definitively fix it?**
**Answer:** Depending on configuration, TypeScript will either implicitly assign the dangerous `any` type (if `noImplicitAny` is false) or throw a hard compilation error. You resolve it by first checking if an official `@types/` package exists on the DefinitelyTyped registry. If not, you manually create an ambient declaration file (`.d.ts`) meticulously defining the module's exact shape using the `declare module` syntax.

**Q5: Why do `tsconfig.json` path aliases frequently fail entirely at runtime, even when the TS compiler shows absolutely zero errors?**
**Answer:** TypeScript's path mapping is purely a compile-time feature designed strictly for module type resolution. It purposely does not alter or rewrite the physical import paths in the generated JavaScript. To successfully resolve them dynamically at runtime, you must configure your bundler (like Vite, Webpack) or a runtime resolver (like `tsconfig-paths` natively in Node) with identical, synchronized alias mappings.

---

## 📜 Cheat Sheet

```typescript
// 1. ES Modules, Naming Conventions & Barrel Files
export function utility() {}             // Standard Named export
export default class MainClass {}        // Standard Default export
import type { DataModel } from './types';// Highly optimized Type-only import
export * from './moduleA';               // Seamless Re-export (Barrel File approach)

// 2. Path Mapping Implementation (tsconfig.json)
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": { "@utils/*": ["shared/utils/*"] }
  }
}

// 3. Custom Ambient Declaration File (.d.ts)
declare module 'ancient-untyped-lib' {
  // Defining the boundary explicitly
  export function doSomething(param: string): boolean;
}
// Declaring a globally injected environmental variable
declare const __GLOBAL_PRODUCTION_ENV__: string;    

// 4. Modern TC39 Class Decorator Implementation
function Singleton(value: any, context: ClassDecoratorContext) {
  let instance: any;
  return class extends value {
    constructor(...args: any[]) {
      // Return cached instance if available
      if (instance) return instance;
      super(...args); instance = this;
    }
  }
}

// 5. Modern TC39 Method Decorator Implementation
function Log(originalMethod: Function, context: ClassMethodDecoratorContext) {
  return function(this: any, ...args: any[]) {
    console.log(`Executing sequence ${String(context.name)}`);
    // Crucial: return the result of the apply call
    return originalMethod.apply(this, args);
  }
}

// 6. Modern TC39 Accessor Decorator Implementation
function MinimumBoundary(min: number) {
  return function(value: any, context: ClassAccessorDecoratorContext) {
    return {
      get(this: any) { return value.get.call(this); },
      set(this: any, val: number) {
        if(val < min) throw new Error("Value provided is critically too low");
        value.set.call(this, val);
      }
    };
  }
}
```

---

## 📌 Key Takeaways & Resources

- **Organize Strictly by Intent:** Use ES Modules and Named Exports strictly. One file should typically possess a single, clear responsibility.
- **Erase Unnecessary Data:** Relentlessly leverage `import type` to instruct the compiler to keep your runtime payload lean, fast, and secure.
- **Bridge the Untyped Gap:** Use `.d.ts` files to safely wrap untyped legacy logic, ensuring the TypeScript compiler rigidly protects your modern application layer from legacy failures.
- **Embrace the ECMAScript Standard:** TC39 Decorators are the standardized future of JavaScript metaprogramming. Use them actively to cleanly extract cross-cutting concerns like heavy logging and validation out of your core business logic.
- **Respect the Build Bundler:** Always remember that TypeScript is mostly a glorified type-checker. Executing runtime features like Path Mapping requires dual configuration mapped perfectly in your build tools.

### 📚 Extensive Tutorials & Resources
- [The Official TypeScript Handbook: Modules Deep Dive](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [The Official TypeScript Handbook: Ambient Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [The DefinitelyTyped GitHub Repository Ecosystem](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [TypeScript 5.0 Release Notes: The TC39 Decorators Architecture](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)

---

**Next Lecture:** [Lecture 23 — TypeScript with Modern Tooling & Testing](./23%20-%20TypeScript%20with%20Modern%20Tooling%20%26%20Testing.md)
