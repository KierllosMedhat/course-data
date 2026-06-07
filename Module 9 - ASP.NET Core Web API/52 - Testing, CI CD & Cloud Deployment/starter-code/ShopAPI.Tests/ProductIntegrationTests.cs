using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace ShopAPI.Tests
{
    public class ProductDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
    }

    public class ProductIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public ProductIntegrationTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task CreateProduct_ValidData_ReturnsCreatedResponse()
        {
            // TODO: Write Integration Tests that hit your real API endpoints
            var newProduct = new ProductDto { Name = "Real Integration Product", Price = 129.99m };

            // Act
            var response = await _client.PostAsJsonAsync("/api/products", newProduct);

            // Assert
            Assert.True(response.StatusCode == HttpStatusCode.Created || response.StatusCode == HttpStatusCode.OK);
        }
    }
}
