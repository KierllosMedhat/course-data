# Lecture 36 — Error Handling, File I/O & Asynchronous C#

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Handle exceptions gracefully with `try/catch/finally` blocks
- Create and throw your own custom exceptions
- Read from and write to the file system using `System.IO` (File, Path, streams)
- Automatically manage unmanaged resources using the `using` statement
- Convert C# objects to JSON strings and back using `System.Text.Json`
- Understand the magic of asynchronous programming with `async/await`
- Differentiate between Async (I/O) and Parallel (CPU) programming

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Exception Handling: Anticipating the Unexpected
2. File I/O: Reading and Writing Files
3. The `using` Statement & Resource Management
4. JSON Serialization & Deserialization
5. Asynchronous C#: The Waiter Analogy
6. Async vs. Parallel Programming

### Part 2 — Practice / Lab (~90–120 min)
1. Build a File Logger with Exception Handling
2. JSON Serialization & Deserialization
3. FinanceTracker Project Part 4: File I/O & JSON

---

## 1. Exception Handling: Anticipating the Unexpected

### What is an Exception?

In the real world, an exception is something out of the ordinary. In C#, an **Exception** is an object representing a runtime error. If a user tries to divide a number by zero, or if your program tries to open a file that doesn't exist, C# throws an Exception.

If you don't "catch" the exception, your program crashes immediately.

### `try`, `catch`, and `finally`

```csharp
// We wrap risky code in a "try" block
try
{
    Console.Write("Enter a number to divide 100 by: ");
    int divisor = int.Parse(Console.ReadLine());
    int result = 100 / divisor;
    
    Console.WriteLine($"Result: {result}");
}
// We "catch" specific exceptions if they happen
catch (DivideByZeroException ex)
{
    // This runs if the user enters 0
    Console.WriteLine("Math error: You cannot divide by zero!");
}
catch (FormatException ex)
{
    // This runs if the user enters text instead of a number
    Console.WriteLine("Format error: Please enter a valid number!");
}
catch (Exception ex)
{
    // This is the fallback for any OTHER unexpected error
    Console.WriteLine($"An unexpected error occurred: {ex.Message}");
    
    // Sometimes you want the program to crash anyway after logging the error
    throw; // Rethrows the exact same exception, preserving the stack trace!
}
finally
{
    // This ALWAYS executes, whether an error happened or not!
    Console.WriteLine("Cleanup completed.");
}
```

> [!NOTE]
> **Why `throw;` and not `throw ex;`?**
> When you use `throw ex;`, C# resets the "Stack Trace" (the history of exactly which line of code caused the error) to the `catch` block. Using `throw;` preserves the original history, making debugging much easier!

### Common Mistakes in Exception Handling

1. **Using Exceptions for Normal Logic:**
   Don't use `try/catch` to check if a string is a valid number. Exceptions are slow.
   - ❌ **BAD:** `try { int.Parse(input); } catch { ... }`
   - ✅ **GOOD:** `if (int.TryParse(input, out int result)) { ... }`

2. **Swallowing Exceptions:**
   Never leave a catch block empty!
   - ❌ **BAD:** `catch (Exception ex) { }` // The error vanishes and you'll never know!

---

## 2. File I/O: Reading and Writing Files

The `System.IO` namespace provides all the tools you need to interact with the file system.

### The `File` Class — Quick and Easy

If you just need to read or write an entire file at once, the `File` static class is your best friend.

```csharp
using System.IO;

string path = "data.txt";

// 1. Write text to a file (overwrites the file if it exists)
File.WriteAllText(path, "Hello, World!");

// 2. Append text to a file
File.AppendAllText(path, "\nWelcome to C#!");

// 3. Read all text from a file into a single string
string content = File.ReadAllText(path);
Console.WriteLine(content);

// 4. Check if a file exists
if (File.Exists(path))
{
    // 5. Delete a file
    File.Delete(path);
}
```

### The `Path` Class

When building file paths, never use hardcoded slashes like `"folder\\file.txt"`, because Windows uses `\` and Mac/Linux use `/`.

```csharp
// ✅ GOOD: Safely combines paths based on the operating system
string fullPath = Path.Combine("folder", "subfolder", "file.txt");

