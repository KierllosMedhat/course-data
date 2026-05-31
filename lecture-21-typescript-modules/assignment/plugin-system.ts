// ASSIGNMENT — Plugin System (Modules & Decorators)
// Note: Ensure experimentalDecorators is enabled in your TS config to test this.

// TODO: Create a Class Decorator called 'Plugin'
// It should take a configuration object like { name: string, version: string }
// and attach these as properties to the class constructor's prototype.
// function Plugin(config: { name: string; version: string }) {
//     return function (constructor: Function) {
//         constructor.prototype.pluginName = config.name;
//         constructor.prototype.pluginVersion = config.version;
//     }
// }

// TODO: Create a Method Decorator called 'MeasurePerformance'
// It should use console.time and console.timeEnd to measure how long the method takes to run.

// TODO: Apply the decorators to a class
// @Plugin({ name: "AnalyticsPlugin", version: "1.0.0" })
// class Analytics {
//     @MeasurePerformance
//     processData(data: any[]) {
//         // Simulate heavy processing with a loop
//         for(let i=0; i<1000000; i++) { }
//         return data.length;
//     }
// }

// TODO: Test the class
// const analytics = new Analytics();
// analytics.processData([1, 2, 3]);
// console.log("Plugin Name:", (analytics as any).pluginName);
