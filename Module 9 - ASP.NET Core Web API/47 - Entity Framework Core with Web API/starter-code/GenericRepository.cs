using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ShopAPI.Assignment.Data;

namespace ShopAPI.Assignment.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly ShopContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(ShopContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            // TODO: Implement using FindAsync
            return null;
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            // TODO: Implement using ToListAsync
            return null;
        }

        public async Task<IReadOnlyList<T>> GetPagedAsync(int pageNumber, int pageSize)
        {
            // TODO: Implement Skip and Take for pagination
            // Hint: Use _dbSet.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync()
            return null;
        }

        public async Task<int> CountAsync()
        {
            // TODO: Implement CountAsync using _dbSet.CountAsync()
            return 0;
        }

        public void Add(T entity)
        {
            // TODO: Implement Add
        }

        public void Update(T entity)
        {
            // TODO: Implement Update (attach and modify entry state)
        }

        public void Remove(T entity)
        {
            // TODO: Implement Remove
        }
    }
}
