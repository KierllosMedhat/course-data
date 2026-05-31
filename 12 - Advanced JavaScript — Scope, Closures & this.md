# Lecture 12 — Advanced JavaScript: Scope, Closures & `this`

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand lexical scope and the scope chain
- Define closures and use them for data privacy
- Compare closures to modern ES2022 `#private` class fields
- Explain how the `this` keyword works in different calling contexts
- Use `call`, `apply`, and `bind` to control `this` explicitly
- Understand why arrow functions behave differently with `this`
- Organise code using ES modules (`import` / `export`)
- Access modern module metadata with `import.meta`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Lexical scope vs dynamic scope; scope chain
2. Closures: definition and data privacy
3. Modern Privacy: `#private` fields in classes
4. The `this` keyword: default, implicit, explicit, `new` binding
5. Arrow functions and lexical `this`
6. ES modules: `import`/`export` and `import.meta`

### Part 2 — Practice & Lab (~90–120 min)
1. Counter module using closures
2. Refactoring to ES Modules
3. TaskFlow Project Part 4: Modules & State Privacy

---

## 1. Lexical Scope

**What is scope?** Scope determines **where variables are accessible**.
**JavaScript uses lexical (static) scope** — scope is determined by **where** functions are written in the source code, not where they are called from.

```js
const name = "Alice";

function greet() {
  console.log(`Hello, ${name}`);  // Looks for 'name' where greet was DEFINED
}

function caller() {
  const name = "Bob";
  greet();  // Prints "Hello, Alice" — NOT "Bob"!
}

caller();
```

---

## 2. Closures

**What is a closure?** A closure is when a function **remembers** and can access variables from its outer scope, even after the outer function has finished running.

### Data Privacy (Encapsulation)
```js
function createUser(name) {
  let loginCount = 0;  // Private — can't be accessed from outside
  
  return {
    getName: () => name,
    login: () => {
      loginCount++;
      return `${name} logged in ${loginCount} times`;
    }
  };
}

const user = createUser("Alice");
user.login(); // "Alice logged in 1 times"
console.log(user.loginCount); // undefined
```

---

## 3. Modern Privacy: `#private` Fields

Historically, developers used closures (like above) to achieve private variables.
However, in modern JavaScript (ES2022+), we have **true private fields** in Classes!

```js
class User {
  #loginCount = 0; // The '#' makes it private!
  
  constructor(name) {
    this.name = name;
  }
  
  login() {
    this.#loginCount++;
    return `${this.name} logged in ${this.#loginCount} times`;
  }
}

const alice = new User("Alice");
alice.login();
// alice.#loginCount = 5; // ❌ SyntaxError: Private field '#loginCount' must be declared in an enclosing class
```
> [!TIP]
> Use `#private` fields when writing classes, and use closures when writing factory functions.

---

## 4. The `this` Keyword

`this` is determined by **how the function is called**, not where it's defined.

### Implicit Binding (Method Call)
```js
const person = {
  name: "Alice",
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
};
person.greet();  // this = person
```

### Explicit Binding (`call`, `apply`, `bind`)
```js
function greet() {
  console.log(`I'm ${this.name}`);
}
const alice = { name: "Alice" };

greet.call(alice); // Force `this` to be alice
```

---

## 5. Arrow Functions and Lexical `this`

Arrow functions do **NOT** have their own `this`. They inherit `this` from the **enclosing lexical scope**.

```js
const person = {
  name: "Alice",
  
  // ✅ Regular function as method
  greet() {
    // ✅ Arrow function inherits `this` from greet()
    setTimeout(() => {
      console.log(this.name);  // "Alice"
    }, 1000);
  }
};
```

---

## 6. ES Modules — `import` / `export`

Modern JavaScript uses native modules for code organisation.

### Named Exports
```js
// math.js
export const add = (a, b) => a + b;
```
```js
// app.js
import { add } from './math.js';
```

### Using Modules in HTML
```html
<script type="module" src="app.js"></script>
```

### Modern `import.meta`
Inside a module, you have access to metadata about the module itself via `import.meta`.
```js
// Returns the absolute URL of the current module file!
console.log(import.meta.url); 
```

---

## 🧪 Practice Labs

### Lab 1: Counter Closures (30 min)
1. Open `labs/lab1-closures/app.js`.
2. Write a `createCounter` function that returns an object with `increment`, `decrement`, and `getValue` methods.
3. Ensure the `count` is kept private using closures.

### Lab 2: ES Modules (30 min)
1. Open `labs/lab2-modules/index.html`.
2. Split the `app.js` logic into `math.js` and `app.js`.
3. Use `import` and `export` to connect them. Ensure `<script type="module">` is used.

---

## 📝 Assignment: TaskFlow Project — Part 4

It's time to organise our TaskFlow project using ES Modules and Data Privacy!

### Requirements
1. Open your TaskFlow folder from Lecture 11.
2. Update your `index.html` to load `app.js` as a module (`type="module"`).
3. Create a new file called `taskModel.js`.
4. In `taskModel.js`:
   - Store your `tasks` array.
   - Do **NOT** export the array directly! Keep it private.
   - Export your pure functions (`addTask`, `deleteTask`, `toggleTask`, `getTasks`). `getTasks` should return a copy of the array.
5. In `app.js`:
   - `import` those functions.
   - Use them to interact with the DOM as you did before.

By doing this, your UI logic is perfectly separated from your business logic, and the task array is safely encapsulated!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN — Closures | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures |
| MDN — ES Modules | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules |
| MDN — Private class features | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields |

---

## 📌 Key Takeaways
- A **closure** is a function that retains access to its outer scope.
- Use **ES2022 `#private` fields** for privacy in classes.
- The `this` keyword depends on the **call site** (`obj.method()` → `obj`).
- **Arrow functions** inherit `this` from the surrounding scope.
- **ES modules** (`import`/`export`) are the modern standard for code organisation. Use `import.meta.url` for file-specific info.

---

**Next Lecture:** [Lecture 13 — Asynchronous JavaScript: Callbacks, Promises & async/await](./13%20-%20Asynchronous%20JavaScript%20—%20Callbacks,%20Promises%20%26%20async-await.md)