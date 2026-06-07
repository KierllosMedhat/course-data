using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;

namespace LabLogging
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // TODO: Initialize the bootstrap Serilog logger
            // Configure it to:
            // 1. Set MinimumLevel to Information
            // 2. Override "Microsoft.AspNetCore" to Warning level to suppress noisy logs
            // 3. Write to Console (optionally with an output template)
            // 4. Write to a Rolling File named "logs/lab-log-.txt" with RollingInterval.Day
            // 5. Enrich logs from the log context
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
                .WriteTo.File("logs/lab-log-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            try
            {
                Log.Information("Starting the Lab Logging Web Host...");

                var builder = WebApplication.CreateBuilder(args);

                // TODO: Instruct ASP.NET Core to replace the default logger with Serilog using builder.Host.UseSerilog()
                builder.Host.UseSerilog();

                builder.Services.AddControllers();
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();

                var app = builder.Build();

                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

                // TODO: Add Serilog Request Logging middleware right after Routing/Development check using app.UseSerilogRequestLogging()
                app.UseSerilogRequestLogging();

                app.UseHttpsRedirection();
                app.UseAuthorization();
                app.MapControllers();

                app.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "The host terminated unexpectedly");
            }
            finally
            {
                // Ensure all logs are written before the application exits
                Log.CloseAndFlush();
            }
        }
    }
}
