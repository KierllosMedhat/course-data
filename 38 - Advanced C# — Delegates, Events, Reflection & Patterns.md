# Lecture 38 — Advanced C#: Delegates, Events, Reflection & Patterns

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Use delegates (`Func<T>`, `Action<T>`) and lambda expressions.
- Implement the publisher-subscriber pattern with Events.
- Add functionality to existing types with Extension Methods.
- Inspect code at runtime using Reflection.
- Apply common design patterns (Singleton, Factory, Repository).
- Use `record` types for immutable data.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Delegates and Lambdas (`Func<T>`, `Action<T>`)
2. Events: Publisher-Subscriber Pattern
3. Extension Methods
4. Records (`record` and `record struct`)
5. Common Design Patterns (Singleton, Repository, Factory)

### Part 2 — Practice / Lab (~90–120 min)
1. Event-driven notification system
2. Extension methods for strings
3. FinanceTracker Project Part 6: Repository Pattern & Extension Methods

---

## 1. Delegates and Lambdas

A **delegate** is a type that holds a reference to a method. C# provides built-in delegates that you should use 99% of the time:

- `Action<T>`: Takes parameters, returns `void`.
- `Func<T, TResult>`: Takes parameters, returns `TResult`.

### Lambda Expressions
Lambdas are a shorthand way to write small, anonymous methods.

```csharp
// Func that takes an int and returns an int
Func<int, int> square = x => x * x;
Console.WriteLine(square(5)); // 25

// Action that takes a string and returns void
Action<string> log = msg => Console.WriteLine(msg);
log("Hello!");
```

---

## 2. Events: Publisher-Subscriber Pattern

Events are built on top of delegates. They allow an object (publisher) to notify other objects (subscribers) when something happens.

```csharp
public class BankAccount
{
    // 1. Declare the event
    public event EventHandler<string>? Overdrawn;

    public void Withdraw(decimal amount)
    {
        // 2. Raise the event if a condition is met
        if (amount > 1000)
        {
            Overdrawn?.Invoke(this, "You withdrew a lot of money!");
        }
    }
}

// 3. Subscribe to the event
var account = new BankAccount();
account.Overdrawn += (sender, message) => Console.WriteLine($"ALERT: {message}");

account.Withdraw(1500); // Triggers the alert
```

---

## 3. Extension Methods

Extension methods allow you to add new methods to existing types (like `string` or `int`) without modifying their source code.

```csharp
public static class StringExtensions
{
    // The 'this' keyword tells C# this is an extension method for strings
    public static bool IsValidEmail(this string email)
    {
        return email.Contains("@");
    }
}

// Usage:
string myEmail = "test@example.com";
bool isValid = myEmail.IsValidEmail(); // Called just like a normal method!
```

---

## 4. Records

Records are a special kind of class designed for **immutable data** and **value-based equality**.

```csharp
public record Person(string FirstName, string LastName);

var p1 = new Person("Alice", "Smith");
var p2 = new Person("Alice", "Smith");

// True! Because their data is the same. Normal classes would be false.
Console.WriteLine(p1 == p2); 
```

### The `with` expression
If you want to change a record, you create a new copy with the changes:
```csharp
var p3 = p1 with { LastName = "Johnson" };
```

---

## 5. Design Patterns

### The Repository Pattern
Abstracts data access away from business logic.
```csharp
public interface IRepository<T>
{
    Task<List<T>> GetAllAsync();
    Task AddAsync(T item);
    Task DeleteAsync(T item);
}

// Implement it using EF Core
public class EfRepository<T> : IRepository<T> where T : class
{
    private readonly DbContext _context;
    public EfRepository(DbContext context) => _context = context;
    
    public async Task AddAsync(T item)
    {
        _context.Set<T>().Add(item);
        await _context.SaveChangesAsync();
    }
    // ...
}
```

### The Singleton Pattern
Ensures a class has only ONE instance, and provides a global point of access to it.
```csharp
public sealed class Logger
{
    private static readonly Logger _instance = new Logger();
    private Logger() {} // Private constructor!
    
    public static Logger Instance => _instance;
}
```

---

## 🧪 Practice Labs

### Lab 1 — Events (30 min)
1. Create an `Order` class with a `ProcessOrder()` method.
2. Add an `OrderCompleted` event.
3. In `Program.cs`, subscribe to the event and print a message when the order finishes processing.

### Lab 2 — Extension Methods (30 min)
1. Create a static `IntExtensions` class.
2. Add a `public static bool IsEven(this int number)` method.
3. Test it: `int x = 4; Console.WriteLine(x.IsEven());`

---

## 📝 Assignment: FinanceTracker Project — Part 6

Let's clean up our architecture using the Repository Pattern and Extension Methods.

### Requirements
1. Define an `ITransactionRepository` interface with methods for getting, adding, and deleting transactions.
2. Create an `EfTransactionRepository` class that implements the interface using your EF Core DbContext.
3. Update `Program.cs` to depend entirely on the `ITransactionRepository` rather than the DbContext directly.
4. Create an Extension Method `public static decimal GetTotalBalance(this IEnumerable<Transaction> transactions)` that calculates the sum of incomes minus the sum of expenses. Use this extension method in your report!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Delegates | https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/ |
| Extension Methods | https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods |

---

## 📌 Key Takeaways
- **Delegates** (`Func`, `Action`) are variables that hold methods.
- **Events** allow objects to notify other objects when something happens safely.
- **Extension Methods** let you "add" methods to classes you don't own.
- **Records** are perfect for immutable DTOs and value-based equality.
- **The Repository Pattern** is standard practice for abstracting EF Core database access.

🎉 **Congratulations!** You've completed **Module 6: C# & .NET Fundamentals.**

**Next Module:** [Module 7 — ASP.NET Core Web API](./39%20-%20ASP.NET%20Core%20Fundamentals%20%26%20Middleware.md)