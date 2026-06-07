using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FluentValidation;
using MediatR;
using ShopAPI.Infrastructure;

namespace ShopAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            // TODO: Register MediatR from the current assembly
            // Add ValidationBehavior as a Pipeline Behavior in MediatR setup
            builder.Services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            });

            // TODO: Register all FluentValidation validators from the current assembly
            builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

            // TODO: Add HybridCache services (.NET 9+)
            builder.Services.AddHybridCache();

            // TODO: Configure OpenAPI Source Generator support (.AddOpenApi())
            builder.Services.AddOpenApi();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                // TODO: Map the OpenAPI endpoints so users can view metadata at /openapi/v1.json
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
