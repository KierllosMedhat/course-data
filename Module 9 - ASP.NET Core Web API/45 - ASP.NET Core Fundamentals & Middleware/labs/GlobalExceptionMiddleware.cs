using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace EnterpriseShopAPI.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // TODO: Forward the request context to the next middleware in the pipeline
                // Hint: Use await _next(context);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception with a clear error message
                
                // TODO: Call HandleExceptionAsync to write a custom JSON response to the client
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // TODO: Set response headers, status code, and write the custom JSON payload.
            // 1. Set context.Response.ContentType to "application/json"
            // 2. Set context.Response.StatusCode to 500 (StatusCodes.Status500InternalServerError)
            // 3. Create a payload: new { Error = "An unexpected error occurred." } (or include details in development)
            // 4. Serialize the payload and write to the response body
            
            return Task.CompletedTask; // Remove/update when fully implemented
        }
    }
}
