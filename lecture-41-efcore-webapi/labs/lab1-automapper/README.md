# Lab 1: AutoMapper

1. Install `AutoMapper`.
2. Create a `MappingProfile.cs` class.
3. Inherit from `Profile`.
4. Call `CreateMap<User, UserDto>();` in the constructor.
5. In `Program.cs`, add `builder.Services.AddAutoMapper(typeof(Program).Assembly);`.
6. Inject `IMapper` into your controller and use it!
