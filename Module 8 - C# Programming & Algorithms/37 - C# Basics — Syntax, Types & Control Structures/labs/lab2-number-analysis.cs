using System;

namespace CSharpBasics.Labs
{
    class Lab2NumberAnalysis
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Number Analysis Program ===");

            // TODO: 1. Ask the user for a positive integer
            Console.Write("Enter a positive integer: ");
            string? input = Console.ReadLine();

            // Parse the input and validate it is positive
            if (int.TryParse(input, out int number) && number > 0)
            {
                // TODO: 2. Determine and display whether the number is even or odd (use % 2)


                // TODO: 3. Compute the factorial of the number (use a loop; guard against numbers > 20 to prevent overflow)
                // Note: use long or double for factorial storage as numbers grow fast.
                if (number > 20)
                {
                    Console.WriteLine("Factorial calculation is guarded for numbers > 20 to avoid overflow.");
                }
                else
                {
                    // Compute factorial...
                }

                // TODO: 4. Determine whether the number is prime (check divisibility from 2 to Math.Sqrt(number))
                bool isPrime = true;
                if (number == 1) isPrime = false;
                
                // Implement loop to check for prime...

                // TODO: 5. Display the results using string interpolation
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a valid positive integer.");
            }
        }
    }
}
