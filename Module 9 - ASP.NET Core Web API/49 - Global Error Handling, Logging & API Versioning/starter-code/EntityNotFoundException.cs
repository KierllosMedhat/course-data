using System;

namespace ShopAPI.Domain.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException(string entityName, object key) 
            : base($"{entityName} with key '{key}' was not found.")
        {
        }
    }
}
