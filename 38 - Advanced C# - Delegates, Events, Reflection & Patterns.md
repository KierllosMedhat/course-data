# Lecture 38 — Advanced C#: Delegates, Events, Reflection & Patterns

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand and use delegates (`Func<T>`, `Action<T>`) to pass methods as parameters
- Write concise, anonymous functions using lambda expressions
- Implement the publisher-subscriber pattern using Events
- Add new functionality to existing types without modifying their source code using Extension Methods
- Use `record` types to model immutable data and leverage value-based equality
- Apply common architectural design patterns (Singleton, Repository) to structure code professionally

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Delegates and Lambdas (`Func<T>`, `Action<T>`)
2. Events: The Publisher-Subscriber Pattern
3. Extension Methods: Upgrading Built-In Types
4. Records (`record`): Immutable Data Structures
5. Common Design Patterns (Singleton, Repository)

### Part 2 — Practice / Lab (~90–120 min)
1. Event-driven notification system
2. Extension methods for strings and integers
3. FinanceTracker Project Part 6: Repository Pattern & Extension Methods

---

## 1. Delegates and Lambdas

### What is a Delegate?

In C#, a variable usually holds **data** (like an integer, string, or object). But what if you wanted a variable to hold a **method** (behavior)? 

A **delegate** is a type that safely holds a reference to a method. You can pass a delegate as a parameter to another method, allowing you to pass "behavior" around just like data.

While you can create custom delegates, modern C# provides two built-in delegates that you will use 99% of the time:

- **`Action<T>`**: Represents a method that takes parameters but returns `void` (does an action).
- **`Func<T, TResult>`**: Represents a method that takes parameters and returns a `TResult` (calculates a function).

### Lambda Expressions (The Arrow Syntax)

A lambda expression is a quick, shorthand way to write an anonymous method (a method without a name) directly inside your code. It uses the `=>` operator (read as "goes to").

```csharp
// 1. Using Func (Takes an int, returns an int)
// 'x' is the input. 'x * x' is the return value.
Func<int, int> square = x => x * x;

Console.WriteLine(square(5)); // Output: 25

// 2. Using Action (Takes a string, returns void)
// 'msg' is the input. The block of code executes but returns nothing.
Action<string> logMessage = msg => 
{
    Console.WriteLine($"[LOG]: {msg}");
};

logMessage("System started."); // Output: [LOG]: System started.
```

### Why Does This Matter? (LINQ)

If you've used LINQ (like `.Where()` or `.Select()`), you've already been using delegates and lambdas! The `.Where()` method expects a `Func<T, bool>` — a function that takes an item and returns true or false.

```csharp
List<int> numbers = new() { 1, 2, 3, 4, 5 };

// We are passing a behavior (a lambda) into the Where method!
var evens = numbers.Where(n => n % 2 == 0).ToList();
```

---

## 2. Events: The Publisher-Subscriber Pattern

### The Real-World Analogy: YouTube Subscriptions

Imagine a YouTube channel (the Publisher). When the creator uploads a new video, they don't manually email every single viewer. Instead, viewers click "Subscribe" (the Subscribers). When a video drops, YouTube automatically broadcasts a notification to everyone who subscribed.

In C#, **Events** work exactly the same way. One object announces "Something happened!" and any other objects that care can listen and react.

### Step 1: The Publisher

```csharp
public class BankAccount
{
    public decimal Balance { get; private set; }

    // 1. Declare the event. It uses the built-in EventHandler delegate.
    // The <string> represents the data we send to the subscribers.
    public event EventHandler<string>? Overdrawn;

    public void Withdraw(decimal amount)
    {
        Balance -= amount;
        
        // 2. Raise the event if a condition is met
        if (Balance < 0)
        {
            // ?.Invoke checks if there are any subscribers before firing.
            // 'this' is the sender. The string is the message.
            Overdrawn?.Invoke(this, $"Warning: Account overdrawn by {Balance}");
        }
    }
}
```

### Step 2: The Subscriber

