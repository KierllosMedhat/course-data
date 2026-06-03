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

### What Is Scope? (Plain English)

**Scope** determines **where a variable is accessible**. Think of scope like the security clearance system in an office building. Some rooms (variables) are accessible to everyone (global scope), some are only accessible to certain departments (function scope), and some are locked to a specific desk (block scope).

If you don't have clearance for a room, you can't access it — and you get an error (ReferenceError).

### Why Does This Matter?

Without scope, every variable in every file would be available everywhere, and two developers' variables named `i`, `count`, or `data` would constantly collide and overwrite each other. Scope is what makes large codebases manageable.

```
Scope Visualisation:
────────────────────────────────────────────────────
 GLOBAL SCOPE  (accessible everywhere in the program)
 ┌─────────────────────────────────────────────────┐
 │  const appName = "TaskFlow";                    │
 │                                                 │
 │  FUNCTION SCOPE of outer()                      │
 │  ┌──────────────────────────────────────────┐   │
 │  │  const outerValue = "I'm outer";         │   │
 │  │                                          │   │
 │  │  FUNCTION SCOPE of inner()               │   │
 │  │  ┌───────────────────────────────────┐   │   │
 │  │  │  const innerValue = "I'm inner";  │   │   │
 │  │  │  // Can access: innerValue ✅     │   │   │
 │  │  │  //             outerValue ✅     │   │   │
 │  │  │  //             appName    ✅     │   │   │
 │  │  └───────────────────────────────────┘   │   │
 │  │  // Can access: outerValue ✅            │   │
 │  │  //             appName    ✅            │   │
 │  │  // Can NOT access: innerValue ❌        │   │
 │  └──────────────────────────────────────────┘   │
 │  // Can access: appName ✅                      │
 │  // Can NOT access: outerValue ❌               │
 └─────────────────────────────────────────────────┘
```

### The Three Scope Types

```js
// 1. GLOBAL SCOPE — Variables declared outside any function or block
const globalMessage = "I'm global"; // Accessible everywhere in the file

// 2. FUNCTION SCOPE — Variables declared inside a function
function showScore() {
  const score = 100; // 'score' only lives inside showScore()
  console.log(score); // ✅ Fine — we're inside the function
}
// console.log(score); // ❌ ReferenceError: score is not defined
// The variable 'score' doesn't exist outside the function

// 3. BLOCK SCOPE — Variables declared inside {} with let or const
if (true) {
  let blockMessage = "I'm block-scoped";   // Only lives inside this if-block
  const alsoBlock  = "Me too!";            // Same — only inside the block
  var notBlock     = "I'm function-scoped"; // ⚠️ var IGNORES block scope!
}
// console.log(blockMessage); // ❌ ReferenceError — doesn't exist here
// console.log(notBlock);     // ✅ var leaks out of blocks — a dangerous trap!
```

