using Microsoft.EntityFrameworkCore;
using ShopAPI.Assignment.Models;

namespace ShopAPI.Assignment.Data
{
    public class ShopContext : DbContext
    {
        public ShopContext(DbContextOptions<ShopContext> options) : base(options)
        {
        }

        // TODO: Define DbSets for Product and Category entities
        // public DbSet<Product> Products { get; set; }
        // public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // TODO: Configure entity relations or seed data if required
        }
    }
}
