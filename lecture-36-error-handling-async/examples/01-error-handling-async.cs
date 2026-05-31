// ERROR HANDLING, FILE I/O & ASYNC C# — Lecture 36

using System;
using System.IO;
using System.Threading.Tasks;

namespace AsyncFileIO
{
    class Program
    {
        // Change Main to async Task for async operations
        static async Task Main(string[] args)
        {
            // ===== 1. ERROR HANDLING (Try/Catch/Finally) =====
            try
            {
                int result = Divide(10, 0);
            }
            catch (DivideByZeroException ex)
            {
                Console.WriteLine($"Specific Error: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Error: {ex.Message}");
            }
            finally
            {
                Console.WriteLine("Cleanup: This always runs.");
            }

            // ===== 2. FILE I/O & ASYNC/AWAIT =====
            string filePath = "sample.txt";

            try
            {
                // Writing to a file asynchronously
                await File.WriteAllTextAsync(filePath, "Hello, Async File I/O!\nLine 2");
                Console.WriteLine("File written successfully.");

                // Reading from a file asynchronously
                string content = await File.ReadAllTextAsync(filePath);
                Console.WriteLine($"File Content:\n{content}");

                // Clean up
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (IOException ex)
            {
                Console.WriteLine($"File Error: {ex.Message}");
            }
        }

        static int Divide(int a, int b)
        {
            if (b == 0)
            {
                // Throwing a custom exception
                throw new DivideByZeroException("Cannot divide a number by zero.");
            }
            return a / b;
        }
    }
}
