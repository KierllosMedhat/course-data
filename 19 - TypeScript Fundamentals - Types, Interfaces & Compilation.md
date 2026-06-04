# Lecture 19 — TypeScript Fundamentals: Types, Interfaces & Compilation

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain what TypeScript is and why it exists
- Install TypeScript and configure a project with `tsconfig.json`
- Annotate variables, function parameters, and return types
- Use `any`, `unknown`, `never`, and `void` correctly
- Build custom types with `interface` and `type`
- Work with union types, literal types, and type narrowing
- Use arrays, tuples, and enums
- Understand when to use `type` vs `interface`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is TypeScript & Why Use It?
2. Installation & `tsconfig.json`
3. Type Annotations & Inference
4. Special Types (`any`, `unknown`, `never`, `void`)
5. Union Types, Literal Types & Narrowing
6. Arrays, Tuples & Enums
7. Interfaces & Type Aliases

### Part 2 — Practice / Lab (~90 min)
1. Lab 1: Convert JavaScript to TypeScript
2. Lab 2: Typed API Interface Builder

---

## 1. What is TypeScript?

TypeScript is **JavaScript with types**. It's a superset of JavaScript — every valid JS file is also valid TS. TypeScript adds optional type annotations that catch bugs at compile-time instead of runtime.

**Analogy:** JavaScript is like driving without a seatbelt — you can go anywhere, but if you crash, it hurts. TypeScript is the seatbelt — it restricts you slightly but saves you when things go wrong.

```js
// JavaScript — no error until you RUN it and it crashes
function add(a, b) { return a + b; }
add("hello", 5); // "hello5" — silent bug!

// TypeScript — error BEFORE you run it
function add(a: number, b: number): number { return a + b; }
add("hello", 5); // ❌ Compile error: Argument of type 'string' is not assignable to 'number'
```

### TypeScript vs JavaScript

| Feature | JavaScript | TypeScript |
|---------|-----------|------------|
| Types | Dynamic (runtime) | Static (compile-time) |
| Error Detection | When the app crashes | Before it runs |
| Browser Support | ✅ Runs natively | ❌ Must compile to JS first |
| File Extension | `.js` | `.ts` |

---

## 2. Installation & Project Setup

```bash
# Install TypeScript globally
npm install -g typescript

# Verify
tsc --version

# Initialize a TypeScript project (creates tsconfig.json)
tsc --init
```

### `tsconfig.json` — Key Settings

```json
{
  "compilerOptions": {
    "target": "ES2022",          // Which JS version to compile to
    "module": "ESNext",          // Module system (ESNext for modern)
    "strict": true,              // Enable ALL strict type-checking (always use this!)
    "outDir": "./dist",          // Output compiled JS here
    "rootDir": "./src",          // Source TS files here
    "esModuleInterop": true,     // Better import compatibility
    "sourceMap": true            // Generate .map files for debugging
  },
  "include": ["src/**/*"]
}
```

### Compiling

```bash
tsc              # Compile all files according to tsconfig.json
tsc --watch      # Watch mode — recompile on save
tsc app.ts       # Compile a single file
```

> [!TIP]
> In real projects, you rarely run `tsc` manually. Tools like Vite, Angular CLI, and `ts-node` handle compilation automatically.

---

## 3. Type Annotations & Inference

### Explicit Annotations

```ts
// Variables
let username: string = "Alex";
let age: number = 25;
let isAdmin: boolean = false;

// Functions — annotate parameters AND return type
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### Type Inference

TypeScript can **infer** types automatically — you don't always need to annotate:

```ts
let count = 42;        // TypeScript infers: number
let name = "Alex";     // TypeScript infers: string
count = "hello";       // ❌ Error: Type 'string' is not assignable to type 'number'
```

> [!TIP]
> **Rule of thumb:** Let TypeScript infer where it can (variables initialized with a value). Explicitly annotate function parameters and return types.

---

## 4. Special Types

### `any` — Disables type checking (avoid!)

```ts
let data: any = 42;
data = "hello"; // ✅ No error — TypeScript is blind
data.foo.bar;   // ✅ No error — but will crash at runtime!
```

### `unknown` — Safe alternative to `any`

```ts
let input: unknown = getUserInput();
// input.toUpperCase(); // ❌ Error: Object is of type 'unknown'

// You MUST narrow the type first:
if (typeof input === "string") {
  input.toUpperCase(); // ✅ Now TypeScript knows it's a string
}
```

### `void` — Function returns nothing

```ts
function logMessage(msg: string): void {
  console.log(msg);
  // No return statement
}
```

### `never` — Function never returns (throws or infinite loop)

```ts
function throwError(message: string): never {
  throw new Error(message); // This function NEVER completes normally
}
```

| Type | Meaning | Use when... |
|------|---------|-------------|
| `any` | Anything goes (no checking) | Migrating JS → TS (temporary) |
| `unknown` | Anything goes, but must check before using | Receiving external/untyped data |
| `void` | Returns nothing | Functions with side effects only |
| `never` | Never returns | Error throwers, exhaustive switches |

---

## 5. Union Types & Literal Types

### Union Types — "This OR That"

```ts
let id: string | number;
id = "abc123"; // ✅
id = 42;       // ✅
id = true;     // ❌ Error
```

### Literal Types — Restrict to specific values

```ts
type Direction = "up" | "down" | "left" | "right";

function move(dir: Direction): void {
  console.log(`Moving ${dir}`);
}

