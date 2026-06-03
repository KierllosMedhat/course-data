# Lecture 10 — Functions, Arrays & Objects

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Write functions using declarations, expressions, and arrow syntax
- Use default parameters, rest parameters, and the spread operator
- Understand higher-order functions and callbacks
- Create, modify, and search arrays using modern non-mutating methods (`toSpliced`, `toSorted`)
- Transform data with `map()`, `filter()`, `reduce()`, `find()`, `some()`, `every()`
- Create and access objects using dot and bracket notation
- Extract values with array and object destructuring
- Use immutable update patterns with the spread operator

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Function basics & Arrow functions
2. Parameters: defaults, rest, spread
3. Higher-order functions & callbacks
4. Arrays & Modern ES2023 Methods (`toSorted`, `toSpliced`, `toReversed`, `with`)
5. Array iteration: `map`, `filter`, `reduce`
6. Objects, shorthand, and destructuring
7. Immutable Updates

### Part 2 — Practice & Lab (~90–120 min)
1. Data transformation pipeline
2. Student record system
3. TaskFlow Project Part 2: Functions & Objects

---

## 1. Functions

### What Is a Function? (Plain English First)

Imagine you have a coffee machine. Every morning, you press a button and it makes coffee. You don't re-wire the machine each day — you just press the button. A **function** is like that button: it's a reusable set of instructions you can trigger anytime, as many times as you want, without repeating yourself.

In programming, we call this the **DRY principle** — Don't Repeat Yourself.

```
Without functions:                With functions:
─────────────────                 ────────────────
console.log("Hello, Alice!");     function greet(name) {
console.log("Hello, Bob!");         console.log(`Hello, ${name}!`);
console.log("Hello, Carol!");     }
// ↑ Repeated, fragile code       greet("Alice");
                                  greet("Bob");
                                  greet("Carol");
                                  // ↑ Clean, reusable
```

### Why Does This Matter?

When code is repeated, a bug fix must be applied in every copy — you might miss one. With a function, you fix it in one place and the fix is everywhere. This is the cornerstone of maintainable software.

### Three Ways to Write Functions

JavaScript gives you three syntaxes for defining functions. Understanding the differences is important for reading and writing real-world code.

#### 1. Function Declaration (Hoisted)

A function declaration is the classic way. It is **hoisted**, meaning the JavaScript engine moves it to the top of the file before anything runs — so you can call it even before it's defined in the code.

```js
// You CAN call greet() here, before the function is defined, because it's hoisted.
console.log(greet("Alice")); // "Hello, Alice!"

function greet(name) {
  // 'name' is a parameter — a local variable that holds the value passed in.
  return `Hello, ${name}!`; // 'return' sends a value back to the caller.
}
```

**Step-by-step breakdown:**
1. JavaScript engine scans the entire file first
2. It sees the function declaration and registers it in memory (hoisting)
3. Then execution starts from the top
4. `greet("Alice")` is called and finds the function already registered
5. The string `"Hello, Alice!"` is returned and logged

#### 2. Function Expression (Not Hoisted)

A function expression stores a function in a variable. It is **not hoisted** — you must define it before using it.

```js
// ❌ This would crash: console.log(greet("Alice")); // ReferenceError!
// Reason: 'greet' is declared but not yet assigned at this point.

const greet = function(name) {
  // The 'function' keyword creates an anonymous function
  // that is assigned to the variable 'greet'.
  return `Hello, ${name}!`;
};

console.log(greet("Alice")); // ✅ "Hello, Alice!" — defined before use.
```

#### 3. Arrow Function (Concise, Inherits `this`)

Arrow functions are the modern, concise syntax. They are especially popular for short callbacks. They do **not** have their own `this` (more on this in Lecture 12).

```js
// Full arrow function syntax:
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Implicit return — for single-expression bodies, you can skip {} and 'return':
const greet = (name) => `Hello, ${name}!`;

// Single parameter? You can even skip the parentheses:
const greet = name => `Hello, ${name}!`;

console.log(greet("Alice")); // "Hello, Alice!"
```

### When to Use Which Syntax?

| Situation | Recommended Syntax |
|-----------|-------------------|
| Top-level named functions | Function Declaration |
| Storing a function in a variable | Arrow Function |
| Short callbacks (e.g., inside `map()`) | Arrow Function |
| Object methods | Regular method syntax |

### Common Mistakes & How to Avoid Them — Functions

**Mistake 1: Calling a function expression before it's defined**

```js
// ❌ ReferenceError!
console.log(double(4));

const double = n => n * 2;

// ✅ Move the definition above the call, OR use a function declaration
function double(n) { return n * 2; }
console.log(double(4)); // 8
```

**Mistake 2: Forgetting `return` in a block-body arrow function**

```js
// ❌ Returns undefined because there's no 'return' statement!
const square = n => {
  n * n; // This result is computed but thrown away
};

// ✅ Add the return keyword
const square = n => {
  return n * n;
};

// ✅ Or use implicit return (remove the curly braces)
const square = n => n * n;
```

**Mistake 3: Mixing up `return` with `console.log`**

