// C# BASICS — Lecture 33

using System;

namespace CSharpBasics
{
    class Program
    {
        static void Main(string[] args)
        {
            // ===== 1. VARIABLES & TYPES =====
            int age = 28;
            double salary = 75000.50;
            decimal price = 19.99m; // 'm' suffix for decimal
            bool isEmployed = true;
            string name = "Alice";
            char grade = 'A';

            // var infers the type at compile time
            var city = "London";

            // ===== 2. STRING INTERPOLATION =====
            Console.WriteLine($"Hello, my name is {name} and I live in {city}.");

            // ===== 3. CONTROL FLOW =====
            if (age >= 18)
            {
                Console.WriteLine("Adult");
            }
            else
            {
                Console.WriteLine("Minor");
            }

            // Switch expression (C# 8+)
            string dayType = DateTime.Now.DayOfWeek switch
            {
                DayOfWeek.Saturday or DayOfWeek.Sunday => "Weekend",
                _ => "Weekday"
            };
            Console.WriteLine($"Today is a {dayType}.");

            // ===== 4. LOOPS =====
            Console.WriteLine("For Loop:");
            for (int i = 0; i < 3; i++)
            {
                Console.WriteLine(i);
            }

            Console.WriteLine("Foreach Loop:");
            string[] colors = { "Red", "Green", "Blue" };
            foreach (var color in colors)
            {
                Console.WriteLine(color);
            }

            // ===== 5. METHODS =====
            int sum = Add(5, 10);
            Console.WriteLine($"5 + 10 = {sum}");
        }

        // A static method belongs to the class itself, not an instance
        static int Add(int a, int b)
        {
            return a + b;
        }
    }
}
