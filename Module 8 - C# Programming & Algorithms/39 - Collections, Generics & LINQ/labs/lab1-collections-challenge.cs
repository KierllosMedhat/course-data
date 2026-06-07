using System;
using System.Collections.Generic;
using System.Linq;

namespace CollectionsGenericsLinq.Labs
{
    class Lab1CollectionsChallenge
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Collection Operations Challenge ===");

            // Starter Data
            var students = new List<(string Name, string Major, double GPA, int Year)>
            {
                ("Alice",   "Computer Science", 3.9, 3),
                ("Bob",     "Mathematics",      3.2, 2),
                ("Charlie", "Computer Science", 3.7, 4),
                ("Diana",   "Physics",          3.5, 1),
                ("Eve",     "Computer Science", 2.9, 2),
                ("Frank",   "Mathematics",      3.8, 3),
            };

            // TODO: 1. Find all "Computer Science" students with GPA >= 3.5, ordered by GPA descending.
            Console.WriteLine("1. Computer Science students with GPA >= 3.5 (Sorted descending):");
            // var csStudents = ...
            

            // TODO: 2. Calculate the average GPA of all students.
            Console.WriteLine("\n2. Average GPA of all students:");
            // double averageGpa = ...
            

            // TODO: 3. Determine if all Year 4 students have a GPA above 3.5.
            Console.WriteLine("\n3. Do all Year 4 students have GPA > 3.5?");
            // bool allYear4AboveThreePointFive = ...
            

            // TODO: 4. Challenge: Create a dictionary grouping students by Major.
            Console.WriteLine("\n4. Students grouped by Major:");
            // Dictionary<string, List<(string Name, string Major, double GPA, int Year)>> groupedByMajor = ...
            
        }
    }
}
