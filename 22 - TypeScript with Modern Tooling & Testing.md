# Lecture 22 — TypeScript: Modern Tooling, ESLint Flat Config & Vitest

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 1. 🚦 Prerequisites
Before starting this lecture, you should:
- Understand basic TypeScript types, interfaces, and generics (from previous lectures).
- Be familiar with Node.js and npm package management.
- Know the basics of ES Modules (`import`/`export`).

---

## 2. 🎯 Objectives

By the end of this lecture, you will be able to:
- Choose the right TypeScript build tool for your use case: Vite, `tsc`, or `tsx`
- Set up and configure testing with **Vitest** (the modern, Vite-native alternative to Jest)
- Write unit tests for TypeScript functions using `describe`, `it`, and `expect`
- Lint TypeScript code using **ESLint 9 Flat Config** (`eslint.config.js`)
- Set up pre-commit hooks with Husky and lint-staged to block bad commits
- Use type narrowing: `typeof`, `instanceof`, type predicates, discriminated unions
- Write advanced mapped types and conditional types

---

## 3. 📋 Agenda
1. **TypeScript Build Pipeline** (Vite, `tsc`, `tsx`)
2. **Testing with Vitest** (Setup, Writing Tests, Mocking)
3. **Linting with ESLint 9** (Flat Config, Rules)
4. **Pre-Commit Hooks** (Husky, lint-staged)
5. **Type Narrowing** (`typeof`, `instanceof`, Type Predicates, Discriminated Unions)
6. **Advanced Types** (Mapped & Conditional Types)
7. **Labs & Practice**
8. **Interview Prep & Cheat Sheet**

---

## 4. 🧠 Deep Dive

### 4.1 TypeScript Build Pipeline

### Why Do You Need a Build Tool?

Browsers and Node.js don't understand TypeScript. You need a **build tool** to convert your `.ts` files into plain JavaScript that can actually run. Different tools exist for different use cases:

```
TypeScript Source (.ts)
        │
        ▼
┌───────────────────────────────────────────────────────┐
│                   Build Tool                          │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │   Vite   │  │     tsc      │  │      tsx        │ │
│  │(web apps)│  │(libs/backend)│  │(quick scripts)  │ │
│  └──────────┘  └──────────────┘  └─────────────────┘ │
└───────────────────────────────────────────────────────┘
        │
        ▼
JavaScript Output (.js) — runs in browser or Node.js
```

### Option 1: Vite with TypeScript — For Web Applications

**Vite** is the modern choice for building web applications. It uses **esbuild** under the hood, which is written in Go and is 10–100x faster than traditional TypeScript compilers for development.

**Key fact:** Vite transpiles TypeScript to JavaScript extremely fast but does **not** perform type checking. Run `tsc --noEmit` separately for type safety.

```bash
# Create a new Vite + TypeScript project (vanilla TypeScript, no framework)
npm create vite@latest my-app -- --template vanilla-ts

# Navigate into the project and install dependencies
cd my-app
npm install

# Start the development server with Hot Module Replacement (HMR)
npm run dev
```

**What happens when you run `npm run dev`:**
1. Vite starts a local server (usually at `http://localhost:5173`).
2. When you edit a `.ts` file, Vite instantly transpiles just that file.
3. The browser updates automatically — no full page reload needed (HMR).

### Option 2: `tsc` — The Official TypeScript Compiler

The TypeScript Compiler (`tsc`) is the official tool from Microsoft. Unlike Vite, it **does** perform full type checking and outputs clean JavaScript files.

```bash
# Compile all TypeScript files according to tsconfig.json
npx tsc

# Compile once and exit
npx tsc --project tsconfig.json

# Watch mode — recompiles automatically when any file changes
npx tsc --watch

# Type-check ONLY — no file output (great for CI/CD pipelines)
npx tsc --noEmit
```

**Key `tsconfig.json` settings to know:**

```json
{
  "compilerOptions": {
    "target": "ES2022",        // The JavaScript version to compile to
    "module": "ESNext",        // Module system (ESNext = modern ES modules)
    "moduleResolution": "Bundler", // How imports are resolved (use 'Bundler' for Vite/esbuild)
    "strict": true,            // Enable ALL strict type checks — always keep this on!
    "outDir": "./dist",        // Where compiled .js files go
    "rootDir": "./src",        // Where your TypeScript source files are
    "declaration": true,       // Generate .d.ts files (needed for libraries)
    "sourceMap": true          // Generate source maps for debugging
  },
  "include": ["src/**/*"],     // Which files to include
  "exclude": ["node_modules"]  // Which files to exclude
}
```

