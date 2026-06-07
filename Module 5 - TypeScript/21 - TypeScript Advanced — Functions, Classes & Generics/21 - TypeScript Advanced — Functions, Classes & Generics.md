# Lecture 21 — TypeScript Advanced: Functions, Classes & Generics

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

## 🛑 Prerequisites (What to know before starting)
- **JavaScript Fundamentals:** ES6 syntax, functions, arrays, and objects.
- **TypeScript Basics:** Primitive types, basic interfaces, and compilation process.
- **Object-Oriented Concepts:** Basic understanding of objects and methods.

---
---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Write functions with precise type signatures and overloads
- Use TypeScript classes with access modifiers (`public`, `private`, `protected`)
- Define auto-accessors (`accessor`) and understand when to use them
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

By default, every parameter in a TypeScript function is **required** — you must provide a value for it. But sometimes a parameter should be optional or should have a sensible default value when omitted.

**Step-by-step breakdown of what happens:**
1. You declare a parameter with `=` followed by a default value: `greeting: string = "Hello"`
2. TypeScript automatically makes this parameter optional
3. If the caller omits the argument, TypeScript substitutes the default value at runtime
4. If the caller provides a value, the provided value overrides the default

```ts
// greet() can be called with just a name, or with both a name and a custom greeting.
// The 'greeting' parameter has a default value of "Hello".
function greet(name: string, greeting: string = "Hello"): string {
  // Template literal: combines the greeting and name into one string.
  // The backtick syntax ` ` allows embedding variables with ${ }.
  return `${greeting}, ${name}`;
}

// Call 1: Only provide the required 'name'. 'greeting' uses its default "Hello".
console.log(greet("Alice"));           // Output: "Hello, Alice"

// Call 2: Provide both arguments. The default is overridden.
console.log(greet("Bob", "Hi there")); // Output: "Hi there, Bob"
```

> [!TIP]
> Put optional/default parameters **after** required ones. TypeScript enforces this — `function foo(a = 1, b: string)` is an error because the optional `a` comes before the required `b`. If you could omit `a` but still had to provide `b`, the call `foo("hello")` would be ambiguous — is `"hello"` filling `a` or `b`?

### Rest Parameters

A **rest parameter** collects any number of trailing arguments into a single array. You write `...` before the parameter name.

**Why does this matter?** Sometimes you don't know in advance how many arguments a function will receive. For example, a `sum()` function should work whether you pass 2 numbers or 20.

```ts
// The '...' syntax means: "collect all remaining arguments into an array called 'numbers'".
// 'numbers' will have type 'number[]' — an array of numbers.
function sumAll(...numbers: number[]): number {
  // Array's reduce() method iterates through every element.
  // 'total' accumulates the running sum; 'n' is the current element.
  // The '0' at the end is the starting value of 'total'.
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sumAll(1, 2, 3));        // Output: 6    (1 + 2 + 3)
console.log(sumAll(10, 20, 30, 40)); // Output: 100  (10 + 20 + 30 + 40)
console.log(sumAll());               // Output: 0    (empty array → reduce returns start value)
```

### Function Overloads — Multiple Signatures for One Function

**The problem:** Imagine a `format()` function that behaves differently depending on whether you pass a string or a number. If you write a single signature using `string | number`, TypeScript can't tell you the return type for each case — it just says "it might be `string`."

**The solution:** Function overloads let you declare **multiple call signatures** for a single function. TypeScript will match the arguments you pass against each signature and tell you the exact return type.

**How overloads work — step by step:**
1. Write one or more **overload signatures** — these have no function body (no `{ }`)
2. Write one **implementation signature** — this must be broad enough to cover all overload cases
3. Write the single **function body** in the implementation
4. When TypeScript checks a call, it uses the overload signatures, not the implementation signature

```ts
function format(value: string): string;  // Overload 1: string in → string out
function format(value: number): string;  // Overload 2: number in → string out

function format(value: string | number): string {
  // 'typeof' checks the runtime type of 'value'
  if (typeof value === "string") {
    return value.trim();      // Remove leading/trailing whitespace from a string
  }
  return value.toFixed(2);    // Format a number to exactly 2 decimal places
}

// TypeScript now knows the precise return type for each call:
const cleanText = format("  hello  "); // TypeScript knows → returns string → "hello"
const price     = format(3.14159);     // TypeScript knows → returns string → "3.14"

console.log(cleanText); // "hello"
console.log(price);     // "3.14"

// TypeScript catches wrong usage:
// format(true);         // ❌ Error: Argument of type 'boolean' is not assignable
// format(null);         // ❌ Error: null is not a string or number
```

