# Lecture 14 — Asynchronous JavaScript: Callbacks, Promises & async/await

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 1. Prerequisites (What to know before starting)

Before starting this lecture, you should be familiar with:
- **JavaScript Basics:** Variables, data types, and operators.
- **Functions:** Function declarations, arrow functions, and returning values.
- **DOM Manipulation:** Selecting elements, adding event listeners, and updating the DOM.
- **Basic HTTP Concepts:** Understanding what an HTTP request/response is (helpful but not strictly required).

---

## 2. Objectives & Agenda

### 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain the difference between synchronous and asynchronous code
- Understand how the event loop, call stack, and task queue work together
- Use callbacks and recognise the "callback hell" problem
- Create and consume Promises with `.then()`, `.catch()`, and `.finally()`
- Chain Promises and use combinators (`Promise.all`, `Promise.allSettled`, `Promise.race`)
- Create decoupled Promises using modern ES2024 `Promise.withResolvers()`
- Write clean async code with `async`/`await` and `try`/`catch`
- Fetch data from APIs using the Fetch API and work with JSON
- Cancel ongoing API requests using `AbortController`

---

### 📋 Agenda

### Part 1 — Theory (~90 min)
1. Synchronous vs asynchronous execution
2. The event loop, call stack, and task queue
3. Callbacks & callback hell
4. Promises: states, `.then()`, `.catch()`, `.finally()`
5. Promise combinators & ES2024 `Promise.withResolvers()`
6. `async`/`await` syntax & error handling
7. Fetch API, JSON, & Cancelling Fetches (`AbortController`)

### Part 2 — Practice & Lab (~90–120 min)
1. Build a Pokedex using PokeAPI
2. Build a User Directory using JSONPlaceholder

---

## 3. Deep Dive: Asynchronous JavaScript

### 1. Synchronous vs Asynchronous

### The Problem: JavaScript Is Single-Threaded

JavaScript can only do **one thing at a time**. It has a single thread of execution — think of it like a single checkout lane at a grocery store.

Now imagine one customer at the front needs a price check that will take 5 minutes. In a **synchronous** world, everyone behind them has to wait. The entire store freezes.

This is exactly what happens when synchronous JavaScript does a slow operation — it **blocks** everything else, including:
- Rendering the page
- Responding to user clicks
- Playing animations

```js
// ❌ SYNCHRONOUS — BLOCKS everything for 5 seconds!
function slowOperation() {
  const start = Date.now();
  while (Date.now() - start < 5000) {} // Busy loop for 5 seconds
  return "Done!";
}

console.log("Before");
slowOperation(); // Page is completely frozen for 5 seconds!
console.log("After");
```

### The Solution: Asynchronous Code

Asynchronous code **starts** a task and immediately moves on. The task runs in the background (via browser APIs), and when it's finished, a callback is placed in a queue to be run.

```
Synchronous (Bad):               Asynchronous (Good):
──────────────────               ──────────────────────
Start Task A                     Start Task A
⏳ Wait for A...                 → Moved to background!
⏳ Still waiting...              Start Task B immediately
⏳ Still waiting...              Start Task C immediately
Task A done                      Task A done → callback runs
Start Task B                     
Start Task C                     
```

```js
// ✅ ASYNCHRONOUS — moves on immediately, no blocking
console.log("Before");

setTimeout(() => {
  console.log("Delayed message!"); // Runs AFTER 2 seconds, non-blocking
}, 2000);

console.log("After"); // This runs IMMEDIATELY — doesn't wait!

// Output:
// Before
// After
// (2 seconds later...) Delayed message!
```

---

### 2. The Event Loop

### How JavaScript Handles Async Code

This is the most fundamental concept for understanding how JavaScript works under the hood. There are four key components:

