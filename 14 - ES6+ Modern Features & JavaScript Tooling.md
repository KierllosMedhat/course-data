# Lecture 14 — ES6+ Modern Features & JavaScript Tooling

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Use template literals for string interpolation
- Safely access nested properties with optional chaining (`?.`) and nullish coalescing (`??`)
- Write modern classes with constructors, inheritance, and static methods
- Use `Set` and `Map` for specialised data collections
- Set up a modern JavaScript project with npm, Vite, and ESLint
- Configure ESLint 9 using the modern **Flat Config** system
- Understand what bundlers do and why they matter

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Template literals & string interpolation
2. Optional chaining (`?.`) & nullish coalescing (`??`)
3. Classes: constructor, methods, inheritance (`extends`)
4. Collections: `Set`, `Map`
5. Tooling: npm, `package.json`, `node_modules`
6. Bundlers: Vite
7. Linting: ESLint 9 Flat Config (`eslint.config.js`)

### Part 2 — Practice & Lab (~90–120 min)
1. Set up a project with npm, ESLint, and Vite
2. Build a class-based component system
3. TaskFlow Project Part 6: Tooling & Classes

---

## 1. Template Literals

Template literals use **backticks** (`` ` ``) instead of quotes, enabling string interpolation and multiline strings:

```js
const name = "Alice";
const age = 25;

// ❌ Old way (concatenation)
const greeting = "Hello, " + name + "!";

// ✅ Template literal
const greeting = `Hello, ${name}! You are ${age} years old.`;
```

---

## 2. Optional Chaining (`?.`) & Nullish Coalescing (`??`)

### Optional Chaining (`?.`)
Safely access nested properties that might be `null` or `undefined` — without crashing:

```js
const user = { profile: { name: "Alice" } };

// ❌ Crashes if user.address is undefined
const zip = user.address.zip; 

// ✅ Returns undefined gracefully (no error)
const zip = user.address?.zip;
```

### Nullish Coalescing (`??`)
Returns the right side **only** when the left side is exactly `null` or `undefined`.
Unlike `||`, it allows falsy values like `0` or `""` to pass through.

```js
const count = 0;
const result = count ?? 10; // Result is 0
const result2 = count || 10; // Result is 10 (because 0 is falsy)
```

---

## 3. ES6 Classes

**What is a class?** A blueprint for creating objects with shared structure and behaviour.

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hi, I'm ${this.name}`;
  }
}

const alice = new Person("Alice", 25);
```

### Inheritance
Create a specialised class based on an existing one:

```js
class Student extends Person {
  constructor(name, age, major) {
    super(name, age); // MUST call parent constructor first!
    this.major = major;
  }
}
```

---

## 4. Collections: `Set` and `Map`

### `Set`
A `Set` stores **unique values** — duplicates are automatically removed.

```js
const numbers = new Set([1, 2, 2, 3]); // Set { 1, 2, 3 }
numbers.add(4);
```

### `Map`
A `Map` stores key-value pairs where keys can be **any type** (not just strings).

```js
const cache = new Map();
cache.set("query", { results: [] });
console.log(cache.get("query"));
```

---

## 5. JavaScript Tooling — npm

**npm** (Node Package Manager) manages libraries, tools, and scripts.

```bash
npm init -y                     # Creates package.json
npm install lodash              # Installs a dependency
npm install --save-dev eslint   # Installs a dev dependency
```

### `package.json`
Your project's ID card. Contains your scripts and dependencies.

---

## 6. Bundlers — Vite

Bundlers combine your files, transpile modern code, and minify it for production.
**Vite** is the modern standard for fast web development.

```bash
npm create vite@latest my-app -- --template vanilla
cd my-app
npm install
npm run dev      # Starts lightning-fast dev server
```

---

## 7. Linting — ESLint 9 Flat Config

A linter analyses your code to find errors and enforce style rules.
In ESLint 9, the configuration system completely changed to **Flat Config** (`eslint.config.js`).

### Setup
```bash
npm init @eslint/config
```

### `eslint.config.js` Example
```js
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "eqeqeq": "error"
    }
  }
];
```

### Running ESLint
```bash
npx eslint src/            # Check for issues
npx eslint src/ --fix      # Auto-fix what it can
```

---

## 🧪 Practice Labs

### Lab 1: Classes & Components (45 min)
1. Open `labs/lab1-classes/app.js`.
2. Create a `UIComponent` class with a `render()` method.
3. Create a `Button` class that `extends UIComponent` and overrides `render()`.
4. Instantiate the button and append it to the DOM.

### Lab 2: Vite & ESLint Setup (45 min)
1. Open your terminal in the `labs/lab2-tooling/` folder.
2. Initialize a Vite vanilla project.
3. Install ESLint.
4. Create an `eslint.config.js` file with browser globals.
5. Fix any lint errors in the default Vite `main.js`.

---

## 📝 Assignment: TaskFlow Project — Part 6

This is the final phase of the JavaScript module for TaskFlow!

### Requirements
1. Run `npm create vite@latest taskflow-vite -- --template vanilla` to create a fresh, modern project structure.
2. Copy your code from Lecture 13 into the new Vite project's `src` folder.
3. Refactor your `taskModel` and UI logic into **Classes** (e.g., `class TaskManager`).
4. Install and configure **ESLint** (Flat Config) and ensure your code has zero lint warnings.
5. Run `npm run dev` to test your application in the browser.
6. Run `npm run build` to generate a production-ready `dist` folder.

Congratulations! You now have a professionally structured, modern JavaScript project.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Vite Documentation | https://vitejs.dev/ |
| ESLint Flat Config | https://eslint.org/docs/latest/use/configure/configuration-files |

---

## 📌 Key Takeaways
- **Template literals** (`` ` ``) replace string concatenation.
- **Optional chaining** (`?.`) and **Nullish coalescing** (`??`) make code safer.
- **Classes** provide clear structure for objects with shared behaviour.
- **Vite** is the modern standard for local dev servers and bundling.
- **ESLint 9** uses `eslint.config.js` to enforce code quality.

---

**Next Lecture:** [Lecture 15 — Modern CSS Frameworks: Bootstrap & Tailwind CSS](./15%20-%20Modern%20CSS%20Frameworks%20—%20Bootstrap%20%26%20Tailwind%20CSS.md) — Module 3 begins!