### Option 3: `tsx` — Execute TypeScript Directly in Node.js

`tsx` lets you run TypeScript files directly in Node.js without a separate compilation step. It's perfect for scripts, CLIs, and rapid prototyping.

```bash
# Install tsx globally (or use npx)
npm install -g tsx

# Run a TypeScript file directly — no compilation step needed!
npx tsx src/index.ts
npx tsx src/scripts/migrate-database.ts

# Watch mode — re-runs when the file changes
npx tsx watch src/index.ts
```

### Choosing the Right Tool

| Scenario | Tool to Use |
|----------|-------------|
| Building a web app (Angular, React, Vue) | **Vite** |
| Publishing a TypeScript library (npm package) | **tsc** |
| Node.js backend (Express, Fastify, NestJS) | **tsc** or **tsx** |
| Running a one-off script | **tsx** |
| CI/CD type checking | **tsc --noEmit** |

### Section Recap
- **Vite** is the fastest for web app development — great DX, hot reloading.
- **`tsc`** is the official compiler — performs full type checking, generates output files.
- **`tsx`** runs TypeScript directly in Node.js — great for scripts.
- Always run `tsc --noEmit` in CI/CD even if you're using Vite for development.

---

### 4.2 Testing TypeScript with Vitest

### Why Do We Write Tests?

**The analogy:** Imagine building a bridge. You could just build it and hope it holds. Or you could run a series of load tests on the individual components before assembly. Tests are those load tests — they prove each piece works correctly *before* users rely on it.

Tests also enable **fearless refactoring**: when you change existing code, tests immediately tell you if anything broke. Without tests, you have to test everything manually every time — which nobody does consistently.

### Why Vitest Instead of Jest?

For years, **Jest** was the standard testing framework for JavaScript. But Jest was built before ES modules were common, and it has awkward workarounds for them. **Vitest** is built from the ground up for modern ES modules and Vite projects:

| Feature | Jest | Vitest |
|---------|------|--------|
| ES Module support | Requires config hacks | Native |
| Speed | Moderate | Very fast (esbuild) |
| TypeScript support | Requires Babel/ts-jest | Native |
| Watch mode | Separate package | Built-in |
| API compatibility | — | Almost identical to Jest |

### Setting Up Vitest

**Step 1: Install the dependencies**
```bash
npm install --save-dev vitest typescript
```

**Step 2: Configure `vite.config.ts` or `vitest.config.ts`**
```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Enable Jest-compatible global functions (describe, it, expect) without imports
    globals: true,
    // Test environment — 'node' for backend, 'jsdom' for browser DOM simulation
    environment: 'node',
    // Include these file patterns as tests
    include: ['src/**/*.{test,spec}.{ts,js}'],
    // Code coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'], // 'text' for terminal, 'html' for browser report
    }
  }
});
```

**Step 3: Add scripts to `package.json`**
```json
{
  "scripts": {
    "test":          "vitest run",    // Run all tests once and exit
    "test:watch":    "vitest",        // Watch mode — re-run on file changes
    "test:coverage": "vitest run --coverage", // Run with coverage report
    "test:ui":       "vitest --ui"    // Open Vitest's browser-based UI
  }
}
```

### Writing Your First Tests

Let's start with the fundamentals. We'll test a simple math utility file:

```ts
// ═══════════════════════════════════════════
// FILE: src/utils/math.ts  (code being tested)
// ═══════════════════════════════════════════

// Calculate the area of a rectangle
export function area(width: number, height: number): number {
  if (width < 0 || height < 0) {
    throw new Error("Dimensions must be non-negative.");
  }
  return width * height;
}

// Check if a number is prime
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// Clamp a value between a min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
```

