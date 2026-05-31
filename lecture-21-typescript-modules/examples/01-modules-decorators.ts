// TYPESCRIPT MODULES & DECORATORS — Lecture 21

// ===== 1. MODULES =====
// TypeScript uses ES Modules (import/export)

export const PI = 3.14;

export interface MathHelper {
    calculateArea(radius: number): number;
}

export class CircleMath implements MathHelper {
    calculateArea(radius: number): number {
        return PI * radius * radius;
    }
}

// In another file:
// import { PI, CircleMath } from './math-module';

// ===== 2. NAMESPACES (Legacy/Internal Modules) =====
// Namespaces group related code within the global scope. 
// Note: ES Modules are preferred for modern apps, but Namespaces are still seen in older codebases.
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    const lettersRegexp = /^[A-Za-z]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}

// Usage:
const validator = new Validation.LettersOnlyValidator();

// ===== 3. DECORATORS =====
// Decorators are a way to add annotations and a meta-programming syntax for class declarations and members.
// Requires "experimentalDecorators": true in tsconfig.json.

// Class Decorator
function Logger(target: Function) {
    console.log(`Class ${target.name} was instantiated.`);
}

@Logger
class Person {
    constructor(public name: string) {}
}

// Method Decorator
function LogExecution(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`Executing ${propertyKey} with arguments: ${JSON.stringify(args)}`);
        const result = originalMethod.apply(this, args);
        console.log(`Result: ${result}`);
        return result;
    };
    return descriptor;
}

class Calculator {
    @LogExecution
    add(a: number, b: number) {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(5, 10); // Logs execution details automatically