> [!WARNING]
> **Never use `var`!** It ignores block scope and can cause hard-to-find bugs. Always use `let` (for values that change) and `const` (for values that don't). This is one of the most important rules in modern JavaScript.

### Lexical (Static) Scope

JavaScript uses **lexical scope** — meaning scope is determined by **where** functions are *written* in the source code, not where they are *called from*.

**Analogy:** Your citizenship is determined by where you were born, not where you currently live. A function's scope is determined by where it was written, not where it's called from.

```js
const username = "Alice";

function greet() {
  // 'username' is looked up in the scope where greet is DEFINED (global scope)
  // NOT in the scope where greet is CALLED FROM.
  console.log(`Hello, ${username}`);
}

function spoofCaller() {
  const username = "Bob"; // This 'username' is local to spoofCaller
  greet(); // Even though greet() is called here, it still uses "Alice"!
           // greet() was DEFINED in global scope, so it uses global 'username'
}

spoofCaller(); // "Hello, Alice" — NOT "Hello, Bob"!
```

### The Scope Chain

When JavaScript looks up a variable, it starts in the current scope. If not found, it moves to the **outer scope**. Then the outer-outer scope. All the way to global. If it's not found anywhere, you get a `ReferenceError`.

This chain of scopes is called the **scope chain**, and it only goes **outward** (inner can access outer, outer cannot access inner).

```js
const level1 = "global";

function outer() {
  const level2 = "outer function";

  function inner() {
    const level3 = "inner function";

    // JavaScript searches the scope chain: inner → outer → global
    console.log(level3); // ✅ Found in current (inner) scope
    console.log(level2); // ✅ Found in outer scope (scope chain lookup)
    console.log(level1); // ✅ Found in global scope (scope chain lookup)
    // console.log(unknown); // ❌ Not found anywhere → ReferenceError
  }

  inner();
  // console.log(level3); // ❌ Cannot look inward — only outward!
}

outer();
```

### Common Mistakes & How to Avoid Them — Scope

**Mistake 1: Using `var` and being surprised by its behavior**

```js
// ❌ var in a for loop leaks out
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 — because there's only ONE 'var i' and it ends up as 3!

// ✅ let creates a new binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 ✅ — each iteration has its OWN 'i'
```

**Mistake 2: Accidentally creating global variables**

```js
function setupApp() {
  // ❌ Forgetting 'const' or 'let' creates a GLOBAL variable!
  appName = "TaskFlow"; // No 'const' — now it's a global!
}

// ✅ Always use const or let
function setupApp() {
  const appName = "TaskFlow"; // Properly scoped to this function
}
```

### 📌 Section Recap
- **Scope** defines where a variable is accessible
- JavaScript has global, function, and block scope (`let`/`const`)
- **Lexical scope**: scope is determined by where code is written, not where it's called
- The **scope chain** allows inner functions to access outer variables (but not vice versa)
- Never use `var` — always use `let` or `const`

---

## 2. Closures

### What Is a Closure? (Plain English)

A closure is one of the most powerful — and most misunderstood — concepts in JavaScript.

**Analogy:** Imagine you pack your suitcase before a trip. Inside, you put items from your home (the outer scope). Even after you leave your home (the outer function finishes), your suitcase still contains those items — you still have access to them wherever you go. The suitcase is your **closure** — it carries the variables from its original scope.

**Technical definition:** A closure is a function that **remembers** and can access variables from its outer scope, even after the outer function has finished executing.

```js
function createCounter() {
  let count = 0; // This variable lives in createCounter's scope

  // The returned function forms a CLOSURE over 'count'
  // It "captures" 'count' and will remember it forever
  return function() {
    count++;         // Accesses the captured 'count'
    return count;
  };
}

const counter = createCounter(); // createCounter() finishes running...
// But 'count' is NOT garbage-collected!
// The inner function still holds a reference to it via closure.

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Each call to createCounter() creates an INDEPENDENT closure:
const counterB = createCounter();
console.log(counterB()); // 1 — completely independent from 'counter'!
console.log(counter());  // 4 — 'counter' continues from where it left off
```

### Step-by-Step: What Happens When a Closure Is Created

1. `createCounter()` is called — a new scope is created with `count = 0`
2. The inner function is created — it "captures" the reference to `count`
3. `createCounter()` finishes and returns the inner function
4. Normally, the scope would be garbage collected... but the inner function still holds a reference to `count`
5. JavaScript keeps `count` alive because the inner function needs it
6. Every call to `counter()` reads and updates the same `count`

### Why Does This Matter?

Closures enable two incredibly powerful patterns:
1. **Data privacy** — creating variables that external code cannot access
2. **State persistence** — maintaining state without global variables

### Data Privacy with Closures (Encapsulation)

Closures are a classic way to create **private data** — variables that external code cannot access or modify directly. This is called **encapsulation**.

**Analogy:** A vending machine exposes buttons (public interface) but hides its internal mechanics (private state). You can buy a soda, but you can't directly access the inventory count.

```js
function createUser(name) {
  // 'loginCount' and 'lastLogin' are PRIVATE — no outside code can touch them directly
  let loginCount = 0;
  let lastLogin = null;

  // We return an OBJECT with PUBLIC methods that interact with the private data
  return {
    // Public method — read access to private 'name'
    getName() {
      return name; // 'name' is also closed over from the parameter
    },

    // Public method that MODIFIES private data safely
    // External code can't set loginCount to -999 or any invalid value
    login() {
      loginCount++;
      lastLogin = new Date().toLocaleString();
      return `${name} logged in. Total logins: ${loginCount}`;
    },

    // Public method — READ-only access to private data
    // External code can see the stats but cannot change them directly
    getStats() {
      return { loginCount, lastLogin }; // Returns a copy
    }
  };
}

const alice = createUser("Alice");

console.log(alice.login()); // "Alice logged in. Total logins: 1"
console.log(alice.login()); // "Alice logged in. Total logins: 2"
console.log(alice.getStats()); // { loginCount: 2, lastLogin: "..." }

// ❌ External code CANNOT access the private data:
console.log(alice.loginCount); // undefined — it's not exposed on the object!
console.log(alice.lastLogin);  // undefined — not exposed!
// alice.loginCount = 1000;    // Has no effect — the real variable is private
```

### A Practical Closure: Memoization (Caching)

Memoization is a powerful optimization where you cache the results of expensive computations so you never compute the same thing twice:

```js
function createMemoizedFetch(fetchFn) {
  // 'cache' is private to this function — external code can't clear or inspect it
  const cache = new Map();

  return async function(url) {
    // Check if we've already fetched this URL:
    if (cache.has(url)) {
      console.log(`Cache hit for: ${url}`);
      return cache.get(url); // Return cached result instantly
    }

    // Not in cache — fetch it for the first time:
    console.log(`Fetching: ${url}`);
    const data = await fetchFn(url);

    // Store in cache for next time:
    cache.set(url, data);
    return data;
  };
}

const memoFetch = createMemoizedFetch(fetch);

// First call — hits the network (slow)
const data1 = await memoFetch('https://api.example.com/users');

// Second call with same URL — returns instantly from cache!
const data2 = await memoFetch('https://api.example.com/users');
```

### Common Mistakes & How to Avoid Them — Closures

**Mistake 1: Thinking closures "copy" variables (they capture REFERENCES)**

```js
// ❌ Classic closure-in-loop bug with 'var':
const functions = [];
for (var i = 0; i < 3; i++) {
  functions.push(() => console.log(i)); // All capture the SAME 'i' (reference)
}
functions[0](); // 3 (not 0!)
functions[1](); // 3 (not 1!)
functions[2](); // 3 — 'i' ended up as 3 after the loop, all three share it!

// ✅ Fix: Use 'let' — creates a NEW 'i' binding per iteration
for (let i = 0; i < 3; i++) {
  functions.push(() => console.log(i)); // Each closure has its OWN 'i'
}
functions[0](); // 0 ✅
functions[1](); // 1 ✅
functions[2](); // 2 ✅
```

**Mistake 2: Memory leaks — forgetting that closures keep data alive**

```js
// ❌ This element stays in memory even if removed from DOM!
function addHeavyListener(element) {
  const largeData = new Array(1000000).fill('x'); // 1 million strings!
  element.addEventListener('click', () => {
    console.log(largeData.length); // Closure keeps largeData alive!
  });
}

// ✅ Use AbortController to properly clean up:
function addHeavyListener(element) {
  const largeData = new Array(1000000).fill('x');
  const controller = new AbortController();
  element.addEventListener('click', () => {
    console.log(largeData.length);
  }, { signal: controller.signal });

  // When done, abort to release the listener and allow GC:
  return () => controller.abort();
}
```

### 📌 Section Recap
- A **closure** is a function that retains access to its outer scope after the outer function returns
- Closures enable **private data** (encapsulation) — no external code can directly access closed-over variables
- Each call to an outer function creates an **independent closure** — they don't share state
- Closures capture **references**, not values — be careful in loops (use `let`, not `var`)
- Closures keep referenced variables alive — be mindful of memory in long-lived closures

---

## 3. Modern Privacy: `#private` Fields

### From Closures to Classes

The closure approach to privacy works well for **factory functions**. But when using **ES6 Classes**, JavaScript ES2022 introduced a much cleaner, built-in solution: **private class fields** using the `#` prefix.

```js
class BankAccount {
  // Private fields — declared at the top of the class with #
  // Only accessible inside this class — NOT on instances, NOT in subclasses
  #balance = 0;
  #transactionHistory = [];

  constructor(owner, initialDeposit) {
    this.owner = owner; // Public property — accessible from outside
    this.#deposit(initialDeposit); // Call private method
  }

  // Public method — the outside world calls this
  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#deposit(amount); // Calls private helper
    return this.#balance;
  }

  // Public method — withdrawal
  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.#transactionHistory.push({
      type: 'withdrawal',
      amount,
      date: new Date()
    });
    return this.#balance;
  }

  // Getter — read-only access to private balance (accessed like a property)
  get balance() {
    return this.#balance; // External code reads this like account.balance
  }

  // Getter — returns a COPY of history (can't modify the original)
  get history() {
    return [...this.#transactionHistory]; // Spread = copy, not reference
  }

  // Private helper method — only callable inside this class
  #deposit(amount) {
    this.#balance += amount;
    this.#transactionHistory.push({
      type: 'deposit',
      amount,
      date: new Date()
    });
  }
}

const account = new BankAccount("Alice", 1000);

console.log(account.balance);         // 1000 (via getter — reads like a property)
console.log(account.deposit(500));    // 1500
console.log(account.withdraw(200));   // 1300
console.log(account.history);         // [{ type: 'deposit', amount: 1000 }, ...]

// ❌ Cannot access private fields from outside the class:
// console.log(account.#balance);      // SyntaxError: Private field '#balance' must be declared
// account.#deposit(5000);             // SyntaxError!
// account.#balance = 99999;           // SyntaxError!
```

### Closures vs Private Fields: When to Use What

| Approach | Use When |
|----------|----------|
| Closure (factory function) | Writing plain functions that return objects; functional style |
| `#private` fields | Writing classes; OOP style |

```js
// Factory function with closure (functional style):
function createCounter(start = 0) {
  let count = start;
  return {
    increment() { count++; },
    decrement() { count--; },
    get value() { return count; }
  };
}

// Class with private fields (OOP style):
class Counter {
  #count;
  constructor(start = 0) { this.#count = start; }
  increment() { this.#count++; }
  decrement() { this.#count--; }
  get value() { return this.#count; }
}

// Both achieve the same privacy, different style preferences
```

> [!TIP]
> Use `#private` fields when writing **classes**, and use closures when writing **factory functions**. Both are valid — choose based on your coding style and team conventions.

### 📌 Section Recap
- `#private` fields (ES2022) are the modern built-in way to create private data in classes
- Private fields are declared at the top of the class body with the `#` prefix
- They cannot be accessed from outside the class — not on instances, not in subclasses
- Use getters for read-only access to private data
- Closures and `#private` fields both achieve encapsulation — different styles

---

## 4. The `this` Keyword

### What Is `this`? (Plain English)

`this` is one of the most confusing concepts in JavaScript because its value **changes depending on how a function is called**. It's not about where the function is defined — it's about *how* and *who* calls it.

**Analogy:** Think of `this` like the word "I" in English. When I say "I am a developer," "I" refers to me. When you say "I am a developer," "I" refers to you. Same word, different referent based on the speaker (the caller).

### The Four Binding Rules

```
How was the function called?       What does 'this' refer to?
────────────────────────────       ──────────────────────────
new Constructor()                  → The newly created object
object.method()                    → The object (implicit binding)
fn.call(obj) / fn.apply(obj)      → The obj argument (explicit)
fn.bind(obj)()                     → The obj argument (permanent)
Just fn() in strict mode           → undefined
Just fn() in non-strict            → global (window in browser)
Arrow function (any call)          → Lexical (from enclosing scope)
```

### Rule 1: Default Binding

In non-strict mode, a plain function call sets `this` to the global object (`window` in browsers). In strict mode, it's `undefined`. This is the fallback when no other rule applies.

```js
function showThis() {
  console.log(this);
}

showThis(); // window (browser, non-strict) or global (Node.js)
            // undefined (strict mode: "use strict" at top of file)
```

### Rule 2: Implicit Binding (Method Call)

When a function is called as a **method of an object** (`object.method()`), `this` is set to the object to the left of the dot.

```js
const person = {
  name: "Alice",
  greet() {
    // 'this' refers to the object on the left of the dot (person)
    // Because: person.greet() — 'person' is to the left of '.'
    console.log(`Hi, I'm ${this.name}`);
  },
};

