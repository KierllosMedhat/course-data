using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LabLogging.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;

        // TODO: Inject ILogger<HomeController> into the constructor
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        [HttpGet("process-item")]
        public IActionResult ProcessItem(int itemId, int userId)
        {
            // TODO: Write a structured log at Information level tracking the itemId and userId
            // Ensure you do NOT use string interpolation ($""). Use template placeholders instead.
            _logger.LogInformation("Processing item {ItemId} for User {UserId}", itemId, userId);

            return Ok(new { Message = $"Successfully logged processing of item {itemId}." });
        }
    }
}
