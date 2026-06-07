// Deliberate linting errors for students to fix in Lab 2.
// Use 'eslint.config.js' flat config to find and fix:
// 1. Unused variable ('unusedVar')
// 2. Implicit/explicit 'any' parameter type
// 3. 'let' variable that is never reassigned (should be 'const')
// 4. 'console.log' calls (if warning configured)

function processData(input: any) {
  const unusedVar = "I am not used";
  console.log("Input received:", input);

  let outputValue = input;
  return outputValue;
}

processData("test");
