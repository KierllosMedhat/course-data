using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoMapperLab.Labs
{
    public interface IGenericRepository<T> where T : class
    {
        // TODO: Define method signatures for:
        // 1. GetByIdAsync(int id) -> returns Task<T?>
        // 2. GetAllAsync() -> returns Task<IReadOnlyList<T>>
        // 3. Add(T entity) -> returns void
        // 4. Update(T entity) -> returns void
        // 5. Remove(T entity) -> returns void
        
        // For Lab 3 (Pagination)
        // 6. GetPagedAsync(int pageNumber, int pageSize) -> returns Task<IReadOnlyList<T>>
        // 7. CountAsync() -> returns Task<int>
    }
}
