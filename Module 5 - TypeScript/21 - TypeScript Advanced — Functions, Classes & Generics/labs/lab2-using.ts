// TODO: Define the TempFile class that implements the disposable contract.
// - It should take a filename (string) in its constructor and log "Opening temp file: [filename]"
// - It must implement [Symbol.dispose]() to log "Deleting temp file: [filename]"
class TempFile {
  // Your code here
}

// TODO: Write a processFile(filename: string) function that utilizes the 'using' keyword
// to instantiate TempFile. Inside the function, print a message indicating processing,
// and optionally uncomment the throw statement to test exception handling safety.
function processFile(filename: string): void {
  // using file = ...
  console.log(`Processing file: ${filename}`);
  
  // Uncomment the line below to test if Symbol.dispose is called even when an error occurs
  // throw new Error("Something went wrong during processing!");
}

// Test call
processFile("report.csv");
