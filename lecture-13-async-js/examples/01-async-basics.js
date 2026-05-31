// ASYNC JAVASCRIPT — Lecture 13

// ===== 1. TIMERS (Callbacks) =====
console.log("1. Start");

setTimeout(() => {
  console.log("3. Timeout finished (after 1s)");
}, 1000);

console.log("2. End"); 
// Output order: Start, End, Timeout finished

// ===== 2. PROMISES =====
// A Promise represents the eventual completion (or failure) of an asynchronous operation.
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) resolve("Data loaded!");
    else reject("Error loading data.");
  }, 1500);
});

// Consuming Promises with .then() and .catch()
myPromise
  .then(data => {
    console.log("Promise resolved:", data);
  })
  .catch(error => {
    console.error("Promise rejected:", error);
  });

// ===== 3. FETCH API (Promises) =====
// Fetching data from a public API
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json(); // Parses JSON string into JS object
  })
  .then(user => {
    console.log("Fetch user:", user.name);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

// ===== 4. ASYNC / AWAIT (Modern Syntax) =====
// Syntactic sugar over Promises. Makes async code look synchronous.
async function getUserData() {
  try {
    // Await pauses the function execution until the Promise settles
    const response = await fetch("https://jsonplaceholder.typicode.com/users/2");
    
    if (!response.ok) throw new Error("HTTP Error " + response.status);
    
    const user = await response.json();
    console.log("Async/await user:", user.name);
  } catch (error) {
    console.error("Async/await error:", error);
  }
}

getUserData();

// ===== 5. PROMISE.ALL =====
// Running multiple Promises in parallel
async function getAllData() {
  const p1 = fetch("https://jsonplaceholder.typicode.com/users/1").then(r => r.json());
  const p2 = fetch("https://jsonplaceholder.typicode.com/users/2").then(r => r.json());
  
  try {
    // Waits for ALL promises to resolve
    const [user1, user2] = await Promise.all([p1, p2]);
    console.log("Promise.all:", user1.name, "&", user2.name);
  } catch (err) {
    console.error("One of the promises failed", err);
  }
}

getAllData();
