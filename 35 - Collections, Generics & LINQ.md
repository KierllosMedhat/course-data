# Lecture 35 — Collections, Generics & LINQ

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Distinguish between `Array`, `List<T>`, `Dictionary<TKey, TValue>`, `HashSet<T>`, and `Queue<T>` — and know when to use each
- Understand why generics exist and how to write your own generic class and method
- Apply generic constraints (`where T : class`, `where T : IComparable<T>`, etc.)
- Master the 15 most essential LINQ operators using both method syntax and query syntax
- Chain LINQ operators to build powerful, readable data pipelines
- Understand deferred execution and when LINQ actually runs

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Why collections exist — arrays aren't enough
2. `List<T>` — your workhorse collection
3. `Dictionary<TKey, TValue>` — instant lookup by key
4. `HashSet<T>` — uniqueness guaranteed
5. `Queue<T>` and `Stack<T>` — ordered processing
6. Generics — write once, use with any type
7. LINQ — Language Integrated Query
8. Method syntax vs Query syntax
9. Deferred execution explained

### Part 2 — Practice / Lab (~90–120 min)
1. Collection operations challenge
2. Build a generic `Result<T>` class
3. FinanceTracker Project Part 3: LINQ Reporting

---

## 1. Why Collections Exist — Arrays Aren't Enough

### The Problem with Arrays

An array is the simplest way to store multiple items:

```csharp
string[] fruits = { "apple", "banana", "cherry" };
```

But arrays have a critical limitation: **they are fixed in size**. Once you create an array with 3 slots, you cannot add a 4th item without creating an entirely new, larger array and copying everything over.

```csharp
// ❌ Adding to an array is painful:
string[] fruits = { "apple", "banana", "cherry" };
// Want to add "date"? You have to:
string[] newFruits = new string[4];
Array.Copy(fruits, newFruits, fruits.Length);
newFruits[3] = "date";
// And now fruits is outdated...

// ✅ With List<T>: trivial
var fruitList = new List<string> { "apple", "banana", "cherry" };
fruitList.Add("date"); // Done!
```

**Real-world analogy:** An array is like a physical filing cabinet with exactly 10 drawers. If you need an 11th, you have to buy an entirely new cabinet, move everything, and recycle the old one. A `List<T>` is like a digital filing system that grows automatically.

### When to Use Each Collection Type

```
Need a simple fixed-size collection of numbers/known data?
    → Array: int[], string[]

Need a growable, ordered, indexed collection? (Most common case)
    → List<T>: List<string>, List<Product>

Need to look something up instantly by a unique key?
    → Dictionary<TKey, TValue>: Dictionary<int, Product>

Need to ensure there are no duplicates?
    → HashSet<T>: HashSet<string>

Need first-in, first-out (queue / waiting line) processing?
    → Queue<T>

Need last-in, first-out (stack / undo history) processing?
    → Stack<T>
```

---

## 2. `List<T>` — Your Workhorse Collection

`List<T>` is the most commonly used collection in C# — it's a dynamically-sized array that automatically grows as you add items. The `<T>` means it's a **generic** type — `T` is a placeholder for the actual type you'll store (int, string, Product, etc.).

