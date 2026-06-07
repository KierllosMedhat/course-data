using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Lecture43.Labs
{
    public class ProfilerStudent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CourseId { get; set; }
        public ProfilerCourse Course { get; set; }
    }

    public class ProfilerCourse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<ProfilerStudent> Students { get; set; } = new List<ProfilerStudent>();
    }

    public class ProfilerContext : DbContext
    {
        public DbSet<ProfilerCourse> Courses { get; set; }
        public DbSet<ProfilerStudent> Students { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseSqlite("Data Source=profiler.db")
                // TODO: Step 2: Configure logging to output SQL queries to the console
                .LogTo(Console.WriteLine, LogLevel.Information);
        }
    }

    public class Lab2NPlusOneSplitQueries
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Lab 2: The N+1 Profiler & Split Queries");

            using (var db = new ProfilerContext())
            {
                db.Database.EnsureDeleted();
                db.Database.EnsureCreated();

                Console.WriteLine("Seeding database with 1 course and 5,000 students (please wait)...");
                var course = new ProfilerCourse { Title = "Advanced C# and Algorithms" };
                
                var studentsList = new List<ProfilerStudent>();
                for (int i = 1; i <= 5000; i++)
                {
                    studentsList.Add(new ProfilerStudent { Name = $"Student {i}", Course = course });
                }

                db.Courses.Add(course);
                db.Students.AddRange(studentsList);
                db.SaveChanges();
                Console.WriteLine("Seed completed.");
            }

            Console.WriteLine("\n--- Scenario A: Accessing relationship WITHOUT Eager Loading (triggers N+1 problem or throws exception) ---");
            using (var db = new ProfilerContext())
            {
                // TODO: Step 3: Fetch course and try to access Students. Observe SQL output or exceptions.
                // var course = db.Courses.FirstOrDefault();
                // Console.WriteLine($"Course: {course.Title}, Students Count: {course.Students.Count}");
            }

            Console.WriteLine("\n--- Scenario B: Eager Loading WITH .Include() ---");
            using (var db = new ProfilerContext())
            {
                // TODO: Step 4: Fetch course with .Include(c => c.Students). Note the single JOIN query emitted.
                // var courseWithStudents = db.Courses.Include(c => c.Students).FirstOrDefault();
            }

            Console.WriteLine("\n--- Scenario C: Split Query WITH .AsSplitQuery() ---");
            using (var db = new ProfilerContext())
            {
                // TODO: Step 5: Append .AsSplitQuery() to the Include query. Note how EF Core emits two simpler queries.
                // var courseWithSplitQuery = db.Courses.Include(c => c.Students).AsSplitQuery().FirstOrDefault();
            }
        }
    }
}
