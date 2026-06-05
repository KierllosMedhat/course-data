# Lecture 35 — Collections, Generics & LINQ

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 1. 🛑 Prerequisites

Before diving into this lecture, you should be comfortable with:
- **C# Basics:** Variables, loops (`for`, `foreach`, `while`), conditional statements, and methods.
- **Object-Oriented Programming (OOP):** Classes, objects, properties, and constructors.
- **Interfaces & Inheritance:** Basic understanding of what an interface is (e.g., `IEnumerable`, `IComparable`) and how classes implement them.
- **Arrays:** Knowing how to declare and use basic arrays in C#.

---

## 2. 🎯 Objectives

By the end of this lecture, you will be able to:
- **Distinguish** between `Array`, `List<T>`, `Dictionary<TKey, TValue>`, `HashSet<T>`, and `Queue<T>` / `Stack<T>` — and know exactly when to use each.
- **Understand** why Generics exist and how to write your own generic classes and methods to avoid code duplication and ensure type safety.
- **Apply** generic constraints (e.g., `where T : class`, `where T : new()`) to restrict type parameters.
- **Master** the 15 most essential LINQ operators using both method syntax and query syntax.
- **Chain** LINQ operators together to build powerful, readable, and efficient data processing pipelines.
- **Grasp** the concept of deferred execution and understand when LINQ queries actually run in memory.

---

## 3. 📋 Agenda

1. **Prerequisites & Objectives** (5 min)
2. **Deep Dive: Collections & Generics** (45 min)
   - The limitations of basic Arrays
   - `List<T>`: The workhorse collection
   - `Dictionary<TKey, TValue>`: Instant key-based lookups
   - `HashSet<T>`: Uniqueness guaranteed
   - `Queue<T>` and `Stack<T>`: Sequential access patterns
   - Generics: Write once, use with any type safely
3. **Deep Dive: Language Integrated Query (LINQ)** (45 min)
   - What is LINQ and why is it revolutionary?
   - Essential LINQ Operators (`Where`, `Select`, `OrderBy`, etc.)
   - Method Syntax vs. Query Syntax
   - Deferred Execution explained
4. **Think Like a Dev** (10 min)
5. **Before/After** (10 min)
6. **Common Mistakes** (10 min)
7. **Labs & Practical Exercises** (40 min)
8. **Interview Prep** (10 min)
9. **Cheat Sheet** (5 min)
10. **Key Takeaways** (5 min)

---

## 4. 🔍 Deep Dive

### 4.1 Why Collections Exist — Arrays Aren't Enough

An array is the simplest way to store multiple items in memory:

```csharp
string[] fruits = { "apple", "banana", "cherry" };
```

**The Problem with Arrays:**
Arrays have a critical limitation: **they are fixed in size**. Once you create an array with 3 slots, you cannot add a 4th item without creating an entirely new, larger array and manually copying everything over.

```csharp
// ❌ Adding to an array is painful and inefficient:
string[] fruits = { "apple", "banana", "cherry" };
string[] newFruits = new string[4];
Array.Copy(fruits, newFruits, fruits.Length);
newFruits[3] = "date";
```

**The Solution:** Collections like `List<T>`.
A `List<T>` automatically resizes itself under the hood when it gets full, managing all the copying for you.

```csharp
// ✅ With List<T>, adding items is trivial:
var fruitList = new List<string> { "apple", "banana", "cherry" };
fruitList.Add("date"); // Done!
```

**Real-world analogy:** An array is like a physical filing cabinet with exactly 10 drawers. If you need an 11th drawer, you must buy an entirely new, larger cabinet and move everything over. A `List<T>` is like a digital filing system that allocates new space as you need it.

---

### 4.2 `List<T>` — Your Workhorse Collection

`List<T>` is the most commonly used collection in C#. It is a dynamically-sized array that automatically grows. The `<T>` stands for **Type**, meaning it is a generic collection.

#### Creating and Adding Items
```csharp
// Empty list
var names = new List<string>();

// List with initial items
var scores = new List<int> { 95, 87, 73 };

// Adding items
names.Add("Alice");
names.AddRange(new[] { "Bob", "Charlie", "Diana" });
names.Insert(1, "Adam"); // Inserts "Adam" at index 1
```

