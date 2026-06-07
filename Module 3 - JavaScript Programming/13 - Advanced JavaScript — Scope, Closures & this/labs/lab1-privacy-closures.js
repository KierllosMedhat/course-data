// Lab 1: Privacy with Closures
// TODO: Implement the createBankAccount function using closures for data privacy.

function createBankAccount(initialBalance) {
  // 1. TODO: Declare a private balance variable.
  // This variable should only be accessible via the returned methods.
  
  // 2. TODO: Return an object with deposit(amount), withdraw(amount), and getBalance() methods.
  // - deposit(amount): increases the balance by amount and logs/returns it.
  // - withdraw(amount): decreases the balance by amount if funds are sufficient, otherwise logs an error.
  // - getBalance(): returns the current balance.
  
  return {
    // Write your methods here:
  };
}

// --- Test Cases ---
const myAccount = createBankAccount(100);
console.log("Initial Balance:", myAccount.getBalance()); // Should be 100

myAccount.deposit(50); // Should deposit 50
console.log("Balance after deposit:", myAccount.getBalance()); // Should be 150

myAccount.withdraw(30); // Should withdraw 30
console.log("Balance after withdrawal:", myAccount.getBalance()); // Should be 120

myAccount.withdraw(200); // Should fail (insufficient funds)

// Verify balance is private:
console.log("Attempting direct access:", myAccount.balance); // Should be undefined

