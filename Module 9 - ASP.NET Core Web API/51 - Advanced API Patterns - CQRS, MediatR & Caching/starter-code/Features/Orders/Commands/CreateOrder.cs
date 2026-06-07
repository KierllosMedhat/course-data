using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;

namespace ShopAPI.Features.Orders.Commands
{
    // TODO: Define the CreateOrderCommand record
    // Accept CustomerEmail and OrderAmount
    public record CreateOrderCommand(string CustomerEmail, decimal OrderAmount) : IRequest<int>;

    // TODO: Define the CreateOrderValidator using FluentValidation
    // Ensure CustomerEmail is a valid email address and OrderAmount is greater than 0
    public class CreateOrderValidator : AbstractValidator<CreateOrderCommand>
    {
        public CreateOrderValidator()
        {
            // Write validation rules here
            // RuleFor(x => x.CustomerEmail)...
            // RuleFor(x => x.OrderAmount)...
        }
    }

    // TODO: Define the CreateOrderCommandHandler class
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, int>
    {
        public async Task<int> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            // Simulate saving order to database
            await Task.Delay(50, cancellationToken);
            return new System.Random().Next(1000, 9999);
        }
    }
}