```js
// ❌ This prints but doesn't RETURN anything
function add(a, b) {
  console.log(a + b); // Prints 3 but function returns undefined
}

const result = add(1, 2); // result is undefined, not 3!

// ✅ Return the value
function add(a, b) {
  return a + b; // Now the caller can use the result
}

const result = add(1, 2); // result is 3 ✅
```

### 📌 Section Recap
- A function is a reusable block of code triggered by name.
- **Declaration** is hoisted; **expression** and **arrow** are not.
- Arrow functions are the most concise and widely used in modern JS.
- Always use `return` if the caller needs the function's result.

---

## 2. Parameters — Default, Rest, and Spread

### Why Parameters Matter

Think of function parameters as the **inputs to your coffee machine**. You can press the "espresso" button with different amounts of coffee — the machine adapts based on what you give it. Parameters let functions adapt to different inputs.

### Default Parameters

What if a user calls your function without providing an argument? Default parameters provide a fallback value, preventing surprising `undefined` bugs.

```js
// Without default parameters:
function greet(name) {
  return `Hello, ${name}!`;
}
greet();       // "Hello, undefined!" ← Bad!

// ✅ With default parameters:
function greet(name = "Guest") {
  // If 'name' is not provided (or is undefined), it defaults to "Guest"
  return `Hello, ${name}!`;
}

greet("Alice"); // "Hello, Alice!"
greet();        // "Hello, Guest!" ← Safe fallback
greet(undefined); // "Hello, Guest!" ← undefined also triggers the default
greet(null);      // "Hello, null!" ← null does NOT trigger the default!
```

> [!NOTE]
> Default parameters only activate when the argument is `undefined` (or missing). Passing `null` does NOT trigger the default — this is a common source of confusion.

### Rest Parameters (`...args`)

What if you don't know in advance how many arguments will be passed? The **rest parameter** collects all remaining arguments into an array.

Think of it like a "catch-all" container at the end of a conveyor belt.

```js
function sum(...numbers) {
  // ...numbers collects ALL passed arguments into a single array called 'numbers'
  // e.g., sum(1, 2, 3) → numbers = [1, 2, 3]
  // e.g., sum(10, 20, 30, 40) → numbers = [10, 20, 30, 40]

  return numbers.reduce((total, n) => total + n, 0);
  // .reduce() adds each number to the running total, starting from 0
}

console.log(sum(1, 2, 3));       // 6
console.log(sum(10, 20, 30, 40)); // 100
console.log(sum());               // 0 (empty array sums to 0)

// Rest with other parameters:
function logEvent(eventName, ...participants) {
  // 'eventName' captures the first argument
  // '...participants' captures ALL remaining arguments
  console.log(`Event: ${eventName}`);
  console.log(`Participants: ${participants.join(", ")}`);
}

logEvent("Workshop", "Alice", "Bob", "Carol");
// Event: Workshop
// Participants: Alice, Bob, Carol
```

> [!NOTE]
> The rest parameter must **always be last** in the parameter list. `function (a, ...rest)` ✅ — `function (...rest, a)` ❌ — This is a syntax error.

### Spread Operator (`...`)

The spread operator looks the same as rest (`...`) but does the **opposite**: instead of collecting values *into* an array, it **expands** an array *out* into individual values.

```
REST PARAMETER:  Many values → One array   (collecting)
SPREAD OPERATOR: One array   → Many values (expanding)
```

```js
const fruits = ["apple", "banana"];
const veggies = ["carrot", "broccoli"];

// Combining arrays WITHOUT spread (the wrong way):
const combined = [fruits, veggies]; // [[...], [...]] — array of arrays! ❌

// ✅ Combining arrays WITH spread:
const combined = [...fruits, ...veggies]; // ["apple", "banana", "carrot", "broccoli"]

// Spread also works for copying an array (creates a NEW array, not a reference):
const copy = [...fruits]; // ["apple", "banana"] — independent copy

// Spread in function calls — expand an array as individual arguments:
const numbers = [5, 2, 8, 1];
const maxValue = Math.max(...numbers); // Same as Math.max(5, 2, 8, 1) → 8

// Math.max() doesn't accept an array — spread solves this:
Math.max(numbers);    // NaN ❌ — can't compare an array to numbers
Math.max(...numbers); // 8  ✅ — each number is passed as separate argument
```

### Common Mistakes & How to Avoid Them — Parameters

**Mistake: Not understanding that defaults only fire on `undefined`**

```js
function connect(host = "localhost", port = 3000) {
  console.log(`Connecting to ${host}:${port}`);
}

connect();              // "Connecting to localhost:3000" ✅
connect("myserver");    // "Connecting to myserver:3000" ✅
connect(undefined, 5432); // "Connecting to localhost:5432" ✅ (undefined triggers default)
connect(null, 5432);      // "Connecting to null:5432" ❌ (null does NOT trigger default!)
```

### 📌 Section Recap
- **Default parameters** provide fallback values when arguments are missing or undefined.
- **Rest** (`...args`) collects unlimited arguments into an array — must be last parameter.
- **Spread** (`...arr`) expands an array into individual elements.

---

## 3. Higher-Order Functions & Callbacks

### The Concept (Plain English)

A **higher-order function** is a function that either:
1. Takes another function as an **argument** (a callback), or
2. Returns a function as its result.

