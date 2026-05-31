// ASSIGNMENT — Error Handling API

/*
// TODO 1: Implement Custom Global Exception Middleware
// In Program.cs, use app.UseExceptionHandler(...) to create a global error catch block.
// Ensure it returns a ProblemDetails JSON object (status, title, traceId).

// TODO 2: Create a Custom Exception
// Create a class `NotFoundException` that inherits from System.Exception.

// TODO 3: Trigger the Exception
// Create a Controller with a GET endpoint.
// In the endpoint, throw your new `NotFoundException`.

// TODO 4: Handle the Custom Exception
// Update your Global Exception Middleware. Check if the thrown exception is of type `NotFoundException`.
// If it is, return a 404 Status Code instead of a 500.

// TODO 5 (Bonus): Structured Logging
// Inject ILogger<T> into your controller and log a Warning message right before the exception is thrown.
*/
