using System;
using System.Collections.Generic;

namespace FinanceTracker
{
    // TODO: Define the Transaction class using a C# 12 Primary Constructor
    // Requirements:
    // - Primary constructor parameters: decimal Amount, string Description, string Category
    // - Expose read-only properties (Amount, Description, Category) initialized from the constructor parameters
    // - Expose a read-only Date property (DateTime) initialized to DateTime.Now
    /*
    public class Transaction(...)
    {
        ...
    }
    */

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== FinanceTracker Part 1 ===");

            // TODO: Initialize a List<Transaction> to store transactions
            

            // TODO: Start a while loop that prompts the user for transactions
            while (true)
            {
                Console.Write("Enter amount (or type 'done' to finish): ");
                string? amountInput = Console.ReadLine();

                // TODO: Check if the user typed "done" (case-insensitive) to break the loop
                if (amountInput != null && amountInput.Equals("done", StringComparison.OrdinalIgnoreCase))
                {
                    break;
                }

                // TODO: Parse the amount safely using decimal.TryParse()
                // Prompt user for description and category
                // Create a new Transaction object and add it to the list
                
                Console.Write("Enter description: ");
                string description = Console.ReadLine() ?? "";

                Console.Write("Enter category: ");
                string category = Console.ReadLine() ?? "";

                // Instantiate and append transaction...
                Console.WriteLine("Transaction added!\n");
            }

            // TODO: Print all transactions using foreach and string interpolation
            Console.WriteLine("\n─── Your Transactions ───");
            

            // TODO: Calculate and print the total balance (sum of all amounts) using string interpolation
            
        }
    }
}
