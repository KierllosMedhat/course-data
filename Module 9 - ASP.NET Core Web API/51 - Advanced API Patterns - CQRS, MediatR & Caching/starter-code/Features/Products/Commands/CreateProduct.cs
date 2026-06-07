using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Caching.Hybrid;

namespace ShopAPI.Features.Products.Commands
{
    // TODO: Define the CreateProductCommand record that takes Name and Price
    public record CreateProductCommand(string Name, decimal Price) : IRequest<int>;

    // TODO: Define the CreateProductValidator class using FluentValidation
    // Ensure Name is not empty and Price is greater than 0
    public class CreateProductValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductValidator()
        {
            // Write validation rules here
            // RuleFor(x => x.Name)...
            // RuleFor(x => x.Price)...
        }
    }

    // TODO: Create the CreateProductCommandHandler class
    // Inject the DbContext (or mock database) and HybridCache
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
    {
        private readonly HybridCache _cache;

        public CreateProductCommandHandler(HybridCache cache)
        {
            _cache = cache;
        }

        public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            // 1. Map command to Product entity and save to database
            int generatedId = 123; // Replace with database logic

            // 2. Invalidate cache: Remove "catalog-all-products" key so that the query gets fresh data next time
            // Hint: await _cache.RemoveAsync("catalog-all-products", cancellationToken);

            return generatedId;
        }
    }
}
