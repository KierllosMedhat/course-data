using System;

namespace CSharpBasics.Labs
{
    class Lab1Calculator
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Console Calculator ===");

            // TODO: Wrap the calculator logic in a while(true) loop that runs until the user types "exit"
            while (true)
            {
                Console.Write("Enter first number (or 'exit'): ");
                string? input1 = Console.ReadLine();

                // TODO: Check if input1 is "exit" (case-insensitive) and break the loop if true
                if (input1 != null && input1.Equals("exit", StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine("Goodbye!");
                    break;
                }

                // TODO: Parse the first number using double.Parse() (or double.TryParse())
                double num1 = 0;
                
                Console.Write("Enter operator (+, -, *, /): ");
                string? op = Console.ReadLine();

                Console.Write("Enter second number: ");
                string? input2 = Console.ReadLine();
                // TODO: Parse the second number using double.Parse() (or double.TryParse())
                double num2 = 0;

                // TODO: Use a switch expression to compute the result based on the operator.
                // Include validation for division by zero (e.g., when operator is '/' and num2 is 0).
                
                /*
                double? result = op switch
                {
                    "+" => num1 + num2,
                    // Add other cases here...
                    _ => null
                };
                */

                // TODO: Print the result or a friendly error message using string interpolation.
            }
        }
    }
}
