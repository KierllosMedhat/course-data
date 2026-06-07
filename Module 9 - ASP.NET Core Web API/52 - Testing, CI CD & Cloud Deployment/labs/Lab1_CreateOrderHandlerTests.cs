using System.Threading.Tasks;
using Moq;
using Xunit;
using ShopAPI.Labs.Lab1;

namespace ShopAPI.Tests.Labs
{
    public class CreateOrderCommandHandlerTests
    {
        [Fact]
        public async Task HandleAsync_InsufficientStock_ThrowsExceptionAndDoesNotSaveOrder()
        {
            // TODO: Step 4 - Mock IInventoryService to return false for CheckStockAsync
            var mockInventory = new Mock<IInventoryService>();
            mockInventory
                .Setup(i => i.CheckStockAsync(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(false);

            // TODO: Step 4 - Mock IOrderRepository
            var mockRepo = new Mock<IOrderRepository>();

            // Instantiate handler with mocks
            var handler = new CreateOrderCommandHandler(mockInventory.Object, mockRepo.Object);
            var command = new CreateOrderCommand { ProductId = 1, Quantity = 5 };

            // TODO: Step 5 - Use Assert.ThrowsAsync<InsufficientStockException> to verify the exception is thrown
            await Assert.ThrowsAsync<InsufficientStockException>(async () =>
            {
                await handler.HandleAsync(command);
            });

            // TODO: Step 6 - Verify that SaveAsync on mockRepo was NEVER called
            mockRepo.Verify(r => r.SaveAsync(It.IsAny<Order>()), Times.Never);
        }
    }
}
