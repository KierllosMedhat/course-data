# Lab 1: File Logger

1. Create a `FileLogger` class that implements `IDisposable`.
2. Give it a constructor that takes a string `filepath`, and initializes a `StreamWriter(filepath, append: true)`.
3. Add a `Log(string message)` method that writes to the stream.
4. Call `_writer.Dispose()` in the `Dispose` method.