```
┌───────────────────────────────────────────────────────────────┐
│                    JAVASCRIPT ENGINE                           │
│                                                               │
│  ┌─────────────┐       ┌──────────────────────────────────┐   │
│  │ CALL STACK  │       │          WEB APIs                │   │
│  │             │       │  (setTimeout, fetch, DOM events) │   │
│  │  main()     │ ─────→│                                  │   │
│  │  greet()    │       │  These run in the BACKGROUND     │   │
│  │             │       │  outside the JS engine           │   │
│  └──────┬──────┘       └──────────────┬───────────────────┘   │
│         │                             │                        │
│  ┌──────▼──────────────────────────────▼─────────────────────┐│
│  │                     EVENT LOOP                             ││
│  │  (Moves callbacks from queues to the call stack           ││
│  │   only when the call stack is EMPTY)                      ││
│  └──────────────────┬──────────────────────────────────┬─────┘│
│                     │                                  │       │
│          ┌──────────▼────────┐         ┌──────────────▼─────┐ │
│          │  MICROTASK QUEUE  │         │   MACROTASK QUEUE  │ │
│          │  (Promise .then)  │         │   (setTimeout,     │ │
│          │  Higher priority! │         │    setInterval)    │ │
│          └───────────────────┘         └────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### Step-by-Step Execution

```js
console.log("1 - Start");              // Runs immediately (call stack)

setTimeout(() => {
  console.log("4 - setTimeout");       // Runs AFTER everything else
}, 0);                                 // Even 0ms delay goes to Macrotask Queue!

Promise.resolve().then(() => {
  console.log("3 - Promise .then");    // Runs BEFORE setTimeout (Microtask Queue)
});

console.log("2 - End");                // Runs immediately (call stack)

// Output order: 1 → 2 → 3 → 4
// Why? Microtasks (Promise .then) have higher priority than Macrotasks (setTimeout)
```

**Why does this matter?** Understanding the event loop helps you:
- Predict the order your code runs in
- Debug async timing bugs
- Avoid "blocking" the event loop with synchronous heavy computation

### The Priority Queue Order

When the call stack is empty, the event loop checks queues in this order:
1. **Microtask Queue** — Promise callbacks (`.then`, `.catch`), `queueMicrotask()`
2. **Macrotask Queue** — `setTimeout`, `setInterval`, `fetch` callbacks

> [!NOTE]
> Promise callbacks always run **before** `setTimeout` callbacks, regardless of timing. This is why Promises are more predictable than `setTimeout` for async coordination.

---

### 3. Callbacks

### What Is a Callback?

A **callback** is a function you pass to another function to be called when an async operation completes. It's the oldest pattern for handling async operations in JavaScript.

```js
// The classic Node.js pattern: callback(error, data)
function readFile(path, callback) {
  // Simulate reading a file asynchronously
  setTimeout(() => {
    if (path === "missing.txt") {
      callback(new Error("File not found"), null); // Error first!
    } else {
      callback(null, "File contents here"); // null error = success
    }
  }, 1000);
}

