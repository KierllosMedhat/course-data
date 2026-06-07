using System;
using System.Threading.Tasks;
using ShopAPI.Assignment.Models;

namespace ShopAPI.Assignment.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        // TODO: Define IGenericRepository properties for Products and Categories
        // IGenericRepository<Product> Products { get; }
        // IGenericRepository<Category> Categories { get; }
        
        Task<int> CompleteAsync();
    }
}
