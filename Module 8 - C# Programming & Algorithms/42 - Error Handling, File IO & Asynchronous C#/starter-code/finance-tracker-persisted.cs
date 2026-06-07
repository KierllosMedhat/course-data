using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Lecture42.Assignments
{
    // Simple Transaction representation (adjust fields based on previous parts of the FinanceTracker)
    public class Transaction
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; }
    }

    // TODO: Step 1 & 2 & 3: Implement the StorageService class
    public class StorageService
    {
        private readonly string _filePath = "transactions.json";

        // TODO: Implement SaveTransactionsAsync
        public async Task SaveTransactionsAsync(List<Transaction> transactions)
        {
            // 1. Serialize transactions to JSON with WriteIndented = true
            // 2. Write JSON string to transactions.json using File.WriteAllTextAsync
        }

        // TODO: Implement LoadTransactionsAsync
        public async Task<List<Transaction>> LoadTransactionsAsync()
        {
            // 1. Check if transactions.json exists using File.Exists
            // 2. If it does, read file contents using File.ReadAllTextAsync and deserialize
            // 3. If it doesn't, return a new empty list
            return new List<Transaction>();
        }
    }

    public class Program
    {
        // TODO: Step 4: Make Main method asynchronous (returns Task)
        public static async Task Main(string[] args)
        {
            StorageService storageService = new StorageService();
            List<Transaction> transactions = new List<Transaction>();

            // TODO: Load existing transactions at startup
            Console.WriteLine("Loading transactions from disk...");
            // transactions = await storageService.LoadTransactionsAsync();

            Console.WriteLine($"Loaded {transactions.Count} transactions.");

            // Simple command loop for demonstrating persistence
            bool running = true;
            while (running)
            {
                Console.WriteLine("\n--- Finance Tracker ---");
                Console.WriteLine("1. View Transactions");
                Console.WriteLine("2. Add Transaction");
                Console.WriteLine("3. Save and Exit");
                Console.Write("Choose an option: ");

                string choice = Console.ReadLine();
                switch (choice)
                {
                    case "1":
                        // Display transactions
                        foreach (var t in transactions)
                        {
                            Console.WriteLine($"[{t.Date:yyyy-MM-dd}] {t.Description}: {t.Amount:C} ({t.Category})");
                        }
                        break;
                    case "2":
                        // Add a transaction
                        Console.Write("Enter Description: ");
                        string desc = Console.ReadLine();
                        Console.Write("Enter Amount: ");
                        decimal amount = decimal.Parse(Console.ReadLine());
                        Console.Write("Enter Category: ");
                        string cat = Console.ReadLine();

                        Transaction newTx = new Transaction
                        {
                            Id = transactions.Count + 1,
                            Description = desc,
                            Amount = amount,
                            Category = cat,
                            Date = DateTime.Now
                        };
                        transactions.Add(newTx);

                        // TODO: Save transactions immediately after modifying the list, or do it on exit
                        // await storageService.SaveTransactionsAsync(transactions);
                        Console.WriteLine("Transaction added and saved to disk.");
                        break;
                    case "3":
                        // Save transactions before exit
                        Console.WriteLine("Saving transactions...");
                        await storageService.SaveTransactionsAsync(transactions);
                        running = false;
                        break;
                    default:
                        Console.WriteLine("Invalid option.");
                        break;
                }
            }

            Console.WriteLine("Goodbye!");
        }
    }
}