readFile("data.txt", (error, data) => {
  if (error) {
    console.error("Oops:", error.message);
    return;
  }
  console.log("Got data:", data);
});
```

### The Problem: Callback Hell

When you need to do multiple async operations in sequence, callbacks nest deeply, creating the infamous "Pyramid of Doom":

```js
// ❌ CALLBACK HELL — Hard to read, hard to maintain, hard to error-handle
getUser(userId, (userError, user) => {
  if (userError) { handleError(userError); return; }

  getPostsByUser(user.id, (postsError, posts) => {
    if (postsError) { handleError(postsError); return; }

    getCommentsForPost(posts[0].id, (commentsError, comments) => {
      if (commentsError) { handleError(commentsError); return; }

      getLikesForComment(comments[0].id, (likesError, likes) => {
        if (likesError) { handleError(likesError); return; }

        // Finally got our data... after 4 levels of nesting!
        console.log(likes);
      });
    });
  });
});
```

Problems with callback hell:
- **Hard to read** — Code grows horizontally, not vertically
- **Error handling** — Must check errors manually at each step
- **Hard to debug** — Stack traces are confusing
- **Hard to test** — Functions are deeply coupled

Promises were invented specifically to solve this problem.

---

### 4. Promises

### What Is a Promise?

A **Promise** is an object that represents the eventual completion (or failure) of an asynchronous operation. It's like a receipt you get when you order food: it's not the food yet, but it's a guarantee that the food will arrive (or a notification that it couldn't be made).

A Promise is in exactly one of three states:

```
PROMISE LIFECYCLE:
──────────────────────────────────────────────
           ┌──────────────┐
           │   PENDING    │  ← Initial state (operation in progress)
           └──────┬───────┘
                  │
         ┌────────┴─────────┐
         ▼                  ▼
  ┌─────────────┐    ┌─────────────┐
  │  FULFILLED  │    │  REJECTED   │
  │  (success)  │    │   (error)   │
  └──────┬──────┘    └──────┬──────┘
         │                  │
         ▼                  ▼
      .then()            .catch()
         │                  │
         └────────┬─────────┘
                  ▼
              .finally()    ← Runs regardless of outcome
```

### Creating a Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // The executor function runs IMMEDIATELY
  // It receives two functions: resolve() and reject()

  const success = true; // Simulate some async work result

  setTimeout(() => {
    if (success) {
      resolve("Operation succeeded! Here's your data."); // Fulfill the promise
    } else {
      reject(new Error("Operation failed!")); // Reject with an Error object
    }
  }, 1000);
});
```

### Consuming a Promise

```js
// .then() handles success, .catch() handles errors, .finally() always runs
myPromise
  .then((result) => {
    // Called when the promise is FULFILLED
    console.log("Success:", result); // "Success: Operation succeeded!"
    return result.toUpperCase(); // You can return a value to chain!
  })
  .then((uppercased) => {
    // Chained .then() receives the return value of the previous .then()
    console.log("Chained:", uppercased);
  })
  .catch((error) => {
    // Called when the promise is REJECTED (or if .then() throws)
    console.error("Error:", error.message);
  })
  .finally(() => {
    // ALWAYS called, regardless of success or failure
    // Great for cleanup: hiding loading spinners, closing connections
    console.log("Done! Hiding spinner...");
  });
```

### Promisifying Callbacks (Converting Old Patterns to Promises)

```js
// Convert a callback-based function to return a Promise
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    readFile(path, (error, data) => {
      if (error) {
        reject(error); // Pass the error to .catch()
      } else {
        resolve(data); // Pass the data to .then()
      }
    });
  });
}

// Now it's a clean promise chain!
readFilePromise("data.txt")
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### 📌 Section Recap
- A Promise represents an eventual value (pending → fulfilled/rejected).
- `.then()` handles success, `.catch()` handles errors, `.finally()` always runs.
- Promises can be chained — return a value from `.then()` to pass it to the next.

---

### 5. Modern Promises — Combinators & `withResolvers`

### Promise Combinators

When you have multiple async operations, you often want to run them **in parallel** (at the same time) rather than sequentially. Promise combinators handle this:

```js
const fetchUser  = fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json());
const fetchPosts = fetch('https://jsonplaceholder.typicode.com/posts?userId=1').then(r => r.json());
const fetchTodos = fetch('https://jsonplaceholder.typicode.com/todos?userId=1').then(r => r.json());
```

#### `Promise.all()` — Wait for ALL, fail if ANY fails

```js
// Runs all 3 fetches in parallel, waits for ALL to complete
try {
  const [user, posts, todos] = await Promise.all([fetchUser, fetchPosts, fetchTodos]);
  // All three completed successfully
  console.log(user.name, posts.length, todos.length);
} catch (error) {
  // If ANY of the three fails, this catch runs immediately!
  console.error("At least one failed:", error);
}
```

#### `Promise.allSettled()` — Wait for ALL, never rejects

```js
// Like Promise.all but NEVER rejects — always waits for everything
const results = await Promise.allSettled([fetchUser, fetchPosts, fetchTodos]);

