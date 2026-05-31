# Lab 1: EF Core Setup

1. Run `dotnet new console`.
2. Add packages: `Microsoft.EntityFrameworkCore.Sqlite` and `Microsoft.EntityFrameworkCore.Design`.
3. Create a `User` class.
4. Create an `AppDbContext`.
5. Run migrations: `dotnet ef migrations add Init` and `dotnet ef database update`.
