using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace ShopAPI.Controllers
{
    // TODO: Decorate with [ApiController]
    // TODO: Add [ApiVersion("1.0")] to standard base routing
    // TODO: Update route to use the URL-based versioning template: "api/v{version:apiVersion}/[controller]"
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
    }
}
