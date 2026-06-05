# Lecture 14 — ES6+ Modern Features & JavaScript Tooling

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 1. 🏗️ Prerequisites

Before starting this lecture, you should have:
- A solid understanding of fundamental JavaScript concepts (variables, functions, loops, and control flow).
- Familiarity with object and array literal syntax.
- Basic understanding of the DOM and how JavaScript interacts with HTML elements.
- Node.js installed on your local machine (LTS version recommended).
- A modern code editor, such as Visual Studio Code, installed and properly configured.
- Familiarity with terminal/command-line navigation (e.g., changing directories, running basic commands).

---

## 2. 🎯 Objectives

By the end of this lecture, you will be able to:
- Use template literals for string interpolation and multiline strings to write cleaner, more readable code.
- Safely access nested properties with optional chaining (`?.`) and nullish coalescing (`??`) without crashing your application.
- Write modern, object-oriented code using ES6 classes with constructors, inheritance, and static methods.
- Implement `Set` and `Map` data structures for specialised and performant data collections.
- Set up a modern JavaScript project using npm to manage dependencies and scripts.
- Configure ESLint 9 using the modern **Flat Config** system to enforce code quality and style.
- Understand the role of bundlers, specifically Vite, and how they optimise code for production.

---

## 3. 📋 Agenda

### Part 1 — Theory (~90 min)
1. **Template literals** & string interpolation.
2. **Optional chaining** (`?.`) & nullish coalescing (`??`).
3. **Classes**: constructor, methods, inheritance (`extends`), and private fields.
4. **Collections**: `Set` and `Map`.
5. **Tooling**: npm, `package.json`, and `node_modules`.
6. **Bundlers**: Vite basics and configuration.
7. **Linting**: ESLint 9 Flat Config (`eslint.config.js`).

### Part 2 — Practice & Lab (~90–120 min)
1. **Lab 1**: Build a class-based component system.
2. **Lab 2**: Set up a project with npm, ESLint, and Vite.
3. **Assignment**: TaskFlow Project Part 6 (Final Tooling & Classes migration).

---

## 4. 🤿 Deep Dive

### 4.1 Template Literals

**What Are Template Literals? (Plain English)**

Template literals are an upgraded way to write strings in JavaScript. Before ES6, combining strings with variables was messy — you had to use the `+` operator to "glue" things together. Template literals use **backticks** (`` ` ``) and let you embed any JavaScript expression directly inside a string using `${}`.

Think of them like a fill-in-the-blank form: you write the text with blank spaces (`${}`), and JavaScript fills them in with the actual values.

```js
const name = "Alice";
const age  = 25;
const city = "Cairo";

// ❌ Old string concatenation — verbose and error-prone
const message1 = "Hello, " + name + "! You are " + age + " years old and live in " + city + ".";

// ✅ Template literal — clean and readable
const message2 = `Hello, ${name}! You are ${age} years old and live in ${city}.`;

// You can put ANY JavaScript expression inside ${}:
const price = 9.99;
const quantity = 3;
const receipt = `Total: $${(price * quantity).toFixed(2)}`; // "Total: $29.97"

// Ternary expressions work too:
const status = `Status: ${age >= 18 ? "Adult" : "Minor"}`;
```

**Multiline Strings**

Template literals preserve newlines naturally:

```js
// ❌ Old way — escape characters and concatenation
const html1 = "<div>\n  <h1>Hello</h1>\n  <p>World</p>\n</div>";

// ✅ Template literal — just press Enter!
const html2 = `
<div>
  <h1>Hello</h1>
  <p>World</p>
</div>
`;
```

**Tagged Template Literals (Advanced)**

A "tag" is a function that processes a template literal. This is how libraries like `styled-components` and `graphql-tag` work:

```js
// The tag function receives the string parts and interpolated values separately
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined
      ? `<strong>${values[i]}</strong>`
      : '';
    return result + str + value;
  }, '');
}

const product = "Laptop";
const price   = 999;

