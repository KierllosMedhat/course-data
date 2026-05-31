# Lab 2: Hangfire Dashboard

1. Install `Hangfire.AspNetCore` and `Hangfire.MemoryStorage`.
2. In `Program.cs`, configure Hangfire to use memory storage.
3. Call `builder.Services.AddHangfireServer()`.
4. Call `app.UseHangfireDashboard()`.
5. Enqueue a test job using `BackgroundJob.Enqueue(() => Console.WriteLine("Job Executed!"));`.
6. Open `/hangfire` in your browser.