#### Reading and Searching
```csharp
Console.WriteLine(names.Count);    // 5 items
Console.WriteLine(names[0]);       // "Alice"
Console.WriteLine(names[^1]);      // "Diana" (last item using ^1 syntax)

bool hasAlice = names.Contains("Alice");
string? found = names.Find(n => n.StartsWith("D")); // "Diana"
```

#### Removing and Sorting
```csharp
names.Remove("Charlie");              // By value
names.RemoveAt(0);                    // By index
names.RemoveAll(n => n.Length < 4);  // By condition
names.Clear();                        // Removes all items

var numbers = new List<int> { 5, 2, 8, 1 };
numbers.Sort();                        // Ascending: [1, 2, 5, 8]
numbers.Reverse();                     // Reverses order: [8, 5, 2, 1]
```

---

### 4.3 `Dictionary<TKey, TValue>` — Instant Lookup by Key

A dictionary stores **key-value pairs** and provides **O(1) average time lookups**. This means it can find a value by its key instantly, regardless of how large the dictionary gets. It achieves this using hash tables.

**Real-world analogy:** Finding a word in a real dictionary. You don't read from page 1; you jump straight to the starting letter.

#### Creating and Using Dictionaries
```csharp
var ageByName = new Dictionary<string, int>
{
    { "Alice", 30 },
    { "Bob", 25 }
};

// Alternative index initializer
var ageByName2 = new Dictionary<string, int>
{
    ["Alice"] = 30,
    ["Bob"] = 25
};

// Adding and Updating
ageByName["Diana"] = 28;           // Adds new key
ageByName["Alice"] = 31;           // Updates existing key
// ageByName.Add("Bob", 26);       // 💥 Throws exception if key already exists!
```

#### Safe Reading Practices
```csharp
// ❌ Dangerous: Throws KeyNotFoundException if key is missing
// int age = ageByName["Frank"]; 

// ✅ Safe: TryGetValue
if (ageByName.TryGetValue("Frank", out int frankAge))
{
    Console.WriteLine($"Frank is {frankAge}");
}

// ✅ Safe: GetValueOrDefault
int unknownAge = ageByName.GetValueOrDefault("Frank", 0); // Returns 0 if missing
```

#### Iterating over a Dictionary
```csharp
foreach (KeyValuePair<string, int> entry in ageByName)
{
    Console.WriteLine($"{entry.Key}: {entry.Value}");
}

// Using deconstruction (C# 7+)
foreach ((string name, int age) in ageByName)
{
    Console.WriteLine($"{name}: {age}");
}
```

---

### 4.4 `HashSet<T>` — Uniqueness Guaranteed

A `HashSet<T>` stores an **unordered collection of unique items**. Adding a duplicate simply does nothing (returns false). Lookups are extremely fast, O(1), just like dictionaries.

**Use cases:** Tracking seen items, deduplication, fast membership testing.

```csharp
var tags = new HashSet<string> { "csharp", "dotnet" };

bool added1 = tags.Add("angular"); // True
bool added2 = tags.Add("csharp");  // False (ignored)

// Set Operations
var setA = new HashSet<int> { 1, 2, 3 };
var setB = new HashSet<int> { 3, 4, 5 };

setA.UnionWith(setB);      // {1, 2, 3, 4, 5}
setA.IntersectWith(setB);  // {3, 4, 5}
setA.ExceptWith(setB);     // {1, 2}
```

---

### 4.5 `Queue<T>` and `Stack<T>`

#### `Queue<T>` (FIFO - First In, First Out)
Like a real waiting line: the first to arrive is the first to be processed.
**Use cases:** Task queues, breadth-first search, print spoolers.

```csharp
var queue = new Queue<string>();
queue.Enqueue("Task 1");
queue.Enqueue("Task 2");

Console.WriteLine(queue.Peek());    // "Task 1" (looks at front)
string next = queue.Dequeue();      // "Task 1" (removes from front)
```

#### `Stack<T>` (LIFO - Last In, First Out)
Like a stack of plates: the last plate put on top is the first one taken off.
**Use cases:** Undo/redo history, depth-first search, browser back button.

```csharp
var stack = new Stack<string>();
stack.Push("Page 1");
stack.Push("Page 2");

Console.WriteLine(stack.Peek());    // "Page 2" (looks at top)
string last = stack.Pop();          // "Page 2" (removes from top)
```

---

### 4.6 Generics — Write Once, Use with Any Type

