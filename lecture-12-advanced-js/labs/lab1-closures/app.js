function createCounter(initialValue = 0) {
    // TODO: Create a variable 'count' and set it to initialValue.
    // This variable will be PRIVATE to the returned object!
    
    return {
        increment() {
            // TODO: Increase count
            
        },
        decrement() {
            // TODO: Decrease count
            
        },
        getValue() {
            // TODO: Return count
            
        }
    };
}

const myCounter = createCounter(10);
// myCounter.increment();
// console.log(myCounter.getValue()); // Should be 11
// console.log(myCounter.count); // Should be undefined!