```ts
// ═══════════════════════════════════════════
// FILE: src/utils/math.test.ts  (the test file)
// ═══════════════════════════════════════════

// Import testing functions from Vitest
import { describe, it, expect, beforeEach } from 'vitest';
// Import the code we want to test
import { area, isPrime, clamp } from './math';

// 'describe' groups related tests together under a logical label
describe('area()', () => {

  // 'it' defines a single test case. 'it' reads naturally: "it adds two numbers"
  it('calculates the area of a rectangle', () => {
    // 'expect' + 'toBe' is the assertion — what we EXPECT the result to BE
    expect(area(5, 4)).toBe(20);      // 5 × 4 = 20 ✅
    expect(area(10, 0)).toBe(0);      // 10 × 0 = 0 ✅
    expect(area(3.5, 2)).toBe(7);     // 3.5 × 2 = 7 ✅
  });

  it('throws an error for negative dimensions', () => {
    // 'toThrow' checks that the function throws an error
    expect(() => area(-1, 5)).toThrow("Dimensions must be non-negative.");
    expect(() => area(5, -1)).toThrow("Dimensions must be non-negative.");
  });
});

describe('isPrime()', () => {
  it('correctly identifies prime numbers', () => {
    expect(isPrime(2)).toBe(true);   // 2 is prime
    expect(isPrime(7)).toBe(true);   // 7 is prime
    expect(isPrime(13)).toBe(true);  // 13 is prime
    expect(isPrime(97)).toBe(true);  // 97 is prime
  });

  it('correctly identifies non-prime numbers', () => {
    expect(isPrime(1)).toBe(false);  // 1 is not prime
    expect(isPrime(4)).toBe(false);  // 4 = 2 × 2
    expect(isPrime(9)).toBe(false);  // 9 = 3 × 3
    expect(isPrime(100)).toBe(false);
  });
});

describe('clamp()', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);   // 5 is between 0 and 10
    expect(clamp(0, 0, 10)).toBe(0);   // Edge: exactly at minimum
    expect(clamp(10, 0, 10)).toBe(10); // Edge: exactly at maximum
  });

  it('clamps to minimum when value is too low', () => {
    expect(clamp(-5, 0, 10)).toBe(0);  // -5 → clamped to 0
  });

  it('clamps to maximum when value is too high', () => {
    expect(clamp(999, 0, 100)).toBe(100); // 999 → clamped to 100
  });
});
```

### Common Vitest Assertions

```ts
// Value equality
expect(value).toBe(42);              // Exact equality (===), for primitives
expect(object).toEqual({ a: 1 });    // Deep equality for objects/arrays

// Truthiness
expect(value).toBeTruthy();          // Passes for any truthy value
expect(value).toBeFalsy();           // Passes for null, undefined, 0, "", false
expect(value).toBeNull();            // Strictly null
expect(value).toBeUndefined();       // Strictly undefined
expect(value).toBeDefined();         // Not undefined

// Numbers
expect(0.1 + 0.2).toBeCloseTo(0.3); // Floating point comparison (avoids precision issues!)
expect(10).toBeGreaterThan(5);
expect(5).toBeLessThanOrEqual(10);

// Strings
expect("hello world").toContain("world");
expect("test@email.com").toMatch(/^[\w.-]+@[\w.-]+\.\w+$/); // Regex match

// Arrays
expect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toHaveLength(3);
expect([1, 2, 3]).toEqual(expect.arrayContaining([3, 1])); // Order-independent

// Errors
expect(() => riskyFunction()).toThrow();
expect(() => riskyFunction()).toThrow(TypeError);
expect(() => riskyFunction()).toThrow("specific message");
```

### Test Setup and Teardown

```ts
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';

describe('UserRepository', () => {
  let repository: UserRepository;

  // Runs ONCE before all tests in this describe block
  beforeAll(() => {
    console.log("Setting up database connection...");
  });

  // Runs before EACH individual test
  beforeEach(() => {
    repository = new UserRepository(); // Fresh instance for each test
  });

  // Runs after EACH individual test — cleanup
  afterEach(() => {
    vi.clearAllMocks(); // Clear any mock/spy state between tests
  });

  // Runs ONCE after all tests — final cleanup
  afterAll(() => {
    console.log("Tearing down database connection...");
  });

  it('adds a user', () => {
    repository.add({ id: 1, name: "Alice" });
    expect(repository.getAll()).toHaveLength(1);
  });
});
```

### Mocking with Vitest

Mocking replaces real dependencies with fake versions, giving you control over what they return:

```ts
import { vi, expect, it, describe } from 'vitest';

// ──── Mock an entire module ────
vi.mock('./emailService', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true })
}));

// ──── Mock a single function using spyOn ────
import * as emailService from './emailService';

it('sends a welcome email on registration', async () => {
  // Spy on the function — intercept it and control its return value
  const sendEmailSpy = vi.spyOn(emailService, 'sendEmail')
    .mockResolvedValue({ success: true });

  const userService = new UserService();
  await userService.registerUser("alice@example.com");

  // Verify the spy was called with the right arguments
  expect(sendEmailSpy).toHaveBeenCalledOnce();
  expect(sendEmailSpy).toHaveBeenCalledWith(
    "alice@example.com",
    expect.stringContaining("Welcome")
  );
});
```

