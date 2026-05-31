// ADVANCED API PATTERNS — CQRS, MediatR & Caching — Lecture 45

// ==========================================
// 1. CQRS & MEDIATR
// ==========================================
// Requires: dotnet add package MediatR
/*
using MediatR;
using Microsoft.AspNetCore.Mvc;

// --- QUERIES (Read) ---
// The Request
public class GetProductByIdQuery : IRequest<ProductDto>
{
    public int Id { get; set; }
}

// The Handler
public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly AppDbContext _context;

    public GetProductByIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FindAsync(request.Id);
        return new ProductDto { Id = product.Id, Name = product.Name };
    }
}

// --- COMMANDS (Write) ---
// The Request
public class CreateProductCommand : IRequest<int>
{
    public string Name { get; set; }
    public decimal Price { get; set; }
}

// The Handler
public class CreateProductHandler : IRequestHandler<CreateProductCommand, int>
{
    private readonly AppDbContext _context;

    public CreateProductHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product { Name = request.Name, Price = request.Price };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product.Id;
    }
}

// --- CONTROLLER USING MEDIATR ---
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _mediator.Send(new GetProductByIdQuery { Id = id });
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Post(CreateProductCommand command)
    {
        var newProductId = await _mediator.Send(command);
        return CreatedAtAction(nameof(Get), new { id = newProductId }, newProductId);
    }
}
*/

// ==========================================
// 2. CACHING (In-Memory)
// ==========================================
/*
using Microsoft.Extensions.Caching.Memory;

public class ProductCacheService
{
    private readonly IMemoryCache _cache;
    private readonly AppDbContext _context;

    public ProductCacheService(IMemoryCache cache, AppDbContext context)
    {
        _cache = cache;
        _context = context;
    }

    public async Task<List<Product>> GetProductsAsync()
    {
        const string cacheKey = "all_products";

        // Try to get from cache
        if (!_cache.TryGetValue(cacheKey, out List<Product> products))
        {
            // If not found, fetch from database
            products = await _context.Products.ToListAsync();

            // Set cache options (e.g., expire after 5 minutes)
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(5));

            // Save data in cache
            _cache.Set(cacheKey, products, cacheEntryOptions);
        }

        return products;
    }
}
*/
