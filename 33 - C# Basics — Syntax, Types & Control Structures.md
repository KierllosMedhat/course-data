# Lecture 33 — C# Basics: Syntax, Types & Control Structures

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain the .NET platform: CLR, BCL, SDK, and the `dotnet` CLI
- Create and run console applications with `dotnet new console`
- Distinguish value types from reference types
- Declare variables with explicit types, `var`, `const`, and `readonly`
- Use nullable value types and null-coalescing operators (`??`, `??=`, `?.`)
- Write control flow: `if/else`, `switch` expressions with pattern matching, loops
- Manipulate strings with interpolation, verbatim/raw literals, and `StringBuilder`
- Define simple types using C# 12+ Primary Constructors

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is .NET 10? CLR, SDK, `dotnet` CLI
2. Value types vs reference types
3. Variables, constants, nullable types
4. Control flow: `if/else`, `switch` expressions, loops
5. String manipulation: interpolation, `StringBuilder`
6. Sneak Peek: Primary Constructors (C# 12+)

### Part 2 — Practice / Lab (~90–120 min)
1. Console calculator with switch expressions
2. Number analysis program (prime, factorial)
3. FinanceTracker Project Part 1: Console App

---

## 1. What is .NET 10?

.NET is a free, cross-platform, open-source developer platform for building many kinds of applications.

| Component | Description |
|-----------|-------------|
| **CLR** (Common Language Runtime) | Executes code, manages memory (garbage collection). |
| **BCL** (Base Class Library) | Thousands of pre-built classes. |
| **SDK** | The `dotnet` CLI and compilers. |

### The `dotnet` CLI
```bash
dotnet new console -n MyApp
cd MyApp
dotnet run
```

---

## 2. Value Types vs Reference Types

### Value Types (Stored on the stack)
```csharp
int age = 42;
double price = 19.99;
bool isStudent = true;
```
*If you copy a value type, you get an entirely new copy of the data.*

### Reference Types (Stored on the heap)
```csharp
string name = "Kyrillos";
int[] numbers = { 1, 2, 3 };
```
*If you copy a reference type, you copy the memory address. Both variables point to the same data.*

---

## 3. Variables, Constants & Nullable Types

### Variable Declaration
```csharp
int count = 42;               // Explicit type
var age = 25;                 // Implicit: compiler infers 'int'
var message = "Welcome";      // Implicit: compiler infers 'string'
```
> [!NOTE]
> `var` in C# is **not** like JavaScript's `var`. It is strongly typed at compile time.

### Nullable Types & Operators
Value types cannot be null by default. To make them nullable, add a `?`:
```csharp
int? optionalAge = null;

// Null-coalescing operator
int definiteAge = optionalAge ?? 18;  // If null, use 18

// Null-coalescing assignment
optionalAge ??= 20;                   // Assign 20 ONLY if null
```

---

## 4. Control Flow

### Switch Expressions
Switch **expressions** are concise and produce a value:
```csharp
string letterGrade = score switch
{
    >= 90 => "A",
    >= 80 => "B",
    >= 70 => "C",
    _     => "F"  // _ is the discard (default)
};
```

### Loops
```csharp
// foreach is preferred for iterating collections
string[] fruits = { "apple", "banana" };
foreach (var fruit in fruits)
{
    Console.WriteLine(fruit);
}
```

---

## 5. String Manipulation

### String Interpolation (`$`)
```csharp
string name = "Alice";
string message = $"Hello, {name}.";
```

### Raw String Literals (`"""`)
Perfect for embedding JSON or HTML without escaping quotes!
```csharp
string json = """
{
    "name": "Alice",
    "role": "Admin"
}
""";
```

### `StringBuilder`
Strings in C# are **immutable**. For loops with many concatenations, use `StringBuilder` for performance:
```csharp
using System.Text;

var sb = new StringBuilder();
for (int i = 0; i < 1000; i++)
{
    sb.Append($"Line {i}");
}
string result = sb.ToString();
```

---

## 6. Sneak Peek: Primary Constructors (C# 12+)

Primary constructors allow you to define constructor parameters directly on the class or struct declaration. We'll dive deep into OOP next lecture, but this is incredibly useful for simple data structures!

```csharp
// The parameters Name and Age are available throughout the class body!
public class User(string Name, int Age)
{
    public void Print() => Console.WriteLine($"{Name} is {Age} years old.");
}

var u = new User("Alice", 25);
u.Print();
```

---

## 🧪 Practice Labs

### Lab 1 — Console Calculator (45 min)
1. Read two numbers and an operator from the user using `Console.ReadLine()`.
2. Use a **switch expression** to compute the result.
3. Handle division by zero.
4. Loop with a `while` loop until the user types "exit".

### Lab 2 — Number Analysis (30 min)
1. Ask the user for an integer.
2. Use a `for` loop to compute the factorial of that number.
3. Print the result using string interpolation.

---

## 📝 Assignment: FinanceTracker Project — Part 1

We are beginning our backend project: **FinanceTracker**!
For now, we will build it as a Console Application.

### Requirements
1. Run `dotnet new console -n FinanceTracker`.
2. Create a class `Transaction` using a **Primary Constructor**:
   `public class Transaction(decimal Amount, string Description, string Category)`
3. In `Program.cs`, initialize a `List<Transaction>`.
4. Create a `while` loop that asks the user to input a transaction (amount, description, category).
5. When the user types "done", break the loop.
6. Use a `foreach` loop to print all transactions, and calculate the total balance (sum of all amounts).
7. Print the final balance.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| C# Documentation | https://learn.microsoft.com/en-us/dotnet/csharp/ |
| C# 12 Primary Constructors | https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12#primary-constructors |

---

## 📌 Key Takeaways
- **.NET 10** is the platform; **C# 14** is the language.
- `var` is strongly typed at compile time.
- **Switch expressions** with pattern matching are clean and concise.
- **String interpolation** (`$"..."`) is the standard for formatting.
- **Primary Constructors** reduce boilerplate for class initialization.

---

**Next Lecture:** [Lecture 34 — Object-Oriented Programming in C#](./34%20-%20Object%20Oriented%20Programming%20in%20C%23.md)