### Section Recap
- **Vitest** is the modern test runner for TypeScript — native ESM, fast, Jest-compatible API.
- Use `describe()` to group tests, `it()` for individual cases, `expect()` for assertions.
- `beforeEach()` / `afterEach()` run setup/teardown around each test.
- Use `vi.mock()` and `vi.spyOn()` to replace real dependencies with test doubles.

---

### 4.3 Linting — ESLint 9 Flat Config

### What Is a Linter?

A **linter** is a tool that automatically analyses your code for:
- **Bugs:** Things like using a variable before declaring it, or comparing with `==` instead of `===`.
- **Style issues:** Inconsistent formatting, unused variables, trailing spaces.
- **Bad practices:** Using `any` in TypeScript, calling `console.log` in production code.

**The analogy:** A linter is like spell-check and grammar-check for your code. It catches mistakes before you even run the program.

### ESLint 9 — The Flat Config System

In 2024, ESLint released version 9, which introduced the **Flat Config** system. This replaces the old `.eslintrc.json` / `.eslintrc.js` format with a single `eslint.config.js` file.

**Why "flat"?** Because the old system had a confusing inheritance chain (`.eslintrc` in multiple directories). The new flat config is a simple **array of configuration objects** — easy to understand and debug.

### Setup

**Step 1: Install ESLint and the TypeScript plugin**
```bash
npm install --save-dev eslint @eslint/js typescript-eslint
```

**Step 2: Create `eslint.config.js`**
```js
// eslint.config.js — Written in plain JavaScript (not JSON!)
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

// Export an array of configuration objects
export default tseslint.config(
  // ── Base configs ──
  eslint.configs.recommended,            // ESLint's core JS rules
  ...tseslint.configs.recommendedTypeChecked, // TypeScript-aware rules (requires tsconfig)

  // ── TypeScript-specific config ──
  {
    // Which files this config applies to
    files: ['**/*.{ts,tsx}'],

    // Language settings — tell ESLint about TypeScript's type system
    languageOptions: {
      parserOptions: {
        // Link ESLint to your tsconfig.json for type-aware linting
        project: true,
        tsconfigRootDir: import.meta.dirname, // Current directory
      },
    },

    // ── Custom rule overrides ──
    rules: {
      // Warn when 'any' is used — it defeats the purpose of TypeScript!
      '@typescript-eslint/no-explicit-any': 'warn',

      // Turn off requiring explicit return types on every function (can be verbose)
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Warn on console.log — often left in from debugging
      'no-console': 'warn',

      // Error on unused variables — keeps code clean
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Enforce using 'const' when a variable is never reassigned
      'prefer-const': 'error',
    }
  },

  // ── Ignore patterns ── (files ESLint should not check)
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js']
  }
);
```

### Running ESLint

```bash
# Check your code for issues
npx eslint src/

# Auto-fix what ESLint can fix automatically (formatting, simple rewrites)
npx eslint src/ --fix

# Check a single file
npx eslint src/utils/math.ts

# Output as JSON (useful for CI/CD pipelines)
npx eslint src/ --format json > eslint-report.json
```

**Add to `package.json` scripts:**
```json
{
  "scripts": {
    "lint":       "eslint src/",
    "lint:fix":   "eslint src/ --fix",
    "lint:check": "eslint src/ --max-warnings 0"
  }
}
```

### Understanding Common Rules

```ts
// ❌ @typescript-eslint/no-explicit-any
function process(data: any) {  // 'any' defeats TypeScript's purpose!
  return data.doSomething();
}

// ✅ Use a proper type or generic
function process<T extends { doSomething(): void }>(data: T): ReturnType<T["doSomething"]> {
  return data.doSomething();
}

// ❌ no-console (in production code)
console.log("Debug info"); // This is a development artifact

// ✅ Use a proper logging service
logger.debug("Debug info");

// ❌ @typescript-eslint/no-unused-vars
function calculate(a: number, b: number, unused: string): number {
  return a + b; // 'unused' is declared but never referenced!
}

// ✅ Remove it, or prefix with _ if intentionally unused
function calculate(a: number, b: number, _context?: string): number {
  return a + b; // Prefixed with '_' — ESLint knows this is intentionally unused
}
```