```csharp
var myAccount = new BankAccount();

// 3. Subscribe to the event using the += operator
// We provide a lambda that matches the EventHandler signature: (sender, data)
myAccount.Overdrawn += (sender, message) => 
{
    Console.WriteLine($"ALERT RECEIVED: {message}");
};

// 4. Triggering the behavior
myAccount.Withdraw(100); // Nothing happens (Balance is positive)
myAccount.Withdraw(500); // ALERT RECEIVED: Warning: Account overdrawn by -600!
```

> [!TIP]
> Use `-=` to unsubscribe from an event. This is crucial in UI applications to prevent memory leaks!

---

## 3. Extension Methods: Upgrading Built-In Types

Sometimes you use a class built by Microsoft (like `string` or `int`) or a third-party library, and you wish it had a specific method. Because you don't own the source code, you can't just open the `string` class and type a new method inside it.

**Extension Methods** allow you to "attach" new methods to existing types from the outside.

### Creating an Extension Method

An extension method must meet three strict rules:
1. It must be inside a `public static class`.
2. The method must be `public static`.
3. The first parameter must have the `this` keyword before the type being extended.

```csharp
// 1. Static class
public static class StringExtensions
{
    // 2. Static method
    // 3. 'this string' means this method extends the string type
    public static bool IsValidEmail(this string emailText)
    {
        return emailText.Contains("@") && emailText.Contains(".");
    }
}
```

### Using the Extension Method

Once defined, the compiler magically makes the method appear as if it belonged to the original type!

```csharp
string userEmail = "admin@company.com";

// We call it exactly as if Microsoft wrote IsValidEmail inside the string class!
bool isValid = userEmail.IsValidEmail(); 

Console.WriteLine(isValid); // True
```

---

## 4. Records (`record`): Immutable Data Structures

In C# 9, Microsoft introduced the `record` keyword. A record is a special kind of class designed for two specific purposes: **Immutability** and **Value-Based Equality**.

### Value Equality vs Reference Equality

With normal `class` objects, C# uses **Reference Equality**. If you compare two objects, C# asks: *"Are these the exact same object residing at the exact same memory address?"*

With `record` objects, C# automatically generates **Value Equality**. If you compare two records, C# asks: *"Do all the properties inside these objects match?"*

```csharp
// A simple record declaration. 
// It automatically creates a constructor, properties, and equality logic!
public record Person(string FirstName, string LastName);

// Let's test it:
var p1 = new Person("Alice", "Smith");
var p2 = new Person("Alice", "Smith");

// Using a normal class, this would be FALSE (different memory locations).
// Because they are records, this is TRUE (their data is identical).
Console.WriteLine(p1 == p2); 
```

### Immutability and the `with` Keyword

Records created with the syntax above are **immutable** — you cannot change their properties after they are created. 

If you need to "modify" a record, you use the `with` keyword. This creates a brand new copy of the record with only the specified properties changed. This is extremely safe for multithreaded applications!

```csharp
var original = new Person("Bob", "Johnson");

// original.FirstName = "Robert"; // ❌ ERROR: Records are immutable!

// ✅ GOOD: Create a new copy with one change
var updated = original with { FirstName = "Robert" };

Console.WriteLine(updated.FirstName); // Robert
Console.WriteLine(updated.LastName);  // Johnson (copied from original)
```

---

## 5. Common Design Patterns

A Design Pattern is a standardized, proven solution to a common software engineering problem. 

### The Singleton Pattern

**The Problem:** You have a class (like a Logger or Configuration manager) and you want to guarantee that exactly **one** instance of this class is ever created across your entire application.

**The Solution:** Make the constructor private, and provide a static property to access the single instance.

```csharp
public sealed class Logger
{
    // 1. Create a single, static instance of the class inside itself
    private static readonly Logger _instance = new Logger();

    // 2. Make the constructor PRIVATE so nobody else can use 'new Logger()'
    private Logger() 
    {
        Console.WriteLine("Logger initialized (this only happens once!)");
    }
    
    // 3. Provide a public static property to get the instance
    public static Logger Instance => _instance;

    public void Log(string message) => Console.WriteLine(message);
}

// Usage:
Logger.Instance.Log("Application started.");
Logger.Instance.Log("Database connected.");
// It's the exact same Logger instance handling both calls.
```

