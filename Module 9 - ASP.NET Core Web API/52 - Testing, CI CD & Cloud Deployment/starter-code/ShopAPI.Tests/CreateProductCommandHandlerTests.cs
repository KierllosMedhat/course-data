using System.Threading;
using System.Threading.Tasks;
using Moq;
using Xunit;

namespace ShopAPI.Tests
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }

    public interface IProductRepository
    {
        Task<Product> GetByIdAsync(int id);
        Task SaveAsync(Product product);
    }

    public record CreateProductCommand(string Name, decimal Price) : MediatR.IRequest<int>;

    public class CreateProductCommandHandler : MediatR.IRequestHandler<CreateProductCommand, int>
    {
        private readonly IProductRepository _repo;

        public CreateProductCommandHandler(IProductRepository repo)
        {
            _repo = repo;
        }

        public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var product = new Product { Name = request.Name, Price = request.Price };
            await _repo.SaveAsync(product);
            return product.Id;
        }
    }

    public class CreateProductCommandHandlerTests
    {
        [Fact]
        public async Task Handle_ValidCommand_SavesProductAndReturnsId()
        {
            // TODO: Step 2 - Write 5 Unit Tests covering command handlers.
            // 1. Arrange: Create a mock for IProductRepository
            var mockRepo = new Mock<IProductRepository>();
            var handler = new CreateProductCommandHandler(mockRepo.Object);
            var command = new CreateProductCommand("Sample Product", 49.99m);

            // 2. Act: Call the Handle method on your handler
            var result = await handler.Handle(command, CancellationToken.None);

            // 3. Assert: Verify the product was saved exactly once and returned an ID
            mockRepo.Verify(r => r.SaveAsync(It.IsAny<Product>()), Times.Once);
        }
    }
}
