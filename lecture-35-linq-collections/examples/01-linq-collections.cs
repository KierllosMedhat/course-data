// COLLECTIONS, GENERICS & LINQ — Lecture 35

using System;
using System.Collections.Generic;
using System.Linq;

namespace LinqAndCollections
{
    class Program
    {
        static void Main(string[] args)
        {
            // ===== 1. GENERICS & COLLECTIONS =====
            // List<T> (Dynamic array)
            List<string> names = new List<string> { "Alice", "Bob" };
            names.Add("Charlie");
            
            // Dictionary<TKey, TValue> (Key-Value pairs)
            Dictionary<int, string> employees = new Dictionary<int, string>
            {
                { 1, "Alice" },
                { 2, "Bob" }
            };

            // ===== 2. LINQ (Language Integrated Query) =====
            List<Product> products = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop", Price = 999.99m, Category = "Electronics" },
                new Product { Id = 2, Name = "Mouse", Price = 49.99m, Category = "Electronics" },
                new Product { Id = 3, Name = "Desk", Price = 299.00m, Category = "Furniture" },
                new Product { Id = 4, Name = "Chair", Price = 150.00m, Category = "Furniture" }
            };

            // LINQ Method Syntax (Preferred)
            var cheapElectronics = products
                .Where(p => p.Category == "Electronics" && p.Price < 100)
                .OrderBy(p => p.Name)
                .ToList();

            // LINQ Query Syntax (Similar to SQL)
            var expensiveItems = from p in products
                                 where p.Price >= 200
                                 orderby p.Price descending
                                 select p.Name;

            Console.WriteLine("Cheap Electronics:");
            foreach (var item in cheapElectronics)
            {
                Console.WriteLine($"- {item.Name} (${item.Price})");
            }

            // ===== 3. AGGREGATE FUNCTIONS =====
            int totalProducts = products.Count();
            decimal averagePrice = products.Average(p => p.Price);
            decimal sumPrice = products.Sum(p => p.Price);
            
            // First / FirstOrDefault
            var firstFurniture = products.FirstOrDefault(p => p.Category == "Furniture");

            // Select (Projection - mapping objects to a new form)
            var productNames = products.Select(p => p.Name).ToList();
        }
    }

    class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
    }
}
