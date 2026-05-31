# Lecture 37 — Entity Framework Core: Database Access

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain what an ORM (Object-Relational Mapper) is.
- Set up EF Core 10 with a `DbContext` and `DbSet<T>`.
- Use Code-First Migrations to create and update database schemas.
- Configure models with Data Annotations and the Fluent API.
- Perform CRUD operations asynchronously.
- Query related data using Eager Loading (`Include`).
- Use `AsNoTracking()` for read-only performance optimizations.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. ORM Concepts: What is EF Core?
2. Setting up `DbContext` and `DbSet`
3. Code-First Migrations Workflow
4. Model Configuration: Annotations vs Fluent API
5. Async CRUD Operations
6. Querying Related Data

### Part 2 — Practice / Lab (~90–120 min)
1. Setup EF Core with SQLite
2. Create migrations for a basic domain model
3. FinanceTracker Project Part 5: EF Core Integration

---

## 1. What is an ORM?

An **Object-Relational Mapper** (ORM) bridges your object-oriented C# code with a relational database (SQL Server, SQLite, PostgreSQL). You manipulate C# objects, and EF Core automatically generates and executes the SQL for you!

```csharp
// Instead of writing SELECT * FROM Products WHERE Price > 100
var expensive = await context.Products.Where(p => p.Price > 100).ToListAsync();
```

---

## 2. EF Core Setup

### Step 1: Define Entities
```csharp
public class Blog
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<Post> Posts { get; set; } = new(); 
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int BlogId { get; set; } // Foreign Key
    public Blog Blog { get; set; } = null!; // Navigation Property
}
```

### Step 2: Create DbContext
```csharp
public class BloggingContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Post> Posts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite("Data Source=blogging.db");
}
```

---

## 3. Code-First Migrations

Instead of manually writing `CREATE TABLE` scripts, EF Core inspects your C# classes and generates the SQL for you!

### Installation
You need the EF Core CLI tools:
```bash
dotnet tool install --global dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

### Workflow
```bash
# 1. Create a migration (Snapshot of your current classes)
dotnet ef migrations add InitialCreate

# 2. Apply it to the database!
dotnet ef database update
```

---

## 4. Model Configuration

You can configure your database schema using attributes (Data Annotations) or code (Fluent API).

### Data Annotations
```csharp
public class User
{
    [Key] // Primary Key
    public int UserId { get; set; }

    [Required] 
    [MaxLength(100)]
    public string Username { get; set; }
}
```

### Fluent API (`OnModelCreating`)
More powerful, keeps entity classes clean!
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<User>()
        .Property(u => u.Username)
        .IsRequired()
        .HasMaxLength(100);
        
    modelBuilder.Entity<User>()
        .HasIndex(u => u.Username)
        .IsUnique();
}
```

---

## 5. Async CRUD Operations

### Create
```csharp
var blog = new Blog { Name = "My Tech Blog" };
context.Blogs.Add(blog);
await context.SaveChangesAsync(); // Executes the INSERT
```

### Read
```csharp
var blog = await context.Blogs.FindAsync(1); // Lookup by Primary Key
var list = await context.Blogs.Where(b => b.Name.Contains("Tech")).ToListAsync();
```

### Update
```csharp
// 1. Fetch
var blog = await context.Blogs.FindAsync(1);
// 2. Modify
blog.Name = "Updated Name";
// 3. Save (EF tracks changes automatically!)
await context.SaveChangesAsync(); 
```

### Delete
```csharp
var blog = await context.Blogs.FindAsync(1);
context.Blogs.Remove(blog);
await context.SaveChangesAsync();
```

---

## 6. Querying Related Data

### Eager Loading (`Include`)
If you want EF Core to fetch a Blog AND all of its Posts in one query:
```csharp
var blogsWithPosts = await context.Blogs
    .Include(b => b.Posts)
    .ToListAsync();
```

### `AsNoTracking()`
If you only need to **read** data and display it (no updates), tell EF Core not to track changes. This is significantly faster!
```csharp
var readonlyBlogs = await context.Blogs
    .AsNoTracking()
    .ToListAsync();
```

---

## 🧪 Practice Labs

### Lab 1 — Code-First Setup (30 min)
1. Create a Console App.
2. Add the EF Core SQLite and Design packages.
3. Create a `User` class and an `AppDbContext`.
4. Run `dotnet ef migrations add InitialCreate` and `dotnet ef database update`.

### Lab 2 — CRUD Operations (30 min)
1. Add a new `User` to the database and `SaveChangesAsync`.
2. Query the user back out using LINQ.
3. Update the user's name.
4. Delete the user.

---

## 📝 Assignment: FinanceTracker Project — Part 5

Replace our JSON file storage with a real SQLite Database!

### Requirements
1. Install `Microsoft.EntityFrameworkCore.Sqlite` and `Microsoft.EntityFrameworkCore.Design`.
2. Create a `FinanceContext` inheriting from `DbContext`.
3. Add a `DbSet<Transaction> Transactions { get; set; }`.
4. Run migrations to generate the database.
5. Update your `StorageService` (or replace it with the DbContext directly in Program.cs) to use EF Core for loading and saving transactions!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| EF Core Documentation | https://learn.microsoft.com/en-us/ef/core/ |
| Migrations Overview | https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/ |

---

## 📌 Key Takeaways
- **EF Core 10** is the standard ORM for .NET.
- **DbContext** manages connections, tracks changes, and executes SQL.
- **Code-First Migrations** evolve the schema from C# code.
- **`Include`** pre-loads related data; **`AsNoTracking`** optimises reads.
- Always use **async** operations (`SaveChangesAsync`, `ToListAsync`).

---

**Next Lecture:** [Lecture 38 — Advanced C# — Delegates, Events, Reflection & Patterns](./38%20-%20Advanced%20C%23%20%E2%80%94%20Delegates,%20Events,%20Reflection%20%26%20Patterns.md)