# Lecture 19 — TypeScript Fundamentals: Types, Interfaces & Compilation

---

**Course:** Fullstack Web Development  
**Instructor:** Course Instructor  
**Duration:** ~3 hours (including labs)

---

## Table of Contents

1. [Learning Objectives](#learning-objectives)
2. [Agenda](#agenda)
3. [What Is TypeScript?](#1-what-is-typescript)
4. [Why TypeScript?](#2-why-typescript)
5. [TypeScript vs JavaScript](#3-typescript-vs-javascript)
6. [Installation & Project Setup](#4-installation--project-setup)
7. [The TypeScript Compiler (tsc)](#5-the-typescript-compiler-tsc)
8. [tsconfig.json — Configuring the Compiler](#6-tsconfigjson--configuring-the-compiler)
9. [Basic Type Annotations](#7-basic-type-annotations)
10. [Type Inference](#8-type-inference)
11. [The `any`, `unknown`, `never`, and `void` Types](#9-the-any-unknown-never-and-void-types)
12. [Union Types & Literal Types](#10-union-types--literal-types)
13. [Type Guards & Narrowing](#11-type-guards--narrowing)
14. [Arrays & Tuples](#12-arrays--tuples)
15. [Enums](#13-enums)
16. [Interfaces](#14-interfaces)
17. [Type Aliases: `type` vs `interface`](#15-type-aliases-type-vs-interface)
18. [Intersection Types](#16-intersection-types)
19. [Advanced Type Features](#17-advanced-type-features)
20. [Index Signatures](#18-index-signatures)
21. [Lab 1 — Convert JS to TypeScript](#lab-1--convert-js-to-typescript)
22. [Lab 2 — Typed API Interface Builder](#lab-2--typed-api-interface-builder)
23. [Assignment: DataForge Project Part 1 — Initial Typings](#assignment-dataforge-project-part-1--initial-typings)
24. [Key Takeaways](#key-takeaways)
25. [Resources](#resources)
26. [Common Mistakes & How to Avoid Them](#common-mistakes--how-to-avoid-them)

---

## Learning Objectives

By the end of this lecture, you will be able to:

- [ ] Explain what TypeScript is and why developers use it
- [ ] Install TypeScript in a project and configure `tsconfig.json`
- [ ] Use the TypeScript compiler (`tsc`) to compile `.ts` files to JavaScript
- [ ] Apply basic type annotations: `string`, `number`, `boolean`, `void`, `never`, `any`, `unknown`
- [ ] Write union types, literal types, and intersection types
- [ ] Use type guards and narrowing to safely work with uncertain types
- [ ] Define typed arrays and tuples
- [ ] Create enums (`enum` and `const enum`)
- [ ] Define object shapes with interfaces, including optional and readonly properties
- [ ] Extend interfaces and compose types using intersection
- [ ] Distinguish between `type` aliases and `interface` declarations and know when to use each
- [ ] Use `as const` and the `satisfies` operator
- [ ] Write index signatures for dynamic key-value objects

---

## Agenda

| Time (approx.) | Topic |
|---|---|
| 0:00 – 0:20 | What is TypeScript? Why does it exist? |
| 0:20 – 0:40 | Installation, tsconfig.json, compiler basics |
| 0:40 – 1:10 | Basic types: string, number, boolean, any, unknown, never, void |
| 1:10 – 1:30 | Union types, literal types, type inference |
| 1:30 – 1:50 | Type guards and narrowing |
| 1:50 – 2:10 | Arrays, tuples, enums |
| 2:10 – 2:30 | Interfaces, type aliases, intersection types |
| 2:30 – 2:40 | Advanced features: as const, satisfies, index signatures |
| 2:40 – 3:00 | Labs + Assignment overview |

---

## 1. What Is TypeScript?

### Plain-English Explanation

Imagine you are building a house. You could just start nailing boards together and figure things out as you go — maybe the walls will line up, maybe they won't. **Or** you could draw a detailed architectural blueprint first, specifying exactly where every wall, window, and door goes. The blueprint catches problems *before* a single nail is hammered.

**TypeScript is the blueprint for your JavaScript code.**

JavaScript is a dynamic, flexible language. You can store any value in any variable, call functions with the wrong number of arguments, and the language will not complain — until your program is running and crashes in front of a user.

TypeScript adds a **type system** on top of JavaScript. You tell TypeScript: "This variable always holds a number," or "This function always receives a string and returns a boolean." TypeScript then checks your entire codebase to make sure you are keeping those promises. If you break a promise, TypeScript shows you an error *before* you even run the code.

### The Technical Definition

> **TypeScript** is a **statically-typed superset of JavaScript** that **compiles to plain JavaScript**.

Let's unpack that phrase:

- **Superset of JavaScript** — Every valid JavaScript file is also valid TypeScript. You can rename a `.js` file to `.ts` and it will (mostly) just work. TypeScript *adds* features; it does not replace JavaScript.
- **Statically-typed** — Types are checked at *compile time* (before the code runs), not at *runtime* (while the code is running).
- **Compiles to JavaScript** — Browsers and Node.js do not understand TypeScript directly. TypeScript is translated (compiled) into plain JavaScript before it runs. The type annotations disappear completely from the output.

### The Compilation Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR WORKFLOW                           │
│                                                             │
│  ┌──────────────┐    tsc     ┌──────────────┐    Node/     │
│  │  app.ts      │  ───────►  │  app.js      │  Browser     │
│  │  (TypeScript)│  compile   │  (JavaScript)│  runs this   │
│  └──────────────┘            └──────────────┘              │
│                                                             │
│  Type errors caught HERE ───►  No types here (stripped)    │
└─────────────────────────────────────────────────────────────┘
```

### Key Point: TypeScript Is Erased at Runtime

```ts
// What you write (TypeScript):
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

```js
// What the browser/Node receives (compiled JavaScript):
function greet(name) {
  return `Hello, ${name}!`;
}
```

The `: string` annotations simply vanish. TypeScript is purely a **development-time** tool.

> [!NOTE]
> TypeScript was created by Microsoft and first released in 2012. It is now used by the majority of large JavaScript projects including Angular, VS Code, and Slack.

### Section Recap

- TypeScript = JavaScript + a type system
- Types are checked **before** the code runs (compile time)
- TypeScript compiles to plain JavaScript — browsers never see the types
- Think of TypeScript as an architectural blueprint for your code

---

## 2. Why TypeScript?

### The Problem TypeScript Solves

Consider this innocent-looking JavaScript function:

```js
// Plain JavaScript — no types
function calculateDiscount(price, discountPercent) {
  return price - (price * discountPercent / 100);
}

// Called correctly:
calculateDiscount(100, 10); // ✅ Returns 90

// Called incorrectly — JavaScript won't warn you:
calculateDiscount("100", 10);  // 😱 Returns "100-10" — string concatenation bug!
calculateDiscount(100, "10%"); // 😱 Returns NaN — silent failure!
```

JavaScript silently produced wrong answers. With TypeScript:

```ts
// TypeScript — with types
function calculateDiscount(price: number, discountPercent: number): number {
  return price - (price * discountPercent / 100);
}

// TypeScript catches the mistake INSTANTLY in your editor:
calculateDiscount("100", 10);
//                ^^^^^
// Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

### Why Does This Matter?

1. **Bugs caught earlier = bugs cheaper to fix.** A bug found in your editor costs seconds to fix. A bug found in production can cost hours of debugging and lost business.
2. **IDE superpowers.** When TypeScript knows the shape of your data, your editor can suggest properties, autocomplete method names, and show you the exact signature of any function — without you needing to look at the docs.
3. **Code is self-documenting.** Reading `function fetchUser(id: number): Promise<User>` tells you everything about that function at a glance.
4. **Safe refactoring.** When you rename a property or change a function signature, TypeScript immediately shows you every place in the codebase that needs updating.
5. **Team scalability.** On large teams, TypeScript acts as a shared contract between developers. The type definitions tell every team member exactly what shape data must have.

### Real-World Analogy: The Typed vs. Untyped Warehouse

Imagine two warehouses storing packages:

- **JavaScript warehouse**: Packages have no labels. Anything can go on any shelf. Workers sometimes grab the wrong package. Mistakes are discovered only when the customer opens the box.
- **TypeScript warehouse**: Every package is labelled with its exact contents. Shelves are labelled with what they accept. The warehouse management system *refuses* to place a package on the wrong shelf and alerts you immediately.

### Section Recap

- JavaScript's flexibility is also its greatest source of bugs
- TypeScript catches type mismatches before your code ever runs
- Benefits: fewer bugs, better autocomplete, self-documenting code, safer refactoring
- Particularly valuable on large codebases and teams

---

## 3. TypeScript vs JavaScript

### Side-by-Side Comparison

Here is the same piece of logic written in both languages. Study the differences carefully.

**JavaScript version:**

```js
// user-service.js — JavaScript
// No type information at all

function createUser(name, age, role) {
  return {
    name: name,
    age: age,
    role: role,
    createdAt: new Date(),
  };
}

function getUserDisplayName(user) {
  // Is user.name guaranteed to be a string? We don't know.
  return user.name.toUpperCase(); // Could crash if name is undefined
}

const user = createUser("Alice", 30, "admin");
getUserDisplayName(user); // Works fine
getUserDisplayName(null); // 💥 Runtime crash: Cannot read property 'name' of null
```

**TypeScript version:**

```ts
// user-service.ts — TypeScript
// Every shape is described with types

// Describe what a User object must look like
interface User {
  name: string;        // name must be a string
  age: number;         // age must be a number
  role: "admin" | "editor" | "viewer";  // role must be one of these three strings
  createdAt: Date;     // createdAt must be a Date object
}

// The function signature is a complete contract
function createUser(name: string, age: number, role: "admin" | "editor" | "viewer"): User {
  return {
    name,
    age,
    role,
    createdAt: new Date(),
  };
}

// TypeScript knows 'user' is of type User — autocomplete works on user.name, user.age, etc.
function getUserDisplayName(user: User): string {
  return user.name.toUpperCase();
}

const user = createUser("Alice", 30, "admin"); // ✅ Valid
getUserDisplayName(user);                       // ✅ Valid
getUserDisplayName(null);
//                 ^^^^
// Error: Argument of type 'null' is not assignable to parameter of type 'User'.
```

### Key Syntactic Differences

| Feature | JavaScript | TypeScript |
|---|---|---|
| Variable types | `let x = 5` | `let x: number = 5` |
| Function params | `function f(a, b)` | `function f(a: string, b: number)` |
| Return types | `function f() { ... }` | `function f(): string { ... }` |
| Object shapes | Implied, no declaration | Defined with `interface` or `type` |
| Arrays | `let arr = []` | `let arr: number[] = []` |
| File extension | `.js` | `.ts` |

### Section Recap

- TypeScript adds `: type` annotations to variables, parameters, and return values
- Interfaces describe what objects must look like
- The compiler finds mistakes that JavaScript would silently ignore
- TypeScript files use the `.ts` extension

---

## 4. Installation & Project Setup

### Prerequisites

Make sure you have Node.js installed. You can check by running:

```bash
node --version   # Should print v18.x.x or higher
npm --version    # Should print 9.x.x or higher
```

### Step-by-Step Installation

**Step 1: Create a new project folder**

```bash
mkdir my-ts-project
cd my-ts-project
```

**Step 2: Initialize a Node.js project**

This creates a `package.json` file that tracks your project's dependencies.

```bash
npm init -y
```

The `-y` flag auto-accepts all defaults so you don't have to answer questions.

**Step 3: Install TypeScript as a development dependency**

```bash
npm install -D typescript
```

- `install` — downloads and adds the package
- `-D` (short for `--save-dev`) — marks this as a *development* dependency. TypeScript is only needed during development, not in production, because the compiled JavaScript files are what actually run.

**Step 4: Verify the installation**

```bash
npx tsc --version   # Should print Version 5.x.x
```

> [!TIP]
> Using `npx tsc` runs the locally installed version of TypeScript (from your `node_modules`). This is preferred over installing TypeScript globally, because different projects can use different TypeScript versions without conflicts.

**Step 5: Create your first TypeScript file**

```bash
mkdir src
```

Create `src/index.ts`:

```ts
// src/index.ts

// A simple TypeScript greeting function
const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

console.log(greet("World"));
```

**Step 6: Compile it**

```bash
npx tsc src/index.ts
```

This produces a `src/index.js` file with the types stripped out.

### Project Folder Structure (Recommended)

```
my-ts-project/
├── src/               ← Your TypeScript source files go here
│   └── index.ts
├── dist/              ← Compiled JavaScript output goes here (auto-created)
├── node_modules/      ← npm packages (auto-created, never edit manually)
├── tsconfig.json      ← TypeScript configuration (we create this next)
└── package.json       ← npm project metadata
```

### Section Recap

- Install TypeScript with `npm install -D typescript`
- Use `npx tsc` to run the locally installed compiler
- Source files go in `src/`, compiled output goes in `dist/`
- Always install TypeScript as a dev dependency (`-D`)

---

## 5. The TypeScript Compiler (tsc)

### What the Compiler Does

The TypeScript compiler (`tsc`) performs two jobs:

1. **Type checking** — reads your `.ts` files and verifies all type rules are satisfied
2. **Transpilation** — strips type annotations and outputs plain `.js` files

### Common Compiler Commands

```bash
# Compile a single file
npx tsc src/index.ts

# Compile the entire project (uses tsconfig.json for settings)
npx tsc

# Compile in WATCH mode — automatically recompiles when you save a file
npx tsc --watch

# Type-check only (no output files — useful in CI pipelines)
npx tsc --noEmit

# Initialize a tsconfig.json with sensible defaults
npx tsc --init
```

### Watch Mode — Your Best Friend

During development, you almost always want the compiler running in **watch mode**:

```bash
npx tsc --watch
```

```
# Terminal output in watch mode:
[10:35:22] Starting compilation in watch mode...
[10:35:23] Found 0 errors. Watching for file changes.

# After you introduce a type error:
[10:35:31] src/index.ts:5:14 - error TS2345:
            Argument of type 'number' is not assignable to parameter of type 'string'.
[10:35:31] Found 1 error. Watching for file changes.
```

### Running TypeScript Directly with ts-node

Installing and compiling separately can be tedious during experimentation. `ts-node` lets you execute TypeScript files directly without a separate compile step:

```bash
# Install ts-node
npm install -D ts-node

# Run a TypeScript file directly
npx ts-node src/index.ts
```

> [!NOTE]
> `ts-node` is great for development and scripts, but you still need `tsc` to produce optimised JavaScript for production deployment.

### Section Recap

- `npx tsc` — compile the project once
- `npx tsc --watch` — recompile automatically on every save
- `npx tsc --noEmit` — type-check only, no output files
- `npx ts-node file.ts` — run TypeScript directly (dev only)

---

## 6. tsconfig.json — Configuring the Compiler

### What Is tsconfig.json?

`tsconfig.json` is the configuration file that tells the TypeScript compiler how to behave for your project. When you run `npx tsc` (without specifying a file), TypeScript looks for this file to understand:

- Which files to compile
- Where to put the compiled output
- What JavaScript version to target
- How strict to be about type checking

Think of it like a settings panel for the TypeScript blueprint system.

### Generating a Default tsconfig.json

```bash
npx tsc --init
```

This creates a `tsconfig.json` with many options commented out. Let's build a clean, well-understood version from scratch.

### A Recommended tsconfig.json for Beginners

```json
{
  "compilerOptions": {
    // ─── Output Settings ────────────────────────────────────────────────────
    
    "target": "ES2020",
    // What version of JavaScript to compile to.
    // ES2020 supports modern features like optional chaining (?.)
    // and is supported by all modern Node.js versions and browsers.
    // Other options: "ES5" (old browsers), "ES2022", "ESNext" (latest)

    "module": "commonjs",
    // What module system to use in the output.
    // "commonjs" = Node.js style (require/module.exports)
    // "ESNext" = ES Modules style (import/export) — use for browsers/Vite

    "outDir": "./dist",
    // The folder where compiled .js files are placed.
    // Keeps your source and output separate.

    "rootDir": "./src",
    // The root folder of your TypeScript source files.
    // TypeScript mirrors this folder structure in outDir.

    // ─── Type Checking Strictness ───────────────────────────────────────────

    "strict": true,
    // THE MOST IMPORTANT OPTION.
    // Enables a bundle of strict type-checking rules. Highly recommended.
    // See the next section for what strict enables.

    // ─── Module Resolution ─────────────────────────────────────────────────

    "esModuleInterop": true,
    // Allows default imports from CommonJS modules.
    // Without this, you'd have to write: import * as path from 'path'
    // With this, you can write:          import path from 'path'

    "moduleResolution": "node",
    // How TypeScript finds imported modules.
    // "node" mimics how Node.js resolves modules (looks in node_modules).

    // ─── Quality of Life ───────────────────────────────────────────────────

    "skipLibCheck": true,
    // Skip type-checking of .d.ts files in node_modules.
    // Speeds up compilation and avoids errors from third-party types.

    "forceConsistentCasingInFileNames": true
    // Prevents bugs from case-insensitive file systems (Windows vs macOS).
    // If you import './MyFile', the actual file MUST be named 'MyFile.ts'.
  },
  "include": ["src/**/*"],
  // Which files to include in compilation.
  // "src/**/*" means "all files inside the src folder, recursively".

  "exclude": ["node_modules", "dist"]
  // Which files/folders to exclude.
  // node_modules and dist are always excluded — never compile those.
}
```

### What `"strict": true` Enables

Turning on `strict` actually enables **several individual options** at once. Understanding each one helps you understand what TypeScript is protecting you from:

| Strict Option | What It Does | Bug It Prevents |
|---|---|---|
| `strictNullChecks` | `null` and `undefined` are not assignable to other types | `Cannot read property 'x' of null` crashes |
| `noImplicitAny` | Variables can't silently have type `any` | Untyped code that defeats the purpose of TypeScript |
| `strictFunctionTypes` | Stricter checking of function parameter types | Subtle callback type mismatches |
| `strictBindCallApply` | Checks `bind`, `call`, and `apply` arguments | Wrong argument types passed through `.call()` |
| `strictPropertyInitialization` | Class properties must be initialised in the constructor | Accessing undefined class properties |
| `noImplicitThis` | `this` must have an explicit type in functions | `this` being `any` inside callbacks |
| `alwaysStrict` | Emits `"use strict"` in all output files | Legacy JavaScript pitfalls |

> [!IMPORTANT]
> Always start new projects with `"strict": true`. The small up-front cost of adding types is far outweighed by the bugs it prevents. Retrofitting strict mode onto an existing JavaScript project is much harder.

### How rootDir / outDir Affects File Structure

```
# With rootDir: "./src" and outDir: "./dist"

src/
├── index.ts          →   dist/index.js
├── utils/
│   └── helpers.ts    →   dist/utils/helpers.js
└── models/
    └── user.ts       →   dist/models/user.js
```

TypeScript mirrors your `src/` folder structure inside `dist/`.

### Section Recap

- `tsconfig.json` controls how the TypeScript compiler behaves
- `"target"` — what JavaScript version to output
- `"outDir"` / `"rootDir"` — where to read from and write to
- `"strict": true` — enables all safety checks; always use it
- `"esModuleInterop": true` — allows cleaner import syntax
- Generate a starting config with `npx tsc --init`

---

## 7. Basic Type Annotations

### What Is a Type Annotation?

A **type annotation** is a piece of syntax you add to your code that tells TypeScript what kind of value a variable, parameter, or function return value should hold.

Syntax: you write a colon (`:`) followed by the type name.

```ts
let variableName: typeName = value;
```

### The Primitive Types

JavaScript has three fundamental primitive types. TypeScript has type names for all of them:

#### `string` — Text

```ts
// Declare a variable that must always hold a string
let firstName: string = "Alice";
let greeting: string = `Hello, ${firstName}`; // Template literals work fine

// TypeScript will catch this:
firstName = 42;
// Error: Type 'number' is not assignable to type 'string'.

// Function that takes a string and returns a string
function toUpperCase(text: string): string {
  return text.toUpperCase();
}
```

#### `number` — All Numbers (Integer and Decimal)

TypeScript (like JavaScript) has only one type for all numbers. There is no separate `int` or `float`.

```ts
let age: number = 30;
let price: number = 9.99;      // Decimals are numbers too
let hex: number = 0xff;         // Hexadecimal literal
let binary: number = 0b1010;    // Binary literal
let negative: number = -273.15; // Negatives are numbers too

// Function with a number parameter and return type
function double(n: number): number {
  return n * 2;
}

double(5);    // ✅ Returns 10
double("5");  // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

#### `boolean` — True or False

```ts
let isLoggedIn: boolean = false;
let hasPermission: boolean = true;

// Common pattern: a function that returns a boolean
function isAdult(age: number): boolean {
  return age >= 18; // This expression evaluates to true or false
}

isAdult(20); // Returns true
isAdult(15); // Returns false
```

### Annotating Function Parameters and Return Types

This is where type annotations add the most value:

```ts
// Anatomy of a fully typed function:
//
//     parameter name
//          │    parameter type
//          │    │        return type
//          ▼    ▼        ▼
function add(a: number, b: number): number {
  return a + b;
}

// Multiple parameters, each annotated separately
function formatCurrency(amount: number, currency: string, decimals: number): string {
  return `${currency}${amount.toFixed(decimals)}`;
}

formatCurrency(9.99, "$", 2);    // ✅ "$9.99"
formatCurrency("9.99", "$", 2);  // ❌ Error on first arg: string is not number
```

### Annotating Variables

```ts
// Explicit annotation — you tell TypeScript the type
let username: string;         // Declared but not assigned yet
let count: number = 0;        // Declared and initialised
const MAX_SIZE: number = 100; // Constants can also be typed

// Later assignment must match the annotation
username = "bob";  // ✅
username = 42;     // ❌ Error: Type 'number' is not assignable to type 'string'.
```

> [!TIP]
> For variables that you initialise right away (e.g., `let x = 5`), you usually do NOT need to write the type annotation. TypeScript can figure it out automatically. This is called **type inference** and is covered in the next section.

### Section Recap

- `: type` syntax is a type annotation
- Three primitive types: `string`, `number`, `boolean`
- Annotate function parameters and return types for maximum safety
- Variables can be annotated too, but often TypeScript can infer the type

---

## 8. Type Inference

### What Is Type Inference?

Type inference is TypeScript's ability to **figure out the type of a value automatically** based on context — without you having to write an annotation.

Real-world analogy: If someone hands you a red apple and says "hold this," you know it's an apple without them needing to say "hold this apple." The context makes it obvious.

### Inference at Variable Initialisation

When you declare a variable and assign a value in the same statement, TypeScript infers the type from the value:

```ts
// TypeScript INFERS the types — no annotations needed here
let name = "Alice";    // TypeScript knows: name is a string
let age = 30;          // TypeScript knows: age is a number
let active = true;     // TypeScript knows: active is a boolean

// Once inferred, the type is locked — you can't change it
name = "Bob";    // ✅ Still a string
name = 42;       // ❌ Error: Type 'number' is not assignable to type 'string'.
```

These two declarations are **exactly equivalent** to TypeScript:

```ts
let score: number = 100;  // Explicit annotation
let score = 100;          // Inferred — TypeScript sees 100 and knows it's a number
```

### Inference in Function Return Types

TypeScript can often infer what a function returns:

```ts
// No return type annotation — TypeScript infers it as number
function multiply(a: number, b: number) {
  return a * b; // TypeScript sees: number * number = number
}

// TypeScript knows the result is a number, so this is an error:
const result: string = multiply(3, 4);
// Error: Type 'number' is not assignable to type 'string'.
```

### When to Annotate vs When to Let TypeScript Infer

This is a common question for beginners. Here's the rule of thumb:

```
┌──────────────────────────────────────────────────────────────────┐
│           WHEN TO ANNOTATE vs WHEN TO INFER                      │
│                                                                  │
│  ✅ LET TYPESCRIPT INFER when:                                   │
│     • Variable is initialised with a value at declaration        │
│       e.g., const count = 0;                                     │
│     • Function return type is obvious from the implementation    │
│       e.g., function add(a: number, b: number) { return a + b; } │
│                                                                  │
│  ✅ YOU SHOULD ANNOTATE when:                                     │
│     • Variable is declared but not initialised yet               │
│       e.g., let user: User;  — assigned later                   │
│     • Function parameters — ALWAYS annotate these               │
│       e.g., function greet(name: string)                         │
│     • Function return types — good practice for public APIs      │
│       e.g., function getUser(): User                             │
│     • The inferred type is too broad                             │
│       e.g., TypeScript infers 'string' but you want '"admin"'   │
└──────────────────────────────────────────────────────────────────┘
```

**Example of inference being too broad:**

```ts
// TypeScript infers: role is type 'string'
let role = "admin";

// Now you can accidentally do this without an error:
role = "superuser"; // TypeScript allows any string!

// Better: annotate with a literal type to be precise
let role: "admin" | "editor" | "viewer" = "admin";
role = "superuser"; // ❌ Now TypeScript correctly catches this as an error!
```

### Section Recap

- TypeScript infers types from initial values automatically
- You don't need to annotate variables that are initialised immediately
- Always annotate function parameters — TypeScript can't infer them
- Annotate return types for public functions for clarity and safety
- Sometimes you need explicit annotations when inference is too broad

---

## 9. The `any`, `unknown`, `never`, and `void` Types

These four special types describe unusual situations. Understanding them is crucial.

### `any` — The Escape Hatch (Use Sparingly!)

`any` tells TypeScript: **"Trust me, I know what I'm doing — don't check this."**

When a value has type `any`, TypeScript stops checking it entirely. You can assign anything to it, read any property from it, and call it as a function — TypeScript won't complain.

```ts
let dangerous: any;

// All of these are allowed — TypeScript turns off type checking for 'dangerous'
dangerous = 42;
dangerous = "hello";
dangerous = { x: 1 };
dangerous = () => {};

// This is allowed and WILL crash at runtime — TypeScript can't catch it
dangerous.toUpperCase(); // If dangerous is currently 42, this crashes!
dangerous.nonExistentMethod(); // Also allowed by TypeScript — but will crash!
```

> [!WARNING]
> Using `any` defeats the entire purpose of TypeScript. It is like installing a smoke detector and then removing the battery because the beeping is annoying. If `"noImplicitAny": true` is set (part of `strict`), TypeScript will warn you when variables accidentally become `any`.

**When is `any` ever justified?**
- During incremental migration from JavaScript to TypeScript, as a temporary measure
- For values coming from truly dynamic sources where the shape is unknowable
- In tests where you specifically need to bypass type checking

```ts
// A poorly typed third-party library might return 'any'
// In this case, using 'any' might be unavoidable:
const data: any = legacyLibrary.fetchData();
```

### `unknown` — The Safe Alternative to `any`

`unknown` is like `any` but with a crucial difference: **you must verify the type before using it**.

Think of `unknown` as an unmarked package. You know something is inside, but you must open it and check before you can use the contents.

```ts
let userInput: unknown;

userInput = 42;
userInput = "hello";
userInput = { name: "Alice" };

// ❌ You CANNOT use an 'unknown' value directly:
userInput.toUpperCase();
// Error: Object is of type 'unknown'.

// ✅ You MUST first check what it is (this is called a "type guard"):
if (typeof userInput === "string") {
  // Inside this block, TypeScript KNOWS userInput is a string
  console.log(userInput.toUpperCase()); // ✅ Safe!
}
```

**When to use `unknown`:**
- When receiving data from external sources (API responses, user input, `JSON.parse()`)
- As a safer alternative to `any` — forces you to verify before using

```ts
// Real-world example: parsing JSON from an API
function parseApiResponse(rawData: unknown): string {
  // Must check the type before accessing .message
  if (typeof rawData === "object" && rawData !== null && "message" in rawData) {
    // At this point TypeScript has narrowed rawData enough
    return String((rawData as { message: unknown }).message);
  }
  throw new Error("Unexpected response format");
}
```

### `void` — Functions That Return Nothing

`void` is used as the return type for functions that do not return a meaningful value. Most functions that exist solely for their **side effects** (logging, updating the DOM, sending a request) return `void`.

```ts
// This function logs to the console — it doesn't return anything useful
function logMessage(message: string): void {
  console.log(`[LOG]: ${message}`);
  // No return statement — that's fine for void
}

// Arrow function equivalent
const printError = (error: string): void => {
  console.error(`[ERROR]: ${error}`);
};

// Trying to use the return value makes no sense:
const result = logMessage("hello"); // result has type 'void'
// TypeScript will warn you if you try to use 'result' as if it had a value
```

> [!NOTE]
> `void` is NOT the same as `undefined`. A function returning `void` is saying "callers should not depend on the return value." In practice they often are the same, but the semantic intent is different.

### `never` — The Impossible Type

`never` represents a value that **never exists**. It is used for:

1. Functions that **never return** (they either throw an error or run forever)
2. Code branches that TypeScript determines are **unreachable**

```ts
// ── Case 1: Functions that always throw ─────────────────────────────
function throwError(message: string): never {
  throw new Error(message);
  // This function never reaches a return statement — it always throws
  // TypeScript marks its return type as 'never'
}

// ── Case 2: Infinite loops ─────────────────────────────────────────
function runForever(): never {
  while (true) {
    // Do something forever
  }
  // This function never returns either
}

// ── Case 3: Exhaustive checks (advanced but useful) ─────────────────
type Direction = "north" | "south" | "east" | "west";

function handleDirection(dir: Direction): string {
  switch (dir) {
    case "north": return "Going north!";
    case "south": return "Going south!";
    case "east":  return "Going east!";
    case "west":  return "Going west!";
    default:
      // If we've handled all cases above, TypeScript knows this is unreachable
      // The type of 'dir' here is 'never'
      const exhaustiveCheck: never = dir;
      throw new Error(`Unhandled direction: ${exhaustiveCheck}`);
  }
}

// Now if you add "up" to Direction and forget to add a case in the switch,
// TypeScript will show an error at the 'exhaustiveCheck' line!
```

### Summary Comparison

```
┌──────────────────────────────────────────────────────────────────────────┐
│          SPECIAL TYPES COMPARISON                                        │
│                                                                          │
│  any     → "Trust me, skip type checking entirely" (avoid it!)          │
│  unknown → "I don't know yet — I must check before using" (safe!)       │
│  void    → "This function runs for side effects; return value is N/A"   │
│  never   → "This code path is impossible / this function never returns"  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Section Recap

- `any` disables type checking — avoid it; use it only as a last resort
- `unknown` is the safe version of `any` — forces type verification before use
- `void` is the return type of functions that don't return meaningful values
- `never` is the return type of functions that never finish (throw or loop forever)

---

## 10. Union Types & Literal Types

### Union Types — "Either This or That"

A **union type** allows a value to be one of several types. You write union types with the pipe character `|` between types.

Real-world analogy: A parking spot that accepts either a car or a motorcycle. Not just any vehicle — but specifically those two kinds.

```ts
// A value that can be a string OR a number
let id: string | number;

id = "abc-123"; // ✅ String is allowed
id = 42;        // ✅ Number is allowed
id = true;      // ❌ Boolean is not in the union

// Function that accepts a string OR number
function printId(id: string | number): void {
  console.log(`ID is: ${id}`);
}

printId("user-001");  // ✅
printId(42);          // ✅
printId(true);        // ❌ Error
```

### Working With Union Types — Narrowing Required

When you have a union type, you can only use operations that are **valid for ALL members** of the union, unless you narrow the type first:

```ts
function formatId(id: string | number): string {
  // ❌ Cannot call .toUpperCase() here — numbers don't have toUpperCase
  // return id.toUpperCase();

  // ✅ Must narrow the type first:
  if (typeof id === "string") {
    // Inside this if-block, TypeScript KNOWS id is a string
    return id.toUpperCase(); // ✅ Safe
  } else {
    // Here TypeScript KNOWS id must be a number (the only other option)
    return id.toString(); // ✅ Safe
  }
}
```

### Literal Types — Exact Value Constraints

A **literal type** is a type that represents one exact value, not just a general category.

```ts
// Regular type: any string
let color1: string = "red";
color1 = "blue";     // ✅ Any string is fine
color1 = "purple";   // ✅

// Literal type: ONLY the exact string "red"
let color2: "red" = "red";
color2 = "blue";     // ❌ Error: Type '"blue"' is not assignable to type '"red"'.
```

Literal types are most powerful when combined with union types:

```ts
// This value can ONLY be one of these three exact strings
type UserRole = "admin" | "editor" | "viewer";

function setPermission(role: UserRole): void {
  console.log(`Setting role to: ${role}`);
}

setPermission("admin");    // ✅
setPermission("editor");   // ✅
setPermission("viewer");   // ✅
setPermission("superuser");// ❌ Error: not one of the three allowed values

// Literal types work with numbers too:
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceValue = 3; // ✅
roll = 7;                // ❌ Error: 7 is not a valid dice value
```

### Practical Use Case: Status Codes

```ts
// Instead of using a plain string or number (too broad),
// use a literal union to restrict valid values:

type HttpStatus = 200 | 301 | 400 | 401 | 403 | 404 | 500;

type RequestStatus = "idle" | "loading" | "success" | "error";

interface ApiState {
  status: RequestStatus;     // Can only be one of the four strings
  data: unknown;
  errorMessage: string | null; // Can be a string OR null
}

// Usage:
const state: ApiState = {
  status: "loading", // ✅
  data: null,
  errorMessage: null,
};

// Later:
state.status = "success"; // ✅
state.status = "pending";  // ❌ Error: not a valid RequestStatus
```

### Section Recap

- Union types use `|` to allow a value to be one of several types: `string | number`
- Literal types constrain a value to an exact value: `"admin" | "viewer"`
- When using union types, you must narrow to a specific type before using type-specific operations
- Literal union types are excellent for modelling fixed sets of values (statuses, roles, directions)

---

## 11. Type Guards & Narrowing

### What Is Narrowing?

**Narrowing** is the process by which TypeScript refines a broad type into a more specific one based on control flow (if statements, switch statements, etc.).

Think of it like a funnel: you start with a wide type (`string | number`), and as you add conditions, TypeScript funnels it down to a specific type (`string` or `number`).

```
Before narrowing:        After narrowing:
┌─────────────────┐      ┌──────────┐
│  string         │      │  string  │  ← Inside: if (typeof x === "string")
│  number         │ ───► │──────────│
│                 │      │  number  │  ← Inside: else
└─────────────────┘      └──────────┘
```

### Type Guard 1: `typeof`

The `typeof` operator works for primitive types:

```ts
function processValue(value: string | number | boolean): string {
  // Check 1: Is it a string?
  if (typeof value === "string") {
    // TypeScript narrows 'value' to 'string' here
    return value.toUpperCase(); // .toUpperCase() is safe on string
  }

  // Check 2: Is it a number?
  if (typeof value === "number") {
    // TypeScript narrows 'value' to 'number' here
    return value.toFixed(2); // .toFixed() is safe on number
  }

  // At this point, TypeScript knows value MUST be boolean (only option left)
  return String(value); // "true" or "false"
}
```

> [!NOTE]
> `typeof` can check for: `"string"`, `"number"`, `"boolean"`, `"bigint"`, `"symbol"`, `"undefined"`, `"object"`, and `"function"`. Note that `typeof null === "object"` (a JavaScript quirk!) — so always check for `null` separately.

### Type Guard 2: `instanceof`

`instanceof` is used for narrowing **class instances**:

```ts
class Dog {
  bark(): void {
    console.log("Woof!");
  }
}

class Cat {
  meow(): void {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    // TypeScript narrows 'animal' to 'Dog' here
    animal.bark(); // ✅ Safe — Dog has bark()
  } else {
    // TypeScript narrows 'animal' to 'Cat' here
    animal.meow(); // ✅ Safe — Cat has meow()
  }
}
```

### Type Guard 3: `in` Operator

The `in` operator checks whether a property exists on an object. This is useful for narrowing between different object types that share some properties:

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Rectangle;

function getArea(shape: Shape): number {
  // Check if 'radius' property exists to identify a Circle
  if ("radius" in shape) {
    // TypeScript narrows 'shape' to 'Circle' here
    return Math.PI * shape.radius ** 2;
  } else {
    // TypeScript narrows 'shape' to 'Rectangle' here
    return shape.width * shape.height;
  }
}
```

### Discriminated Unions — The Most Elegant Narrowing Pattern

A **discriminated union** is when each type in a union has a common property with a unique literal type. TypeScript can use this "discriminant" property to narrow automatically:

```ts
// Each shape has a 'kind' property with a unique literal value
interface Circle {
  kind: "circle";    // ← The discriminant
  radius: number;
}

interface Rectangle {
  kind: "rectangle"; // ← The discriminant
  width: number;
  height: number;
}

interface Triangle {
  kind: "triangle";  // ← The discriminant
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function describeShape(shape: Shape): string {
  // TypeScript narrows based on the 'kind' property
  switch (shape.kind) {
    case "circle":
      // Here TypeScript KNOWS shape is Circle — shape.radius is safe
      return `Circle with radius ${shape.radius}`;
    case "rectangle":
      // Here TypeScript KNOWS shape is Rectangle — shape.width is safe
      return `Rectangle ${shape.width}×${shape.height}`;
    case "triangle":
      // Here TypeScript KNOWS shape is Triangle — shape.base is safe
      return `Triangle with base ${shape.base} and height ${shape.height}`;
  }
}
```

> [!TIP]
> Discriminated unions are one of the most powerful patterns in TypeScript. Use them whenever you have a union of different object types — they make your code cleaner and give TypeScript maximum information for narrowing.

### Custom Type Guards (Type Predicates)

You can write your own type guard function using the `is` keyword in the return type:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// The return type "value is User" is a type predicate
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&          // Must be an object
    value !== null &&                      // Must not be null
    "id" in value &&                       // Must have 'id' property
    "name" in value &&                     // Must have 'name' property
    "email" in value                       // Must have 'email' property
  );
}

const data: unknown = JSON.parse('{"id":1,"name":"Alice","email":"a@a.com"}');

if (isUser(data)) {
  // Inside this block, TypeScript knows data is User
  console.log(data.name.toUpperCase()); // ✅ Safe!
  console.log(data.email);              // ✅ Safe!
}
```

### Section Recap

- Narrowing is how TypeScript refines a union type to a specific type
- `typeof` — narrows primitive types (`string`, `number`, `boolean`)
- `instanceof` — narrows class instances
- `in` — narrows based on property existence
- Discriminated unions — use a shared `kind` property for clean switch-based narrowing
- Custom type guards use `value is TypeName` return type syntax

---

## 12. Arrays & Tuples

### Typed Arrays

There are two equivalent syntaxes for typed arrays in TypeScript:

```ts
// Syntax 1: Type followed by []  ← Most common
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let flags: boolean[] = [true, false, true];

// Syntax 2: Generic Array<T> syntax (same result, different style)
let numbers2: Array<number> = [1, 2, 3, 4, 5];
let names2: Array<string> = ["Alice", "Bob", "Charlie"];
```

Both syntaxes are identical — choose one and be consistent. The `Type[]` form is more commonly seen in TypeScript codebases.

### Arrays Enforce Types on All Operations

```ts
const scores: number[] = [95, 87, 92];

scores.push(88);    // ✅ Pushing a number is fine
scores.push("A+"); // ❌ Error: Argument of type 'string' is not assignable to type 'number'.

// Array methods return the correct types too
const doubled = scores.map(score => score * 2);
// TypeScript infers: doubled is number[]

const first = scores[0];
// TypeScript infers: first is number (not 'number | undefined' unless strictNullChecks is extreme)
```

### Arrays of Objects

```ts
interface Product {
  id: number;
  name: string;
  price: number;
}

// An array where every element must be a Product
const products: Product[] = [
  { id: 1, name: "Widget", price: 9.99 },    // ✅
  { id: 2, name: "Gadget", price: 24.99 },   // ✅
  { id: 3, name: "Doohickey" },              // ❌ Error: missing 'price' property!
];
```

### Tuples — Fixed-Length, Fixed-Type Arrays

A **tuple** is an array with a fixed number of elements where each position has a known type.

Real-world analogy: A coordinate pair `(x, y)` — always exactly two numbers, first is x and second is y. You can't swap them or add a third value.

```ts
// Declare a tuple: position 0 is string, position 1 is number
let person: [string, number];

person = ["Alice", 30];  // ✅ String first, number second
person = [30, "Alice"];  // ❌ Error: Wrong order!
person = ["Alice", 30, "extra"]; // ❌ Error: Too many elements

// Access elements — TypeScript knows the type at each position
const name = person[0]; // TypeScript infers: name is string
const age = person[1];  // TypeScript infers: age is number

// Common use case: destructuring a tuple
const [personName, personAge] = person;
console.log(personName.toUpperCase()); // ✅ Safe — personName is string
console.log(personAge.toFixed(0));     // ✅ Safe — personAge is number
```

### Named Tuple Elements (TypeScript 4.0+)

You can give labels to tuple positions for better readability:

```ts
// Without labels — unclear what each position means
type Coordinate = [number, number];

// With labels — much clearer!
type NamedCoordinate = [x: number, y: number];
type UserEntry = [name: string, age: number, isActive: boolean];

const location: NamedCoordinate = [10, 20]; // ✅
const entry: UserEntry = ["Alice", 30, true]; // ✅
```

### When to Use Tuples vs Arrays

```
┌─────────────────────────────────────────────────────────────────────┐
│               TUPLE vs ARRAY: WHEN TO USE EACH                      │
│                                                                     │
│  Use an ARRAY when:                                                 │
│    • You have a variable number of items of the same type           │
│    • e.g., a list of user names, a list of scores                   │
│    • number[], string[], Product[]                                  │
│                                                                     │
│  Use a TUPLE when:                                                  │
│    • You have exactly N items with DIFFERENT types at each position │
│    • e.g., [x, y] coordinates, [status, data] return pairs          │
│    • The ORDER and COUNT of elements is meaningful                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Section Recap

- `Type[]` or `Array<Type>` — typed arrays (all elements must be the same type)
- TypeScript enforces types on push, map, filter, etc.
- Tuples use `[Type1, Type2]` syntax — fixed length, fixed type per position
- Named tuple elements add readability: `[x: number, y: number]`
- Use tuples for fixed structures; use arrays for variable-length lists

---

## 13. Enums

### What Is an Enum?

An **enum** (enumeration) is a way to define a set of named constants. Instead of scattering magic strings or numbers throughout your code, you give them meaningful names.

Real-world analogy: A traffic light has three possible states. Instead of representing them as the strings "red", "amber", "green" (which could be misspelled), or numbers 0, 1, 2 (which are cryptic), an enum lets you write `TrafficLight.Red`, `TrafficLight.Amber`, `TrafficLight.Green`.

### Numeric Enums (Default)

```ts
// TypeScript assigns numbers automatically: 0, 1, 2, ...
enum Direction {
  North,  // = 0
  South,  // = 1
  East,   // = 2
  West,   // = 3
}

// Usage
let currentDirection: Direction = Direction.North; // Value is 0

function move(dir: Direction): void {
  if (dir === Direction.North) {
    console.log("Moving north (value: 0)");
  }
}

move(Direction.North); // ✅
move(0);               // ✅ Also valid (0 corresponds to North)
move(99);              // TypeScript won't catch this — a weakness of numeric enums!
```

### String Enums (Preferred for Most Cases)

String enums are more explicit and avoid the "any number is valid" problem:

```ts
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
  Suspended = "SUSPENDED",
}

// Usage
let userStatus: Status = Status.Active; // Value is "ACTIVE"
console.log(userStatus); // Prints: "ACTIVE"

function updateStatus(userId: number, newStatus: Status): void {
  console.log(`User ${userId} status changed to: ${newStatus}`);
}

updateStatus(1, Status.Pending);    // ✅ Prints: "User 1 status changed to: PENDING"
updateStatus(1, "ACTIVE");          // ❌ Error: string is not assignable to Status
updateStatus(1, Status.Active);     // ✅ Correct way
```

### `const enum` — Zero-Cost Enums

A `const enum` is like a regular enum, but it is **completely erased at compile time**. Instead of generating an object in the JavaScript output, TypeScript inlines the values directly at each usage site.

```ts
// Regular enum — compiles to a JavaScript object:
enum Color { Red, Green, Blue }
// Compiled JS: var Color; (function (Color) { Color[Color["Red"] = 0] = "Red"; ... })(Color || (Color = {}));

// const enum — compiles to just the raw values:
const enum Color { Red = "RED", Green = "GREEN", Blue = "BLUE" }
// Where you write Color.Red in your code, TypeScript replaces it with "RED"
// No object is created at runtime — zero overhead!

const myColor = Color.Green; // Compiles to: const myColor = "GREEN";
```

> [!TIP]
> Use `const enum` when you want the safety and readability of enums with zero runtime overhead. The tradeoff is that the values are not accessible as an object at runtime.

### Enums vs. Literal Union Types

Modern TypeScript style often prefers **literal union types** over enums for simple cases:

```ts
// Enum approach
enum UserRole { Admin = "admin", Editor = "editor", Viewer = "viewer" }

// Literal union type approach (often preferred today)
type UserRole = "admin" | "editor" | "viewer";
```

| Feature | Enum | Literal Union |
|---|---|---|
| Compile output | JavaScript object | Nothing (erased) |
| IDE autocomplete | ✅ | ✅ |
| Refactoring | ✅ Good | ✅ Good |
| Runtime access | Can iterate values | Cannot iterate |
| Brevity | More verbose | More concise |
| TypeScript-only feature | Yes | Yes |

> [!NOTE]
> Both work well. Enums are preferable when you need to iterate over all possible values at runtime. Literal union types are preferable for simpler constraints.

### Section Recap

- Enums define named constants; numeric enums auto-assign 0, 1, 2, ...
- String enums are safer: `Status.Active = "ACTIVE"` prevents accidental number assignments
- `const enum` is erased at compile time — values are inlined for zero runtime cost
- Literal union types (`"admin" | "viewer"`) are a modern alternative to enums

---

## 14. Interfaces

### What Is an Interface?

An **interface** is a contract that describes the **shape of an object** — what properties it must have and what types those properties must be.

Real-world analogy: A job posting is an interface for the position. It says "this role requires a Bachelor's degree, 3 years of experience, and proficiency in Python." Any person who satisfies those requirements can fill the role. The interface doesn't create the person — it just defines what they must look like.

### Defining a Basic Interface

```ts
// Define an interface — describes what a User object must look like
interface User {
  id: number;         // Must have an 'id' property of type number
  firstName: string;  // Must have 'firstName' of type string
  lastName: string;   // Must have 'lastName' of type string
  email: string;      // Must have 'email' of type string
  age: number;        // Must have 'age' of type number
}

// Create an object that satisfies the User interface
const user1: User = {
  id: 1,
  firstName: "Alice",
  lastName: "Smith",
  email: "alice@example.com",
  age: 30,
};

// TypeScript will catch missing or extra properties:
const user2: User = {
  id: 2,
  firstName: "Bob",
  // ❌ Error: Missing 'lastName', 'email', and 'age'
};

const user3: User = {
  id: 3,
  firstName: "Charlie",
  lastName: "Brown",
  email: "charlie@example.com",
  age: 25,
  password: "secret", // ❌ Error: 'password' does not exist in type 'User'
};
```

### Optional Properties with `?`

Sometimes a property might or might not be present. Use `?` after the property name to make it optional:

```ts
interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio?: string;        // Optional: string | undefined (may or may not exist)
  avatarUrl?: string;  // Optional: string | undefined
  website?: string;    // Optional: string | undefined
}

// Both of these are valid:
const minimalProfile: UserProfile = {
  id: 1,
  username: "alice",
  email: "alice@example.com",
  // bio, avatarUrl, website are all optional — omitting them is fine
};

const fullProfile: UserProfile = {
  id: 2,
  username: "bob",
  email: "bob@example.com",
  bio: "Software developer and coffee enthusiast.",
  avatarUrl: "https://example.com/bob.jpg",
  website: "https://bob.dev",
};

// When accessing optional properties, you must handle the undefined case:
function displayBio(profile: UserProfile): void {
  // The ?. (optional chaining) safely handles the case where bio is undefined
  const bio = profile.bio ?? "No bio provided.";
  console.log(bio);
}
```

### Readonly Properties

Use `readonly` to mark properties that **cannot be modified after the object is created**:

```ts
interface Config {
  readonly apiUrl: string;      // Cannot be changed after creation
  readonly apiVersion: number;  // Cannot be changed after creation
  timeout: number;              // Can be changed
}

const config: Config = {
  apiUrl: "https://api.example.com",
  apiVersion: 2,
  timeout: 5000,
};

config.timeout = 10000;    // ✅ Fine — timeout is mutable
config.apiUrl = "https://other.com"; // ❌ Error: Cannot assign to 'apiUrl' because it is a read-only property.
config.apiVersion = 3;               // ❌ Error: same reason
```

> [!NOTE]
> `readonly` only prevents reassignment of the property itself. If the property holds an object or array, the contents of that object/array can still be mutated. For deep immutability, you need `as const` (covered in Section 17).

### Defining Method Signatures in Interfaces

Interfaces can also describe the methods an object must have:

```ts
interface Calculator {
  // Method signature: takes two numbers, returns a number
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number | never; // Might throw if dividing by zero
}

// An object that satisfies the Calculator interface
const basicCalculator: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
  },
};
```

### Extending Interfaces (Interface Inheritance)

Interfaces can **extend** other interfaces — inheriting all their properties and adding more:

```ts
// Base interface: properties every person has
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

// Employee extends Person — has all Person properties PLUS these
interface Employee extends Person {
  employeeId: string;
  department: string;
  salary: number;
  startDate: Date;
}

// Manager extends Employee — has all Employee (and Person) properties PLUS these
interface Manager extends Employee {
  teamSize: number;
  directReports: Employee[];
}

// A Manager must satisfy ALL three interfaces
const manager: Manager = {
  // From Person:
  id: 1,
  firstName: "Carol",
  lastName: "Jones",
  dateOfBirth: new Date("1985-03-15"),
  // From Employee:
  employeeId: "EMP-001",
  department: "Engineering",
  salary: 120000,
  startDate: new Date("2018-06-01"),
  // From Manager:
  teamSize: 8,
  directReports: [], // Array of Employee objects
};
```

### Extending Multiple Interfaces

An interface can extend multiple interfaces at once:

```ts
interface Serializable {
  toJSON(): string;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

// Combines both interfaces
interface AuditedRecord extends Serializable, Timestamped {
  recordId: string;
  recordType: string;
}
```

### Section Recap

- Interfaces describe the **shape** of objects — what properties and methods they must have
- `?` makes a property optional (it may be `undefined`)
- `readonly` prevents reassignment of a property after creation
- Interfaces can describe methods: `methodName(param: type): returnType`
- Interfaces can extend other interfaces with `extends`
- An interface can extend multiple interfaces: `interface C extends A, B { ... }`

---

## 15. Type Aliases: `type` vs `interface`

### What Is a Type Alias?

A **type alias** gives a name to any type — including primitives, unions, intersections, tuples, and more. Use the `type` keyword:

```ts
// Alias for a primitive type (less common but valid)
type UserId = number;
type Email = string;

// Alias for a union type (very common)
type Status = "active" | "inactive" | "pending";
type StringOrNumber = string | number;

// Alias for an object type (similar to interface)
type Point = {
  x: number;
  y: number;
};

// Alias for a tuple
type Coordinate = [latitude: number, longitude: number];

// Alias for a function type
type Callback = (event: string, data: unknown) => void;
```

### `type` vs `interface` — The Differences

Both can describe object shapes. Here's where they differ:

```ts
// Both of these define the same object shape:

interface UserInterface {
  id: number;
  name: string;
}

type UserType = {
  id: number;
  name: string;
};
```

**Key differences:**

| Feature | `interface` | `type` |
|---|---|---|
| Extending | `interface B extends A {}` | `type B = A & { extra: string }` |
| Implementing (class) | `class C implements A {}` | `class C implements A {}` (works too) |
| Declaration merging | ✅ Yes — can be declared twice and merged | ❌ No — duplicate causes error |
| Union types | ❌ Cannot represent unions | ✅ `type A = B \| C` |
| Intersection types | Use `extends` | ✅ `type A = B & C` |
| Mapped types | ❌ Cannot | ✅ Yes |
| Error messages | Usually clearer | Can be complex |

### Declaration Merging (interface Only)

```ts
// You can declare the same interface multiple times — they MERGE:
interface Window {
  customProp: string;
}
interface Window {
  anotherProp: number;
}
// Result: Window now has BOTH customProp and anotherProp
// This is how TypeScript definitions files extend built-in browser types!
```

### When to Use `type` vs `interface`

```
┌────────────────────────────────────────────────────────────────────────┐
│          type vs interface: QUICK DECISION GUIDE                       │
│                                                                        │
│  Use interface when:                                                   │
│  ✅ Defining the shape of objects (especially in public APIs)          │
│  ✅ Using class implements patterns                                     │
│  ✅ You want declaration merging (e.g., extending third-party types)   │
│  ✅ Defining method signatures for OOP-style code                      │
│                                                                        │
│  Use type when:                                                        │
│  ✅ Defining union types: type Status = "a" | "b"                     │
│  ✅ Defining intersection types: type AB = A & B                       │
│  ✅ Defining function types: type Handler = (e: Event) => void         │
│  ✅ Defining tuples: type Pair = [string, number]                      │
│  ✅ Creating complex mapped or conditional types                        │
└────────────────────────────────────────────────────────────────────────┘
```

> [!TIP]
> The TypeScript team's official guidance: use `interface` for object shapes and `type` for everything else. In practice, both work for object shapes — pick a convention and stick to it within a project.

### Section Recap

- `type` creates an alias for any type: primitives, unions, intersections, objects, functions
- `interface` defines object shapes and supports class implementation
- Interfaces support declaration merging; type aliases do not
- Use `interface` for object shapes, `type` for unions/intersections/functions

---

## 16. Intersection Types

### What Is an Intersection Type?

An **intersection type** combines multiple types into one. The resulting type must satisfy **ALL** of the combined types. Use `&` (ampersand) to create intersections.

Real-world analogy: A job candidate who is both a licensed doctor AND a certified pilot. They must meet ALL the requirements of both professions — not just one.

```ts
type Engineer = {
  skills: string[];
  yearsExperience: number;
};

type Manager = {
  teamSize: number;
  budget: number;
};

// TechLead must satisfy BOTH Engineer AND Manager
type TechLead = Engineer & Manager;

const lead: TechLead = {
  skills: ["TypeScript", "React", "Node.js"],  // From Engineer
  yearsExperience: 8,                           // From Engineer
  teamSize: 5,                                  // From Manager
  budget: 500000,                               // From Manager
};

// Missing any property from either type is an error:
const badLead: TechLead = {
  skills: ["TypeScript"],
  yearsExperience: 3,
  // ❌ Error: Missing 'teamSize' and 'budget' from Manager
};
```

### Intersection vs Inheritance

Intersection types with `type` are equivalent to interface extension with `interface`:

```ts
// These two are functionally identical:

// Using interface extension:
interface Vehicle { speed: number; fuel: string; }
interface Car extends Vehicle { doors: number; trunkSize: number; }

// Using type intersection:
type Vehicle = { speed: number; fuel: string; };
type Car = Vehicle & { doors: number; trunkSize: number; };
```

### Mixing Interfaces and Types in Intersections

Intersection types work with both `interface` and `type` — you can mix them:

```ts
interface HasId {
  id: number;
}

interface HasTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

type ProductData = {
  name: string;
  price: number;
  category: string;
};

// Combines all three: two interfaces and one type alias
type Product = HasId & HasTimestamp & ProductData;

const product: Product = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "Laptop",
  price: 999.99,
  category: "Electronics",
};
```

### Section Recap

- Intersection types (`A & B`) require a value to satisfy ALL combined types
- Use `&` operator: `type C = A & B`
- Equivalent to interface inheritance but works with type aliases
- Can mix `interface` and `type` in an intersection

---

## 17. Advanced Type Features

### `as const` — Freeze Your Literals

By default, when TypeScript sees an object or array literal, it infers broad types:

```ts
const config = {
  apiUrl: "https://api.example.com",  // TypeScript infers: string (could be any string)
  version: 2,                          // TypeScript infers: number (could be any number)
  retries: 3,                          // TypeScript infers: number
};

config.apiUrl = "https://other.com"; // ✅ TypeScript allows this — type is string!
```

Adding `as const` tells TypeScript to treat all values as **exact literal types** and **make everything readonly**:

```ts
const config = {
  apiUrl: "https://api.example.com",  // Now: "https://api.example.com" (exact literal)
  version: 2,                          // Now: 2 (not just number — exactly 2)
  retries: 3,                          // Now: 3 (not just number — exactly 3)
} as const;  // ← The magic

config.apiUrl = "https://other.com"; // ❌ Error: cannot assign to readonly property
config.version = 99;                  // ❌ Error: cannot assign to readonly property

// Also works with arrays:
const ALLOWED_ROLES = ["admin", "editor", "viewer"] as const;
// Type: readonly ["admin", "editor", "viewer"]
// TypeScript knows the EXACT elements, not just "string[]"
```

### The `satisfies` Operator (TypeScript 4.9+)

`satisfies` is a newer feature that checks a value against a type **without losing the specific inferred type**. This is useful when you want both validation AND precise types.

```ts
type ColorMap = {
  [key: string]: string | [number, number, number];  // Can be a hex string OR an RGB tuple
};

// With a type annotation — TypeScript widens the types:
const palette: ColorMap = {
  red: [255, 0, 0],         // TypeScript sees: string | [number, number, number]
  green: "#00ff00",         // TypeScript sees: string | [number, number, number]
};
palette.red;         // Type: string | [number, number, number] — too broad!
palette.red[0];      // ❌ Error: might be a string, strings don't have index 0

// With 'satisfies' — validated against the type, but KEEPS the specific inferred type:
const palette2 = {
  red: [255, 0, 0],         // TypeScript preserves: [number, number, number]
  green: "#00ff00",         // TypeScript preserves: string
} satisfies ColorMap;

palette2.red;        // Type: [number, number, number] — specific!
palette2.red[0];     // ✅ Works — TypeScript knows it's a tuple with numbers
palette2.green;      // Type: string — specific!
palette2.green.toUpperCase(); // ✅ Works — TypeScript knows it's a string
```

> [!NOTE]
> Use `satisfies` when you want to validate a value against a type but still keep the most specific inferred type for downstream usage. Use a regular type annotation when you want to enforce the type broadly.

### Section Recap

- `as const` freezes a value to its exact literal types and makes it `readonly`
- `as const` on arrays creates a `readonly` tuple of literal types
- `satisfies` validates against a type without losing specific inferred types (TS 4.9+)
- Use `satisfies` when you need both validation AND specific types

---

## 18. Index Signatures

### What Is an Index Signature?

An **index signature** allows you to define an object whose **keys are not known in advance** but all follow the same value type. It's for dynamic dictionaries or maps.

Real-world analogy: A phonebook where anyone can look up any name and get back a phone number. You don't know in advance what names are in the book, but you know every entry is a (name → phone number) pair.

```ts
// Syntax: { [keyName: keyType]: valueType }
// The key must be string or number

// A dictionary mapping string keys to number values
interface ScoreBoard {
  [playerName: string]: number; // Any string key maps to a number value
}

const scores: ScoreBoard = {};

// Add entries dynamically — any string key works
scores["Alice"] = 95;
scores["Bob"] = 87;
scores["Charlie"] = 92;

// Access by any string key
const aliceScore = scores["Alice"]; // Type: number
const unknownScore = scores["Dave"]; // Type: number (could be undefined at runtime!)

// TypeScript enforces the VALUE type:
scores["Eve"] = "A+"; // ❌ Error: string is not assignable to number
```

### Combining Index Signatures with Known Properties

You can have both fixed properties and an index signature, but the fixed property types must be compatible with the index signature value type:

```ts
interface UserSettings {
  // Known properties
  theme: "light" | "dark";    // Must be one of two strings
  language: string;            // Any string

  // Dynamic properties (any other key → string value)
  [key: string]: string;       // All values must be strings (including known ones)
}

const settings: UserSettings = {
  theme: "dark",               // ✅ "dark" is assignable to string
  language: "en-US",           // ✅ string
  fontSize: "16px",            // ✅ Extra key — matches index signature
  colorScheme: "solarized",    // ✅ Extra key — matches index signature
};
```

> [!WARNING]
> With index signatures, TypeScript assumes any key is valid, which means `obj["nonExistentKey"]` returns the value type (not `undefined`), even if the key doesn't actually exist at runtime. Use `Map<string, number>` or `Record<string, number>` for safer patterns with known-at-compile-time keys.

### The `Record<K, V>` Utility Type

`Record<K, V>` is TypeScript's built-in shorthand for `{ [key in K]: V }`. It creates an object type with specific key and value types:

```ts
// Record<string, number> is equivalent to { [key: string]: number }
const wordCount: Record<string, number> = {};
wordCount["hello"] = 5;
wordCount["world"] = 3;

// Record with a literal union of keys (very useful!):
type Status = "pending" | "active" | "inactive";

// Every Status key MUST have a label — no missing keys allowed
const statusLabels: Record<Status, string> = {
  pending: "Awaiting approval",
  active: "Currently active",
  inactive: "Deactivated",
  // ❌ Adding an unknown key here would error
  // ❌ Missing a key from Status would also error
};
```

### Section Recap

- Index signatures `{ [key: string]: ValueType }` describe objects with dynamic keys
- All keys must be `string` or `number`; all values must match the declared type
- `Record<K, V>` is a convenient shorthand utility type
- `Record<LiteralUnion, V>` is especially useful — enforces all keys are present

---

## Lab 1 — Convert JS to TypeScript

**Duration:** ~45 minutes  
**Goal:** Take an existing JavaScript file and fully type it with TypeScript

### Setup

1. Create a new directory for the lab:
   ```bash
   mkdir lab1-js-to-ts
   cd lab1-js-to-ts
   npm init -y
   npm install -D typescript
   npx tsc --init
   mkdir src
   ```

2. Edit `tsconfig.json` to set `"rootDir": "./src"` and `"outDir": "./dist"` and `"strict": true`.

### The Starting JavaScript File

Create `src/user-service.js` — then rename it to `src/user-service.ts` and type everything:

```js
// ORIGINAL JavaScript — No types
// Your job: convert this to TypeScript with proper types

const users = [];
let nextId = 1;

function createUser(name, email, role) {
  const user = {
    id: nextId++,
    name: name,
    email: email,
    role: role,
    createdAt: new Date(),
    isActive: true,
  };
  users.push(user);
  return user;
}

function getUserById(id) {
  return users.find(u => u.id === id);
}

function getUsersByRole(role) {
  return users.filter(u => u.role === role);
}

function deactivateUser(id) {
  const user = getUserById(id);
  if (user) {
    user.isActive = false;
    return true;
  }
  return false;
}

function getUserSummary(user) {
  return `${user.name} (${user.email}) — Role: ${user.role}, Active: ${user.isActive}`;
}
```

### Step-by-Step Conversion

**Step 1: Define the interface for a User**

```ts
// src/user-service.ts

// Step 1: Define the shape of a User object
interface User {
  id: number;               // Auto-incremented unique identifier
  name: string;             // Full name
  email: string;            // Email address
  role: "admin" | "editor" | "viewer"; // Limited to exactly these three values
  createdAt: Date;          // When the user was created
  isActive: boolean;        // Whether the user account is active
}
```

**Step 2: Type the data storage variables**

```ts
// Step 2: Type the module-level variables
const users: User[] = [];   // An array that can only hold User objects
let nextId: number = 1;     // A counter — must always be a number
```

**Step 3: Type the functions one by one**

```ts
// Step 3a: createUser — takes typed params, returns User
function createUser(
  name: string,
  email: string,
  role: "admin" | "editor" | "viewer"  // Only allow valid roles
): User {
  const user: User = {
    id: nextId++,
    name,          // ES6 shorthand for name: name
    email,
    role,
    createdAt: new Date(),
    isActive: true,
  };
  users.push(user);
  return user;
}

// Step 3b: getUserById — returns User or undefined (user might not exist)
function getUserById(id: number): User | undefined {
  return users.find(u => u.id === id);
  // Array.find() returns T | undefined — TypeScript infers this correctly
}

// Step 3c: getUsersByRole — returns an array of Users
function getUsersByRole(role: "admin" | "editor" | "viewer"): User[] {
  return users.filter(u => u.role === role);
  // Array.filter() returns T[] — TypeScript infers User[] correctly
}

// Step 3d: deactivateUser — returns boolean (success/failure)
function deactivateUser(id: number): boolean {
  const user = getUserById(id); // TypeScript infers: User | undefined
  if (user) {
    // Inside this if-block, TypeScript narrows 'user' to User (not undefined)
    user.isActive = false;
    return true;
  }
  return false;
}

// Step 3e: getUserSummary — takes a User, returns a string
function getUserSummary(user: User): string {
  return `${user.name} (${user.email}) — Role: ${user.role}, Active: ${user.isActive}`;
}
```

**Step 4: Test the typed service**

```ts
// Step 4: Verify the typing works
const alice = createUser("Alice Smith", "alice@example.com", "admin");
const bob = createUser("Bob Jones", "bob@example.com", "editor");

console.log(getUserSummary(alice));
// Output: "Alice Smith (alice@example.com) — Role: admin, Active: true"

const adminUsers = getUsersByRole("admin");
console.log(`Admin count: ${adminUsers.length}`);

const deactivated = deactivateUser(alice.id);
console.log(`Deactivation success: ${deactivated}`);

// TypeScript will catch these errors:
// createUser("Carol", "carol@example.com", "superuser"); // ❌ invalid role
// getUserById("1"); // ❌ string is not assignable to number
```

**Step 5: Compile and run**

```bash
# Compile TypeScript to JavaScript
npx tsc

# Run the compiled output
node dist/user-service.js
```

### Lab 1 Checklist

- [ ] Created `tsconfig.json` with `strict: true`
- [ ] Defined a `User` interface with all required properties
- [ ] All functions have typed parameters and return types
- [ ] `getUserById` returns `User | undefined` (not just `User`)
- [ ] Role is typed as a literal union, not a plain `string`
- [ ] Code compiles with zero errors (`npx tsc --noEmit`)

---

## Lab 2 — Typed API Interface Builder

**Duration:** ~45 minutes  
**Goal:** Model a real-world REST API response with TypeScript interfaces

### Background

Imagine you are calling a REST API for a blog application. The API returns complex JSON responses. Your job is to model this data with TypeScript interfaces so your entire application knows exactly what shape the data has.

### The Raw API Response (JSON)

This is what the API returns when you fetch a blog post:

```json
{
  "success": true,
  "data": {
    "post": {
      "id": 42,
      "title": "Getting Started with TypeScript",
      "slug": "getting-started-with-typescript",
      "content": "TypeScript is a superset of JavaScript...",
      "excerpt": "A beginner's guide to TypeScript.",
      "status": "published",
      "publishedAt": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-16T08:00:00Z",
      "viewCount": 1547,
      "readTimeMinutes": 8,
      "author": {
        "id": 5,
        "username": "alice_dev",
        "displayName": "Alice Dev",
        "avatarUrl": "https://cdn.example.com/avatars/alice.jpg",
        "bio": "TypeScript enthusiast and open-source contributor."
      },
      "categories": [
        { "id": 1, "name": "TypeScript", "slug": "typescript" },
        { "id": 2, "name": "Web Development", "slug": "web-development" }
      ],
      "tags": ["typescript", "javascript", "tutorial", "beginner"],
      "featuredImage": {
        "url": "https://cdn.example.com/images/ts-basics.jpg",
        "altText": "TypeScript logo on a blue background",
        "width": 1200,
        "height": 630
      },
      "seo": {
        "metaTitle": "Getting Started with TypeScript — Complete Guide",
        "metaDescription": "Learn TypeScript from scratch...",
        "canonicalUrl": "https://blog.example.com/getting-started-with-typescript"
      }
    }
  },
  "meta": {
    "requestId": "req-abc-123",
    "processingTimeMs": 45,
    "apiVersion": "v2"
  }
}
```

### Step-by-Step: Building the Type Interfaces

**Step 1: Start with the smallest, most independent types**

```ts
// src/types/blog.ts

// ── Primitive-derived types ────────────────────────────────────────────────

// Post can only be in one of these states
type PostStatus = "draft" | "published" | "archived" | "scheduled";

// ── Leaf-level interfaces (no nested custom types) ─────────────────────────

// The author of a post
interface Author {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;  // Optional — some authors may not have a bio
}

// A single category
interface Category {
  id: number;
  name: string;
  slug: string;
}

// The featured image
interface FeaturedImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

// SEO metadata for the post
interface SeoMeta {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}
```

**Step 2: Build the Post interface using the leaf types**

```ts
// ── Mid-level interface: the Post ─────────────────────────────────────────
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: PostStatus;           // Uses our PostStatus literal union
  publishedAt: string;          // ISO 8601 date string (from JSON, not a Date object)
  updatedAt: string;            // Same — JSON doesn't have Date objects
  viewCount: number;
  readTimeMinutes: number;
  author: Author;               // Nested Author object
  categories: Category[];       // Array of Category objects
  tags: string[];               // Array of simple strings
  featuredImage: FeaturedImage | null; // Might not have a featured image
  seo: SeoMeta;                 // Nested SEO metadata
}
```

**Step 3: Build the API wrapper interfaces**

```ts
// ── API response wrapper ───────────────────────────────────────────────────

// The 'data' field in the response
interface PostResponseData {
  post: BlogPost;
}

// Metadata about the API call itself
interface ApiMeta {
  requestId: string;
  processingTimeMs: number;
  apiVersion: string;
}

// The top-level API response shape
interface ApiResponse<T> {  // Generic — T is the data type
  success: boolean;
  data: T;
  meta: ApiMeta;
}

// Specific type alias for post responses
type PostApiResponse = ApiResponse<PostResponseData>;

// Error response shape (for when success: false)
interface ApiErrorResponse {
  success: false;           // Literal type — always false for errors
  error: {
    code: string;
    message: string;
    details?: string[];
  };
  meta: ApiMeta;
}
```

**Step 4: Write a typed function to consume the API**

```ts
// ── Function that fetches and uses the typed data ─────────────────────────

async function fetchBlogPost(slug: string): Promise<BlogPost> {
  const response = await fetch(`https://api.example.com/posts/${slug}`);

  // Parse the response as unknown — we don't know yet what came back
  const json: unknown = await response.json();

  // In a real app, you'd validate here with a library like Zod
  // For now, we assert the type (safe if you trust the API contract)
  const data = json as PostApiResponse;

  if (!data.success) {
    throw new Error("API returned an error");
  }

  return data.data.post; // TypeScript knows this is BlogPost ✅
}

// Using the fetched data — TypeScript knows every field's type
async function displayPost(slug: string): Promise<void> {
  const post = await fetchBlogPost(slug);

  // Full autocomplete and type safety on all these:
  console.log(post.title);              // string
  console.log(post.author.displayName); // string
  console.log(post.categories.length);  // number
  console.log(post.tags.join(", "));    // string (tags is string[])
  console.log(post.status);             // "draft" | "published" | "archived" | "scheduled"

  // If featuredImage exists (it might be null):
  if (post.featuredImage !== null) {
    // TypeScript narrows: featuredImage is FeaturedImage (not null) here
    console.log(post.featuredImage.url); // ✅ Safe
  }
}
```

### Lab 2 Checklist

- [ ] All nested objects have their own named interfaces
- [ ] `PostStatus` uses a literal union type (not a plain string)
- [ ] `featuredImage` is typed as `FeaturedImage | null` (nullable)
- [ ] `publishedAt` and `updatedAt` are `string` (JSON dates are strings)
- [ ] The API response uses a generic `ApiResponse<T>` wrapper
- [ ] `fetchBlogPost` has a proper return type `Promise<BlogPost>`
- [ ] All code compiles without errors

---

## Assignment: DataForge Project Part 1 — Initial Typings

**Due:** Next lecture  
**Difficulty:** Intermediate  
**Estimated Time:** 2–4 hours

### Project Context

DataForge is a data pipeline management application. Users can define data sources, create processing pipelines, run transformations on data, and view results. In Part 1, you will define all the TypeScript types that the application will use throughout the project.

### Requirements

---

**Requirement 1: Define a `DataSource` interface**

Create an interface representing a connection to an external data source.

A `DataSource` must have:
- `id`: a unique string identifier
- `name`: a display name string
- `type`: one of `"csv"`, `"json"`, `"api"`, `"database"`, `"stream"` (use a literal union)
- `connectionString`: a string (URL, file path, or database DSN)
- `credentials`: an optional object with `username` and `password` (both strings)
- `timeout`: optional number (milliseconds to wait before giving up)
- `isActive`: boolean

> [!TIP]
> **Hint:** The `credentials` property itself is optional (`?`), but if provided, both `username` and `password` are required within it. Use `credentials?: { username: string; password: string }` for this pattern.

---

**Requirement 2: Define a `TransformationStep` type**

A pipeline consists of steps. Define a discriminated union for transformation steps.

There are three step types:
- `FilterStep`: has `kind: "filter"`, a `field: string`, an `operator: "eq" | "ne" | "gt" | "lt" | "contains"`, and a `value: string | number`
- `MapStep`: has `kind: "map"`, a `fromField: string`, a `toField: string`, and an optional `transform: "uppercase" | "lowercase" | "trim" | "toNumber"`
- `AggregateStep`: has `kind: "aggregate"`, a `field: string`, and a `method: "sum" | "avg" | "count" | "min" | "max"`

Make `TransformationStep = FilterStep | MapStep | AggregateStep` (a union type using the three interfaces).

> [!TIP]
> **Hint:** Use the `kind` property as a discriminant so you can narrow the type in a `switch (step.kind)` statement.

---

**Requirement 3: Define a `Pipeline` interface**

A `Pipeline` connects a data source to a sequence of transformation steps.

A `Pipeline` must have:
- `id`: string
- `name`: string
- `description`: optional string
- `sourceId`: string (references a `DataSource.id`)
- `steps`: an array of `TransformationStep` (could be empty)
- `outputFormat`: one of `"csv"`, `"json"`, `"parquet"`, `"xlsx"`
- `status`: one of `"draft"`, `"active"`, `"paused"`, `"archived"`
- `createdAt`: Date
- `updatedAt`: Date
- `tags`: optional array of strings

---

**Requirement 4: Define a `RunResult` type**

When a pipeline runs, it produces a result.

Define `RunResult` as a **discriminated union** with two branches:
- `SuccessResult`: `status: "success"`, `rowsProcessed: number`, `durationMs: number`, `outputPath: string`, `warnings: string[]`
- `FailureResult`: `status: "failure"`, `errorCode: string`, `errorMessage: string`, `failedAtStep: number | null`, `durationMs: number`

> [!TIP]
> **Hint:** With this union, you can write `if (result.status === "success") { result.rowsProcessed }` and TypeScript will narrow correctly.

---

**Requirement 5: Create a `PipelineRun` interface**

Track individual pipeline executions.

A `PipelineRun` must have:
- `runId`: string
- `pipelineId`: string
- `triggeredBy`: `"manual"` | `"scheduled"` | `"api"`
- `startedAt`: Date
- `completedAt`: Date | null (null while still running)
- `result`: `RunResult | null` (null while still running)

---

**Requirement 6: Create a settings object with `as const`**

Define a `PIPELINE_DEFAULTS` constant using `as const` that stores default values for new pipelines:
- `outputFormat`: `"json"` (default output format)
- `maxRetries`: `3`
- `timeoutMs`: `30000`
- `batchSize`: `1000`

> [!TIP]
> **Hint:** Use `as const` so TypeScript knows the exact literal values, not just their general types. You should also try the `satisfies` operator: `} satisfies SomePipelineDefaults` to validate the shape while keeping the literal types.

---

**Requirement 7: Define an `ApiResponse<T>` generic interface**

Create a generic wrapper interface for all API calls in the application:
- `success`: boolean
- `data`: `T` (the generic payload — varies per endpoint)
- `errors`: optional array of `{ field: string; message: string }` objects
- `pagination`: optional object with `page: number`, `perPage: number`, `total: number`, `totalPages: number`
- `timestamp`: string (ISO 8601 date)

Create two type aliases:
- `PipelineListResponse = ApiResponse<Pipeline[]>`
- `PipelineDetailResponse = ApiResponse<{ pipeline: Pipeline; recentRuns: PipelineRun[] }>`

---

**Requirement 8: Create an index signature for a metrics store**

Define a `MetricsStore` interface that uses an index signature to map pipeline IDs (strings) to metric objects.

The metric object for each pipeline should contain:
- `totalRuns`: number
- `successRate`: number (0–1 as a decimal, e.g. 0.95 for 95%)
- `avgDurationMs`: number
- `lastRunAt`: Date | null

> [!TIP]
> **Hint:** Use `{ [pipelineId: string]: PipelineMetrics }` where `PipelineMetrics` is a separate interface you define first.

---

### Submission

- Create a `src/types/` folder in your DataForge project
- Put your types in logically organised files: `data-source.ts`, `pipeline.ts`, `run-result.ts`, `api.ts`, `metrics.ts`
- Create a `src/types/index.ts` that re-exports everything: `export * from './pipeline'; export * from './run-result';` etc.
- Run `npx tsc --noEmit` to verify zero type errors before submitting

---

## Key Takeaways

### The Big Picture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                  TYPESCRIPT FUNDAMENTALS — SUMMARY                       │
│                                                                          │
│  TypeScript = JavaScript + Static Type System                           │
│                                                                          │
│  TYPES                         MODELLING OBJECTS                        │
│  ├── Primitives                ├── interface (preferred for objects)    │
│  │   ├── string                ├── type alias (for unions, etc.)        │
│  │   ├── number                ├── extends (interface inheritance)      │
│  │   └── boolean               └── & intersection types                 │
│  ├── Special                                                             │
│  │   ├── any      (avoid!)     PATTERNS                                  │
│  │   ├── unknown  (safe any)   ├── Discriminated unions                  │
│  │   ├── void     (no return)  ├── Type guards (typeof/instanceof/in)   │
│  │   └── never    (unreachable)├── Narrowing                            │
│  ├── Unions: A | B             ├── as const (freeze literals)           │
│  ├── Literals: "a" | "b"       └── satisfies (validate + keep types)   │
│  ├── Arrays: T[]                                                         │
│  ├── Tuples: [T, U]            TOOLING                                   │
│  ├── Enums                     ├── npx tsc (compile)                    │
│  └── Index signatures          ├── npx tsc --watch (auto-compile)       │
│                                ├── npx tsc --noEmit (type-check only)   │
│                                ├── npx ts-node (run directly)           │
│                                └── tsconfig.json (configuration)        │
└──────────────────────────────────────────────────────────────────────────┘
```

### The Golden Rules

1. **Always use `strict: true`** in your tsconfig. The strictness is your safety net.
2. **Annotate function parameters.** TypeScript can't infer them — these are the most important annotations.
3. **Let TypeScript infer where it can.** Don't annotate things TypeScript already knows (like `const x = 5`).
4. **Avoid `any`.** If you find yourself reaching for `any`, use `unknown` and add a type guard instead.
5. **Model your data explicitly.** Before writing logic, write the interfaces that describe your data shapes.
6. **Use discriminated unions.** For unions of objects, always add a `kind` or `type` discriminant property.
7. **Compile in watch mode.** Keep `npx tsc --watch` running in a terminal during development.

---

## Resources

### Official Documentation

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/) — The authoritative reference
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — Start here for deep dives
- [TypeScript Playground](https://www.typescriptlang.org/play) — Experiment with TypeScript in the browser

### Tools

- [DefinitelyTyped (@types/)](https://definitelytyped.org/) — Type definitions for popular JavaScript libraries
- [ts-node](https://typestrong.org/ts-node/) — Run TypeScript directly in Node.js
- [Zod](https://zod.dev/) — Runtime validation that generates TypeScript types (great for API responses)

### Further Reading

- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) — Free online book by Basarat
- [Total TypeScript](https://www.totaltypescript.com/) — Advanced TypeScript patterns and exercises
- [TypeScript 4.9 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-9/) — The `satisfies` operator

---

## Common Mistakes & How to Avoid Them

| # | Mistake | Example of the Problem | How to Avoid It |
|---|---|---|---|
| 1 | Using `any` everywhere | `let data: any = fetchData()` | Use `unknown` and narrow with type guards; enable `noImplicitAny` |
| 2 | Not handling `undefined` from optional properties | `user.bio.toUpperCase()` — bio might be undefined | Check first: `if (user.bio) { user.bio.toUpperCase() }` or use `user.bio?.toUpperCase()` |
| 3 | Forgetting that `Array.find()` returns `T \| undefined` | `const user = users.find(...); user.name` — user might be undefined | Type the function return as `User \| undefined` and check before using |
| 4 | Using `interface` for union types | Trying to write `interface Status = "a" \| "b"` (syntax error) | Use `type Status = "a" \| "b"` for unions |
| 5 | Typing dates as `Date` when parsing JSON | `interface Post { createdAt: Date }` — JSON.parse gives you a string! | Type JSON date fields as `string`, then convert with `new Date(post.createdAt)` |
| 6 | Adding `as SomeType` (type assertion) to silence errors | `const user = (data as User).name` — bypasses type checking | Instead, write a proper type guard function to validate the shape |
| 7 | Not using `readonly` on data that shouldn't change | Config objects accidentally mutated | Add `readonly` to properties that shouldn't change after creation |
| 8 | Confusing `type` and `interface` syntax for extending | Trying `interface C = A & B` (wrong) | Use `interface C extends A, B {}` or `type C = A & B` |
| 9 | Forgetting to handle the `null` branch of nullable types | `if (result.featuredImage.url)` — image might be null | Use `if (result.featuredImage !== null) { result.featuredImage.url }` |
| 10 | Putting TypeScript in production | Deploying `.ts` files to production without compiling | Always compile with `tsc` first; deploy only the `.js` files in `dist/` |
| 11 | Not using `strict: true` | Missing many important checks like `strictNullChecks` | Always start with `"strict": true` in `tsconfig.json` |
| 12 | Using a numeric enum when a string enum is clearer | `enum Dir { North }` — value is 0, hard to debug | Use `enum Dir { North = "NORTH" }` for human-readable values |
| 13 | Expecting `typeof null === "null"` | `if (typeof x === "null")` — always false! | Check for null with `=== null` not with typeof; `typeof null === "object"` |
| 14 | Annotating return types inconsistently | Some functions have return type annotations, some don't | Pick a convention: annotate all public function return types |
| 15 | Not using `as const` for configuration objects | Config values inferred as `string` instead of literal `"dark"` | Add `as const` to config/lookup objects to preserve literal types |