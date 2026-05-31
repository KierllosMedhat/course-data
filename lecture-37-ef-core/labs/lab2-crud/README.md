# Lab 2: CRUD Operations

1. Using your `AppDbContext` from Lab 1, add a new user and `await context.SaveChangesAsync()`.
2. Fetch the user using `.Where(u => u.Name == "...")`.
3. Change their name and `SaveChangesAsync()`.
4. Delete the user and `SaveChangesAsync()`.