results.forEach((result) => {
  if (result.status === 'fulfilled') {
    console.log("✅ Success:", result.value);
  } else {
    console.log("❌ Failed:", result.reason.message);
  }
});
// Use this when you want to handle partial failures gracefully
```

#### `Promise.race()` — First one wins

```js
// Resolves or rejects as soon as the FIRST promise settles
const result = await Promise.race([fetchUser, fetchPosts]);
console.log("Fastest was:", result);

// Use case: timeouts!
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out!")), ms)
  );
  return Promise.race([promise, timeout]);
}

const data = await withTimeout(fetchUser, 5000); // Timeout after 5 seconds
```

#### `Promise.any()` — First SUCCESS wins

```js
// Like race() but only resolves on success, ignores rejections
// Only rejects if ALL promises reject
const data = await Promise.any([
  fetch('https://server1.example.com/data'),
  fetch('https://server2.example.com/data'), // Fallback server
  fetch('https://server3.example.com/data'), // Another fallback
]);
// Whichever server responds first (and successfully) wins!
```

### ES2024: `Promise.withResolvers()`

**The problem:** Sometimes you need to resolve or reject a promise from *outside* its executor. The old way was verbose:

```js
// ❌ Old way — boilerplate and ugly variable hoisting
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});
// Now resolve and reject are available outside the constructor
```

**The modern solution:** `Promise.withResolvers()` was introduced in ES2024 to make this clean and elegant:

```js
// ✅ Modern way — clean and readable
const { promise, resolve, reject } = Promise.withResolvers();

// The resolve and reject functions are immediately available!
// You can pass them anywhere — to event listeners, callbacks, etc.

// Example: A promise that resolves when the user clicks a button
document.querySelector('#confirm-btn').addEventListener('click', () => {
  resolve("User confirmed!");
});

document.querySelector('#cancel-btn').addEventListener('click', () => {
  reject(new Error("User cancelled."));
});

// Consume the promise from anywhere:
promise
  .then((msg) => console.log("Confirmed:", msg))
  .catch((err) => console.log("Cancelled:", err.message));
```

---

### 6. `async` / `await`

### What Is `async`/`await`? (Plain English)

`async`/`await` is **syntactic sugar** over Promises. It doesn't add new functionality — it just makes async code look and read like synchronous code, which is much easier to reason about.

Think of it like this: Promises are the machinery under the hood, and `async`/`await` is the steering wheel — a friendlier way to control the same machinery.

### The `async` Keyword

An `async` function **always returns a Promise**, automatically. You don't have to do anything special:

```js
// This function returns a Promise<string>, not a string
async function getMessage() {
  return "Hello!"; // Automatically wrapped in Promise.resolve("Hello!")
}

getMessage().then(msg => console.log(msg)); // "Hello!"
```

### The `await` Keyword

`await` **pauses** the execution of an `async` function until a Promise settles, then resumes with the resolved value. It can only be used inside an `async` function.

```js
// ❌ Promise chain — works but harder to read for complex flows
function getUserData(id) {
  return fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(user => fetch(`/api/posts/${user.id}`))
    .then(res => res.json());
}