person.greet(); // "Hi, I'm Alice" — this = person ✅

// ⚠️ The "losing this" problem:
const greetFn = person.greet; // Extract the function from the object
greetFn(); // "Hi, I'm undefined" — this = window/undefined!
// There's no longer an object to the left of the dot when calling greetFn()
// The function "forgot" it was attached to person
```

### Rule 3: Explicit Binding (`call`, `apply`, `bind`)

You can **force** `this` to be a specific value using these three methods:

```js
function introduce(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };

// call — calls the function IMMEDIATELY with individual arguments
// introduce.call(thisValue, arg1, arg2, ...)
introduce.call(alice, "Hello", "!");   // "Hello, I'm Alice!"
introduce.call(bob, "Hey", ".");       // "Hey, I'm Bob."

// apply — calls IMMEDIATELY but arguments are passed as an ARRAY
// introduce.apply(thisValue, [arg1, arg2, ...])
introduce.apply(alice, ["Hello", "!"]); // "Hello, I'm Alice!"
// Useful when you have arguments already in an array

// bind — does NOT call immediately; returns a NEW function with 'this' permanently set
const aliceIntro = introduce.bind(alice);
// aliceIntro is a new function where 'this' is ALWAYS 'alice'
aliceIntro("Greetings", "..."); // "Greetings, I'm Alice..."
aliceIntro("Hi", "!");          // "Hi, I'm Alice!" — always alice!