### The Repository Pattern

**The Problem:** If you write EF Core `DbContext` queries directly inside your UI or Business Logic, your application becomes tightly coupled to the database. If you change databases, you have to rewrite your whole app. Also, it's very hard to write automated tests.

**The Solution:** The Repository Pattern creates an abstraction layer. The rest of the app talks to an Interface, and only the Repository talks to the database.

```csharp
// 1. Define the Interface (The Contract)
public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();
    Task AddAsync(Product item);
}

// 2. Implement the Repository using EF Core
public class EfProductRepository : IProductRepository
{
    private readonly AppDbContext _context;
    
    // Inject the DbContext
    public EfProductRepository(AppDbContext context) 
    {
        _context = context;
    }
    
    public async Task<List<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }
    
    public async Task AddAsync(Product item)
    {
        _context.Products.Add(item);
        await _context.SaveChangesAsync();
    }
}
```

Now, your application logic only knows about `IProductRepository`. It doesn't know (or care) if the data is coming from SQL Server, a JSON file, or a mock object for testing!

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Forgetting to unsubscribe from events (`-=`) | Always unsubscribe when a UI component is destroyed, or it causes memory leaks. |
| Putting extension methods inside non-static classes | Extension methods **must** live in `public static` classes. |
| Using `class` when comparing data by value | Use `record` when you need value-based equality and immutability (like DTOs). |
| Writing raw SQL or EF Core queries in the UI layer | Abstract database access using the Repository Pattern. |

---

## 🧪 Practice Labs

### Lab 1 — Events (30 min)
1. Create a `StockTicker` class with a `Price` decimal property.
2. Add an event `EventHandler<decimal>? PriceChanged;`.
3. Write a method `UpdatePrice(decimal newPrice)` that changes the price and triggers the event.
4. In `Program.cs`, instantiate `StockTicker`, subscribe to the event (printing the new price to the console), and update the price 3 times.

### Lab 2 — Extension Methods (30 min)
1. Create a static `IntExtensions` class.
2. Add an extension method `public static bool IsEven(this int number)` that returns true if the number is perfectly divisible by 2.
3. Test it in `Program.cs`: `int x = 4; Console.WriteLine(x.IsEven());`

---

## 📝 Assignment: FinanceTracker Project — Part 6

Let's clean up our FinanceTracker architecture using the Repository Pattern and Extension Methods.

### Requirements

1. **The Interface:** Define an `ITransactionRepository` interface with methods: `GetAllAsync()`, `AddAsync(Transaction t)`, and `DeleteAsync(int id)`.
2. **The Implementation:** Create an `EfTransactionRepository` class that implements the interface. Use your EF Core `FinanceContext` inside this class to actually touch the database.
3. **The Refactor:** Update `Program.cs`. It should no longer reference `FinanceContext` directly. Instead, instantiate the `EfTransactionRepository` and use its methods.
4. **The Extension Method:** Create an Extension Method `public static decimal GetTotalBalance(this IEnumerable<Transaction> transactions)`. This method should loop through the transactions, calculate the sum of incomes minus the sum of expenses, and return the final balance. Use this extension method when printing your final report!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Delegates & Events | https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/ |
| Extension Methods | https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods |
| Records in C# | https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/records |
| Repository Pattern | https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design |

---

## 📌 Key Takeaways
- **Delegates** (`Func`, `Action`) are variables that hold methods, enabling you to pass behavior as data.
- **Events** allow objects to broadcast notifications securely without knowing who is listening.
- **Extension Methods** let you seamlessly "add" methods to classes you don't own (like `string` or `int`).
- **Records** are perfect for transferring data (DTOs). They provide immutability and value-based equality out of the box.
- **The Repository Pattern** separates your business logic from your database logic, making your code modular and testable.
- **The Singleton Pattern** guarantees only one instance of a class exists across the entire application.

🎉 **Congratulations!** You've completed **Module 6: C# & .NET Fundamentals.**

**Next Module:** [Lecture 39 — ASP.NET Core Fundamentals & Middleware](./39%20-%20ASP.NET%20Core%20Fundamentals%20%26%20Middleware.md)