### Section Recap
- ESLint analyses code for bugs, style issues, and bad practices.
- ESLint 9 uses **Flat Config** (`eslint.config.js`) — a single JavaScript array of config objects.
- `typescript-eslint` extends ESLint with type-aware TypeScript rules.
- Run `npx eslint src/ --fix` to auto-fix many issues automatically.

---

### 4.4 Pre-Commit Hooks — Husky & lint-staged

### The Problem

A team can adopt ESLint and Vitest, but unless running them is *automatic*, developers will skip them under deadline pressure. Pre-commit hooks solve this by **blocking commits that don't pass quality checks**.

**The analogy:** Pre-commit hooks are like a security guard at the entrance to your repository. You can only commit code that has passed linting and testing — bad code can't get through.

### How Git Hooks Work

Git has built-in "hooks" — scripts that run at specific points in the Git workflow:
- `pre-commit` — runs before a commit is created
- `commit-msg` — runs when the commit message is saved
- `pre-push` — runs before pushing to a remote

**Husky** makes these hooks easy to configure and share with your team.

### Setup

**Step 1: Install Husky and lint-staged**
```bash
npm install --save-dev husky lint-staged
```

**Step 2: Initialize Husky**
```bash
npx husky init
# This creates a .husky/ directory with a pre-commit file
```

**Step 3: Configure the pre-commit hook**
```bash
# .husky/pre-commit
npx lint-staged
```

**Step 4: Configure lint-staged in `package.json`**

`lint-staged` only runs linters on the files that are **staged for the current commit** — not the entire project. This makes it much faster.

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "vitest run --passWithNoTests --reporter=verbose"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### The Workflow in Action

```
Developer runs: git commit -m "feat: add cart service"
                     │
                     ▼
              Husky intercepts
                     │
                     ▼
        lint-staged runs on STAGED files only
              │                  │
              ▼                  ▼
         ESLint --fix       Vitest run
              │                  │
       ┌──────┴──────┐   ┌───────┴───────┐
       │             │   │               │
    Issues?       Clean! Failures?     All Pass!
       │             │       │               │
       ▼             │       ▼               │
  Commit BLOCKED     │  Commit BLOCKED       │
  Fix your code!     └───────────────────────┘
                               │
                               ▼
                         Commit succeeds ✅
```

> [!WARNING]
> Don't use `--no-verify` to bypass hooks (`git commit --no-verify`). This defeats the purpose. If tests are failing, fix them — don't skip the checks.

---

### 4.5 Type Narrowing — Working with Union Types Safely

### What Is Type Narrowing?

When a value has a **union type** (e.g., `string | number`), TypeScript doesn't know which specific type it is at runtime. **Type narrowing** is the process of using checks (like `if` statements) to help TypeScript figure out the specific type.

**The analogy:** Imagine you receive a package. You don't know if it's a letter or a parcel. You open it to check — once you know it's a parcel, you handle it differently than a letter. TypeScript does the same: once you've checked the type, it "opens the package" and treats the value accordingly.

### Method 1: `typeof` Guard

The `typeof` operator works for primitive types (`string`, `number`, `boolean`, `undefined`, `function`):

```ts
// This function accepts either a string or a number
function formatValue(value: string | number): string {
  // TypeScript doesn't know which it is yet — both cases needed!

  if (typeof value === "string") {
    // ✅ Inside this block, TypeScript KNOWS value is a string
    return `Text: "${value.toUpperCase()}"`;
  }

  // ✅ Here, TypeScript KNOWS value is a number (it already handled the string case)
  return `Number: ${value.toFixed(2)}`;
}

console.log(formatValue("hello")); // "Text: "HELLO""
console.log(formatValue(3.14159)); // "Number: 3.14"
```

### Method 2: `instanceof` Guard

The `instanceof` operator works for **class instances**:

```ts
class NetworkError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function handleError(error: NetworkError | ValidationError): string {
  if (error instanceof NetworkError) {
    // TypeScript knows 'error' is NetworkError here — can access 'statusCode'
    return `Network error (${error.statusCode}): ${error.message}`;
  }
  // TypeScript knows 'error' is ValidationError here — can access 'field'
  return `Validation error on field '${error.field}': ${error.message}`;
}

const netError = new NetworkError(404, "Not Found");
const valError = new ValidationError("email", "Invalid email format");

console.log(handleError(netError)); // "Network error (404): Not Found"
console.log(handleError(valError)); // "Validation error on field 'email': ..."
```