This sounds abstract, but you use this all the time! When you click a button in a browser and something happens — that "something" is a callback function.

**Real-world analogy:** Imagine you hire a contractor (the higher-order function) to renovate your kitchen. You tell them, "When you're done, call me back" (the callback). The contractor doesn't need to know *what* you'll do when they call — they just call you. The contractor is the higher-order function, and "calling you" is executing the callback.

```js
// Step 1: A simple higher-order function that takes a callback
function processUserInput(callback) {
  const name = "Alice"; // Simulating data we've collected

  // Step 2: We call the callback function, passing 'name' to it
  callback(name);
}

// Step 3: We pass an arrow function as the callback
processUserInput((name) => {
  // This arrow function IS the callback — it's called when processUserInput runs
  console.log(`Hello, ${name}!`); // "Hello, Alice!"
});
```

**Step-by-step breakdown:**
1. `processUserInput` is called with an arrow function as the argument
2. Inside `processUserInput`, `callback` now holds that arrow function
3. When `callback(name)` is called, JavaScript runs the arrow function with `"Alice"`
4. The arrow function logs `"Hello, Alice!"`

### Why Does This Matter?

Higher-order functions let you write **generic code** that can be customized with different behaviors at call time. Without them, you'd need to write a separate function for every variation.

### A More Realistic Example: Filtering Data

```js
// We have an array of products
const products = [
  { name: "Laptop", category: "Electronics", price: 999 },
  { name: "Shirt", category: "Clothing", price: 25 },
  { name: "Phone", category: "Electronics", price: 699 },
];

// filterProducts is a higher-order function that accepts a 'test' callback
function filterProducts(products, test) {
  const results = [];
  for (const product of products) {
    // We call the test function for each product
    // If test returns true, we keep it; if false, we skip it
    if (test(product)) {
      results.push(product);
    }
  }
  return results;
}

// We pass different callbacks to change the filtering behaviour —
// the filterProducts function stays the same!
const electronics = filterProducts(products, (p) => p.category === "Electronics");
const affordable  = filterProducts(products, (p) => p.price < 100);

console.log(electronics); // [{ Laptop... }, { Phone... }]
console.log(affordable);  // [{ Shirt... }]
```

> [!TIP]
> Higher-order functions are the foundation of JavaScript's built-in array methods like `map()`, `filter()`, and `reduce()`. You'll use them constantly — understanding them at this level unlocks everything.

### Returning a Function (Function Factory)

Higher-order functions can also *return* functions. This pattern lets you create customized functions:

```js
// A function that RETURNS a function (factory pattern):
function createMultiplier(factor) {
  // The returned function "remembers" the factor via closure (Lecture 12)
  return (number) => number * factor;
}

const double = createMultiplier(2);  // Creates a "multiply by 2" function
const triple = createMultiplier(3);  // Creates a "multiply by 3" function

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(double(10)); // 20
```

### 📌 Section Recap
- A **callback** is a function passed as an argument to another function.
- A **higher-order function** accepts or returns functions.
- This pattern powers all of JavaScript's array iteration methods.
- Callbacks let you write generic, reusable code with custom behavior.

---

## 4. Arrays & Modern ES2023 Methods

### What Is an Array?

An array is an **ordered list** of values stored in a single variable. Think of it like a numbered shelf in a post office — each slot has an address (index), starting at 0.

```
Array: ["Apple", "Banana", "Cherry"]
Index:     0         1         2

The first item ALWAYS has index 0.
The last item has index array.length - 1.
```

```js
const fruits = ["Apple", "Banana", "Cherry"];

console.log(fruits[0]);          // "Apple" (first item — index 0)
console.log(fruits[2]);          // "Cherry" (third item — index 2)
console.log(fruits.length);      // 3 (total number of items)
console.log(fruits[fruits.length - 1]); // "Cherry" (last item, always)

// What happens if you access an index that doesn't exist?
console.log(fruits[99]); // undefined — no crash, just undefined
```

### The Problem with Old Mutating Methods

JavaScript has always had methods like `sort()`, `reverse()`, and `splice()`. The problem? They **mutate** (permanently change) the original array. This causes serious bugs in modern applications — especially in React or Angular where predictable state is critical.

```js
const scores = [3, 1, 4, 1, 5];

// ❌ The OLD way — sort() modifies the ORIGINAL array
const sorted = scores.sort((a, b) => a - b);
console.log(sorted); // [1, 1, 3, 4, 5]
console.log(scores); // [1, 1, 3, 4, 5] ← ALSO CHANGED! Bug!

// Why is this dangerous?
// If you passed 'scores' to three different functions and one of them sorted it,
// the other two now receive a different array than they expected.
```

### The ES2023 Solution — Non-Mutating Methods

JavaScript ES2023 introduced **immutable versions** of these methods. They return a **brand new array** and leave the original untouched.

| Old (Mutates Original) | New (Returns Copy) | What It Does |
|------------------------|-------------------|----|
| `splice(index, count)` | `toSpliced(index, count)` | Adds/removes items at a specific index |
| `sort(compareFn)` | `toSorted(compareFn)` | Sorts the array |
| `reverse()` | `toReversed()` | Reverses the array |
| `arr[index] = val` | `arr.with(index, val)` | Replaces an item at a specific index |

