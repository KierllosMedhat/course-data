using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using ShopAPI.Assignment.Repositories;
using ShopAPI.Assignment.Dtos;
using ShopAPI.Assignment.Models;
using ShopAPI.Assignment.Helpers;

namespace ShopAPI.Assignment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // TODO: Implement paginated GET /api/products
        // Hint:
        // 1. Validate pageIndex and pageSize
        // 2. Query total count from Products repository
        // 3. Query paginated Products list using GetPagedAsync
        // 4. Map the list of Product entities to a list of ProductDto
        // 5. Wrap in Pagination<ProductDto> and return Ok(paginationResult)
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductDto>>> GetPagedProducts([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10)
        {
            return null;
        }

        // TODO: Implement GET /api/products/{id}
        // Hint: Get from Products repository, check null, map to ProductDto, and return Ok
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            return null;
        }

        // TODO: Implement POST /api/products
        // Hint: Accept CreateProductDto from body, map to Product entity, add to repo, complete UoW, map back to ProductDto, and return CreatedAtAction
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto dto)
        {
            return null;
        }
    }
}
