# Lab 2: Serilog Integration

1. Install `Serilog.AspNetCore`.
2. Configure it in `Program.cs` to write to the Console and to a File.
3. Replace the default host logger with `.UseSerilog()`.
4. Add `app.UseSerilogRequestLogging()`.
5. Run your API and check the logs!
