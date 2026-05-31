# Lab 2: Generic CRUD Data Service with RxJS

1. Create a `DataService`.
2. Inside, add a `BehaviorSubject` holding an array of items.
3. Expose the items as a Signal using `toSignal(this.items$, { initialValue: [] })`.
4. Create an `addItem` method that pushes a new item to the subject using `.next()`.