// Get the extension of a file
string ext = Path.GetExtension(fullPath); // Returns ".txt"
```

---

## 3. The `using` Statement & Resource Management

### The Problem: Leaking Resources

When you open a file, a database connection, or a network socket, the operating system locks that resource. When you are done, you **must** release it. 

If you forget, other programs won't be able to access the file, and your app will run out of memory!

```csharp
// ❌ DANGEROUS WAY
StreamWriter writer = new StreamWriter("log.txt");
writer.WriteLine("Starting process...");
// If an exception happens here, the file stays locked forever!
writer.Close(); 
```

### The Solution: `using`

Any class that holds external resources implements the `IDisposable` interface. The `using` statement guarantees that the `.Dispose()` method is called to release the resource—**even if an exception occurs**.

```csharp
// ✅ THE MODERN WAY (C# 8+)
using var writer = new StreamWriter("log.txt", append: true);
writer.WriteLine("Log entry");

// As soon as the method ends, 'writer' is automatically disposed and the file is unlocked!
```

---

## 4. JSON Serialization & Deserialization

JSON (JavaScript Object Notation) is the standard language of the internet. It is how data is transmitted between frontend applications (Angular/React) and backend servers (C#).

- **Serialization:** Converting a C# Object into a JSON string.
- **Deserialization:** Converting a JSON string back into a C# Object.

C# includes a blazing fast, built-in library for this: `System.Text.Json`.

### Step 1: Define a Class

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}
```

### Step 2: Serialize to JSON

```csharp
using System.Text.Json;

var laptop = new Product { Id = 1, Name = "Laptop", Price = 1200.00m };

// Convert the C# object to a JSON string
string json = JsonSerializer.Serialize(laptop);

Console.WriteLine(json);
// Output: {"Id":1,"Name":"Laptop","Price":1200.00}

// Optional: Make it pretty (indented)
var options = new JsonSerializerOptions { WriteIndented = true };
string prettyJson = JsonSerializer.Serialize(laptop, options);
```

### Step 3: Deserialize from JSON

```csharp
string jsonString = @"{""Id"":2, ""Name"":""Mouse"", ""Price"":25.50}";

// Convert the JSON string back into a C# object
Product? p = JsonSerializer.Deserialize<Product>(jsonString);

Console.WriteLine(p.Name); // Output: Mouse
```

---

## 5. Asynchronous C#: The Waiter Analogy

### The Real-World Analogy

Imagine you are a waiter in a restaurant. 

**Synchronous Waiter (Bad):**
You take Table 1's order and give it to the chef. You stand perfectly still in the kitchen, staring at the chef for 20 minutes until the food is ready. Meanwhile, Table 2 and Table 3 are angry because no one is taking their orders!

**Asynchronous Waiter (Good):**
You take Table 1's order and give it to the chef. While the chef is cooking, you **free yourself** to go take Table 2's order, and serve drinks to Table 3. When the chef rings the bell indicating Table 1's food is ready, you return to the kitchen, grab the food, and serve it.

### The Problem: Synchronous I/O Blocks Threads

In programming, your "Waiter" is a "Thread". When you read a massive file from a hard drive, or request data from an external API over the internet, it takes a long time (I/O bound work). 

If you do it synchronously, the thread freezes, and your entire application becomes unresponsive.

```csharp
// ❌ BAD: The thread freezes, staring at the hard drive until it finishes reading
string data = File.ReadAllText("massive_file.txt");
```

### The Solution: `async` and `await`

By using `async` and `await`, we tell the thread to go do other work while the hard drive is fetching the data.

```csharp
// ✅ GOOD: The thread is freed while the hard drive works
string data = await File.ReadAllTextAsync("massive_file.txt");
```

### How to Write Async Methods

1. Add the `async` keyword to the method signature.
2. Return a `Task` (if void) or `Task<T>` (if returning a value).
3. Use the `await` keyword before calling an asynchronous method.

```csharp
// Returns Task<string> instead of just string
public async Task<string> FetchDataAsync()
{
    Console.WriteLine("Starting to fetch data...");
    
    // The thread is suspended here. It goes back to the thread pool to help other users!
    string result = await File.ReadAllTextAsync("massive_data.json");
    
    // When the file is ready, a thread resumes execution here
    Console.WriteLine("Data fetched!");
    
    return result;
}
```