> [!NOTE]
> The implementation signature is **not callable directly** from outside the function. Callers can only use the overload signatures. The implementation is TypeScript's internal way of saying "here's how I handle all cases."

### Section Recap
- Every TypeScript function has a **type signature**: parameter types + return type.
- **Default parameters** (`param = value`) make a parameter optional with a fallback.
- **Rest parameters** (`...items: T[]`) accept any number of trailing arguments.
- **Overloads** are useful only when the return type varies based on the input type.
- Always put optional/default parameters **after** required ones.

---

## 2. Classes & Access Modifiers

### What is a Class? Starting from Zero

If you've never seen a class before, here's the simplest explanation:

A **class** is a **blueprint** for creating objects. The blueprint describes:
- What **data** (properties) an object will hold
- What **actions** (methods) an object can perform

From one blueprint, you can create many individual objects (called **instances**). Each instance has its own copy of the data.

```
Class (Blueprint)        Instances (Objects)
─────────────────        ──────────────────────────────────────
class Car {              const car1 = new Car("Toyota", 60)
  make: string           const car2 = new Car("Honda", 80)
  speed: number          const car3 = new Car("Tesla", 150)
  accelerate() { }
}
```

### TypeScript's Access Modifiers — Who Can Touch What?

TypeScript adds **access modifiers** to classes. These are keywords that control which parts of your code are allowed to read or change each property or method.

Think of them as **permission levels**:

| Modifier | Accessible From | Real-World Analogy |
|----------|-----------------|---------------------|
| `public` (default) | Anywhere | Your name on a business card — anyone can see it |
| `private` | Only inside this class | Your PIN number — only you should know it |
| `protected` | Inside this class + any subclasses | A family recipe — shared with relatives, not strangers |
| `readonly` | Can be read anywhere, but only set in the constructor | Your date of birth — set once, never changed |

                    BankAccount class    BankAccount subclass    Outside code
                    ──────────────────   ─────────────────────   ─────────────
public  owner       ✅ Accessible        ✅ Accessible           ✅ Accessible
private balance     ✅ Accessible        ❌ Not accessible       ❌ Not accessible
protected limit     ✅ Accessible        ✅ Accessible           ❌ Not accessible
readonly accNum     ✅ Read-only         ✅ Read-only            ✅ Read-only
```

```ts
class BankAccount {
  // 'public' means anyone can read and write this property.
  // All class members are public by default if you omit the keyword.
  public owner: string;

  // 'private' means ONLY code inside this class can read/write balance.
  // Outside code (and even subclasses) cannot touch it.
  private balance: number;

  // 'readonly' means it can be set in the constructor, then never changed again.
  readonly accountNumber: string;

  // The constructor runs automatically when you do 'new BankAccount(...)'.
  // Its job is to initialize all the properties.
  constructor(owner: string, accountNumber: string, initialBalance: number) {
    this.owner = owner;                   // Set the public property
    this.accountNumber = accountNumber;   // Set once here — then locked forever!
    this.balance = initialBalance;        // Set the private property
  }

  // A public method — anyone can call this to add money.
  public deposit(amount: number): void {
    // We can access 'private balance' from INSIDE this class — that's allowed!
    if (amount <= 0) throw new Error("Deposit must be positive.");
    this.balance += amount; // Add to the balance
  }

  // A public method — provides READ-ONLY access to the private balance.
  // This is called a "getter pattern" — expose data but control mutations.
  public getBalance(): number {
    return this.balance; // Return balance without letting outside code change it
  }
}

// ── Using the class ──
const account = new BankAccount("Alice", "ACC-001", 1000);

console.log(account.owner);          // ✅ "Alice" — public, accessible from outside
console.log(account.accountNumber);  // ✅ "ACC-001" — readonly, accessible from outside
console.log(account.getBalance());   // ✅ 1000 — method provides controlled access

account.deposit(500);
console.log(account.getBalance());   // ✅ 1500

