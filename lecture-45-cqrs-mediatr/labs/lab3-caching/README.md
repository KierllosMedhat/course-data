# Lab 3: HybridCache

1. Install `Microsoft.Extensions.Caching.Hybrid`.
2. Configure it in `Program.cs`.
3. Use `_cache.GetOrCreateAsync("products-list", ...)` in your GET handler.
4. Verify the database is only hit once!
