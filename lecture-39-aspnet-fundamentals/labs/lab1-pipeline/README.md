# Lab 1: Trace the Pipeline

1. Create a new Web API project (`dotnet new webapi -n PipelineLab`).
2. Add inline middleware using `app.Use()` near the top of the pipeline.
3. Write a `Console.WriteLine` before and after `await next(context)`.
4. Add an endpoint and make a request. Observe the console output!