// ✅ async/await — reads like synchronous code
async function getUserData(id) {
  const userResponse = await fetch(`/api/users/${id}`); // Pause here
  const user = await userResponse.json();               // Pause here

  const postsResponse = await fetch(`/api/posts/${user.id}`); // Pause here
  const posts = await postsResponse.json();                   // Pause here

  return posts;
}
```

### Error Handling with `try`/`catch`

In `async`/`await`, use `try`/`catch` blocks for error handling — it's equivalent to `.catch()`:

```js
async function loadUserProfile(userId) {
  // Show loading indicator
  document.querySelector('#loading').classList.remove('hidden');

  try {
    // Step 1: Fetch user data
    const userRes = await fetch(`https://api.example.com/users/${userId}`);

    // Step 2: Always check HTTP status — fetch doesn't throw on 404!
    if (!userRes.ok) {
      throw new Error(`HTTP Error! Status: ${userRes.status}`);
    }

    // Step 3: Parse JSON
    const user = await userRes.json();

    // Step 4: Fetch their posts in parallel
    const [postsRes, friendsRes] = await Promise.all([
      fetch(`https://api.example.com/posts?userId=${userId}`),
      fetch(`https://api.example.com/friends?userId=${userId}`),
    ]);

    const posts   = await postsRes.json();
    const friends = await friendsRes.json();

    return { user, posts, friends };

  } catch (error) {
    // Catch any error: network error, JSON parse error, or our thrown error
    console.error("Failed to load profile:", error.message);
    // Show error UI to user
    document.querySelector('#error-msg').textContent = error.message;
    return null;

  } finally {
    // Always hide the loading indicator, whether success or failure
    document.querySelector('#loading').classList.add('hidden');
  }
}
```

### Sequential vs Parallel — A Critical Distinction

This is one of the most important performance considerations with `async`/`await`:

```js
// ❌ SLOW — Sequential (one after the other)
// Total time: 1000ms + 1000ms = 2000ms
async function loadDataSlow() {
  const users = await fetchUsers();   // Wait 1000ms
  const posts = await fetchPosts();   // THEN wait 1000ms
  return { users, posts };
}

// ✅ FAST — Parallel (both start at the same time)
// Total time: max(1000ms, 1000ms) = 1000ms
async function loadDataFast() {
  const [users, posts] = await Promise.all([
    fetchUsers(),  // Starts immediately
    fetchPosts(),  // Starts immediately too!
  ]);
  return { users, posts };
}
```

> [!IMPORTANT]
> Use `Promise.all()` when you have **independent** async operations. Only use sequential `await` when the second operation depends on the result of the first.

---

### 7. The Fetch API & Cancelling Requests

### What Is the Fetch API?

The Fetch API is the modern, built-in browser API for making HTTP requests. It's Promise-based and replaces the old `XMLHttpRequest` approach.

```
HTTP Request Anatomy:
─────────────────────────────────────────────────
URL:     https://api.example.com/users/42
Method:  GET, POST, PUT, DELETE, PATCH
Headers: Content-Type, Authorization, Accept
Body:    (only for POST/PUT) JSON data
─────────────────────────────────────────────────
```

### Basic Fetch — GET Request

```js
async function getUser(id) {
  // fetch() returns a Promise that resolves to a Response object
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

  // ⚠️ IMPORTANT: fetch() does NOT throw for HTTP errors (404, 500)!
  // You MUST check response.ok manually!
  if (!response.ok) {
    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
  }

  // Parse the response body as JSON (also async!)
  const user = await response.json();
  return user;
}

// Usage:
try {
  const user = await getUser(1);
  console.log(user.name, user.email);
} catch (error) {
  console.error("Fetch failed:", error.message);
}
```

### POST Request — Sending Data

```js
async function createUser(userData) {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',                          // HTTP method
    headers: {
      'Content-Type': 'application/json',   // Tell server we're sending JSON
      'Authorization': 'Bearer my-api-key', // Auth header (if needed)
    },
    body: JSON.stringify(userData),          // Convert object to JSON string
  });

  if (!response.ok) {
    const errorData = await response.json(); // Try to get error details
    throw new Error(errorData.message || 'Failed to create user');
  }

  return response.json(); // Parse the created user from response
}

