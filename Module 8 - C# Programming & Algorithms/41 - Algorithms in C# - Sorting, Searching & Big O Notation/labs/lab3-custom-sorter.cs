using System;
using System.Collections.Generic;

namespace Lecture41.Labs
{
    // TODO: Step 1: Implement the Student class
    // Hint: For Step 4, make it implement IComparable<Student> to use built-in Sort()
    public class Student
    {
        public string Name { get; set; }
        public double Grade { get; set; }

        public Student(string name, double grade)
        {
            Name = name;
            Grade = grade;
        }

        public override string ToString()
        {
            return $"{Name}: {Grade}";
        }
    }

    public class Lab3CustomSorter
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Lab 3: The Custom Sorter");

            // TODO: Step 2: Create a List<Student> with some sample student data
            List<Student> students = new List<Student>
            {
                new Student("Alice", 88.5),
                new Student("Bob", 92.0),
                new Student("Charlie", 79.5),
                new Student("David", 95.0),
                new Student("Eve", 84.0)
            };

            Console.WriteLine("Original List:");
            PrintStudents(students);

            // TODO: Step 3: Implement and run your custom Bubble Sort to sort by Grade descending
            Console.WriteLine("\nSorting using Custom Bubble Sort (Grade descending)...");
            BubbleSortDescending(students);
            PrintStudents(students);

            // TODO: Step 4: Refactor using built-in List.Sort()
            // Make Student implement IComparable<Student> or pass a custom Comparison/IComparer.
            // Sort by Grade descending using built-in methods.
            Console.WriteLine("\nSorting using Built-in List.Sort() (Grade descending)...");
            // students.Sort(...);
            PrintStudents(students);
        }

        // TODO: Implement Bubble Sort to sort List<Student> by Grade descending in-place
        public static void BubbleSortDescending(List<Student> list)
        {
            // Bubble Sort implementation
        }

        private static void PrintStudents(IEnumerable<Student> list)
        {
            foreach (var student in list)
            {
                Console.WriteLine(student);
            }
        }
    }
}
