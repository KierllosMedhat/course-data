using System;

// ASSIGNMENT — Event Bus System (Advanced C#)

// TODO: Define a custom EventArgs class called 'OrderEventArgs'
// It should contain an OrderId (int) and TotalAmount (decimal)

// TODO: Create a publisher class called 'OrderProcessor'
// 1. Declare an event of type EventHandler<OrderEventArgs> named 'OrderPlaced'
// 2. Create a method 'ProcessOrder(int id, decimal amount)'
// 3. Inside ProcessOrder, raise the 'OrderPlaced' event, passing the id and amount.

// TODO: Create a subscriber class called 'EmailService'
// 1. Create a method 'OnOrderPlaced(object sender, OrderEventArgs e)'
// 2. It should print: "Email sent for Order [Id]. Total: $[Amount]"

// TODO: Create a subscriber class called 'InventoryService'
// 1. Create a method 'OnOrderPlaced(object sender, OrderEventArgs e)'
// 2. It should print: "Inventory updated for Order [Id]."

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Event Bus System");

        // TODO: Instantiate the OrderProcessor, EmailService, and InventoryService

        // TODO: Subscribe the EmailService and InventoryService to the OrderProcessor's event

        // TODO: Call ProcessOrder on the OrderProcessor to trigger the events
    }
}
