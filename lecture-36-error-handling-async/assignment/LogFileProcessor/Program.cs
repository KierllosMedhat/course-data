using System;
using System.IO;
using System.Threading.Tasks;

// ASSIGNMENT — Log File Processor (Async & File I/O)

class Program
{
    // TODO: Change Main to 'static async Task Main'
    static void Main(string[] args)
    {
        string logPath = "server-logs.txt";

        // TODO: Use a try-catch block to handle potential IOExceptions

        // TODO: Use await File.WriteAllLinesAsync to write some dummy logs to the file
        // e.g. "INFO: Server started", "ERROR: Database timeout", "INFO: User logged in"

        // TODO: Use await File.ReadAllLinesAsync to read the logs back into an array

        // TODO: Use LINQ to filter out only the lines that start with "ERROR:"

        // TODO: Print the error logs to the console
    }
}
