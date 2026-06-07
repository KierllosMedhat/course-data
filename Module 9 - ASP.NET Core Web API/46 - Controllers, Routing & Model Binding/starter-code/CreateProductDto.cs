using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShopAPI.Assignment.Dtos
{
    public class CreateProductDto : IValidatableObject
    {
        // TODO: Enforce Name is required, max length 100, min length 3
        public string Name { get; set; } = string.Empty;

        // TODO: Enforce Price is positive (greater than 0.01)
        public decimal Price { get; set; }

        // TODO: Enforce Description has a max length of 500
        public string Description { get; set; } = string.Empty;

        // TODO: Enforce Category is required (e.g. "Digital" or "Physical")
        public string Category { get; set; } = string.Empty;

        // TODO: Add ShippingWeight property
        public double ShippingWeight { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            // TODO: Custom Validation Requirement:
            // If the Category is equal to "Digital" (ignore case), the ShippingWeight must be exactly 0.
            // If it is not 0, yield return a new ValidationResult indicating that Digital items cannot have shipping weight.
            
            if (string.Equals(Category, "Digital", StringComparison.OrdinalIgnoreCase))
            {
                // Check if ShippingWeight is not 0
            }

            yield break;
        }
    }
}
