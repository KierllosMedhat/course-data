using System.ComponentModel.DataAnnotations;

namespace ShopAPI.Assignment.Dtos
{
    public class UpdateProductDto
    {
        // TODO: Enforce Name is required, max length 100, min length 3
        public string Name { get; set; } = string.Empty;

        // TODO: Enforce Price is positive (greater than 0.01)
        public decimal Price { get; set; }

        // TODO: Enforce Description has a max length of 500
        public string Description { get; set; } = string.Empty;

        // TODO: Enforce Category is required
        public string Category { get; set; } = string.Empty;

        // TODO: Add ShippingWeight property
        public double ShippingWeight { get; set; }
    }
}