const output = highlight`The ${product} costs $${price} dollars.`;
// "The <strong>Laptop</strong> costs $<strong>999</strong> dollars."
```

### 4.2 Optional Chaining (`?.`) & Nullish Coalescing (`??`)

**The Problem: Crashing on Nested Properties**

In real apps, you work with data from APIs that might be incomplete. Accessing a property on `null` or `undefined` immediately throws an error and crashes your app.

```js
// Imagine this response from an API where 'address' might not exist:
const user = {
  name: "Alice",
  profile: {
    bio: "Developer",
    // address is missing for this user!
  }
};

// ❌ CRASH! TypeError: Cannot read properties of undefined (reading 'zip')
const zip = user.profile.address.zip;

// ❌ Old defensive code — verbose
const zip = user && user.profile && user.profile.address && user.profile.address.zip;
```

**Optional Chaining (`?.`) — Safe Access**

The `?.` operator short-circuits and returns `undefined` if anything in the chain is `null` or `undefined`, instead of crashing:

```js
const user = { name: "Alice", profile: { bio: "Developer" } };

// ✅ Returns undefined gracefully if any part is null/undefined
const zip      = user?.profile?.address?.zip;      // undefined (no crash!)
const city     = user?.profile?.address?.city;     // undefined
const bio      = user?.profile?.bio;               // "Developer" ✅

// ✅ Optional chaining on method calls:
const upper = user?.profile?.bio?.toUpperCase(); // "DEVELOPER"

// ✅ Optional chaining on arrays:
const firstTag = user?.profile?.tags?.[0]; // undefined (no crash if tags is undefined)

// ✅ Optional chaining on function calls:
user?.sendEmail?.(); // Only calls sendEmail() if it exists!
```

**Nullish Coalescing (`??`) — Smarter Defaults**

The `??` operator returns the **right-hand value** only when the left-hand value is `null` or `undefined`. This is different from `||`, which triggers for ANY falsy value (including `0`, `""`, `false`).

```
Why ?? vs ||?

Value     ||  10    ??  10
─────────────────────────
null      →   10    →   10   (both handle null)
undefined →   10    →   10   (both handle undefined)
0         →   10    →   0    (!! BIG DIFFERENCE !!)
""        →   10    →   ""   (!! BIG DIFFERENCE !!)
false     →   10    →   false(!! BIG DIFFERENCE !!)
```

```js
// A user's settings — 0 and "" are VALID values!
const settings = {
  volume: 0,       // Muted — valid!
  username: "",    // Empty name — valid!
  timeout: null,   // Not set
};

// ❌ || breaks with falsy values
const volume   = settings.volume   || 50; // 50! (Wrong — 0 was intentional)
const username = settings.username || "Guest"; // "Guest"! (Wrong — "" was intentional)
const timeout  = settings.timeout  || 30;      // 30 ✅ (Correct — null means "not set")

// ✅ ?? only triggers on null/undefined
const volume2   = settings.volume   ?? 50; // 0 ✅ (preserves the intentional 0)
const username2 = settings.username ?? "Guest"; // "" ✅ (preserves the empty string)
const timeout2  = settings.timeout  ?? 30; // 30 ✅ (null correctly falls back)
```

**Combining `?.` and `??`**

They work beautifully together:

```js
// Safe access + meaningful default in one line:
const zip       = user?.profile?.address?.zip ?? "Unknown ZIP";
const firstPost = user?.posts?.[0]?.title    ?? "No posts yet";
const volume    = userPrefs?.audio?.volume   ?? 75;
```

**Nullish Assignment (`??=`)**

A shorthand for "assign only if currently null or undefined":

```js
let config = { timeout: null, retries: 0, name: "" };

// Only assigns if the value is null or undefined:
config.timeout ??= 5000;  // Assigns! (null → 5000)
config.retries ??= 3;     // Does NOT assign! (0 is not null/undefined)
config.name    ??= "App"; // Does NOT assign! ("" is not null/undefined)

