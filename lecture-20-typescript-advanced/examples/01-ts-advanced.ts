// TYPESCRIPT ADVANCED — Lecture 20

// ===== 1. CLASSES =====
class Person {
    // Access modifiers: public (default), private, protected
    private id: number;
    public name: string;
    protected age: number; // Accessible in subclasses

    constructor(id: number, name: string, age: number) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    public getDetails(): string {
        return `${this.name} (${this.age})`;
    }
}

// Shorthand syntax for constructor properties
class Employee extends Person {
    constructor(
        id: number, 
        name: string, 
        age: number, 
        public department: string // Automatically creates and assigns property
    ) {
        super(id, name, age);
    }

    public getEmployeeInfo(): string {
        // Can access protected 'age', but not private 'id'
        return `${this.name} works in ${this.department}. Age: ${this.age}`;
    }
}

// ===== 2. GENERICS =====
// Generics allow creating reusable components that work over a variety of types rather than a single one.

// Generic Function
function identity<T>(arg: T): T {
    return arg;
}
let outputStr = identity<string>("myString");
let outputNum = identity<number>(100);

// Generic Interface
interface KeyValuePair<K, V> {
    key: K;
    value: V;
}
let kvp: KeyValuePair<number, string> = { key: 1, value: "Apple" };

// Generic Class
class DataStore<T> {
    private data: T[] = [];

    add(item: T) {
        this.data.push(item);
    }

    getAll(): T[] {
        return this.data;
    }
}
const stringStore = new DataStore<string>();
stringStore.add("Hello");
// stringStore.add(10); // Error

// ===== 3. TYPE ASSERTIONS =====
// Sometimes you know more about a value's type than TypeScript does.
let someValue: unknown = "This is a string";
let strLength: number = (someValue as string).length;
// Alternative syntax: <string>someValue

// ===== 4. UTILITY TYPES =====
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

// Partial: Makes all properties optional
type PartialTodo = Partial<Todo>; 

// Readonly: Makes all properties readonly
type ReadonlyTodo = Readonly<Todo>;

// Pick: Selects specific properties
type TodoPreview = Pick<Todo, "title" | "completed">;

// Omit: Removes specific properties
type TodoInfo = Omit<Todo, "completed">;
