# Lecture 13 — Asynchronous JavaScript: Callbacks, Promises & async/await

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

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

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Synchronous vs asynchronous execution
2. The event loop, call stack, and task queue
3. Callbacks & callback hell
4. Promises: states, `.then()`, `.catch()`, `.finally()`
5. Promise combinators & ES2024 `Promise.withResolvers()`
6. `async`/`await` syntax & error handling
7. Fetch API, JSON, & Cancelling Fetches (`AbortController`)

### Part 2 — Practice & Lab (~90–120 min)
1. Fetch user data and render profiles
2. Build a sequential animation chain using Promises
3. TaskFlow Project Part 5: API Integration

---

## 1. Synchronous vs Asynchronous

### Synchronous (One Thing at a Time)
Executes line-by-line. If one line takes 5 seconds, the whole page freezes for 5 seconds.

### Asynchronous (Start Now, Finish Later)
Starts a task, and moves on to the next line immediately. When the task finishes, a callback is executed.
This prevents the browser UI from freezing.

---

## 2. The Event Loop

The Event Loop handles asynchronous code in JavaScript.

- **Call Stack:** Executes functions one at a time.
- **Web APIs:** Browser features (HTTP requests, Timers) that run in the background.
- **Task Queue:** Holds callbacks from `setTimeout`.
- **Microtask Queue:** Holds callbacks from Promises. **Higher priority** than Task Queue.

---

## 3. Callbacks

A function passed to another function to be called when the async operation completes.

**The Problem: Callback Hell**
```js
getUser((user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // Pyramid of Doom 🔺
    });
  });
});
```

---

## 4. Promises

An object representing the eventual completion (or failure) of an asynchronous operation.

### Creating a Promise
```js
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Data loaded!");
  }, 1000);
});
```

### Consuming a Promise
```js
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

## 5. Modern Promises

### Promise Combinators
- `Promise.all([p1, p2])`: Runs in parallel. Rejects if ANY fail.
- `Promise.allSettled([p1, p2])`: Runs in parallel. Never rejects, returns status of all.

### ES2024 `Promise.withResolvers()`
Historically, extracting the `resolve` and `reject` functions out of the Promise constructor was messy. In modern JavaScript, use `withResolvers()`:

```js
const { promise, resolve, reject } = Promise.withResolvers();

// You can now pass `resolve` and `reject` anywhere!
document.querySelector('#btn').addEventListener('click', () => {
    resolve("Button was clicked!");
});

promise.then(msg => console.log(msg));
```

---

## 6. `async` / `await`

Syntactic sugar over Promises. Makes async code look synchronous.

```js
async function getData() {
  try {
    const response = await fetch("/api/data"); // Pauses here
    const data = await response.json();        // Pauses here
    console.log(data);
  } catch (err) {
    console.error("Failed:", err);
  }
}
```

**Parallel vs Sequential:**
```js
// ❌ Slow (Sequential)
const users = await fetchUsers();
const posts = await fetchPosts();

// ✅ Fast (Parallel)
const [users, posts] = await Promise.all([ fetchUsers(), fetchPosts() ]);
```

---

## 7. Fetch API & Cancelling Requests

The Fetch API makes HTTP requests.

```js
async function getUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) throw new Error("HTTP Error!");
  return await response.json();
}
```

### Cancelling Requests (`AbortController`)
If a user navigates away or types quickly, you might want to cancel a `fetch` that is already in progress.

```js
const controller = new AbortController();

// 1. Pass the signal to fetch
fetch('https://api.example.com/data', { signal: controller.signal })
  .then(res => res.json())
  .catch(err => {
      if (err.name === 'AbortError') console.log('Fetch cancelled');
  });

// 2. Cancel it instantly!
controller.abort();
```

---

## 🧪 Practice Labs

### Lab 1: Fetch Profiles (45 min)
1. Open `labs/lab1-fetch-profiles/app.js`.
2. Write an `async` function that fetches `https://jsonplaceholder.typicode.com/users`.
3. Use `Promise.all` to fetch `https://jsonplaceholder.typicode.com/posts` in parallel.
4. Render the data to the DOM.

### Lab 2: Abortable Search (45 min)
1. Open `labs/lab2-abort-search/app.js`.
2. Listen to an input field. On every keystroke, fetch a dummy API.
3. If the user types a new character before the old fetch finishes, use `AbortController` to cancel the old fetch.

---

## 📝 Assignment: TaskFlow Project — Part 5

Let's integrate an API into TaskFlow!

### Requirements
1. Open your TaskFlow folder.
2. In `taskModel.js`, create a new function called `syncTasksWithServer()`.
3. Inside, use `fetch` to POST your tasks array to a dummy API (e.g., `https://jsonplaceholder.typicode.com/posts` — it will pretend to save it).
4. Call `syncTasksWithServer()` every time the user adds, deletes, or toggles a task.
5. Provide visual feedback in the UI (e.g. "Saving..." -> "Saved!").
6. Handle errors gracefully using `try/catch`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN — Promise.withResolvers | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers |
| MDN — AbortController | https://developer.mozilla.org/en-US/docs/Web/API/AbortController |

---

## 📌 Key Takeaways
- **Promises** flatten async chains.
- **ES2024 `Promise.withResolvers()`** makes creating promises easier.
- **`async`/`await`** makes async code read like synchronous code.
- Always use `try`/`catch` with `await`.
- Use **`AbortController`** to cancel fetch requests to save bandwidth and prevent bugs.

---

**Next Lecture:** [Lecture 14 — ES6+ Modern Features & JavaScript Tooling](./14%20-%20ES6+%20Modern%20Features%20%26%20JavaScript%20Tooling.md)