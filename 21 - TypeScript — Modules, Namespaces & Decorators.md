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
- Use modern TC39 Class, Method, and Field decorators
- Configure `tsconfig.json` path mapping for clean imports

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. ES Modules in TypeScript: `import`/`export`, type-only imports, barrel files
2. Namespaces: internal modules, legacy usage
3. Declaration files (`.d.ts`) and DefinitelyTyped (`@types`)
4. Modern TC39 Decorators (TS 5.0+)
5. Class, Method, and Field Decorators
6. `tsconfig.json` path mapping (`paths` and `baseUrl`)

### Part 2 — Practice & Lab (~90–120 min)
1. Organise a project with barrel exports and path mapping
2. Write declaration files for untyped JavaScript
3. DataForge Project Part 3: Validation Decorators

---

## 1. ES Modules in TypeScript

TypeScript uses standard ES module syntax, plus **type-only imports** for better tree-shaking:

### Type-Only Imports
Type-only imports guarantee the import is removed from compiled JavaScript, reducing bundle size:

```ts
// Only import the type — never included in the JS output
import type { User } from './user';
```

---

## 2. Barrel Files — Clean Import Paths

A **barrel file** is an `index.ts` that re-exports everything from a folder, creating a single clean import path:

### Folder Structure
```
models/
  user.ts
  product.ts
  index.ts        ← barrel file
```

### `models/index.ts` (Barrel File)
```ts
export * from './user';
export * from './product';
```

### Usage — One Clean Import
```ts
// ❌ Without barrel
import { User } from './models/user';
import { Product } from './models/product';

// ✅ With barrel
import { User, Product } from './models';
```

---

## 3. Namespaces (Legacy)

Namespaces are TypeScript's **older** mechanism for organising code. They're mostly replaced by ES modules, but you'll encounter them in legacy codebases:

```ts
namespace Utils {
  export function log(msg: string): void {
    console.log(`[LOG] ${msg}`);
  }
}
Utils.log("hello");
```

> [!NOTE]
> For all **new** projects, use ES modules.

---

## 4. Declaration Files (`.d.ts`)

Declaration files provide **type information** for JavaScript code that has no TypeScript source.

### DefinitelyTyped
Most popular JavaScript libraries have community-maintained type definitions:

```bash
npm install --save-dev @types/lodash
```

---

## 5. Modern TC39 Decorators (TS 5.0+)

**What is a decorator?** A special function that can modify or annotate classes, methods, properties, and parameters. They are heavily used in modern frameworks.

In TypeScript 5.0, the language adopted the official ECMAScript (TC39) standard for decorators. You **no longer need** `"experimentalDecorators": true` in your `tsconfig.json`!

### Class Decorators
A class decorator is applied to the constructor of the class and can be used to observe, modify, or replace a class definition.

```ts
function LogClass(value: any, context: ClassDecoratorContext) {
  console.log(`Class ${context.name} was declared!`);
}

@LogClass
class User {
  constructor(public name: string) {}
}
```

### Method Decorators
Method decorators can be used to wrap a method with additional logic (like logging or timing execution).

```ts
function LogMethod(originalMethod: any, context: ClassMethodDecoratorContext) {
  return function (...args: any[]) {
    console.log(`Calling ${String(context.name)} with`, args);
    const result = originalMethod.apply(this, args);
    return result;
  };
}

class Calculator {
  @LogMethod
  add(a: number, b: number) {
    return a + b;
  }
}
```

### Field (Property) Decorators
Field decorators can intercept how a property is initialized.

```ts
function LogField(value: undefined, context: ClassFieldDecoratorContext) {
  return function (initialValue: any) {
    console.log(`Initializing ${String(context.name)} with ${initialValue}`);
    return initialValue;
  };
}

class Person {
  @LogField
  age: number = 25;
}
```

---

## 6. Path Mapping — Clean Imports

Replace deep relative imports (`../../../services/user.service`) with clean aliases:

### `tsconfig.json` Configuration
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@models/*":     ["models/*"],
      "@services/*":   ["services/*"]
    }
  }
}
```

### Usage
```ts
// ❌ Without path mapping
import { User } from '../../../models/user';

// ✅ With path mapping
import { User } from '@models/user';
```

---

## 🧪 Practice Labs

### Lab 1: Barrel Files & Path Mapping (30 min)
1. Open `labs/lab1-barrels/`.
2. Configure `paths` in your `tsconfig.json`.
3. Create an `index.ts` file in the `models` directory to re-export `User` and `Dataset`.
4. Update imports in `main.ts` to use `@models`.

### Lab 2: TC39 Method Decorator (40 min)
1. Open `labs/lab2-decorators/`.
2. Write a `@Timing` decorator that uses `console.time()` and `console.timeEnd()` to measure how long a method takes to execute.
3. Apply it to a fake slow method.

---

## 📝 Assignment: DataForge Project — Part 3

Now we will use modern TC39 decorators to add validation to our DataForge models.

### Requirements
1. Open your DataForge project.
2. In your `src/models/User.ts`, create a field decorator `@Required`.
3. The `@Required` decorator should intercept the field and ensure that if anyone tries to set it to an empty string, it throws an Error.
   *(Hint: You will need to use auto-accessors (`accessor`) so your decorator can intercept the `get` and `set` operations!)*
4. Apply the `@Required` decorator to the `name` property of your `User` model.
5. Create a `main.ts` and test that instantiating a `User` with an empty name string throws an error.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| TypeScript 5.0 Release Notes (TC39 Decorators) | https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators |
| TypeScript Handbook - Modules | https://www.typescriptlang.org/docs/handbook/modules.html |

---

## 📌 Key Takeaways
- **ES modules** + **barrel files** keep imports clean and projects organized.
- **TC39 Decorators** (TS 5.0+) are standard JavaScript decorators and do not require the `experimentalDecorators` flag.
- **Method decorators** are great for adding reusable logic like logging, timing, and caching.
- **Path mapping** cleans up messy relative paths, but requires bundler configuration if not using a tool like Vite.

---

**Next Lecture:** [Lecture 22 — TypeScript with Modern Tooling & Testing](./22%20-%20TypeScript%20with%20Modern%20Tooling%20%26%20Testing.md)