// account.balance = 9999;           // ❌ TypeScript Error: 'balance' is private!
// account.accountNumber = "HACKED"; // ❌ TypeScript Error: 'accountNumber' is readonly!
```

### Parameter Properties — Eliminate Constructor Boilerplate

Notice that in the example above, we had to:
1. Declare `public owner: string;` as a class field
2. Add `owner: string` as a constructor parameter
3. Write `this.owner = owner;` to assign it

That's three lines per property! TypeScript offers a brilliant shorthand: **parameter properties**.

By adding `public`, `private`, `protected`, or `readonly` in front of a constructor parameter, TypeScript automatically does all three steps for you.

**Before and after comparison:**

```ts
// ❌ The verbose way — 3 steps per property
class PersonVerbose {
  public  name: string;   // Step 1: Declare the field
  private age:  number;
  readonly id:  number;

  constructor(name: string, age: number, id: number) {
    this.name = name;   // Step 2: Accept as parameter
    this.age  = age;    // Step 3: Assign to field
    this.id   = id;
  }
}

// ✅ The shorthand — TypeScript handles all 3 steps in ONE line per property!
class Person {
  constructor(
    public  name: string, // Declares AND assigns 'name' in one stroke
    private age:  number, // Declares AND assigns 'age' in one stroke
    readonly id:  number  // Declares AND assigns 'id' in one stroke
  ) {} // ← The constructor body is EMPTY — TypeScript already handled everything!
}

const p = new Person("Alice", 30, 42);
console.log(p.name); // ✅ "Alice"
console.log(p.id);   // ✅ 42
// console.log(p.age); // ❌ Error: 'age' is private — can't access from outside
```

### Inheritance & `protected`

Classes can **extend** other classes, inheriting all their properties and methods. The `protected` modifier allows a property to be accessible in both the parent class and any child classes, but not from outside code.

**Step-by-step inheritance process:**
1. The child class uses `extends` to inherit from the parent
2. The child's constructor must call `super(...)` first — this calls the parent's constructor
3. The child can access `protected` members from the parent
4. The child can define its own new properties and methods

```ts
class Animal {
  // 'protected' speed — accessible inside Animal AND inside any subclass (like Dog)
  // but NOT accessible from outside code.
  constructor(public name: string, protected speed: number) {}

  // Protected method — only Animal and its subclasses can call this
  protected describe(): string {
    return `${this.name} moves at ${this.speed} km/h`;
  }
}

class Dog extends Animal {
  // 'private breed' — only Dog can access this; even Animal cannot!
  constructor(name: string, speed: number, private breed: string) {
    // MUST call super() first — this runs Animal's constructor to set 'name' and 'speed'
    super(name, speed);
  }

  bark(): void {
    // ✅ Can access 'describe()' from parent (it's protected, and Dog is a subclass)
    // ✅ Can access 'this.breed' (it's private to Dog, and we're inside Dog)
    console.log(`${this.describe()} and says WOOF! (${this.breed})`);
  }
}

const dog = new Dog("Rex", 30, "Labrador");
dog.bark();
// Output: "Rex moves at 30 km/h and says WOOF! (Labrador)"

// dog.speed;   // ❌ Error: 'speed' is protected — not accessible from outside the class hierarchy
// dog.describe(); // ❌ Error: 'describe' is protected — same reason
```

> [!WARNING]
> TypeScript's `private` and `protected` only exist at **compile time**. The compiled JavaScript has no access restrictions. For true runtime privacy (inaccessible even in production JS), use native JavaScript private fields with the `#` prefix:
> ```ts
> class SecureBox {
>   #secret = "hidden"; // Real runtime privacy — even devtools can't easily read this
>   getSecret() { return this.#secret; }
> }
> ```

### Section Recap
- A **class** is a blueprint — use `new ClassName()` to create instances from it.
- **`public`** = accessible everywhere (the default), **`private`** = only inside this class, **`protected`** = this class + subclasses, **`readonly`** = no reassignment after the constructor.
- **Parameter properties** eliminate boilerplate — just add a modifier in front of constructor parameters.
- Always call **`super()`** as the first line in a subclass constructor.
- TypeScript's `private` is a compile-time check only — use `#field` for true runtime privacy.

---

## 3. Modern TypeScript: `accessor` & `using`

### Auto-Accessors — The `accessor` Keyword

**The context:** TypeScript 4.9 introduced the `accessor` keyword for class properties. To understand why it exists, you need to understand what a **getter/setter pair** is.

**What is a getter/setter?**  
A getter is a special method that runs when you *read* a property. A setter is a special method that runs when you *write* to a property. Behind the scenes, there is a hidden "backing field" that actually stores the value.