### Method 3: Type Predicates — Custom Narrowing Functions

Sometimes you need to narrow a type that isn't based on `typeof` or `instanceof`. A **type predicate** (`value is SomeType`) is a function that returns a boolean but also tells TypeScript "if this returns true, the argument is this type":

```ts
interface Fish { species: string; swim(): void; }
interface Bird { species: string; fly():  void; }

// The 'animal is Fish' part is the TYPE PREDICATE
// It tells TypeScript: "if this function returns true, 'animal' is of type Fish"
function isFish(animal: Fish | Bird): animal is Fish {
  // We check for the existence of the 'swim' method — Fish have it, Birds don't
  return "swim" in animal;
}

function move(animal: Fish | Bird): void {
  if (isFish(animal)) {
    // ✅ TypeScript KNOWS it's a Fish inside this block!
    console.log(`${animal.species} is swimming`);
    animal.swim(); // No error — TypeScript knows Fish has swim()
  } else {
    // ✅ TypeScript KNOWS it's a Bird in the else block!
    console.log(`${animal.species} is flying`);
    animal.fly(); // No error — TypeScript knows Bird has fly()
  }
}
```

### Method 4: Discriminated Unions — The Most Important Pattern

A **discriminated union** is a union where each member has a **literal type** property (called the "discriminant") that uniquely identifies which member it is.

This is the most powerful and widely used narrowing pattern in TypeScript:

```ts
// ════════════════════════════════════════════════════════════
// Each interface has a 'kind' property with a UNIQUE literal value
// The 'kind' property is the discriminant
// ════════════════════════════════════════════════════════════
interface LoadingState {
  kind: "loading"; // Literal type — exactly this string, nothing else
}

interface SuccessState {
  kind: "success"; // Literal type
  data:  string[];
}

interface ErrorState {
  kind: "error";   // Literal type
  message: string;
  code:    number;
}

// The union of all three states
type FetchState = LoadingState | SuccessState | ErrorState;

// ════════════════════════════════════════════════════════════
// The switch statement narrows using the discriminant
// ════════════════════════════════════════════════════════════
function renderState(state: FetchState): string {
  switch (state.kind) {
    case "loading":
      // TypeScript knows: state is LoadingState here
      return "⏳ Loading...";

    case "success":
      // TypeScript knows: state is SuccessState here — .data is available!
      return `✅ Loaded ${state.data.length} items`;

    case "error":
      // TypeScript knows: state is ErrorState here — .message and .code are available!
      return `❌ Error ${state.code}: ${state.message}`;

    default:
      // TypeScript uses 'never' here — if all cases are handled, this is unreachable!
      const _exhaustive: never = state;
      throw new Error(`Unhandled state: ${JSON.stringify(_exhaustive)}`);
  }
}

// Usage
const loadingState: FetchState = { kind: "loading" };
const successState: FetchState = { kind: "success", data: ["item1", "item2"] };
const errorState:   FetchState = { kind: "error", message: "Not Found", code: 404 };

console.log(renderState(loadingState)); // "⏳ Loading..."
console.log(renderState(successState)); // "✅ Loaded 2 items"
console.log(renderState(errorState));   // "❌ Error 404: Not Found"
```

> [!IMPORTANT]
> **Discriminated unions** are the single most important TypeScript pattern for modelling complex data flows. Use them whenever a value can be in one of several distinct states (loading/success/error, pending/active/cancelled, etc.).

### The Exhaustive Check Pattern

The `never` type trick in the `default` case is called an **exhaustive check**. If you add a new state to the union but forget to handle it in the switch statement, TypeScript will give you a compile-time error:

```ts
// If you add OfflineState to FetchState but forget to handle it in the switch:
interface OfflineState { kind: "offline"; }
type FetchState = LoadingState | SuccessState | ErrorState | OfflineState;

// In the switch:
// default:
//   const _exhaustive: never = state; // ❌ Error: 'OfflineState' is not assignable to 'never'
// TypeScript forces you to handle the new case!
```

---

### 4.6 Advanced Types: Mapped & Conditional Types

### Mapped Types — Transforming Properties

A **mapped type** creates a new type by iterating over the properties of an existing type. Think of it as a `map()` function for types.