```js
const original = [3, 1, 2];

// ✅ SORTING safely — original is UNCHANGED
const sorted = original.toSorted((a, b) => a - b);
console.log(sorted);   // [1, 2, 3]
console.log(original); // [3, 1, 2] ← Untouched!

// ✅ REVERSING safely
const reversed = original.toReversed();
console.log(reversed); // [2, 1, 3]
console.log(original); // [3, 1, 2] ← Still untouched!

// ✅ REPLACING safely — replaces item at index 1 with 99
const updated = original.with(1, 99);
console.log(updated);  // [3, 99, 2]
console.log(original); // [3, 1, 2] ← Still untouched!

// ✅ REMOVING/INSERTING safely — remove 1 item at index 0
const spliced = original.toSpliced(0, 1);
console.log(spliced);  // [1, 2]
console.log(original); // [3, 1, 2] ← Still untouched!

// toSpliced can also INSERT items:
// toSpliced(startIndex, deleteCount, ...itemsToInsert)
const inserted = original.toSpliced(1, 0, 99, 100);
console.log(inserted); // [3, 99, 100, 1, 2] — two items inserted at index 1
```

> [!TIP]
> Always prefer `toSorted()`, `toSpliced()`, `toReversed()`, and `with()` over their mutating counterparts. This is a professional best practice that prevents an entire class of bugs.

### Common Array Operations

```js
const tasks = ["Buy milk", "Walk dog", "Call mom"];

// ─── Adding items ───────────────────────────────────────
tasks.push("Read book");      // Adds to the END — mutates original
tasks.unshift("Wake up");     // Adds to the BEGINNING — mutates original

// ─── Removing items ─────────────────────────────────────
tasks.pop();                  // Removes the LAST item — mutates original
tasks.shift();                // Removes the FIRST item — mutates original

// ─── Finding items ──────────────────────────────────────
const idx = tasks.indexOf("Walk dog"); // Returns the index, or -1 if not found
const hasTask = tasks.includes("Call mom"); // true or false

// ─── Accessing a portion ────────────────────────────────
const first2 = tasks.slice(0, 2); // ["Buy milk", "Walk dog"] — does NOT mutate

// ─── Converting to string ───────────────────────────────
const str = tasks.join(" | "); // "Buy milk | Walk dog | Call mom"
```

> [!WARNING]
> `push()`, `pop()`, `shift()`, `unshift()` all **mutate** the original array. For immutable alternatives, use the spread operator or `toSpliced()`.

### Common Mistakes & How to Avoid Them — Arrays

**Mistake 1: Using `sort()` on numbers without a comparator**

```js
const nums = [10, 9, 2, 1, 100];

// ❌ Wrong! Default sort converts to strings first ("10" < "2" as strings)
console.log(nums.sort()); // [1, 10, 100, 2, 9] — Alphabetical, not numeric!

// ✅ Always provide a comparator for numbers
console.log(nums.toSorted((a, b) => a - b)); // [1, 2, 9, 10, 100] ✅
// How the comparator works:
// a - b < 0 → a comes first
// a - b > 0 → b comes first
// a - b = 0 → order unchanged
```

**Mistake 2: Confusing `indexOf` with `includes` for objects**

```js
const items = [{ id: 1 }, { id: 2 }];

// ❌ indexOf uses reference equality — different object, same values = not found
console.log(items.indexOf({ id: 1 })); // -1 — not found!

// ✅ Use find() for objects
const item = items.find(i => i.id === 1); // { id: 1 } ✅
```

### 📌 Section Recap
- Arrays are ordered, zero-indexed lists.
- Old methods like `sort()` mutate arrays — they change the original.
- ES2023 introduced `toSorted()`, `toSpliced()`, `toReversed()`, and `with()` — prefer these.
- `indexOf` and `includes` use reference equality — use `find()` for objects.

---

## 5. Array Iteration Methods

### The Power of Iteration Methods

These are the most important array methods you'll use as a developer. They all take a **callback function** and iterate through the array automatically — no `for` loop needed!

```
Array Methods Overview:
─────────────────────────────────────────────────────────────
map()      → Transform each item  → Returns a NEW array (same length)
filter()   → Keep matching items  → Returns a NEW array (shorter or equal)
reduce()   → Combine all items    → Returns a SINGLE value
find()     → First matching item  → Returns ONE item or undefined
findIndex()→ Index of first match → Returns a number or -1
some()     → Any match?           → Returns boolean (true/false)
every()    → All match?           → Returns boolean (true/false)
forEach()  → Run code on each     → Returns undefined (side effects only)
```

### `map()` — Transform Each Item

`map()` creates a **new array** by applying a transformation to each item. The original array is unchanged. The new array is always the **same length** as the original.

**Analogy:** Like an assembly line that processes each item and outputs a modified version.