```csharp
// ── Creating Lists ─────────────────────────────────────────────────

// Empty list — ready to receive items
var names = new List<string>();

// List with initial items:
var scores = new List<int> { 95, 87, 73, 91, 68 };

// Capacity hint — allocate space for 100 items upfront (optional performance optimization)
var largeList = new List<Product>(capacity: 100);

// ── Adding Items ───────────────────────────────────────────────────

names.Add("Alice");           // Add a single item to the end
names.Add("Bob");
names.Add("Charlie");

names.AddRange(new[] { "Diana", "Eve" });  // Add multiple items at once

names.Insert(1, "Adam");      // Insert at a specific index (pushes existing items down)
// ["Alice", "Adam", "Bob", "Charlie", "Diana", "Eve"]

// ── Reading Items ──────────────────────────────────────────────────

Console.WriteLine(names.Count);    // 6 — total number of items
Console.WriteLine(names[0]);       // "Alice" — index-based access (zero-indexed)
Console.WriteLine(names[^1]);      // "Eve" — C# 8+ index from end (^1 = last item)

// Iterating:
foreach (string name in names)
{
    Console.WriteLine(name);
}

// ── Searching ─────────────────────────────────────────────────────

bool hasAlice = names.Contains("Alice");         // True
int idx = names.IndexOf("Bob");                  // 2 (position of "Bob")
string? found = names.Find(n => n.StartsWith("D")); // "Diana" (first match)
List<string> allD = names.FindAll(n => n.StartsWith("D")); // ["Diana"]

// ── Removing Items ────────────────────────────────────────────────

names.Remove("Charlie");              // Remove by value (first occurrence)
names.RemoveAt(0);                    // Remove by index
names.RemoveAll(n => n.Length < 4);  // Remove all items matching a condition
names.Clear();                        // Remove ALL items

// ── Sorting ───────────────────────────────────────────────────────

var numbers = new List<int> { 5, 2, 8, 1, 9, 3 };
numbers.Sort();                        // In-place sort ascending: [1, 2, 3, 5, 8, 9]
numbers.Sort((a, b) => b - a);        // Custom sort — descending: [9, 8, 5, 3, 2, 1]
numbers.Reverse();                     // Reverse the current order: [1, 2, 3, 5, 8, 9]

// Sort a list of objects by property:
var people = new List<Person> { ... };
people.Sort((a, b) => string.Compare(a.Name, b.Name)); // Alphabetical by name
```

---

## 3. `Dictionary<TKey, TValue>` — Instant Lookup by Key

A dictionary stores **key-value pairs** and provides **O(1) average time lookups** — it finds a value by its key instantly, regardless of how large the dictionary is. This is because it uses hashing internally.

**Real-world analogy:** A physical dictionary. If you want to find the definition of "photosynthesis", you don't read from page 1. You jump directly to the P section. A `Dictionary<string, string>` works the same way — jump directly to the key.

```csharp
// ── Creating a Dictionary ──────────────────────────────────────────

// Dictionary<KeyType, ValueType>
var ageByName = new Dictionary<string, int>
{
    { "Alice", 30 },         // Collection initializer syntax
    { "Bob", 25 },
    { "Charlie", 35 }
};

// Alternative (index initializer):
var ageByName2 = new Dictionary<string, int>
{
    ["Alice"] = 30,
    ["Bob"] = 25,
};

// Product lookup by ID:
var productById = new Dictionary<int, Product>();

// ── Adding, Updating, Removing ────────────────────────────────────

ageByName["Diana"] = 28;           // Add (if key doesn't exist)
ageByName["Alice"] = 31;           // Update (if key exists)
ageByName.Add("Eve", 22);          // Add — THROWS if key already exists!
bool removed = ageByName.Remove("Bob"); // Remove by key, returns true if found

// ── Reading ───────────────────────────────────────────────────────

int aliceAge = ageByName["Alice"]; // 31 — direct access
                                    // ❌ Throws KeyNotFoundException if key missing!

// Safe access with TryGetValue:
if (ageByName.TryGetValue("Alice", out int age))
{
    Console.WriteLine($"Alice is {age} years old"); // "Alice is 31 years old"
}
else
{
    Console.WriteLine("Alice not found");
}

// GetValueOrDefault — returns the type's default value (0 for int) if key missing
int unknownAge = ageByName.GetValueOrDefault("Unknown", 0); // 0 (default int)

// Check key existence before accessing:
bool hasAlice = ageByName.ContainsKey("Alice");  // True
bool hasAge30 = ageByName.ContainsValue(31);     // True (searches all values — slower!)

// ── Iterating ─────────────────────────────────────────────────────

// Iterate key-value pairs:
foreach (KeyValuePair<string, int> entry in ageByName)
{
    Console.WriteLine($"{entry.Key}: {entry.Value}");
}

// Shorter with deconstruction:
foreach ((string name, int personAge) in ageByName)
{
    Console.WriteLine($"{name}: {personAge}");
}

// Iterate only keys or only values:
foreach (string key in ageByName.Keys) { ... }
foreach (int value in ageByName.Values) { ... }
```

### Common Mistake: `dictionary[key]` Throws if Key Missing

