// TODO: Implement the @MeasurePerformance method decorator (TC39 style).
// It should measure and log the execution time of the decorated method using performance.now().
// Ensure that the original method is executed in the correct context (this) and its result is returned.
export function MeasurePerformance(
  originalMethod: Function,
  context: ClassMethodDecoratorContext
) {
  const methodName = String(context.name);
  return function (this: any, ...args: any[]) {
    // Start timing
    // Execute originalMethod with apply
    // End timing and log results
    // Return original method result
  };
}

// TODO: Implement the @IsUUID accessor decorator factory (TC39 style).
// It should intercept the setter and validate if the value is a valid 36-character UUID.
// A common regex for UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
// If validation fails, throw an Error.
export function IsUUID() {
  return function (
    value: ClassAccessorDecoratorTarget<any, string>,
    context: ClassAccessorDecoratorContext
  ): ClassAccessorDecoratorResult<any, string> {
    return {
      get(this: any) {
        return value.get.call(this);
      },
      set(this: any, newValue: string) {
        // Validate with UUID regex here
        // If invalid, throw new Error("Invalid UUID format")
        // If valid, apply value.set.call(this, newValue)
      }
    };
  };
}

// TODO: Apply the decorators inside a test class.
// - Apply @IsUUID() to the id accessor.
// - Apply @MeasurePerformance to the fetchData method.
export class DataService {
  // accessor id: string = "00000000-0000-0000-0000-000000000000";

  fetchData(records: number): string[] {
    const data: string[] = [];
    for (let i = 0; i < records; i++) {
      data.push(`Data Record #${i}`);
    }
    return data;
  }
}
