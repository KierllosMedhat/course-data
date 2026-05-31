// ENTITY FRAMEWORK CORE — Lecture 37
/*
  Note: This file is a conceptual example. To run it, you would need to:
  1. Add EF Core packages:
     dotnet add package Microsoft.EntityFrameworkCore.Sqlite
     dotnet add package Microsoft.EntityFrameworkCore.Design
  2. Create migrations:
     dotnet ef migrations add InitialCreate
  3. Update database:
     dotnet ef database update
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace EfCoreBasics
{
    // ===== 1. ENTITIES (Models) =====
    public class User
    {
        public int Id { get; set; } // Primary Key by convention
        public string Name { get; set; }
        public string Email { get; set; }
        
        // Navigation property (One-to-Many)
        public List<Post> Posts { get; set; } = new List<Post>();
    }

    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        
        // Foreign Key
        public int UserId { get; set; }
        public User User { get; set; }
    }

    // ===== 2. DB CONTEXT =====
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Using SQLite for demonstration
            optionsBuilder.UseSqlite("Data Source=app.db");
        }
    }

    class Program
    {
        static async Task Main(string[] args)
        {
            using var db = new AppDbContext();
            
            // Create database if it doesn't exist
            await db.Database.EnsureCreatedAsync();

            // ===== 3. CREATE =====
            Console.WriteLine("Adding a user...");
            var newUser = new User { Name = "Alice", Email = "alice@example.com" };
            db.Users.Add(newUser);
            await db.SaveChangesAsync(); // Executes INSERT

            // ===== 4. READ =====
            Console.WriteLine("Querying users...");
            // AsNoTracking() improves performance for read-only queries
            var user = await db.Users
                               .AsNoTracking()
                               .FirstOrDefaultAsync(u => u.Name == "Alice");
            Console.WriteLine($"Found: {user?.Name}");

            // ===== 5. UPDATE =====
            var userToUpdate = await db.Users.FirstOrDefaultAsync();
            if (userToUpdate != null)
            {
                userToUpdate.Email = "alice.new@example.com";
                await db.SaveChangesAsync(); // Executes UPDATE
            }

            // ===== 6. DELETE =====
            /*
            var userToDelete = await db.Users.FindAsync(1);
            if (userToDelete != null)
            {
                db.Users.Remove(userToDelete);
                await db.SaveChangesAsync(); // Executes DELETE
            }
            */
        }
    }
}
