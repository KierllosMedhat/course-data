# Lecture 19 — TypeScript Fundamentals: Types, Interfaces & Compilation

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain why TypeScript exists and the benefits of static typing
- Install TypeScript and configure `tsconfig.json`
- Use basic types: `string`, `number`, `boolean`, `unknown`, `never`
- Define object shapes with interfaces and type aliases
- Understand type inference vs explicit type annotations
- Lock down types with `as const` assertions
- Safely validate object shapes using the `satisfies` operator
- Compile TypeScript to JavaScript

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Why TypeScript? (Compile-time errors, IDE support)
2. Installation & `tsconfig.json`
3. Basic types (primitives, `unknown`, `any`, `never`)
4. Arrays & Tuples
5. Type inference vs Annotations
6. Interfaces vs Type Aliases
7. Modern TS: `as const` (Const Assertions) & `satisfies`

### Part 2 — Practice & Lab (~90–120 min)
1. Convert a JavaScript file to TypeScript
2. Build typed interfaces for an API response
3. DataForge Project Part 1: Initial Typings

---

## 1. Why TypeScript?

TypeScript is JavaScript with syntax for types. It catches errors **before** your code runs.

- **Compile-time errors:** Typos and type mismatches are highlighted immediately.
- **Rich IDE support:** Autocomplete actually works!
- **Self-documenting code:** Types act as a contract for what a function expects.

```ts
function add(a: number, b: number): number {
  return a + b;
}

add(1, 2);     // ✅ Works
add(1, "2");   // ❌ Compile Error: Argument of type 'string' is not assignable to 'number'
```

---

## 2. Installation & `tsconfig.json`

```bash
npm install --save-dev typescript
npx tsc --init
```

The `tsconfig.json` file controls the compiler. Always ensure `strict: true` is set!

---

## 3. Basic Types

```ts
let name: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;
```

### Special Types
- `any`: Opts out of type checking. **AVOID THIS.**
- `unknown`: A safer `any`. You must check its type before using it.
- `never`: A function that never returns (e.g., it always throws an error).

```ts
let input: unknown = "hello";
// input.toUpperCase(); ❌ Error: Object is of type 'unknown'

if (typeof input === "string") {
  input.toUpperCase(); // ✅ TypeScript now knows it's a string!
}
```

---

## 4. Arrays & Tuples

### Arrays
```ts
let scores: number[] = [85, 90, 92];
let names: Array<string> = ["Alice", "Bob"];
```

### Tuples (Fixed-Length Arrays)
```ts
let person: [string, number] = ["Alice", 25];
```

---

## 5. Type Inference vs Annotations

TypeScript is smart. It can often guess the type without you writing it.

```ts
let message = "Hello"; // Inferred as string
// message = 42; ❌ Error!
```

**Rule of Thumb:** Let TypeScript infer local variables, but **always annotate** function parameters and return types.

---

## 6. Interfaces vs Type Aliases

Both define custom types, but they have subtle differences.

### Interfaces (Best for Objects)
```ts
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
}

const alice: User = { id: 1, name: "Alice" };
```

### Type Aliases (Best for Unions/Primitives)
```ts
type ID = string | number; // Union type
type Status = "ACTIVE" | "INACTIVE"; // String literal union
```

---

## 7. Modern TS: `as const` & `satisfies`

### Const Assertions (`as const`)
When you declare an object or array with `const`, its properties can still change. `as const` freezes the type completely.

```ts
const config = {
  endpoint: "https://api.example.com",
  timeout: 5000
} as const;

// config.timeout = 6000; ❌ Error: Cannot assign to 'timeout' because it is a read-only property.
```

### The `satisfies` Operator (TS 4.9+)
Sometimes you want to validate that an object matches a type **without** losing the specific values it holds.

```ts
type Colors = "red" | "green" | "blue";
type Palette = Record<Colors, string | number[]>;

// ❌ If we use `: Palette`, we lose the specific type of the properties.
// ✅ Using `satisfies` keeps the exact types!
const myPalette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255]
} satisfies Palette;

// TypeScript knows `myPalette.green` is exactly a string, and `myPalette.red` is an array!
myPalette.green.toUpperCase(); 
```

---

## 🧪 Practice Labs

### Lab 1: JS to TS (45 min)
1. Open `labs/lab1-conversion/`.
2. Change `math.js` to `math.ts`.
3. Add proper types to the function parameters and return types.
4. Run `npx tsc math.ts` to generate the compiled JS.

### Lab 2: Typed API (45 min)
1. Open `labs/lab2-api/`.
2. Look at the JSON response provided in the comments.
3. Write an `interface` that exactly matches that JSON shape.
4. Write a function that uses `fetch` and returns a `Promise<YourInterface>`.

---

## 📝 Assignment: DataForge Project — Part 1

We are starting our final portfolio project: **DataForge**. It's a data visualization dashboard! For Part 1, we will set up the core data models.

### Requirements
1. Initialize a new folder `dataforge/`.
2. Run `npm init -y` and `npm install typescript --save-dev`.
3. Run `npx tsc --init`. Ensure `strict` is true.
4. Create a folder `src/models/`.
5. Create a file `User.ts`. Define an interface `User` with `id` (number), `name` (string), `role` (union of "ADMIN", "EDITOR", "VIEWER").
6. Create a file `Dataset.ts`. Define an interface `Dataset` with `id`, `title`, `data` (an array of numbers), and `tags` (an array of strings).
7. Create a file `config.ts`. Define a configuration object using `as const` that holds your API endpoints.
8. Compile your code to ensure there are no errors!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/intro.html |
| The `satisfies` Operator | https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator |

---

## 📌 Key Takeaways
- TypeScript catches bugs **at compile time**.
- Use **Interfaces** for object shapes and **Type Aliases** for unions.
- Let TypeScript **infer** what it can, but always type your function boundaries.
- Use **`as const`** to lock down literal values.
- Use **`satisfies`** to validate a type without losing specific inference details.

---

**Next Lecture:** [Lecture 20 — TypeScript Advanced: Functions, Classes & Generics](./20%20-%20TypeScript%20Advanced%20—%20Functions,%20Classes%20%26%20Generics.md)