```csharp
// ❌ DANGEROUS — throws KeyNotFoundException if "Frank" doesn't exist
int frankAge = ageByName["Frank"]; // 💥 KeyNotFoundException!

// ✅ SAFE option 1 — TryGetValue (preferred)
if (ageByName.TryGetValue("Frank", out int frankAge2))
    Console.WriteLine(frankAge2);

// ✅ SAFE option 2 — check ContainsKey first
if (ageByName.ContainsKey("Frank"))
    Console.WriteLine(ageByName["Frank"]);

// ✅ SAFE option 3 — GetValueOrDefault
int frankAge3 = ageByName.GetValueOrDefault("Frank", -1);
```

---

## 4. `HashSet<T>` — Uniqueness Guaranteed

A `HashSet<T>` stores an **unordered collection of unique items**. Adding a duplicate is a no-op — the set simply ignores it. Lookups are O(1) (instant) just like dictionaries.

**Real-world analogy:** A guest list for an event. No matter how many times someone tries to register under the same name, they appear on the list only once.

```csharp
// ── Creating and Adding ────────────────────────────────────────────

var tags = new HashSet<string> { "csharp", "dotnet", "programming" };

bool added = tags.Add("angular");    // True — successfully added
bool dup   = tags.Add("csharp");     // False — "csharp" already exists, ignored silently

Console.WriteLine(tags.Count);       // 4 (not 5, because "csharp" duplicate was ignored)

// ── Checking Membership ────────────────────────────────────────────

bool hasCsharp = tags.Contains("csharp"); // True — O(1) instant lookup!

// ── Set Operations ────────────────────────────────────────────────

var setA = new HashSet<int> { 1, 2, 3, 4, 5 };
var setB = new HashSet<int> { 3, 4, 5, 6, 7 };

// UnionWith — all items from both sets (no duplicates):
setA.UnionWith(setB);             // setA = { 1, 2, 3, 4, 5, 6, 7 }

// IntersectWith — only items in BOTH sets:
var setC = new HashSet<int> { 1, 2, 3, 4, 5 };
setC.IntersectWith(setB);         // setC = { 3, 4, 5 }

// ExceptWith — items in setA but NOT in setB:
var setD = new HashSet<int> { 1, 2, 3, 4, 5 };
setD.ExceptWith(setB);            // setD = { 1, 2 }

// IsSubsetOf / IsSupersetOf:
bool isSub = new HashSet<int>{ 3, 4 }.IsSubsetOf(setB); // True — {3,4} ⊆ {3,4,5,6,7}

// ── When to Use HashSet vs List ────────────────────────────────────
// HashSet: "Does this item exist?" — O(1) lookup, no duplicates
// List:    "What's at index N?" — O(1) access by position, allows duplicates
```

---

## 5. `Queue<T>` and `Stack<T>`

### Queue<T> — First In, First Out (FIFO)

Like a real queue (waiting line) — the first person who arrived is the first one served.

**Use cases:** Task queues, print jobs, message processing, breadth-first search.

```csharp
var taskQueue = new Queue<string>();

// Enqueue — add to the END of the queue
taskQueue.Enqueue("Send welcome email");
taskQueue.Enqueue("Process payment");
taskQueue.Enqueue("Update inventory");

Console.WriteLine(taskQueue.Count);    // 3
Console.WriteLine(taskQueue.Peek());   // "Send welcome email" — look at front WITHOUT removing

// Dequeue — remove and return from the FRONT of the queue
string nextTask = taskQueue.Dequeue(); // "Send welcome email" — FIRST in = FIRST out
Console.WriteLine(taskQueue.Count);    // 2

// Process all tasks in order:
while (taskQueue.Count > 0)
{
    string task = taskQueue.Dequeue();
    Console.WriteLine($"Processing: {task}");
}
```

### Stack<T> — Last In, First Out (LIFO)

Like a stack of plates — the last plate placed on top is the first one taken off.

**Use cases:** Undo/redo history, depth-first search, call stack simulation, expression parsing.

```csharp
var undoStack = new Stack<string>();

// Push — add to the TOP
undoStack.Push("Typed 'Hello'");
undoStack.Push("Changed font to Bold");
undoStack.Push("Highlighted text");

Console.WriteLine(undoStack.Peek()); // "Highlighted text" — look at top WITHOUT removing

// Pop — remove and return from the TOP (undo the last action)
string lastAction = undoStack.Pop(); // "Highlighted text" — LAST in = FIRST out
Console.WriteLine($"Undoing: {lastAction}");
```

---

## 6. Generics — Write Once, Use with Any Type

