# Lecture 37 — Entity Framework Core: Database Access

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain what an ORM (Object-Relational Mapper) is in plain English
- Set up EF Core 10 with a `DbContext` and `DbSet<T>` to map classes to tables
- Use Code-First Migrations to safely create and update database schemas from code
- Configure models with Data Annotations and the Fluent API
- Perform database CRUD operations asynchronously
- Query related data using Eager Loading (`Include`)
- Use `AsNoTracking()` for read-only performance optimizations

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. ORM Concepts: What is EF Core? (The Translator Analogy)
2. Setting up `DbContext` and `DbSet`
3. Code-First Migrations Workflow
4. Model Configuration: Annotations vs Fluent API
5. Async CRUD Operations
6. Querying Related Data & Performance Tricks

### Part 2 — Practice / Lab (~90–120 min)
1. Setup EF Core with SQLite
2. Create migrations for a basic domain model
3. FinanceTracker Project Part 5: EF Core Integration

---

## 1. ORM Concepts: What is EF Core?

### The Real-World Analogy: The Translator

Imagine you are an English speaker (your C# code), and you need to communicate with a worker who only speaks Japanese (the SQL Database). You *could* spend years learning Japanese (writing raw SQL queries as strings), but that takes time, is prone to errors, and distracts you from your main job.

Instead, you hire a **Translator**. You speak in English, and the translator instantly converts your words into perfect Japanese and tells the worker. When the worker responds in Japanese, the translator converts it back to English for you.

An **ORM (Object-Relational Mapper)** is the translator between C# (Objects) and a Database (Relational Tables). 
**Entity Framework Core (EF Core)** is the official, most popular ORM for .NET.

### Why Does This Matter?

Without an ORM, you have to write raw SQL strings:

```csharp
// ❌ The old, painful way (ADO.NET)
string sql = "SELECT * FROM Products WHERE Price > 100 AND Category = 'Electronics'";
SqlCommand cmd = new SqlCommand(sql, connection);
SqlDataReader reader = cmd.ExecuteReader();
while (reader.Read()) 
{
    var product = new Product();
    product.Id = (int)reader["Id"];
    product.Name = (string)reader["Name"];
    // ... tedious manual mapping
}
```

With EF Core, you write C# using LINQ (Language Integrated Query):

```csharp
// ✅ The EF Core way
// EF Core automatically translates this C# into SQL!
List<Product> expensiveElectronics = await context.Products
    .Where(p => p.Price > 100 && p.Category == "Electronics")
    .ToListAsync();
```

---

## 2. Setting up `DbContext` and `DbSet`

To use EF Core, you need two things: **Entities** (your C# classes) and a **DbContext** (the session with the database).

### Step 1: Define Entities

An Entity is just a normal C# class that represents a table in the database.

```csharp
public class Blog
{
    public int Id { get; set; } // EF Core automatically makes a property named "Id" the Primary Key
    public string Name { get; set; } = string.Empty;
    
    // Navigation Property: A Blog has many Posts
    public List<Post> Posts { get; set; } = new(); 
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    
    // Foreign Key: Links this post to a specific Blog
    public int BlogId { get; set; } 
    
    // Navigation Property: The actual Blog object this Post belongs to
    public Blog Blog { get; set; } = null!; 
}
```

### Step 2: Create the DbContext

The `DbContext` is the most important class in EF Core. It represents your connection to the database.

```csharp
using Microsoft.EntityFrameworkCore;

public class BloggingContext : DbContext
{
    // A DbSet represents a Table in the database. 
    // We can query and save instances of Blog/Post through these properties.
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Post> Posts { get; set; }

    // This configures which database provider we are using (SQLite, SQL Server, etc.)
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // For development, SQLite is perfect because it's just a local file
        options.UseSqlite("Data Source=blogging.db");
    }
}
```

---

## 3. Code-First Migrations Workflow

In the past, developers had to manually write SQL scripts (`CREATE TABLE...`) to build the database, and then write C# classes to match.

With **Code-First**, you write the C# classes first. EF Core looks at your classes and automatically generates the `CREATE TABLE` SQL scripts for you. These scripts are called **Migrations**.

### Installation Requirements

To use migrations, you need to install the EF Core CLI tools globally on your machine, and add the design packages to your project.

```bash
# Install the EF Core tools globally (run once per computer)
dotnet tool install --global dotnet-ef

# Add the required NuGet packages to your project
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### The 2-Step Migration Workflow

Whenever you create a new Entity class, or add a property to an existing one, you must run two commands in the terminal:

**1. Create a Migration (The Blueprint):**
This inspects your C# classes and creates a C# file containing instructions on how to build the tables.
```bash
dotnet ef migrations add InitialCreate
```

**2. Update the Database (The Construction):**
This translates the migration blueprint into SQL and runs it against your actual database.
```bash
dotnet ef database update
```

> [!NOTE]
> If you add a new property like `public string AuthorName { get; set; }` to the `Post` class later, you just repeat the process:
> `dotnet ef migrations add AddAuthorNameToPost`
> `dotnet ef database update`

---

## 4. Model Configuration: Annotations vs Fluent API

Sometimes, EF Core's default assumptions aren't what you want. For example, EF Core maps `string` to a database column with unlimited length (e.g., `NVARCHAR(MAX)`). You might want to restrict it to 100 characters.

You can configure your schema in two ways: Data Annotations or the Fluent API.

### Option A: Data Annotations (Attributes)

You place attributes directly on the properties of your Entity class.

```csharp
using System.ComponentModel.DataAnnotations;

public class User
{
    [Key] // Explicitly marks this as the Primary Key
    public int UserId { get; set; }

    [Required] // Makes the column NOT NULL in the database
    [MaxLength(100)] // Restricts the column to 100 characters
    public string Username { get; set; }
}
```

### Option B: Fluent API (`OnModelCreating`)

The Fluent API is written inside the `DbContext`. It keeps your entity classes clean (no database-specific attributes mixed into your business logic) and is far more powerful. **This is the recommended approach for professional applications.**

```csharp
public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }

    // Override OnModelCreating to configure the database schema
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure the User entity
        modelBuilder.Entity<User>()
            .Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(100);
            
        // You can do things with Fluent API that Annotations cannot do, 
        // like creating a Unique Index!
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
    }
}
```

---

## 5. Async CRUD Operations

Because talking to a database involves network or disk I/O, you should **always** use asynchronous methods.

### Create (Insert)

```csharp
using var context = new BloggingContext();