**Why does this matter?**  
When you attach a decorator (special function — covered in Lecture 22) to a class field, the decorator needs to intercept both reads and writes. To intercept them, the field must have a getter/setter — not just a plain value. Writing getters/setters manually is very verbose.

**The `accessor` keyword** auto-generates the hidden backing field plus the getter and setter for you.

```ts
// ═══ Without accessor — the verbose, manual approach ═══
class EmployeeManual {
  private _name: string = "Unknown";  // The hidden "backing field" — stores the actual value

  // Getter: runs when you READ emp.name
  get name(): string {
    return this._name;
  }

  // Setter: runs when you WRITE emp.name = "Alice"
  set name(value: string) {
    this._name = value;
  }
}

// ═══ With accessor — TypeScript generates EXACTLY the same thing automatically! ═══
class Employee {
  accessor name: string = "Unknown";
  // TypeScript secretly creates: private backing field + getter + setter for 'name'
}

// Both classes behave identically:
const emp = new Employee();
emp.name = "Alice"; // Calls the auto-generated setter
console.log(emp.name); // Calls the auto-generated getter → "Alice"
```

The real power of `accessor` comes when combined with **decorators**. A decorator on an `accessor` field can wrap both the getter and setter with additional logic (e.g., validation, logging, caching).

### 🧠 Think Like a Developer: Handling Resource Leaks
**Scenario:** A background job occasionally crashes, leaving orphaned database connections that eventually bring down the server.
**Decision:** You refactor the connection logic to use `using` (or `await using`) instead of manual `try/finally` blocks. This guarantees the `[Symbol.dispose]()` method is called the exact moment the connection variable leaves scope, making resource leaks virtually impossible.

### Explicit Resource Management — The `using` Keyword

**The real-world problem:**  
Many programming tasks involve resources that must be "cleaned up" after use:
- **Database connections** must be closed when done
- **File handles** must be closed to flush data and release the OS resource
- **Network sockets** must be disconnected
- **Temporary files** must be deleted

In JavaScript, you must manually remember to call `.close()`, `.disconnect()`, or `.delete()`. If an exception (error) is thrown before you reach the cleanup code, the resource **leaks forever** — like leaving the water running when you leave the house.

**The solution (TypeScript 5.2+):**  
The `using` keyword ensures cleanup by calling a special method `[Symbol.dispose]()` automatically when the variable goes **out of scope** — no matter what.

**Step-by-step walkthrough of `using`:**
1. Your class implements the `[Symbol.dispose]()` method — this is the cleanup code
2. You declare a variable with `using` instead of `const` or `let`
3. When the surrounding function or block finishes (normally or via an error), TypeScript automatically calls `[Symbol.dispose]()` on the variable

```ts
class DatabaseConnection {
  private url: string;

  constructor(url: string) {
    this.url = url;
    console.log(`🔗 Opening connection to ${this.url}...`);
    // In a real app, this would establish a network connection.
  }

  query(sql: string): string[] {
    console.log(`📋 Running query: ${sql}`);
    return ["row1", "row2"]; // Simulated query results
  }

  // This special method is called automatically by 'using' when the scope ends.
  // The [Symbol.dispose] name is a JavaScript built-in symbol — don't change it.
  [Symbol.dispose](): void {
    console.log(`✅ Connection to ${this.url} closed automatically!`);
    // In a real app, this would close the network connection.
  }
}

function processOrders(): void {
  using db = new DatabaseConnection("postgres://localhost:5432/shop");
  //    ↑ The 'using' keyword is the magic!

  const results = db.query("SELECT * FROM orders WHERE status = 'pending'");
  console.log("Results:", results);

  // No manual db.close() needed!
  // TypeScript handles it automatically when this function ends.
}  // ← db[Symbol.dispose]() is invoked HERE, even if an error was thrown above!

processOrders();
// Console output:
// 🔗 Opening connection to postgres://localhost:5432/shop...
// 📋 Running query: SELECT * FROM orders WHERE status = 'pending'
// Results: ["row1", "row2"]
// ✅ Connection to postgres://localhost:5432/shop closed automatically!
```

