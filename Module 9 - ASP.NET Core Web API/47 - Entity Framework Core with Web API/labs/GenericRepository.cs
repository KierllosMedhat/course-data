using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace AutoMapperLab.Labs
{
    // TODO: Implement the IGenericRepository<T> interface.
    // Ensure you use DbContext and DbSet properly for asynchronous and synchronous tasks.
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        // Mock DbContext - replace with real context if used in a project.
        // We'll stub this out using standard EF Core structures.
        private readonly DbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(DbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        // TODO: Implement GetByIdAsync using _dbSet.FindAsync(id)
        
        // TODO: Implement GetAllAsync using _dbSet.ToListAsync()
        
        // TODO: Implement Add(T entity) using _dbSet.Add(entity)
        
        // TODO: Implement Update(T entity) by changing entry state
        // Hint: _context.Entry(entity).State = EntityState.Modified;
        
        // TODO: Implement Remove(T entity) using _dbSet.Remove(entity)

        // TODO: Implement GetPagedAsync (Lab 3) using Skip and Take
        // Hint: Use _dbSet.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync()
        
        // TODO: Implement CountAsync (Lab 3) using _dbSet.CountAsync()
    }
}
