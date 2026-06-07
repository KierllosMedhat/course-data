using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lecture43.Labs
{
    // TODO: Step 3: Define POCO Entities
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime EnrollmentDate { get; set; }

        // Many-to-Many Navigation Property
        public List<Course> Courses { get; set; } = new List<Course>();
    }

    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Credits { get; set; }

        // Many-to-Many Navigation Property
        public List<Student> Students { get; set; } = new List<Student>();
    }

    // TODO: Step 4: Implement the DbContext class
    public class UniversityContext : DbContext
    {
        public DbSet<Student> Students { get; set; }
        public DbSet<Course> Courses { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Configure to use SQLite database university.db
            optionsBuilder.UseSqlite("Data Source=university.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // EF Core handles many-to-many relationships by convention,
            // but you can configure it explicitly here if needed.
        }
    }

    public class Lab1EfCoreGroundwork
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Lab 1: EF Core Groundwork");

            using (var db = new UniversityContext())
            {
                // Ensure database is clean and created
                db.Database.EnsureDeleted();
                db.Database.EnsureCreated();

                Console.WriteLine("Database created successfully.");

                // TODO: Step 5 & 6: Seed database with sample courses and students and save changes
                var course1 = new Course { Title = "Web Dev 101", Credits = 3 };
                var student1 = new Student { Name = "John Doe", EnrollmentDate = DateTime.Now };

                student1.Courses.Add(course1);
                db.Students.Add(student1);
                
                db.SaveChanges();
                Console.WriteLine("Seeded 1 student and 1 course.");
            }
        }
    }
}
