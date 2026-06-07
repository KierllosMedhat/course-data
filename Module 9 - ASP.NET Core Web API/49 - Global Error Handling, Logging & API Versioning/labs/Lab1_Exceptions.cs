using System;

namespace LabErrorHandling.Exceptions
{
    // TODO: Create a base custom domain exception named DomainException that inherits from Exception
    public abstract class DomainException : Exception
    {
        protected DomainException(string message) : base(message) { }
    }

    // TODO: Create EntityNotFoundException that inherits from DomainException
    // It should accept entityName and key, and pass a descriptive message to the base constructor:
    // e.g., "User with key '99' was not found."
    public class EntityNotFoundException : DomainException
    {
        public EntityNotFoundException(string entityName, object key)
            : base($"{entityName} with key '{key}' was not found.")
        {
        }
    }

    // TODO: Create ValidationException that inherits from DomainException
    // It should accept a validation message and pass it to the base constructor
    public class ValidationException : DomainException
    {
        public ValidationException(string message) : base(message)
        {
        }
    }
}
