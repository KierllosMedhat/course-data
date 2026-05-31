// ASSIGNMENT — Generic Repository (TypeScript Advanced)

// TODO: Define a base interface 'IEntity' with a single property: id (number)
// interface IEntity { ... }

// TODO: Define a User interface extending IEntity
// interface User extends IEntity { name: string; email: string; }

// TODO: Define a Product interface extending IEntity
// interface Product extends IEntity { title: string; price: number; }

// TODO: Create a Generic Class 'Repository<T extends IEntity>'
// This class should manage an array of items of type T.
// class Repository<T extends IEntity> {
//   private items: T[] = [];
//   
//   // TODO: Add method 'add(item: T): void'
//
//   // TODO: Add method 'getById(id: number): T | undefined'
//   // Hint: Use items.find()
//
//   // TODO: Add method 'getAll(): T[]'
//
//   // TODO: Add method 'delete(id: number): boolean'
//   // Return true if deleted, false if not found.
// }

// TODO: Test the Repository
// const userRepo = new Repository<User>();
// userRepo.add({ id: 1, name: "Alice", email: "alice@example.com" });
// console.log(userRepo.getById(1));

// const productRepo = new Repository<Product>();
// productRepo.add({ id: 101, title: "Laptop", price: 999 });
// console.log(productRepo.getAll());

// TODO: Demonstrate the use of Utility Types
// Create a type 'UserUpdateDto' that uses the Partial utility type on User, but Omits the 'id' property.
// type UserUpdateDto = ...
