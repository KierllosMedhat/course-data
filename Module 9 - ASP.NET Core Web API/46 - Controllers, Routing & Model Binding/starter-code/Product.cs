using System;

namespace ShopAPI.Assignment.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // e.g., "Digital", "Physical"
        public double ShippingWeight { get; set; } // Should be 0 if digital
    }
}
