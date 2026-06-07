using System;
using System.Collections.Generic;

namespace FinanceTracker
{
    // TODO: Step 1 - Refactor Transaction into an abstract class using a C# Primary Constructor
    // Requirements:
    // - Parameters: decimal Amount, string Description, DateTime Date
    // - Properties: Amount (decimal), Description (string), Date (DateTime)
    // - Abstract method: void PrintDetails()
    // - Non-abstract helper: string GetFormattedAmount() returning "+$X.XX" or "-$X.XX"
    public abstract class Transaction
    {
        // Add constructor / properties here
        // Add GetFormattedAmount helper
        // Add abstract PrintDetails method signature
    }

    // TODO: Step 2 - Create Income class inheriting from Transaction
    // Requirements:
    // - Constructor: Income(decimal amount, string description, string source) : base(...)
    // - Property: Source (string)
    // - Override PrintDetails() to display INCOME category layout: [INCOME] +$Amount from Source - Description
    public class Income
    {
        // Add properties, constructor, and override PrintDetails
    }

    // TODO: Step 3 - Create Expense class inheriting from Transaction
    // Requirements:
    // - Constructor: Expense(decimal amount, string description, string category) : base(...)
    // - Property: Category (string)
    // - Ensure Amount is stored as negative (e.g. -Math.Abs(amount))
    // - Override PrintDetails() to display EXPENSE category layout: [EXPENSE] -$Amount (Category) - Description
    public class Expense
    {
        // Add properties, constructor, and override PrintDetails
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== FinanceTracker Part 2 ===");

            // List to hold transactions (both Income and Expense)
            List<Transaction> transactions = new List<Transaction>();

            while (true)
            {
                Console.Write("Enter Transaction Type (1=Income, 2=Expense, or type 'done' to exit): ");
                string? typeInput = Console.ReadLine();

                if (typeInput != null && typeInput.Equals("done", StringComparison.OrdinalIgnoreCase))
                {
                    break;
                }

                // TODO: 4. Prompt for details based on input type
                // If type is 1: Prompt for amount, description, source. Create Income object and add to list.
                // If type is 2: Prompt for amount, description, category. Create Expense object and add to list.
                // Handle invalid inputs gracefully.
            }

            Console.WriteLine("\n─── All Transactions ───");
            decimal totalBalance = 0;
            // TODO: 5. Iterate through list, call PrintDetails() on each transaction,
            // and sum up the balances.
            
            // Console.WriteLine($"\nBalance: {totalBalance:C}");
        }
    }
}
