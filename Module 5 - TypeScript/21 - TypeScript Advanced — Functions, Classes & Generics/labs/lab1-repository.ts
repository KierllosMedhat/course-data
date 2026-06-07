// TODO: Define the BaseEntity interface with a required id: number property.


// TODO: Implement the generic Repository<T extends BaseEntity> class.
// The class should have a private array to store items of type T.
// Methods to implement:
// - add(item: T): void — adds an item to the store
// - findById(id: number): T | undefined — finds an item by its ID
// - getAll(): T[] — returns all stored items
// - remove(id: number): void — removes the item with the given ID
// - update(id: number, changes: Partial<T>): void — merges changes using Object.assign


// TODO: Define User interface with id (number), name (string), email (string).


// TODO: Define Product interface with id (number), title (string), price (number).


// Example Usage & Test Cases:
/*
const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: "Alice", email: "alice@example.com" });
userRepo.add({ id: 2, name: "Bob", email: "bob@example.com" });

console.log("All users:", userRepo.getAll());
console.log("Found user:", userRepo.findById(1));

userRepo.update(1, { name: "Alice Smith" });
console.log("After update:", userRepo.findById(1));

const productRepo = new Repository<Product>();
productRepo.add({ id: 1, title: "Laptop", price: 999 });
console.log("All products:", productRepo.getAll());
*/
