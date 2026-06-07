using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ShopAPI.Labs.Dtos;

namespace ShopAPI.Labs.Controllers
{
    // TODO: Inherit from ControllerBase and decorate with correct attributes:
    // 1. [ApiController]
    // 2. [Route("api/[controller]")]
    public class ProductsController
    {
        // Mock database
        private static readonly List<string> _products = new() { "Laptop", "Mouse", "Keyboard" };

        // TODO: Implement GET /api/products
        // Hint: Use [HttpGet] attribute and return Ok() containing the _products list
        public IActionResult GetAll()
        {
            // Return Ok(_products);
            return null; 
        }

        // TODO: Implement GET /api/products/{id} with route constraints
        // Hint: Use [HttpGet("{id:int}")] attribute. Return NotFound() if out of range, otherwise Ok(product).
        public IActionResult GetById(int id)
        {
            // If id is out of range, return NotFound(). Otherwise, return Ok(_products[id]).
            return null;
        }

        // TODO: Implement POST /api/products
        // Update: In Lab 2, change the input type to CreateProductDto to support validation.
        // Hint: Use [HttpPost] and [FromBody]. Validate input, add the product Name to the list, and return Ok() or Created().
        public IActionResult Create(CreateProductDto dto)
        {
            // Hint: Because of [ApiController], invalid DTOs are rejected automatically.
            // _products.Add(dto.Name);
            // return Ok("Product added");
            return null;
        }

        // TODO: Implement GET /api/products/search (Lab 2)
        // Hint: Use [HttpGet("search")] and [FromQuery] string searchTerm.
        // Filter the list using LINQ and ignoring case. Return matching products.
        public IActionResult Search(string searchTerm)
        {
            return null;
        }

        // TODO: Implement DELETE /api/products/{id} (Lab 2)
        // Hint: Use [HttpDelete("{id:int}")]. Remove the product by index and return NoContent().
        public IActionResult Delete(int id)
        {
            return null;
        }
    }
}
