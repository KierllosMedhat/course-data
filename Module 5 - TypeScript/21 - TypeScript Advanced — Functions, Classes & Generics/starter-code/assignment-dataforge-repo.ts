// TODO: Define and export the BaseEntity interface requiring a numeric id.
export interface BaseEntity {
  id: number;
}

// TODO: Implement the generic Repository<T extends BaseEntity> class.
// Methods to implement:
// - getAll(): T[]
// - getById(id: number): T | undefined
// - add(item: T): void
// - update(id: number, data: Partial<T>): void (use Object.assign)
// - delete(id: number): void
export class Repository<T extends BaseEntity> {
  // Your code here
}

// TODO: Define the User interface (id: number, name: string, email: string, role: string)
export interface User extends BaseEntity {
  // Your code here
}

// TODO: Define the Dataset interface (id: number, name: string, rows: number, createdAt: Date)
export interface Dataset extends BaseEntity {
  // Your code here
}

// Test Script / Main execution:
// TODO: Create a Repository<User> and Repository<Dataset> instance.
// Test by adding 3 users and 2 datasets, updating one user's name, and printing the lists.
function main() {
  console.log("Starting DataForge Repository Test...");
  // Test here
}

main();
