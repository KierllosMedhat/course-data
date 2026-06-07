// Lab 2: Mastering 'this'
// TODO: Complete the user object and delayedGreet function, correcting the 'this' context issue.

// 1. TODO: Define a user object with a 'name' property and a 'greet' method.
// The greet method should print a greeting using 'this.name'.
const user = {
  name: "John Doe",
  greet() {
    // Write your greet logic here (must use 'this.name'):
  }
};

// 2. TODO: Implement delayedGreet(callback) using setTimeout.
// The function should call the callback after 1000ms.
function delayedGreet(callback) {
  // Write your setTimeout logic here:
}

// 3. TODO: Call delayedGreet, passing user.greet.
// Note: If you pass user.greet directly, the context of 'this' will be lost.
// Fix this using bind() or an arrow function wrapper.

// Call delayedGreet here:

