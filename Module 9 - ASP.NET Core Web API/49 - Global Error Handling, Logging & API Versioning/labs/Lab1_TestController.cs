using Microsoft.AspNetCore.Mvc;
using LabErrorHandling.Exceptions;

namespace LabErrorHandling.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestErrorController : ControllerBase
    {
        // TODO: Create a GET endpoint at "test-not-found" that throws an EntityNotFoundException for a fake "Product" with ID 42
        [HttpGet("test-not-found")]
        public IActionResult GetNotFound()
        {
            throw new EntityNotFoundException("Product", 42);
        }

        // TODO: Create a GET endpoint at "test-validation" that throws a ValidationException with a custom validation error message
        [HttpGet("test-validation")]
        public IActionResult GetValidationError()
        {
            throw new ValidationException("The product price must be greater than zero.");
        }

        // TODO: Create a GET endpoint at "test-server-error" that throws a generic DivideByZeroException
        [HttpGet("test-server-error")]
        public IActionResult GetServerError()
        {
            int zero = 0;
            int result = 10 / zero;
            return Ok(result);
        }
    }
}
