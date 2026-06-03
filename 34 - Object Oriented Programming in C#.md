# Lecture 34 — Object-Oriented Programming in C#

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain the four pillars of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction)
- Define classes with fields, auto-properties, init-only properties, and the C# 14 `field` keyword
- Construct objects using both traditional constructors and C# 12+ Primary Constructors
- Apply encapsulation using access modifiers (`public`, `protected`, `private`, `internal`)
- Build inheritance hierarchies with `virtual`, `override`, and `sealed`
- Create abstract classes and abstract methods to force implementation in derived classes
- Define interfaces as contracts and implement them in classes
- Understand when to use an abstract class vs an interface

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. The four pillars of OOP
2. Classes & Objects: fields, properties, methods
3. Constructors — traditional and primary
4. Encapsulation: access modifiers and the `field` keyword
5. Inheritance: `virtual`, `override`, `sealed`, `base`
6. Abstract classes — templates you can't instantiate
7. Interfaces — contracts without implementation
8. Abstract classes vs Interfaces — when to use which

### Part 2 — Practice / Lab (~90–120 min)
1. Class hierarchy: Person → Student → GraduateStudent
2. Interface-based repository pattern
3. FinanceTracker Project Part 2: OOP & Inheritance

---

## 1. The Four Pillars of OOP

### Plain-English Explanation

Object-Oriented Programming (OOP) is a way of organizing code around **objects** — self-contained units that bundle together related data (properties) and behaviour (methods). The four core principles of OOP are:

### Pillar 1: Encapsulation — "Hide the internals"

**Real-world analogy:** A car has an engine, transmission, fuel injection system, and hundreds of moving parts. When you drive, you don't need to know how any of that works. You interact with a simple interface: steering wheel, pedals, gear stick. The complexity is *encapsulated* behind a simple API.

In C#: keep data `private`, expose controlled access via `public` properties and methods. Components outside the class interact only through the public interface — they can't corrupt the internal state.

### Pillar 2: Inheritance — "Build on existing work"

**Real-world analogy:** A "GoldMember" bank account IS a bank account — it has all the features of a regular bank account, plus extra perks (higher interest rate, no fees, concierge service). You don't rebuild bank account functionality from scratch; you inherit it and extend it.

In C#: a derived class (`class Dog : Animal`) inherits all of the base class's properties and methods, and can add new ones or override existing ones.

### Pillar 3: Polymorphism — "Many forms"

**Real-world analogy:** A "Play" button means different things on different devices — on Spotify it plays music, on YouTube it plays a video, on a game console it starts a game. The same button, different behaviour depending on the context.

In C#: a base class method can be overridden in derived classes. Calling the method on a base class reference invokes the correct version based on the actual runtime type. (More on this in Section 5.)

### Pillar 4: Abstraction — "Focus on the what, not the how"

**Real-world analogy:** When you use a payment gateway (like Stripe), you don't know how card transactions are processed. You just call `charge(amount, card)`. The complexity is abstracted away.

In C#: abstract classes and interfaces define *what* an object can do without specifying *how* it does it. They give you a blueprint without implementation.

### Why Does This Matter?

> [!NOTE]
> OOP is the dominant paradigm in enterprise software development. Almost every C# Web API, service class, and Entity Framework model you'll write uses OOP concepts. Understanding these pillars is essential for writing maintainable, scalable code.

---

## 2. Classes & Objects

### What is a Class? What is an Object?

- A **class** is a **blueprint** — a description of what something looks like and how it behaves.
- An **object** (instance) is a **concrete thing created from that blueprint**.

**Real-world analogy:** A class is like an architectural blueprint for a house. The blueprint describes the dimensions, rooms, and features. An object is the actual house built from that blueprint. You can build many different houses from the same blueprint.

