using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using ShopAPI.Features.Products.Commands;
using ShopAPI.Features.Products.Queries;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        // TODO: Inject IMediator and decouple the controller from services/repositories
        private readonly IMediator _mediator;

        public ProductsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // TODO: Create a GET endpoint to fetch all products
        // Dispatches GetAllProductsQuery to MediatR
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _mediator.Send(new GetAllProductsQuery());
            return Ok(products);
        }

        // TODO: Create a POST endpoint that accepts CreateProductCommand
        // Dispatches CreateProductCommand to MediatR
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductCommand command)
        {
            var productId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetAll), new { id = productId }, new { id = productId });
        }
    }
}