console.log(config); // { timeout: 5000, retries: 0, name: "" }
```

### 4.3 ES6 Classes

**What Is a Class? (Plain English)**

A class is a **blueprint** or **template** for creating objects. Imagine you're building a game with many characters. Instead of defining each character's properties from scratch, you create a `Character` blueprint that specifies what every character has (name, health, level) and what every character can do (`attack()`, `heal()`). Then you stamp out as many characters as you need from that blueprint.

```
CLASS BLUEPRINT:          INSTANCE (from blueprint):
─────────────────         ──────────────────────────
class Character {         const alice = new Character("Alice", 100);
  name                    alice.name   → "Alice"
  health                  alice.health → 100
  attack() { ... }        alice.attack() → damages target
}
```

**Defining a Class**

```js
class Product {
  // Constructor — runs when 'new Product(...)' is called
  // Sets up the initial state of each instance
  constructor(name, price, category) {
    this.name     = name;
    this.price    = price;
    this.category = category;
    this.createdAt = new Date();  // Auto-set when created
  }

  // Instance method — available on every Product instance
  getFormattedPrice() {
    return `$${this.price.toFixed(2)}`;
  }

  // Instance method — another example
  isExpensive() {
    return this.price > 100;
  }

  // Static method — belongs to the CLASS, not individual instances
  // Called as: Product.compare(p1, p2)
  static compare(productA, productB) {
    return productA.price - productB.price;
  }

  // Getter — accessed like a property, not called as a function
  get summary() {
    return `${this.name} (${this.category}): ${this.getFormattedPrice()}`;
  }
}

// Creating instances:
const laptop = new Product("Laptop", 999.99, "Electronics");
const shirt  = new Product("Shirt", 24.99, "Clothing");

console.log(laptop.name);              // "Laptop"
console.log(laptop.getFormattedPrice()); // "$999.99"
console.log(laptop.isExpensive());     // true
console.log(laptop.summary);           // "Laptop (Electronics): $999.99"

// Static method on the class itself:
const products = [laptop, shirt];
const sorted = products.toSorted(Product.compare);
```

**Inheritance with `extends`**

Inheritance lets you create a **specialised version** of an existing class, reusing all of its code and adding or overriding what's needed:

```js
// Parent (base) class
class Animal {
  constructor(name, sound) {
    this.name  = name;
    this.sound = sound;
  }

  speak() {
    return `${this.name} says: ${this.sound}!`;
  }

  toString() {
    return `Animal(${this.name})`;
  }
}

// Child (derived) class
class Dog extends Animal {
  constructor(name, breed) {
    // 'super()' MUST be called FIRST — it calls the parent constructor
    super(name, "Woof"); // Hardcode the sound for all dogs

    // Now you can use 'this':
    this.breed = breed;
    this.tricks = [];
  }

  // Add NEW method (specific to Dog)
  learn(trick) {
    this.tricks.push(trick);
    return `${this.name} learned: ${trick}`;
  }

  // OVERRIDE parent method (polymorphism)
  speak() {
    const baseSpeech = super.speak(); // Call the parent's speak()
    return `${baseSpeech} 🐕 (${this.breed})`;
  }
}

const rex = new Dog("Rex", "German Shepherd");