// Usage:
const newUser = await createUser({ name: "Alice", email: "alice@example.com" });
console.log("Created:", newUser.id); // The server-assigned ID
```

### Cancelling Fetch Requests with `AbortController`

**The problem:** In a live search bar, the user types fast. Each keystroke triggers a fetch. If the user types "cat" quickly, you don't want the response from "ca" to overwrite the response from "cat".

**The solution:** Cancel the previous request using `AbortController`:

```js
let currentController = null; // Track the current controller

async function searchProducts(query) {
  // Cancel any pending request from before
  if (currentController) {
    currentController.abort();
    console.log("Previous request cancelled");
  }

  // Create a new controller for this request
  currentController = new AbortController();
  const { signal } = currentController;

  try {
    const response = await fetch(
      `https://api.example.com/products?q=${query}`,
      { signal } // Link this fetch to the controller
    );

    const products = await response.json();
    renderResults(products);

  } catch (error) {
    // AbortError is expected — don't show it as a user-facing error!
    if (error.name === 'AbortError') {
      console.log('Search request was cancelled (expected)');
      return; // Just ignore it
    }
    // Real errors should be handled:
    console.error("Search failed:", error.message);
  }
}

// Hook up to search input:
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', (e) => {
  searchProducts(e.target.value);
});
```

### A Complete, Reusable Fetch Helper

Here's a production-ready fetch wrapper you can use across your project:

```js
// api.js — A reusable fetch wrapper

const BASE_URL = 'https://api.example.com';

async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP ${response.status}`);
  }

  // Handle 204 No Content responses (no body to parse)
  if (response.status === 204) return null;

  return response.json();
}

// Usage throughout your app:
export const api = {
  getUsers:   () => apiFetch('/users'),
  getUser:    (id) => apiFetch(`/users/${id}`),
  createUser: (data) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
};
```

---

---

## 4. Think Like a Developer: Building Reliable Async Systems

When writing asynchronous code, professionals focus on **predictability and resilience**.

1. **Assume the Network Will Fail:** Never assume an API request will succeed. Always handle timeouts, offline states, and 500 server errors gracefully. Provide fallback UI or retry mechanisms.
2. **Beware of Race Conditions:** When multiple async operations update the same UI state, the last one to finish wins (not necessarily the last one started). This is why cancelling outdated requests is crucial.
3. **Keep the Event Loop Clear:** Heavy synchronous computations (like processing massive arrays) will block the Event Loop, causing the UI to freeze. Offload heavy work to Web Workers or break it into smaller chunks using `setTimeout`.
4. **Don't Over-Sequentialize:** If two API calls don't depend on each other, fetch them at the same time using `Promise.all()`. Making them sequential needlessly slows down your app.

---

## 5. Before vs After: Callbacks to Async/Await

How the evolution of asynchronous JavaScript has drastically improved code readability.

### Before: Callback Hell (2010s)
```js
function getDashboardData(userId, callback) {
  getUser(userId, (userErr, user) => {
    if (userErr) return callback(userErr);
    getPosts(user.id, (postsErr, posts) => {
      if (postsErr) return callback(postsErr);
      getComments(posts[0].id, (commentsErr, comments) => {
        if (commentsErr) return callback(commentsErr);
        callback(null, { user, posts, comments });
      });
    });
  });
}
```

### Transition: Promise Chains (ES6 - 2015)
```js
function getDashboardData(userId) {
  let userData, postsData;
  return getUser(userId)
    .then(user => {
      userData = user;
      return getPosts(user.id);
    })
    .then(posts => {
      postsData = posts;
      return getComments(posts[0].id);
    })
    .then(comments => {
      return { user: userData, posts: postsData, comments };
    })
    .catch(err => console.error(err));
}
```

### After: async/await (ES8 - 2017)
```js
async function getDashboardData(userId) {
  try {
    const user = await getUser(userId);
    // Fetching posts and comments sequentially (if comments depend on posts)
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    return { user, posts, comments };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
```

---

## 6. Common Mistakes & How to Avoid Them

### Mistake 1: Forgetting to Check `response.ok`