### Why Generics Exist

Before generics, you had to write a separate collection class for each type, or use `object` (which required boxing/unboxing and had no type safety).

**Real-world analogy:** A generic container (like a cardboard box) can hold books, clothes, or electronics — the container itself doesn't need to know what it holds. The label on the outside tells you the contents. A `List<Book>` is a box labeled "Books only" — it accepts books, stores books, and returns books. No surprises.

### Writing Your Own Generic Class

```csharp
// A generic "result wrapper" that can hold any type of value, plus success/error status
// T is the type parameter — a placeholder for the actual type provided when using this class
public class Result<T>
{
    // Private fields:
    public bool IsSuccess { get; private set; }
    public T? Value { get; private set; }        // T? means T can be null here
    public string? ErrorMessage { get; private set; }

    // Private constructors — force use of factory methods below
    private Result(T value) 
    { 
        IsSuccess    = true; 
        Value        = value; 
        ErrorMessage = null; 
    }
    private Result(string error) 
    { 
        IsSuccess    = false; 
        Value        = default; // Default value for type T (null for ref types, 0 for int, etc.)
        ErrorMessage = error; 
    }

    // Factory methods — the public way to create Results
    // The return type is Result<T>, so callers get a typed result
    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(string error) => new(error);

    // Pattern-matching style: execute different code based on success or failure
    public void Match(Action<T> onSuccess, Action<string> onFailure)
    {
        if (IsSuccess && Value is not null)
            onSuccess(Value);         // Call success handler with the value
        else
            onFailure(ErrorMessage ?? "Unknown error"); // Call failure handler with error
    }
}

// Usage — no code duplication, works with ANY type:
Result<string> nameResult = Result<string>.Success("Alice");
Result<int> ageResult = Result<int>.Failure("Invalid age format");
Result<List<Product>> productsResult = Result<List<Product>>.Success(new List<Product>());

// Using Match for clean error handling:
nameResult.Match(
    onSuccess: name => Console.WriteLine($"Got name: {name}"),
    onFailure: err  => Console.WriteLine($"Error: {err}")
);
```

### Generic Methods

Methods can also be generic — they infer the type from the arguments:

```csharp
// A generic Swap method — works with any type
public static void Swap<T>(ref T a, ref T b)
{
    T temp = a;  // T resolves to the actual type when called
    a = b;
    b = temp;
}

int x = 5, y = 10;
Swap(ref x, ref y);           // T inferred as int
Console.WriteLine($"{x}, {y}"); // "10, 5"

string s1 = "hello", s2 = "world";
Swap(ref s1, ref s2);          // T inferred as string
Console.WriteLine($"{s1}, {s2}"); // "world, hello"

// Generic method with return type:
public static T Max<T>(T a, T b) where T : IComparable<T>
{
    // a.CompareTo(b) returns:
    //   > 0 if a > b
    //   = 0 if a == b
    //   < 0 if a < b
    return a.CompareTo(b) >= 0 ? a : b;
}

Console.WriteLine(Max(5, 10));          // 10
Console.WriteLine(Max("apple", "banana")); // "banana" (alphabetical)
Console.WriteLine(Max(3.14, 2.71));     // 3.14
```

### Generic Constraints

Sometimes you need to guarantee that `T` has certain capabilities. Constraints enforce this:

```csharp
// 'where T : class' — T must be a reference type (not int, bool, etc.)
public class Repository<T> where T : class
{
    private List<T> _items = new();
    public void Add(T item) => _items.Add(item);
}

// 'where T : IComparable<T>' — T must support comparison (needed for sorting)
public static T Min<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) <= 0 ? a : b;

// 'where T : new()' — T must have a parameterless constructor (so we can create instances)
public static T CreateDefault<T>() where T : new()
    => new T();

// Multiple constraints:
public class DataService<T> where T : class, IEntity, new()
{
    // T must be: a reference type, implement IEntity, and have a default constructor
}

// Common constraints:
// where T : struct      — T must be a value type (int, double, struct)
// where T : class       — T must be a reference type
// where T : BaseClass   — T must inherit from BaseClass
// where T : IInterface  — T must implement IInterface
// where T : new()       — T must have a parameterless constructor
// where T : notnull     — T cannot be null
```

---

## 7. LINQ — Language Integrated Query

### What is LINQ?

