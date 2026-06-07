using System;
using System.Collections.Generic;

namespace OOP.Labs
{
    // TODO: 1. Create an IRepository<T> interface
    // Requirements:
    // - void Add(T item)
    // - T? GetById(int id)
    // - List<T> GetAll()
    // - void Remove(int id)
    public interface IRepository<T>
    {
        // Add interface member definitions here
    }

    // TODO: 2. Create a Product class
    // Requirements:
    // - Properties: Id (int), Name (string), Price (decimal)
    public class Product
    {
        // Add properties here
    }

    // TODO: 3. Create an InMemoryProductRepository class implementing IRepository<Product>
    // Requirements:
    // - Use a private List<Product> internally
    // - Implement the interface methods (Add, GetById, GetAll, Remove)
    public class InMemoryProductRepository
    {
        // Add private collection and implement repository functions
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Repository Pattern Lab ===");

            // TODO: 4. Instantiate InMemoryProductRepository using IRepository<Product> reference
            // IRepository<Product> repo = new InMemoryProductRepository();

            // TODO: Add some products to the repository

            // TODO: Retrieve all products and print their details

            // TODO: Get a specific product by ID and print details

            // TODO: Remove a product by ID and check the list again
        }
    }
}
