using System.ComponentModel.DataAnnotations;

namespace ShopAPI.Labs.Dtos
{
    public class CreateProductDto
    {
        // TODO: Add validation attributes to Name
        // - Required (ErrorMessage: "Product name is required.")
        // - StringLength (Maximum 50 characters, Minimum 3 characters, ErrorMessage: "Name must be between 3 and 50 characters.")
        public string Name { get; set; } = string.Empty;

        // TODO: Add validation attributes to Price
        // - Range (Minimum 1.00, Maximum 10000.00, ErrorMessage: "Price must be between 1.00 and 10000.00.")
        public decimal Price { get; set; }
    }
}
