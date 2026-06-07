using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Caching.Hybrid;

namespace ShopAPI.Features.Products.Queries
{
    public record ProductDto(int Id, string Name, decimal Price);

    // TODO: Define the GetAllProductsQuery record implementing IRequest<List<ProductDto>>
    public record GetAllProductsQuery() : IRequest<List<ProductDto>>;

    // TODO: Create the GetAllProductsQueryHandler class
    // Inject your DbContext/Repository and HybridCache
    public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
    {
        private readonly HybridCache _cache;

        public GetAllProductsQueryHandler(HybridCache cache)
        {
            _cache = cache;
        }

        public async Task<List<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
        {
            // TODO: Use HybridCache to retrieve or compile the list of products
            // The cache key should be "catalog-all-products"
            // Use _cache.GetOrCreateAsync with Expiration set to 5 minutes.
            
            return await _cache.GetOrCreateAsync(
                "catalog-all-products",
                async cancelToken => await FetchProductsFromDbAsync(cancelToken),
                options: new HybridCacheEntryOptions
                {
                    Expiration = TimeSpan.FromMinutes(5)
                },
                cancellationToken: cancellationToken
            );
        }

        private async Task<List<ProductDto>> FetchProductsFromDbAsync(CancellationToken cancellationToken)
        {
            // Simulate fetching products from DbContext
            await Task.Delay(100, cancellationToken); // Simulate latency
            return new List<ProductDto>
            {
                new ProductDto(1, "Wireless Mouse", 29.99m),
                new ProductDto(2, "Mechanical Keyboard", 89.99m)
            };
        }
    }
}
