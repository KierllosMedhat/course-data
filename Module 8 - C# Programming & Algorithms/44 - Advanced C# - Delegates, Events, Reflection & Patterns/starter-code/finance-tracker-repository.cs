using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Lecture44.Assignments
{
    // The Database Entity representation (Keep this mutable for EF tracking)
    public class Transaction
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; }
        public string Type { get; set; } // "Income" or "Expense"
    }

    // TODO: Step 3: Immutability via Records
    // Convert your DTO from a class to a record.
    public record TransactionDTO(int Id, string Description, decimal Amount, DateTime Date, string Category, string Type);

    // TODO: Step 1: Implement the Repository Pattern
    public interface ITransactionRepository
    {
        Task<IEnumerable<TransactionDTO>> GetAllAsync();
        Task AddAsync(TransactionDTO dto);
        Task DeleteAsync(int id);
    }

    public class EfTransactionRepository : ITransactionRepository
    {
        private readonly FinanceDbContext _context;

        public EfTransactionRepository(FinanceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TransactionDTO>> GetAllAsync()
        {
            // TODO: Fetch from DbContext, use AsNoTracking() for read safety, and map to DTO records
            return new List<TransactionDTO>();
        }

        public async Task AddAsync(TransactionDTO dto)
        {
            // TODO: Map DTO record to Transaction Entity and add to DbContext, then call SaveChangesAsync
        }

        public async Task DeleteAsync(int id)
        {
            // TODO: Retrieve entity by id, remove from DbContext, then call SaveChangesAsync
        }
    }

    // TODO: Step 2: Extension Methods for Financial Math
    public static class FinanceExtensions
    {
        // TODO: Implement the CalculateNetBalance extension method on IEnumerable<TransactionDTO>
        public static decimal CalculateNetBalance(this IEnumerable<TransactionDTO> transactions)
        {
            // Sum incomes and subtract expenses
            return 0m;
        }
    }

    // Simple DbContext for testing the assignment
    public class FinanceDbContext : DbContext
    {
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=financerepository.db");
        }
    }

    public class Program
    {
        private readonly ITransactionRepository _repository;

        // Constructor injection of the Repository Interface
        public Program(ITransactionRepository repository)
        {
            _repository = repository;
        }

        public async Task RunAsync()
        {
            Console.WriteLine("Adding sample transactions through repository...");

            await _repository.AddAsync(new TransactionDTO(0, "Monthly Salary", 5000m, DateTime.Now, "Job", "Income"));
            await _repository.AddAsync(new TransactionDTO(0, "House Rent", 1200m, DateTime.Now, "Housing", "Expense"));
            await _repository.AddAsync(new TransactionDTO(0, "Electricity Bill", 150m, DateTime.Now, "Utilities", "Expense"));

            var transactions = await _repository.GetAllAsync();

            // TODO: Use the extension method CalculateNetBalance to display the Net Balance
            decimal netBalance = transactions.CalculateNetBalance();
            Console.WriteLine($"Net Balance: {netBalance:C}");
        }

        public static async Task Main(string[] args)
        {
            Console.WriteLine("Finance Tracker Repository Refactoring");

            using (var db = new FinanceDbContext())
            {
                db.Database.EnsureDeleted();
                db.Database.EnsureCreated();

                ITransactionRepository repo = new EfTransactionRepository(db);
                Program app = new Program(repo);

                await app.RunAsync();
            }
        }
    }
}
