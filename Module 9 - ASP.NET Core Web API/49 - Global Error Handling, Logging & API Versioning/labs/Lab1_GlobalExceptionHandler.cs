using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using LabErrorHandling.Exceptions;

namespace LabErrorHandling.Infrastructure
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext context,
            Exception exception,
            CancellationToken cancellationToken)
        {
            // TODO: 1. Log the exact error using structured logging, passing the exception object so the stack trace is preserved.
            _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);

            // TODO: 2. Map the Exception type to the correct HTTP Status Code and a human-readable title.
            // Use pattern matching for EntityNotFoundException (404), ValidationException (400), and others (500).
            var (statusCode, title) = exception switch
            {
                EntityNotFoundException => (StatusCodes.Status404NotFound, "Resource Not Found"),
                ValidationException => (StatusCodes.Status400BadRequest, "Validation Error"),
                _ => (StatusCodes.Status500InternalServerError, "Internal Server Error")
            };

            // TODO: 3. Set the context response status code and content type to application/json
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            // TODO: 4. Construct a standard ProblemDetails object with Status, Title, Detail, Type, and Instance.
            // Security Warning: For 500 errors, show a generic message like "An unexpected error occurred. Please contact support." instead of raw exceptions.
            string detailMessage = statusCode == StatusCodes.Status500InternalServerError
                ? "An unexpected error occurred. Please contact support."
                : exception.Message;

            var problemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = detailMessage,
                Instance = context.Request.Path,
                Type = $"https://httpstatuses.com/{statusCode}"
            };

            // TODO: 5. (Optional) Add custom extensions, e.g., problemDetails.Extensions.Add("timestamp", DateTime.UtcNow);

            // TODO: 6. Write the problemDetails object as JSON to the response body
            await context.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            // Return true to indicate the exception has been handled and execution shouldn't propagate further.
            return true;
        }
    }
}
