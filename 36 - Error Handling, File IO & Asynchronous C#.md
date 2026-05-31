# Lecture 36 — Error Handling, File I/O & Asynchronous C#

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Handle exceptions with `try/catch/finally` and create custom exceptions
- Read and write files using `System.IO` (File, Path, streams)
- Serialize/deserialize JSON with `System.Text.Json`
- Write asynchronous code with `async/await`, `Task`, and `Task<T>`
- Distinguish async (I/O) from parallel (CPU) programming

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Exception handling: `try/catch/finally`, custom exceptions
2. File I/O: `File`, `Path`, streams, `using`
3. JSON: `System.Text.Json`
4. Async/await: `Task`, `Task<T>`
5. Async vs Parallel

### Part 2 — Practice / Lab (~90–120 min)
1. File logger with exception handling
2. JSON serialization/deserialization
3. FinanceTracker Project Part 4: File I/O & JSON

---

## 1. Exception Handling — `try/catch/finally`

```csharp
try
{
    int result = 10 / int.Parse("0");
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Math error: {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"Unexpected error: {ex.Message}");
    throw;  // Rethrow — preserves original stack trace
}
finally
{
    Console.WriteLine("Cleanup completed.");  // Always executes!
}
```

### Key Rules
1. **Order** catch blocks from most specific to most general.
2. Use **`throw;`** not `throw ex;` to preserve the original stack trace.
3. **Avoid exceptions for control flow** — use `int.TryParse` instead of catching format exceptions.

---

## 2. File I/O — `System.IO`

### `File` Class — Convenient One-Off Operations
```csharp
string content = File.ReadAllText("config.json");
File.WriteAllText("output.txt", "Hello World!");

bool exists = File.Exists("data.csv");
```

### Streams & `IDisposable`
Resources like files and database connections need to be released when you are done with them.
The `using` keyword ensures `Dispose()` is called automatically, even if an exception occurs!

```csharp
using var writer = new StreamWriter("output.txt", append: true);
writer.WriteLine("Log entry");
// writer is automatically disposed here!
```

---

## 3. JSON — `System.Text.Json`

Serialization converts C# objects to JSON strings. Deserialization converts JSON strings to C# objects.

```csharp
using System.Text.Json;

var product = new Product { Name = "Laptop", Price = 1200.00m };

// Serialize
string json = JsonSerializer.Serialize(product, new JsonSerializerOptions { WriteIndented = true });

// Deserialize
Product? p = JsonSerializer.Deserialize<Product>(json);
```

---

## 4. Async/Await

### The Problem: Synchronous I/O Blocks Threads
```csharp
// ❌ BAD — blocks the thread while waiting for the file to read
string data = File.ReadAllText("huge_file.txt");

// ✅ GOOD — frees the thread to do other work while waiting
string data = await File.ReadAllTextAsync("huge_file.txt");
```

### Key Concepts
| Concept | Description |
|---------|-------------|
| `Task` | Async operation, no return value (`void`) |
| `Task<T>` | Async operation returning `T` |
| `async` | Marks method as asynchronous |
| `await` | Suspends until task completes; thread returns to pool |

```csharp
public async Task<string> FetchDataAsync()
{
    // Await pauses the method, NOT the thread!
    string result = await File.ReadAllTextAsync("data.txt");
    return result;
}
```

> [!IMPORTANT]
> `async/await` does **NOT** create new threads. It frees the current thread while waiting for I/O (like writing to a disk or waiting for an HTTP response).

---

## 5. Async vs Parallel

> **Async = I/O (waiting). Parallel = CPU (working).**

If you have to do heavy math on 10,000 items, use `Parallel.ForEach`.
If you have to read 10,000 files from disk, use `async/await`.

---

## 🧪 Practice Labs

### Lab 1 — File Logger (30 min)
1. Create a `FileLogger` class implementing `IDisposable`.
2. Open a `StreamWriter` in the constructor.
3. Write a `Log(string msg)` method.
4. Implement `Dispose()` to close the writer.

### Lab 2 — JSON Serialization (30 min)
1. Create a `User` class.
2. Instantiate a `User`.
3. Serialize it to a JSON string and print it.
4. Read the JSON string back into a `User` object!

---

## 📝 Assignment: FinanceTracker Project — Part 4

Let's save our transactions so they persist between runs!

### Requirements
1. Create a `StorageService` class.
2. Add an async method: `public async Task SaveTransactionsAsync(List<Transaction> transactions)`. Inside, serialize the list to JSON and write it to `transactions.json` using `File.WriteAllTextAsync`.
3. Add an async method: `public async Task<List<Transaction>> LoadTransactionsAsync()`. Inside, check if the file exists. If it does, read the JSON and deserialize it. If not, return a new empty list.
4. Update `Program.cs`. At startup, **await** `LoadTransactionsAsync()`. 
5. When the user exits the program, **await** `SaveTransactionsAsync()`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Exception Handling | https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/ |
| Async Programming | https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/ |

---

## 📌 Key Takeaways
- **`try/catch/finally`** handles errors gracefully. Use `throw;` to preserve stack traces.
- Always use **`using`** for `IDisposable` resources (like files).
- **`System.Text.Json`** is built-in and high-performance.
- **`async/await`** frees threads during I/O — it does NOT create new threads.
- Never mix `.Result` or `.Wait()` with async code; it causes deadlocks. Async must be end-to-end.

---

**Next Lecture:** [Lecture 37 — Entity Framework Core — Database Access](./37%20-%20Entity%20Framework%20Core%20%E2%80%94%20Database%20Access.md)