> [!TIP]
> For **async** cleanup (e.g., closing a connection that returns a Promise), use `await using` paired with `[Symbol.asyncDispose]()`:
> ```ts
> class AsyncConnection {
>   async [Symbol.asyncDispose](): Promise<void> {
>     await someAsyncCloseOperation(); // Wait for the async cleanup to finish
>     console.log("Async cleanup done!");
>   }
> }
>
> async function doWork() {
>   await using conn = new AsyncConnection();
>   // ... do async work ...
> }  // conn[Symbol.asyncDispose]() is automatically awaited here
> ```

### Section Recap
- `accessor` auto-generates a hidden backing field + getter + setter — primarily used with decorators to intercept reads and writes.
- `using` automatically calls `[Symbol.dispose]()` when a variable's scope ends — even if an error is thrown.
- `await using` handles async cleanup with `[Symbol.asyncDispose]()`.
- These features eliminate an entire class of resource-leak bugs that were historically very hard to track down.

---

## 4. Generics — Write Code Once, Use Safely with Any Type

### Generic Functions

```ts
// <T> declares a "type parameter". 'T' is just a conventional name (could be 'Item', 'Data', etc.)
// Think of it as: "this function works with some type T — tell me what T is when you call it."
function identity<T>(value: T): T {
  return value; // TypeScript guarantees: input type = output type
}

// TypeScript AUTOMATICALLY infers T from the argument you pass in
const str  = identity("hello"); // T is inferred as 'string'  → str is string
const num  = identity(42);      // T is inferred as 'number'  → num is number
const bool = identity(true);    // T is inferred as 'boolean' → bool is boolean

// You can also specify T explicitly when TypeScript can't infer it
const explicit = identity<string>("world"); // T = string, explicitly stated

// ── A more useful generic function ──
// Returns the first element, or undefined if the array is empty.
// T | undefined means: might return a T, might return undefined.
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0]; // arr[0] on an empty array returns undefined — hence 'T | undefined'
}

const firstName = getFirst(["Alice", "Bob"]); // T = string → firstName is string | undefined
const firstNum  = getFirst([1, 2, 3]);         // T = number → firstNum is number | undefined

// TypeScript now knows the type — these calls are safe!
firstName?.toUpperCase(); // ✅ TypeScript knows this might be a string
firstNum?.toFixed(2);     // ✅ TypeScript knows this might be a number

// firstNum?.toUpperCase(); // ❌ TypeScript Error: 'toUpperCase' doesn't exist on 'number'!
```

### Generic Classes

You can make entire classes generic. This is ideal for data structures (like containers) that work with any type of content:

```ts
// A Stack data structure — a "last in, first out" container.
// Think of it like a stack of plates: you always take from the top.
// <T> means: "this stack holds items of type T — specify T when creating the stack."
class Stack<T> {
  private items: T[] = []; // The internal storage — an array of T

  // Add an item to the top of the stack
  push(item: T): void {
    this.items.push(item); // Array.push adds to the end (which is our "top")
  }

  // Remove and return the top item (or undefined if the stack is empty)
  pop(): T | undefined {
    return this.items.pop(); // Array.pop removes from the end
  }

  // Look at the top item WITHOUT removing it
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // Check if the stack has any items
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // How many items are in the stack?
  get size(): number {
    return this.items.length;
  }
}

// ── Use with strings ──
const history = new Stack<string>(); // T = string
history.push("/home");
history.push("/products");
history.push("/checkout");
console.log(history.pop()); // "/checkout" — most recently visited page

// ── Use with numbers ──
const scores = new Stack<number>(); // T = number
scores.push(100);
scores.push(95);
console.log(scores.peek()); // 95 (still in the stack)
console.log(scores.size);   // 2

// TypeScript prevents mixing types:
// scores.push("invalid"); // ❌ Error: string is not assignable to number
```

### 🧠 Think Like a Developer: Choosing Generic Constraints
**Scenario:** You write a generic `sortBy<T>(items: T[], key: keyof T)` function, but sometimes users pass a key for a boolean property, causing unexpected sorting behavior.
**Decision:** You update the function signature to constrain `T` or the key, ensuring the property accessed by the key resolves strictly to a `string` or `number`. This prevents runtime sorting bugs by enforcing type-safe constraints at compile time.

### Generic Constraints — Limiting What T Can Be

Sometimes you want to use a generic, but you need to guarantee that `T` has at least certain properties. The `extends` keyword adds a **constraint** to the type parameter.

