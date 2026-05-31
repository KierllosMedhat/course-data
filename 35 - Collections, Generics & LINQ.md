# Lecture 35 — Collections, Generics & LINQ

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Choose the right collection: `List<T>`, `Dictionary<K,V>`, `HashSet<T>`
- Use modern .NET collections like `FrozenDictionary<K,V>` for read-heavy scenarios
- Write LINQ queries using Method Syntax
- Filter, project, sort, group, and aggregate data with LINQ operators
- Understand deferred execution and when to materialise with `ToList()`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Generic Collections
2. Modern Collections: `FrozenDictionary` and `FrozenSet`
3. LINQ Fundamentals
4. Core Operators: `Where`, `Select`, `OrderBy`, `GroupBy`, aggregations
5. Deferred Execution (`IEnumerable` vs `IQueryable`)

### Part 2 — Practice / Lab (~90–120 min)
1. Query a product list with LINQ
2. Search engine with deferred execution
3. FinanceTracker Project Part 3: Collections & LINQ

---

## 1. Generic Collections

### `List<T>` — Dynamic Resizable Array
```csharp
List<string> names = new() { "Alice", "Bob" };
names.Add("Charlie");
names.Remove("Bob");
```

### `Dictionary<TKey, TValue>` — Key-Value Lookups
Dictionaries provide extremely fast (O(1)) lookups!
```csharp
var employees = new Dictionary<int, string>
{
    [101] = "Alice",
    [102] = "Bob"
};

// Safe lookup — avoids Exception if key is missing
if (employees.TryGetValue(105, out string? name))
    Console.WriteLine(name);
```

### `HashSet<T>` — Unique Elements
```csharp
var tags = new HashSet<string> { "csharp", "dotnet" };
tags.Add("csharp"); // Ignored, already exists!
```

---

## 2. Modern Collections: FrozenDictionary & FrozenSet (.NET 8+)

If you have a collection that you build **once** and then read from **frequently** (e.g. application configuration, static lookup tables), you should use `FrozenDictionary` or `FrozenSet`.

```csharp
using System.Collections.Frozen;

// 1. Build a normal Dictionary
var dict = new Dictionary<string, string>
{
    ["RED"] = "#FF0000",
    ["GREEN"] = "#00FF00",
    ["BLUE"] = "#0000FF"
};

// 2. Freeze it!
FrozenDictionary<string, string> frozenColors = dict.ToFrozenDictionary();
```

> [!TIP]
> Freezing takes a little bit of time upfront to perfectly optimize the internal hash tables, but subsequent reads are **significantly faster** than a standard Dictionary.

---

## 3. LINQ — Language Integrated Query

LINQ integrates query capabilities directly into C#. 
We use **Method Syntax (Fluent API)** for modern C# development.

```csharp
var results = products
    .Where(p => p.Price > 100)
    .OrderBy(p => p.Name)
    .Select(p => p.Name);
```

---

## 4. Core LINQ Operators

### Filtering & Projection (`Where`, `Select`)
```csharp
var expensive = products.Where(p => p.Price > 100);
var namesOnly = products.Select(p => p.Name.ToUpper());
```

### Sorting (`OrderBy`, `ThenBy`)
```csharp
var sorted = products
    .OrderBy(p => p.Category)
    .ThenByDescending(p => p.Price);
```

### Grouping (`GroupBy`)
```csharp
var grouped = products.GroupBy(p => p.Category);
foreach (var group in grouped)
{
    Console.WriteLine($"Category: {group.Key} has {group.Count()} items.");
}
```

### Aggregation (`Sum`, `Min`, `Max`, `Average`)
```csharp
decimal totalValue = products.Sum(p => p.Price * p.Stock);
decimal maxPrice = products.Max(p => p.Price);
```

---

## 5. Deferred Execution

> LINQ queries are **not** executed when defined — only when **enumerated** (e.g. inside a `foreach` loop).

```csharp
var query = products.Where(p => p.Price > 100);  // Nothing happens yet!

foreach (var p in query) { Console.WriteLine(p.Name); } // Executed here!

// If you want to force immediate execution and cache the results:
var results = query.ToList(); 
```

> [!WARNING]
> If you `foreach` over a deferred `IEnumerable` multiple times, it executes the query multiple times. Always use `.ToList()` if you plan to read the data more than once.

---

## 🧪 Practice Labs

### Lab 1 — Query Products (30 min)
1. Create a `Product` class with `Name`, `Price`, and `Category`.
2. Create a `List<Product>` with 10 items.
3. Write a LINQ query to find all products under $50, ordered by Name, and print them out.

### Lab 2 — Frozen Config (20 min)
1. Create a `Dictionary<string, decimal>` representing tax rates per state.
2. Convert it to a `FrozenDictionary`.
3. Look up a tax rate using `TryGetValue`.

---

## 📝 Assignment: FinanceTracker Project — Part 3

Let's use LINQ to generate reports for our FinanceTracker!

### Requirements
1. Continue your FinanceTracker Console App.
2. Ensure you have some hardcoded data or can easily add 5-10 transactions.
3. When the user types "report", print out:
   - **Total Income:** Use `.Where()` and `.Sum()` to find all `Income` amounts.
   - **Total Expenses:** Use `.Where()` and `.Sum()` to find all `Expense` amounts.
   - **Expenses by Category:** Use `.Where()` to filter expenses, `.GroupBy(e => e.Category)`, and print the category name and its total sum.
4. **Bonus:** Sort the transactions by `Date` descending before printing the overall list.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| LINQ in C# | https://learn.microsoft.com/en-us/dotnet/csharp/linq/ |
| Frozen Collections | https://learn.microsoft.com/en-us/dotnet/api/system.collections.frozen |

---

## 📌 Key Takeaways
- **`List<T>`** for general-purpose; **`Dictionary<K,V>`** for keyed lookups; **`HashSet<T>`** for uniqueness.
- Use **`FrozenDictionary`** for lookup tables that are built once and read often.
- **LINQ** provides declarative querying: filter, project, sort, group — all composable.
- **Deferred execution** means LINQ queries run only when enumerated. Materialise with `ToList()` when consuming multiple times.

---

**Next Lecture:** [Lecture 36 — Error Handling, File IO & Asynchronous C#](./36%20-%20Error%20Handling,%20File%20IO%20%26%20Asynchronous%20C%23.md)