console.log(rex.speak());        // "Rex says: Woof! 🐕 (German Shepherd)"
console.log(rex.learn("Sit"));   // "Rex learned: Sit"
console.log(rex.tricks);         // ["Sit"]
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true — it's both!
```

**Private Fields in Classes (ES2022)**

We covered this in Lecture 12, but here's a complete class example combining everything:

```js
class BankAccount {
  #balance;          // Private — only accessible inside this class
  #transactionLog = []; // Private with default value

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new RangeError("Amount must be positive");
    this.#balance += amount;
    this.#transactionLog.push({ type: 'deposit', amount, balance: this.#balance });
    return this;   // Return 'this' for method chaining!
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.#transactionLog.push({ type: 'withdrawal', amount, balance: this.#balance });
    return this;
  }

  // Getter (read-only access to private data):
  get balance() { return this.#balance; }

  get history() { return [...this.#transactionLog]; }

  static createSavingsAccount(owner) {
    return new BankAccount(owner, 0);
  }
}

// Method chaining because we return 'this'!
const account = new BankAccount("Alice", 1000);
account.deposit(500).deposit(200).withdraw(100);
console.log(account.balance); // 1600
```

### 4.4 Collections: `Set` and `Map`

**Why Use `Set` and `Map`?**

Before ES6, plain objects (`{}`) and arrays (`[]`) were used for everything. But they have limitations:
- Arrays can hold **duplicate** values and have no efficient lookup by key.
- Objects only accept string/Symbol keys.

`Set` and `Map` solve specific problems that objects and arrays can't handle cleanly.

**`Set` — A Collection of Unique Values**

A `Set` automatically **removes duplicates**. You can't have the same value twice.

```
Regular Array:   [1, 2, 2, 3, 3, 4]  ← Duplicates allowed
Set:             {1, 2, 3, 4}         ← Duplicates removed automatically
```

```js
// Create a Set:
const uniqueIds = new Set([1, 2, 2, 3, 3, 3]);
console.log(uniqueIds); // Set { 1, 2, 3 } — duplicates removed!

// Adding/removing/checking:
uniqueIds.add(4);        // Add a value
uniqueIds.delete(1);     // Remove a value
uniqueIds.has(2);        // true — check existence (O(1) lookup — very fast!)
uniqueIds.size;          // 3 — number of unique values

// Convert to an array when needed:
const array = [...uniqueIds];  // [2, 3, 4]

// Practical use case: Remove duplicates from an array
const tags = ["js", "web", "js", "html", "web", "css"];
const uniqueTags = [...new Set(tags)]; // ["js", "web", "html", "css"]

// Find intersection of two sets:
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);
const intersection = new Set([...setA].filter(x => setB.has(x)));
// Set { 3, 4 }
```

**`Map` — Key-Value Pairs with Any Key Type**

A `Map` is like an object but more powerful: **any type** can be a key (objects, functions, numbers — not just strings).

```js
// Create a Map:
const userCache = new Map();

// Setting key-value pairs:
userCache.set("alice-123", { name: "Alice", age: 25 });
userCache.set("bob-456",   { name: "Bob",   age: 30 });

// DOM elements as keys! (impossible with regular objects)
const buttonEl = document.querySelector('#submit');
const buttonMeta = new Map();
buttonMeta.set(buttonEl, { clickCount: 0, lastClicked: null });

// Getting values:
const alice = userCache.get("alice-123"); // { name: "Alice", age: 25 }
userCache.has("carol-789"); // false

// Map size and iteration:
console.log(userCache.size); // 2

userCache.forEach((value, key) => {
  console.log(`${key}: ${value.name}`);
});

// Convert to array of entries:
const entries = [...userCache.entries()]; // [[key, value], [key, value]]
const keys    = [...userCache.keys()];    // ["alice-123", "bob-456"]
const values  = [...userCache.values()];  // [{...}, {...}]

// Map preserves insertion order (unlike objects in some edge cases):
const orderedMap = new Map();
orderedMap.set("z", 1);
orderedMap.set("a", 2);
orderedMap.set("m", 3);
[...orderedMap.keys()]; // ["z", "a", "m"] — insertion order preserved!
```

**When to Use What**

| Use Case | Use |
|----------|-----|
| Remove duplicates from array | `Set` |
| Check membership fast (`has()`) | `Set` |
| Key-value store with string keys | Plain object or `Map` |
| Key-value store with non-string keys | `Map` |
| Need to preserve insertion order reliably | `Map` |
| Frequently adding/removing entries | `Map` |

### 4.5 JavaScript Tooling — npm

**What Is npm? (Plain English)**

**npm** (Node Package Manager) is the world's largest software registry. Think of it like an app store for JavaScript code. Instead of copy-pasting code from Stack Overflow, you install battle-tested, maintained packages with a single command.

When you install npm packages:
- Dependencies are listed in `package.json` (the project's "shopping list")
- The actual code goes in `node_modules/` (never commit this to Git!)
- A `package-lock.json` locks the exact versions for reproducible installs

**Key npm Commands**

```bash
# Initialize a new project (creates package.json):
npm init -y          # -y answers all prompts with defaults

# Install a package as a production dependency:
npm install lodash   # Shorthand: npm i lodash

# Install as a development-only dependency (not needed in production):
npm install --save-dev eslint  # Shorthand: npm i -D eslint

# Install all dependencies listed in package.json:
npm install          # (after cloning a project)

# Run a script defined in package.json:
npm run dev
npm run build
npm run test

# Check for outdated packages:
npm outdated

# Remove a package:
npm uninstall lodash
```

**Understanding `package.json`**

```json
{
  "name": "taskflow",
  "version": "1.0.0",
  "description": "A task management app",
  "type": "module",           // ← Enables ES modules in Node.js
  "scripts": {
    "dev": "vite",            // Run: npm run dev
    "build": "vite build",   // Run: npm run build
    "preview": "vite preview",
    "lint": "eslint src/"
  },
  "dependencies": {
    // Production dependencies — needed when the app is running
  },
  "devDependencies": {
    // Dev-only dependencies — needed during development only
    "vite": "^6.0.0",
    "eslint": "^9.0.0"
  }
}
```

**The `node_modules` Folder**

> [!WARNING]
> **NEVER commit `node_modules` to Git.** It can contain thousands of files (tens of megabytes). Always create a `.gitignore` file with `node_modules` listed.

```
# .gitignore
node_modules/
dist/
.env
```

### 4.6 Bundlers — Vite

**What Does a Bundler Do? (Plain English)**

When you develop with ES modules, your code is split across many files. Browsers can fetch modules, but making hundreds of HTTP requests is slow in production.

A **bundler** takes all your files and:
1. **Bundles** them into a small number of optimised files
2. **Transpiles** modern JS to be compatible with older browsers
3. **Minifies** code (removes whitespace, shortens variable names)
4. **Tree-shakes** unused code (if you import `add` from `math.js`, it won't include `multiply` if you don't use it)

```
Development:          Production (after bundling):
──────────────        ──────────────────────────────
src/
  app.js        →    dist/
  taskModel.js  →      assets/
  api.js        →        main-Abc123.js   (1 optimised file)
  utils.js      →        style-Xyz789.css
  style.css     →      index.html
index.html
```

**Setting Up Vite**

**Vite** is the modern standard for front-end development. It offers:
- Instant dev server startup (no bundling in dev — browsers handle modules directly)
- Lightning-fast Hot Module Replacement (your changes appear instantly)
- Optimised production builds using Rollup under the hood

```bash
# Step 1: Create a new Vite project
npm create vite@latest taskflow-vite -- --template vanilla

# Step 2: Enter the project directory
cd taskflow-vite

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev    # Opens at http://localhost:5173

# Step 5 (when ready for production): Build
npm run build  # Creates the /dist folder
```

**What Vite Creates**

```
taskflow-vite/
├── index.html          ← Entry HTML (Vite uses this as the entry point)
├── package.json
├── vite.config.js      ← Vite configuration (optional for basic projects)
├── public/             ← Static assets (images, fonts — not processed by Vite)
└── src/                ← Your source code
    ├── main.js         ← JavaScript entry point
    └── style.css       ← Global styles
```

**Basic `vite.config.js`**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  // Configure the dev server:
  server: {
    port: 3000,       // Change the port (default: 5173)
    open: true,       // Auto-open browser on start
  },
  // Configure the build output:
  build: {
    outDir: 'dist',   // Output directory (default: 'dist')
    minify: true,     // Minify the output
  },
});
```

### 4.7 Linting — ESLint 9 Flat Config

**What Is a Linter? (Plain English)**

A linter is like a **spell checker for your code**. It automatically scans your code for:
- **Actual bugs** (variables used before being defined, unreachable code)
- **Style inconsistencies** (mixing `==` and `===`)
- **Bad practices** (using `var`, having unused variables)

ESLint is the industry-standard linter for JavaScript.

**ESLint 9's Big Change: Flat Config**

Before ESLint 9, configuration was stored in a `.eslintrc.json` or `.eslintrc.js` file using a cascade system (child folders could override parent configs). **ESLint 9 completely replaced this** with a new "Flat Config" system using a single `eslint.config.js` file.

> [!IMPORTANT]
> If you find ESLint documentation or tutorials using `.eslintrc.*` files, they are outdated. ESLint 9+ uses `eslint.config.js` only.

**Setting Up ESLint 9**

```bash
# Install ESLint and create a flat config automatically:
npm install --save-dev eslint @eslint/js

# Or use the wizard:
npm init @eslint/config
```

**`eslint.config.js` — The New Flat Config**

```js
// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
  // Layer 1: Enable ESLint's recommended built-in rules
  js.configs.recommended,

  // Layer 2: Your project-specific settings
  {
    // Which files this config applies to (glob patterns):
    files: ["src/**/*.js"],

    // Global variables (tells ESLint what is available globally)
    languageOptions: {
      // What JavaScript version to support:
      ecmaVersion: "latest",
      // What module system to use:
      sourceType: "module",
      // Browser globals (window, document, etc. are valid):
      globals: {
        ...globals.browser,
      },
    },

    // Rules — "off", "warn", or "error"
    rules: {
      // ─── Code Quality ───────────────────────────────────────
      "no-unused-vars": "warn",       // Warn about unused variables
      "no-console": "off",            // Allow console.log in dev
      "eqeqeq": ["error", "always"],  // Always use === not ==
      "no-var": "error",              // Never use var
      "prefer-const": "warn",         // Use const when variable isn't reassigned

      // ─── Best Practices ────────────────────────────────────
      "no-eval": "error",             // Never use eval() (security risk)
      "no-implicit-globals": "error", // No global variables
      "curly": "error",               // Always use braces for if/else
    }
  },

  // Layer 3: Different rules for test files
  {
    files: ["**/*.test.js"],
    rules: {
      "no-console": "off",
    }
  }
];
```

**Running ESLint**

```bash
# Check all files in src/ for issues:
npx eslint src/

# Check a specific file:
npx eslint src/app.js

# Auto-fix issues that ESLint can fix (formatting, etc.):
npx eslint src/ --fix
```

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

Then run: `npm run lint`

**Common ESLint Rules Explained**

| Rule | What it catches | Level |
|------|----------------|-------|
| `no-unused-vars` | Variables you declare but never use | warn |
| `eqeqeq` | Using `==` instead of `===` | error |
| `no-var` | Using `var` instead of `let`/`const` | error |
| `prefer-const` | Using `let` when `const` would work | warn |
| `no-eval` | Using `eval()` — a security vulnerability | error |
| `no-undef` | Using variables that haven't been declared | error |

---

## 5. 🧠 Think Like a Dev

- **Tooling vs. Language:** A key mental shift is separating *JavaScript the language* from *JavaScript tooling*. The language (ES6+) is what runs in the browser. Tooling (Vite, ESLint, npm) is the infrastructure that helps you write better code and prepares it for production execution. Mastering the tooling can significantly accelerate your workflow.
- **Fail Fast vs. Fail Gracefully:** Optional chaining (`?.`) allows you to fail gracefully instead of crashing. But think critically: *should* you fail gracefully? If missing data indicates a critical system error, sometimes you want the app to throw an error early so you can identify and fix the underlying data issue immediately rather than burying it with safe accessors.
- **DRY (Don't Repeat Yourself) with Classes:** Use inheritance (`extends`) cautiously. Favor "composition over inheritance" where it makes sense, but use inheritance to avoid repeating boilerplate (e.g., standard properties every UI component needs). Inheritance builds tight coupling, so it's a double-edged sword.
- **Data Structures Matter:** Choosing the right data structure (e.g., `Set` instead of `Array` for checking uniqueness) often solves half the algorithmic problem without needing complex logic. A good developer always asks: "Is an array the best tool for this, or do I need a Set or Map?"

---

## 6. 🔄 Before / After

A quick visual reference showing how modern features clean up your code.

**String Interpolation**
```js
// BEFORE (Pre-ES6)
var greeting = "Hello, my name is " + name + " and I am " + age + " years old.";

// AFTER (ES6+)
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;
```

**Safe Property Access**
```js
// BEFORE
var zipCode = user && user.address && user.address.zipCode;

// AFTER
const zipCode = user?.address?.zipCode;
```

**Default Values**
```js
// BEFORE (Buggy with 0 or "")
var quantity = input.quantity || 1; // If input.quantity is 0, it incorrectly falls back to 1

// AFTER (Safe)
const quantity = input.quantity ?? 1; // correctly preserves 0 and empty strings
```

**Collections (Unique Values)**
```js
// BEFORE
var uniqueNumbers = [];
for (var i = 0; i < numbers.length; i++) {
  if (uniqueNumbers.indexOf(numbers[i]) === -1) {
    uniqueNumbers.push(numbers[i]);
  }
}

// AFTER
const uniqueNumbers = [...new Set(numbers)];
```

---

## 7. ⚠️ Common Mistakes & How to Avoid Them

### Mistake 1: Confusing `??` and `||` for Defaults

```js
const user = { score: 0, name: "" };

// ❌ || treats 0 and "" as falsy — wrong defaults!
const score = user.score || 100; // 100! (Should be 0)
const name  = user.name  || "Anonymous"; // "Anonymous"! (Should be "")

// ✅ ?? only triggers on null/undefined:
const score2 = user.score ?? 100; // 0 ✅
const name2  = user.name  ?? "Anonymous"; // "" ✅
```

### Mistake 2: Forgetting `super()` in a Child Constructor

```js
class Animal { constructor(name) { this.name = name; } }

class Dog extends Animal {
  constructor(name, breed) {
    // ❌ Forgot super() — ReferenceError: Must call super before accessing 'this'
    this.breed = breed;

    // ✅ Always call super() FIRST before using 'this'
    super(name);
    this.breed = breed;
  }
}
```

### Mistake 3: Using `Set` to Remove Duplicates from an Array of Objects

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 1, name: "Alice" }, // "Duplicate"
];

