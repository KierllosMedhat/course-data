// ES6+ MODERN FEATURES & TOOLING — Lecture 14

// ===== 1. TEMPLATE LITERALS =====
const product = "Laptop";
const price = 999;
// Old way: "The " + product + " costs $" + price;
const message = `The ${product} costs $${price}`;

// ===== 2. OPTIONAL CHAINING (?.) =====
const user = {
  name: "Alice",
  address: {
    city: "London"
  }
};
// Safe access: won't crash if 'address' or 'zipcode' is missing
console.log(user.address?.city);     // "London"
console.log(user.profile?.avatar);   // undefined

// ===== 3. NULLISH COALESCING (??) =====
// Returns the right side ONLY if the left side is null or undefined
const port = 0;
// Using || (0 is falsy, so it uses 8080)
console.log(port || 8080); // 8080 
// Using ?? (0 is not nullish, so it keeps 0)
console.log(port ?? 8080); // 0

// ===== 4. ENHANCED OBJECT LITERALS =====
const type = "Admin";
function sayHello() { console.log("Hello!"); }

// Shorthand property names and methods
const config = {
  type,          // Same as type: type
  sayHello,      // Same as sayHello: sayHello
  greet() {      // Shorthand for greet: function() {}
    console.log(`I am an ${this.type}`);
  }
};

// ===== 5. MODULES (ESM) =====
// To use modules in HTML: <script type="module" src="app.js"></script>
// math.js:
// export const pi = 3.14;
// export function add(a, b) { return a + b; }
// export default class Calculator { ... }

// app.js:
// import Calculator, { pi, add } from './math.js';

// ===== 6. CLASSES (ES6) =====
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }
  speak() {
    console.log(`${this.name} barks!`);
  }
}

const dog = new Dog("Rex", "German Shepherd");
dog.speak(); // "Rex barks!"
