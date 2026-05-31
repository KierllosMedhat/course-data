// JAVASCRIPT BASICS — Lecture 09

// ===== 1. VARIABLES (let, const) =====
let playerName = "Alice";      // can be reassigned
const maxScore = 100;          // cannot be reassigned (constant)

console.log("Welcome,", playerName);
playerName = "Alice_Pro";      // Valid reassignment
// maxScore = 200;             // TypeError: Assignment to constant variable.

// ===== 2. DATA TYPES (Primitives) =====
const title = "Developer";     // String
const age = 28;                // Number
const isEmployed = true;       // Boolean
const unassigned = undefined;  // Undefined
const emptyValue = null;       // Null

// ===== 3. OPERATORS =====
// Arithmetic
let x = 10;
let y = 3;
console.log("Add:", x + y);        // 13
console.log("Modulus:", x % y);    // 1 (remainder)
console.log("Exponent:", x ** y);  // 1000

// Comparison (always use ===, never ==)
console.log("10 === 10:", 10 === 10);     // true
console.log("10 === '10':", 10 === "10"); // false (strict type check)
console.log("10 == '10':", 10 == "10");   // true (loose equality - AVOID!)

// Logical
const hasAccount = true;
const hasSubscription = false;
console.log("Can watch video?", hasAccount && hasSubscription); // false

// Ternary operator (compact if/else)
const status = age >= 18 ? "Adult" : "Minor";

// ===== 4. CONTROL FLOW =====
// if / else if / else
const score = 85;
if (score >= 90) {
  console.log("Grade A");
} else if (score >= 80) {
  console.log("Grade B");
} else {
  console.log("Grade C");
}

// switch (best for multiple distinct values)
const day = "Monday";
switch (day) {
  case "Monday":
    console.log("Start of the week");
    break;
  case "Friday":
    console.log("Almost weekend");
    break;
  default:
    console.log("Mid-week");
}

// ===== 5. LOOPS =====
// for loop (when you know the count)
console.log("For Loop:");
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}

// while loop (when you don't know the count)
console.log("While Loop:");
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}

// for...of (looping arrays)
console.log("For...of Loop:");
const fruits = ["Apple", "Banana", "Cherry"];
for (const fruit of fruits) {
  console.log(fruit);
}

// ===== 6. TRUTHY / FALSY =====
// Falsy values: false, 0, "", null, undefined, NaN
// Everything else is truthy
if ("") {
  console.log("This will never run");
}
if ("Hello") {
  console.log("This will run");
}
