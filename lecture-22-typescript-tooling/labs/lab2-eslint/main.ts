// This file has deliberate ESLint errors!
// Once you configure eslint.config.js, run the linter to see the warnings.

export function doSomething(data: any) { // Should warn about 'any'
    console.log("Doing something..."); // Should warn about console.log
    return data;
}