```js
// ❌ This will NOT throw even if the server returns a 404 or 500!
const data = await fetch('/api/missing').then(r => r.json());
// 'data' will be the error object from the server, not your data!

// ✅ Always check response.ok:
const response = await fetch('/api/missing');
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const data = await response.json();
```

### Mistake 2: Sequential `await` When You Could Use `Promise.all`

```js
// ❌ Slow! Takes 3000ms (three 1000ms fetches in series)
const users   = await fetchUsers();   // 1000ms
const posts   = await fetchPosts();   // 1000ms
const friends = await fetchFriends(); // 1000ms

// ✅ Fast! Takes ~1000ms (all run in parallel)
const [users, posts, friends] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchFriends(),
]);
```

### Mistake 3: Not Handling the `AbortError`

```js
// ❌ This will log an ugly error for normal cancellations:
try {
  const data = await fetch(url, { signal });
} catch (err) {
  console.error("Failed:", err); // Also fires for AbortError!
}

// ✅ Always check for AbortError and handle it separately:
} catch (err) {
  if (err.name === 'AbortError') return; // Ignore expected cancellations
  console.error("Real error:", err);
}
```

### Mistake 4: Using `async`/`await` at the Top Level Without a Wrapper

```js
// ❌ This only works in ES modules (with type="module" or Node.js modules)
const data = await fetch('/api/data'); // SyntaxError in non-module scripts!

// ✅ Option 1: Wrap in an async IIFE:
(async () => {
  const data = await fetch('/api/data');
  console.log(data);
})();

// ✅ Option 2: Use a module script (type="module") — top-level await works!
// <script type="module"> allows top-level await
```

### Mistake 5: Swallowing Errors Silently

```js
// ❌ Silently ignoring errors makes debugging a nightmare:
async function loadData() {
  try {
    return await fetch('/api/data');
  } catch (e) {
    // Empty catch block — error disappears silently!
  }
}

// ✅ Always at least log or re-throw:
async function loadData() {
  try {
    return await fetch('/api/data');
  } catch (e) {
    console.error("loadData failed:", e);
    throw e; // Re-throw so the caller knows it failed
  }
}
```

---

## 7. Labs & Assignments: Pokedex & API Integration

### Lab: Build a Pokedex with PokeAPI (60 min)

**Goal:** Build a "Pokedex" that fetches and displays real Pokemon data using the open-source PokeAPI. There are no fake delays or mock data—this is a real network integration!

1. **Setup the UI:** Create a simple HTML page with an input field for a Pokemon name or ID, a "Search" button, and a dedicated div to display the result card.
2. **Fetch Data:** Write an sync function etchPokemon(query) that calls https://pokeapi.co/api/v2/pokemon/.
3. **Handle Errors:** If the user enters a non-existent Pokemon, the API returns a 404. Ensure you check 
esponse.ok and display a clear "Pokemon not found!" message instead of a broken UI.
4. **Render the Card:** Extract the name, ID, types (e.g., Fire/Flying), and official artwork URL from the JSON response. Update the DOM dynamically to show the Pokemon card.

### Assignment: User Directory (JSONPlaceholder)

**Goal:** Create a complete User Directory fetching from JSONPlaceholder.

1. **Parallel Fetching:** Write an initialization function that fetches all users (/users) and all posts (/posts) simultaneously using Promise.all().
2. **Data Merging:** Write logic to match posts to their respective users (using userId).
3. **Render Directory:** Display a grid of user profile cards. Each card must show the user's name, email, company name, and the total count of posts they have authored.
4. **Live Search (Bonus):** Implement an abortable live search using AbortController that filters the rendered user cards based on the typed name.

---

## 8. Interview Prep

Expect these questions in any mid-level frontend or full-stack interview:

1. **What is the Event Loop?**
   *Answer:* The Event Loop is the mechanism that allows JavaScript to perform non-blocking operations. It continuously checks if the Call Stack is empty, and if so, it moves callbacks from the Microtask Queue (Promises) and Macrotask Queue (setTimeout) onto the Call Stack to be executed.
2. **What's the difference between Microtasks and Macrotasks?**
   *Answer:* Microtasks (like Promise `.then()`) have higher priority and are executed before Macrotasks (like `setTimeout`). The Event Loop clears the entire Microtask queue before picking up the next Macrotask.
3. **How does `Promise.all` handle rejections?**
   *Answer:* `Promise.all` fails fast. If any single promise in the array rejects, the entire `Promise.all` immediately rejects with that error, ignoring the successful resolution of the others. To avoid this, you can use `Promise.allSettled`.
4. **Why do we need `AbortController`?**
   *Answer:* Fetch requests don't provide a native way to cancel them once fired. `AbortController` provides a signal that can be passed to `fetch()` and an `.abort()` method to cancel the network request, preventing race conditions or unnecessary bandwidth usage.

---

## 9. Cheat Sheet: Async & Fetch API

### Promises & Combinators
```js
// Create
const p = new Promise((resolve, reject) => { /* ... */ });

// Consume
p.then(res => {}).catch(err => {}).finally(() => {});

// Combinators
await Promise.all([p1, p2])        // Wait for all, fail if any fail
await Promise.allSettled([p1, p2]) // Wait for all, never fail
await Promise.race([p1, p2])       // Return first to settle (success or fail)
await Promise.any([p1, p2])        // Return first to succeed
```

### `async` / `await`
```js
async function doWork() {
  try {
    const result = await someAsyncCall();
    return result;
  } catch (err) {
    console.error(err);
  }
}
```

### Fetch API
```js
const res = await fetch('url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
if (!res.ok) throw new Error('HTTP Error');
const data = await res.json();
```

---

## 10. Key Takeaways & Resources

### Key Takeaways
- JavaScript is **single-threaded** — async code prevents blocking the UI.
- The **Event Loop** orchestrates the call stack, Web APIs, and task queues.
- **Callbacks** were the first async pattern but lead to "callback hell."
- **Promises** flatten async code with .then(), .catch(), .finally().
- Use **Promise.all()** for parallel operations, **Promise.allSettled()** to handle partial failures.
- **sync/wait** makes async code read like synchronous code — use 	ry/catch for errors.
- **etch()** does NOT throw on HTTP errors — always check 
esponse.ok.
- Use **AbortController** to cancel fetch requests and prevent stale data.

### Resources
| Resource | Link |
|----------|------|
| MDN — Promise.withResolvers | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers |
| MDN — AbortController | https://developer.mozilla.org/en-US/docs/Web/API/AbortController |
| MDN — Fetch API | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API |
| MDN — Event Loop | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop |
| PokeAPI | https://pokeapi.co/ |
| JSONPlaceholder | https://jsonplaceholder.typicode.com |

---

**Next Lecture:** [Lecture 15 — ES6+ Modern Features & JavaScript Tooling](../15%20-%20ES6%2B%20Modern%20Features%20%26%20JavaScript%20Tooling/15%20-%20ES6%2B%20Modern%20Features%20%26%20JavaScript%20Tooling.md)
### 📚 Extensive Tutorials & Resources
- **MDN Web Docs:** [Introducing Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing)
- **Javascript.info:** [Promises, async/await Chapter](https://javascript.info/async)
- **MDN Web Docs:** [How to Use Promises in JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
- **Javascript.info:** [Async/Await Tutorial](https://javascript.info/async-await)
- **MDN Web Docs:** [Using the Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- **FreeCodeCamp:** [How to Fetch Data in JavaScript - A Practical Guide](https://www.freecodecamp.org/news/how-to-fetch-data-in-javascript-using-api-and-fetch-api/)
- **Web.dev:** [Introduction to Async Functions](https://web.dev/async-functions/)
