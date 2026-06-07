using System;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriseShopAPI.Labs
{
    // ==========================================
    // 1. Interface and Implementation Stubs
    // ==========================================
    
    public interface IGuidGenerator
    {
        Guid Id { get; }
    }

    public interface ITransientGenerator : IGuidGenerator { }
    public interface IScopedGenerator : IGuidGenerator { }
    public interface ISingletonGenerator : IGuidGenerator { }

    // TODO: Implement the interfaces below.
    // In each class's constructor, assign Id = Guid.NewGuid();
    
    public class TransientGenerator : ITransientGenerator
    {
        public Guid Id { get; }

        public TransientGenerator()
        {
            // TODO: Generate a new Guid and assign to Id
        }
    }

    public class ScopedGenerator : IScopedGenerator
    {
        public Guid Id { get; }

        public ScopedGenerator()
        {
            // TODO: Generate a new Guid and assign to Id
        }
    }

    public class SingletonGenerator : ISingletonGenerator
    {
        public Guid Id { get; }

        public SingletonGenerator()
        {
            // TODO: Generate a new Guid and assign to Id
        }
    }

    // ==========================================
    // 2. Controller to Test Lifetimes
    // ==========================================
    
    [ApiController]
    [Route("api/[controller]")]
    public class LifetimeController : ControllerBase
    {
        // TODO: Declare private fields to hold injected generator instances.
        // We inject each lifetime twice to observe behavioral differences in a single request!
        
        public LifetimeController(
            // TODO: Inject ITransientGenerator twice (e.g., transient1, transient2)
            // TODO: Inject IScopedGenerator twice (e.g., scoped1, scoped2)
            // TODO: Inject ISingletonGenerator twice (e.g., singleton1, singleton2)
        )
        {
            // TODO: Assign the parameters to private fields
        }

        [HttpGet]
        public IActionResult GetLifetimes()
        {
            // TODO: Return a JSON response comparing:
            // - Transient 1 ID vs Transient 2 ID (should differ)
            // - Scoped 1 ID vs Scoped 2 ID (should be the same within a request)
            // - Singleton 1 ID vs Singleton 2 ID (should be the same across all requests)
            
            return Ok(new
            {
                Message = "Implement the dependency injection and return the generated GUIDs here."
            });
        }
    }
}
