using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShopAPI.Domain.Exceptions;

namespace ShopAPI.Infrastructure.Errors
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
            // TODO: Log the exception with structured logging
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

            // TODO: Map exception types to HTTP status codes
            var (statusCode, title) = exception switch
            {
                EntityNotFoundException => (StatusCodes.Status404NotFound, "Resource Not Found"),
                // Add validation exception mapping if you have it
                _ => (StatusCodes.Status500InternalServerError, "Internal Server Error")
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            // TODO: Return ProblemDetails formatted JSON. Protect production sensitive data on 500 error!
            string details = statusCode == StatusCodes.Status500InternalServerError
                ? "An error occurred on the server."
                : exception.Message;

            var problemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = details,
                Instance = context.Request.Path,
                Type = $"https://httpstatuses.com/{statusCode}"
            };

            // TODO: Add custom extensions (like current timestamp)
            problemDetails.Extensions.Add("timestamp", DateTime.UtcNow);

            await context.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
            return true;
        }
    }
}
