using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Lecture42.Labs
{
    // TODO: Step 1: Implement the Student class
    public class Student
    {
        public int Id { get; set; }

        // TODO: Step 2: Decorate FullName to map to JSON property called "name"
        public string FullName { get; set; }

        public double GPA { get; set; }

        // TODO: Step 3: Decorate SecretPassword to be ignored completely during serialization
        public string SecretPassword { get; set; }

        public DateTime EnrollmentDate { get; set; }
    }

    public class Lab2JsonSerialization
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Lab 2: JSON Serialization Deep Dive");

            // TODO: Step 4: Instantiate a list of 3 students with sample data (including password, GPA, etc.)
            List<Student> students = new List<Student>();

            // TODO: Step 5: Configure JsonSerializerOptions with WriteIndented = true and CamelCase naming policy
            JsonSerializerOptions options = null;

            // TODO: Step 6: Serialize the list to a JSON string and print it to the console
            string jsonString = "";
            Console.WriteLine("Serialized JSON:");
            Console.WriteLine(jsonString);

            // TODO: Step 7: Deserialize the JSON string back into a List<Student>
            // Loop through it, printing their names and enrollment dates to verify
            Console.WriteLine("\nDeserialized Students:");
        }
    }
}
