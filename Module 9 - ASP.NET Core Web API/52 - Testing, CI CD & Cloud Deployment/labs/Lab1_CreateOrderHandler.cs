using System;
using System.Threading;
using System.Threading.Tasks;

namespace ShopAPI.Labs.Lab1
{
    public class Order
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class InsufficientStockException : Exception
    {
        public InsufficientStockException(string message) : base(message) { }
    }

    public interface IInventoryService
    {
        Task<bool> CheckStockAsync(int productId, int quantity);
    }

    public interface IOrderRepository
    {
        Task SaveAsync(Order order);
    }

    public class CreateOrderCommand
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class CreateOrderCommandHandler
    {
        private readonly IInventoryService _inventoryService;
        private readonly IOrderRepository _orderRepository;

        public CreateOrderCommandHandler(IInventoryService inventoryService, IOrderRepository orderRepository)
        {
            _inventoryService = inventoryService;
            _orderRepository = orderRepository;
        }

        public async Task HandleAsync(CreateOrderCommand command)
        {
            // TODO: Step 3 - Check stock using IInventoryService.CheckStockAsync
            // If it returns false, throw an InsufficientStockException
            bool hasStock = await _inventoryService.CheckStockAsync(command.ProductId, command.Quantity);
            if (!hasStock)
            {
                throw new InsufficientStockException($"Product {command.ProductId} is out of stock.");
            }

            // TODO: Step 3 - If stock is available, create and save the order using IOrderRepository.SaveAsync
            var order = new Order
            {
                ProductId = command.ProductId,
                Quantity = command.Quantity
            };
            
            await _orderRepository.SaveAsync(order);
        }
    }
}
