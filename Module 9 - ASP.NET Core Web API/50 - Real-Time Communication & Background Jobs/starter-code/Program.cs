using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShopAPI.Hubs;

namespace ShopAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // TODO: Add SignalR services to the DI container using builder.Services.AddSignalR()
            builder.Services.AddSignalR();

            // TODO: Configure CORS to allow Angular client connection (typically on http://localhost:4200)
            // SignalR requires AllowCredentials() and specific origins/methods/headers.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            
            // TODO: Apply the CORS policy
            app.UseCors("CorsPolicy");

            app.UseAuthorization();
            app.MapControllers();

            // TODO: Map the CatalogHub to the "/hubs/catalog" route
            app.MapHub<CatalogHub>("/hubs/catalog");

            app.Run();
        }
    }
}
