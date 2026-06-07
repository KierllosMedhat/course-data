using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace LabAdvancedPatterns.Features.Products
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }

    // TODO: Define a CreateProductCommand record that implements IRequest<int>
    // It should accept Name (string) and Price (decimal) as parameters.
    public record CreateProductCommand(string Name, decimal Price) : IRequest<int>;

    // TODO: Create a CreateProductCommandHandler class implementing IRequestHandler<CreateProductCommand, int>
    // It should simulate adding the product to a database (or a static list) and return the product Id.
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
    {
        private static int _currentId = 0;

        public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            // Simulate asynchronous DB call
            await Task.Delay(50, cancellationToken);

            _currentId++;
            var product = new Product
            {
                Id = _currentId,
                Name = request.Name,
                Price = request.Price
            };

            // Return the simulated ID of the new product
            return product.Id;
        }
    }
}
