using System;
using System.Collections.Generic;
using System.Linq;

namespace FinanceTracker.Labs
{
    public enum TransactionType { Income, Expense }
    public record Transaction(decimal Amount, DateTime Date, string Category, TransactionType Type);

    class Lab3FinanceTrackerReporting
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== FinanceTracker LINQ Reporting Lab ===");

            var transactions = new List<Transaction>
            {
                new(5000, new DateTime(2023, 10, 1), "Salary", TransactionType.Income),
                new(1500, new DateTime(2023, 10, 2), "Rent", TransactionType.Expense),
                new(200,  new DateTime(2023, 10, 5), "Groceries", TransactionType.Expense),
                new(100,  new DateTime(2023, 10, 8), "Utilities", TransactionType.Expense),
                new(300,  new DateTime(2023, 10, 12), "Groceries", TransactionType.Expense),
                new(50,   new DateTime(2023, 10, 15), "Entertainment", TransactionType.Expense),
                new(200,  new DateTime(2023, 10, 20), "Side Hustle", TransactionType.Income)
            };

            // TODO: 1. Total Balance
            // Calculate the total balance (sum of Income minus sum of Expenses).
            // Print the result formatted as currency.
            Console.WriteLine("\n--- Total Balance ---");
            

            // TODO: 2. Top Expenses
            // Find the top 3 highest expenses (order by Amount descending) and print them.
            Console.WriteLine("\n--- Top 3 Expenses ---");
            

            // TODO: 3. Category Summary
            // Group the expenses by Category, sum the total spent in each category,
            // and print them ordered by the highest total spending descending.
            Console.WriteLine("\n--- Expense Summary by Category ---");
            
        }
    }
}
