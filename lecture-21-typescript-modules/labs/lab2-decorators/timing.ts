// TODO: Create a Method Decorator named @Timing
// It should use console.time(name) and console.timeEnd(name) around the original method execution.

class DataProcessor {
    
    // @Timing
    process() {
        console.log("Processing data...");
        // Simulate a slow operation
        for (let i = 0; i < 10000000; i++) {}
        console.log("Done!");
    }
}

const processor = new DataProcessor();
processor.process();
