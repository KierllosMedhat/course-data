// FUNCTIONS, ARRAYS & OBJECTS — Lecture 10

// ===== 1. FUNCTIONS =====

// Function Declaration (Hoisted)
function greet(name) {
  return `Hello, ${name}!`;
}

// Function Expression (Not hoisted)
const add = function(a, b) {
  return a + b;
};

// Arrow Function (Modern, concise)
const multiply = (a, b) => a * b;
const square = x => x * x; // parenthesis optional for single param

// Default Parameters
function sayHi(name = "Guest") {
  console.log(`Hi ${name}`);
}

// Rest Parameters (...args)
function sumAll(...numbers) {
  let total = 0;
  for (const num of numbers) {
    total += num;
  }
  return total;
}

// ===== 2. ARRAYS =====
const colors = ["red", "green", "blue"];

// Basic Array Methods
colors.push("yellow");    // Add to end
colors.pop();             // Remove from end
colors.unshift("black");  // Add to start
colors.shift();           // Remove from start

console.log(colors.includes("green")); // true
console.log(colors.indexOf("blue"));   // 2

// Modern Array Methods (Iterators)
const numbers = [1, 2, 3, 4, 5];

// .forEach() — run code for each item
numbers.forEach(num => console.log(num));

// .map() — transform every item into a new array
const doubled = numbers.map(num => num * 2); // [2, 4, 6, 8, 10]

// .filter() — keep items that match a condition
const evens = numbers.filter(num => num % 2 === 0); // [2, 4]

// .find() — return the first matching item
const firstLarge = numbers.find(num => num > 3); // 4

// .reduce() — accumulate array into a single value
const sum = numbers.reduce((total, num) => total + num, 0); // 15

// ===== 3. OBJECTS =====
const user = {
  firstName: "Alice",
  lastName: "Smith",
  age: 28,
  isAdmin: true,
  
  // Method
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
};

// Accessing properties
console.log(user.firstName);       // Dot notation (preferred)
console.log(user["lastName"]);     // Bracket notation (dynamic keys)

// Modifying objects
user.age = 29;                     // Update
user.email = "alice@example.com";  // Add new property
delete user.isAdmin;               // Remove property

// Iterating over objects
console.log("Object keys:");
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

// Object methods
console.log(Object.keys(user));    // ["firstName", "lastName", "age", "email"]
console.log(Object.values(user));  // ["Alice", "Smith", 29, "alice@example.com"]
console.log(Object.entries(user)); // [ ["firstName", "Alice"], ... ]

// ===== 4. DESTRUCTURING & SPREAD =====
// Array Destructuring
const [firstColor, secondColor] = colors;

// Object Destructuring
const { firstName, age: userAge } = user; // renaming age to userAge

// Spread Operator (...)
const copyColors = [...colors, "purple"];
const updatedUser = { ...user, age: 30 };