move("up");      // ✅
move("diagonal"); // ❌ Error: Type '"diagonal"' is not assignable
```

### Type Narrowing (Type Guards)

When a variable has a union type, TypeScript doesn't know which specific type it is. You **narrow** it using checks:

```ts
function printId(id: string | number): void {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // ✅ TS knows it's a string here
  } else {
    console.log(id.toFixed(2));    // ✅ TS knows it's a number here
  }
}
```

---

## 6. Arrays & Tuples

### Typed Arrays

```ts
const scores: number[] = [90, 85, 100];
const names: string[] = ["Alice", "Bob"];
const mixed: (string | number)[] = ["hello", 42];

// Alternative syntax
const scores2: Array<number> = [90, 85, 100];
```

### Tuples — Fixed-length arrays with specific types per position

```ts
// A tuple: [string, number, boolean]
const user: [string, number, boolean] = ["Alex", 25, true];
//           name    age     isAdmin

user[0].toUpperCase(); // ✅ TypeScript knows index 0 is a string
user[1].toUpperCase(); // ❌ Error: number has no method toUpperCase
```

---

## 7. Enums

Enums define a set of named constants:

```ts
enum Role {
  Admin,    // 0
  Editor,   // 1
  Viewer    // 2
}

const myRole: Role = Role.Admin;

// String enums (preferred — more readable in output)
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Banned = "BANNED"
}
```

> [!NOTE]
> In modern TypeScript, many developers prefer **union literal types** over enums: `type Status = "ACTIVE" | "INACTIVE" | "BANNED"`. They're simpler and don't generate extra JavaScript code.

---

## 8. Interfaces

An `interface` defines the shape (structure) of an object:

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;              // Optional property
  readonly createdAt: Date;  // Cannot be changed after creation
}

const user: User = {
  id: 1,
  name: "Alex",
  email: "alex@example.com",
  createdAt: new Date()
};

user.createdAt = new Date(); // ❌ Error: Cannot assign to 'createdAt'
```

### Extending Interfaces

```ts
interface Employee extends User {
  department: string;
  salary: number;
}
```

### Function Type in Interfaces

```ts
interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
```

---

## 9. `type` vs `interface`

| Feature | `interface` | `type` |
|---------|:-----------:|:------:|
| Object shapes | ✅ | ✅ |
| Extend/inherit | ✅ `extends` | ✅ `&` (intersection) |
| Union types | ❌ | ✅ `string \| number` |
| Primitives/tuples | ❌ | ✅ `type ID = string` |
| Declaration merging | ✅ (auto-merge) | ❌ |

```ts
// Use `interface` for object shapes (especially public APIs)
interface User { name: string; age: number; }

// Use `type` for unions, intersections, primitives, tuples
type ID = string | number;
type Coordinates = [number, number];
type Result = User & { token: string }; // Intersection
```

> [!TIP]
> **Rule of thumb:** Use `interface` for objects, use `type` for everything else.

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Using `any` everywhere | Use `unknown` when the type is truly unknown; narrow it before use |
| Not enabling `strict: true` in tsconfig | Always enable strict mode — it catches the most bugs |
| Annotating every variable | Let TypeScript infer (`let x = 5` is already typed as `number`) |
| Confusing `type` and `interface` | Use `interface` for objects, `type` for unions/primitives |
| Forgetting `?` for optional properties | `age?: number` means the property may not exist |
| Using numeric enums | Prefer string enums or union literal types for readability |

---

## 🧪 Practice Labs

### Lab 1 — Convert JavaScript to TypeScript (45 min)
1. Take a provided `utils.js` file with functions like `calculateTotal(items)`, `formatDate(date)`, and `filterByStatus(arr, status)`
2. Rename it to `utils.ts`
3. Add type annotations to all function parameters and return types
4. Define `interface`s for `Product`, `Order`, and any other objects used
5. Run `tsc` and fix all compilation errors

### Lab 2 — Typed API Interface Builder (45 min)
1. Create `api-types.ts`
2. Define interfaces for a blog API: `Post`, `Comment`, `Author`
3. Create a `type ApiResponse<T>` that wraps any data type with `{ data: T; status: number; error?: string }`
4. Write functions: `fetchPosts(): ApiResponse<Post[]>` and `fetchPostById(id: number): ApiResponse<Post>`
5. Use union types for post status: `type PostStatus = "draft" | "published" | "archived"`

---

## 📝 Assignment: DataForge Project — Part 1

Begin building **DataForge**, a typed utility library.

### Requirements
1. Create a TypeScript project with `tsconfig.json` (strict mode enabled)
2. Define interfaces: `DataItem { id: number; name: string; category: string; value: number }`
3. Write a function `filterByCategory(items: DataItem[], category: string): DataItem[]`
4. Write a function `sortByValue(items: DataItem[], order: "asc" | "desc"): DataItem[]`
5. Write a function `getStatistics(items: DataItem[]): { total: number; average: number; max: number; min: number }`
6. Export all functions and test them with sample data

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| TypeScript Official Docs | https://www.typescriptlang.org/docs/ |
| TypeScript Playground | https://www.typescriptlang.org/play |
| TypeScript Deep Dive (Free Book) | https://basarat.gitbook.io/typescript/ |

---

## 📌 Key Takeaways
- **TypeScript** is JavaScript with static types — it catches bugs at compile-time, not runtime
- Always enable **`strict: true`** in `tsconfig.json`
- Let TypeScript **infer** types where possible; explicitly annotate function signatures
- Use **`unknown`** instead of `any` — it forces you to narrow before using
- **`interface`** defines object shapes; **`type`** handles unions, intersections, and primitives
- **Union types** (`string | number`) and **literal types** (`"active" | "inactive"`) are incredibly powerful
- TypeScript compiles to JavaScript — browsers never see `.ts` files

---

**Next Lecture:** [Lecture 20 — TypeScript Advanced: Functions, Classes & Generics](./20%20-%20TypeScript%20Advanced%20-%20Functions,%20Classes%20%26%20Generics.md)