```ts
// Basic syntax: [K in keyof T] iterates over each key in T
type Nullable<T> = {
  [K in keyof T]: T[K] | null;  // Make every property nullable
};

interface User {
  id:    number;
  name:  string;
  email: string;
}

type NullableUser = Nullable<User>;
// Result: { id: number | null; name: string | null; email: string | null; }

// You can also make properties readonly
type ReadonlyUser = {
  readonly [K in keyof User]: User[K]; // Same as Readonly<User>
};

// Or make them optional
type OptionalUser = {
  [K in keyof User]?: User[K]; // Same as Partial<User>
};
```

**A practical mapped type — `Getters<T>`:**

```ts
// Create a type with a getter method for each property
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person { name: string; age: number; }

type PersonGetters = Getters<Person>;
// Result:
// {
//   getName: () => string;
//   getAge:  () => number;
// }
```

### Conditional Types — Type-Level If/Else

A **conditional type** works exactly like a ternary expression, but at the type level:

```
T extends U ? TrueType : FalseType
```

"If T is assignable to U, use TrueType; otherwise, use FalseType."

```ts
// Is T a string? → returns true, else false
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
type C = IsString<"hello">; // true (string literal extends string)

// More practical: extract the element type from an array
type UnpackArray<T> = T extends Array<infer Item> ? Item : T;

type A2 = UnpackArray<string[]>;  // string
type B2 = UnpackArray<number[]>;  // number
type C2 = UnpackArray<string>;    // string (not an array, returns T unchanged)

// Get the return type of a function
type ReturnTypeOf<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never;

function fetchUser(): Promise<User> { return Promise.resolve({ id: 1, name: "Alice", email: "" }); }

type FetchResult = ReturnTypeOf<typeof fetchUser>; // Promise<User>
```

> [!NOTE]
> TypeScript includes `ReturnType<T>`, `Parameters<T>`, `Awaited<T>`, and many more conditional utility types built-in. Study them in the [TypeScript Utility Types documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html).

### Section Recap
- **Mapped types** transform properties of existing types — great for generating derivative types.
- **Conditional types** provide type-level if/else logic (`T extends U ? X : Y`).
- The `infer` keyword extracts a type from within another type.

---

## 5. 💡 Think Like a Dev
When setting up tooling for a new project, professional developers prioritize **automation over discipline**. 
- A developer doesn't just say "I will run my tests before pushing code." Instead, they configure Git hooks to **force** tests to run before a commit. 
- A developer doesn't argue about code style during a PR review. They configure ESLint and Prettier so code style is standardized automatically.
Tooling exists to remove cognitive load so you can focus on building features instead of formatting syntax or manually catching typos.

---

## 6. 🔄 Before / After

### Before (Manual Testing & Loose Typing)
```ts
// Developer just hopes it works, leaves 'any', and manually tests in browser
function calculateDiscount(user: any, cart: any) {
  if (user.isPremium) return cart.total * 0.9;
  return cart.total;
}
console.log("discount works"); // debugging leftover
```

### After (Strong Typing, Automated Linting & Testing)
```ts
// Strong types, linted automatically, tested with Vitest
interface Cart { total: number; }
interface User { kind: "premium" | "standard"; }

export function calculateDiscount(user: User, cart: Cart): number {
  if (user.kind === "premium") return cart.total * 0.9;
  return cart.total;
}
// Vitest Test:
// expect(calculateDiscount({kind: "premium"}, {total: 100})).toBe(90);
```

---

## 7. ⚠️ Common Mistakes
1. **Using `--no-verify` on Git Commits:** Skipping hooks defeats their purpose. Always fix broken tests instead of skipping them.
2. **Mixing `jest` and `vitest` globals:** Make sure you don't accidentally import `jest` methods when running Vitest.
3. **Overusing `any`:** Disabling ESLint's `no-explicit-any` rule instead of taking the time to define proper types.
4. **Not returning exhaustive checks:** Forgetting the `default` case with `never` in discriminated union switches.

---

## 8. 🧪 Labs

### Lab 1: Vitest Testing Suite (45 min)

1. Open `labs/lab1-vitest/`. The project contains a `UrlParser` class.
2. Initialize Vitest: `npm install -D vitest` and add a `"test": "vitest run"` script.
3. Create `src/url-parser.test.ts` and write tests for:
   - Parsing a valid HTTP URL → `{ protocol: "http", domain: "example.com", path: "/" }`
   - Parsing a valid HTTPS URL
   - Passing an invalid URL → should throw an `Error`
   - Parsing a URL with query parameters