```csharp
// CLASS — the blueprint (defined once)
public class BankAccount
{
    // Fields — private data storage (internal, hidden from outside)
    private decimal _balance;   // The underscore prefix is a C# naming convention for private fields
    private string _accountId;

    // Properties — controlled public access to data
    // Auto-property: compiler creates the backing field automatically
    public string OwnerName { get; set; } = string.Empty;

    // Read-only auto-property (only the class or subclasses can set via 'set')
    public string AccountNumber { get; private set; } = string.Empty;

    // Init-only property — settable ONLY during object initialization
    // After construction, the value is permanently locked
    public DateTime OpenedDate { get; init; }

    // C# 14: the 'field' keyword — access the auto-generated backing field
    // in a property with custom getter/setter WITHOUT declaring a separate field
    public decimal Balance
    {
        get => field;           // 'field' refers to the auto-generated backing field
        private set
        {
            if (value < 0)
                throw new ArgumentException("Balance cannot be negative");
            field = value;      // Validate before setting
        }
    }

    // Computed (read-only) property — calculated on the fly, no backing field
    public bool IsOverdrawn => Balance < 0;
    public string Summary => $"{AccountNumber}: {OwnerName} — {Balance:C}";
}

// OBJECTS — concrete instances created from the blueprint
var account1 = new BankAccount
{
    OwnerName   = "Alice Johnson",
    OpenedDate  = new DateTime(2024, 1, 15)  // Can only set init-only during construction
};

var account2 = new BankAccount
{
    OwnerName  = "Bob Smith",
    OpenedDate = new DateTime(2023, 6, 1)
};

// account1 and account2 are independent objects with their own state
account1.OwnerName = "Alice J.";   // Changes only account1
// account1.OpenedDate = DateTime.Now; // ❌ COMPILE ERROR: init-only after construction
```

### Property Patterns

C# has several property patterns — know which to use when:

```csharp
public class ProductExample
{
    // 1. Auto-property — most common. Compiler creates the field.
    //    Readable and writable by anyone (if public set)
    public string Name { get; set; } = string.Empty;

    // 2. Auto-property with private set — readable publicly, settable only internally
    public string Sku { get; private set; } = GenerateSku();

    // 3. Init-only property — set during object initialization, then immutable
    //    Great for IDs and creation timestamps
    public Guid Id { get; init; } = Guid.NewGuid();

    // 4. Read-only computed property — no setter, value computed from other fields
    public bool IsInStock => StockLevel > 0;

    // 5. Full property with C# 14 'field' keyword — custom logic without a separate field
    public int StockLevel
    {
        get => field;
        set
        {
            if (value < 0) throw new ArgumentOutOfRangeException(nameof(value), "Stock cannot be negative");
            field = value;
        }
    }

    private static string GenerateSku() => $"SKU-{Guid.NewGuid().ToString()[..8].ToUpper()}";
}
```

---

## 3. Constructors & Methods

### What is a Constructor?

A constructor is a special method called when you create an object with `new`. Its job is to initialize the object into a valid state.

```csharp
public class Person
{
    // Properties
    public string Name { get; private set; }
    public int Age { get; private set; }
    public string Email { get; private set; }

    // ── Traditional Parameterized Constructor ──────────────────────
    // Same name as the class, no return type
    public Person(string name, int age, string email)
    {
        // Validate inputs before assigning (fail-fast principle)
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty", nameof(name));
        if (age < 0 || age > 150)
            throw new ArgumentOutOfRangeException(nameof(age), "Age must be 0–150");
        if (!email.Contains("@"))
            throw new ArgumentException("Invalid email format", nameof(email));

        Name  = name;
        Age   = age;
        Email = email;
    }

    // ── Constructor Overloading ────────────────────────────────────
    // Multiple constructors with different signatures (different parameter lists)
    public Person(string name, int age) : this(name, age, "not-provided@example.com")
    {
        // : this(...) calls another constructor — avoids duplicating initialization logic
    }

    // Default constructor (no parameters)
    public Person() : this("Unknown", 0, "unknown@example.com") { }

    // ── Methods ───────────────────────────────────────────────────
    public string GetGreeting() => $"Hi, I'm {Name}, {Age} years old.";

    public void HaveBirthday()
    {
        Age++; // Can modify private set because we're inside the class
    }

    // Method overloading — same name, different parameters
    public void SendEmail(string subject) => SendEmail(subject, "");
    public void SendEmail(string subject, string body)
    {
        Console.WriteLine($"Sending to {Email}: [{subject}] {body}");
    }

    // Override ToString() for meaningful output when you print the object
    public override string ToString() => $"Person({Name}, {Age})";
}

// Usage:
var person = new Person("Alice", 30, "alice@example.com");
Console.WriteLine(person.GetGreeting());  // "Hi, I'm Alice, 30 years old."
person.HaveBirthday();
Console.WriteLine(person.Age);            // 31
Console.WriteLine(person);               // "Person(Alice, 31)" — calls ToString()
```

