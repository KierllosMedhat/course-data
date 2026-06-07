// Lab 2: Immutable Inventory Manager
// TODO: Write pure, non-mutating functions below to manage products immutably.

const initialProducts = [
  { id: 101, name: "Wireless Mouse", price: 29.99, qty: 50 },
  { id: 102, name: "Mechanical Keyboard", price: 89.99, qty: 30 },
  { id: 103, name: "USB-C Hub", price: 45.00, qty: 100 }
];

// 1. TODO: Implement addProduct(products, newProduct)
// Should return a new array with the newProduct added, WITHOUT mutating the original array.
function addProduct(products, newProduct) {
  // Write your pure function here:
}

// 2. TODO: Implement removeProduct(products, productId)
// Should return a new array without the product matching the productId, WITHOUT mutating.
function removeProduct(products, productId) {
  // Write your pure function here:
}

// 3. TODO: Implement updatePrice(products, productId, newPrice)
// Should return a new array with the target product's price updated, using object spreading.
// Make sure you copy the product object and do not mutate it.
function updatePrice(products, productId, newPrice) {
  // Write your pure function here:
}

// --- Test Cases ---
console.log("Initial Products:", initialProducts);

const added = addProduct(initialProducts, { id: 104, name: "Gaming Headset", price: 59.99, qty: 25 });
console.log("After addProduct:", added);

const removed = removeProduct(initialProducts, 102);
console.log("After removeProduct:", removed);

const updated = updatePrice(initialProducts, 103, 39.99);
console.log("After updatePrice:", updated);

console.log("Verify original is untouched:", initialProducts);

