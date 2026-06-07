using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Hybrid;
using MediatR;

namespace LabAdvancedPatterns.Features.Products
{
    public record GetProductsQuery() : IRequest<List<Product>>;

    public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, List<Product>>
    {
        private readonly HybridCache _cache;

        // TODO: Inject HybridCache into the constructor
        public GetProductsQueryHandler(HybridCache cache)
        {
            _cache = cache;
        }

        public async Task<List<Product>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {
            // TODO: Wrap the simulated heavy query inside _cache.GetOrCreateAsync
            // 1. Use a unique cache key like "all-products-list"
            // 2. Set an entry option expiration to 5 minutes
            // 3. Print "CACHE MISS! Querying DB..." to Console only when cache misses
            return await _cache.GetOrCreateAsync(
                "all-products-list",
                async cancelToken =>
                {
                    Console.WriteLine("CACHE MISS! Querying database...");
                    
                    // Simulate a slow database query (e.g. 2 seconds)
                    await Task.Delay(2000, cancelToken);

                    return new List<Product>
                    {
                        new Product { Id = 1, Name = "Cached Laptop", Price = 999.99m },
                        new Product { Id = 2, Name = "Cached Phone", Price = 499.99m }
                    };
                },
                options: new HybridCacheEntryOptions
                {
                    Expiration = TimeSpan.FromMinutes(5)
                },
                cancellationToken: cancellationToken
            );
        }
    }
}