### Primary Constructors (C# 12+)

As introduced in Lecture 33, primary constructors reduce boilerplate:

```csharp
// Traditional constructor — verbose
public class Point
{
    private readonly double _x;
    private readonly double _y;
    public Point(double x, double y) { _x = x; _y = y; }
    public double DistanceTo(Point other) =>
        Math.Sqrt(Math.Pow(_x - other._x, 2) + Math.Pow(_y - other._y, 2));
}

// Primary constructor — concise
public class Point(double x, double y)
{
    // Parameters are captured and available in all methods
    public double X { get; } = x;
    public double Y { get; } = y;

    public double DistanceTo(Point other) =>
        Math.Sqrt(Math.Pow(x - other.x, 2) + Math.Pow(y - other.y, 2));
}
```

---

## 4. Encapsulation & Access Modifiers

### What is Encapsulation?

Encapsulation means hiding implementation details and exposing only what's needed. Think of a vending machine: you press buttons (public interface), but you can't reach in and grab items directly or adjust the prices (private internals).

This prevents:
- Accidental corruption of internal state
- Other code depending on internal implementation details (which may change)

### Access Modifiers in C#

```csharp
public class AccessDemo
{
    // public — accessible from ANYWHERE (same class, derived classes, other files)
    public string PublicData = "Anyone can read or write this";

    // private — accessible ONLY within this class (default for members)
    private string _privateData = "Only this class can touch this";

    // protected — accessible within this class AND derived (subclasses) only
    protected string ProtectedData = "This class and subclasses only";

    // internal — accessible within the same ASSEMBLY (project/DLL)
    // Think of it as "public within our project, private to the outside world"
    internal string InternalData = "Accessible within this project only";

    // protected internal — accessible within this assembly OR any derived class
    protected internal string ProtectedInternal = "Assembly OR subclasses";

    // private protected — accessible within this class OR derived classes IN the same assembly
    private protected string PrivateProtected = "Subclasses in same assembly only";
}
```

**Summary table:**

| Modifier | Same Class | Derived Class (same assembly) | Derived Class (other assembly) | Any Code |
|----------|-----------|-------------------------------|-------------------------------|----------|
| `public` | ✅ | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `internal` | ✅ | ✅ | ❌ | ❌ |
| `private` | ✅ | ❌ | ❌ | ❌ |

> [!TIP]
> The **Principle of Least Privilege**: always start with the most restrictive modifier (`private`) and open up access only when you need to. This prevents unintended dependencies and makes your code easier to change later.

### Practical Encapsulation

```csharp
public class BankAccount
{
    // ❌ BAD — anyone can set the balance to any value
    public decimal Balance;

    // ✅ GOOD — balance can only be changed through controlled methods
    private decimal _balance;

    public decimal Balance => _balance; // Read-only public access

    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Deposit amount must be positive");
        _balance += amount;
        Console.WriteLine($"Deposited {amount:C}. New balance: {_balance:C}");
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Withdrawal amount must be positive");
        if (amount > _balance)
            throw new InvalidOperationException("Insufficient funds");
        _balance -= amount;
        Console.WriteLine($"Withdrew {amount:C}. New balance: {_balance:C}");
    }
}
```

