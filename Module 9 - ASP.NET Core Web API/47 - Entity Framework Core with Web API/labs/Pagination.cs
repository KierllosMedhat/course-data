using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace AutoMapperLab.Labs
{
    // ==========================================
    // 1. Generic Pagination Wrapper
    // ==========================================
    
    public class Pagination<T> where T : class
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public IReadOnlyList<T> Data { get; set; }

        public Pagination(int pageIndex, int pageSize, int totalCount, IReadOnlyList<T> data)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalCount = totalCount;
            Data = data;
        }
    }

    // ==========================================
    // 2. Controller Demonstrating Pagination
    // ==========================================
    
    [ApiController]
    [Route("api/[controller]")]
    public class PagedProductController : ControllerBase
    {
        private static readonly List<string> _dummyProducts = new();

        static PagedProductController()
        {
            // Seed 150 items
            for (int i = 1; i <= 150; i++)
            {
                _dummyProducts.Add($"Product #{i}");
            }
        }

        [HttpGet]
        public IActionResult GetProducts([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10)
        {
            // TODO: Enforce page bounds:
            // 1. If pageSize > 50, force to 50
            // 2. If pageIndex < 1, force to 1

            // TODO: Slice the _dummyProducts list using LINQ Skip and Take
            // Hint: Use .Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList()

            // TODO: Wrap the subset in a Pagination<string> response and return it
            
            return Ok(new
            {
                Message = "Implement paged slice here."
            });
        }
    }
}
