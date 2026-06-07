using System;
using System.Collections.Generic;

namespace OOP.Labs
{
    // TODO: 1. Create an abstract class Person
    // Requirements:
    // - Properties: Name (string), Age (int)
    // - Abstract method: string GetDescription()
    // - Non-abstract method: void Greet() that prints a greeting using Name
    public abstract class Person
    {
        // Add properties here

        // Add constructor here

        // Add abstract GetDescription method signature

        // Add Greet method
    }

    // TODO: 2. Create a Student class inheriting from Person
    // Requirements:
    // - Properties: Major (string), GPA (double)
    // - Implement GetDescription() overriding the base class abstract method
    public class Student
    {
        // Add properties here

        // Add constructor calling base constructor

        // Override GetDescription()
    }

    // TODO: 3. Create a GraduateStudent class inheriting from Student
    // Requirements:
    // - Property: ThesisTitle (string)
    // - Override GetDescription() to call base.GetDescription() and append the ThesisTitle
    public class GraduateStudent
    {
        // Add property here

        // Add constructor calling base constructor

        // Override GetDescription()
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Class Hierarchy Lab ===");

            // TODO: 4. Create instances of Student and GraduateStudent
            // Create a List<Person> and add the instances
            // Iterate through the list and print Greet() and GetDescription() for each
        }
    }
}
