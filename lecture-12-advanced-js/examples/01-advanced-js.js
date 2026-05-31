// ADVANCED JAVASCRIPT — Lecture 12

// ===== 1. SCOPE (Global, Function, Block) =====
const globalVar = "I am global";

function scopeExample() {
  const functionVar = "I am inside a function";
  console.log(globalVar); // accessible

  if (true) {
    const blockVar = "I am inside a block";
    var oldVar = "I leak out of blocks!"; 
  }
  // console.log(blockVar); // ReferenceError
  console.log(oldVar);      // works because `var` is function-scoped
}
scopeExample();

// ===== 2. CLOSURES =====
// A closure is a function that remembers the variables from its outer scope 
// even after the outer function has finished executing.
function createCounter() {
  let count = 0; // Private variable

  return function() {
    count++;
    return count;
  };
}

const counter1 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2

const counter2 = createCounter();
console.log(counter2()); // 1 (independent state)

// ===== 3. THE 'this' KEYWORD =====
// 'this' refers to the object that is executing the current function.
const person = {
  name: "Alice",
  greet() {
    console.log(`Hi, I am ${this.name}`);
  },
  // Arrow functions do NOT bind their own 'this'. 
  // They inherit 'this' from the enclosing lexical scope.
  greetArrow: () => {
    console.log(`Arrow function this:`, this); 
  }
};

person.greet(); // "Hi, I am Alice"
person.greetArrow(); // window/global object

// ===== 4. CALL, APPLY, BIND =====
const user1 = { name: "Bob" };
const user2 = { name: "Charlie" };

function sayHello(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

// .call(thisArg, arg1, arg2...)
sayHello.call(user1, "Hello", "!"); // Hello, Bob!

// .apply(thisArg, [argsArray])
sayHello.apply(user2, ["Hi", "."]); // Hi, Charlie.

// .bind(thisArg) returns a new function with 'this' bound permanently
const bobSaysHi = sayHello.bind(user1, "Hey");
bobSaysHi("?"); // Hey, Bob?

// ===== 5. HIGHER-ORDER FUNCTIONS =====
// A function that takes a function as an argument OR returns a function.
function repeatAction(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeatAction(3, console.log); // 0, 1, 2
