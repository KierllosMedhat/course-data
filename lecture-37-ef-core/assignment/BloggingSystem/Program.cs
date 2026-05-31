using System;

// ASSIGNMENT — Blogging System (EF Core)
// Note: You do not need to install the NuGet packages for this assignment;
// simply write the code as if EF Core is installed to practice the syntax.

// TODO: Create a 'Blog' entity class (Id, Url, Rating, List<Post> Posts)

// TODO: Create a 'Post' entity class (Id, Title, Content, BlogId, Blog Blog)

// TODO: Create an 'AppDbContext' class inheriting from DbContext.
// Add DbSets for Blogs and Posts.
// (Optional: override OnConfiguring to set up a dummy SQLite connection string)

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Blogging System Schema Defined");

        // TODO: In comments, write out the LINQ/EF Core code you would use to:
        
        // 1. Add a new Blog to the database
        // using var db = new AppDbContext();
        // ...

        // 2. Retrieve a Blog and INCLUDE its Posts (Eager Loading)
        // var blogWithPosts = ...

        // 3. Update the Rating of a specific Blog
        // ...

        // 4. Delete a Post by its ID
        // ...
    }
}
