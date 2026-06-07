// Import hash from the './encryption' module
import { hash } from './encryption';

// TODO: Attempt to call 'hash' with incorrect types (e.g. number for salt) 
// to verify TypeScript compiler warning / error.
// Example: const badResult = hash("password", 12345);

// TODO: Call 'hash' correctly with string parameters and print the result.
const safeResult = hash("password", "salty_hash");
console.log("Hashed result:", safeResult);