---

## 5. Inheritance

### What is Inheritance?

Inheritance lets a class (derived class / child class / subclass) acquire all the properties and methods of another class (base class / parent class / superclass) and extend or customize them.

**Real-world analogy:** Think of animal classifications:
- `Animal` → has a Name, can Breathe, has a heartbeat
- `Mammal : Animal` → inherits all Animal features, adds: warm-blooded, has fur, feeds offspring with milk
- `Dog : Mammal` → inherits all Mammal features, adds: barks, fetches, loves belly rubs

Each level inherits and specializes.

### Basic Inheritance Syntax

```csharp
// BASE CLASS — the parent
public class Animal
{
    // Properties available to all derived classes
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }

    // ─────────────────────────────────────────────────────────────
    // virtual — this method CAN be overridden in derived classes
    // But it has a default implementation if not overridden
    // ─────────────────────────────────────────────────────────────
    public virtual string MakeSound()
    {
        return "Some generic animal sound...";
    }

    // Non-virtual method — cannot be overridden (only hidden)
    public void Breathe()
    {
        Console.WriteLine($"{Name} is breathing.");
    }

    // Override ToString() so printing the object is meaningful
    public override string ToString() => $"{GetType().Name}(Name={Name}, Age={Age})";
}

// DERIVED CLASS — inherits from Animal using ':'
public class Dog : Animal
{
    // Dog has all of Animal's properties (Name, Age) automatically
    // Plus its own additional properties:
    public string Breed { get; set; } = string.Empty;

    // ─────────────────────────────────────────────────────────────
    // override — replaces the base class implementation
    // 'override' requires the base method to be 'virtual' or 'abstract'
    // ─────────────────────────────────────────────────────────────
    public override string MakeSound()
    {
        return "Woof! Woof!";
    }

    // Dog-specific method
    public void Fetch(string item)
    {
        Console.WriteLine($"{Name} fetches the {item}! Good dog!");
    }
}

public class Cat : Animal
{
    public bool IsIndoor { get; set; }

    public override string MakeSound()
    {
        return "Meow!";
    }
}

// Usage — polymorphism in action:
var dog = new Dog { Name = "Rex", Age = 3, Breed = "Labrador" };
var cat = new Cat { Name = "Whiskers", Age = 5, IsIndoor = true };

Console.WriteLine(dog.MakeSound()); // "Woof! Woof!"
Console.WriteLine(cat.MakeSound()); // "Meow!"

// Polymorphism: treat different types through a common base class reference
List<Animal> animals = new() { dog, cat };
foreach (Animal animal in animals)
{
    // C# calls the CORRECT overridden version based on the actual runtime type
    Console.WriteLine($"{animal.Name}: {animal.MakeSound()}");
}
// Output:
// Rex: Woof! Woof!
// Whiskers: Meow!
```

### `base` — Calling the Parent

```csharp
public class GoldenRetriever : Dog
{
    // Call the parent's constructor using : base(...)
    public GoldenRetriever(string name) : base()
    {
        Name = name;
        Breed = "Golden Retriever";
    }

    public override string MakeSound()
    {
        // Call the base (Dog's) implementation, then add extra
        string baseSound = base.MakeSound(); // "Woof! Woof!"
        return $"{baseSound} And I'm so happy to see you!";
    }
}
```

### `sealed` — Preventing Further Inheritance

```csharp
// sealed class — no class can inherit from this
public sealed class CreditCardNumber
{
    public string Value { get; }
    public CreditCardNumber(string number) { Value = number; }
    // Mark sealed when a class is a "leaf" in the hierarchy — no further extension makes sense
}

// sealed override — prevents a specific method from being overridden further
public class Poodle : Dog
{
    // This override cannot be overridden again in classes that inherit from Poodle
    public sealed override string MakeSound() => "Yip!";
}
```

---

## 6. Abstract Classes

### What is an Abstract Class?

