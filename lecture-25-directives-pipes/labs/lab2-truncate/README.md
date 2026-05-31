# Lab 2: Truncate Pipe

1. Generate your pipe: `ng g p truncate`.
2. Implement the `PipeTransform` interface. Return `value.substring(0, limit) + '...'`.
3. In your app template, create a long string variable and display it: `{{ longText | truncate:20 }}`
