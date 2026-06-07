// TODO: Define the OrderItem interface with price and quantity properties as numbers.

// TODO: Define the Order interface with items (an array of OrderItem) and an optional discountCode (string).

// TODO: Apply the types to the function parameter and define the return type as number.
function calculateOrderTotal(order) {
  let total = 0;
  for (let item of order.items) {
    total += item.price * item.quantity;
  }
  if (order.discountCode) total = total * 0.9;
  return total;
}

// Example Test Case (uncomment to test after writing types):
/*
const myOrder: Order = {
  items: [
    { price: 10, quantity: 2 },
    { price: 15, quantity: 1 }
  ],
  discountCode: "SAVE10"
};
console.log(calculateOrderTotal(myOrder)); // Expected output: 31.5
*/