LINQ (Language Integrated Query) is a set of powerful extension methods on any `IEnumerable<T>` collection (List, Array, IQueryable, etc.) that let you query and transform data in a functional, declarative style.

**Real-world analogy:** Think of LINQ as SQL for in-memory collections. Just like you write `SELECT name FROM employees WHERE salary > 50000 ORDER BY name` in SQL, LINQ lets you write the same query in C# with full type safety and IDE support.

**Without LINQ:**
```csharp
// Find products under $50, sort by price, get the top 5
var affordable = new List<Product>();
foreach (var product in products)
{
    if (product.Price < 50)
        affordable.Add(product);
}
affordable.Sort((a, b) => a.Price.CompareTo(b.Price));
var top5 = affordable.Take(5).ToList();
// 9 lines of imperative code...
```

**With LINQ:**
```csharp
var top5 = products
    .Where(p => p.Price < 50)
    .OrderBy(p => p.Price)
    .Take(5)
    .ToList();
// 4 lines, reads like English, no mutation!
```

### The Most Important LINQ Operators

Let's use a realistic dataset throughout all examples:

```csharp
public record Product(int Id, string Name, string Category, decimal Price, int Stock, double Rating);

var products = new List<Product>
{
    new(1,  "Wireless Headphones", "Electronics", 79.99m,  45, 4.5),
    new(2,  "Coffee Maker",         "Kitchen",    129.99m,  12, 4.2),
    new(3,  "Running Shoes",        "Sports",      89.99m,  30, 4.8),
    new(4,  "Novel: The Alchemist", "Books",        14.99m, 200, 4.7),
    new(5,  "Yoga Mat",             "Sports",       35.00m,  60, 4.3),
    new(6,  "Smartphone Case",      "Electronics",  12.99m, 150, 3.9),
    new(7,  "Cookbook: Italian",    "Books",        24.99m,  80, 4.1),
    new(8,  "Blender",              "Kitchen",      69.99m,  25, 4.6),
    new(9,  "Gaming Controller",    "Electronics", 59.99m,  35, 4.4),
    new(10, "Hiking Boots",         "Sports",      119.99m,  20, 4.7),
};
```

#### Filtering — `Where()`

Returns only items matching a condition (like SQL `WHERE`):

```csharp
// All electronics:
var electronics = products.Where(p => p.Category == "Electronics");

// Products under $50:
var budget = products.Where(p => p.Price < 50);

// Multiple conditions:
var topRatedBudget = products.Where(p => p.Price < 100 && p.Rating >= 4.5);

// Chain Where calls (equivalent to AND):
var filtered = products
    .Where(p => p.Category == "Sports")
    .Where(p => p.Stock > 20);
```

#### Projection — `Select()`

Transforms each item into a new shape (like SQL `SELECT`):

```csharp
// Get just the names:
IEnumerable<string> names = products.Select(p => p.Name);

// Create anonymous objects with only the properties you need:
var summaries = products.Select(p => new { p.Name, p.Price, p.Rating });

// Calculate a new value per item:
var withDiscount = products.Select(p => new {
    p.Name,
    p.Price,
    DiscountedPrice = p.Price * 0.9m,  // 10% off
    Savings = p.Price * 0.1m
});

// Project to a named class/record:
public record ProductSummary(string Name, decimal Price);
var summaryList = products
    .Select(p => new ProductSummary(p.Name, p.Price))
    .ToList();
```

#### Sorting — `OrderBy()`, `OrderByDescending()`, `ThenBy()`

```csharp
// Ascending by price (cheapest first):
var cheapestFirst = products.OrderBy(p => p.Price);

// Descending by rating (best rated first):
var bestFirst = products.OrderByDescending(p => p.Rating);

// Multi-level sort — by category, then by price within each category:
var sorted = products
    .OrderBy(p => p.Category)      // Primary sort: category A-Z
    .ThenByDescending(p => p.Price); // Secondary sort: price high-to-low within category

// Alphabetical by name:
var alphabetical = products.OrderBy(p => p.Name, StringComparer.OrdinalIgnoreCase);
```

#### Aggregation — `Count()`, `Sum()`, `Min()`, `Max()`, `Average()`

