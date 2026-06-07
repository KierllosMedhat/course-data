using FluentValidation;
using LabAdvancedPatterns.Features.Products;

namespace LabAdvancedPatterns.Features.Products.Validation
{
    // TODO: Create a CreateProductValidator class inheriting from AbstractValidator<CreateProductCommand>
    // Ensure:
    // 1. Name is not empty and has a maximum length of 100 characters
    // 2. Price is strictly greater than 0
    public class CreateProductValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(100).WithMessage("Product name cannot exceed 100 characters.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Product price must be greater than zero.");
        }
    }
}