An abstract class is a **partial implementation** — it defines some behaviour and leaves other behaviour as a **contract** that derived classes must fulfill. You **cannot** create an instance of an abstract class directly — it's purely a template.

**Real-world analogy:** Think of a `Shape` in geometry. "Shape" is a valid concept — it has a color, a position, a perimeter — but you can't draw "a shape" without specifying what kind (circle, square, triangle). The specifics (like how to calculate the area) depend on the concrete type.

```csharp
// abstract class — cannot be instantiated directly
public abstract class Shape
{
    // Regular properties — available to all derived shapes
    public string Color { get; set; } = "Black";
    public string Name { get; protected set; } = "Shape";

    // Regular implemented method — available to all shapes
    public void Draw()
    {
        Console.WriteLine($"Drawing a {Color} {Name}...");
    }

    // ─────────────────────────────────────────────────────────────
    // abstract method — NO implementation here
    // Every derived class MUST override this (compile error if they don't)
    // ─────────────────────────────────────────────────────────────
    public abstract double GetArea();
    public abstract double GetPerimeter();

    // Template method pattern — uses abstract methods in a non-abstract method
    public void PrintInfo()
    {
        Console.WriteLine($"{Name} | Color: {Color} | Area: {GetArea():F2} | Perimeter: {GetPerimeter():F2}");
    }
}

// CONCRETE derived class — MUST implement all abstract members
public class Circle : Shape
{
    public double Radius { get; }

    public Circle(double radius)
    {
        Radius = radius;
        Name = "Circle";  // Set the protected property from base
    }

    // Must override both abstract methods — compiler enforces this
    public override double GetArea() => Math.PI * Radius * Radius;
    public override double GetPerimeter() => 2 * Math.PI * Radius;
}

public class Rectangle : Shape
{
    public double Width { get; }
    public double Height { get; }

    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
        Name = "Rectangle";
    }

    public override double GetArea() => Width * Height;
    public override double GetPerimeter() => 2 * (Width + Height);
}

public class Triangle : Shape
{
    public double A { get; }  // Side lengths
    public double B { get; }
    public double C { get; }

    public Triangle(double a, double b, double c)
    {
        A = a; B = b; C = c;
        Name = "Triangle";
    }

    // Heron's formula for area
    public override double GetArea()
    {
        double s = (A + B + C) / 2;
        return Math.Sqrt(s * (s - A) * (s - B) * (s - C));
    }

    public override double GetPerimeter() => A + B + C;
}

// Usage:
var circle = new Circle(5.0);
var rect = new Rectangle(4.0, 6.0);
var tri = new Triangle(3.0, 4.0, 5.0);

// Polymorphism — treat all shapes through the base class reference
List<Shape> shapes = new() { circle, rect, tri };
foreach (Shape shape in shapes)
{
    shape.PrintInfo(); // Calls the correct GetArea() and GetPerimeter() for each
}

// Output:
// Circle    | Color: Black | Area: 78.54 | Perimeter: 31.42
// Rectangle | Color: Black | Area: 24.00 | Perimeter: 20.00
// Triangle  | Color: Black | Area:  6.00 | Perimeter: 12.00

// Cannot instantiate an abstract class:
// var shape = new Shape(); // ❌ COMPILE ERROR: Cannot create an instance of abstract class
```

---

## 7. Interfaces

### What is an Interface?

