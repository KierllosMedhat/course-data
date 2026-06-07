using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ShopAPI.Assignment.Models;
using ShopAPI.Assignment.Dtos;

namespace ShopAPI.Assignment.Controllers
{
    // TODO: Inherit from ControllerBase and decorate with [ApiController] and [Route("api/[controller]")]
    public class ProductsController
    {
        // Mock DB: list of Product entities using GUIDs
        private static readonly List<Product> _products = new()
        {
            new Product { Id = Guid.NewGuid(), Name = "Mechanical Keyboard", Price = 89.99m, Description = "Clicky keys", Category = "Physical", ShippingWeight = 1.2 },
            new Product { Id = Guid.NewGuid(), Name = "C# Programming E-Book", Price = 29.99m, Description = "Learn C# from zero", Category = "Digital", ShippingWeight = 0 }
        };

        // TODO: Implement GET /api/products (Returns all products)
        // Hint: ActionResult<IEnumerable<Product>> is preferred for OpenAPI documentation.
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            return null;
        }

        // TODO: Implement GET /api/products/{id} with GUID route constraint
        // Hint: Use [HttpGet("{id:guid}")] and [FromRoute] Guid id. Return NotFound() if not found, otherwise Ok(product).
        public ActionResult<Product> GetProduct(Guid id)
        {
            return null;
        }

        // TODO: Implement POST /api/products
        // Hint: Accepts CreateProductDto from body, maps it to a new Product entity (generating Guid.NewGuid()),
        // adds to list, and returns CreatedAtAction pointing to GetProduct.
        public ActionResult<Product> CreateProduct(CreateProductDto dto)
        {
            // Product product = new Product { ... };
            // _products.Add(product);
            // return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            return null;
        }

        // TODO: Implement PUT /api/products/{id} with GUID route constraint
        // Hint: Accepts UpdateProductDto from body and updates all properties of the matching product.
        // Return 404 if not found, or 204 NoContent if update succeeds.
        public IActionResult UpdateProduct(Guid id, UpdateProductDto dto)
        {
            return null;
        }

        // TODO: Implement DELETE /api/products/{id} with GUID route constraint
        // Hint: Find and remove the product from the _products list. Return 404 if not found, or 204 NoContent.
        public IActionResult DeleteProduct(Guid id)
        {
            return null;
        }
    }
}