```ts
// Define the minimum shape that T must conform to.
// Any type used as T must have at LEAST an 'id: number' property.
interface HasId {
  id: number;
}

// T can be ANY type — but it MUST satisfy the 'HasId' interface (must have 'id')
// The '<T extends HasId>' syntax is the constraint.
function findById<T extends HasId>(items: T[], id: number): T | undefined {
  // We can safely access 'item.id' because the constraint guarantees it exists.
  return items.find(item => item.id === id);
}

// Both User and Product have 'id', so they satisfy the HasId constraint
interface User    { id: number; name: string; email: string; }
interface Product { id: number; title: string; price: number; stock: number; }

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob",   email: "bob@example.com"   }
];

const products: Product[] = [
  { id: 1, title: "Laptop", price: 999, stock: 5 },
  { id: 2, title: "Mouse",  price: 29,  stock: 50 }
];

// ✅ Works with User (has id)
const user = findById(users, 1);
console.log(user?.name); // "Alice"

// ✅ Works with Product (has id)
const product = findById(products, 2);
console.log(product?.price); // 29

// ❌ Would fail with strings (no 'id' property):
// findById(["Alice", "Bob"], 1); // Error: string doesn't satisfy HasId!
```

### Section Recap
- Generic `<T>` is a **type placeholder** — TypeScript fills it in when the function/class is called.
- Generics give you **reusability** (works with any type) AND **type safety** (TypeScript still validates everything).
- `<T extends SomeInterface>` **constrains** T to types that have specific properties.
- Multiple type parameters (`<TInput, TOutput>`) handle functions that transform one type into another.
- **Never use `any` when a generic would work** — you sacrifice safety for convenience that isn't needed.

---

## 5. Utility Types — TypeScript's Built-In Type Transformers

### `Partial<T>` — Make All Properties Optional

**Use case:** Update/patch operations (HTTP PATCH) where you only want to change *some* fields.

```ts
interface User {
  id:       number;
  name:     string;
  email:    string;
  password: string;
}

// Partial<User> makes ALL properties optional (adds ? to each one).
type UpdateUser = Partial<User>;
// Equivalent to:
// {
//   id?:       number;
//   name?:     string;
//   email?:    string;
//   password?: string;
// }

// Now you can pass any subset of User properties without error
function updateUser(id: number, updates: UpdateUser): void {
  console.log(`Updating user ${id} with:`, updates);
}

updateUser(1, { name: "Alice Smith" });                  // ✅ Update only the name
updateUser(2, { email: "new@example.com" });             // ✅ Update only the email
updateUser(3, { name: "Bob", email: "bob@example.com" }); // ✅ Update multiple fields
// updateUser(4, { id: 99 });                            // ✅ Even valid (though unusual)
```

### `Required<T>` — Make All Properties Required

The opposite of `Partial` — removes all `?` optional markers:

```ts
interface DraftPost {
  title?:   string;
  content?: string;
  tags?:    string[];
  slug?:    string;
}

// Required<DraftPost> removes all '?' — every field is now mandatory.
type PublishedPost = Required<DraftPost>;
// Equivalent to: { title: string; content: string; tags: string[]; slug: string; }

function publish(post: PublishedPost): void {
  console.log(`Publishing: "${post.title}"`);
}

// publish({ title: "Hello" }); // ❌ Error: 'content', 'tags', 'slug' are missing!
publish({ title: "Hello", content: "World", tags: ["ts"], slug: "hello" }); // ✅
```

### `Pick<T, K>` — Select Specific Properties

**Use case:** Creating a lightweight "view" or DTO (Data Transfer Object) that only exposes certain fields — useful for APIs where you don't want to expose sensitive data.

```ts
interface User {
  id:       number;
  name:     string;
  email:    string;
  password: string; // ⚠️ NEVER expose this to the frontend!
  role:     string;
}

// Pick only 'id' and 'name' — safe to send to the client
type UserPreview = Pick<User, "id" | "name">;
// Equivalent to: { id: number; name: string; }

const preview: UserPreview = { id: 1, name: "Alice" };
// preview.password; // ❌ Error: 'password' doesn't exist on type 'UserPreview'!
// preview.email;    // ❌ Error: 'email' doesn't exist on type 'UserPreview'!

// Useful for API response typing:
function getUsers(): UserPreview[] {
  return [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
  // No risk of accidentally including 'password' in the return!
}
```

### `Omit<T, K>` — Exclude Specific Properties

The inverse of `Pick` — keep everything *except* the specified keys:

```ts
// Remove 'password' from User — everything else remains
type SafeUser = Omit<User, "password">;
// Equivalent to: { id: number; name: string; email: string; role: string; }

// A common pattern: 'NewUser' is a User without 'id' (the server generates it)
type NewUser = Omit<User, "id">;
// { name: string; email: string; password: string; role: string; }

function createUser(data: NewUser): User {
  return {
    id: Math.floor(Math.random() * 100000), // Server generates the ID
    ...data                                  // Spread all the other fields
  };
}

createUser({ name: "Charlie", email: "c@c.com", password: "hashed", role: "user" }); // ✅
// createUser({ id: 5, name: "X" }); // ❌ Error: 'id' is not in NewUser!
```

### `Record<K, V>` — Create a Dictionary/Map Type

**Use case:** Creating objects that are used as lookup tables (dictionaries) — where you know the key type and value type, but not the exact keys.

```ts
// A simple string-to-string dictionary
type ErrorMessages = Record<string, string>;
const errors: ErrorMessages = {
  required: "This field is required.",
  email:    "Please enter a valid email address.",
  minLength: "Too short."
};

// Map HTTP status codes (numbers) to their meaning (string)
type HttpStatusMessages = Record<number, string>;
const httpMessages: HttpStatusMessages = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error"
};
console.log(httpMessages[404]); // "Not Found"

// Map a union type of roles to configuration objects
type Role = "admin" | "editor" | "viewer";

interface RoleConfig {
  permissions: string[];
  dashboardUrl: string;
  canDelete: boolean;
}

// Every key in Role ("admin" | "editor" | "viewer") MUST be present — TypeScript enforces it!
const roleConfigs: Record<Role, RoleConfig> = {
  admin:  { permissions: ["read", "write", "delete"], dashboardUrl: "/admin",    canDelete: true  },
  editor: { permissions: ["read", "write"],            dashboardUrl: "/editor",   canDelete: false },
  viewer: { permissions: ["read"],                     dashboardUrl: "/dashboard", canDelete: false }
};
```

### Section Recap
- `Partial<T>` — makes all fields optional (perfect for HTTP PATCH / update operations).
- `Required<T>` — makes all fields mandatory (removes all `?`).
- `Pick<T, K>` — keep only the specified keys (great for creating safe "view" types).
- `Omit<T, K>` — remove specific keys and keep the rest.
- `Record<K, V>` — create type-safe dictionary/lookup-table types.
- Utility types can be **combined**: `Partial<Omit<T, "id">>` is a valid and common pattern.

---

## 🧪 Practice Labs

### Lab 1: Generic Repository (45 min)

Build a type-safe in-memory data store that works with any entity:

1. Open `labs/lab1-repository/`.
2. Define an interface `BaseEntity` with a required `id: number` property.
3. Implement a `Repository<T extends BaseEntity>` class with these methods:
   - `add(item: T): void` — add an item to the store
   - `findById(id: number): T | undefined` — find an item by its ID
   - `getAll(): T[]` — return all stored items
   - `remove(id: number): void` — remove the item with the given ID
   - `update(id: number, changes: Partial<T>): void` — merge changes using `Object.assign`
4. Create two interfaces: `User { id: number; name: string; email: string }` and `Product { id: number; title: string; price: number }`.
5. Instantiate `Repository<User>` and `Repository<Product>`, add items, and test all methods.

**Expected output:**
```
All users:    [{ id: 1, name: "Alice", email: "..." }, { id: 2, name: "Bob", email: "..." }]
Found user:   { id: 1, name: "Alice", email: "..." }
After update: { id: 1, name: "Alice Smith", email: "..." }
All products: [{ id: 1, title: "Laptop", price: 999 }]
```

### Lab 2: Explicit Resource Management (40 min)

1. Open `labs/lab2-using/`.
2. Create a `TempFile` class that:
   - Logs `"Opening temp file: [filename]"` in its constructor.
   - Implements `[Symbol.dispose]()` that logs `"Deleting temp file: [filename]"`.
3. Write a `processFile(filename: string)` function that uses `using` to work with a `TempFile`.
4. Call `processFile("report.csv")` and verify the cleanup message appears even if you add `throw new Error()` inside the function.

---

## 📝 Assignment: DataForge Project — Part 2

Build a generic repository for the DataForge application.