// You can also pre-fill arguments with bind (partial application):
const aliceHello = introduce.bind(alice, "Hello"); // Pre-fill first argument
aliceHello("!"); // "Hello, I'm Alice!"
aliceHello("."); // "Hello, I'm Alice."
```

### Fixing the "Losing `this`" Problem with `bind`

```js
class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // ❌ Without bind — 'this' inside the callback is undefined (strict mode)
    // because setInterval calls the function as a plain function call (default binding)
    // setInterval(function() {
    //   this.seconds++; // TypeError: Cannot set properties of undefined
    // }, 1000);

    // ✅ With bind — force 'this' to be this Timer instance
    setInterval(this.tick.bind(this), 1000);
    // OR use an arrow function (which inherits 'this' from start()):
    // setInterval(() => { this.seconds++; }, 1000);
  }

  tick() {
    this.seconds++;
    console.log(`Elapsed: ${this.seconds}s`);
  }
}

const timer = new Timer();
timer.start(); // Correctly counts: 1, 2, 3...
```

### Rule 4: `new` Binding

When a function is called with the `new` keyword, JavaScript:
1. Creates a brand new empty object
2. Sets `this` to that new object
3. Runs the function body (which typically assigns properties to `this`)
4. Returns `this` (the new object) automatically

```js
function Person(name, age) {
  // Step 2: 'this' is the brand new empty object created by 'new'
  // Step 3: We assign properties to it
  this.name = name;
  this.age  = age;
  // Step 4: 'this' is automatically returned
}

