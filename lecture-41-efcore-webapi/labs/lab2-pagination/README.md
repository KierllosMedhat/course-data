# Lab 2: Pagination

1. Update your controller's GET method to accept `[FromQuery] int page = 1` and `[FromQuery] int pageSize = 10`.
2. Use `.Skip((page - 1) * pageSize).Take(pageSize)` on your EF Core query.
3. Note: Remember to call `.Skip().Take()` BEFORE you call `.ToListAsync()`!