#### Why Generics?
Before Generics (C# 1.0), collections used `object`, which led to poor performance (due to boxing/unboxing) and lacked type safety (you could accidentally mix strings and integers). Generics introduced `<T>`, a placeholder for the actual type.

#### Creating Generic Classes
```csharp
// T is a type parameter
public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? ErrorMessage { get; }

    private Result(bool success, T? value, string? error)
    {
        IsSuccess = success;
        Value = value;
        ErrorMessage = error;
    }

    public static Result<T> Success(T value) => new(true, value, null);
    public static Result<T> Failure(string error) => new(false, default, error);
}

// Usage
Result<int> score = Result<int>.Success(100);
Result<string> name = Result<string>.Failure("Not found");
```

#### Generic Methods
Methods can infer the generic type from arguments.

```csharp
public static void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}

int x = 5, y = 10;
Swap(ref x, ref y); // Infers T as int
```

#### Generic Constraints
You can enforce rules on what `T` can be using the `where` keyword.

```csharp
// T must be a reference type (class)
public class Repository<T> where T : class { }

// T must have a parameterless constructor
public T CreateInstance<T>() where T : new() => new T();

// T must implement an interface
public T GetMax<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) > 0 ? a : b;
}
```


### 4.7 LINQ — Language Integrated Query

**What is LINQ?**
LINQ is a set of extension methods on `IEnumerable<T>` that allows you to query and manipulate data in a declarative, functional style. Instead of writing complex `foreach` loops with `if` statements, you declare *what* you want to achieve.

**Real-world analogy:** LINQ is to C# collections what SQL is to databases.

---

### 4.8 Key LINQ Operators

Let's use this sample data for the examples:
```csharp
public record Product(int Id, string Name, string Category, decimal Price, int Stock);

var products = new List<Product>
{
    new(1, "Laptop", "Electronics", 999.99m, 10),
    new(2, "Mouse", "Electronics", 25.50m, 50),
    new(3, "Desk", "Furniture", 150.00m, 5),
    new(4, "Chair", "Furniture", 85.00m, 20),
    new(5, "Keyboard", "Electronics", 45.00m, 30)
};
```

#### Filtering (`Where`)
Returns only items matching a condition.
```csharp
var electronics = products.Where(p => p.Category == "Electronics");
var budgetItems = products.Where(p => p.Price < 50);
```

#### Projection (`Select`)
Transforms each item into a new shape.
```csharp
IEnumerable<string> names = products.Select(p => p.Name);

// Creating an anonymous object
var summaries = products.Select(p => new { p.Name, p.Price });
```

#### Sorting (`OrderBy`, `OrderByDescending`, `ThenBy`)
```csharp
var byPrice = products.OrderBy(p => p.Price);
var byCategoryThenPrice = products
    .OrderBy(p => p.Category)
    .ThenByDescending(p => p.Price);
```

#### Finding (`First`, `FirstOrDefault`, `Single`, `SingleOrDefault`)
```csharp
// Throws exception if not found
Product firstElec = products.First(p => p.Category == "Electronics");

// Returns null if not found (safer)
Product? cheap = products.FirstOrDefault(p => p.Price < 10);

// Throws exception if more than 1 item matches
Product unique = products.Single(p => p.Id == 1);
```

#### Aggregation (`Count`, `Sum`, `Min`, `Max`, `Average`)
```csharp
int count = products.Count();
decimal totalStockValue = products.Sum(p => p.Price * p.Stock);
decimal avgPrice = products.Average(p => p.Price);
```

#### Quantifiers (`Any`, `All`)
```csharp
bool hasExpensive = products.Any(p => p.Price > 1000); // False
bool allHaveStock = products.All(p => p.Stock > 0);    // True
```

#### Grouping (`GroupBy`)
Groups items by a specific key.
```csharp
var byCategory = products.GroupBy(p => p.Category);

foreach (var group in byCategory)
{
    Console.WriteLine($"Category: {group.Key}");
    foreach (var p in group)
    {
        Console.WriteLine($" - {p.Name}");
    }
}
```

---

### 4.9 Method Syntax vs. Query Syntax

LINQ can be written in two ways. **Method syntax** uses lambda expressions (most common in C#). **Query syntax** looks like SQL.

**Method Syntax:**
```csharp
var result = products
    .Where(p => p.Price < 100)
    .OrderBy(p => p.Name)
    .Select(p => p.Name);
```

**Query Syntax:**
```csharp
var result = from p in products
             where p.Price < 100
             orderby p.Name
             select p.Name;
```
*Tip:* Both compile to the exact same code. Method syntax is preferred for simple queries, while Query syntax can be cleaner for complex joins.

---

### 4.10 Deferred Execution

LINQ queries do **not** execute immediately when they are defined. They are only executed when you iterate over them (e.g., using `foreach` or calling `.ToList()`).

```csharp
var query = products.Where(p => p.Price > 50); // NOT EXECUTED YET

products.Add(new Product(6, "Monitor", "Electronics", 200m, 15));

// Now it executes. The new Monitor WILL be included!
foreach (var item in query) 
{
    Console.WriteLine(item.Name);
}
```

**To force immediate execution:** Call `.ToList()`, `.ToArray()`, or `.ToDictionary()`.

```csharp
// Snapshot created instantly
var list = products.Where(p => p.Price > 50).ToList(); 
```

---



### 4.11 Advanced LINQ Operators

While `Where` and `Select` are your daily drivers, C# provides powerful operators for complex data transformations. 

#### `SelectMany` (Flattening)
When each item in your collection contains a sub-collection, and you want a single flat list of all sub-items, `SelectMany` is the tool.

```csharp
public record Order(int Id, List<string> Items);

var orders = new List<Order>
{
    new(1, new List<string> { "Apple", "Banana" }),
    new(2, new List<string> { "Cherry", "Date", "Eggplant" })
};

// Select returns a List of Lists (List<List<string>>)
var nested = orders.Select(o => o.Items); 

// SelectMany flattens it into a single List<string>
var flat = orders.SelectMany(o => o.Items);
// Result: ["Apple", "Banana", "Cherry", "Date", "Eggplant"]

// You can also project the parent and child together:
var orderDetails = orders.SelectMany(
    order => order.Items,
    (order, item) => new { order.Id, ItemName = item }
);
```

#### `Join`
Combines two collections based on a matching key, similar to an SQL `INNER JOIN`.

```csharp
public record Category(int Id, string Name);
var categories = new List<Category>
{
    new(1, "Electronics"),
    new(2, "Furniture")
};

var productCategories = products.Join(
    categories,
    p => p.Category,        // Outer key selector
    c => c.Name,            // Inner key selector
    (p, c) => new { p.Name, CategoryId = c.Id } // Result selector
);
```

#### `Chunk` (.NET 6+)
Splits a collection into smaller collections of a specified size. Extremely useful for batch processing or pagination.

```csharp
var allProducts = Enumerable.Range(1, 100).Select(i => $"Product {i}");
var batches = allProducts.Chunk(10); // Returns 10 arrays, each with 10 items

foreach (var batch in batches)
{
    // Process batch of 10 items...
}
```

#### `Zip`
Combines two collections by pairing items at the same index.

```csharp
var numbers = new[] { 1, 2, 3 };
var letters = new[] { "A", "B", "C" };

var zipped = numbers.Zip(letters, (n, l) => $"{n}{l}");
// Result: ["1A", "2B", "3C"]
```

#### Set Operations (`Distinct`, `Union`, `Intersect`, `Except`)
LINQ can perform set operations natively on any collection.

```csharp
var list1 = new[] { 1, 2, 2, 3, 4 };
var list2 = new[] { 3, 4, 5, 6 };

var unique = list1.Distinct();          // [1, 2, 3, 4]
var combined = list1.Union(list2);      // [1, 2, 3, 4, 5, 6] (Distinct by default)
var common = list1.Intersect(list2);    // [3, 4]
var difference = list1.Except(list2);   // [1, 2]
```

### 4.12 Advanced Generics: Covariance and Contravariance

In C#, you might wonder why you can't assign a `List<string>` to a `List<object>`. This is because standard generic types are **invariant**. 
However, interfaces like `IEnumerable<T>` are **covariant** (using the `out` keyword: `IEnumerable<out T>`), which allows you to assign a collection of a derived type to a collection of a base type.

```csharp
// Invariance (Classes)
List<string> strings = new List<string> { "Hello" };
// List<object> objects = strings; // ❌ Compile Error!

// Covariance (Interfaces with 'out')
IEnumerable<string> moreStrings = new List<string> { "Hello" };
IEnumerable<object> moreObjects = moreStrings; // ✅ Works!
```

Contravariance (using the `in` keyword) is the opposite: it allows a generic interface to accept a base type where a derived type is expected. This is most common with delegates like `Action<in T>` or `IComparer<in T>`.

```csharp
Action<object> printObject = obj => Console.WriteLine(obj);
Action<string> printString = printObject; // ✅ Contravariance!
printString("Hello World");
```

---

### 4.13 Memory & Performance: Big-O Notation for Collections

Understanding the performance characteristics of collections is critical for building scalable applications.

| Collection / Operation | Add | Remove | Contains / Lookup | Memory Overhead |
|------------------------|-----|--------|-------------------|-----------------|
| `List<T>` | O(1) avg* | O(N) | O(N) | Low |
| `Dictionary<K,V>` | O(1) avg | O(1) avg | O(1) avg | High |
| `HashSet<T>` | O(1) avg | O(1) avg | O(1) avg | High |
| `Queue<T>` / `Stack<T>`| O(1) | O(1) | O(N) | Low |
| `LinkedList<T>` | O(1)** | O(1)** | O(N) | Medium |

*\* List additions are O(1) unless the internal array needs to resize, which is O(N). However, the amortized cost is O(1).*
*\*\* LinkedList operations are O(1) only if you already have the node reference.*


## 5. 🧠 Think Like a Dev

When choosing a collection or writing a LINQ query, ask yourself:

1. **What is my access pattern?**
   - Need index-based access? Use `List<T>`.
   - Need key-based instant lookups? Use `Dictionary<K,V>`.
   - Need to prevent duplicates? Use `HashSet<T>`.
2. **Am I iterating too many times?**
   - Avoid calling `.ToList()` in the middle of a LINQ chain unless necessary. Defer execution as long as possible.
3. **Is this LINQ query readable?**
   - LINQ is great, but a 15-line chained LINQ statement might be harder to read than a well-named method or a simple `foreach` loop. Optimize for readability first.
4. **Is Performance Critical?**
   - LINQ adds slight overhead compared to standard `for`/`foreach` loops. In 95% of business applications, LINQ is preferred for readability. In high-performance hot paths (like game engines), loops might be necessary.

---

## 6. 🔄 Before / After

### Example 1: Filtering and Sorting

**Before (Imperative C# - no LINQ):**
```csharp
List<Product> budgetProducts = new List<Product>();
foreach (var p in products)
{
    if (p.Price < 50)
    {
        budgetProducts.Add(p);
    }
}
budgetProducts.Sort((a, b) => a.Price.CompareTo(b.Price));
```

**After (Declarative C# - with LINQ):**
```csharp
var budgetProducts = products
    .Where(p => p.Price < 50)
    .OrderBy(p => p.Price)
    .ToList();
```

### Example 2: Type Safety

**Before (C# 1.0 - No Generics):**
```csharp
ArrayList list = new ArrayList();
list.Add("Hello");
list.Add(5); // No compile error!

string s = (string)list[0]; // Requires casting
string s2 = (string)list[1]; // 💥 Runtime exception!
```

**After (With Generics):**
```csharp
List<string> list = new List<string>();
list.Add("Hello");
// list.Add(5); // ❌ Compile error! Type safety.

string s = list[0]; // No casting required
```


---

## 7. ⚠️ Common Mistakes

1. **Modifying a collection while iterating it.**
   - *Mistake:* `foreach (var item in list) { if (item.IsBad) list.Remove(item); }` -> Throws `InvalidOperationException`.
   - *Fix:* Use `list.RemoveAll(item => item.IsBad);` or iterate backwards using a `for` loop.

2. **Using `.Count() > 0` instead of `.Any()`.**
   - *Mistake:* `if (myList.Count() > 0)` forces LINQ to iterate the entire collection just to count items.
   - *Fix:* Use `if (myList.Any())`, which stops checking the moment it finds the first item (O(1) vs O(N)).

3. **Using `.Single()` instead of `.FirstOrDefault()`.**
   - *Mistake:* Using `.Single()` on a list where zero items match or multiple items match will crash your app.
   - *Fix:* Only use `.Single()` when you are mathematically certain exactly one item exists. Otherwise, use `.FirstOrDefault()`.

4. **Iterating a query multiple times without `.ToList()`.**
   - *Mistake:* Executing a database query multiple times because you forgot deferred execution.
   - *Fix:* Call `.ToList()` to cache the results in memory if you plan to iterate over the data more than once.

5. **Dictionary KeyNotFoundException.**
   - *Mistake:* `var value = myDict["MissingKey"];` -> Crashes app.
   - *Fix:* Always use `myDict.TryGetValue("MissingKey", out var value)` or `myDict.ContainsKey()`.

---

## 8. 🧪 Labs

### Lab 1 — Collection Operations Challenge
Given this list of students:
```csharp
var students = new List<(string Name, string Major, double GPA, int Year)>
{
    ("Alice",   "Computer Science", 3.9, 3),
    ("Bob",     "Mathematics",      3.2, 2),
    ("Charlie", "Computer Science", 3.7, 4),
    ("Diana",   "Physics",          3.5, 1),
    ("Eve",     "Computer Science", 2.9, 2),
    ("Frank",   "Mathematics",      3.8, 3),
};
```

**Tasks (Write LINQ queries for the following):**
1. Find all "Computer Science" students with GPA ≥ 3.5, ordered by GPA descending.
2. Calculate the average GPA of all students.
3. Determine if *all* Year 4 students have a GPA above 3.5.
4. **Challenge:** Create a dictionary grouping students by Major.

### Lab 2 — Generic `Result<T>` Class
1. Implement the `Result<T>` generic class from section 4.6.
2. Create a `UserService` class with a method `Result<User> GetUserById(int id)`.
3. In `Program.cs`, call the method and cleanly handle both the success (print user name) and failure (print error message) cases without throwing exceptions.

---



### Lab 3 — FinanceTracker Project: LINQ Reporting

*This lab builds upon the FinanceTracker console application from previous lectures.*

**Scenario:** 
Users have entered their income and expenses for the month. You now have a `List<Transaction>` where `Transaction` has `Amount`, `Date`, `Category`, and `Type` (Income or Expense).
You need to generate an end-of-month financial report using LINQ.

**Requirements:**
1. **Total Balance:** Calculate the total balance (Income - Expenses).
2. **Top Expenses:** Find the top 3 highest expenses.
3. **Category Summary:** Group the expenses by `Category` and calculate the total spent in each category, ordered by the highest spend.

**Starter Code:**
```csharp
public enum TransactionType { Income, Expense }
public record Transaction(decimal Amount, DateTime Date, string Category, TransactionType Type);

var transactions = new List<Transaction>
{
    new(5000, new DateTime(2023, 10, 1), "Salary", TransactionType.Income),
    new(1500, new DateTime(2023, 10, 2), "Rent", TransactionType.Expense),
    new(200,  new DateTime(2023, 10, 5), "Groceries", TransactionType.Expense),
    new(100,  new DateTime(2023, 10, 8), "Utilities", TransactionType.Expense),
    new(300,  new DateTime(2023, 10, 12), "Groceries", TransactionType.Expense),
    new(50,   new DateTime(2023, 10, 15), "Entertainment", TransactionType.Expense),
    new(200,  new DateTime(2023, 10, 20), "Side Hustle", TransactionType.Income)
};
```

**Implementation Guide:**

*Task 1: Balance*
```csharp
var totalIncome = transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
var totalExpense = transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);
var balance = totalIncome - totalExpense;
Console.WriteLine($"Total Balance: {balance:C}");
```

*Task 2: Top 3 Expenses*
```csharp
var topExpenses = transactions
    .Where(t => t.Type == TransactionType.Expense)
    .OrderByDescending(t => t.Amount)
    .Take(3);

Console.WriteLine("Top 3 Expenses:");
foreach (var t in topExpenses)
{
    Console.WriteLine($"- {t.Category}: {t.Amount:C}");
}
```

*Task 3: Category Summary*
```csharp
var expenseSummary = transactions
    .Where(t => t.Type == TransactionType.Expense)
    .GroupBy(t => t.Category)
    .Select(group => new 
    { 
        Category = group.Key, 
        Total = group.Sum(t => t.Amount) 
    })
    .OrderByDescending(x => x.Total);

Console.WriteLine("Expense Summary by Category:");
foreach (var item in expenseSummary)
{
    Console.WriteLine($"- {item.Category}: {item.Total:C}");
}
```

---



## 9. 💼 Interview Prep

**Q: What is the difference between `IEnumerable<T>` and `IQueryable<T>`?**
**A:** Both are interfaces for querying collections. `IEnumerable<T>` executes queries in-memory (LINQ to Objects). `IQueryable<T>` translates queries into SQL and executes them on the database server (LINQ to SQL / Entity Framework). Using `IEnumerable` for a DB query fetches all data into memory *before* filtering.

**Q: What is Deferred Execution in LINQ?**
**A:** It means the query does not actually run when you define it. The execution is deferred until you iterate over the results (e.g., using a `foreach` loop or calling `.ToList()`).

**Q: How does a `Dictionary` work internally?**
**A:** It uses an array combined with a hashing algorithm. When you add a key, it computes a hash code, determines an index, and places the value there. This allows for near O(1) time complexity for lookups.

**Q: When would you use a `HashSet` over a `List`?**
**A:** When you need to ensure all elements are unique, or when you need extremely fast `Contains()` checks. `List.Contains()` is O(N) (searches item by item), whereas `HashSet.Contains()` is O(1) (instant).

---



### Additional Interview Questions

**Q: What is the `yield return` keyword used for?**
**A:** `yield return` is used to create a custom iterator (an `IEnumerable<T>`). Instead of building an entire list in memory and returning it, `yield return` returns one item at a time, pausing the method's execution until the caller requests the next item. This is the underlying mechanism that powers deferred execution in LINQ.

**Q: Explain the difference between `.ToDictionary()` and `.ToLookup()`.**
**A:** `.ToDictionary()` maps a key to a **single value**. If there are duplicate keys in the source collection, it throws an exception. 
`.ToLookup()` maps a key to a **collection of values**. It allows duplicate keys and essentially creates a grouped dictionary (`ILookup<TKey, TElement>`).

**Q: Why shouldn't you use `ArrayList` in modern C#?**
**A:** `ArrayList` is a legacy collection from C# 1.0 that stores everything as an `object`. It lacks type safety (you can mix strings, ints, and objects), and it suffers from poor performance due to boxing (converting value types to reference types) and unboxing (converting them back). Always use the generic `List<T>` instead.

**Q: How does `Dictionary` handle hash collisions?**
**A:** A hash collision occurs when two different keys generate the same hash code. C# Dictionaries handle this using "chaining" (specifically, linked lists within the bucket). When a collision happens, the dictionary checks the equality of the keys in that bucket using `.Equals()` to find the correct value. This is why it's critical to override `GetHashCode()` and `Equals()` together if you use custom objects as dictionary keys.


## 10. 📄 Cheat Sheet

### Essential Collections
| Collection | Strengths | Weaknesses | Best For |
|------------|-----------|------------|----------|
| `List<T>` | Fast index access, ordered | Slow inserts/deletes in the middle | Default collection choice |
| `Dictionary<K,V>` | Instant O(1) lookups by key | Uses more memory, unordered | Key-value mapping, caching |
| `HashSet<T>` | Fast O(1) lookups, unique | Unordered, no index access | Deduplication, fast membership checks |
| `Queue<T>` | Fast FIFO processing | Only access front/back | Task processing, messaging queues |
| `Stack<T>` | Fast LIFO processing | Only access top | Undo operations, depth-first search |

### Essential LINQ Operators
| Purpose | Method | Example |
|---------|--------|---------|
| Filtering | `.Where()` | `list.Where(x => x > 5)` |
| Transformation | `.Select()` | `list.Select(x => x.Name)` |
| Sorting | `.OrderBy()` | `list.OrderBy(x => x.Price)` |
| Find First | `.FirstOrDefault()` | `list.FirstOrDefault(x => x.Id == 1)` |
| Check Condition | `.Any()` / `.All()` | `list.Any(x => x.IsActive)` |
| Aggregate | `.Count()`, `.Sum()` | `list.Sum(x => x.Price)` |

---

## 11. 📌 Key Takeaways

- Arrays are fixed in size; **`List<T>`** is your go-to dynamically sized collection.
- Use **`Dictionary<TKey, TValue>`** when you need instant lookups based on a unique identifier.
- Use **`HashSet<T>`** to effortlessly ensure uniqueness and check for membership.
- **Generics** (`<T>`) allow you to write reusable, type-safe code that works with any data type while avoiding the performance hits of boxing/unboxing.
- Use **generic constraints** (`where T : class`, etc.) to enforce rules on your type parameters.
- **LINQ** transforms how you work with data, replacing verbose loops with clean, declarative pipelines.
- Remember **Deferred Execution**: LINQ queries define *what* to do, but they don't do it until you call `.ToList()` or iterate over the result.

---

**Next Lecture:** [Lecture 36 — Delegates, Events, Async/Await & Exception Handling](./36%20-%20Delegates,%20Events,%20Async%20%26%20Exception%20Handling.md)
