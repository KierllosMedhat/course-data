using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace LabVersioning.Controllers
{
    [ApiController]
    // TODO: Decorate this controller to support both API Version 1.0 and 2.0
    // Mark API Version 1.0 as deprecated so clients are warned
    [ApiVersion("1.0", Deprecated = true)]
    [ApiVersion("2.0")]
    // TODO: Define the route using api/v{version:apiVersion}/weather
    [Route("api/v{version:apiVersion}/weather")]
    public class WeatherForecastController : ControllerBase
    {
        // TODO: Create a GET endpoint mapped explicitly to ApiVersion 1.0
        // It should return an anonymous object representing temperature in Celsius, e.g., new { temperatureC = 25 }
        [HttpGet]
        [MapToApiVersion("1.0")]
        public IActionResult GetV1()
        {
            return Ok(new { temperatureC = 25 });
        }

        // TODO: Create a GET endpoint mapped explicitly to ApiVersion 2.0
        // It should return an anonymous object representing temperature in Celsius and Fahrenheit, e.g., new { temperatureCelsius = 25, temperatureFahrenheit = 77 }
        [HttpGet]
        [MapToApiVersion("2.0")]
        public IActionResult GetV2()
        {
            return Ok(new { temperatureCelsius = 25, temperatureFahrenheit = 77 });
        }
    }
}
