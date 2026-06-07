using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using ShopAPI.Features.Orders.Commands;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        // TODO: Inject IMediator and handle actions via Command/Query dispatch
        private readonly IMediator _mediator;

        public OrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // TODO: Create a POST endpoint that accepts CreateOrderCommand DTO
        // Sends the command through MediatR and returns the Order ID
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderCommand command)
        {
            var orderId = await _mediator.Send(command);
            return Ok(new { OrderId = orderId, Message = "Order created successfully!" });
        }
    }
}
