// ASSIGNMENT — Bank Account using Closures
// We want to create a secure bank account where the balance cannot be modified directly.

// TODO: Create a function called createBankAccount(initialBalance)
// function createBankAccount(initialBalance) {
//   let balance = initialBalance; // Private variable
//   let transactions = []; // Private array to store history
//
//   // Return an object with methods that have access to the private variables via closures
//   return {
//     // TODO: Add a deposit(amount) method
//     // Must validate amount > 0, update balance, and add to transactions
//     
//     // TODO: Add a withdraw(amount) method
//     // Must validate amount > 0 and amount <= balance, update balance, and add to transactions
//
//     // TODO: Add a getBalance() method returning the current balance
//
//     // TODO: Add a getHistory() method returning a COPY of the transactions array
//   };
// }

// TODO: Test your implementation
// const account = createBankAccount(100);
// account.deposit(50);
// account.withdraw(20);
// console.log(account.getBalance()); // Should be 130
// console.log(account.getHistory()); 
// console.log(account.balance); // Should be undefined (private)