var blog = new Blog { Name = "My Tech Blog" };

// Add tells EF Core to track this new object
context.Blogs.Add(blog);

// SaveChangesAsync actually generates the SQL INSERT statement and runs it
await context.SaveChangesAsync(); 
```

### Read (Select)

```csharp
// FindAsync is the fastest way to look up an entity by its Primary Key
var blog = await context.Blogs.FindAsync(1); 

// For anything else, use LINQ with ToListAsync() or FirstOrDefaultAsync()
var list = await context.Blogs
    .Where(b => b.Name.Contains("Tech"))
    .ToListAsync();
```

### Update

EF Core automatically tracks objects it loads from the database. If you change a property, EF Core knows!

```csharp
// 1. Fetch the object (EF Core starts tracking it)
var blog = await context.Blogs.FindAsync(1);

// 2. Modify the properties
blog.Name = "Updated Tech Blog";

// 3. Save (EF Core sees the change and generates an SQL UPDATE statement automatically!)
await context.SaveChangesAsync(); 
```

### Delete

```csharp
// 1. Fetch the object
var blog = await context.Blogs.FindAsync(1);

// 2. Mark it for deletion
context.Blogs.Remove(blog);

// 3. Save (EF Core generates the SQL DELETE statement)
await context.SaveChangesAsync();
```

---

## 6. Querying Related Data & Performance Tricks

### Eager Loading (`Include`)

By default, if you load a `Blog`, EF Core does **not** load its `Posts`. This is to save bandwidth and memory. If you want the posts too, you must explicitly ask for them using `.Include()`.

```csharp
// This generates a SQL JOIN to fetch the Blog AND its Posts in a single trip
var blogsWithPosts = await context.Blogs
    .Include(b => b.Posts)
    .ToListAsync();

