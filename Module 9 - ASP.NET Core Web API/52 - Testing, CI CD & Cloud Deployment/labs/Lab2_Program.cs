using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace ShopAPI.Labs.Lab2
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }

    // TODO: Define a JsonSerializerContext to support AOT serialization for our Product model
    // 1. Add [JsonSerializable(typeof(Product))]
    // 2. Add [JsonSerializable(typeof(List<Product>))]
    [JsonSerializable(typeof(Product))]
    [JsonSerializable(typeof(List<Product>))]
    internal partial class AppJsonSerializerContext : JsonSerializerContext
    {
    }

    public class Program
    {
        public static void Main(string[] args)
        {
            // TODO: Use CreateSlimBuilder instead of CreateBuilder to exclude JIT-reflection defaults
            var builder = WebApplication.CreateSlimBuilder(args);

            // TODO: Configure HTTP JSON options with the source-generated serializer context
            builder.Services.ConfigureHttpJsonOptions(options =>
            {
                options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
            });

            var app = builder.Build();

            // TODO: Implement a Minimal API MapGet endpoint returning a list of products
            app.MapGet("/api/products", () => new List<Product>
            {
                new Product { Id = 1, Name = "AOT Mouse", Price = 19.99m },
                new Product { Id = 2, Name = "AOT Keyboard", Price = 59.99m }
            });

            app.Run();
        }
    }
}
