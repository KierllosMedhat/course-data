# Lecture 37 — C# Basics: Syntax, Types & Control Structures

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain the .NET platform: CLR, BCL, SDK, and the `dotnet` CLI
- Create and run console applications with `dotnet new console`
- Distinguish value types from reference types and explain where they live in memory
- Declare variables with explicit types, `var`, `const`, and `readonly`
- Use nullable value types and the null-handling operators (`??`, `??=`, `?.`)
- Write control flow: `if/else`, `switch` expressions with pattern matching, all loop types
- Manipulate strings with interpolation, verbatim literals, raw literals, and `StringBuilder`
- Define simple types using C# 12+ Primary Constructors

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is .NET? CLR, BCL, SDK, and the `dotnet` CLI
2. Your first C# program — the anatomy of `Program.cs`
3. Value types vs reference types — memory model explained
4. Variables, constants, and `var`
5. Nullable types and null-handling operators
6. Control flow: `if/else`, `switch` expressions, loops
7. String manipulation: interpolation, raw literals, `StringBuilder`
8. Sneak Peek: Primary Constructors (C# 12+)

### Part 2 — Practice / Lab (~90–120 min)
1. Console calculator with switch expressions
2. Number analysis program (prime check, factorial)
3. FinanceTracker Project Part 1: Console App

---

## 1. What is .NET?

**.NET** is a free, open-source, cross-platform developer platform that runs C# code.
- **C#**: The programming language.
- **.NET**: The runtime and library ecosystem that executes C# cross-platform.

### The Three Core Components of .NET

| Component | Full Name | What It Does |
|-----------|-----------|-------------|
| **CLR** | Common Language Runtime | Executes compiled code, manages memory, runs garbage collection |
| **BCL** | Base Class Library | Thousands of pre-built classes for I/O, networking, collections, math, etc. |
| **SDK** | Software Development Kit | The `dotnet` CLI tool, C# compiler, and build system |

### Why Does This Matter?

> [!NOTE]
> When you write a Web API in ASP.NET Core, the CLR runs your application, BCL classes handle HTTP and JSON for you, and the SDK compiles and packages your code. Understanding these layers helps you know where to look when things go wrong.

### The `dotnet` CLI

The `dotnet` command-line tool is your primary way to create, build, run, and test .NET applications.

```bash
# Create a new console application named "MyApp"
# This creates a folder called MyApp with Program.cs inside
dotnet new console -n MyApp

# Navigate into the project folder
cd MyApp

# Run the application
dotnet run

# Build the application (compiles, but doesn't run)
dotnet build

# Run tests (for projects with a test setup)
dotnet test

# Add a NuGet package (like npm install for .NET)
dotnet add package Newtonsoft.Json

# List all available project templates
dotnet new list
```

### Your First C# Program

When you run `dotnet new console`, you get a file called `Program.cs`:

```csharp
// Program.cs
// Modern C# (10+) uses "top-level statements" — you don't need a class or Main() method!
// The compiler generates the Main() method for you automatically.

// Console.WriteLine() prints text followed by a newline character
Console.WriteLine("Hello, World!");

// Console.Write() prints text WITHOUT a newline
Console.Write("Enter your name: ");

// Console.ReadLine() reads a line of text from the user
// It returns a string? (nullable string — could be null if the stream ends)
string? input = Console.ReadLine();

// The null-coalescing operator ?? — if input is null, use "stranger"
string name = input ?? "stranger";

// String interpolation — embed variables inside strings with $"..."
Console.WriteLine($"Hello, {name}! Welcome to C#.");
```

**Output:**
```
Hello, World!
Enter your name: Alice
Hello, Alice! Welcome to C#.
```

---

## 2. Value Types vs Reference Types

### The Critical Difference

- **Value type**: Acts like a photocopy. Copying gives an independent clone.
- **Reference type**: Acts like a shared Google Doc link. Copying shares the reference; changes affect all users.

### Value Types

Value types store their data **directly in the variable**. When you copy a value type, you get a completely independent copy of the data.

Value types live on the **stack** — a region of memory optimized for fast, short-lived data.

```csharp
// ── Common Value Types ──────────────────────────────────────────────

// Integer types (whole numbers)
int count = 42;           // 32-bit integer, range: -2.1B to +2.1B
long bigNumber = 1_000_000_000L;  // 64-bit integer (use _ as thousands separator)
short small = 100;        // 16-bit integer
byte level = 255;         // 8-bit unsigned integer, range: 0–255

// Floating-point types (decimal numbers)
double price = 19.99;     // 64-bit float — default for decimals in C#
float temperature = 98.6f;  // 32-bit float — less precise, needs 'f' suffix
decimal amount = 1299.99m;  // 128-bit fixed-point — use for MONEY (no rounding errors!)

// Boolean
bool isActive = true;     // true or false only

// Character
char grade = 'A';         // A single Unicode character (use single quotes!)

// struct — composite value type
DateTime birthday = new DateTime(1995, 3, 15);  // Year, Month, Day

// Demonstrating the COPY behaviour:
int original = 10;
int copy = original;    // copy gets its OWN copy of the value 10
copy = 99;              // Changing copy does NOT affect original

Console.WriteLine(original);  // 10 — unchanged!
Console.WriteLine(copy);      // 99
```

### Reference Types

Reference types store a **memory address** (reference/pointer) in the variable. The actual data lives on the **heap** — a larger pool of memory managed by the CLR's garbage collector.

```csharp
// ── Common Reference Types ─────────────────────────────────────────

// string — immutable sequence of characters
string name = "Alice";
string greeting = "Hello, World!";

// Arrays — fixed-size ordered collections
int[] numbers = { 10, 20, 30, 40, 50 };
string[] fruits = new string[3];  // Creates array with 3 null slots

// class instances — any object created from a class
var person = new Person { Name = "Alice", Age = 30 };

// Demonstrating the REFERENCE behaviour — the SHARING pitfall:
int[] arrayA = { 1, 2, 3 };
int[] arrayB = arrayA;   // arrayB points to the SAME array in memory!
arrayB[0] = 99;          // Changes the shared data

Console.WriteLine(arrayA[0]);  // 99 — ALSO changed! (this surprises many beginners)
Console.WriteLine(arrayB[0]);  // 99

// To get an independent copy, use Array.Copy() or .ToArray()
int[] arrayC = arrayA.ToArray();  // Creates a new independent array
arrayC[0] = 0;
Console.WriteLine(arrayA[0]);  // 99 — unchanged
Console.WriteLine(arrayC[0]);  // 0
```

### Memory Diagram

```
Stack (value types — fast, short-lived)     Heap (reference types — managed by GC)
─────────────────────────────────────       ─────────────────────────────────────────
│  count = 42               │              │  0x1234: "Hello, World!"               │
│  price = 19.99            │              │  0x5678: Person { Name="Alice", Age=30 }│
│  isActive = true          │              │  0x9ABC: int[] { 1, 2, 3 }             │
│  name = → 0x1234          │ ───────────► │                                         │
│  person = → 0x5678        │ ───────────► │                                         │
│  numbers = → 0x9ABC       │ ───────────► │                                         │
─────────────────────────────────────       ─────────────────────────────────────────
```

### `string` — A Special Reference Type

`string` is a reference type with an important special characteristic: it is **immutable**. Once created, a string's content cannot be changed. Every "modification" creates a new string object:

```csharp
string text = "Hello";
text = text + " World";  // Creates a NEW string "Hello World" in memory
                          // The original "Hello" string is discarded by GC

// This is why + in a loop is slow (creates thousands of objects!)
// For loops with many concatenations, use StringBuilder (covered in Section 7)
```

### Section Recap
- Value types (int, double, bool, char, struct) store data directly — copying creates an independent copy
- Reference types (class, string, array) store a memory address — copying shares the same data
- Stacks hold value types; heaps hold reference type data — the CLR's GC manages heap memory
- `string` is immutable — "changing" a string creates a new one in memory

---

## 3. Variables, Constants & `var`

### Explicit Type Declaration

In C#, you must always declare the type of a variable. The type is checked at compile time — errors are caught before your program runs.

```csharp
// Syntax: type variableName = value;
int quantity = 10;             // integer
double weight = 2.5;           // floating point
string productName = "Laptop"; // text
bool isAvailable = true;       // boolean

// Multiple declarations (same type only)
int x = 1, y = 2, z = 3;

// Declaring without initialization — must assign before use
int score;
score = 100; // Must assign before reading, or the compiler will error
```

### Type Inference with `var`

The `var` keyword tells the compiler to **infer** (figure out) the type from the assigned value. The variable is still strongly typed — `var` just means "compiler, figure out the type for me."

```csharp
var age = 25;              // Compiler infers: int
var price = 9.99;          // Compiler infers: double
var message = "Welcome";   // Compiler infers: string
var items = new List<int>(); // Compiler infers: List<int>

// You cannot change the type after declaration!
var score = 100;   // score is int
score = "hello";   // ❌ COMPILE ERROR: cannot convert string to int

// var is useful for long generic types to avoid repetition:
var employees = new Dictionary<int, List<string>>(); // Much cleaner than:
Dictionary<int, List<string>> employees2 = new Dictionary<int, List<string>>();
```

> [!NOTE]
> `var` in C# is **NOT** like JavaScript's `var`. In JavaScript, `var` is dynamically typed and function-scoped. In C#, `var` is completely statically typed at compile time — it's purely a convenience to avoid repeating type names.

### Constants

A `const` is a value that is fixed at compile time and can never be changed at runtime. The compiler replaces references to the constant with the actual value during compilation.

```csharp
// const: must be assigned at declaration, cannot ever be changed
const double Pi = 3.14159265358979;
const int MaxRetries = 3;
const string AppVersion = "2.1.0";
const int DaysInWeek = 7;

// Using the constants:
double circumference = 2 * Pi * radius;  // Compiler replaces Pi with 3.14159...

// ❌ Cannot reassign:
Pi = 3.14;  // COMPILE ERROR: A const field cannot be assigned to
```

### `readonly` — Runtime Constants

`readonly` fields are assigned once (either at declaration or in the constructor) and cannot be changed afterwards. Unlike `const`, they can be computed at runtime.

```csharp
public class AppConfig
{
    // readonly: set once when the object is created, immutable thereafter
    public readonly DateTime StartTime;
    public readonly string ApplicationId;

    public AppConfig(string appId)
    {
        StartTime = DateTime.Now;      // Computed at runtime
        ApplicationId = appId;          // Passed in at construction
    }

    public void UpdateConfig()
    {
        StartTime = DateTime.Now; // ❌ COMPILE ERROR: readonly field cannot be assigned
    }
}
```

| Feature | `const` | `readonly` |
|---------|---------|-----------|
| Value determined at | Compile time | Runtime (can be computed) |
| Can use expressions? | No (must be literal) | Yes |
| Instance vs static | Always static (implicitly) | Can be instance-level |
| Example | `const int Max = 100;` | `readonly DateTime Start = DateTime.Now;` |

### Section Recap
- C# is statically typed — every variable has a compile-time type
- `var` lets the compiler infer the type — it's still strongly typed, just written more concisely
- `const` is a compile-time constant — value baked in at compile time
- `readonly` is a runtime constant — assigned once (at declaration or in constructor), then immutable

---

## 4. Nullable Types & Null-Handling Operators

### Nullable Value Types

Value types (like `int`, `double`, `bool`) cannot be null by default. Add `?` to allow null:

```csharp
// Value types cannot normally be null:
int age = null;            // ❌ COMPILE ERROR: cannot assign null to int

// Add ? to create a "nullable value type":
int? optionalAge = null;   // ✅ This is fine — int? means "int or null"
double? weight = null;
bool? isVerified = null;

// Check if it has a value before using it:
if (optionalAge.HasValue)
{
    Console.WriteLine($"Age: {optionalAge.Value}"); // .Value gets the actual int
}

// Or use the property .GetValueOrDefault():
int age = optionalAge.GetValueOrDefault(18); // Returns 18 if null, actual value otherwise
```

### Nullable Reference Types (C# 8+)

In modern C#, you can enable "nullable reference types" to get warnings about potential null dereferences:

```csharp
// With nullable reference types enabled (in .csproj: <Nullable>enable</Nullable>):

string nonNullable = "Hello";    // Cannot be null — compiler warns if null assigned
string? nullable = null;         // Can be null — must check before use

// The compiler tracks null-state through your code:
nullable = "Hello";              // Assigned a non-null value
Console.WriteLine(nullable.Length); // ✅ OK — compiler knows it's not null here
```

### The Three Null-Handling Operators

#### Operator 1: Null-Coalescing (`??`)

Returns the left side if not null, otherwise returns the right side:

```csharp
// Syntax: value ?? fallback
// "If value is null, use fallback instead"

string? userName = null;
string displayName = userName ?? "Guest";  // "Guest" because userName is null

string? input = Console.ReadLine();
string processedInput = input ?? string.Empty;  // Use empty string if null

int? savedScore = null;
int score = savedScore ?? 0;  // 0 because savedScore is null

// Chaining ?? operators:
string? a = null, b = null, c = "Found it!";
string result = a ?? b ?? c;  // "Found it!" — takes the first non-null value
```

#### Operator 2: Null-Coalescing Assignment (`??=`)

Assigns a value to a variable **only if it is currently null**:

```csharp
// Syntax: variable ??= defaultValue
// "If variable is null, set it to defaultValue"

int? cachedResult = null;
cachedResult ??= ComputeExpensiveResult(); // Only computes if null

// Equivalent long form:
if (cachedResult == null)
{
    cachedResult = ComputeExpensiveResult();
}

// Real-world example: lazy initialization
string? _connectionString = null;
public string ConnectionString
{
    get
    {
        _connectionString ??= LoadFromConfig(); // Load only on first access
        return _connectionString;
    }
}
```

#### Operator 3: Null-Conditional (`?.` and `?[]`)

Safely accesses a member of an object — if the object is null, the whole expression returns null instead of throwing an exception:

```csharp
// Syntax: object?.Property  or  object?.Method()
// "If object is null, return null. Otherwise, access the member."

string? text = null;
int? length = text?.Length;  // null (no NullReferenceException!)
string? upper = text?.ToUpper();  // null

text = "Hello";
length = text?.Length;   // 5
upper = text?.ToUpper(); // "HELLO"

// Chaining ?. for deeply nested objects:
User? user = GetUser();  // Might return null
string? city = user?.Address?.City?.ToUpper(); // Safely navigates even if user or Address is null

// Null-conditional with arrays/indexers:
string[]? items = null;
string? first = items?[0];  // null instead of IndexOutOfRangeException

// Combining ?. with ??:
string displayCity = user?.Address?.City ?? "Unknown";
// If user, Address, or City is null → "Unknown"
// Otherwise → the actual city name
```

### Common Mistakes with Null

| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| `string name = null;` (with nullable enabled) | Compiler warning | Use `string? name = null;` |
| `Console.ReadLine().ToUpper()` | `NullReferenceException` if user closes stream | `Console.ReadLine()?.ToUpper()` |
| Not checking nullable before using `.Value` | `InvalidOperationException` | Check `HasValue` first or use `??` |
| `int x = someInt ?? 0` where `someInt` is non-nullable | Compile error | `??` only works with nullable types |

### Section Recap
- Value types cannot be null by default — add `?` to make them nullable (`int?`, `bool?`, etc.)
- `??` — null-coalescing: "return this or that fallback if null"
- `??=` — null-coalescing assignment: "assign only if currently null"
- `?.` — null-conditional: "access this member, but return null instead of crashing if the object is null"

---

## 5. Control Flow

### 5.1 `if / else if / else`

```csharp
// Basic if/else — exactly like JavaScript, just with C#'s type system
int temperature = 22;

if (temperature >= 30)
{
    Console.WriteLine("It's hot! 🌞");
}
else if (temperature >= 20)
{
    Console.WriteLine("It's pleasant! 😊");  // This runs — 22 >= 20
}
else if (temperature >= 10)
{
    Console.WriteLine("A bit chilly. 🧥");
}
else
{
    Console.WriteLine("It's cold! 🥶");
}

// Logical operators:
bool isWeekend = true;
bool isHoliday = false;

if (isWeekend || isHoliday)   // || = OR
    Console.WriteLine("No work today!");

if (!isWeekend && !isHoliday) // && = AND, ! = NOT
    Console.WriteLine("Work day.");

// Ternary operator for simple conditions:
string timeOfDay = "morning";
string greeting = timeOfDay == "morning" ? "Good morning!" : "Good day!";
```

### 5.2 `switch` Expressions (Modern C#)

Traditional `switch` statements are verbose. C# 8+ introduced **switch expressions** — concise, expression-based, and they return a value.

```csharp
// Old-style switch statement (verbose, requires break)
switch (dayOfWeek)
{
    case "Monday":
        result = "Start of the work week";
        break;
    case "Friday":
        result = "Almost weekend!";
        break;
    default:
        result = "Regular day";
        break;
}

// ✅ Modern switch EXPRESSION (concise, returns a value directly)
// Syntax: variable switch { pattern => result, ... , _ => default }
string dayName = "Monday";
string message = dayName switch
{
    "Monday"   => "Start of the work week 😴",
    "Friday"   => "Almost weekend! 🎉",
    "Saturday" => "Weekend!",
    "Sunday"   => "Weekend!",
    _          => "Regular work day"  // _ is the "discard" pattern = default
};

// Pattern matching with conditions (guards):
int score = 85;
string grade = score switch
{
    >= 90 => "A",        // Range pattern: 90 or above
    >= 80 => "B",        // 80–89
    >= 70 => "C",        // 70–79
    >= 60 => "D",        // 60–69
    _     => "F"         // Everything else
};
Console.WriteLine($"Score {score} = Grade {grade}"); // "Score 85 = Grade B"

// Type pattern matching — different result based on the type of an object:
object shape = new Circle { Radius = 5.0 };
string description = shape switch
{
    Circle c     => $"Circle with radius {c.Radius}",
    Rectangle r  => $"Rectangle {r.Width}×{r.Height}",
    Triangle t   => $"Triangle with base {t.Base}",
    null         => "No shape",
    _            => "Unknown shape"
};

// Tuple patterns — matching multiple values at once:
int hour = 14;
bool isWorkday = true;
string activity = (hour, isWorkday) switch
{
    ( < 9,  true)  => "Morning commute",
    (>= 9 and <= 17, true) => "Working hours",
    (>= 18, _)     => "Evening time",
    _              => "Weekend or night"
};
```

### 5.3 Loops

```csharp
// ── for loop ─────────────────────────────────────────────────
// Best when you know the exact number of iterations
for (int i = 0; i < 5; i++)
{
    Console.Write($"{i} ");  // Prints: 0 1 2 3 4
}

// Counting down:
for (int i = 10; i >= 1; i--)
{
    Console.Write($"{i} ");  // 10 9 8 7 6 5 4 3 2 1
}

// ── foreach loop ─────────────────────────────────────────────
// The PREFERRED loop in C# — clean, readable, works on any collection
string[] fruits = { "apple", "banana", "cherry" };
foreach (string fruit in fruits)
{
    Console.WriteLine($"I like {fruit}");
}

// foreach with index (using a helper):
foreach ((string fruit, int index) in fruits.Select((f, i) => (f, i)))
{
    Console.WriteLine($"{index + 1}. {fruit}");
}

// ── while loop ───────────────────────────────────────────────
// Best when you don't know how many iterations in advance
int attempts = 0;
string password = "";
while (password != "secret123")
{
    Console.Write("Enter password: ");
    password = Console.ReadLine() ?? "";
    attempts++;

    if (attempts >= 3)
    {
        Console.WriteLine("Too many attempts. Locked out!");
        break;    // Exit the loop immediately
    }
}

// ── do-while loop ────────────────────────────────────────────
// The body executes AT LEAST ONCE before checking the condition
// Good for menus where you want to show the menu before asking for input
string choice;
do
{
    Console.WriteLine("\n1. Add item");
    Console.WriteLine("2. View items");
    Console.WriteLine("3. Exit");
    Console.Write("Choice: ");
    choice = Console.ReadLine() ?? "";

    // Process the choice...
}
while (choice != "3");  // Keep showing menu until user chooses 3

// ── Loop control keywords ────────────────────────────────────
for (int i = 0; i < 10; i++)
{
    if (i == 3) continue;  // Skip this iteration (jump to next i)
    if (i == 7) break;     // Exit the loop entirely
    Console.Write($"{i} "); // Prints: 0 1 2 4 5 6
}
```

### Common Mistakes in Control Flow

| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| Missing `_` in switch expression | Compile warning if not all cases covered | Always include `_ => ...` as a default |
| `switch` expression not covering all enum values | Runtime exception | Cover all cases or use `_` fallback |
| Infinite `while` loop | Program hangs | Ensure the condition can become false, or use `break` |
| Using `==` on objects instead of `.Equals()` | Compares references, not content | Use `.Equals()` for object value comparison |

### Section Recap
- `if/else` checks conditions; ternary `? :` provides concise two-branch logic
- Switch **expressions** return a value directly; the `_` pattern is the default/catch-all
- Pattern matching in switch: range patterns (`>= 90`), type patterns, tuple patterns
- `foreach` is the preferred loop for collections; `for` for index-based; `while`/`do-while` for unknown iterations
- `break` exits a loop; `continue` skips to the next iteration

---

## 6. String Manipulation

### 6.1 String Interpolation (`$"..."`)

The cleanest, most readable way to embed values in strings:

```csharp
string firstName = "Alice";
int age = 30;
decimal salary = 75000.50m;

// Basic interpolation — embed variables with {variableName}
string message = $"Hello, {firstName}! You are {age} years old.";
Console.WriteLine(message); // "Hello, Alice! You are 30 years old."

// Format specifiers inside {}:
Console.WriteLine($"Salary: {salary:C}");         // "Salary: $75,000.50" (currency)
Console.WriteLine($"Amount: {salary:F2}");         // "Amount: 75000.50" (2 decimal places)
Console.WriteLine($"Big number: {1000000:N0}");   // "Big number: 1,000,000" (thousands separator)
Console.WriteLine($"Date: {DateTime.Now:MMM dd, yyyy}"); // "Date: Jun 01, 2026"

// Expressions inside {}:
Console.WriteLine($"Square of 7: {7 * 7}");       // "Square of 7: 49"
Console.WriteLine($"Upper: {firstName.ToUpper()}"); // "Upper: ALICE"

// Multi-line interpolated string (C# 11+ raw string literal + interpolation):
string report = $"""
    Employee Report
    ───────────────
    Name:   {firstName}
    Age:    {age}
    Salary: {salary:C}
    """;
```

### 6.2 Escape Characters and Verbatim Strings

Regular strings treat `\` as an escape character:

```csharp
// Escape sequences in regular strings:
string path = "C:\\Users\\Alice\\Documents";   // \\ = backslash
string tab = "Column1\tColumn2";              // \t = tab
string newLine = "Line 1\nLine 2";            // \n = newline
string quote = "She said \"hello\"";          // \" = double quote

// Verbatim strings (prefix @) — no escape sequences, backslashes are literal
// Perfect for file paths and regex patterns!
string verbatimPath = @"C:\Users\Alice\Documents";  // Much cleaner!
string regex = @"\d+\.\d{2}";                       // No need to escape backslashes

// Multi-line verbatim string — preserves literal newlines
string multiLine = @"Line 1
Line 2
Line 3";
```

### 6.3 Raw String Literals (C# 11+)

Raw string literals use three or more double-quotes and allow you to include any content — including double quotes and backslashes — without escaping:

```csharp
// Perfect for embedding JSON, HTML, SQL, or file paths
string json = """
{
    "name": "Alice",
    "role": "Admin",
    "permissions": ["read", "write", "delete"]
}
""";

string html = """
<div class="container">
    <h1>Welcome</h1>
    <p>No need to escape "quotes"!</p>
</div>
""";

// Interpolated raw string:
string userId = "usr_123";
string apiRequest = $"""
{
    "userId": "{userId}",
    "action": "login"
}
""";
```

### 6.4 Common String Methods

```csharp
string text = "  Hello, World!  ";

// Basic operations:
Console.WriteLine(text.Length);               // 18 (including spaces)
Console.WriteLine(text.Trim());               // "Hello, World!" (removes leading/trailing spaces)
Console.WriteLine(text.TrimStart());          // "Hello, World!  "
Console.WriteLine(text.TrimEnd());            // "  Hello, World!"
Console.WriteLine(text.ToUpper());            // "  HELLO, WORLD!  "
Console.WriteLine(text.ToLower());            // "  hello, world!  "

// Searching:
Console.WriteLine(text.Contains("World"));   // True
Console.WriteLine(text.StartsWith("  He"));  // True
Console.WriteLine(text.IndexOf(","));         // 7 (position of comma)

// Modifying (remember: strings are immutable, these return NEW strings):
Console.WriteLine(text.Replace("World", "C#"));   // "  Hello, C#!  "
Console.WriteLine(text.Trim().Replace(",", ""));   // "Hello World!"

// Splitting and joining:
string csv = "apple,banana,cherry,date";
string[] fruits = csv.Split(',');        // ["apple", "banana", "cherry", "date"]
string joined = string.Join(" | ", fruits); // "apple | banana | cherry | date"

// Checking:
Console.WriteLine(string.IsNullOrEmpty(""));       // True
Console.WriteLine(string.IsNullOrWhiteSpace("  ")); // True

// Substring:
string full = "Hello, World!";
Console.WriteLine(full.Substring(7));       // "World!"
Console.WriteLine(full.Substring(7, 5));    // "World"
Console.WriteLine(full[7..12]);             // "World" (range indexer, C# 8+)
```

### 6.5 `StringBuilder` — For Building Strings in Loops

Since strings are immutable, concatenation in loops creates many temporary objects, severely degrading performance. `StringBuilder` provides an efficient, mutable string buffer:

```csharp
using System.Text; // Required for StringBuilder

// ❌ SLOW — creates 10,000 string objects
string result = "";
for (int i = 0; i < 10_000; i++)
{
    result += $"Item {i}\n";   // Each += creates a NEW string (discards old one)
}

// ✅ FAST — StringBuilder reuses an internal buffer
var sb = new StringBuilder();      // Create a mutable string builder
sb.EnsureCapacity(100_000);         // Optional: pre-allocate if you know approximate size

for (int i = 0; i < 10_000; i++)
{
    sb.Append($"Item {i}");        // Append — no new allocation
    sb.AppendLine();               // Append with newline
}

string final = sb.ToString();      // Convert to string ONCE at the end

// Other StringBuilder methods:
var sb2 = new StringBuilder("Hello");
sb2.Insert(5, ",");                // "Hello,"
sb2.Append(" World!");             // "Hello, World!"
sb2.Replace("World", "C#");        // "Hello, C#!"
sb2.Remove(5, 2);                  // Remove ", " → "Hello C#!"
Console.WriteLine(sb2.Length);     // Current length of the buffer
```

**Performance rule:** Use `StringBuilder` when you concatenate strings in a loop. For simple concatenation of 2–5 strings, `+` or `$"..."` is fine.

### Section Recap
- String interpolation `$"..."` is the modern, clean way to embed values in strings
- Verbatim strings `@"..."` make file paths and regex patterns readable (no escaping needed)
- Raw string literals `"""..."""` handle JSON, HTML, SQL without any escaping
- String methods return new strings — strings are always immutable
- `StringBuilder` is essential for building strings in loops (dramatically faster than `+`)

---

## 7. Primary Constructors (C# 12+)

### What is a Primary Constructor?

Normally, to create a class and store constructor parameters, you define fields, a constructor, and assign parameters. Primary constructors collapse this into a single concise declaration.

```csharp
// ── Traditional approach (verbose) ──────────────────────────────
public class Point
{
    // Step 1: Declare private fields
    private readonly double _x;
    private readonly double _y;

    // Step 2: Declare the constructor
    public Point(double x, double y)
    {
        // Step 3: Assign parameters to fields
        _x = x;
        _y = y;
    }

    // Now use the fields:
    public double DistanceFromOrigin()
        => Math.Sqrt(_x * _x + _y * _y);
}

// ── Primary constructor (concise) ───────────────────────────────
// The (double x, double y) on the class declaration IS the constructor
// Parameters are available throughout the class body directly
public class Point(double x, double y)
{
    // x and y are available here directly — no field needed!
    public double DistanceFromOrigin()
        => Math.Sqrt(x * x + y * y);

    // You can still create properties:
    public double X { get; } = x;  // Initialize from primary constructor param
    public double Y { get; } = y;
}

// Usage:
var p = new Point(3.0, 4.0);
Console.WriteLine(p.DistanceFromOrigin()); // 5.0

// ── More examples ────────────────────────────────────────────────

// Simple data holder — User class
public class User(string name, int age, string email)
{
    // Properties initialized from primary constructor params
    public string Name { get; } = name;
    public int Age { get; } = age;
    public string Email { get; } = email;

    // Method uses params directly
    public void PrintInfo()
        => Console.WriteLine($"{name} ({age}) — {email}");

    // Computed property based on params
    public bool IsAdult => age >= 18;
}

var user = new User("Alice", 25, "alice@example.com");
user.PrintInfo();          // "Alice (25) — alice@example.com"
Console.WriteLine(user.IsAdult); // True

// ── With dependency injection (important for services!) ──────────
// Primary constructors work perfectly for injecting dependencies:
public class ProductService(IProductRepository repo, ILogger<ProductService> logger)
{
    // repo and logger are available throughout all methods:
    public List<Product> GetAll()
    {
        logger.LogInformation("Getting all products");
        return repo.GetAll();
    }
}
```

> [!TIP]
> Primary constructors are especially useful for:
> - Simple data transfer objects (DTOs)
> - Classes with dependency injection (services, repositories)
> - Records (which already use a similar syntax — we'll cover records in Lecture 39)

### Section Recap
- Primary constructors define the constructor parameters directly on the class declaration
- Parameters are available throughout the class body (no need for explicit field assignments)
- They dramatically reduce boilerplate for classes that simply store injected dependencies or data
- Use `{ get; } = paramName;` to create properties initialized from primary constructor parameters

---

## Common Mistakes & How to Avoid Them (Language Level)

### Mistake 1: Integer Division Truncation
```csharp
// ❌ WRONG — integer division truncates, no decimal places
int a = 7, b = 2;
double result = a / b;         // 3.0 (NOT 3.5! Both operands are int → int division)

// ✅ CORRECT — cast one operand to double before dividing
double result2 = (double)a / b; // 3.5

// Or use decimal literals:
double result3 = 7.0 / 2;       // 3.5
```

### Mistake 2: Using `==` for String Comparison
```csharp
// In C#, == works correctly for strings (unlike Java) because C# overloads ==
string a = "hello";
string b = "HELLO".ToLower();
Console.WriteLine(a == b);              // True ✅ (value comparison)

// BUT for case-insensitive comparison, use StringComparison:
bool match = string.Equals(a, b, StringComparison.OrdinalIgnoreCase); // True
```

### Mistake 3: `Console.ReadLine()` Returning Null
```csharp
// ❌ Dangerous — ReadLine() returns string? (nullable string)
string input = Console.ReadLine(); // ⚠️ Warning: possible null assignment

// ✅ Handle the null:
string input = Console.ReadLine() ?? "";   // Use empty string if null
string? input = Console.ReadLine();         // Explicitly mark as nullable
```

### Mistake 4: Integer Overflow
```csharp
// int has a maximum value of ~2.1 billion
int max = int.MaxValue;  // 2,147,483,647
int overflow = max + 1;  // -2,147,483,648 (wraps around — silent bug!)

// Use long for large numbers, or check with checked keyword:
checked
{
    int safe = max + 1;  // Throws OverflowException instead of silently wrapping
}

// Or use long:
long bigResult = (long)max + 1;  // 2,147,483,648
```

---

## 🧪 Practice Labs

### Lab 1 — Console Calculator with Switch Expressions (45 min)
1. Create a new console app: `dotnet new console -n Calculator`.
2. Prompt the user for: first number, operator (+, -, *, /), second number.
3. Parse inputs with `double.Parse()`.
4. Use a **switch expression** to compute the result based on the operator.
5. Handle division by zero — show a friendly error message.
6. Wrap the whole thing in a `while(true)` loop that breaks when the user types "exit" as the first number.

Example interaction:
```
Enter first number (or 'exit'): 10
Enter operator (+, -, *, /): /
Enter second number: 4
Result: 2.5

Enter first number (or 'exit'): exit
Goodbye!
```

### Lab 2 — Number Analysis Program (30 min)
1. Ask the user for a positive integer.
2. Compute and display:
   - Whether the number is **even or odd** (use `% 2`)
   - The **factorial** of the number (use a `for` loop; guard against numbers > 20)
   - Whether the number is **prime** (check divisibility from 2 to √n using `Math.Sqrt()`)
3. Use string interpolation for all output.

---

## 📝 Assignment: FinanceTracker Project — Part 1

We are beginning our backend project: **FinanceTracker** — a console-based personal finance tracker that we'll evolve throughout the C# module into a full Web API!

### Requirements

1. Create the project:
   ```bash
   dotnet new console -n FinanceTracker
   ```

2. Create a `Transaction` class using a **Primary Constructor**:
   ```csharp
   public class Transaction(decimal Amount, string Description, string Category)
   {
       public decimal Amount { get; } = Amount;
       public string Description { get; } = Description;
       public string Category { get; } = Category;
       public DateTime Date { get; } = DateTime.Now;
   }
   ```

3. In `Program.cs`:
   - Initialize a `List<Transaction>` to store transactions.
   - Create a `while` loop that:
     - Asks the user to enter a transaction amount (decimal), description (string), and category (string).
     - Creates a `Transaction` and adds it to the list.
     - Breaks when the user types "done" as the amount.
   - Use `decimal.TryParse()` instead of `decimal.Parse()` to safely handle invalid input.
   - After the loop, use a `foreach` to print all transactions using string interpolation.
   - Calculate and print the total balance (sum of all amounts).

Expected output:
```
Enter amount (or 'done'): 500
Enter description: Salary
Enter category: Income
Transaction added!

Enter amount (or 'done'): -120.50
Enter description: Groceries
Enter category: Food
Transaction added!

Enter amount (or 'done'): done

─── Your Transactions ───
[Income]   +$500.00   Salary
[Food]     -$120.50   Groceries

Total Balance: $379.50
```

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| C# Documentation | https://learn.microsoft.com/en-us/dotnet/csharp/ |
| C# Fundamentals | https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/ |
| C# 12 Primary Constructors | https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12#primary-constructors |
| .NET CLI Reference | https://learn.microsoft.com/en-us/dotnet/core/tools/ |

---

## 📌 Key Takeaways

- **.NET** is the platform; **C#** is the language; the **CLR** runs code; the **BCL** provides pre-built classes
- `dotnet new console -n AppName` creates a new console app; `dotnet run` executes it
- **Value types** (int, double, bool) copy their data; **reference types** (class, string, array) copy a memory address
- `var` is statically inferred type — strongly typed at compile time, not dynamic like JS `var`
- **Nullable operators** prevent `NullReferenceException`: `??` (fallback), `??=` (assign if null), `?.` (safe access)
- **Switch expressions** return values directly; use `_` as the catch-all default pattern
- `string` is immutable — use `StringBuilder` when concatenating in loops
- **Primary Constructors** reduce boilerplate for class initialization

---

**Next Lecture:** [Lecture 38 — Object-Oriented Programming in C#](../38%20-%20Object%20Oriented%20Programming%20in%20C%23/38%20-%20Object%20Oriented%20Programming%20in%20C%23.md)
### 📚 Extensive Tutorials & Resources
- **Source:** [Microsoft Learn: Tour of C# Types and Variables](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/types)
- **Source:** [CodeMaze: Stack and Heap Memory Management in C#](https://code-maze.com/csharp-stack-heap/)
- **Source:** [Microsoft Learn: Nullable Reference Types and Operators](https://learn.microsoft.com/en-us/dotnet/csharp/nullable-references)
- **Source:** [CodeMaze: Switch Expressions in C#](https://code-maze.com/csharp-switch-expression/)
- **Source:** [DotNetTutorials: StringBuilder Class in C# with Examples](https://dotnettutorials.net/lesson/stringbuilder-class-in-csharp/)
- **Source:** [C# Corner: Primary Constructors in C# 12](https://www.c-sharpcorner.com/article/understanding-primary-constructors-in-c-sharp-12/)
- **Source:** [FreeCodeCamp: Value Types vs Reference Types in C# Explained](https://www.freecodecamp.org/news/value-types-and-reference-types-in-c-sharp-explained/)