### Requirements
1. Open your DataForge project from Lecture 20.
2. Create a new file `src/services/Repository.ts`.
3. Export an interface `BaseEntity` that forces any entity to have `id: number`.
4. Build a generic `Repository<T extends BaseEntity>` class with:
   - `getAll(): T[]`
   - `getById(id: number): T | undefined`
   - `add(item: T): void`
   - `update(id: number, data: Partial<T>): void` — merge changes using `Object.assign`
   - `delete(id: number): void`
5. Define `User { id: number; name: string; email: string; role: string }` and `Dataset { id: number; name: string; rows: number; createdAt: Date }` interfaces.
6. Create a `Repository<User>` and `Repository<Dataset>` instance in `main.ts`.
7. Test by adding 3 users and 2 datasets, updating one user's name, and verifying `getAll()` returns the updated list.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| TypeScript Handbook — Generics | https://www.typescriptlang.org/docs/handbook/2/generics.html |
| TypeScript Handbook — Utility Types | https://www.typescriptlang.org/docs/handbook/utility-types.html |
| TypeScript 5.2 — `using` keyword | https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html |
| TypeScript Handbook — Classes | https://www.typescriptlang.org/docs/handbook/2/classes.html |

---

## 🎤 Interview Prep

**Q1: What is the difference between `interface` and `type` when defining generic structures?**
*Answer:* Both can be generic. Interfaces are better for public APIs because they support declaration merging. `type` aliases can express complex unions, intersections, and mapped types that interfaces cannot. For simple data shapes, they are largely interchangeable.

**Q2: How do function overloads work in TypeScript? Do they exist at runtime?**
*Answer:* Function overloads are a compile-time construct only. You define multiple call signatures and exactly one implementation signature that handles all cases. At runtime, only the implementation exists as standard JavaScript.

**Q3: Explain the `using` keyword and Explicit Resource Management.**
*Answer:* Introduced in TS 5.2, `using` ties a variable''s lifetime to its scope. When the scope ends, the variable''s `[Symbol.dispose]()` method is automatically called, ensuring resources (like connections or file handles) are cleaned up even if exceptions are thrown.

**Q4: What is the purpose of the `accessor` keyword on a class property?**
*Answer:* `accessor` auto-generates a private backing field along with a getter and setter for the property. It was introduced primarily to work with decorators, allowing decorators to cleanly intercept both read and write operations.

**Q5: What are utility types like `Partial`, `Pick`, and `Omit` doing under the hood?**
*Answer:* They are built using TypeScript''s mapped types and conditional types. For example, `Partial<T>` maps over all keys of `T` using `keyof T` and appends the `?` modifier to make them optional.

---

## 📌 Key Takeaways

- **Function overloads** allow a single function to have multiple call signatures — use them only when the return type changes based on the input type.
- **Access modifiers** (`private`, `protected`, `readonly`) enforce encapsulation and prevent unintended mutations.
- **Parameter properties** eliminate constructor boilerplate — add a modifier in the constructor parameter list and TypeScript handles the rest.
- The **`accessor`** keyword auto-creates getter/setter pairs, primarily for use with decorators.
- The **`using`** keyword guarantees resource cleanup via `[Symbol.dispose]()` — eliminating resource leaks even in error scenarios.
- **Generics** (`<T>`) make code reusable across all types while keeping full type safety.
- **`<T extends Something>`** constrains generics to types that have specific properties.
- **Utility types** (`Partial`, `Pick`, `Omit`, `Record`, `Required`) let you derive new types from existing ones without duplication — keeping your codebase DRY.

---

**Next Lecture:** [Lecture 22 — TypeScript: Modules, Namespaces & Decorators](../22%20-%20TypeScript%20%E2%80%94%20Modules%2C%20Namespaces%20%26%20Decorators/22%20-%20TypeScript%20%E2%80%94%20Modules%2C%20Namespaces%20%26%20Decorators.md)
### 📚 Extensive Tutorials & Resources
- **TypeScript Handbook:** [Functions and Overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- **TypeScript Handbook:** [Classes, Inheritance, and Access Modifiers](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- **TypeScript Handbook:** [Generics and Type Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- **TypeScript Handbook:** [Built-in Utility Types Reference](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- **TypeScript Blog:** [Explicit Resource Management in TypeScript 5.2](https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/#explicit-resource-management)
- **W3Schools:** [TypeScript Generics and Type Safety](https://www.w3schools.com/typescript/typescript_generics.php)
- **W3Schools:** [TypeScript Utility Types Guide](https://www.w3schools.com/typescript/typescript_utility_types.php)