```csharp
// Total number of products:
int total = products.Count();                           // 10
int electronicsCount = products.Count(p => p.Category == "Electronics"); // 3

// Sum:
decimal totalValue = products.Sum(p => p.Price * p.Stock); // Total inventory value
decimal avgPrice   = products.Average(p => p.Price);        // Average price

// Min / Max:
decimal cheapest   = products.Min(p => p.Price);     // 12.99
decimal mostExpensive = products.Max(p => p.Price);  // 129.99
Product? bestRated = products.MaxBy(p => p.Rating);  // Product with highest rating
Product? cheapestProduct = products.MinBy(p => p.Price);  // Product with lowest price
```

#### Taking and Skipping — `Take()`, `Skip()`, `TakeLast()`

```csharp
// Top 3 most expensive:
var top3Expensive = products.OrderByDescending(p => p.Price).Take(3);

// Pagination — skip first 2, take next 3 (page 2 with page size 3... wait, skip = (page-1) * pageSize)
int page = 2, pageSize = 3;
var page2 = products
    .OrderBy(p => p.Id)
    .Skip((page - 1) * pageSize)  // Skip 3 items (page 2 starts at index 3)
    .Take(pageSize)               // Take 3 items
    .ToList();

// Last 2 items:
var lastTwo = products.TakeLast(2);

// Take while condition is true (stops at first failure):
var underFifty = products
    .OrderBy(p => p.Price)
    .TakeWhile(p => p.Price < 50);  // Takes until a product costs >= $50
```

#### Finding — `First()`, `FirstOrDefault()`, `Single()`, `Any()`, `All()`

```csharp
// First matching item (throws if none found):
Product first = products.First(p => p.Category == "Books");

// FirstOrDefault — returns null if not found (safer):
Product? notFound = products.FirstOrDefault(p => p.Name == "Nonexistent");
// notFound is null — no exception

// Single — asserts exactly ONE match (throws if 0 or 2+ found):
// Use when your logic guarantees uniqueness
Product unique = products.Single(p => p.Id == 5);

// Any — is there at least one match? (returns bool):
bool hasElectronics = products.Any(p => p.Category == "Electronics"); // True
bool hasJewelry     = products.Any(p => p.Category == "Jewelry");     // False
bool isEmpty        = products.Any(); // True (list is not empty)

// All — does EVERY item match? (returns bool):
bool allInStock   = products.All(p => p.Stock > 0);       // True
bool allUnder200  = products.All(p => p.Price < 200);     // True
bool allHighRated = products.All(p => p.Rating >= 4.5);   // False
```

#### Grouping — `GroupBy()`

Groups items by a key, like SQL `GROUP BY`:

```csharp
// Group products by category:
var byCategory = products.GroupBy(p => p.Category);

foreach (IGrouping<string, Product> group in byCategory)
{
    Console.WriteLine($"\n─── {group.Key} ({group.Count()} items) ───");
    foreach (Product p in group)
    {
        Console.WriteLine($"  {p.Name}: {p.Price:C} ★{p.Rating}");
    }
}
// Output:
// ─── Electronics (3 items) ───
//   Wireless Headphones: $79.99 ★4.5
//   ...

// Project each group to a summary:
var categorySummary = products
    .GroupBy(p => p.Category)
    .Select(group => new
    {
        Category    = group.Key,
        ItemCount   = group.Count(),
        AveragePrice = group.Average(p => p.Price),
        TotalStock  = group.Sum(p => p.Stock),
        TopProduct  = group.MaxBy(p => p.Rating)?.Name
    })
    .OrderBy(s => s.Category)
    .ToList();

foreach (var s in categorySummary)
{
    Console.WriteLine($"{s.Category}: {s.ItemCount} items, avg {s.AveragePrice:C}, top: {s.TopProduct}");
}
```

#### Flattening — `SelectMany()`

When each item has a collection of sub-items and you want all sub-items in a flat list:

```csharp
public record Order(int Id, List<Product> Items);

var orders = new List<Order>
{
    new(1, new List<Product> { products[0], products[3] }),
    new(2, new List<Product> { products[1], products[2], products[4] }),
};

// SelectMany flattens Order.Items from all orders into one flat list
IEnumerable<Product> allOrderedProducts = orders.SelectMany(o => o.Items);
Console.WriteLine(allOrderedProducts.Count()); // 5 — all products from all orders

// SelectMany with projection (include the parent order):
var productWithOrder = orders.SelectMany(
    o => o.Items,                          // The inner collection to flatten
    (order, product) => new              // Projection for each (order, product) pair
    {
        OrderId = order.Id,
        ProductName = product.Name,
        ProductPrice = product.Price
    }
);
```

