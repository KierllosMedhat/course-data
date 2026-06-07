using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;
using Xunit;

namespace ShopAPI.Tests
{
    // Make sure your main application has a 'public partial class Program' or is accessible to tests
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        // TODO: Define a PostgreSqlContainer using PostgreSqlBuilder
        // Hint: Set the image to "postgres:15-alpine"
        private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
            .WithImage("postgres:15-alpine")
            .WithDatabase("shopapi_test_db")
            .WithUsername("postgres")
            .WithPassword("supersecret")
            .Build();

        public async Task InitializeAsync()
        {
            // TODO: Start the database container asynchronously
            await _dbContainer.StartAsync();
        }

        public new async Task DisposeAsync()
        {
            // TODO: Stop the database container asynchronously
            await _dbContainer.StopAsync();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // TODO: Remove the existing DbContextOptions descriptor for your ShopContext / AppDbContext
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ShopDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // TODO: Register the DbContext using the container's dynamic connection string
                // Hint: Use options.UseNpgsql(_dbContainer.GetConnectionString())
                services.AddDbContext<ShopDbContext>(options =>
                {
                    options.UseNpgsql(_dbContainer.GetConnectionString());
                });

                // TODO: Migrate the database to ensure the schema is up to date
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<ShopDbContext>();
                db.Database.Migrate();
            });
        }
    }

    // Mock Context class to satisfy compilation if actual context name varies
    public class ShopDbContext : DbContext
    {
        public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options) { }
    }
}