4. Run `npm test` and ensure all tests pass (green checkmarks!).

### Lab 2: ESLint Flat Config (40 min)

1. Open `labs/lab2-eslint/`. The project has deliberate linting errors.
2. Install: `npm install -D eslint @eslint/js typescript-eslint`
3. Create `eslint.config.js` using the flat config array format.
4. Enable `@typescript-eslint/no-explicit-any` as an **error** (not just a warning).
5. Run `npx eslint src/` — you should see the issues reported.
6. Fix the issues in `main.ts` to pass linting.

---

## 📝 Assignment: DataForge Project — Part 4

We need to make sure DataForge is stable before moving to Angular! Let's add modern tooling.

### Requirements
1. Open your DataForge project from Part 3.
2. **Install Vitest** and write unit tests for your Generic `Repository<T>` class:
   - Test that `add()` stores an item.
   - Test that `getById()` finds the correct item, or returns `undefined` for a missing ID.
   - Test that `getAll()` returns all stored items.
   - Test that `update()` correctly merges changes.
   - Test that `delete()` removes an item.
3. **Install ESLint 9** and create an `eslint.config.js` using the Flat Config system.
   - Enable `@typescript-eslint/no-explicit-any` as an error.
   - Enable `no-console` as a warning.
4. Run `npx eslint src/` and ensure your DataForge code has **0 errors**.
5. Fix any warnings or refactor `console.log` calls to use a simple `logger` utility.
6. **Bonus:** Set up Husky and `lint-staged` so that ESLint and Vitest run automatically on every commit.

---

## 9. 💼 Interview Prep
**Q: Why use Vite over Webpack or `tsc` for frontend development?**
A: Vite uses esbuild (written in Go) to transpile code extremely fast and offers near-instant Hot Module Replacement (HMR) because it serves files over native ES modules, whereas traditional bundlers rebuild the entire bundle.

**Q: Explain the difference between `interface` and `type` in TypeScript.**
A: Both can define object shapes. `interface` is better for declaration merging and defining class contracts. `type` is required for defining unions, intersections, and mapped types.

**Q: What is a discriminated union?**
A: A discriminated union is a pattern where multiple types share a common literal property (the "discriminant"). A `switch` statement on that property allows TypeScript to narrow down the exact type securely.

**Q: What are pre-commit hooks?**
A: Scripts that run automatically before a `git commit` completes. They are used to enforce code formatting and pass tests, preventing broken code from entering the repository.

---

## 10. 📝 Cheat Sheet

### Vitest Commands
- `vitest run` — Run once.
- `vitest` — Run in watch mode.
- `vitest run --coverage` — Run with code coverage.

### ESLint Flat Config (`eslint.config.js`)
```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  { rules: { '@typescript-eslint/no-explicit-any': 'error' } }
);
```

### Type Narrowing Snippets
- **typeof:** `if (typeof val === "string")`
- **instanceof:** `if (err instanceof Error)`
- **Predicate:** `function isString(val: any): val is string`
- **Discriminated Union:** `switch (state.kind) { case "loading": ... }`

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Vitest Documentation | https://vitest.dev/ |
| ESLint Flat Config | https://eslint.org/docs/latest/use/configure/configuration-files |
| typescript-eslint | https://typescript-eslint.io/ |
| Husky | https://typicode.github.io/husky/ |
| TypeScript Handbook — Narrowing | https://www.typescriptlang.org/docs/handbook/2/narrowing.html |

---

## 11. 📌 Key Takeaways

- Use **Vite** for web apps, **`tsc`** for libraries/backends, and **`tsx`** for quick scripts.
- **Vitest** is the modern alternative to Jest — native ESM, fast, and Jest-compatible API.
- **ESLint 9** uses the new Flat Config system (`eslint.config.js`) — a simple JavaScript array.
- **Husky** + **lint-staged** enforce quality gates automatically before every commit.
- **Type narrowing** (`typeof`, `instanceof`, type predicates) lets you work with union types safely.
- **Discriminated unions** are the #1 TypeScript pattern for modelling state — use them everywhere.
- **Mapped types** transform properties; **conditional types** provide type-level logic.

---

**Next Lecture:** [Lecture 23 — Angular Architecture & First Application](./23%20-%20Angular%20Architecture%20&%20First%20Application.md) — Module 5 begins!