#### Joining — `Join()`

Combines two collections on a matching key (like SQL `INNER JOIN`):

```csharp
public record Category(int Id, string Name, string Description);

var categories = new List<Category>
{
    new(1, "Electronics", "Electronic devices and accessories"),
    new(2, "Kitchen",     "Kitchen appliances and cookware"),
    new(3, "Sports",      "Sports and outdoor equipment"),
    new(4, "Books",       "Books and educational materials"),
};

var productsWithCategoryInfo = products.Join(
    categories,                        // The second collection to join with
    p => p.Category,                   // Key from the first collection (products)
    c => c.Name,                       // Key from the second collection (categories)
    (p, c) => new                     // Result projection — what to produce for each match
    {
        p.Name,
        p.Price,
        CategoryDescription = c.Description
    }
);
```

#### Materialize Results — `ToList()`, `ToArray()`, `ToDictionary()`

LINQ is **lazily evaluated** (see Section 8). These methods **execute** the query and return a concrete collection:

```csharp
// ToList() — execute and return as List<T>
List<Product> budgetProducts = products.Where(p => p.Price < 50).ToList();

// ToArray() — execute and return as T[]
Product[] topRated = products.OrderByDescending(p => p.Rating).Take(3).ToArray();

// ToDictionary() — execute and return as Dictionary<Key, Value>
// Transforms a list into a lookup dictionary
Dictionary<int, Product> productById = products.ToDictionary(p => p.Id);
Product wireless = productById[1]; // Instant lookup by ID!

// ToDictionary with value selector:
Dictionary<string, decimal> priceByName = products.ToDictionary(
    p => p.Name,    // Key selector
    p => p.Price    // Value selector
);
```

---

## 8. Method Syntax vs Query Syntax

LINQ can be written in two styles. Method syntax is more common in C#; query syntax feels more like SQL:

```csharp
// METHOD SYNTAX (lambda-based, most common in C# code)
var result1 = products
    .Where(p => p.Category == "Electronics")
    .OrderBy(p => p.Price)
    .Select(p => new { p.Name, p.Price })
    .ToList();

// QUERY SYNTAX (SQL-like)
var result2 = (from p in products
               where p.Category == "Electronics"
               orderby p.Price ascending
               select new { p.Name, p.Price })
              .ToList();

// Both produce identical results. Method syntax is generally preferred in C#.
// Query syntax can be cleaner for complex joins:

var joinResult = from p in products
                 join c in categories on p.Category equals c.Name
                 where p.Price < 100
                 orderby p.Rating descending
                 select new { p.Name, p.Price, c.Description };
```

---

## 9. Deferred Execution — LINQ Runs Later

This is one of the most important (and most misunderstood) aspects of LINQ.

LINQ operators like `Where()`, `Select()`, `OrderBy()` do **NOT** run immediately. They create a **query object** (a description of what to do). The actual execution only happens when you **iterate the results** (with `foreach`, `ToList()`, `First()`, etc.).

```csharp
// DEFINING the query — NO data is processed yet!
// products is not iterated at this point
IEnumerable<Product> query = products
    .Where(p => p.Price < 100)
    .OrderBy(p => p.Price);

// Adding a new product AFTER defining the query:
products.Add(new Product(11, "Budget Pen", "Office", 5.99m, 500, 3.5));

// EXECUTING the query — only NOW does LINQ iterate products and filter
// The new product (Budget Pen at $5.99) WILL be included because the query runs now
foreach (Product p in query)
{
    Console.WriteLine(p.Name); // Includes Budget Pen!
}

// Second execution — runs AGAIN from scratch
foreach (Product p in query)
{
    Console.WriteLine(p.Name); // Iterates the list again
}
```

### Forcing Immediate Execution

Call `ToList()`, `ToArray()`, or `ToDictionary()` to **execute the query now** and capture a snapshot:

```csharp
// Snapshot — captures the state of products AT THIS MOMENT
List<Product> snapshot = products.Where(p => p.Price < 100).ToList();

products.Add(new Product(12, "New Product", "Other", 50m, 10, 4.0));

// snapshot will NOT contain the new product — it's a frozen list
Console.WriteLine(snapshot.Count); // Same count as before the Add
```

