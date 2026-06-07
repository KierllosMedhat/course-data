using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Asp.Versioning;
using ShopAPI.Infrastructure.Errors;

namespace ShopAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // TODO: Setup Serilog Bootstrap Logger
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
                .WriteTo.File("logs/shopapi-log-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            try
            {
                Log.Information("ShopAPI: Starting Web Host...");
                var builder = WebApplication.CreateBuilder(args);

                // TODO: Instruct builder to use Serilog
                builder.Host.UseSerilog();

                builder.Services.AddControllers();
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();

                // TODO: Register ProblemDetails and GlobalExceptionHandler
                builder.Services.AddProblemDetails();
                builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

                // TODO: Configure API Versioning with UrlSegmentApiVersionReader
                builder.Services.AddApiVersioning(options =>
                {
                    options.AssumeDefaultVersionWhenUnspecified = true;
                    options.DefaultApiVersion = new ApiVersion(1, 0);
                    options.ReportApiVersions = true;
                    options.ApiVersionReader = new UrlSegmentApiVersionReader();
                });

                var app = builder.Build();

                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

                // TODO: Add Serilog Request Logging middleware
                app.UseSerilogRequestLogging();

                // TODO: Add Exception Handling Middleware early in the pipeline
                app.UseExceptionHandler();

                app.UseHttpsRedirection();
                app.UseAuthorization();
                app.MapControllers();

                app.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "ShopAPI: Startup failed unexpectedly");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }
}
