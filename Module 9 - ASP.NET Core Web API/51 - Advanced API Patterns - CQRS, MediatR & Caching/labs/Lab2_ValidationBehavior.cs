using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;

namespace LabAdvancedPatterns.Infrastructure.PipelineBehaviors
{
    // TODO: Implement the IPipelineBehavior<TRequest, TResponse> interface to create a global validation middleware for MediatR requests
    public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;

        public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        {
            _validators = validators;
        }

        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            if (_validators.Any())
            {
                var context = new ValidationContext<TRequest>(request);

                // Run validation against all registered validators for TRequest
                var validationResults = await Task.WhenAll(
                    _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

                var failures = validationResults
                    .SelectMany(r => r.Errors)
                    .Where(f => f != null)
                    .ToList();

                // TODO: If any validation failures are found, throw a ValidationException with the failures
                if (failures.Count != 0)
                {
                    throw new ValidationException(failures);
                }
            }

            // If validation passes, execute the next handler in the pipeline
            return await next();
        }
    }
}