> [!TIP]
> **When to use `ToList()` immediately:** If you need to use the results multiple times (avoid double iteration), if the source might change, or if you want to pass the results to a method that expects `List<T>`.

### Common LINQ Mistakes

| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| `products[0]` on `IEnumerable` | `IEnumerable` has no indexer | Call `.ToList()[0]` or use `.First()` |
| Not calling `.ToList()` — iterating twice | Query runs twice (expensive for DB queries) | Call `.ToList()` and store the result |
| Using `.Single()` on a list that might have 0 or 2+ matches | `InvalidOperationException` at runtime | Use `.SingleOrDefault()` or `.FirstOrDefault()` |
| Modifying source list inside a LINQ chain | `InvalidOperationException` | Never modify a collection while iterating it |
| Using `Count > 0` instead of `Any()` | Enumerates ALL items to count | Use `.Any()` — stops at first match |

---

## 🧪 Practice Labs

### Lab 1 — Collection Operations Challenge (30 min)

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

Write LINQ queries to find:
1. All CS students with GPA ≥ 3.5, ordered by GPA descending
2. The average GPA of all students
3. A `Dictionary<string, List<string>>` mapping each major to its students' names
4. The top student in each major (highest GPA)
5. Whether all Year 4 students have GPA above 3.5

### Lab 2 — Generic `Result<T>` Class (30 min)
1. Implement the `Result<T>` class from Section 6.
2. Create a `UserService` class with:
   - `Result<User> GetById(int id)` — returns `Success(user)` if found, `Failure("User not found")` if not
   - `Result<List<User>> GetAll()` — returns `Success(list)` always
3. Call `Match()` on the result to print either the user info or the error.

---

## 📝 Assignment: FinanceTracker Project — Part 3

Add LINQ-powered reporting to your FinanceTracker app.

### Requirements

After the user enters all transactions, display these reports:

**Report 1 — Summary by Category**
```csharp
var summary = transactions
    .GroupBy(t => t is Expense e ? e.Category : "Income")
    .Select(g => new { Category = g.Key, Total = g.Sum(t => Math.Abs(t.Amount)), Count = g.Count() })
    .OrderByDescending(s => s.Total);
```

**Report 2 — Top 3 Expenses**
```csharp
var top3 = transactions
    .OfType<Expense>()          // Filter only Expense types
    .OrderByDescending(e => Math.Abs(e.Amount))
    .Take(3);
```

**Report 3 — Balance Calculation**
```csharp
decimal totalIncome  = transactions.OfType<Income>().Sum(i => i.Amount);
decimal totalExpense = transactions.OfType<Expense>().Sum(e => Math.Abs(e.Amount));
decimal balance      = totalIncome - totalExpense;
```

**Report 4 — Monthly Summary** (group transactions by month and year)

Display all reports clearly with headings after the transaction entry phase.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| LINQ Overview | https://learn.microsoft.com/en-us/dotnet/csharp/linq/ |
| LINQ Method Reference | https://learn.microsoft.com/en-us/dotnet/api/system.linq |
| Generics in C# | https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics |

---

## 📌 Key Takeaways

- **`List<T>`** — ordered, growable, indexed — the default collection for most scenarios
- **`Dictionary<K, V>`** — instant O(1) lookup by key; use `TryGetValue()` to avoid exceptions
- **`HashSet<T>`** — unordered, unique items, O(1) contains check; great for deduplication
- **Generics** — type-safe, reusable code without repetition; `<T>` is a placeholder for the real type
- **Constraints** (`where T : IComparable<T>`) — guarantee that T has the capabilities you need
- **LINQ** — declarative, functional querying of any `IEnumerable<T>` collection
- **Deferred execution** — LINQ operators don't run until iterated; call `ToList()` for an eager snapshot
- Core LINQ operators: `Where`, `Select`, `OrderBy`, `GroupBy`, `Join`, `First/FirstOrDefault`, `Any`, `All`, `Sum`, `Count`, `Take`, `Skip`

---

**Next Lecture:** [Lecture 36 — Delegates, Events, Async/Await & Exception Handling](./36%20-%20Delegates,%20Events,%20Async%20%26%20Exception%20Handling.md)