const alice = new Person("Alice", 25);
console.log(alice.name); // "Alice" — the property we set on 'this'
console.log(alice.age);  // 25
```

### Common Mistakes & How to Avoid Them — `this`

**Mistake: Using a regular function as a callback inside a method**

```js
const team = {
  name: "Dev Team",
  members: ["Alice", "Bob"],
  introduce() {
    // ❌ Regular function loses 'this' inside the callback:
    this.members.forEach(function(member) {
      // 'this' here is undefined (strict mode) or window (sloppy)
      console.log(`${member} is in ${this.name}`); // TypeError!
    });

    // ✅ Arrow function inherits 'this' from introduce():
    this.members.forEach((member) => {
      console.log(`${member} is in ${this.name}`); // "Alice is in Dev Team" ✅
    });
  }
};
```

### 📌 Section Recap
- `this` is determined by **how a function is called**, not where it's defined
- `obj.method()` → `this` is `obj` (implicit binding)
- `fn.call(obj)` / `fn.apply(obj)` → `this` is `obj` (explicit, immediate)
- `fn.bind(obj)` → returns a new function with `this` permanently fixed
- `new Fn()` → `this` is the newly created object
- Plain `fn()` → `this` is `undefined` (strict) or `window` (non-strict)

---

## 5. Arrow Functions and Lexical `this`

### Arrow Functions Don't Have Their Own `this`

Arrow functions are special: they **do not have their own `this`** at all. Instead, they **inherit `this` from the enclosing lexical scope** — the scope where the arrow function is *written*, not where it's called.

This makes them perfect for callbacks inside methods:

```js
const team = {
  name: "Dev Team",
  members: ["Alice", "Bob", "Carol"],

  // ✅ Regular function as method — gets its own 'this' (the team object)
  introduce() {
    console.log(`Team: ${this.name}`); // "Team: Dev Team" ✅

    // ✅ Arrow function inherits 'this' from introduce() — which is the team object
    this.members.forEach((member) => {
      // 'this' here is the SAME 'this' as in introduce() — the team!
      // Arrow functions look to their enclosing scope (introduce) for 'this'
      console.log(`${member} is in ${this.name}`);
    });
  }
};

