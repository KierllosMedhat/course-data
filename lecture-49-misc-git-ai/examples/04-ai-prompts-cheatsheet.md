# AI Prompting Cheatsheet for Developers

Use the **CONTEXT-TASK-FORMAT** pattern for best results.

## Refactoring & Modernization
"I am working in a Node.js project. This function uses old Promise chains (.then/.catch) and is hard to read. Refactor it to use modern `async/await` syntax. Keep the error handling but make it cleaner. Provide only the updated function code."

## Debugging an Error
"I am building an Angular 21 application. I am getting the following error in my browser console when I click the Submit button:
`ERROR Error: Uncaught (in promise): NullInjectorError: R3InjectorError(AppModule)[CartService -> CartService -> CartService]: NullInjectorError: No provider for CartService!`
Here is my component code: [paste code]. How do I fix this DI error? Explain the fix briefly, then show the corrected code."

## Generating Unit Tests
"I am writing C# tests using xUnit and Moq. Here is my `OrderService` class: [paste code]. Write a complete test class covering the `PlaceOrderAsync` method. Include three test cases: 1) A successful order, 2) A failure when inventory is zero, 3) A failure when the user ID is invalid. Return the full test class."

## Code Explanation (Rubber Ducking)
"I found this complex regular expression in our codebase: `^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$`. I am a junior developer. Break down exactly what this regex does, piece by piece, and explain what kind of string it is trying to validate."

## Generating Documentation
"I have written this TypeScript utility function: [paste code]. Write a JSDoc block for this function that describes what it does, explains its parameters, and provides an example of how to use it."
