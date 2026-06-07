using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ShopAPI.Hubs;

namespace ShopAPI.Controllers
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        // TODO: Inject IHubContext<CatalogHub> into the controller constructor
        private readonly IHubContext<CatalogHub> _hubContext;

        public ProductsController(IHubContext<CatalogHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            // Simulate saving to the database
            product.Id = new Random().Next(1, 1000);

            // TODO: Broadcast the "ProductAdded" event to all connected clients.
            // Send an anonymous object containing the Name and Price of the new product as the payload.
            var payload = new
            {
                Name = product.Name,
                Price = product.Price,
                Timestamp = DateTime.UtcNow
            };

            await _hubContext.Clients.All.SendAsync("ProductAdded", payload);

            return CreatedAtAction(nameof(CreateProduct), new { id = product.Id }, product);
        }
    }
}