team.introduce();
// "Team: Dev Team"
// "Alice is in Dev Team"
// "Bob is in Dev Team"
// "Carol is in Dev Team"
```

### When NOT to Use Arrow Functions

Because arrow functions don't have their own `this`, never use them as **object methods** or **constructors**:

```js
const person = {
  name: "Alice",

  // ❌ Arrow function as method — 'this' is NOT the person object!
  // 'this' is inherited from the enclosing scope (module scope = undefined in strict)
  greet: () => {
    console.log(`Hi, I'm ${this.name}`); // 'this' is undefined or window!
  },

  // ✅ Regular method shorthand — 'this' correctly refers to person
  greetCorrectly() {
    console.log(`Hi, I'm ${this.name}`); // "Hi, I'm Alice" ✅
  }
};

person.greet();          // "Hi, I'm undefined" ❌
person.greetCorrectly(); // "Hi, I'm Alice" ✅
```

**Also never use arrow functions as constructors:**

```js
// ❌ Arrow functions cannot be used with 'new'!
const Person = (name) => { this.name = name; };
// const alice = new Person("Alice"); // TypeError: Person is not a constructor
```

### Summary: Arrow vs Regular Functions for `this`

| Use Case | Regular Function | Arrow Function |
|----------|-----------------|----------------|
| Object method | ✅ (gets its own `this`) | ❌ (`this` is wrong) |
| Constructor (with `new`) | ✅ | ❌ (will throw) |
| Callback inside a method | ❌ (loses `this`) | ✅ (inherits `this`) |
| Standalone callback (`map`, `filter`) | Works | ✅ (preferred, more concise) |
| Event handler on an element | ✅ (`this` = the element) | ❌ (`this` = outer scope) |

### 📌 Section Recap
- Arrow functions have NO `this` of their own — they inherit from enclosing scope
- Use arrow functions for callbacks inside methods (they capture the method's `this`)
- Never use arrow functions as object methods or constructors
- For event handlers where you need `this` = the element, use regular functions

---

## 6. ES Modules — `import` / `export`

### Why Modules? (Plain English)

Imagine a large restaurant kitchen. If everyone works in one big room with all ingredients everywhere, it becomes chaotic. Instead, you have separate stations: the pastry station, the grill station, the prep station. Each station has its own tools and is responsible for specific outputs.

**Modules** do the same for code: they split your application into separate files, each responsible for a specific piece of functionality. This makes code easier to understand, maintain, test, and reuse.

### Why Does This Matter?

Without modules:
- All your code is in one giant file (hard to navigate, edit, and test)
- Every variable is global (name collisions, unpredictable bugs)
- Multiple developers can't work independently on different parts

### Named Exports

You can export multiple named things from a module:

```js
// math.js — A module that exports math utilities

// Method 1: Export at declaration time
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const subtract = (a, b) => a - b;

// Method 2: Export at the bottom (sometimes cleaner)
// const PI = 3.14159;
// const add = ...;
// export { PI, add, multiply };
```

```js
// app.js — Importing named exports

// Import specific named exports using curly braces:
import { PI, add, multiply } from './math.js';

console.log(PI);              // 3.14159
console.log(add(2, 3));       // 5
console.log(multiply(4, 5));  // 20

// Import with an alias (rename during import):
import { subtract as minus } from './math.js';
console.log(minus(10, 3)); // 7

// Import ALL named exports as a namespace object:
import * as MathUtils from './math.js';
console.log(MathUtils.PI);           // 3.14159
console.log(MathUtils.add(1, 2));    // 3
console.log(MathUtils.multiply(3,4)); // 12
```

### Default Exports

Each module can have **one** default export — the "main thing" that module provides:

```js
// userService.js

const BASE_URL = 'https://api.example.com/users'; // Private — not exported

async function fetchUser(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return response.json();
}

async function createUser(data) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

// Default export — the "main" export of this module (no curly braces in import)
export default { fetchUser, createUser };
```

```js
// app.js
// Import default — no curly braces, YOU choose the name:
import userService from './userService.js'; // Could name it anything

const user = await userService.fetchUser(1);
```

### Combining Default and Named Exports

```js
// utils.js
export const VERSION = "1.0.0"; // Named export

export function formatDate(date) { // Named export
  return date.toLocaleDateString();
}

export default class Logger { // Default export
  log(msg) { console.log(`[LOG] ${msg}`); }
}
```

```js
// app.js
import Logger, { VERSION, formatDate } from './utils.js';
// Logger = default, VERSION and formatDate = named
```

### Using Modules in HTML

```html
<!-- index.html -->
<!-- 'type="module"' enables import/export AND defers script execution -->
<!-- Modules automatically run in strict mode -->
<!-- Modules have their own scope — no global variable pollution -->
<script type="module" src="app.js"></script>
```

> [!NOTE]
> ES modules always run in **strict mode** automatically. They also have their own scope — variables declared in one module are not accessible in another unless explicitly exported.

> [!WARNING]
> ES modules require a server to work properly (CORS policy). You can't open an HTML file directly with `file://` and use modules. Use a local dev server like `npx serve .` or VS Code's Live Server extension.

### Modern `import.meta`

Inside a module, `import.meta` provides **metadata** about the current module itself:

```js
// The full URL of this module file:
console.log(import.meta.url);
// "http://localhost:5173/src/app.js" (in Vite dev server)

// In Vite projects, access environment variables:
console.log(import.meta.env.MODE);          // "development" or "production"
console.log(import.meta.env.VITE_API_URL);  // From your .env file
```

### Organizing a Real Module Structure

```
project/
├── index.html
└── src/
    ├── app.js          ← Entry point — imports everything, starts the app
    ├── models/
    │   ├── Task.js     ← Task class/functions + types
    │   └── User.js     ← User class/functions
    ├── services/
    │   └── api.js      ← All fetch functions — one place for network calls
    └── utils/
        └── helpers.js  ← Small utility functions (formatDate, etc.)
```

```js
// src/models/Task.js — Single responsibility: Task-related logic only
export function createTask(title) {
  return { id: Date.now(), title, completed: false, createdAt: new Date() };
}

export function toggleTask(task) {
  return { ...task, completed: !task.completed }; // Immutable update
}

export function filterByStatus(tasks, completed) {
  return tasks.filter(t => t.completed === completed);
}

// src/app.js — Imports from all modules
import { createTask, toggleTask, filterByStatus } from './models/Task.js';
import { fetchTasks, saveTask } from './services/api.js';
import { formatDate } from './utils/helpers.js';
```

### Common Mistakes & How to Avoid Them — Modules

**Mistake 1: Forgetting to export before importing**

```js
// ❌ math.js — forgot export!
const add = (a, b) => a + b;

// ❌ app.js — SyntaxError: The requested module doesn't provide an export 'add'
import { add } from './math.js';

// ✅ math.js — export it!
export const add = (a, b) => a + b;
```

**Mistake 2: Missing `type="module"` in HTML**

```html
<!-- ❌ import/export won't work — SyntaxError! -->
<script src="app.js"></script>

<!-- ✅ Always include type="module" -->
<script type="module" src="app.js"></script>
```

**Mistake 3: Forgetting `.js` extension in imports**

```js
// ❌ In the browser, the extension is required!
import { add } from './math'; // Fails in browser

// ✅ Always include .js for browser modules
import { add } from './math.js';
// (Bundlers like Vite resolve without extension, but it's good practice)
```