```js
const prices = [10, 20, 30];

// Apply a 10% discount to every price
const discounted = prices.map((price) => {
  // This callback runs once for each item in the array
  // 'price' holds the current item's value (10, then 20, then 30)
  return price * 0.9; // Return the transformed value for this item
});

console.log(discounted); // [9, 18, 27] — new array, same length
console.log(prices);     // [10, 20, 30] — Original unchanged!

// The callback receives THREE arguments: (item, index, array)
const withIndex = prices.map((price, index) => `Item ${index}: $${price}`);
// ["Item 0: $10", "Item 1: $20", "Item 2: $30"]

// Real-world example: Extract just the names from an array of objects
const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob",   age: 30 },
  { id: 3, name: "Carol", age: 22 },
];

const names = users.map((user) => user.name);
console.log(names); // ["Alice", "Bob", "Carol"]

// Transform objects into different shapes:
const userCards = users.map((user) => ({
  displayName: user.name.toUpperCase(),
  label: `User #${user.id}`,
}));
// [{ displayName: "ALICE", label: "User #1" }, ...]
```

### `filter()` — Keep Items That Pass a Test

`filter()` creates a **new array** containing only the items for which the callback returns `true`. Items where the callback returns `false` are excluded.

```js
const products = [
  { name: "Laptop",  category: "Electronics", price: 999, inStock: true  },
  { name: "Shirt",   category: "Clothing",    price: 25,  inStock: false },
  { name: "Phone",   category: "Electronics", price: 699, inStock: true  },
  { name: "Jeans",   category: "Clothing",    price: 60,  inStock: true  },
];

// Get only electronics that are in stock
const availableElectronics = products.filter((product) => {
  // Return true to KEEP the item, false to EXCLUDE it
  return product.category === "Electronics" && product.inStock === true;
});

console.log(availableElectronics);
// [{ name: "Laptop"... }, { name: "Phone"... }]

// Short version using implicit return:
const inStock = products.filter(p => p.inStock);

// Chain map and filter together! (Pipeline pattern)
const electronicsNames = products
  .filter((p) => p.category === "Electronics") // Step 1: Filter
  .map((p) => p.name);                          // Step 2: Transform

console.log(electronicsNames); // ["Laptop", "Phone"]
```

> [!NOTE]
> Chaining array methods (`filter().map()`) is extremely common in real-world code. Read it left-to-right: first filter, then transform the results.

### `find()` — Get the First Match

`find()` returns the **first item** that passes the test (not an array — just the item). Returns `undefined` if nothing is found. It stops searching after the first match.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
];

const bob = users.find((user) => user.name === "Bob");
console.log(bob); // { id: 2, name: "Bob" }

const nobody = users.find((user) => user.name === "Dave");
console.log(nobody); // undefined

// Always check for undefined before using the result!
const found = users.find((u) => u.id === 99);
if (found) {
  console.log(found.name); // Safe ✅
}
// Or use optional chaining:
console.log(found?.name); // undefined — no crash ✅
```

### `findIndex()` — Get the Index of the First Match

Same as `find()` but returns the **index** instead of the item itself. Returns `-1` if not found.

```js
const users = [{ id: 1 }, { id: 2 }, { id: 3 }];

const idx = users.findIndex((u) => u.id === 2);
console.log(idx); // 1

// Useful for immutable updates — find the index, then use with()
const updated = users.with(idx, { id: 2, name: "Bob Updated" });
```

### `some()` and `every()`

```js
const numbers = [2, 4, 7, 8, 10];

// some() — Is at least ONE item odd? Returns true if ANY callback returns true
const hasOdd = numbers.some((n) => n % 2 !== 0);
console.log(hasOdd); // true (7 is odd)
// Stops as soon as it finds ONE match (efficient!)

// every() — Are ALL items even? Returns true only if ALL callbacks return true
const allEven = numbers.every((n) => n % 2 === 0);
console.log(allEven); // false (7 is not even)
// Stops as soon as it finds ONE failure (efficient!)

// Practical examples:
const cart = [{ price: 10 }, { price: 25 }, { price: 50 }];
const canAfford = cart.every(item => item.price < 100); // true — all affordable
const hasExpensive = cart.some(item => item.price > 40); // true — 50 is > 40
```

### `reduce()` — Combine Everything Into One Value

`reduce()` is the most powerful and flexible array method. It processes every item and accumulates the result into a single value (a number, string, object, or even another array).

```
reduce(callback, initialValue)
       ↓             ↓
Callback receives:   Starting point for 'accumulator'
  - accumulator (the running result, starts as initialValue)
  - currentValue (the current array item)
  - index (current position)
```

```js
const numbers = [1, 2, 3, 4, 5];

// Calculate the total sum — visualising each step:
const total = numbers.reduce((accumulator, currentValue) => {
  // Round 1: accumulator = 0, currentValue = 1 → returns 1
  // Round 2: accumulator = 1, currentValue = 2 → returns 3
  // Round 3: accumulator = 3, currentValue = 3 → returns 6
  // Round 4: accumulator = 6, currentValue = 4 → returns 10
  // Round 5: accumulator = 10, currentValue = 5 → returns 15
  return accumulator + currentValue;
}, 0); // 0 is the initial value for accumulator

console.log(total); // 15

// Building a string:
const words = ["Hello", "world", "from", "reduce"];
const sentence = words.reduce((acc, word, index) => {
  return index === 0 ? word : acc + " " + word;
}, "");
console.log(sentence); // "Hello world from reduce"

// Advanced example: Group products by category
const products = [
  { name: "Laptop", category: "Electronics" },
  { name: "Shirt",  category: "Clothing" },
  { name: "Phone",  category: "Electronics" },
];

const byCategory = products.reduce((grouped, product) => {
  const key = product.category; // "Electronics" or "Clothing"

  // If this category doesn't exist yet in our grouped object, create it
  if (!grouped[key]) {
    grouped[key] = [];
  }

  // Add this product's name to the appropriate category array
  grouped[key].push(product.name);

  // IMPORTANT: Always return the accumulator!
  return grouped;
}, {}); // Start with an empty object

console.log(byCategory);
// { Electronics: ["Laptop", "Phone"], Clothing: ["Shirt"] }
```