// ❌ This does NOT remove duplicates! Objects are compared by reference, not value.
const unique = [...new Set(users)]; // Still 2 items!

// ✅ Use filter() and findIndex() for objects:
const unique2 = users.filter((user, index, arr) =>
  arr.findIndex((u) => u.id === user.id) === index
);
```

### Mistake 4: Committing `node_modules`

```bash
# ✅ Always create .gitignore before first commit!
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
git add .gitignore
git commit -m "Add .gitignore"
```

### Mistake 5: Using `npm install` in a Fresh Clone Without `.lock` File

```bash
# ✅ After cloning, always install from lock file:
npm ci          # Installs exactly what's in package-lock.json
# NOT: npm install  (which may update to newer minor versions)
```

---

## 8. 🧪 Labs

### Lab 1: Class-Based Component System (45 min)

**Goal:** Practice ES6 class inheritance and static methods.

1. Open `labs/lab1-classes/app.js`.
2. Create a base `UIComponent` class:
   - Constructor: `(selector)` — finds the element with `querySelector(selector)`
   - Method: `show()` — removes `hidden` class
   - Method: `hide()` — adds `hidden` class
   - Method: `render(html)` — sets `innerHTML` (abstract — meant to be overridden)
3. Create a `Modal` class that `extends UIComponent`:
   - Additional constructor parameters: `title`, `content`
   - Override `render()` to output modal HTML
   - Add `open()` and `close()` methods
   - Add static `create(title, content)` that instantiates and opens a modal
4. Instantiate and test a modal.

### Lab 2: Vite & ESLint Setup (45 min)

**Goal:** Set up a complete, professional tooling pipeline from scratch.

1. Navigate to `labs/lab2-tooling/` in your terminal.
2. Run `npm create vite@latest . -- --template vanilla` to scaffold the project.
3. Install ESLint: `npm install --save-dev eslint @eslint/js globals`
4. Create `eslint.config.js` with browser globals and the rules from this lecture.
5. Run `npm run dev` — verify it works.
6. Add a `lint` script to `package.json`.
7. Introduce a bug (use `var`, `==`, or an unused variable) and run `npm run lint` to see ESLint catch it.

---

### 📝 Assignment: TaskFlow Project — Part 6 (Final)

Migrate TaskFlow to a professional, modern toolchain.

**Requirements**

**1. Scaffold with Vite:**
```bash
npm create vite@latest taskflow-final -- --template vanilla
cd taskflow-final
npm install
```

**2. Migrate your code** from Lecture 13 into the new `src/` folder.

**3. Refactor into a Class-Based Architecture:**
```js
// src/TaskManager.js
export class TaskManager {
  #tasks = [];

