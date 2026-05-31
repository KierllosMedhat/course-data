# Lab 1: Events

1. Create a Console app.
2. Define `public class Order` with a `public event EventHandler<string>? OrderCompleted;` event.
3. Write a `ProcessOrder()` method that raises the event.
4. In `Program.cs`, instantiate an `Order`, subscribe to the event with a lambda, and call `ProcessOrder()`.
