using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using LabAdvancedPatterns.Features.Products;

namespace LabAdvancedPatterns.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        // TODO: Inject IMediator into the controller
        private readonly IMediator _mediator;

        public ProductsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // TODO: Create a POST endpoint that accepts CreateProductCommand
        // Use _mediator.Send to dispatch it and return the generated ID
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductCommand command)
        {
            var productId = await _mediator.Send(command);
            return CreatedAtAction(nameof(Create), new { id = productId }, new { id = productId });
        }
    }
}
