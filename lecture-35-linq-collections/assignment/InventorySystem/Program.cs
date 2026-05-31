using System;
using System.Collections.Generic;
using System.Linq;

// ASSIGNMENT — Inventory System using LINQ

public class Item
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}

class Program
{
    static void Main(string[] args)
    {
        List<Item> inventory = new List<Item>
        {
            new Item { Id = 1, Name = "Apples", Quantity = 50, Price = 0.50m },
            new Item { Id = 2, Name = "Bananas", Quantity = 10, Price = 0.30m },
            new Item { Id = 3, Name = "Cherries", Quantity = 5, Price = 2.00m },
            new Item { Id = 4, Name = "Dates", Quantity = 100, Price = 1.50m }
        };

        // TODO: Use LINQ to find all items where Quantity is less than 20 (Low stock)
        // var lowStockItems = ...

        // TODO: Use LINQ to calculate the total value of the inventory (Sum of Quantity * Price)
        // var totalValue = ...

        // TODO: Use LINQ to get a list of just the item names, ordered alphabetically
        // var sortedNames = ...

        // TODO: Print the results to the console
    }
}
