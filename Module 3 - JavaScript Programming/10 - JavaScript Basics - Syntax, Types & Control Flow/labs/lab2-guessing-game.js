// Lab 2: Number Guessing Game
// TODO: Complete the number guessing game logic below.

// 1. Generate a random secret number between 1 and 100
const secret = Math.floor(Math.random() * 100) + 1;

// 2. Initialize a variable to track the number of attempts (Bonus)
let attempts = 0;
const maxAttempts = 10;

// TODO: Create a loop that runs until the user guesses the correct number.
// - Inside the loop:
//   - Prompt the user to enter a guess: prompt("Enter a guess between 1 and 100:")
//   - Convert the guess to a number using Number() or parseInt().
//   - Increment the attempts counter.
//   - Compare the guess with the secret:
//     - If the guess is too high, alert the user "Too high!".
//     - If the guess is too low, alert the user "Too low!".
//     - If the guess is correct, alert the user "🎉 Correct! You guessed it in X attempts!" (replace X with attempts count) and break/exit the loop.
//   - Bonus: Check if they exceeded maxAttempts (10 attempts). If so, alert "Game Over" and exit the loop.

// Write your game loop below:

