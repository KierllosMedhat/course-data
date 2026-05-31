# Lecture 20 — TypeScript Advanced: Functions, Classes & Generics

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Write functions with precise type signatures and overloads
- Use TypeScript classes with access modifiers (`public`, `private`, `protected`)
- Define auto-accessors (`accessor`)
- Manage resources explicitly using the new `using` keyword (TS 5.2+)
- Write generic functions, interfaces, and classes with type constraints
- Use built-in utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Function Types & Overloads
2. Classes & Access Modifiers
3. Modern TS: Auto-accessors (`accessor`) & Explicit Resource Management (`using`)
4. Generics: Functions, Interfaces, and Constraints
5. Utility Types: `Partial`, `Pick`, `Omit`, `Record`

### Part 2 — Practice & Lab (~90–120 min)
1. Build a generic data repository class
2. Create typed API service wrappers with generics
3. DataForge Project Part 2: Generic Repository

---

## 1. Function Types & Overloads

### Optional & Default Parameters
```ts
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}
```

### Function Overloads
Overloads define **multiple call signatures** for a single function when the return type depends on the input type.

```ts
// 1. Overload Signatures
function format(value: string): string;
function format(value: number): string;

// 2. Implementation
function format(value: string | number): string {
  if (typeof value === "string") return value.trim();
  return value.toFixed(2);
}

format("  hello  "); // returns string
format(3.14159);     // returns string
```

---

## 2. Classes & Access Modifiers

TypeScript enhances JavaScript classes with type annotations and access control:

| Modifier | Accessible From |
|----------|----------------|
| `public` (default) | Anywhere |
| `private` | Only inside the class |
| `protected` | Inside the class + subclasses |
| `readonly` | Anywhere to read, but can only be set in the constructor |

### Parameter Properties (Shorthand)
Instead of declaring fields and setting them in the constructor, do it all at once!

```ts
class Person {
  constructor(
    public name: string,
    private age: number,
    readonly id: number
  ) {}
}
```

---

## 3. Modern TS: `accessor` & `using`

### Auto-Accessors (`accessor` keyword)
Introduced in TS 4.9, the `accessor` keyword automatically creates a hidden private backing field with getters and setters. This is especially useful for Decorators.

```ts
class Employee {
  accessor name: string = "Unknown";
}

const emp = new Employee();
emp.name = "Alice"; // Automatically uses the generated setter
```

### Explicit Resource Management (`using` keyword)
Introduced in TS 5.2, `using` guarantees that a resource is cleaned up (like closing a database connection or a file) as soon as it goes out of scope.

To use it, the object must implement a `[Symbol.dispose]()` method.

```ts
class DatabaseConnection {
  connect() { console.log("Connected"); }
  
  [Symbol.dispose]() {
    console.log("Connection closed automatically!");
  }
}

function processData() {
  using db = new DatabaseConnection();
  db.connect();
  // Do work...
} // <-- db[Symbol.dispose]() is called AUTOMATICALLY here!

processData();
```

---

## 4. Generics — Reusable, Type-Safe Code

**What are generics?** They let you write code that works with **any type** while keeping full type safety. Think of it as a variable for a type (`<T>`).

### Generic Functions
```ts
function identity<T>(value: T): T {
  return value;
}

const str = identity<string>("hello");
const num = identity(42); // Type inferred!
```

### Generic Interfaces
```ts
interface ApiResponse<T> {
  data: T;
  status: number;
}

const userRes: ApiResponse<User> = { data: { id: 1, name: "Alice" }, status: 200 };
```

### Generic Constraints
Limit what `T` can be using the `extends` keyword.

```ts
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

findById([{ id: 1, name: "Alice" }], 1); // ✅ Works
// findById(["A", "B"], 1); ❌ Error: string doesn't have 'id'
```

---

## 5. Utility Types

TypeScript provides built-in types that transform existing types.

### `Partial<T>` (Make all properties optional)
Perfect for update operations.
```ts
type UpdateUser = Partial<User>; 
```

### `Pick<T, K>` (Select specific keys)
Perfect for API previews or DTOs.
```ts
type UserPreview = Pick<User, "id" | "name">;
```

### `Omit<T, K>` (Exclude specific keys)
```ts
type UserWithoutEmail = Omit<User, "email">;
```

### `Record<K, V>` (Create a dictionary)
```ts
type StatusMessages = Record<number, string>;
const messages: StatusMessages = {
  200: "OK",
  404: "Not Found"
};
```

---

## 🧪 Practice Labs

### Lab 1: Generic Repository (45 min)
1. Open `labs/lab1-repository/`.
2. Implement a `Repository<T extends { id: number }>` class.
3. Add methods for `add(item: T)`, `findById(id: number): T | undefined`, and `getAll(): T[]`.
4. Test it with two different interfaces (`User` and `Product`).

### Lab 2: Explicit Resource Management (40 min)
1. Open `labs/lab2-using/`.
2. Create a `TempFile` class that implements `[Symbol.dispose]()`.
3. In a function, declare it with the `using` keyword.
4. Log output to the console to prove that it "cleans up" when the function finishes.

---

## 📝 Assignment: DataForge Project — Part 2

We need a way to manage our Datasets and Users securely. Let's build a Generic Repository!

### Requirements
1. Open your DataForge project.
2. Create a file `src/services/Repository.ts`.
3. Export an interface `BaseEntity` that forces any type to have an `id: number`.
4. Build a generic `Repository<T extends BaseEntity>` class.
5. Implement `getAll()`, `getById(id: number)`, `add(item: T)`, and `update(id: number, data: Partial<T>)`.
6. Create an instance for `User`s and an instance for `Dataset`s.
7. Test your classes by adding and updating records!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| TypeScript Handbook - Generics | https://www.typescriptlang.org/docs/handbook/2/generics.html |
| TypeScript 5.2 - `using` | https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html |

---

## 📌 Key Takeaways
- **Overloads** allow functions to have multiple type signatures.
- **Access Modifiers** (`private`, `protected`) enforce encapsulation.
- The **`using`** keyword cleans up resources automatically.
- **Generics** (`<T>`) make code reusable and type-safe.
- **Utility types** (`Partial`, `Pick`) allow you to derive new types without duplicating code.

---

**Next Lecture:** [Lecture 21 — TypeScript: Modules, Namespaces & Decorators](./21%20-%20TypeScript%20—%20Modules,%20Namespaces%20%26%20Decorators.md)