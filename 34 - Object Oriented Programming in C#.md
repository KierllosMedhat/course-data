# Lecture 34 — Object-Oriented Programming in C#

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Define classes with fields, properties (auto, init, `field` keyword), and methods
- Construct objects with parameterised and primary constructors
- Apply encapsulation with access modifiers (`public` through `private`)
- Build inheritance hierarchies with `virtual`, `override`, and `abstract`
- Implement interfaces

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Classes & Objects: Fields, properties
2. Constructors & Methods
3. Encapsulation: Access Modifiers
4. Inheritance: Base/Derived classes, `virtual`, `override`, `abstract`
5. Interfaces vs Abstract Classes

### Part 2 — Practice / Lab (~90–120 min)
1. Class hierarchy: Person → Student
2. Interface-based repository pattern
3. FinanceTracker Project Part 2: OOP & Inheritance

---

## 1. Classes & Objects

A **class** is a blueprint; an **object** is an instance of that blueprint.

```csharp
public class Person
{
    // C# 14 'field' keyword for property validation
    public int Age
    {
        get => field;
        set
        {
            if (value < 0) throw new ArgumentException("Age cannot be negative");
            field = value;
        }
    }

    // Auto-implemented property
    public string Email { get; set; }

    // Init-only property (immutable after construction)
    public string Name { get; init; }

    // Expression-bodied method
    public string GetGreeting() => $"Hi, I'm {Name}";
}
```

---

## 2. Constructors & Methods

```csharp
public class Calculator
{
    // Method Overloading
    public int Add(int a, int b) => a + b;
    public double Add(double a, double b) => a + b;
}
```

### Primary Constructors
C# 12+ allows defining the constructor directly on the class name:
```csharp
public class Person(string name, int age)
{
    public string Name { get; } = name;
    public int Age { get; } = age;
}
```

---

## 3. Encapsulation — Access Modifiers

| Modifier | Same Class | Derived Class | Anywhere |
|----------|-----------|---------------|----------|
| `public` | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ❌ |
| `private` (default) | ✅ | ❌ | ❌ |

> [!TIP]
> Default for class members is `private`. Start with the most restrictive access and widen only as needed.

---

## 4. Inheritance

```csharp
public class Animal
{
    public string Name { get; set; }
    
    // virtual allows the method to be overridden
    public virtual string MakeSound() => "Some generic sound";
}

public class Dog : Animal
{
    // override replaces the base implementation
    public override string MakeSound() => "Woof!";
}
```

### Abstract Classes
If a class is `abstract`, you cannot instantiate it directly.
```csharp
public abstract class Shape
{
    public abstract double GetArea(); // MUST be overridden by derived classes
}

public class Circle : Shape
{
    public double Radius { get; set; }
    public override double GetArea() => Math.PI * Radius * Radius;
}
```

---

## 5. Interfaces

An interface defines a **contract**. Any class that implements the interface must provide the code for those methods/properties.

```csharp
public interface ITransaction
{
    decimal Amount { get; }
    DateTime Date { get; }
    void Execute();
}

public class Withdrawal : ITransaction
{
    public decimal Amount { get; }
    public DateTime Date { get; }
    
    public Withdrawal(decimal amount)
    {
        Amount = amount;
        Date = DateTime.Now;
    }
    
    public void Execute() => Console.WriteLine($"Withdrew {Amount:C}");
}
```

---

## 🧪 Practice Labs

### Lab 1 — Class Hierarchy (30 min)
1. Create an abstract `Person` class with `Name`, `Age`, and an abstract `GetDescription()` method.
2. Create a `Student` class that inherits from `Person` and adds a `Major` property.
3. Override `GetDescription()` in `Student`.

### Lab 2 — Interface (30 min)
1. Create an `IRepository<T>` interface with `void Add(T item)` and `List<T> GetAll()`.
2. Create an `InMemoryRepository<T>` that implements it using a private `List<T>`.

---

## 📝 Assignment: FinanceTracker Project — Part 2

Let's apply OOP to our FinanceTracker!

### Requirements
1. Refactor your `Transaction` class into an `abstract class`. It should have `Amount`, `Description`, and `Date`.
2. Create an abstract method `public abstract void PrintDetails();` inside `Transaction`.
3. Create two derived classes: `Income` and `Expense`.
   - `Income` should have a `Source` property.
   - `Expense` should have a `Category` property.
4. Override `PrintDetails()` in both classes to print out their specific data (e.g. `[INCOME] $500 from Salary - Sept Paycheck`).
5. In `Program.cs`, update your loop to ask the user if they are entering an Income (1) or Expense (2). Instantiate the correct derived class and add it to a `List<Transaction>`.
6. Loop through the list and call `PrintDetails()` on every transaction!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| C# OOP Tutorial | https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop/ |

---

## 📌 Key Takeaways
- **Classes** are blueprints; **objects** are instances.
- **Properties** are the idiomatic way to expose data in C#.
- **Primary constructors** reduce boilerplate for simple classes.
- **`virtual/override`** enables polymorphic dispatch; **`abstract`** forces implementation.
- **Interfaces** define contracts without implementation.

---

**Next Lecture:** [Lecture 35 — Collections, Generics & LINQ](./35%20-%20Collections,%20Generics%20%26%20LINQ.md)