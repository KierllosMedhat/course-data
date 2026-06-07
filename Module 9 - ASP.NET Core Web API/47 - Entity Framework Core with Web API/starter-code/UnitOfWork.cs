using System.Threading.Tasks;
using ShopAPI.Assignment.Data;
using ShopAPI.Assignment.Models;

namespace ShopAPI.Assignment.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ShopContext _context;

        // TODO: Define private backings or auto-implemented properties for Products and Categories repositories
        
        public UnitOfWork(ShopContext context)
        {
            _context = context;
            // TODO: Instantiate GenericRepository<Product> and GenericRepository<Category>
        }

        public async Task<int> CompleteAsync()
        {
            // TODO: Save changes asynchronously using _context
            return 0;
        }

        public void Dispose()
        {
            // TODO: Dispose context
        }
    }
}
