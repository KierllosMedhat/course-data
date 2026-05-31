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

A function is a reusable block of code.

### Three Ways to Write Functions

**1. Function Declaration** (Hoisted)
```js
function greet(name) {
  return `Hello, ${name}!`;
}
```

**2. Function Expression** (Not hoisted)
```js
const greet = function(name) {
  return `Hello, ${name}!`;
};
```

**3. Arrow Function** (Concise, inherits `this`)
```js
// Implicit return
const greet = name => `Hello, ${name}!`;
```

---

## 2. Parameters — Default, Rest, and Spread

### Default Parameters
```js
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}
```

### Rest Parameters (`...args`)
Collects all remaining arguments into an array.
```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3); // 6
```

### Spread Operator (`...`)
Expands an array into individual elements.
```js
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];  // [1, 2, 3, 4]
```

---

## 3. Higher-Order Functions & Callbacks

A function that **takes another function as an argument**.

```js
function processUserInput(callback) {
  const name = "Alice";
  callback(name);  
}

processUserInput((name) => console.log(`Hello, ${name}!`));
```

---

## 4. Arrays & Modern ES2023 Methods

An array is an ordered list of values.

### The Problem with Old Methods
Methods like `splice()`, `sort()`, and `reverse()` **mutate** (change) the original array. This causes terrible bugs in modern frameworks like React and Angular.

### The ES2023 Solution (Non-Mutating Methods)
JavaScript introduced non-mutating versions of these methods that return a **new copy**.

| Old (Mutating) | New (Immutable) | What It Does |
|----------------|-----------------|--------------|
| `splice()` | `toSpliced()` | Adds/removes items at a specific index |
| `sort()` | `toSorted()` | Sorts the array |
| `reverse()` | `toReversed()` | Reverses the array |
| `arr[index] = val` | `with()` | Replaces an item at a specific index |

**Example:**
```js
const original = [3, 1, 2];

// SORTING safely
const sorted = original.toSorted((a, b) => a - b);
// original is STILL [3, 1, 2]

// REPLACING safely (replaces index 1 with 99)
const updated = original.with(1, 99);
// updated is [3, 99, 2]
```

> [!TIP]
> Always use `toSorted()`, `toSpliced()`, and `with()` instead of their mutating counterparts!

---

## 5. Array Iteration Methods

These methods take a callback function and loop through the array automatically.

### `map()` — Transform Each Item → New Array
```js
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2); // [2, 4, 6]
```

### `filter()` — Keep Items That Pass a Test → New Array
```js
const numbers = [1, 2, 3, 4];
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]
```

### `find()` — Get the First Match
```js
const match = users.find(u => u.name === "Bob");
```

### `reduce()` — Combine Everything Into a Single Value
```js
const numbers = [1, 2, 3];
const total = numbers.reduce((acc, current) => acc + current, 0); // 6
```

---

## 6. Objects & Destructuring

**What is an object?** A collection of **key-value pairs**.

```js
const person = {
  name: "Alice",
  age: 25
};
console.log(person.name); // Alice
```

### Destructuring
Extract values from arrays and objects into variables in one step.

**Object Destructuring:**
```js
const { name, age } = person;
console.log(name); // "Alice"
```

**Array Destructuring:**
```js
const [first, second] = [10, 20];
```

---

## 7. Immutable Updates

Instead of modifying the original array or object, create a **new copy** with the changes applied using the spread operator (`...`).

**Adding to an array:**
```js
const todos = ["Buy milk"];
const added = [...todos, "Walk dog"];
```

**Updating an object:**
```js
const user = { name: "Alice", age: 25 };
const updatedUser = { ...user, age: 26 };
```

---

## 🧪 Practice Labs

### Lab 1: Data Transformation (35 min)
1. Open `labs/lab1-data-pipeline/app.js`.
2. Given an array of objects representing products.
3. Use `filter()` to get only Electronics.
4. Use `toSorted()` to sort them by price safely.
5. Use `map()` to return an array of just their names.

### Lab 2: Student Destructuring (30 min)
1. Open `labs/lab2-student-records/app.js`.
2. Write a function `printStudent({ name, grade })` that uses parameter destructuring.
3. Test it with an array of student objects.

---

## 📝 Assignment: TaskFlow Project — Part 2

Let's upgrade our TaskFlow logic from an array of strings to an array of **Task Objects** and implement proper functions.

### Requirements
1. Open your TaskFlow folder from Lecture 09.
2. Change your `tasks` array to contain objects, e.g., `{ id: 1, title: "Learn JS", completed: false }`.
3. Create the following functions:
   - `addTask(tasksArray, title)`: Returns a new array with the task added. Generate a random ID for it.
   - `deleteTask(tasksArray, id)`: Uses `filter()` to return a new array without the task.
   - `toggleTask(tasksArray, id)`: Uses `map()` to flip the `completed` boolean of the specified task (Immutable update).
   - `viewTasks(tasksArray)`: Iterates over the array and `console.log`s each task, displaying `[X]` if completed and `[ ]` if not.
4. Update your `while` loop menu to use these functions.

*Remember: ALL functions must be pure. They should not mutate the original arrays.*

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN — Array.prototype.toSorted() | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted |
| MDN — Array.prototype.with() | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with |

---

## 📌 Key Takeaways
- Use **arrow functions** for short callbacks.
- **Rest** (`...args`) collects arguments; **Spread** (`...arr`) expands them.
- `map`, `filter`, `reduce` are the core array methods.
- **Never mutate arrays.** Use `toSorted()`, `toSpliced()`, and `with()` instead of older methods.
- Prefer **immutable updates** (spread syntax).

---

**Next Lecture:** [Lecture 11 — DOM Manipulation & Events](./11%20-%20DOM%20Manipulation%20%26%20Events.md)
