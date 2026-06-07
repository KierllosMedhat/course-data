// Step 1: Define the Event Interfaces
// TODO: Define PageLoadEvent
// Properties: type: "page_load", url: string, timestamp: number

// TODO: Define ClickEvent
// Properties: type: "click", elementId: string, timestamp: number

// TODO: Define PurchaseEvent
// Properties: type: "purchase", amount: number, currency: string, timestamp: number


// Step 2: Create the AnalyticsEvent Union Type
// TODO: Create a type alias 'AnalyticsEvent' that is a union of PageLoadEvent, ClickEvent, and PurchaseEvent


// Step 3: Implement the Aggregator function
// TODO: Implement the processEvents function using a switch statement on event.type to narrow the union type.
// The function should calculate and log:
// 1. Total page loads count
// 2. An array of all clicked elementIds
// 3. Total revenue generated (sum of purchase amounts in USD)
function processEvents(events: AnalyticsEvent[]): void {
  // Your code here
}

// Example Test Input (uncomment to test after implementing interfaces and union type)
/*
const batch: AnalyticsEvent[] = [
  { type: "page_load", url: "/home", timestamp: 1000 },
  { type: "click", elementId: "buy-btn", timestamp: 1050 },
  { type: "purchase", amount: 49.99, currency: "USD", timestamp: 1100 }
];

processEvents(batch);
*/
