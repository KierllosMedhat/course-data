// Lab 1: Data Transformation Mastery
// TODO: Follow the instructions below to filter, map, and reduce orders data.

const orders = [
  { id: 1, customer: "Alice", totalAmount: 150.50, status: "Delivered" },
  { id: 2, customer: "Bob", totalAmount: 75.00, status: "Pending" },
  { id: 3, customer: "Charlie", totalAmount: 250.00, status: "Delivered" },
  { id: 4, customer: "Diana", totalAmount: 99.99, status: "Shipped" },
  { id: 5, customer: "Edward", totalAmount: 45.00, status: "Delivered" }
];

// 1. TODO: Use filter() to extract only the "Delivered" orders into a new array.
const deliveredOrders = []; // Replace with filter logic

// 2. TODO: Use map() to extract the totalAmount of those delivered orders into a new array.
const totalAmounts = []; // Replace with map logic

// 3. TODO: Use reduce() to calculate the grand total revenue of all delivered orders.
const grandTotal = 0; // Replace with reduce logic

// 4. TODO (Bonus): Chain all three methods together into a single pipeline.
const grandTotalChained = 0; // Replace with chained logic

// Log the results to verify:
console.log("Delivered Orders:", deliveredOrders);
console.log("Delivered Total Amounts:", totalAmounts);
console.log("Grand Total Revenue:", grandTotal);
console.log("Grand Total Revenue (Chained):", grandTotalChained);

