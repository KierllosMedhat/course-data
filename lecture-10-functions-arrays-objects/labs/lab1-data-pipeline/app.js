const products = [
    { name: "Laptop", price: 1200, category: "Electronics" },
    { name: "Shirt", price: 25, category: "Clothing" },
    { name: "Phone", price: 800, category: "Electronics" },
    { name: "Pants", price: 45, category: "Clothing" },
    { name: "Tablet", price: 500, category: "Electronics" },
];

console.log("Original:", products);

// TODO: 1. Use filter() to get only "Electronics"
const electronics = []; // Replace

// TODO: 2. Use toSorted() to sort the electronics by price (descending).
// Remember toSorted() is the modern non-mutating version of sort()!
const sortedElectronics = []; // Replace

// TODO: 3. Use map() to get just an array of the names of the sorted electronics.
const productNames = []; // Replace

console.log("Final Names:", productNames);
// Expected output: ["Laptop", "Phone", "Tablet"]
