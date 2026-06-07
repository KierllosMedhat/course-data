using System;

namespace CollectionsGenericsLinq.Labs
{
    // Define a simple User record/class for testing
    public record User(int Id, string Name);

    // TODO: 1. Implement the generic Result<T> class
    // Requirements:
    // - Properties: IsSuccess (bool), Value (T?), ErrorMessage (string?)
    // - Private constructor to enforce static factory method usage
    // - Static factory method: Success(T value) returning Result<T>
    // - Static factory method: Failure(string error) returning Result<T>
    public class Result<T>
    {
        // Add properties and methods here
    }

    // TODO: 2. Implement the UserService class
    // Requirements:
    // - Method: Result<User> GetUserById(int id)
    // - If id is positive (e.g. > 0), return a Success result containing a mock user.
    // - If id is 0 or negative, return a Failure result with an error message like "User ID must be positive."
    public class UserService
    {
        public Result<User> GetUserById(int id)
        {
            // Implement here
            return null; // Placeholder
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Generic Result Class Lab ===");

            var userService = new UserService();

            // TODO: 3. Call GetUserById with a valid ID and print the user's name on success
            // var successResult = userService.GetUserById(1);
            

            // TODO: 4. Call GetUserById with an invalid ID and print the error message on failure
            // var failureResult = userService.GetUserById(-5);
            
        }
    }
}
