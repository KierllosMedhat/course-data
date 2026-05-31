# Lecture 09 — JavaScript Basics: Syntax, Types & Control Flow

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand what JavaScript is and how it runs in the modern browser
- Declare variables strictly using `let` and `const` (ES2023+)
- Identify JavaScript's data types (primitives and references)
- Use arithmetic, comparison, and logical operators
- Control program flow with `if`/`else`, `switch`, and loops (`for`, `while`, `for...of`)
- Understand type coercion, truthy/falsy values, and strict equality (`===`)

---

## 📋 Agenda

### Part 1 — Theory (90 min)
1. JavaScript in the browser (`defer` vs `async`)
2. Modern Variables: `let` vs `const` & Block Scope
3. Data types: primitives & references
4. Operators: arithmetic, comparison, logical, ternary
5. Control flow: `if`/`else`, `switch`, loops
6. Type coercion, truthy/falsy, strict equality (`===`)

### Part 2 — Practice / Lab (90–120 min)
1. Console-based calculator
2. Number guessing game with loops
3. TaskFlow Project Part 1: Console Logic

---

## 1. JavaScript in the Browser

**What is JavaScript?** JavaScript adds **behaviour and interactivity** — making buttons work, validating forms, fetching data, and building dynamic user interfaces.

### External Scripts (Modern Best Practice ✅)
```html
<head>
  <script src="app.js" defer></script>
</head>
```
The `defer` attribute downloads the script in the background but waits to run it until the HTML is fully parsed. **Always use `defer` in the `<head>`.**

---

## 2. Modern Variables: `let` vs `const`

JavaScript used to have `var`, but it caused terrible bugs due to "hoisting" and lack of block scope. **In 2026, we strictly use `let` and `const`.**

```js
let name = "Alice";      // Can be reassigned later
const PI = 3.1416;       // Cannot be reassigned
```

### The Rule of Thumb
**Always use `const` by default.** Only change it to `let` if you explicitly know the value needs to change later (e.g., in a `for` loop counter).

### Block Scope
Both `let` and `const` are block-scoped, meaning they only exist inside the `{}` they were created in:
```js
if (true) {
  const secret = "hidden";
}
console.log(secret); // ❌ ReferenceError!
```

---

## 3. Data Types

JavaScript has **7 primitive types** and **reference types**.

### Primitives
- `string`: `"hello"`, `'world'`, `` `template ${var}` ``
- `number`: `42`, `3.14`, `NaN`
- `boolean`: `true`, `false`
- `null`: Intentional absence of a value.
- `undefined`: Variable declared but never assigned a value.

### Reference Types
- **Object**: `{ name: "Alice", age: 25 }`
- **Array**: `[1, 2, 3]`

---

## 4. Operators

### Comparison Operators
| Operator | Meaning | Example |
|----------|---------|---------|
| `===` | Strict equal (value AND type) ✅ | `5 === 5` → `true` |
| `!==` | Strict not equal ✅ | `5 !== "5"` → `true` |
| `==` | Loose equal (converts types first) ❌ | `5 == "5"` → `true` |

> [!WARNING]
> **Always use `===`.** Never use `==` in modern JavaScript. It causes unpredictable type coercion bugs.

### Logical Operators
- `&&` (AND): Both sides must be true.
- `||` (OR): At least one side must be true.
- `!` (NOT): Flips the boolean value.

---

## 5. Control Flow

### `if` / `else if` / `else`
```js
const score = 85;
if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B"); // Runs
} else {
  console.log("F");
}
```

### Loops
**`for` loop (When you know how many times):**
```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

**`for...of` (Looping over Arrays):**
```js
const fruits = ["apple", "banana"];
for (const fruit of fruits) {
  console.log(fruit);
}
```

---

## 6. Truthy and Falsy Values

When evaluating an `if` statement, JavaScript converts values to booleans.

### The 8 Falsy Values
Memorize these. Everything else is truthy!
1. `false`
2. `0`
3. `-0`
4. `0n` (BigInt zero)
5. `""` (Empty string)
6. `null`
7. `undefined`
8. `NaN` (Not a Number)

*Note: An empty array `[]` and empty object `{}` are TRUTHY!*

---

## 🧪 Practice Labs

### Lab 1: Console Calculator (45 min)
1. Write a script that asks the user for two numbers and an operator (`+`, `-`, `*`, `/`) using `prompt()`.
2. Remember that `prompt()` returns a string! Convert it to a number using `Number()`.
3. Use a `switch` statement to perform the calculation and `console.log` the result.

### Lab 2: Number Guessing Game (45 min)
1. Generate a random number: `const secret = Math.floor(Math.random() * 10) + 1;`
2. Use a `while` loop to ask the user to guess.
3. If they guess correctly, `break` the loop and congratulate them!

---

## 📝 Assignment: TaskFlow Project — Part 1

It's time to start our second major portfolio piece: **TaskFlow**, a comprehensive Task Management Dashboard. In this first part, we will build the core data structure and logic entirely in the console.

### Requirements
1. Create a new folder `taskflow/` and add an `index.html` and `app.js`. Link them properly using `defer`.
2. Inside `app.js`, create an array called `tasks` to hold a list of task strings (e.g., `["Learn JS", "Build Portfolio"]`).
3. Write a `while` loop that acts as the main menu. Prompt the user with:
   `"Choose an action: 1) View Tasks 2) Add Task 3) Quit"`
4. If they choose **1**, use a `for...of` loop to `console.log` all current tasks.
5. If they choose **2**, prompt them for a new task string and add it to the array using `tasks.push(newTask)`.
6. If they choose **3**, `break` the loop and say goodbye.
7. Use strictly `const` and `let`.

### Optional Bonus
Add an option to **Delete** a task. Prompt the user for the exact name of the task, loop through the array to find it, and remove it using `tasks.splice(index, 1)`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| JavaScript.info | https://javascript.info/ |
| MDN — Let and Const | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let |

---

## 📌 Key Takeaways
- Use `const` by default, `let` when you need to reassign — **never use `var`**.
- **Always use `===`** for comparison to avoid coercion bugs.
- Memorise the **8 falsy values** — everything else is truthy.
- Link JS in the `<head>` using `<script src="..." defer></script>`.

---

**Next Lecture:** [Lecture 10 — Functions, Arrays & Objects](./10%20-%20Functions,%20Arrays%20%26%20Objects.md)