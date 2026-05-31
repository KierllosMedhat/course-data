// TYPESCRIPT TOOLING & TESTING — Lecture 22

// ===== 1. TSCONFIG.JSON =====
// The tsconfig.json file specifies the root files and the compiler options required to compile the project.
/*
{
  "compilerOptions": {
    "target": "es2022",                                  // Set the JavaScript language version for emitted JavaScript
    "module": "commonjs",                                // Specify what module code is generated
    "rootDir": "./src",                                  // Specify the root folder within your source files
    "outDir": "./dist",                                  // Specify an output folder for all emitted files
    "esModuleInterop": true,                             // Emit additional JavaScript to ease support for importing CommonJS modules
    "forceConsistentCasingInFileNames": true,            // Ensure that casing is correct in imports
    "strict": true,                                      // Enable all strict type-checking options (CRITICAL)
    "skipLibCheck": true                                 // Skip type checking all .d.ts files (for performance)
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
*/

// ===== 2. WRITING TESTABLE CODE =====
// To test code effectively, it should be pure (no side effects) and have single responsibilities.

export class StringUtilities {
    /**
     * Capitalizes the first letter of a string.
     */
    static capitalize(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Reverses a string.
     */
    static reverse(str: string): string {
        return str.split('').reverse().join('');
    }
}

// ===== 3. UNIT TESTING WITH JEST (Example) =====
// Jest is a popular testing framework. You write tests in files ending with .spec.ts or .test.ts.

/*
// string-utilities.spec.ts
import { StringUtilities } from './01-tooling-testing';

describe('StringUtilities', () => {
    
    describe('capitalize', () => {
        it('should capitalize the first letter', () => {
            expect(StringUtilities.capitalize('hello')).toBe('Hello');
        });

        it('should handle empty strings', () => {
            expect(StringUtilities.capitalize('')).toBe('');
        });
    });

    describe('reverse', () => {
        it('should reverse a standard string', () => {
            expect(StringUtilities.reverse('hello')).toBe('olleh');
        });
    });
});
*/