  addTask(title) {
    const task = { id: Date.now(), title, completed: false };
    this.#tasks = [...this.#tasks, task];
    return task;
  }

  deleteTask(id) {
    this.#tasks = this.#tasks.filter((t) => t.id !== id);
  }

  toggleTask(id) {
    this.#tasks = this.#tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
  }

  get tasks() {
    return [...this.#tasks]; // Return a copy — private data is safe!
  }

  get pendingCount() {
    return this.#tasks.filter((t) => !t.completed).length;
  }
}
```

**4. Install and configure ESLint** with zero warnings in your code.

**5. Run `npm run build`** and open the `dist/` folder — your production-ready app!

---

## 9. 💼 Interview Prep

Common technical questions asked in interviews regarding this material:

1. **What is the difference between `null` and `undefined`? How do `?.` and `??` treat them?**
   *Answer:* `undefined` means a variable has been declared but not assigned a value. `null` is an assignment value representing no value. `?.` and `??` treat both equally: they short-circuit or provide fallbacks for both `null` and `undefined`, but ignore other falsy values.

2. **What's the difference between a `Map` and a plain JavaScript object?**
   *Answer:* A `Map` can have any data type (even objects or functions) as a key, preserves insertion order, and has built-in methods like `.size`. Objects only support strings or Symbols as keys.

3. **Can you explain the difference between `dependencies` and `devDependencies` in `package.json`?**
   *Answer:* `dependencies` are libraries required for the application to run in production (like React or Express). `devDependencies` are only needed during development (like ESLint or Vite).

4. **Why do we need bundlers like Vite or Webpack?**
   *Answer:* Browsers are inefficient at loading hundreds of small ES modules over the network. Bundlers combine these files into a few optimized, minified assets, and often transpile newer JavaScript features to work on older browsers.

5. **Explain the difference between `||` and `??`.**
   *Answer:* `||` (logical OR) returns the right-hand operand if the left is *any* falsy value (like `0`, `""`, `false`, `null`, `undefined`). `??` (nullish coalescing) only returns the right-hand operand if the left is exactly `null` or `undefined`.

---

## 10. 📝 Cheat Sheet

**String Interpolation**
```js
const text = `Hello ${name}!
Multiline is easy.`;
```

**Optional Chaining & Nullish Coalescing**
```js
const zip = user?.address?.zip;
const amount = config.amount ?? 100; // Only defaults on null/undefined
```

**Classes**
```js
class Child extends Parent {
  #privateData;
  constructor(name) {
    super(name);
    this.#privateData = 42;
  }
  static utilityMethod() {}
}
```

**Sets & Maps**
```js
const mySet = new Set([1, 2, 2, 3]); // {1, 2, 3}
mySet.has(2); // true
mySet.add(4);

const myMap = new Map();
myMap.set('key', 'value');
myMap.get('key');
```

**npm & Tooling Commands**
```bash
npm init -y                  # Create package.json
npm i lodash                 # Install dependency
npm i -D eslint              # Install dev dependency
npm run dev                  # Run dev script
npm run build                # Run build script
npm create vite@latest app   # Scaffold Vite project
```

---

## 11. 📌 Key Takeaways

- **Template literals** (`` ` ``) replace string concatenation — embed any expression with `${}`.
- **Optional chaining** (`?.`) safely accesses nested properties without crashing.
- **Nullish coalescing** (`??`) provides defaults only for `null`/`undefined` — unlike `||` which triggers for any falsy value.
- **Classes** are blueprints for objects — use `extends` for inheritance, `super()` to call the parent.
- **`Set`** holds unique values; **`Map`** holds key-value pairs with any key type.
- **npm** manages dependencies — never commit `node_modules`.
- **Vite** is the modern standard for dev servers and production builds.
- **ESLint 9** uses `eslint.config.js` (Flat Config) — `.eslintrc` is deprecated.

---

**Next Lecture:** [Lecture 15 — Bootstrap 5: Grid System, Components & Utilities](./15%20-%20Bootstrap%205%20—%20Grid%20System,%20Components%20%26%20Utilities.md) — Module 3 begins!