> [!WARNING]
> **The Deadlock Trap!**
> Never, ever use `.Wait()` or `.Result` on an async Task. This forces a synchronous wait on an asynchronous operation and will cause your application to completely freeze (deadlock). Async code must be "async all the way down".

---

## 6. Async vs. Parallel Programming

It's easy to confuse these two, but they solve completely different problems!

> **Async = I/O (Waiting). Parallel = CPU (Working).**

| Concept | The Analogy | The Problem it Solves | When to use it |
|---------|-------------|-----------------------|----------------|
| **Async / Await** | One chef cooking a pizza in an oven. They don't stare at the oven; they prep salad while waiting. | Unblocking threads during I/O operations (Files, Network, Databases) | Reading 10,000 files from disk. Calling an external Web API. |
| **Parallel** | 10 chefs chopping 10,000 onions at the exact same time. | Using all CPU cores simultaneously for heavy math. | Resizing 10,000 images. Encrypting data. Heavy calculations. |

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Using `throw ex;` in a catch block | Use `throw;` to preserve the original stack trace |
| Forgetting to close/dispose a `StreamWriter` | Wrap the `StreamWriter` in a `using` statement |
| Using string concatenation for file paths | Always use `Path.Combine("folder", "file.txt")` |
| Using `.Result` or `.Wait()` on Tasks | Always use `await`! (Async all the way down) |
| Using Async for CPU-heavy math | Use `Parallel.ForEach` for CPU-bound work |

---

## 🧪 Practice Labs

### Lab 1 — File Logger (30 min)
1. Create a `FileLogger` class implementing `IDisposable`.
2. Open a `StreamWriter` to `logs.txt` in the constructor. (Make sure `append: true`).
3. Write a `public void Log(string message)` method that writes the message with a timestamp.
4. Implement `Dispose()` to close the writer.
5. In `Program.cs`, wrap the logger instantiation in a `using` statement and write some logs.

### Lab 2 — JSON Serialization (30 min)
1. Create a `Student` class with `Id`, `Name`, and `Grade` properties.
2. Instantiate a list of 3 students.
3. Serialize the list to a JSON string using `JsonSerializer.Serialize` (use `WriteIndented = true`).
4. Print the JSON to the console.
5. Deserialize the JSON string back into a `List<Student>` and loop through it, printing their names!

---

## 📝 Assignment: FinanceTracker Project — Part 4

Let's save our FinanceTracker transactions so they persist between program runs!

### Requirements
1. Create a `StorageService` class.
2. Add an async method: `public async Task SaveTransactionsAsync(List<Transaction> transactions)`. 
   - Inside, serialize the list to a JSON string.
   - Write the JSON string to a file called `transactions.json` using `File.WriteAllTextAsync`.
3. Add an async method: `public async Task<List<Transaction>> LoadTransactionsAsync()`. 
   - Check if `transactions.json` exists using `File.Exists`.
   - If it does, read the JSON using `File.ReadAllTextAsync` and deserialize it.
   - If it does not exist, return a new empty list.
4. Update `Program.cs`. 
   - Make your `Main` method async: `static async Task Main(string[] args)`.
   - At startup, **await** `LoadTransactionsAsync()` to populate your list. 
   - When the user chooses to exit the program, **await** `SaveTransactionsAsync()` before closing.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Microsoft Docs - Exceptions | https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/ |
| Microsoft Docs - JSON | https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-overview |
| Microsoft Docs - Async/Await | https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/ |

---

## 📌 Key Takeaways
- **`try/catch/finally`** handles runtime errors. The `finally` block ALWAYS runs. Use `throw;` to keep stack traces intact.
- **`using`** ensures `IDisposable` resources (like files and streams) are closed safely, even if an exception occurs.
- **`System.Text.Json`** is the built-in, fast library for converting objects to JSON and back.
- **`async/await`** prevents your application from freezing during I/O operations (like File I/O or HTTP calls). It does NOT create new threads.
- Never mix synchronous waits (`.Result` or `.Wait()`) with async code.

---

**Next Lecture:** [Lecture 37 — Entity Framework Core — Database Access](./37%20-%20Entity%20Framework%20Core%20-%20Database%20Access.md)