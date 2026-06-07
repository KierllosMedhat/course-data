using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Lecture43.Assignments
{
    // TODO: Define the Transaction Entity
    public class Transaction
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; }
        
        // Audit/Soft-Delete Property
        public bool IsDeleted { get; set; }
    }

    // TODO: Implement the DbContext using the Fluent API
    public class FinanceDbContext : DbContext
    {
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=financetracker.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // TODO: Requirement 1 & 2: Configure the model with Fluent API (No Data Annotations allowed!)
            // - Map to table "Transactions"
            // - Map primary key "Id"
            // - Enforce MaxLength(100) on the "Description" property
            
            // TODO: Requirement 3: Set up a Global Query Filter to automatically hide soft-deleted records (IsDeleted == true)
            // modelBuilder.Entity<Transaction>().HasQueryFilter(...);
        }
    }

    // TODO: Implement the EF-based Transaction Repository / Service
    public class TransactionService
    {
        private readonly FinanceDbContext _context;

        public TransactionService(FinanceDbContext context)
        {
            _context = context;
        }

        // TODO: Requirement 4: Retrieve all active transactions using .AsNoTracking()
        public async Task<List<Transaction>> GetActiveTransactionsAsync()
        {
            return new List<Transaction>();
        }

        public async Task AddTransactionAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        // TODO: Soft Delete implementation (instead of physical deletion)
        public async Task SoftDeleteTransactionAsync(int id)
        {
            var tx = await _context.Transactions.FindAsync(id);
            if (tx != null)
            {
                // Toggle soft-delete field and save changes
                tx.IsDeleted = true;
                await _context.SaveChangesAsync();
            }
        }

        // TODO: Requirement 5: Calculate Sum of active transactions grouped by Category or Income vs Expense
        // Make sure calculation runs ON THE SERVER using LINQ aggregate methods like .SumAsync()
        public async Task<decimal> GetTotalAmountAsync()
        {
            return 0m;
        }
    }

    public class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Finance Tracker EF Core Integration");

            using (var db = new FinanceDbContext())
            {
                // Ensure clean database state
                db.Database.EnsureDeleted();
                db.Database.EnsureCreated();

                var service = new TransactionService(db);

                // Add sample transactions
                await service.AddTransactionAsync(new Transaction
                {
                    Description = "Salary payment",
                    Amount = 3000.00m,
                    Category = "Income",
                    Date = DateTime.Now,
                    IsDeleted = false
                });

                await service.AddTransactionAsync(new Transaction
                {
                    Description = "Grocery shopping",
                    Amount = -150.50m,
                    Category = "Groceries",
                    Date = DateTime.Now,
                    IsDeleted = false
                });

                // Retrieve and output transactions
                var list = await service.GetActiveTransactionsAsync();
                Console.WriteLine($"Active transactions count: {list.Count}");

                // Get summary
                decimal total = await service.GetTotalAmountAsync();
                Console.WriteLine($"Total balance: {total:C}");
            }
        }
    }
}
