using System.ComponentModel.DataAnnotations;

namespace ShopAPI.Assignment.Dtos
{
    public class CreateProductDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, 10000.0)]
        public decimal Price { get; set; }

        public string Description { get; set; } = string.Empty;

        public int CategoryId { get; set; }
    }
}