// Now you can safely access the Posts collection
foreach (var post in blogsWithPosts[0].Posts)
{
    Console.WriteLine(post.Title);
}
```

### Read-Only Optimization (`AsNoTracking`)

When EF Core loads data, it sets up "Change Tracking" so it can detect if you modify properties (like in the Update example above). 

Change tracking uses memory and CPU. If you are loading data **only to display it** (like showing a list of products on a webpage) and you have no intention of updating it, you should turn tracking off using `.AsNoTracking()`.

```csharp
// This query runs significantly faster and uses less memory!
var readonlyBlogs = await context.Blogs
    .AsNoTracking()
    .ToListAsync();
```

> [!TIP]
> In read-heavy applications (like most websites), generously using `AsNoTracking()` is one of the easiest ways to massively improve your application's performance.

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Forgetting to call `await context.SaveChangesAsync()` | Adding or modifying objects in the context does nothing to the database until `SaveChangesAsync()` is called. |
| Making synchronous database calls (`.ToList()`) | Always use the async versions (`.ToListAsync()`, `FirstOrDefaultAsync()`) to prevent blocking the thread. |
| Forgetting to use `.Include()` | If you try to access a navigation property without `.Include()`, it will be `null` and throw a `NullReferenceException`. |
| Loading 10,000 records into memory to filter them | Use `.Where()` so the filtering happens in the SQL Database, not in your C# RAM. |
| Modifying the database schema manually | Never edit the database directly. Always update your C# classes, add a migration, and update the database via EF Core. |

---

## 🧪 Practice Labs

### Lab 1 — Code-First Setup (30 min)
1. Create a new Console App.
2. Add the EF Core SQLite and Design NuGet packages.
3. Create a `User` entity class (`Id`, `Username`, `Email`).
4. Create an `AppDbContext` and override `OnConfiguring` to use SQLite.
5. Run `dotnet ef migrations add InitialCreate` and `dotnet ef database update`. Check your project folder for the newly created `.db` file!

### Lab 2 — CRUD Operations (30 min)
1. Write code in `Program.cs` to Add a new `User` to the database and `SaveChangesAsync()`.
2. Write a LINQ query to fetch the user back out of the database and print their name.
3. Update the user's email address and call `SaveChangesAsync()`.
4. Delete the user.

---

## 📝 Assignment: FinanceTracker Project — Part 5

Let's replace our basic JSON file storage with a robust, real SQLite Database using EF Core!

### Requirements
1. Install `Microsoft.EntityFrameworkCore.Sqlite` and `Microsoft.EntityFrameworkCore.Design`.
2. Create a `FinanceContext` class inheriting from `DbContext`.
3. Add a `DbSet<Transaction> Transactions { get; set; }` to the context.
4. Run migrations to generate the `financetracker.db` database.
5. Update your `StorageService` (or replace it entirely):
   - `SaveTransaction` should now use `context.Transactions.Add()` and `SaveChangesAsync()`.
   - `GetTransactions` should use `await context.Transactions.AsNoTracking().ToListAsync()`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| EF Core Official Documentation | https://learn.microsoft.com/en-us/ef/core/ |
| EF Core Migrations | https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/ |
| Querying Data with EF Core | https://learn.microsoft.com/en-us/ef/core/querying/ |

---

## 📌 Key Takeaways
- **EF Core** is an ORM that translates C# objects into SQL database rows.
- **DbContext** is the session with the database; **DbSet** represents a table.
- **Code-First Migrations** allow you to build and evolve your database schema entirely from C# code.
- **Fluent API (`OnModelCreating`)** is preferred over Data Annotations for keeping entity classes clean.
- Always use **Async methods** (`SaveChangesAsync`, `ToListAsync`) for database I/O to maintain application responsiveness.
- Use **`.Include()`** when you need related data, and **`.AsNoTracking()`** when you are reading data without intending to update it.

---

**Next Lecture:** [Lecture 38 — Advanced C# — Delegates, Events, Reflection & Patterns](./38%20-%20Advanced%20C%23%20-%20Delegates,%20Events,%20Reflection%20%26%20Patterns.md)