> [!WARNING]
> A very common `reduce()` mistake is **forgetting to return the accumulator**. The callback MUST return the accumulator, or the next iteration will receive `undefined`.

### Common Mistakes & How to Avoid Them — Iteration Methods

**Mistake 1: Using `map()` when you want `forEach()`**

```js
// ❌ Using map() just for side effects — returns an array you don't need
const names = ["Alice", "Bob"];
names.map(name => console.log(name)); // Works but wrong tool!

// ✅ Use forEach() when you don't need the result
names.forEach(name => console.log(name));
```

**Mistake 2: Forgetting that `find()` returns the item, not an array**

```js
const users = [{ id: 1, name: "Alice" }];

// ❌ Treating find() result as an array
const result = users.find(u => u.id === 1);
result.forEach(...); // TypeError: result.forEach is not a function

// ✅ find() returns ONE item (or undefined), not an array
console.log(result.name); // "Alice" ✅
```

**Mistake 3: Not returning from the reduce callback**

```js
// ❌ Forgot to return acc — total will be undefined!
const total = [1, 2, 3].reduce((acc, n) => {
  acc + n; // Computed but not returned!
}, 0);

console.log(total); // undefined ← Bug!

// ✅ Always return the accumulator
const total = [1, 2, 3].reduce((acc, n) => {
  return acc + n; // Explicit return
}, 0);
// OR with implicit arrow return:
const total = [1, 2, 3].reduce((acc, n) => acc + n, 0);
```

### 📌 Section Recap
- `map()` transforms each item and returns a new array of the same length.
- `filter()` returns a new shorter array with only matching items.
- `find()` returns the first matching item (not an array — one item or undefined).
- `some()` / `every()` check if any/all items pass a test.
- `reduce()` combines all items into a single value — always return the accumulator!

---

## 6. Objects & Destructuring

### What Is an Object? (Plain English)

An object is a **collection of related data and behaviours** stored together. Think of it like a **form** — a job application form has fields for name, age, email, and position. An object is the same idea: multiple named slots (called **properties**) holding related values.