An interface is a **pure contract** — it defines a set of members (methods, properties, events) that a class *promises* to implement, with **no implementation of its own** (or only optional default implementations in C# 8+).

**Real-world analogy:** An electrical outlet is an interface. It defines the contract: "I accept a plug with two pins at a specific voltage." Every device that has that plug (phone charger, laptop charger, lamp) can use the outlet — regardless of what the device does internally. The outlet doesn't care about the internal workings of the device.

Similarly, `IPaymentProcessor` defines the contract: "You must have a `ProcessPayment(amount)` method." Whether the implementation is Stripe, PayPal, or a bank transfer doesn't matter to the code that uses the interface.

### Interface Syntax

```csharp
// Interface convention: start with 'I' (I for Interface)
public interface IPaymentProcessor
{
    // Interface members have NO access modifier — they're public by default
    // They have NO implementation — just the signature

    // Method contracts:
    Task<PaymentResult> ProcessPaymentAsync(decimal amount, string currency, string cardToken);
    Task<bool> RefundAsync(string transactionId, decimal amount);

    // Property contract:
    string ProviderName { get; }     // Must be readable (no setter required)
    bool IsTestMode { get; set; }    // Must be both readable and writable
}

// Implementing class 1 — Stripe
public class StripePaymentProcessor : IPaymentProcessor
{
    // Must implement ALL interface members
    public string ProviderName => "Stripe";
    public bool IsTestMode { get; set; }

    public async Task<PaymentResult> ProcessPaymentAsync(decimal amount, string currency, string cardToken)
    {
        Console.WriteLine($"Processing {amount:C} via Stripe...");
        // In reality: call Stripe API
        await Task.Delay(200); // Simulate network call
        return new PaymentResult { Success = true, TransactionId = $"STR-{Guid.NewGuid()}" };
    }

    public async Task<bool> RefundAsync(string transactionId, decimal amount)
    {
        Console.WriteLine($"Refunding {amount:C} for transaction {transactionId} via Stripe...");
        await Task.Delay(100);
        return true;
    }
}

// Implementing class 2 — PayPal
public class PayPalPaymentProcessor : IPaymentProcessor
{
    public string ProviderName => "PayPal";
    public bool IsTestMode { get; set; }

    public async Task<PaymentResult> ProcessPaymentAsync(decimal amount, string currency, string cardToken)
    {
        Console.WriteLine($"Processing {amount:C} via PayPal...");
        await Task.Delay(300);
        return new PaymentResult { Success = true, TransactionId = $"PP-{Guid.NewGuid()}" };
    }

    public async Task<bool> RefundAsync(string transactionId, decimal amount)
    {
        Console.WriteLine($"Refunding via PayPal...");
        await Task.Delay(150);
        return true;
    }
}

// This code works with ANY payment processor that implements the interface
public class OrderService
{
    private readonly IPaymentProcessor _processor; // Reference to the INTERFACE, not a concrete class

    // Dependency is injected — caller decides which processor to use
    public OrderService(IPaymentProcessor processor)
    {
        _processor = processor;
    }

    public async Task PlaceOrderAsync(decimal total, string cardToken)
    {
        Console.WriteLine($"Placing order for {total:C} using {_processor.ProviderName}");
        var result = await _processor.ProcessPaymentAsync(total, "USD", cardToken);
        if (result.Success)
            Console.WriteLine($"✅ Order placed! Transaction: {result.TransactionId}");
        else
            Console.WriteLine("❌ Payment failed.");
    }
}

// Usage — easily swap between payment processors:
var stripeService  = new OrderService(new StripePaymentProcessor());
var paypalService  = new OrderService(new PayPalPaymentProcessor());

await stripeService.PlaceOrderAsync(99.99m, "card_abc123");
await paypalService.PlaceOrderAsync(49.50m, "token_xyz789");
```

### Implementing Multiple Interfaces

A class can implement **multiple interfaces** (but can only inherit from ONE base class):

```csharp
public interface ILoggable
{
    void Log(string message);
    string LogLevel { get; }
}

public interface IAuditable
{
    DateTime CreatedAt { get; }
    DateTime? LastModifiedAt { get; }
    string ModifiedBy { get; }
}

public interface IExportable
{
    string ExportToCsv();
    string ExportToJson();
}

// This class implements ALL THREE interfaces
public class Transaction : ILoggable, IAuditable, IExportable
{
    // ILoggable:
    public string LogLevel => "Info";
    public void Log(string message) => Console.WriteLine($"[{LogLevel}] {message}");

    // IAuditable:
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? LastModifiedAt { get; private set; }
    public string ModifiedBy { get; private set; } = "System";

    // IExportable:
    public string ExportToCsv()   => $"{CreatedAt:yyyy-MM-dd},{Amount},{Description}";
    public string ExportToJson()  => $@"{{""date"":""{CreatedAt:O}"",""amount"":{Amount}}}";

    // Own properties:
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
}
```

---

## 8. Abstract Classes vs Interfaces — When to Use Which

This is one of the most common questions in OOP. Here's a clear framework:

| | Abstract Class | Interface |
|--|---------------|-----------|
| **Purpose** | Shared implementation + contract | Pure contract |
| **Instantiable?** | No | No |
| **Implementation** | Can have partial implementation | No implementation (C# 8+: optional defaults) |
| **Fields** | Yes | No |
| **Constructor** | Yes | No |
| **Inheritance** | Class can inherit ONE only | Class can implement MANY |
| **Access modifiers** | Full control | Members are always public |
| **Use when** | "IS-A" relationship with shared code | "CAN-DO" capability |

### Decision Framework

```
Does the new type share implementation code with an existing type?
    YES, and they have a strong "is-a" relationship?
        → Use ABSTRACT CLASS (e.g., Dog IS-A Animal)
    
    NO, or it's just a capability?
        → Use INTERFACE (e.g., Dog CAN-DO Speak, CAN-DO Fetch)
```

### Practical Examples

```csharp
// Use ABSTRACT CLASS when:
// "Employee" is a general concept with shared implementation
// You can't just "be" an employee — you're always specifically a FullTimeEmployee or Contractor
public abstract class Employee
{
    public string Name { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }

    // Shared implementation — all employees get paid somehow
    public abstract decimal CalculatePay();  // Must be implemented differently for each type

    // Shared implementation — same for all
    public void ClockIn() => Console.WriteLine($"{Name} clocked in at {DateTime.Now:HH:mm}");
}

// Use INTERFACE when defining capabilities that can apply to unrelated types:
// A Dog, a Parrot, and a Person can all speak — but they're not related in a class hierarchy
public interface ISpeakable { string Speak(); }
public interface ISwimmable  { void Swim(); }
public interface IFlyable    { void Fly(); }

// Duck can fly, swim — but is not an "abstract animal with shared code"
public class Duck : Animal, ISpeakable, ISwimmable, IFlyable
{
    public string Speak() => "Quack!";
    public void Swim()    => Console.WriteLine("Duck is swimming.");
    public void Fly()     => Console.WriteLine("Duck is flying.");
    public override string MakeSound() => "Quack quack!";
}
```

### Common Mistakes in OOP

| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| Public fields instead of properties | Can't add validation later without breaking API | Always use properties with `{ get; set; }` |
| Not sealing classes that should be final | Unintended inheritance creates fragile hierarchies | Add `sealed` to concrete classes that shouldn't be extended |
| Overusing inheritance ("is-a" abuse) | Tight coupling, fragile code | Prefer composition over inheritance when in doubt |
| Forgetting `override` keyword | Compiler warning, hides base method instead of overriding | Always use `override` for virtual/abstract method replacements |
| Interface with too many members | Clients must implement everything even if unused | Split large interfaces into smaller ones (Interface Segregation Principle) |

---

## 🧪 Practice Labs

### Lab 1 — Class Hierarchy: Person → Student (30 min)
1. Create an `abstract class Person` with:
   - Properties: `Name` (string), `Age` (int)
   - Abstract method: `string GetDescription()`
   - Non-abstract method: `void Greet()` that prints a greeting using Name
2. Create a `Student` class inheriting from `Person`:
   - Add property: `string Major`
   - Add property: `double GPA`
   - Override `GetDescription()` to return `"{Name} — {Major} student, GPA: {GPA:F1}"`
3. Create a `GraduateStudent` class inheriting from `Student`:
   - Add property: `string ThesisTitle`
   - Override `GetDescription()` to call `base.GetDescription()` and append the thesis title
4. In `Program.cs`, create instances of all three types, put them in a `List<Person>`, and call `GetDescription()` on each.

### Lab 2 — Interface: IRepository<T> (30 min)
1. Create an `IRepository<T>` interface with:
   - `void Add(T item)`
   - `T? GetById(int id)`
   - `List<T> GetAll()`
   - `void Remove(int id)`
2. Create a `Product` class with `Id`, `Name`, and `Price`.
3. Create an `InMemoryProductRepository : IRepository<Product>` that stores products in a private `List<Product>`.
4. In `Program.cs`, declare a variable of type `IRepository<Product>` pointing to your implementation. Add products, get by ID, remove one, and print all.

---

## 📝 Assignment: FinanceTracker Project — Part 2

Apply OOP to refactor the FinanceTracker console app.

### Requirements

**Step 1 — Abstract Base Class**
1. Refactor `Transaction` into an `abstract class`:
   ```csharp
   public abstract class Transaction(decimal Amount, string Description, DateTime Date)
   {
       public decimal Amount { get; } = Amount;
       public string Description { get; } = Description;
       public DateTime Date { get; } = Date;
       
       // Every transaction type must provide its own detailed description
       public abstract void PrintDetails();
       
       // Shared helper method
       public string GetFormattedAmount() => Amount >= 0 ? $"+{Amount:C}" : $"{Amount:C}";
   }
   ```

2. Create `Income : Transaction`:
   - Add `string Source` property (e.g., "Salary", "Freelance")
   - Constructor: `Income(decimal amount, string description, string source) : base(amount, description, DateTime.Now)`
   - Override `PrintDetails()` → `[INCOME] {GetFormattedAmount()} from {Source} — {Description}`

3. Create `Expense : Transaction`:
   - Add `string Category` property (e.g., "Food", "Transport", "Entertainment")
   - Constructor: `Expense(decimal amount, string description, string category) : base(-Math.Abs(amount), description, DateTime.Now)`
   - Override `PrintDetails()` → `[EXPENSE] {GetFormattedAmount()} ({Category}) — {Description}`

**Step 2 — Update Program.cs**
4. Change your `List<Transaction>` loop to ask the user: "Enter (1) Income or (2) Expense".
5. Instantiate the correct derived class based on input.
6. Call `PrintDetails()` on every transaction in the list.

Expected output:
```
Type (1=Income, 2=Expense): 1
Amount: 3000
Description: Monthly salary
Source: Job
Added: [INCOME] +$3,000.00 from Job — Monthly salary

Type (1=Income, 2=Expense): 2
Amount: 45.50
Description: Lunch
Category: Food
Added: [EXPENSE] -$45.50 (Food) — Lunch

─── All Transactions ───
[INCOME]  +$3,000.00 from Job — Monthly salary
[EXPENSE] -$45.50    (Food) — Lunch

Balance: $2,954.50
```

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| C# OOP Tutorial | https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop/ |
| Abstract Classes | https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/abstract |
| Interfaces | https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/interface |

---

## 📌 Key Takeaways

- **The four OOP pillars**: Encapsulation (hide internals), Inheritance (build on existing), Polymorphism (many forms), Abstraction (focus on what, not how)
- **Classes** are blueprints; **objects** are instances — each object has its own independent state
- **Properties** are the idiomatic C# way to expose data; use `{ get; private set; }` for encapsulation
- **Access modifiers** control visibility: `private` (class only) → `protected` (+ subclasses) → `internal` (+ same project) → `public` (anywhere)
- **`virtual`** allows overriding; **`override`** replaces the base implementation; **`abstract`** mandates an override in derived classes
- **Abstract classes** = shared code + required contracts; cannot be instantiated directly
- **Interfaces** = pure contracts with no shared implementation; a class can implement many interfaces
- Use **abstract classes** for "IS-A" with shared code; use **interfaces** for "CAN-DO" capabilities across unrelated types

---

**Next Lecture:** [Lecture 35 — Collections, Generics & LINQ](./35%20-%20Collections,%20Generics%20%26%20LINQ.md)