using System;
using System.IO;
using System.Threading.Tasks;

namespace Lecture42.Labs
{
    // TODO: Step 1: Implement the FileLogger class that implements IDisposable
    public class FileLogger : IDisposable
    {
        private StreamWriter _writer;

        public FileLogger(string logDirectory)
        {
            // TODO: Step 2: Ensure the logDirectory exists using Directory.Exists and Directory.CreateDirectory
            
            // TODO: Step 3: Determine the filename (e.g., logs_yyyy-MM-dd.txt) using DateTime
            // Initialize the class-level StreamWriter with append: true
        }

        // TODO: Step 4: Write public async Task LogAsync(string message)
        public async Task LogAsync(string message)
        {
            // TODO: Step 5: Wrap writing logic in a try/catch.
            // Format log with DateTime.Now.ToString("O")
            // If IOException occurs, catch it and write to Console.WriteLine
        }

        // TODO: Step 6: Implement IDisposable.Dispose()
        public void Dispose()
        {
            // Dispose of _writer here
        }
    }

    public class Lab1RollingLogger
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Lab 1: Safe File Logger with Rolling Logs");

            string logDir = Path.Combine(Directory.GetCurrentDirectory(), "Logs");

            // TODO: Step 7: Instantiate FileLogger in a using block (or using var),
            // and write multiple logs in a loop using await logger.LogAsync()
            
            Console.WriteLine($"Logs written to directory: {logDir}");
        }
    }
}