**Mistake 4: Confusing default and named imports**

```js
// Named export in math.js:
export const add = (a, b) => a + b;

// ❌ Wrong — curly braces are for NAMED exports, not default
import add from './math.js'; // imports the default export (undefined here!)

// ✅ Correct — use curly braces for named exports
import { add } from './math.js';
```

### 📌 Section Recap
- Modules split code into focused files — each file is a separate module
- **Named exports** use `export` keyword; imported with `{ curly braces }`
- **Default exports** use `export default`; imported without curly braces
- Use `type="module"` on `<script>` tags in HTML
- Always include `.js` extension in browser module imports
- `import.meta.url` gives the current module's URL; `import.meta.env` gives environment variables

---

## ⚠️ Common Mistakes & How to Avoid Them (Summary)

### Mistake 1: Thinking Closures "Copy" Variables

```js
// ❌ Classic bug — all functions log 3!
const functions = [];
for (var i = 0; i < 3; i++) {
  functions.push(() => console.log(i)); // All capture same 'i'
}
functions[0](); // 3
functions[1](); // 3

// ✅ Fix: Use 'let' (new binding per iteration)
for (let i = 0; i < 3; i++) {
  functions.push(() => console.log(i)); // Each has its own 'i'
}
functions[0](); // 0 ✅
```

### Mistake 2: Using Arrow Functions as Object Methods

```js
// ❌ Arrow function as method — 'this' is not the object
const counter = {
  count: 0,
  increment: () => { this.count++; } // 'this' is undefined/window!
};

// ✅ Correct: Use regular method shorthand
const counter = {
  count: 0,
  increment() { this.count++; } // 'this' is counter ✅
};
```

### Mistake 3: Sequential Code After `await` That Could Be Parallel

```js
// ❌ These are independent — no need to wait for each before starting the next
const user    = await fetchUser(id);    // Starts then waits
const posts   = await fetchPosts(id);  // Only starts after user is done
const friends = await fetchFriends(id); // Only starts after posts are done
// Total: 3 seconds (assuming 1s each)

// ✅ Run them in parallel!
const [user, posts, friends] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchFriends(id),
]);
// Total: ~1 second — all three run simultaneously
```

---

## 🧪 Practice Labs

### Lab 1: Counter Closures (30 min)

**Goal:** Practice creating private state with closures.

```js
// Create a createCounter(start, step) factory function where:
// - start: initial value (default 0)
// - step: how much to increment/decrement (default 1)
// Returns an object with: increment(), decrement(), reset(), getValue()
// The internal count variable should be inaccessible from outside.

const counter = createCounter(10, 5);
counter.increment(); // 15
counter.increment(); // 20
counter.decrement(); // 15
counter.reset();     // 10
console.log(counter.getValue()); // 10
```

### Lab 2: Refactoring to ES Modules (45 min)

**Goal:** Take a single-file app and split it into modules.

1. Given a `app.js` that has all task logic, DOM rendering, and API calls mixed together
2. Create `src/models/task.js` — move task CRUD functions
3. Create `src/services/api.js` — move fetch functions
4. Create `src/ui/render.js` — move DOM rendering functions
5. Update `app.js` to import from each module
6. Verify everything still works

---

## 📌 Final Lecture Recap

- **Scope** is where variables are accessible; JavaScript uses **lexical scope** (based on where code is written)
- **Closures** let inner functions access outer variables even after the outer function finishes — enabling private state
- **`#private` fields** are the class-based equivalent of closure privacy (ES2022)
- **`this`** is determined by HOW a function is called, not where it's defined
- The four binding rules: default → implicit → explicit (call/apply/bind) → `new`
- **Arrow functions** inherit `this` from their enclosing scope — great for callbacks, bad for methods
- **ES Modules** split code into focused files using `export` and `import`
- `type="module"` is required on `<script>` tags for modules to work in the browser

---

**Next Lecture:** [Lecture 13 — Asynchronous JavaScript: Callbacks, Promises & async/await](./13%20-%20Asynchronous%20JavaScript%20%E2%80%94%20Callbacks,%20Promises%20%26%20async-await.md)