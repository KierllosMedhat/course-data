# 09 — JavaScript Basics: Syntax, Types & Control Flow

**Course:** Fullstack Web Development  
**Instructor:** [Instructor Name]  
**Duration:** 3 hours (lecture) + 1.5 hours (labs)

---

## Table of Contents

1. [Learning Objectives](#learning-objectives)
2. [Agenda](#agenda)
3. [What is JavaScript?](#1-what-is-javascript)
4. [How JavaScript Runs in the Browser](#2-how-javascript-runs-in-the-browser)
5. [The Console Object](#3-the-console-object)
6. [Variables: var, let, and const](#4-variables-var-let-and-const)
7. [Primitive Data Types](#5-primitive-data-types)
8. [The typeof Operator](#6-the-typeof-operator)
9. [Template Literals](#7-template-literals)
10. [Reference Types: Objects & Arrays](#8-reference-types-objects--arrays)
11. [Type Coercion](#9-type-coercion)
12. [Truthy and Falsy Values](#10-truthy-and-falsy-values)
13. [Operators](#11-operators)
14. [Conditionals](#12-conditionals)
15. [Loops](#13-loops)
16. [Lab 1: Console Calculator](#lab-1-console-calculator-with-switch-45-min)
17. [Lab 2: Number Guessing Game](#lab-2-number-guessing-game-45-min)
18. [Assignment: TaskFlow Project Part 1](#assignment-taskflow-project-part-1)
19. [Key Takeaways](#key-takeaways)
20. [Resources](#resources)
21. [Common Mistakes & How to Avoid Them](#common-mistakes--how-to-avoid-them)

---

## Learning Objectives

By the end of this lecture, you will be able to:

- [ ] Explain what JavaScript is and where it runs
- [ ] Link a JavaScript file to an HTML page using `<script>` with `defer` and `async`
- [ ] Use the browser console to debug and log output
- [ ] Declare variables using `var`, `let`, and `const` — and know when to use each
- [ ] Identify and work with all seven primitive data types
- [ ] Use the `typeof` operator to inspect values at runtime
- [ ] Write template literals with embedded expressions
- [ ] Understand the difference between primitive and reference types
- [ ] Explain implicit and explicit type coercion with examples
- [ ] List all eight falsy values from memory
- [ ] Use arithmetic, comparison, and logical operators correctly
- [ ] Use `===` (strict equality) instead of `==` (loose equality) and explain why
- [ ] Use nullish coalescing (`??`) and optional chaining (`?.`)
- [ ] Write `if / else if / else`, `switch`, and ternary conditional statements
- [ ] Write `for`, `while`, `do...while`, `for...of`, and `for...in` loops
- [ ] Use `break` and `continue` to control loop flow

---

## Agenda

| Time        | Topic                                      |
|-------------|--------------------------------------------|
| 0:00–0:15   | What is JavaScript? The role in web dev    |
| 0:15–0:30   | How JS runs in the browser (defer/async)   |
| 0:30–0:45   | The Console object                         |
| 0:45–1:15   | Variables: var, let, const + scope         |
| 1:15–1:40   | Primitive types + typeof                   |
| 1:40–1:55   | Template literals + reference types        |
| 1:55–2:20   | Type coercion, truthy/falsy, operators     |
| 2:20–2:50   | Conditionals (if, switch, ternary)         |
| 2:50–3:00   | Loops overview                             |
| 3:00–3:45   | Lab 1: Console Calculator                  |
| 3:45–4:30   | Lab 2: Number Guessing Game                |

---

## 1. What is JavaScript?

### 1.1 Plain English Explanation

Imagine a web page is a restaurant. 

- **HTML** is the **menu** — it lists what's available and gives structure.
- **CSS** is the **interior design** — it makes everything look attractive.
- **JavaScript** is the **waiter** — it responds to what the customer (user) does, takes requests, communicates with the kitchen (server), and updates the experience dynamically.

Without JavaScript, every web page would be a static document — like a printed brochure. With JavaScript, pages become interactive applications.

**JavaScript (JS)** is a programming language that was originally created in 1995 (in just 10 days!) by Brendan Eich at Netscape. It was designed to run inside web browsers, making pages interactive.

### 1.2 Where Does JavaScript Run?

JavaScript doesn't run "on its own" — it always runs inside an **environment** called a **runtime**. Two major runtimes exist:

```
┌───────────────────────────────────────────────────────┐
│                   JavaScript Runtimes                 │
│                                                       │
│   ┌─────────────────────┐   ┌─────────────────────┐  │
│   │     BROWSER         │   │      NODE.JS         │  │
│   │  (Chrome, Firefox)  │   │  (Server / Terminal) │  │
│   │                     │   │                      │  │
│   │  • Has: DOM API     │   │  • Has: File System  │  │
│   │  • Has: window obj  │   │  • Has: HTTP module  │  │
│   │  • Has: fetch API   │   │  • Has: npm          │  │
│   │  • No: file system  │   │  • No: DOM / window  │  │
│   └─────────────────────┘   └─────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

**Browser JS** (what we learn first):
- Runs inside Chrome, Firefox, Safari, Edge
- Can manipulate HTML/CSS (via the DOM)
- Can respond to user events (clicks, typing)
- Can make network requests (fetch API)

**Node.js** (what we'll use later in the course):
- Runs on a server or your local machine
- Can read/write files, start HTTP servers
- Powers tools like webpack, npm, Express.js

> [!NOTE]
> For this module, we focus entirely on **browser JavaScript**. Everything we write will run in the browser tab.

### 1.3 Why Does JavaScript Matter?

> **"Why does this matter?"**

JavaScript is the **only** programming language natively understood by browsers. If you want interactivity on the web — form validation, dropdown menus, live chat, infinite scroll, drag-and-drop — you need JavaScript. It's not optional; it's fundamental.

As of 2024, JavaScript is consistently ranked #1 in developer surveys (Stack Overflow) for the 11th year running.

### Section 1 Recap

- JavaScript is the programming language of the web
- It adds interactivity and dynamic behavior to pages
- It runs in two main environments: browsers and Node.js
- Browsers give JS access to the DOM; Node.js gives access to the file system

---

## 2. How JavaScript Runs in the Browser

### 2.1 The HTML Parsing Process — Step by Step

When you type a URL and press Enter, your browser does this:

```
Step 1: Browser requests the HTML file from the server
Step 2: Browser starts reading (parsing) the HTML from top to bottom
Step 3: When it finds a <script> tag, it pauses HTML parsing
Step 4: It downloads and executes the JavaScript file
Step 5: After the script finishes, HTML parsing resumes
Step 6: The page is fully loaded and visible to the user
```

**The Problem:** If your JS file is large, Step 4 takes a long time. The user sees a blank page while waiting.

### 2.2 Linking a JavaScript File

In your HTML, you link a JS file using the `<script>` tag:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Page</title>

  <!-- ❌ BAD: This blocks HTML parsing while downloading JS -->
  <script src="app.js"></script>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

### 2.3 The `defer` Attribute

The `defer` attribute tells the browser: *"Download this script in the background while you keep parsing HTML. Run it only after the HTML is fully parsed."*

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Page</title>

  <!-- ✅ GOOD: Downloads in background, runs after HTML is ready -->
  <script src="app.js" defer></script>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

**Defer Timeline:**
```
HTML Parsing: [=============================>] Done!
Script Download:     [==========>]
Script Execution:                             [===] ← runs here (after HTML)
```

**Key properties of `defer`:**
- Scripts execute **in order** if there are multiple deferred scripts
- Executes **after** the entire HTML document is parsed
- Best choice for scripts that interact with the DOM

### 2.4 The `async` Attribute

The `async` attribute tells the browser: *"Download this script in the background AND run it as soon as it's downloaded — interrupt HTML parsing if needed."*

```html
<!-- ⚠️ ASYNC: Runs as soon as downloaded, order not guaranteed -->
<script src="analytics.js" async></script>
```

**Async Timeline:**
```
HTML Parsing: [======>] PAUSED [==========>] Continue...
Script Download:   [=====>]
Script Execution:          [==] ← runs immediately when downloaded (may interrupt)
```

**Key properties of `async`:**
- Scripts can execute **out of order**
- Interrupts HTML parsing when ready
- Best for **independent scripts** that don't touch the DOM (e.g., analytics)

### 2.5 Comparison Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    <script> Attribute Comparison                    │
│                                                                     │
│  No attribute:                                                      │
│  HTML: [====>] STOP                          [===========>] Done   │
│  Script:       [Download][Execute]                                  │
│                                                                     │
│  defer:                                                             │
│  HTML: [=================================================>] Done   │
│  Script:    [Download in bg         ]        [Execute]              │
│                                                                     │
│  async:                                                             │
│  HTML: [=========>] STOP [=========================>] Done         │
│  Script:    [Download  ][Execute]                                   │
└─────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Use `defer` for almost everything.** It's the safest choice because it guarantees your HTML exists before your JS runs, and it preserves script execution order.

> [!TIP]
> Use `async` only for third-party scripts that are independent — like Google Analytics, ads, or chat widgets that don't depend on your own code.

### Section 2 Recap

- Browsers parse HTML top-to-bottom; a `<script>` without attributes blocks parsing
- `defer` downloads in background, executes after HTML is fully parsed — **use this by default**
- `async` downloads in background, executes immediately when ready — may interrupt parsing
- Multiple `defer` scripts maintain order; multiple `async` scripts do not

---

## 3. The Console Object

### 3.1 What is the Console?

Every browser has a built-in **Developer Tools** panel. Inside it is the **Console** — a window where JavaScript can print messages, show errors, and display data.

Think of the console as JavaScript's **diary** — it's where JS writes down what it's doing, so you (the developer) can read it.

> [!TIP]
> **How to open the Console:**  
> - Chrome / Firefox / Edge: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)  
> - Then click the **Console** tab

### 3.2 `console.log()` — Your Most Used Tool

`console.log()` prints a value to the console. This is the developer equivalent of a sticky note that says "hey, check this value!"

```js
// Print a simple message — useful to confirm code is running
console.log("Hello, World!");

// Print a number
console.log(42);

// Print multiple values at once — separate with commas
console.log("My name is", "Alice", "and I am", 30, "years old");

// Print the result of a calculation
console.log(10 + 5); // outputs: 15

// Print a variable (we'll learn variables next!)
let myName = "Bob";
console.log("Name:", myName); // outputs: Name: Bob
```

### 3.3 `console.error()` — For Error Messages

`console.error()` prints a message in **red** with an error icon. Use it to highlight problems.

```js
// This shows up in red in the console
console.error("Something went wrong!");

// Useful for error handling (we'll cover this later in the course)
let userAge = -5;
if (userAge < 0) {
  console.error("Age cannot be negative:", userAge);
}
```

### 3.4 `console.warn()` — For Warnings

```js
// Shows up in yellow — a warning, not necessarily a crash
console.warn("This feature is deprecated and will be removed in v2.0");
```

### 3.5 `console.table()` — For Structured Data

`console.table()` displays arrays and objects as a formatted table in the console — much easier to read than a wall of text.

```js
// Display an array as a table
let fruits = ["Apple", "Banana", "Cherry"];
console.table(fruits);
// Output: nicely formatted table with Index and Values columns

// Display an array of objects as a table
let students = [
  { name: "Alice", grade: "A" },
  { name: "Bob",   grade: "B" },
  { name: "Carol", grade: "A+" }
];
console.table(students);
// Output: table with name and grade columns
```

### 3.6 `console.group()` — For Organizing Output

```js
// Group related console messages together
console.group("User Info"); // starts a collapsible group
  console.log("Name: Alice");
  console.log("Age: 30");
  console.log("Role: Admin");
console.groupEnd(); // ends the group
```

> [!NOTE]
> You can also run JavaScript directly in the console! Just click in the console area, type any JS expression, and press Enter. This is great for quick experiments.

### Section 3 Recap

- The browser console is your primary debugging tool
- `console.log()` — prints normal info; use constantly while developing
- `console.error()` — prints red error messages
- `console.warn()` — prints yellow warnings
- `console.table()` — beautifully formats arrays and objects
- Open DevTools with `F12` or `Ctrl+Shift+I`

---

## 4. Variables: var, let, and const

### 4.1 What is a Variable?

A variable is a **named container** for storing data.

**Real-world analogy:** Imagine a labeled box. You write "Score" on the box (the variable name) and put the number `0` inside (the value). Later you can look inside the box, change the value inside, or use the value in a calculation.

```
  ┌──────────────┐
  │   score      │  ← variable NAME (the label on the box)
  │   ─────────  │
  │     0        │  ← variable VALUE (what's inside the box)
  └──────────────┘
```

### 4.2 Declaring Variables

In JavaScript, there are three keywords to create (declare) a variable:
- `var` — the old way (avoid in modern JS)
- `let` — modern, for values that change
- `const` — modern, for values that **cannot** be reassigned

### 4.3 `let` — For Values That Change

```js
// Declare a variable called 'score' and assign the value 0
let score = 0;

// Print the current value
console.log(score); // 0

// Update the value — this is called reassignment
score = 10;
console.log(score); // 10

// You can also declare first, then assign later
let playerName;          // declared (value is 'undefined' for now)
playerName = "Alice";   // assigned later
console.log(playerName); // Alice
```

### 4.4 `const` — For Values That DON'T Change

```js
// Declare a constant — the value can NEVER be reassigned
const PI = 3.14159;
const MAX_USERS = 100;
const APP_NAME = "TaskFlow";

console.log(PI);       // 3.14159
console.log(MAX_USERS); // 100

// ❌ This will throw a TypeError!
// PI = 3; // TypeError: Assignment to constant variable.
```

> [!IMPORTANT]
> **Default to `const`.** Only use `let` if you know the value will change. This prevents accidental reassignment and makes code easier to understand.

### 4.5 `var` — The Old Way (and Why It's Problematic)

`var` was the only way to declare variables before ES6 (2015). It has two major problems that were fixed by `let` and `const`:

**Problem 1: Function scope instead of block scope**

```js
// var is scoped to the entire FUNCTION, not just the block {} it's in
if (true) {
  var message = "Hello from var"; // declared inside {}
}
console.log(message); // "Hello from var" ← leaks OUTSIDE the block!

// let/const are BLOCK scoped — they stay inside {}
if (true) {
  let greeting = "Hello from let";
}
// console.log(greeting); // ❌ ReferenceError: greeting is not defined
```

**Problem 2: Hoisting (dangerous behavior)**

```js
// var gets "hoisted" — moved to the top of its scope
// This doesn't crash, but prints 'undefined' instead of an error:
console.log(myVar); // undefined (not an error — confusing!)
var myVar = "surprise";

// let/const also hoist, but stay in the "Temporal Dead Zone" (TDZ)
// Accessing them before declaration throws a clear ReferenceError:
// console.log(myLet); // ❌ ReferenceError: Cannot access before init
let myLet = "clear error";
```

### 4.6 Block Scope Explained

A **block** is any code between `{` and `}`. This includes `if` statements, loops, and function bodies.

```
┌─────────────────────────────────────────────────────────┐
│  FUNCTION or FILE scope (var lives here)                │
│                                                         │
│  let x = 10;   // accessible anywhere in this block    │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  if (true) {    ← new BLOCK starts here          │  │
│  │                                                   │  │
│  │    let y = 20;  // only accessible in THIS block  │  │
│  │    var z = 30;  // leaks out to function scope!   │  │
│  │                                                   │  │
│  │  }              ← block ends here                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  console.log(x); // ✅ works                            │
│  console.log(z); // ✅ works (var leaked out!)          │
│  console.log(y); // ❌ ReferenceError (let is blocked)  │
└─────────────────────────────────────────────────────────┘
```

### 4.7 Hoisting Deep Dive

**Hoisting** means JavaScript "lifts" variable and function declarations to the top of their scope before code runs.

```js
// What you WRITE:
console.log(a); // undefined
var a = 5;

// What JavaScript actually RUNS (mentally):
var a;          // declaration hoisted to top
console.log(a); // undefined (not yet assigned)
a = 5;          // assignment stays in place
```

**Temporal Dead Zone (TDZ) for `let` and `const`:**

`let` and `const` are also technically hoisted, but they sit in a **"Temporal Dead Zone"** from the start of the block until their declaration is reached. Accessing them in the TDZ throws a `ReferenceError`.

```js
// TDZ starts here ↓
console.log(myConst); // ❌ ReferenceError: Cannot access 'myConst' before initialization
const myConst = 42;   // TDZ ends here ← declaration reached
console.log(myConst); // ✅ 42
```

```
┌─────────────────────────────────────────────────────────┐
│  Block Start                                            │
│    ↑                                                    │
│    │  ← TDZ for 'name' (cannot access here)            │
│    │                                                    │
│    │  console.log(name); // ❌ ReferenceError           │
│    │                                                    │
│  let name = "Alice"; // ← TDZ ENDS HERE                 │
│                                                         │
│  console.log(name); // ✅ "Alice"                       │
│  Block End                                              │
└─────────────────────────────────────────────────────────┘
```

### 4.8 Naming Rules for Variables

```js
// ✅ Valid variable names
let myName = "Alice";
let score1 = 100;
let _private = true;
let $element = null;
let camelCaseIsConvention = "yes"; // use camelCase in JS

// ❌ Invalid variable names
// let 1score = 0;    // cannot start with a number
// let my-name = "";  // hyphens are not allowed
// let let = "hi";   // reserved word
// let class = "A";  // reserved word
```

> [!NOTE]
> **Naming convention:** JavaScript uses **camelCase** (e.g., `myVariableName`). Constants are often in `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`).

### Section 4 Recap

- Variables are named containers for data
- `const` is the default — use when value won't change
- `let` is for values that need to change
- Avoid `var` — it has function scope and dangerous hoisting behavior
- Block scope: `let`/`const` are trapped inside `{}` blocks
- Hoisting: `var` becomes `undefined` before assignment; `let`/`const` throw a clear error (TDZ)

---

## 5. Primitive Data Types

### 5.1 What is a Data Type?

Every value in JavaScript has a **type** — a category that tells the language what kind of data it is and what operations are valid on it.

**Real-world analogy:** Think of types like containers at a recycling plant. A glass bottle, an aluminum can, and a cardboard box all hold different things, are processed differently, and can't be mixed up. Similarly, a number `42` and a string `"42"` look similar but behave very differently in JavaScript.

JavaScript has **7 primitive types** and **1 reference type** (Object). We cover primitives now.

### 5.2 String — Text Data

A **string** is a sequence of characters (letters, numbers, symbols) enclosed in quotes.

```js
// Three ways to create a string:
let single   = 'Hello, World!';         // single quotes
let double   = "Hello, World!";         // double quotes
let template = `Hello, ${"World"}!`;   // backticks (template literals — covered later)

// Strings can contain numbers, but they're still text
let zipCode = "10001";  // this is a string, NOT a number

// String length property — how many characters?
let name = "Alice";
console.log(name.length); // 5

// Accessing individual characters (index starts at 0)
console.log(name[0]); // "A"  (first character)
console.log(name[4]); // "e"  (fifth character)

// Combining (concatenating) strings with +
let firstName = "John";
let lastName  = "Doe";
let fullName  = firstName + " " + lastName;
console.log(fullName); // "John Doe"

// Common string methods
let message = "  Hello, World!  ";
console.log(message.trim());          // "Hello, World!"  — removes whitespace
console.log(message.toUpperCase());   // "  HELLO, WORLD!  "
console.log(message.toLowerCase());   // "  hello, world!  "
console.log(message.includes("World")); // true
console.log(message.replace("World", "JavaScript")); // "  Hello, JavaScript!  "
```

### 5.3 Number — Numeric Data

JavaScript has only **one** numeric type called `Number`. It handles both whole numbers (integers) and decimals (floating-point).

```js
// Integers (whole numbers)
let age    = 25;
let year   = 2024;
let score  = -10;  // negative numbers are fine

// Floats (decimal numbers)
let price  = 9.99;
let pi     = 3.14159;
let temp   = -4.5;

// Special numeric values
console.log(Infinity);  // Infinity (result of 1/0)
console.log(-Infinity); // -Infinity
console.log(NaN);       // NaN = "Not a Number" (result of bad math like "abc" * 2)

// NaN is weird — it's a Number type but means "invalid math"
console.log(typeof NaN);     // "number" (confusing but true!)
console.log(isNaN("hello")); // true — checks if something is NaN
console.log(isNaN(42));      // false

// Number limits
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991
```

> [!WARNING]
> **Floating point precision:** Computers store decimals in binary, which causes tiny rounding errors. Never rely on exact floating point equality!
> ```js
> console.log(0.1 + 0.2); // 0.30000000000000004 (NOT 0.3!)
> console.log(0.1 + 0.2 === 0.3); // false ← surprise!
> ```

### 5.4 Boolean — True or False

A **boolean** has only two possible values: `true` or `false`.

**Real-world analogy:** A light switch. It's either ON (true) or OFF (false). No in-between.

```js
// Direct boolean values
let isLoggedIn = true;
let isAdmin    = false;
let hasAccount = true;

// Booleans from comparisons
let age = 18;
let isAdult = age >= 18; // evaluates to true
console.log(isAdult);    // true

// Booleans in conditions
if (isLoggedIn) {
  console.log("Welcome back!");
} else {
  console.log("Please log in.");
}
```

### 5.5 null — Intentional "Nothing"

`null` means "this variable intentionally has no value." It's the explicit absence of a value.

**Real-world analogy:** An empty drawer that someone specifically emptied. The drawer exists, but its contents were deliberately removed.

```js
// null represents the intentional absence of a value
let selectedUser = null; // no user selected yet

// Later, when a user is selected:
selectedUser = { name: "Alice", id: 42 };

// Checking for null
if (selectedUser === null) {
  console.log("No user selected");
} else {
  console.log("User:", selectedUser.name);
}
```

> [!WARNING]
> **Famous bug:** `typeof null` returns `"object"`, not `"null"`. This is a historical bug in JavaScript that was never fixed to avoid breaking old code. Don't let it trip you up!
> ```js
> console.log(typeof null); // "object" ← BUG in JS, not your mistake
> ```

### 5.6 undefined — Unintentional "Nothing"

`undefined` means "this variable was declared but never given a value."

**Real-world analogy:** A drawer that was installed but never given anything to store. The drawer exists (variable declared) but nothing was ever put in it.

```js
// Declared but not assigned — automatically undefined
let favoriteColor;
console.log(favoriteColor); // undefined

// Function parameters not provided — undefined
function greet(name) {
  console.log("Hello,", name); // if name not provided, prints: Hello, undefined
}
greet(); // Hello, undefined

// Accessing an object property that doesn't exist — undefined
let person = { name: "Alice" };
console.log(person.age); // undefined (no 'age' property)
```

**null vs undefined — Key Distinction:**

```
null       = "I intentionally set this to nothing"  (programmer's choice)
undefined  = "This was never assigned"              (JavaScript's default)
```

### 5.7 Symbol — Unique Identifiers

Symbols are guaranteed to be **unique** every time they're created. Even two symbols with the same description are different.

```js
// Create a symbol — the string is just a label for debugging
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(id1 === id2); // false — they are always unique!
console.log(typeof id1);  // "symbol"

// Symbols are often used as unique keys in objects (advanced topic)
```

> [!NOTE]
> Symbols are an advanced concept. You won't use them often as a beginner, but knowing they exist is important.

### 5.8 BigInt — Very Large Integers

`BigInt` handles integers larger than `Number.MAX_SAFE_INTEGER`. Add `n` to the end of a number to make it a BigInt.

```js
// Regular Number max safe integer
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

// BigInt can handle much larger numbers — append 'n'
const bigNumber = 9007199254740992n; // the 'n' makes it a BigInt
const anotherBig = BigInt("12345678901234567890");

console.log(bigNumber);  // 9007199254740992n
console.log(typeof bigNumber); // "bigint"

// ❌ You cannot mix BigInt and regular Number
// const result = bigNumber + 5; // TypeError!
const result = bigNumber + 5n; // ✅ must use 5n
```

### Section 5 Recap

| Type        | Example Values                  | When Used                               |
|-------------|--------------------------------|-----------------------------------------|
| `string`    | `"hello"`, `'world'`           | Text, names, messages                   |
| `number`    | `42`, `3.14`, `NaN`            | Calculations, ages, prices              |
| `boolean`   | `true`, `false`                | Conditions, flags, on/off states        |
| `null`      | `null`                          | Intentional emptiness                   |
| `undefined` | `undefined`                     | Unassigned values, missing args         |
| `symbol`    | `Symbol("id")`                 | Unique keys, advanced use               |
| `bigint`    | `9007199254740992n`            | Very large integers                     |

---

## 6. The `typeof` Operator

### 6.1 What is `typeof`?

`typeof` is a built-in operator that tells you the **type** of a value. Think of it as asking "what kind of thing is this?"

**Real-world analogy:** Like scanning items at a store. You scan something and the machine tells you: "this is a produce item," "this is a beverage," etc.

```js
// typeof returns a STRING describing the type
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof 3.14);        // "number"
console.log(typeof true);        // "boolean"
console.log(typeof false);       // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"  ← historical bug!
console.log(typeof Symbol());    // "symbol"
console.log(typeof 123n);        // "bigint"
console.log(typeof {});          // "object"
console.log(typeof []);          // "object"  ← arrays are objects
console.log(typeof function(){}); // "function"
```

> [!WARNING]
> Two `typeof` surprises to memorize:
> - `typeof null` returns `"object"` — it's a **bug** that was never fixed
> - `typeof []` returns `"object"` — arrays are a special kind of object
>
> To properly check for `null`, use strict equality: `value === null`  
> To properly check for an array, use: `Array.isArray(value)`

### 6.2 Practical Use of `typeof`

```js
// Useful for checking if a variable has been assigned
function processInput(input) {
  // Guard clause: check if input was provided
  if (typeof input === "undefined") {
    console.error("No input provided!");
    return; // exit the function early
  }
  console.log("Processing:", input);
}

processInput();         // No input provided!
processInput("hello");  // Processing: hello

// Check before using a value
let userAge = "twenty"; // someone passed a string instead of a number

if (typeof userAge !== "number") {
  console.warn("Expected a number, got:", typeof userAge);
}
```

### Section 6 Recap

- `typeof` returns a string describing the type of a value
- Returns: `"string"`, `"number"`, `"boolean"`, `"undefined"`, `"object"`, `"symbol"`, `"bigint"`, `"function"`
- `typeof null === "object"` — a historical bug, always check null with `=== null`
- `typeof [] === "object"` — use `Array.isArray()` to detect arrays

---

## 7. Template Literals

### 7.1 The Problem with String Concatenation

Before template literals, combining strings and variables was tedious and error-prone:

```js
let name  = "Alice";
let score = 95;
let grade = "A";

// ❌ Old way — hard to read, easy to miss spaces or quotes
let message = "Student " + name + " scored " + score + " and earned a grade of " + grade + ".";
console.log(message);
// "Student Alice scored 95 and earned a grade of A."
```

### 7.2 Template Literals (Backtick Strings)

Template literals use **backticks** (`` ` ``) instead of quotes and allow:
- **Embedded expressions** using `${...}`
- **Multi-line strings** without special characters
- **Tagged templates** (advanced)

```js
let name  = "Alice";
let score = 95;
let grade = "A";

// ✅ Template literal — clean and readable
let message = `Student ${name} scored ${score} and earned a grade of ${grade}.`;
console.log(message);
// "Student Alice scored 95 and earned a grade of A."

// You can put ANY JavaScript expression inside ${}
let a = 10;
let b = 20;
console.log(`The sum of ${a} and ${b} is ${a + b}.`); // The sum of 10 and 20 is 30.
console.log(`Is ${a} greater than ${b}? ${a > b}`);    // Is 10 greater than 20? false

// Multi-line strings — just press Enter inside the backticks
let poem = `Roses are red,
Violets are blue,
JavaScript is cool,
And so are you!`;
console.log(poem);

// Calling functions inside ${}
let price = 19.99;
console.log(`Total: $${price.toFixed(2)}`); // Total: $19.99
// .toFixed(2) formats the number with exactly 2 decimal places

// Nested template literals (though use carefully for readability)
let isAdmin = true;
console.log(`Role: ${isAdmin ? "Administrator" : "Guest"}`); // Role: Administrator
```

> [!TIP]
> **Always prefer template literals** over string concatenation (`+`). They're easier to read, support multi-line text, and allow complex expressions.

### Section 7 Recap

- Template literals use backticks `` ` `` instead of `'` or `"`
- Embed any JS expression with `${expression}`
- Support natural multi-line strings without `\n`
- Much more readable than string concatenation

---

## 8. Reference Types: Objects & Arrays

### 8.1 Primitives vs. Reference Types

Primitive types store their value **directly** in the variable. Reference types store a **reference (address)** to where the value lives in memory.

```
Primitive:                      Reference:
┌──────────────────┐           ┌──────────────────┐      ┌─────────────────┐
│  let a = 42      │           │  let obj = {...}  │ ───► │  { name: "A" }  │
│  value: 42       │           │  value: 0x1A2B    │      │  (in memory)    │
└──────────────────┘           └──────────────────┘      └─────────────────┘
```

This distinction matters for **copying** and **comparing** values.

### 8.2 Objects

An **object** is a collection of **key-value pairs**. Think of it like a form with labeled fields.

**Real-world analogy:** A contact card. It has labeled fields (name, phone, email) with corresponding values.

```js
// Create an object using curly braces {}
let person = {
  name: "Alice",          // key: "name", value: "Alice"
  age: 30,                // key: "age", value: 30
  isStudent: false,       // key: "isStudent", value: false
  address: {              // values can be other objects (nested objects)
    city: "New York",
    country: "USA"
  }
};

// Access properties using DOT notation
console.log(person.name);         // "Alice"
console.log(person.age);          // 30
console.log(person.address.city); // "New York"

// Access properties using BRACKET notation (useful for dynamic keys)
let key = "name";
console.log(person[key]); // "Alice"

// Add a new property
person.email = "alice@example.com";
console.log(person.email); // "alice@example.com"

// Modify a property
person.age = 31;
console.log(person.age); // 31

// Delete a property
delete person.isStudent;
console.log(person.isStudent); // undefined (property is gone)
```

### 8.3 Arrays

An **array** is an **ordered list** of values. Each value has a numeric index starting at 0.

**Real-world analogy:** A numbered shopping list. Item 1 is at position 0, item 2 is at position 1, etc.

```js
// Create an array using square brackets []
let fruits = ["Apple", "Banana", "Cherry", "Date"];
//   index:     [0]       [1]       [2]      [3]

// Access by index (starts at 0)
console.log(fruits[0]);  // "Apple"
console.log(fruits[2]);  // "Cherry"
console.log(fruits[10]); // undefined (out of range)

// Array length
console.log(fruits.length); // 4

// Last element (common pattern)
console.log(fruits[fruits.length - 1]); // "Date"

// Modify an element
fruits[1] = "Blueberry";
console.log(fruits); // ["Apple", "Blueberry", "Cherry", "Date"]

// Add to end
fruits.push("Elderberry");
console.log(fruits); // ["Apple", "Blueberry", "Cherry", "Date", "Elderberry"]

// Remove from end
let last = fruits.pop();
console.log(last);   // "Elderberry"

// Add to beginning
fruits.unshift("Avocado");
console.log(fruits[0]); // "Avocado"

// Remove from beginning
let first = fruits.shift();
console.log(first); // "Avocado"

// Arrays can hold mixed types (but usually avoid this)
let mixed = [1, "hello", true, null, { name: "Alice" }];
```

> [!NOTE]
> We'll do a deep dive into array methods (`map`, `filter`, `reduce`, etc.) in a later lecture. For now, focus on creating arrays, accessing elements, and understanding push/pop.

### Section 8 Recap

- Objects are key-value pairs accessed with dot or bracket notation
- Arrays are ordered lists accessed by numeric index (starting at 0)
- Both are **reference types** — variables hold a reference to the data in memory, not the data itself
- `push()` adds to end, `pop()` removes from end, `unshift()` adds to start, `shift()` removes from start

---

## 9. Type Coercion

### 9.1 What is Type Coercion?

**Type coercion** is when JavaScript automatically converts one type to another behind the scenes. It happens when you mix incompatible types in an operation.

**Real-world analogy:** Imagine you ask someone "how old are you?" and they write "25" on a piece of paper. The paper says "25" (a string), but you understand it as the number 25. You automatically coerce the type in your head. JavaScript does something similar — but with surprising results.

### 9.2 Implicit Coercion — The Automatic Kind

```js
// String + Number → String concatenation (number becomes string)
console.log("5" + 3);    // "53"  (NOT 8! — 3 is converted to "3")
console.log("Hello" + 5); // "Hello5"

// String - Number → Number subtraction (string becomes number)
console.log("10" - 3);   // 7   (surprising but consistent rule)
console.log("10" * 2);   // 20
console.log("10" / 2);   // 5

// Boolean in math context
console.log(true + 1);   // 2   (true → 1)
console.log(false + 1);  // 1   (false → 0)
console.log(true + true); // 2

// null in math context
console.log(null + 1);   // 1   (null → 0)
console.log(null + "hi"); // "nullhi" ← coerces to string

// undefined in math context
console.log(undefined + 1); // NaN (can't convert undefined to a number)
```

**The Rule for `+`:**
```
If EITHER operand is a string → concatenation (join as text)
If NEITHER operand is a string → addition (math)
```

**For `-`, `*`, `/`:**
```
Always tries to convert to numbers first
```

### 9.3 Explicit Coercion — The Manual Kind

Sometimes you want to convert types on purpose. Use these functions:

```js
// Convert to String
String(42);         // "42"
String(true);       // "true"
String(null);       // "null"
String(undefined);  // "undefined"
(42).toString();    // "42"

// Convert to Number
Number("42");       // 42
Number("3.14");     // 3.14
Number("42abc");    // NaN  (invalid number string)
Number("");         // 0    (empty string → 0, surprising!)
Number(true);       // 1
Number(false);      // 0
Number(null);       // 0
Number(undefined);  // NaN

parseInt("42px");   // 42   (parses up to non-numeric character)
parseFloat("3.14 meters"); // 3.14

// Convert to Boolean — use !! (double negation) or Boolean()
Boolean(0);         // false
Boolean("");        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false
Boolean(1);         // true
Boolean("hello");   // true
Boolean({});        // true  (empty object is truthy!)
Boolean([]);        // true  (empty array is truthy!)

// Shorthand with !! (double bang)
!!0;     // false
!!"";    // false
!!"hi";  // true
!!42;    // true
```

### Section 9 Recap

- Implicit coercion: JS automatically converts types — most common with `+` (concatenation vs addition)
- `+` with a string → string concatenation; `-`, `*`, `/` always try numeric conversion
- Explicit coercion: `String()`, `Number()`, `Boolean()`, `parseInt()`, `parseFloat()`
- `Number("")` returns `0` and `Boolean([])` returns `true` — these will surprise you

---

## 10. Truthy and Falsy Values

### 10.1 What are Truthy and Falsy?

In JavaScript, every value has an inherent **boolean equivalent**. When used in a condition (like `if`), values are automatically converted to `true` or `false`.

- A **falsy** value converts to `false` in a boolean context
- A **truthy** value converts to `true` in a boolean context

### 10.2 The 8 Falsy Values — Memorize These!

```js
// These are the ONLY 8 falsy values in JavaScript:
false         // the boolean false
0             // the number zero
-0            // negative zero
0n            // BigInt zero
""            // empty string (single quotes)
''            // empty string (double quotes)
``            // empty template literal
null          // intentional absence
undefined     // uninitialized variable
NaN           // Not a Number

// Everything else is TRUTHY!
```

```
┌─────────────────────────────────────────────────────────┐
│                    FALSY VALUES (8)                     │
│                                                         │
│  false    0    -0    0n    ""    null    undefined    NaN│
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                   TRUTHY (Everything Else)              │
│                                                         │
│  true    1    -1    "0"    " "    []    {}    Infinity  │
│  "false"    function(){}    42    "hello"    Symbol()   │
└─────────────────────────────────────────────────────────┘
```

### 10.3 Common Falsy Traps

```js
// "0" (the STRING "0") is TRUTHY! Only the NUMBER 0 is falsy
if ("0") {
  console.log("This WILL run!"); // ✅ runs because "0" is truthy
}

// An empty array [] is TRUTHY!
if ([]) {
  console.log("This WILL run!"); // ✅ runs because [] is truthy
}

// An empty object {} is TRUTHY!
if ({}) {
  console.log("This WILL run!"); // ✅ runs because {} is truthy
}
```

### 10.4 Using Truthy/Falsy in if Statements

```js
let username = ""; // empty string — falsy

// Instead of: if (username !== "" && username !== null && username !== undefined)
// You can simply write:
if (username) {
  console.log("Welcome,", username);
} else {
  console.log("Please enter a username."); // ← this runs (empty string is falsy)
}

// Checking if an array has items
let tasks = [];
if (tasks.length) {
  console.log("You have tasks!");
} else {
  console.log("No tasks yet."); // ← runs (0 is falsy)
}
```

### Section 10 Recap

- 8 falsy values: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`
- Everything else is truthy — including `"0"`, `[]`, `{}`
- Truthy/falsy checks make `if` statements concise without explicit comparisons

---

## 11. Operators

### 11.1 Arithmetic Operators

```js
// Basic math operators
let a = 10;
let b = 3;

console.log(a + b);   // 13  — addition
console.log(a - b);   // 7   — subtraction
console.log(a * b);   // 30  — multiplication
console.log(a / b);   // 3.3333... — division
console.log(a % b);   // 1   — modulus (remainder after division)
console.log(a ** b);  // 1000 — exponentiation (10 to the power of 3)

// Modulus is great for:
// - Checking even/odd: number % 2 === 0 → even
// - Wrapping values in a range: index % arrayLength
console.log(10 % 2); // 0 — even number
console.log(7 % 2);  // 1 — odd number
```

**Increment and Decrement:**

```js
let count = 5;

// Post-increment: return current value, THEN increment
let a = count++; // a = 5, count = 6
console.log(a, count); // 5, 6

// Pre-increment: increment FIRST, then return new value
let b = ++count; // count = 7, b = 7
console.log(b, count); // 7, 7

// Post-decrement
count--; // count = 6
// Pre-decrement
--count; // count = 5

// Assignment shorthand operators
let x = 10;
x += 5;  // same as: x = x + 5  → x is now 15
x -= 3;  // same as: x = x - 3  → x is now 12
x *= 2;  // same as: x = x * 2  → x is now 24
x /= 4;  // same as: x = x / 4  → x is now 6
x **= 2; // same as: x = x ** 2 → x is now 36
x %= 5;  // same as: x = x % 5  → x is now 1
```

### 11.2 Comparison Operators — `===` vs `==`

> [!IMPORTANT]
> **Always use `===` (strict equality) in JavaScript.** Never use `==` (loose equality) unless you have a very specific reason and you understand exactly what it does.

```js
// === STRICT equality: checks VALUE and TYPE
console.log(5 === 5);     // true  (same value, same type)
console.log(5 === "5");   // false (same value, DIFFERENT type)
console.log(null === undefined); // false (different types)

// == LOOSE equality: coerces types before comparing (avoid this!)
console.log(5 == "5");   // true  (coerces "5" to 5, then compares)
console.log(0 == false); // true  (coerces both to 0)
console.log(null == undefined); // true (special rule)
console.log("" == false); // true (both coerce to 0)

// !== strict not-equal  vs  != loose not-equal
console.log(5 !== "5");  // true  ← use this
console.log(5 != "5");   // false ← avoid this

// Other comparison operators
console.log(10 > 5);   // true
console.log(10 < 5);   // false
console.log(10 >= 10); // true
console.log(10 <= 9);  // false
```

**Why `==` is dangerous:**
```
0 == false   → true  (!)
"" == false  → true  (!)
null == 0    → false (but null == undefined is true!)
```

### 11.3 Logical Operators: `&&`, `||`, `!`

**`&&` — AND: both must be true**
```js
let age  = 25;
let hasID = true;

// && returns the FIRST falsy value, or the LAST value if all are truthy
console.log(age > 18 && hasID);     // true  (both true)
console.log(age > 30 && hasID);     // false (first part is false)
console.log(age > 18 && false);     // false

// Short-circuit: if first part is false, second part never runs
let isAuthenticated = false;
isAuthenticated && console.log("This won't print"); // won't run
```

**`||` — OR: at least one must be true**
```js
// || returns the FIRST truthy value, or the LAST value if all are falsy
let isAdmin = false;
let isModerator = true;

console.log(isAdmin || isModerator); // true
console.log(false || false);         // false

// Practical use: default values
let userName = "";
let displayName = userName || "Guest"; // if userName is falsy, use "Guest"
console.log(displayName); // "Guest"
```

**`!` — NOT: flips the boolean**
```js
console.log(!true);   // false
console.log(!false);  // true
console.log(!0);      // true  (0 is falsy, !falsy = true)
console.log(!"hello"); // false (string is truthy, !truthy = false)

// Double negation !! converts any value to its boolean equivalent
console.log(!!0);      // false
console.log(!!"hello"); // true
console.log(!!null);    // false
```

### 11.4 Nullish Coalescing Operator `??`

The `??` operator returns the right-hand value only if the left-hand value is `null` or `undefined` (unlike `||` which triggers on ANY falsy value).

```js
// Problem with ||: treats 0 and "" as falsy
let userScore = 0;
let displayScore = userScore || "No score"; // "No score" — BUG! 0 is a valid score

// Solution: ?? only triggers on null or undefined
let displayScore2 = userScore ?? "No score"; // 0 — correct!

// More examples
let config = null;
let timeout = config ?? 3000; // 3000 (config is null)
console.log(timeout); // 3000

let serverPort = 0; // 0 is a valid port
let port = serverPort ?? 8080; // 0 (not null/undefined, so use 0)
console.log(port); // 0

let name = undefined;
let greeting = `Hello, ${name ?? "stranger"}!`;
console.log(greeting); // "Hello, stranger!"
```

### 11.5 Optional Chaining `?.`

**The Problem:** Accessing properties of `null` or `undefined` throws a `TypeError`.

```js
let user = null;
// console.log(user.name); // ❌ TypeError: Cannot read properties of null

// Old solution: nested if checks
if (user && user.address && user.address.city) {
  console.log(user.address.city);
}
```

**The Solution — Optional Chaining `?.`:**

```js
let user = null;

// ?. safely accesses properties — returns undefined if any part is null/undefined
console.log(user?.name);              // undefined (no crash!)
console.log(user?.address?.city);     // undefined (no crash!)

// Works with methods too
let data = null;
console.log(data?.toString());        // undefined (no crash)

// Works with arrays
let arr = null;
console.log(arr?.[0]);               // undefined

// Practical example
let response = {
  data: {
    user: null
  }
};
let city = response?.data?.user?.address?.city ?? "Unknown";
console.log(city); // "Unknown" (gracefully handles the null user)
```

### 11.6 Ternary Operator

The **ternary operator** is a compact one-line if/else statement.

**Syntax:** `condition ? valueIfTrue : valueIfFalse`

```js
// Traditional if/else
let age = 20;
let category;
if (age >= 18) {
  category = "adult";
} else {
  category = "minor";
}

// Same thing with ternary — one line!
let category2 = age >= 18 ? "adult" : "minor";
console.log(category2); // "adult"

// In template literals
let score = 85;
console.log(`You ${score >= 60 ? "passed" : "failed"} the exam.`);
// "You passed the exam."

// Can be chained (but keep it readable)
let grade =
  score >= 90 ? "A" :
  score >= 80 ? "B" :
  score >= 70 ? "C" :
  score >= 60 ? "D" : "F";
console.log(grade); // "B"
```

> [!TIP]
> Use the ternary for simple, one-line decisions. For complex logic with multiple statements, use a regular `if/else` for readability.

### Section 11 Recap

- Arithmetic: `+`, `-`, `*`, `/`, `%` (modulus), `**` (power)
- Always use `===` and `!==` — never `==` and `!=`
- `&&` short-circuits on first falsy; `||` short-circuits on first truthy
- `??` (nullish coalescing) only triggers on `null`/`undefined` — safer than `||` for defaults
- `?.` (optional chaining) safely accesses nested properties — returns `undefined` instead of crashing
- Ternary `condition ? a : b` — compact if/else for simple expressions

---

## 12. Conditionals

### 12.1 `if / else if / else` — Decision Trees

**Real-world analogy:** A vending machine with a series of checks: "Is the slot empty? Is the product selected? Is the payment enough?"

```js
let temperature = 28; // degrees Celsius

// Single if
if (temperature > 30) {
  console.log("It's hot outside! Wear light clothes.");
}

// if / else
if (temperature > 30) {
  console.log("It's hot!");
} else {
  console.log("Not too hot today.");
}

// if / else if / else — check multiple conditions in order
if (temperature >= 35) {
  console.log("Extreme heat warning!");        // ≥ 35°C
} else if (temperature >= 25) {
  console.log("Warm and sunny.");              // 25–34°C
} else if (temperature >= 15) {
  console.log("Mild weather.");                // 15–24°C
} else if (temperature >= 5) {
  console.log("Cool weather, bring a jacket."); // 5–14°C
} else {
  console.log("Cold! Bundle up.");             // < 5°C
}
// With temp = 28: "Warm and sunny."
```

> [!IMPORTANT]
> JavaScript evaluates `else if` conditions **top to bottom** and stops at the **first match**. Order matters!

```js
// ❌ Bug: wrong order — the first condition swallows everything
let score = 95;
if (score >= 60) {
  console.log("D or higher"); // ← always matches first!
} else if (score >= 90) {
  console.log("A"); // ← never reached!
}

// ✅ Correct: check most specific (highest) first
if (score >= 90) {
  console.log("A"); // ← 95 matches here and stops
} else if (score >= 80) {
  console.log("B");
} else if (score >= 60) {
  console.log("C or D");
} else {
  console.log("F");
}
```

### 12.2 `switch` Statement

A `switch` statement is ideal when you have one variable/expression to check against **multiple specific values**.

**Real-world analogy:** A traffic light controller. Switch on the current light color and take a specific action.

```js
let day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of the work week. Coffee time!");
    break; // ← ESSENTIAL: stops here, doesn't fall into next case

  case "Tuesday":
  case "Wednesday":
  case "Thursday":
    console.log("Mid-week grind."); // ← all three days share this
    break;

  case "Friday":
    console.log("TGIF! Almost there!");
    break;

  case "Saturday":
  case "Sunday":
    console.log("Weekend! Rest and recharge.");
    break;

  default:
    // Runs if NO case matches — like the else in if/else
    console.log("Unknown day.");
}
```

**Fall-through behavior:**

```js
// Without break, execution FALLS THROUGH to the next case
let x = 1;

switch (x) {
  case 1:
    console.log("One");  // ← runs
    // no break! falls through to case 2
  case 2:
    console.log("Two");  // ← ALSO runs (fall-through!)
    break;
  case 3:
    console.log("Three"); // doesn't run
}
// Output: "One", "Two"
```

> [!WARNING]
> **Always add `break`** at the end of each `case` unless fall-through is intentional. Forgetting `break` is one of the most common bugs in JavaScript.

**switch uses strict equality (`===`) internally:**

```js
let num = "1"; // a STRING

switch (num) {
  case 1:  // checking against NUMBER 1
    console.log("Number one");
    break;
  case "1": // checking against STRING "1"
    console.log("String one"); // ← this matches!
    break;
}
// Output: "String one"
```

### 12.3 Ternary Operator (Revisited)

Already covered in Section 11.6, but here's a practical example in context:

```js
// With if/else
function getTicketPrice(age) {
  let price;
  if (age < 12) {
    price = 5;
  } else if (age >= 65) {
    price = 7;
  } else {
    price = 12;
  }
  return price;
}

// With ternary (compact version)
function getTicketPrice2(age) {
  return age < 12 ? 5 : age >= 65 ? 7 : 12;
}

console.log(getTicketPrice(8));  // 5
console.log(getTicketPrice(25)); // 12
console.log(getTicketPrice(70)); // 7
```

### Section 12 Recap

- `if/else if/else` evaluates conditions top-to-bottom; order matters
- Check most specific conditions first (highest values, most restrictive cases)
- `switch` is cleaner when matching one expression against multiple specific values
- Always add `break` in switch cases to prevent fall-through
- `switch` uses strict equality (`===`) — watch out for type mismatches

---

## 13. Loops

### 13.1 What is a Loop?

A loop allows code to **repeat** without copy-pasting it multiple times.

**Real-world analogy:** A washing machine cycle — the drum spins, checks if it should stop, and if not, spins again. It repeats the same action until a condition is met.

### 13.2 `for` Loop

The `for` loop is the classic loop. It has three parts:
1. **Initializer** — runs once at the start (sets up a counter)
2. **Condition** — checked before every iteration; loop runs while `true`
3. **Update** — runs after every iteration (usually increments counter)

```js
//      1. init   2. condition   3. update
for (let i = 0; i < 5; i++) {
  // Loop body — runs each time condition is true
  console.log(`Iteration ${i}`);
}
// Output:
// Iteration 0
// Iteration 1
// Iteration 2
// Iteration 3
// Iteration 4

// Loop Flow Diagram:
// ┌──────────────────────────────────────────────────┐
// │  let i = 0    ← runs ONCE at start              │
// │       ↓                                          │
// │  i < 5 ?  → false → EXIT loop                   │
// │    ↓ true                                        │
// │  run loop body                                   │
// │       ↓                                          │
// │  i++  ← update after each iteration             │
// │       ↓                                          │
// │  i < 5 ?  → repeat...                           │
// └──────────────────────────────────────────────────┘
```

**Looping over an array:**
```js
let colors = ["red", "green", "blue", "yellow"];

for (let i = 0; i < colors.length; i++) {
  // i goes from 0 to colors.length - 1 (3)
  console.log(`Color ${i + 1}: ${colors[i]}`);
}
// Color 1: red
// Color 2: green
// Color 3: blue
// Color 4: yellow
```

**Looping backwards:**
```js
for (let i = 4; i >= 0; i--) {
  console.log(`Countdown: ${i}`);
}
// Countdown: 4, 3, 2, 1, 0
```

### 13.3 `while` Loop

A `while` loop repeats as long as its condition is true. Use it when you don't know in advance how many iterations you need.

```js
// Syntax: while (condition) { ... }

let count = 0;

while (count < 5) {
  console.log(`Count is: ${count}`);
  count++; // ← CRITICAL: must update the counter or infinite loop!
}

// Example: run until user inputs valid data (simulated here)
let attempts = 0;
let password = "";
const correctPassword = "secret123";

while (password !== correctPassword && attempts < 3) {
  attempts++;
  // In real code, you'd get input from the user here
  password = attempts === 2 ? "secret123" : "wrongpassword"; // simulated
  console.log(`Attempt ${attempts}: ${password}`);
}

if (password === correctPassword) {
  console.log("Access granted!");
} else {
  console.log("Too many failed attempts. Locked out.");
}
```

> [!WARNING]
> **Infinite loops** crash the browser tab! Always make sure your `while` loop condition will eventually become `false`.
> ```js
> // ❌ INFINITE LOOP — never change i, so condition never becomes false
> let i = 0;
> while (i < 10) {
>   console.log(i);
>   // forgot i++! — this runs forever
> }
> ```

### 13.4 `do...while` Loop

A `do...while` loop is like a `while` loop, but it always runs the body **at least once** — it checks the condition **after** the first iteration.

**Real-world analogy:** "Try the food first, then decide if you want more." vs `while` which is "only eat if you're hungry."

```js
// Body runs FIRST, THEN condition is checked
let userInput;
let attempt = 0;

do {
  attempt++;
  userInput = attempt < 3 ? "wrongAnswer" : "42"; // simulated input
  console.log(`Attempt ${attempt}: You entered "${userInput}"`);
} while (userInput !== "42"); // check condition AFTER body runs

console.log("Correct! The answer is 42.");
// Output:
// Attempt 1: You entered "wrongAnswer"
// Attempt 2: You entered "wrongAnswer"
// Attempt 3: You entered "42"
// Correct! The answer is 42.
```

```
while vs do...while:

while:                          do...while:
Check condition first           Run body first
                                Then check condition

[condition] → false → exit     [body runs]
     ↓ true                         ↓
  [body runs]                  [condition] → false → exit
     ↓                               ↓ true
[condition] → repeat           [body runs again]
```

### 13.5 `for...of` Loop — For Arrays (and Iterables)

`for...of` is a clean, modern way to loop over arrays (and other iterables like strings) without needing an index variable.

```js
let fruits = ["Apple", "Banana", "Cherry", "Date"];

// for...of gives you the VALUE of each element
for (let fruit of fruits) {
  console.log(fruit); // Apple, Banana, Cherry, Date
}

// Loop over a string character by character
let word = "Hello";
for (let char of word) {
  console.log(char); // H, e, l, l, o
}

// Need both index and value? Use .entries()
for (let [index, value] of fruits.entries()) {
  console.log(`${index}: ${value}`);
}
// 0: Apple
// 1: Banana
// 2: Cherry
// 3: Date
```

### 13.6 `for...in` Loop — For Object Properties

`for...in` loops over the **keys** (property names) of an object.

```js
let person = {
  name: "Alice",
  age: 30,
  city: "New York"
};

for (let key in person) {
  // key is the property name (string)
  console.log(`${key}: ${person[key]}`);
}
// name: Alice
// age: 30
// city: New York
```

> [!WARNING]
> **Avoid `for...in` for arrays.** It loops over indices as strings AND may include inherited properties. Use `for...of` or a regular `for` loop for arrays instead.
> ```js
> let arr = [10, 20, 30];
> for (let key in arr) {
>   console.log(key); // "0", "1", "2" — strings, not numbers!
> }
> // Use for...of instead:
> for (let val of arr) {
>   console.log(val); // 10, 20, 30 ✅
> }
> ```

### 13.7 `break` and `continue`

**`break`** — immediately exits the loop

```js
// Find the first number divisible by 7
for (let i = 1; i <= 100; i++) {
  if (i % 7 === 0) {
    console.log(`First multiple of 7: ${i}`); // 7
    break; // ← stop the loop immediately
  }
}
```

**`continue`** — skip the current iteration and move to the next

```js
// Print only even numbers (skip odd)
for (let i = 1; i <= 10; i++) {
  if (i % 2 !== 0) {
    continue; // ← skip odd numbers
  }
  console.log(i); // 2, 4, 6, 8, 10
}
```

### 13.8 Loop Selection Guide

```
┌─────────────────────────────────────────────────────────────┐
│                   Which Loop to Use?                        │
│                                                             │
│  Do you know how many times to repeat?                      │
│    YES → for loop                                           │
│                                                             │
│  Looping over an array (no index needed)?                   │
│    YES → for...of                                           │
│                                                             │
│  Looping over object properties?                            │
│    YES → for...in                                           │
│                                                             │
│  Repeat until some condition is met (unknown iterations)?   │
│    YES → while                                              │
│                                                             │
│  Must run at least once, then check?                        │
│    YES → do...while                                         │
└─────────────────────────────────────────────────────────────┘
```

### Section 13 Recap

- `for` — best when you know the iteration count; has init, condition, and update
- `while` — repeat until a condition is false; check condition first
- `do...while` — like while, but always runs at least once
- `for...of` — iterate over array values cleanly; no index needed
- `for...in` — iterate over object keys; avoid for arrays
- `break` — exit loop immediately
- `continue` — skip current iteration, continue with next

---

## Lab 1: Console Calculator with `switch` (45 min)

### Objective

Build a console-based calculator that performs arithmetic based on an operator string. Practice `switch`, arithmetic operators, and `console.log` output.

### Step-by-Step Instructions

**Step 1: Set up your files**

Create a new folder called `lab1-calculator`. Inside it, create two files:
- `index.html` — the HTML page
- `calculator.js` — the JavaScript logic

**Step 2: Create the HTML file**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Console Calculator — Lab 1</title>
  <!-- defer ensures JS runs after HTML is loaded -->
  <script src="calculator.js" defer></script>
</head>
<body>
  <h1>Calculator Lab</h1>
  <p>Open DevTools (F12) and check the Console tab to see your results.</p>
</body>
</html>
```

**Step 3: Write the calculator function**

Open `calculator.js` and write:

```js
// ─────────────────────────────────────────────────────
// Lab 1: Console Calculator using switch
// Purpose: Practice switch statements and arithmetic
// ─────────────────────────────────────────────────────

/**
 * Calculates the result of two numbers with a given operator.
 * @param {number} a - The first operand
 * @param {number} b - The second operand
 * @param {string} operator - The operation: "+", "-", "*", "/", "%", "**"
 * @returns {number|string} The result or an error message
 */
function calculate(a, b, operator) {
  // Validate that a and b are actually numbers
  if (typeof a !== "number" || typeof b !== "number") {
    return "Error: Both operands must be numbers.";
  }

  let result; // will hold the calculated result

  // Use switch to determine which operation to perform
  switch (operator) {
    case "+":
      result = a + b;             // addition
      break;

    case "-":
      result = a - b;             // subtraction
      break;

    case "*":
      result = a * b;             // multiplication
      break;

    case "/":
      // Special case: division by zero is not allowed in real calculators
      if (b === 0) {
        return "Error: Cannot divide by zero.";
      }
      result = a / b;             // division
      break;

    case "%":
      result = a % b;             // modulus (remainder)
      break;

    case "**":
      result = a ** b;            // exponentiation (a to the power of b)
      break;

    default:
      // No matching case — unrecognized operator
      return `Error: Unknown operator "${operator}". Use +, -, *, /, %, or **`;
  }

  return result;
}

// ─────────────────────────────────────────────────────
// Test the calculator with various inputs
// ─────────────────────────────────────────────────────

// Group 1: Basic arithmetic
console.group("Basic Arithmetic Tests");
console.log(`10 + 5 = ${calculate(10, 5, "+")}`);   // 15
console.log(`10 - 3 = ${calculate(10, 3, "-")}`);   // 7
console.log(`4 * 6 = ${calculate(4, 6, "*")}`);     // 24
console.log(`20 / 4 = ${calculate(20, 4, "/")}`);   // 5
console.log(`17 % 5 = ${calculate(17, 5, "%")}`);   // 2
console.log(`2 ** 8 = ${calculate(2, 8, "**")}`);   // 256
console.groupEnd();

// Group 2: Edge cases
console.group("Edge Case Tests");
console.log(calculate(10, 0, "/"));        // Error: divide by zero
console.log(calculate(10, 5, "^"));        // Error: unknown operator
console.log(calculate("ten", 5, "+"));     // Error: not a number
console.groupEnd();

// Group 3: Building a "calculation history" using an array
console.group("Calculation History");
let history = []; // store results here

// Helper function to run and record a calculation
function runAndRecord(a, b, op) {
  let res = calculate(a, b, op);
  // Build a human-readable record string
  let record = `${a} ${op} ${b} = ${res}`;
  history.push(record);         // add to history array
  return res;
}

runAndRecord(100, 25, "+");   // 125
runAndRecord(50, 7, "*");     // 350
runAndRecord(256, 4, "/");    // 64
runAndRecord(3, 5, "**");     // 243

// Display the history table
console.table(history);
console.groupEnd();
```

**Step 4: Open in browser and check the console**

1. Open `index.html` in your browser (double-click or drag to browser)
2. Press `F12` to open Developer Tools
3. Click the **Console** tab
4. Verify you see the calculation results and history table

**Step 5: Extension challenges**

Try these modifications on your own:
1. Add a `"sqrt"` operator that returns `Math.sqrt(a)` (ignoring `b`)
2. Add an `"abs"` operator that returns the absolute value of `a`
3. Add rounding to the division result using `result.toFixed(2)`
4. Create an array of 10 random calculations and loop through them

---

## Lab 2: Number Guessing Game (45 min)

### Objective

Build an interactive number guessing game that uses a `while` loop, conditionals, and user input via `prompt()`.

### Background: The `prompt()` Function

```js
// prompt() pauses the browser and shows a dialog box for user input
// It always returns a STRING (or null if user cancels)
let input = prompt("Enter your name:");
console.log(typeof input); // "string"
console.log(input);        // whatever the user typed
```

### Step-by-Step Instructions

**Step 1: Set up your files**

Create a folder called `lab2-guessing-game` with:
- `index.html`
- `game.js`

**Step 2: HTML setup**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Number Guessing Game — Lab 2</title>
  <script src="game.js" defer></script>
</head>
<body>
  <h1>Number Guessing Game</h1>
  <p>This game runs via browser dialogs (prompt/alert).</p>
  <p>Open the console (F12) to see game logs.</p>
</body>
</html>
```

**Step 3: Build the guessing game**

```js
// ─────────────────────────────────────────────────────
// Lab 2: Number Guessing Game
// Concepts: while loop, parseInt, conditionals, Math.random
// ─────────────────────────────────────────────────────

// Generate a random integer between min and max (inclusive)
function randomInt(min, max) {
  // Math.random() → random decimal from 0 (inclusive) to 1 (exclusive)
  // Multiply by the range, add min, then round down with Math.floor
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Game Configuration ───
const MIN_NUMBER   = 1;    // lowest possible secret number
const MAX_NUMBER   = 100;  // highest possible secret number
const MAX_ATTEMPTS = 7;    // player gets this many guesses

// ─── Game State ───
const secretNumber = randomInt(MIN_NUMBER, MAX_NUMBER); // pick secret number
let attemptsUsed   = 0;     // how many guesses the player has used
let hasWon         = false; // track if the player guessed correctly
let keepPlaying    = true;  // controls the game loop

// Log the secret number so you can verify the game works (remove in real game!)
console.log(`[DEBUG] Secret number is: ${secretNumber}`);

// ─── Welcome Message ───
alert(`Welcome to the Number Guessing Game!
I'm thinking of a number between ${MIN_NUMBER} and ${MAX_NUMBER}.
You have ${MAX_ATTEMPTS} attempts. Good luck!`);

// ─── Main Game Loop ───
while (keepPlaying && attemptsUsed < MAX_ATTEMPTS) {
  attemptsUsed++; // increment attempt counter

  // Show remaining attempts in the prompt
  let remaining = MAX_ATTEMPTS - attemptsUsed + 1;
  let rawInput = prompt(
    `Attempt ${attemptsUsed} of ${MAX_ATTEMPTS}:\n` +
    `Guess a number between ${MIN_NUMBER} and ${MAX_NUMBER}:\n` +
    `(${remaining} guess${remaining !== 1 ? "es" : ""} remaining)`
  );

  // Handle cancellation (user pressed Cancel or closed dialog)
  if (rawInput === null) {
    console.log("Player cancelled the game.");
    keepPlaying = false; // exit the while loop
    break;
  }

  // Convert the input string to a number
  let guess = parseInt(rawInput, 10); // radix 10 = decimal

  // Validate the input — parseInt returns NaN for non-numeric input
  if (isNaN(guess)) {
    alert(`"${rawInput}" is not a valid number. Please enter a number between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
    attemptsUsed--; // don't count invalid input as an attempt
    continue;       // skip to next iteration of while loop
  }

  // Validate the range
  if (guess < MIN_NUMBER || guess > MAX_NUMBER) {
    alert(`Out of range! Please guess between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
    attemptsUsed--; // don't count out-of-range as an attempt
    continue;
  }

  // Log the guess
  console.log(`Attempt ${attemptsUsed}: Player guessed ${guess}`);

  // Check the guess against the secret number
  if (guess === secretNumber) {
    // Correct guess!
    hasWon = true;
    keepPlaying = false; // end the loop

  } else if (guess < secretNumber) {
    // Guess was too low
    let message = `Too low! Try a higher number.`;
    if (attemptsUsed < MAX_ATTEMPTS) {
      alert(message + `\n${MAX_ATTEMPTS - attemptsUsed} guess${MAX_ATTEMPTS - attemptsUsed !== 1 ? "es" : ""} remaining.`);
    }
  } else {
    // Guess was too high
    let message = `Too high! Try a lower number.`;
    if (attemptsUsed < MAX_ATTEMPTS) {
      alert(message + `\n${MAX_ATTEMPTS - attemptsUsed} guess${MAX_ATTEMPTS - attemptsUsed !== 1 ? "es" : ""} remaining.`);
    }
  }
}

// ─── End Game Message ───
if (hasWon) {
  alert(
    `🎉 Congratulations! You guessed it!\n` +
    `The number was ${secretNumber}.\n` +
    `You used ${attemptsUsed} out of ${MAX_ATTEMPTS} attempts.`
  );
  console.log(`✅ Player WON in ${attemptsUsed} attempts. Secret: ${secretNumber}`);
} else if (keepPlaying === false && !hasWon && attemptsUsed === 0) {
  // Player cancelled immediately
  console.log("Game cancelled before any guesses.");
} else {
  // Ran out of attempts
  alert(
    `😞 Game over! You used all ${MAX_ATTEMPTS} attempts.\n` +
    `The secret number was ${secretNumber}.\n` +
    `Better luck next time!`
  );
  console.log(`❌ Player LOST. Secret: ${secretNumber}`);
}
```

**Step 4: Test the game**

1. Open `index.html` in the browser
2. Play through the game several times:
   - Try to win
   - Try to lose (use all attempts)
   - Enter invalid input (text, special characters)
   - Enter out-of-range numbers
   - Press Cancel mid-game

**Step 5: Extension challenges**

1. Track the player's **best score** (fewest attempts to win) across multiple rounds
2. After each game, ask "Play again?" using `confirm()` — loop the whole game if yes
3. Add difficulty levels (Easy: 1–50, Hard: 1–200, fewer/more attempts)
4. Display a "hot/cold" hint based on how close the guess is to the secret number

---

## Assignment: TaskFlow Project — Part 1

### Overview

You will build the foundation of **TaskFlow**, a personal task management application. This first part focuses on using JavaScript variables, data types, conditionals, and loops to set up the data layer and display logic.

**TaskFlow** will eventually be a full-featured web app with:
- Create, read, update, and delete (CRUD) tasks
- Priority levels and due dates
- Categories and filtering
- Local storage persistence

In Part 1, you set up the data structure and console-based output.

### Requirements

#### Requirement 1: Task Data Structure

Create a `tasks` array where each task is an object with these properties:

```js
// Each task object must have:
{
  id: 1,                          // number — unique identifier
  title: "Buy groceries",         // string — task description
  priority: "high",               // string — "high", "medium", or "low"
  isCompleted: false,             // boolean — done or not
  dueDate: "2024-12-31",         // string — ISO date format YYYY-MM-DD
  category: "personal"            // string — "work", "personal", "health", etc.
}
```

**Your task:** Create an array of **at least 8 tasks** with varied properties (mix of priorities, categories, completed/incomplete).

#### Requirement 2: Task Statistics

Using loops, calculate and `console.log` the following statistics:

```
Total tasks: 8
Completed: 3
Pending: 5
High priority pending: 2
Completion rate: 37.5%
```

**Hints:**
- Loop over the `tasks` array with `for...of`
- Use `if` statements inside the loop to count by category
- Use `toFixed(1)` for the percentage

#### Requirement 3: Priority Display Function

Write a function `displayTasksByPriority(priority)` that:
1. Accepts a priority string: `"high"`, `"medium"`, or `"low"`
2. Filters and prints all tasks matching that priority
3. Uses `console.group()` to organize output
4. Shows whether each task is complete or pending with `✅` or `⏳`

**Example output:**
```
High Priority Tasks
  ⏳ Buy groceries (personal) — Due: 2024-12-31
  ✅ Fix bug in login page (work) — Due: 2024-12-15
```

**Hints:**
```js
// Filter tasks array — loop and check priority
function displayTasksByPriority(priority) {
  // 1. Validate the priority parameter
  // 2. console.group() with a descriptive title
  // 3. Loop over tasks with for...of
  // 4. Use if to check task.priority === priority
  // 5. Use ternary to pick ✅ or ⏳
  // 6. console.log() the task info
  // 7. console.groupEnd()
}
```

#### Requirement 4: Due Date Checker

Write a function `checkDueDates()` that:
1. Gets today's date using `new Date().toISOString().split("T")[0]` (returns `"YYYY-MM-DD"`)
2. Loops over all incomplete tasks
3. Categorizes each as: `"overdue"`, `"due today"`, or `"upcoming"`
4. Prints a report with `console.table()`

**Hints:**
- Compare date strings directly — they sort alphabetically in ISO format
- `task.dueDate < today` → overdue
- `task.dueDate === today` → due today
- `task.dueDate > today` → upcoming

#### Requirement 5: Task Summary Report

Write a function `generateReport()` that calls all previous functions and outputs a complete summary. Use `console.group()` sections for:
- Statistics
- Tasks by priority (high, medium, low separately)
- Due date report

#### Requirement 6: Nullish Coalescing & Optional Chaining

Add an optional `notes` property to some (not all) tasks. Then write a function `printTaskWithNotes(task)` that:
- Uses `?.` to safely access `task.notes`
- Uses `??` to show `"No notes"` when notes is absent
- Prints: `"Task: [title] | Notes: [notes or 'No notes']"`

### Deliverables

Submit a folder called `taskflow-part1` containing:
- `index.html` — links your script with `defer`
- `app.js` — all your JavaScript code

### Grading Criteria

| Criterion                          | Points |
|------------------------------------|--------|
| All 8+ tasks with correct structure | 20     |
| Statistics are accurate             | 15     |
| `displayTasksByPriority` works      | 20     |
| `checkDueDates` works correctly     | 20     |
| `generateReport` organizes output   | 10     |
| Optional chaining and ?? used       | 10     |
| Code is well-commented              | 5      |
| **Total**                           | **100**|

---

## Key Takeaways

1. **JavaScript makes pages interactive** — it's the only language browsers natively understand for behavior
2. **Use `defer`** when linking scripts — it ensures HTML is ready before JS runs
3. **`console.log()` is your best friend** — use it constantly while debugging
4. **Prefer `const`**, then `let`, never `var` — `const` prevents accidental reassignment
5. **Block scope** — `let`/`const` are trapped inside `{}` blocks; `var` leaks out
6. **7 primitive types** — string, number, boolean, null, undefined, symbol, bigint
7. **`typeof null === "object"`** — a historical JS bug; always check null with `=== null`
8. **Template literals** — use backticks with `${expression}` for clean string interpolation
9. **`===` not `==`** — always use strict equality to avoid coercion surprises
10. **8 falsy values** — `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN` — everything else is truthy
11. **`??` not `||`** for defaults — nullish coalescing only triggers on null/undefined, not all falsy values
12. **`?.`** for safe property access — prevents crashes when accessing nested properties on null/undefined
13. **Match the right loop to the task** — `for` (known count), `while` (unknown count), `for...of` (arrays), `for...in` (objects)
14. **Always `break` in switch** — fall-through is a common bug source

---

## Resources

### Official Documentation
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — the definitive reference
- [MDN Data Types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [MDN Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- [MDN Loops and Iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)
- [MDN Expressions and Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)

### Learning Tools
- [javascript.info](https://javascript.info/) — best free JS textbook online
- [Eloquent JavaScript](https://eloquentjavascript.net/) — free online book
- [JS Visualizer 9000](https://www.jsv9000.app/) — visualize JavaScript execution step by step
- [Loupe](http://latentflip.com/loupe/) — visualize the call stack and event loop

### Practice
- [Exercism JavaScript Track](https://exercism.org/tracks/javascript) — structured exercises with mentorship
- [Codewars](https://www.codewars.com/) — gamified coding challenges
- [freeCodeCamp JavaScript Algorithms](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/) — free curriculum with projects

### Tools
- [ESLint](https://eslint.org/) — linter that catches bugs before you run your code
- [Prettier](https://prettier.io/) — automatic code formatter
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) — official guide to browser dev tools

---

## Common Mistakes & How to Avoid Them

| # | Mistake | Wrong Code | Correct Code | Why |
|---|---------|------------|--------------|-----|
| 1 | Using `==` instead of `===` | `if (x == "5")` | `if (x === "5")` | Loose equality coerces types, causing unexpected matches like `0 == false` |
| 2 | Forgetting `break` in `switch` | `case "A": doA()` | `case "A": doA(); break;` | Without `break`, execution falls into the next `case` |
| 3 | Using `var` in modern code | `var count = 0;` | `let count = 0;` | `var` has function scope and hoisting issues that cause subtle bugs |
| 4 | Mutating a `const` object's reference | `const x = 5; x = 6;` | `let x = 5; x = 6;` | `const` cannot be reassigned; use `let` for values that change |
| 5 | Accessing properties of `null` | `user.name` (when user is null) | `user?.name` | Throws `TypeError`; use optional chaining or null checks |
| 6 | Using `||` for defaults with `0` or `""` | `let port = userPort \|\| 8080` | `let port = userPort ?? 8080` | `||` treats `0` as falsy; `??` only triggers on `null`/`undefined` |
| 7 | Forgetting `parseInt` returns NaN | `let n = parseInt("abc"); n + 1;` | `if (!isNaN(n)) { n + 1; }` | Always validate `parseInt` result with `isNaN()` |
| 8 | Infinite `while` loop | `while(true) { doSomething(); }` | Always update counter in loop | Missing update condition causes browser to freeze |
| 9 | Using `for...in` on arrays | `for (let i in arr)` | `for (let val of arr)` | `for...in` gives string keys and may include inherited properties |
| 10 | `typeof null === "object"` surprise | `if (typeof x === "object")` (to check null) | `if (x === null)` | `typeof null` returns `"object"` due to a historical JS bug |
| 11 | Floating point equality | `0.1 + 0.2 === 0.3` (is false) | `Math.abs(0.1 + 0.2 - 0.3) < 0.0001` | Binary floating point cannot represent all decimals exactly |
| 12 | String + Number coercion | `"5" + 3 === "53"` | `Number("5") + 3 === 8` | The `+` operator concatenates if either operand is a string |
| 13 | Declaring but not initializing | `let x; x + 1;` (NaN) | `let x = 0; x + 1;` | Uninitialized variables are `undefined`; `undefined + 1 === NaN` |
| 14 | Shadowing outer variables | `let x = 1; { let x = 2; }` (confusing) | Use distinct names in inner blocks | Shadowing makes code hard to reason about |
| 15 | Missing `let`/`const` keyword | `count = 0;` | `let count = 0;` | Without a keyword, you accidentally create a global variable |

---

*End of Lecture 09 — JavaScript Basics: Syntax, Types & Control Flow*