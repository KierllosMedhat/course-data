console.log("Guessing Game loaded!");

// Generate a random number between 1 and 10
const secret = Math.floor(Math.random() * 10) + 1;

let guessedCorrectly = false;

// TODO: Write a while loop that keeps running as long as guessedCorrectly is false
// Inside the loop:
// 1. Prompt the user for a guess
// 2. Convert the guess to a Number
// 3. Check if the guess === secret. If so, console.log a win message and set guessedCorrectly to true.
// 4. Otherwise, tell them to try again.
