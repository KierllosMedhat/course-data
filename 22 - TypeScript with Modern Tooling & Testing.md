# Lecture 22 — TypeScript: Modern Tooling, ESLint Flat Config & Vitest

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Choose the right TypeScript build tool: Vite, `tsc`, or `tsx`
- Set up and configure testing with **Vitest** (the modern alternative to Jest)
- Write unit tests for TypeScript functions and type-check with `expect-type`
- Lint TypeScript code using **ESLint 9 Flat Config** (`eslint.config.js`)
- Set up pre-commit hooks with Husky and lint-staged
- Use type narrowing: `typeof`, `instanceof`, type predicates, discriminated unions
- Write advanced mapped types and conditional types

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Build pipeline: Vite with TypeScript, `tsc`, `tsx`
2. Testing: Vitest & Type Testing
3. Linting: ESLint 9 Flat Config (`eslint.config.js`)
4. Pre-commit hooks: Husky & lint-staged
5. Type narrowing: `typeof`, `instanceof`, type predicates, discriminated unions
6. Advanced types: mapped types and conditional types

### Part 2 — Practice & Lab (~90–120 min)
1. Set up a Vitest testing suite
2. Configure ESLint 9 Flat Config for a TypeScript project
3. DataForge Project Part 4: Testing & Tooling

---

## 1. TypeScript Build Pipeline

There are several ways to compile and run TypeScript:

### 1. Vite with TypeScript
Vite uses **esbuild** for lightning-fast TypeScript transpilation during development. This is what we use for our web applications.

```bash
npm create vite@latest my-app -- --template vanilla-ts
```

### 2. `tsc` — The TypeScript Compiler
Best for libraries or Node.js backends.

```bash
npx tsc              # Compile once
npx tsc --watch      # Recompile on every change
```

### 3. `tsx` — Modern Execution
Execute TypeScript directly in Node. Fast, ESM-friendly, zero-config.

```bash
npx tsx src/index.ts
```

---

## 2. Testing TypeScript with Vitest

For years, Jest was the standard. But in modern Vite-based projects, **Vitest** is the standard. It is incredibly fast and works natively with ES Modules.

### Setup

```bash
npm install -D vitest typescript
```

Add a script in `package.json`:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

### Writing Tests

Vitest uses an API almost identical to Jest.

```ts
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// math.test.ts
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('math module', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

---

## 3. Linting: ESLint 9 Flat Config

ESLint analyses code for potential errors and enforces consistent style. In 2024+, ESLint shifted from `.eslintrc` to a new format called **Flat Config**.

### Setup

```bash
npm install -D eslint @eslint/js typescript-eslint
```

### `eslint.config.js` (Flat Config)

Instead of a JSON file, the Flat Config is an array of configuration objects written in JavaScript.

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'warn'
    }
  }
);
```

### Running

```bash
npx eslint src/              # Check for issues
npx eslint src/ --fix         # Auto-fix what it can
```

---

## 4. Pre-Commit Hooks — Husky & lint-staged

Automatically lint and test before every `git commit` so bad code never reaches the repository!

### Setup

```bash
npm install --save-dev husky lint-staged
npx husky init
```

### `package.json`

```json
{
  "lint-staged": {
    "*.ts": ["eslint --fix", "vitest run --passWithNoTests"]
  }
}
```

### `.husky/pre-commit`

```bash
npx lint-staged
```

Now, every time you run `git commit`, Husky triggers lint-staged, which runs ESLint and Vitest on your changed files. If they fail, the commit is blocked!

---

## 5. Type Narrowing

TypeScript needs help to determine a more specific type inside conditional branches:

### 1. `typeof` Guard

```ts
function format(value: string | number): string {
  if (typeof value === "string") return value.toUpperCase();
  return value.toFixed(2);
}
```

### 2. Type Predicates (`is`)

Custom narrowing functions that tell TypeScript the result of a check:

```ts
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}
```

### 3. Discriminated Unions — The Most Important Pattern

A union where each member has a **literal type discriminant** property:

```ts
interface Success { kind: "success"; data: string; }
interface Failure { kind: "error"; message: string; }

type RequestState = Success | Failure;

function render(state: RequestState): string {
  switch (state.kind) {
    case "success": return state.data;        // Narrowed to Success
    case "error":   return state.message;     // Narrowed to Failure
  }
}
```

> [!IMPORTANT]
> **Discriminated unions** are the single most important TypeScript pattern for modelling complex data flows. 

---

## 6. Advanced Types: Mapped & Conditional

### Mapped Types
Transform properties of an existing type.

```ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
```

### Conditional Types
Type-level If/Else.

```ts
// T extends U ? X : Y
type IsString<T> = T extends string ? true : false;
```

---

## 🧪 Practice Labs

### Lab 1: Vitest Testing Suite (45 min)
1. Open `labs/lab1-vitest/`.
2. Initialize Vitest in the project.
3. Write a suite of tests for the provided `UrlParser` class. Test that it handles HTTP, HTTPS, and errors properly.
4. Run `npx vitest run` and see the green checks!

### Lab 2: ESLint Flat Config (40 min)
1. Open `labs/lab2-eslint/`.
2. Install `eslint` and `typescript-eslint`.
3. Create an `eslint.config.js` file and configure it using the modern flat config array.
4. Enable the `@typescript-eslint/no-explicit-any` rule as an error.
5. Run the linter and fix the deliberate errors in `main.ts`.

---

## 📝 Assignment: DataForge Project — Part 4

We need to make sure DataForge is stable before moving to Angular! Let's add modern tooling.

### Requirements
1. Open your DataForge project.
2. Install **Vitest**.
3. Write unit tests for your Generic `Repository<T>` class (from Part 2) to ensure `add()`, `getById()`, and `getAll()` work perfectly.
4. Install **ESLint 9** and create an `eslint.config.js` file using the Flat Config system. 
5. Run the linter and ensure your DataForge code has 0 warnings and 0 errors!
6. **Bonus:** Set up Husky and `lint-staged`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Vitest Documentation | https://vitest.dev/ |
| ESLint Flat Config | https://eslint.org/docs/latest/use/configure/configuration-files |
| typescript-eslint | https://typescript-eslint.io/ |

---

## 📌 Key Takeaways
- **Vitest** is the modern alternative to Jest, specifically designed for ESM and Vite projects.
- **ESLint 9** uses the new Flat Config system (`eslint.config.js`), moving away from JSON-based configuration.
- **Husky** prevents bad code from entering your Git repository.
- **Type narrowing** and **Discriminated unions** make working with complex, dynamic data type-safe.

---

**Next Lecture:** [Lecture 23 — Angular Architecture & First Application](./23%20-%20Angular%20Architecture%20%26%20First%20Application.md) — Module 5 begins!
