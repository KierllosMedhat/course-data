// CONTROLLERS, ROUTING & MODEL BINDING — Lecture 40

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace ControllersAndRouting.Controllers
{
    // [ApiController] applies opinionated API behaviors (e.g., automatic 400 responses on invalid models)
    [ApiController]
    // Attribute Routing: [Route("[controller]")] automatically maps to "Products"
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        // Mock database
        private static readonly List<Product> _products = new()
        {
            new Product { Id = 1, Name = "Laptop", Price = 999.99m },
            new Product { Id = 2, Name = "Mouse", Price = 49.99m }
        };

        // GET: api/products
        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetAll()
        {
            return Ok(_products); // Returns 200 OK with data
        }

        // GET: api/products/{id}
        // Route parameter binding
        [HttpGet("{id}")]
        public ActionResult<Product> GetById(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            
            if (product == null)
                return NotFound(); // Returns 404
                
            return Ok(product);
        }

        // GET: api/products/search?name=lap
        // Query string binding
        [HttpGet("search")]
        public ActionResult<IEnumerable<Product>> Search([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Search term cannot be empty."); // Returns 400

            var results = _products.Where(p => p.Name.Contains(name, System.StringComparison.OrdinalIgnoreCase));
            return Ok(results);
        }

        // POST: api/products
        // Body binding (complex type)
        [HttpPost]
        public ActionResult<Product> Create([FromBody] Product newProduct)
        {
            newProduct.Id = _products.Max(p => p.Id) + 1;
            _products.Add(newProduct);

            // Returns 201 Created with a Location header pointing to the new resource
            return CreatedAtAction(nameof(GetById), new { id = newProduct.Id }, newProduct);
        }
    }

    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}