```
Real-world "Person" concept:
┌──────────────────────────────┐
│  name:     "Alice"           │
│  age:      25                │
│  city:     "Cairo"           │
│  greet():  [function]        │
└──────────────────────────────┘
         ↕ Code version:
const person = {
  name: "Alice",
  age: 25,
  city: "Cairo",
  greet() { return `Hi, I'm ${this.name}`; }
};
```

### Creating and Accessing Objects

```js
// Creating an object using object literal syntax:
const person = {
  name: "Alice",     // 'name' is the KEY, "Alice" is the VALUE
  age: 25,           // Keys are strings (quotes optional without special chars)
  city: "Cairo",
  isStudent: true,
  // Methods (functions as values) use shorthand syntax:
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

// ─── Accessing properties ───────────────────────────────
// Dot notation — most common, use when you know the key name
console.log(person.name);  // "Alice"
console.log(person.age);   // 25

// Bracket notation — use when key is in a variable or has special characters
const key = "city";
console.log(person[key]);    // "Cairo" — key from variable
console.log(person["name"]); // "Alice" — same as dot notation
console.log(person["is-student"]); // works for hyphenated keys (dot wouldn't)

// ─── Modifying properties ───────────────────────────────
person.email = "alice@example.com"; // Adding a new property
person.age = 26;                    // Updating existing property

// ─── Removing properties ───────────────────────────────
delete person.isStudent; // Removes the property

// ─── Checking if a property exists ─────────────────────
console.log("email" in person); // true
console.log("salary" in person); // false

// ─── Getting all keys/values ────────────────────────────
Object.keys(person);   // ["name", "age", "city", "email", "greet"]
Object.values(person); // ["Alice", 26, "Cairo", "alice@example.com", ƒ]
Object.entries(person); // [["name", "Alice"], ["age", 26], ...]
```

### Object Shorthand (ES6)

When a variable name matches the property name, you can use shorthand syntax:

```js
const name = "Alice";
const age = 25;
const city = "Cairo";

// ❌ Old verbose way:
const person = { name: name, age: age, city: city };

// ✅ ES6 shorthand — when variable name = property name:
const person = { name, age, city }; // Exactly the same!
```

### Computed Property Names

When you need a dynamic key (the key comes from a variable):

```js
const fieldName = "email";
const value = "alice@example.com";

// ✅ Use square brackets for dynamic keys:
const user = {
  name: "Alice",
  [fieldName]: value, // Key is the VALUE of fieldName → "email"
};

console.log(user.email); // "alice@example.com"

// Real-world example: Building a filter object dynamically
const filters = {};
const filterType = "category";
const filterValue = "Electronics";

filters[filterType] = filterValue;
// filters is now: { category: "Electronics" }
```

### Destructuring

Destructuring is a clean way to **unpack** values from objects or arrays into individual variables in one line.

Think of it like unpacking a suitcase: instead of pulling out items one by one (`person.name`, `person.age`, `person.city`), you unzip and grab everything at once.

#### Object Destructuring

```js
const person = { name: "Alice", age: 25, city: "Cairo", role: "Admin" };

// ❌ Old way — repetitive and verbose:
const name = person.name;
const age  = person.age;
const city = person.city;

// ✅ Destructuring — one line extracts multiple values:
const { name, age, city } = person;
console.log(name); // "Alice"
console.log(age);  // 25
console.log(city); // "Cairo"

// Rename while destructuring (alias) — useful to avoid name conflicts:
const { name: fullName, city: hometown } = person;
console.log(fullName); // "Alice"
console.log(hometown); // "Cairo"

// Default value (if property doesn't exist or is undefined):
const { name, salary = 0 } = person;
console.log(salary); // 0 (person doesn't have 'salary', so default is used)

// Destructure in function parameters directly:
function printUser({ name, age, role = "User" }) {
  // Now 'name', 'age', and 'role' are available as variables
  console.log(`${name} (${age}) — ${role}`);
}
printUser(person); // "Alice (25) — Admin"
// No need for: printUser(person) → then person.name, person.age...

// Nested destructuring:
const config = {
  server: {
    host: "localhost",
    port: 3000
  }
};
const { server: { host, port } } = config;
console.log(host, port); // "localhost" 3000
```

#### Array Destructuring

```js
const colors = ["red", "green", "blue", "yellow"];

// Extract by position — variable names can be anything:
const [first, second] = colors;
console.log(first);  // "red"
console.log(second); // "green"

// Skip items with commas (the comma is a placeholder):
const [, , third] = colors; // Skip first two
console.log(third); // "blue"

// Capture the rest with rest syntax:
const [head, ...tail] = colors;
console.log(head); // "red"
console.log(tail); // ["green", "blue", "yellow"]

// Default values:
const [a = "default-a", b = "default-b"] = ["actual-a"];
console.log(a); // "actual-a"
console.log(b); // "default-b" (nothing at index 1)

// Swap two variables — the famous destructuring trick!
let x = 1;
let y = 2;
[x, y] = [y, x]; // Swap without a temporary variable!
console.log(x, y); // 2 1
```

### Common Mistakes & How to Avoid Them — Objects & Destructuring

**Mistake 1: Trying to destructure `null` or `undefined`**

```js
const user = null; // API returned null

// ❌ TypeError: Cannot destructure property 'name' of null
const { name } = user;

// ✅ Always guard against null/undefined:
const { name } = user ?? {}; // If user is null, use empty object as fallback
// OR use optional chaining:
const name = user?.name; // undefined if user is null — no crash
```

**Mistake 2: Forgetting that `delete` doesn't return the value**

```js
const obj = { a: 1, b: 2 };
const removed = delete obj.a; // removed is true (success indicator), NOT 1!
console.log(removed); // true
console.log(obj);     // { b: 2 }

// ✅ To get the value while removing, save it first:
const { a, ...rest } = obj; // a = 1, rest = { b: 2 }
```

### 📌 Section Recap
- Objects store key-value pairs that represent real-world entities.
- Access properties with dot notation (`obj.key`) or bracket notation (`obj["key"]`).
- **Destructuring** unpacks values cleanly into variables in one line.
- Function parameter destructuring makes functions more readable.
- Always guard against destructuring `null` or `undefined`.

---

## 7. Immutable Updates

### Why Immutability Matters

Imagine you're working on a collaborative document (like Google Docs). If you change the original document, everyone sees the change immediately — even if they weren't ready. Immutability means you always make a **copy** of the document with your changes, leaving the original intact.

In programming (especially in React, Angular, and Vue), **immutable updates** are a core pattern that prevents bugs and makes your app's state predictable.

```
MUTABLE (bad):                 IMMUTABLE (good):
─────────────────              ───────────────────
Original → Changed!            Original → Unchanged
                               Copy    → Has changes

MUTABLE: Like editing a shared document everyone can see
IMMUTABLE: Like working on your own printed copy
```

### Why Does This Matter?

With mutable data:
- Passing an array to a function and having it unexpectedly change your data
- Debugging which piece of code changed your data (everything had access to it)
- React/Angular can't detect changes if the same object is modified (it checks by reference)

### Immutable Array Updates

```js
const todos = [
  { id: 1, title: "Buy milk",  completed: false },
  { id: 2, title: "Walk dog",  completed: true  },
  { id: 3, title: "Read book", completed: false },
];

// ✅ ADDING a new item (spread the old, add the new):
const addedTodo = [
  ...todos,                                    // All existing todos (spread)
  { id: 4, title: "Call mom", completed: false } // The new one at the end
];
// 'todos' is unchanged, 'addedTodo' is a new array with 4 items

// ✅ REMOVING an item (filter out the unwanted):
const removedTodo = todos.filter((todo) => todo.id !== 2);
// 'todos' is unchanged, 'removedTodo' has items with id 1 and 3 only

// ✅ UPDATING one item (map over all, change the matching one):
const toggledTodo = todos.map((todo) =>
  todo.id === 1
    ? { ...todo, completed: !todo.completed } // Copy todo, flip 'completed'
    : todo                                    // All others stay exactly the same
);
// { id: 1, title: "Buy milk", completed: true } — flipped!
// others unchanged
```

### Immutable Object Updates

```js
const user = { name: "Alice", age: 25, city: "Cairo" };

// ✅ Updating one property:
const updatedUser = {
  ...user,       // Copy ALL existing properties first
  age: 26        // Then override 'age' — later properties win!
};
console.log(updatedUser); // { name: "Alice", age: 26, city: "Cairo" }
console.log(user);        // { name: "Alice", age: 25, city: "Cairo" } ← Untouched!

// ✅ Adding a new property:
const userWithEmail = {
  ...user,
  email: "alice@example.com"
};

// ✅ Removing a property (using destructuring rest):
const { age, ...userWithoutAge } = user;
// userWithoutAge = { name: "Alice", city: "Cairo" } — age excluded

// ✅ Deeply nested update (must spread at each level!):
const state = {
  user: { name: "Alice", settings: { theme: "light", lang: "en" } }
};

const newState = {
  ...state,          // Spread the top level
  user: {
    ...state.user,   // Spread the user level
    settings: {
      ...state.user.settings, // Spread the settings level
      theme: "dark"  // Only this changes — everything else is preserved
    }
  }
};
```

> [!IMPORTANT]
> When doing deep nested updates, you must spread at **every level** that contains something you want to preserve. Forgetting to spread an intermediate level will overwrite everything inside it.

---

## ⚠️ Common Mistakes & How to Avoid Them (Summary)

### Mistake 1: Confusing Rest and Spread

Both use `...` but do opposite things. Context determines which one it is.

```js
// REST — in a function parameter position → COLLECTS into array
function sum(...nums) { /* nums is an array */ }

// SPREAD — in an array/function call position → EXPANDS into individual values
const combined = [...arr1, ...arr2];
Math.max(...numbers);
```

### Mistake 2: Mutating Arrays Instead of Copying

```js
// ❌ Wrong: sort() mutates the original
const sorted = myArray.sort();

// ✅ Correct: toSorted() returns a new array
const sorted = myArray.toSorted();

// ❌ Wrong: Directly assigning to an object in an array
todos[0].completed = true; // Mutates!

// ✅ Correct: Use map() + spread for immutable update
const updated = todos.map(t => t.id === 0 ? { ...t, completed: true } : t);
```

### Mistake 3: Chaining Array Methods Without Understanding Order

```js
const products = [{ name: "A", price: 5 }, { name: "B", price: 15 }];

// ❌ Wrong order — map transforms first, then filter can't find category
const expensive = products
  .map(p => p.name)          // Now just strings — no more price!
  .filter(p => p.price > 10); // p.price is undefined!

// ✅ Correct: filter THEN map
const expensive = products
  .filter(p => p.price > 10) // Keep expensive items (as objects)
  .map(p => p.name);         // Then extract just the names
```

---

## 🧪 Practice Labs

### Lab 1: Data Transformation Pipeline (30 min)

**Goal:** Use `map()`, `filter()`, and `reduce()` together.

```js
// Given this data:
const employees = [
  { name: "Alice", department: "Engineering", salary: 95000, active: true  },
  { name: "Bob",   department: "Marketing",   salary: 72000, active: true  },
  { name: "Carol", department: "Engineering", salary: 110000, active: false },
  { name: "Dave",  department: "Marketing",   salary: 85000, active: true  },
  { name: "Eve",   department: "Engineering", salary: 88000, active: true  },
];

// Tasks:
// 1. Get the total salary budget for ACTIVE Engineering employees only
// 2. Get a list of all active employee names (sorted A-Z)
// 3. Build an object: { Engineering: avgSalary, Marketing: avgSalary }
```

### Lab 2: Student Record System (30 min)

**Goal:** Practice objects, destructuring, and immutable updates.

```js
// Implement these functions:
// addStudent(students, newStudent) → returns new array with student added
// removeStudent(students, id) → returns new array with student removed
// updateGrade(students, id, grade) → returns new array with grade updated
// getTopStudents(students, n) → returns top n students by average grade
```

---

## 📌 Final Lecture Recap

- **Functions** are reusable blocks; use declarations for top-level, arrows for callbacks.
- **Default parameters** handle missing args; **rest** collects args; **spread** expands iterables.
- **Higher-order functions** accept/return functions — they power all array iteration methods.
- **Arrays** are zero-indexed ordered lists; prefer non-mutating methods (`toSorted`, `toSpliced`).
- **`map()`** transforms, **`filter()`** selects, **`reduce()`** aggregates, **`find()`** locates.
- **Objects** are key-value stores; access with dot or bracket notation.
- **Destructuring** unpacks values cleanly in one line.
- **Immutable updates** use spread operator to preserve original data.

---

**Next Lecture:** [Lecture 11 — DOM Manipulation & Events](./11%20-%20DOM%20Manipulation%20%26%20Events.md)
