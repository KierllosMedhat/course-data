// TYPESCRIPT FUNDAMENTALS — Lecture 19

// ===== 1. BASIC TYPES =====
let isDone: boolean = false;
let lines: number = 42;
let firstName: string = "Alice";
let greeting: string = `Hello, ${firstName}!`;

// Type Inference (TS knows 'lastName' is a string)
let lastName = "Smith";
// lastName = 10; // Error: Type 'number' is not assignable to type 'string'.

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"]; // Generic syntax

// Tuples (fixed length and types)
let userTuple: [number, string] = [1, "Alice"];

// Enums
enum Role { Admin, User, Guest }
let myRole: Role = Role.Admin;
console.log(myRole); // 0 (by default enums are 0-indexed)

// Any (Avoid if possible - disables type checking)
let looseValue: any = 4;
looseValue = "Maybe a string";
looseValue = false;

// Unknown (Safer than any - forces you to type check before using)
let unknownValue: unknown = "Hello";
if (typeof unknownValue === "string") {
    console.log(unknownValue.toUpperCase());
}

// ===== 2. FUNCTIONS =====
// Typed parameters and return type
function add(x: number, y: number): number {
    return x + y;
}

// Optional parameters (?) and Default parameters
function buildName(first: string, last?: string, title: string = "Mr/Ms"): string {
    if (last) {
        return `${title} ${first} ${last}`;
    }
    return `${title} ${first}`;
}

// Void return type (function doesn't return anything)
function logMessage(msg: string): void {
    console.log(msg);
}

// ===== 3. UNION & INTERSECTION TYPES =====
// Union (|) - Can be one of multiple types
let id: number | string;
id = 101;
id = "ABC-123";

function printId(id: number | string) {
    if (typeof id === "string") {
        console.log(id.toUpperCase());
    } else {
        console.log(id.toFixed(2));
    }
}

// ===== 4. TYPE ALIASES & INTERFACES =====

// Type Alias
type Point = {
    x: number;
    y: number;
};

let pt: Point = { x: 10, y: 20 };

// Interface (Preferred for objects)
interface User {
    readonly id: number; // Cannot be changed after creation
    name: string;
    email?: string;      // Optional property
}

let newUser: User = {
    id: 1,
    name: "Alice"
};
// newUser.id = 2; // Error: Cannot assign to 'id' because it is a read-only property.

// Interfaces can be extended
interface AdminUser extends User {
    permissions: string[];
}
