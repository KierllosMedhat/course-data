using System.Threading.Tasks;
using ShopAPI.Domain.Exceptions;

namespace ShopAPI.Application.Services
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class ProductService
    {
        // Dummy data source representation
        private readonly Product[] _products = new[]
        {
            new Product { Id = 1, Name = "Laptop" },
            new Product { Id = 2, Name = "Smartphone" }
        };

        public async Task<Product> GetProductByIdAsync(int id)
        {
            // Simulate database look-up
            await Task.Delay(50);
            
            Product product = null;
            foreach (var p in _products)
            {
                if (p.Id == id)
                {
                    product = p;
                    break;
                }
            }

            // TODO: Instead of returning null when product is not found, throw EntityNotFoundException
            if (product == null)
            {
                throw new EntityNotFoundException("Product", id);
            }

            return product;
        }
    }
}
