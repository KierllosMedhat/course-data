using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopAPI.Assignment.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> GetAllAsync();
        
        // Paged operations
        Task<IReadOnlyList<T>> GetPagedAsync(int pageNumber, int pageSize);
        Task<int> CountAsync();

        void Add(T entity);
        void Update(T entity);
        void Remove(T entity);
    }
}
