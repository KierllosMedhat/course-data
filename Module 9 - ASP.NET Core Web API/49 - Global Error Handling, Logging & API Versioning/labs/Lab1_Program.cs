using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using LabErrorHandling.Infrastructure;

namespace LabErrorHandling
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // TODO: Register the ProblemDetails services using builder.Services.AddProblemDetails()
            builder.Services.AddProblemDetails();

            // TODO: Register the modern GlobalExceptionHandler using builder.Services.AddExceptionHandler<GlobalExceptionHandler>()
            builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // TODO: Enable UseExceptionHandler middleware early in the pipeline
            app.UseExceptionHandler();

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
