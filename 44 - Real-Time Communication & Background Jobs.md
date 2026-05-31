# Lecture 44 — Real-Time Communication & Background Jobs

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain SignalR's hub-based model and its transport fallbacks (WebSockets).
- Create a SignalR `Hub` to push real-time updates to connected clients.
- Connect an Angular client to a SignalR hub.
- Implement background tasks using `BackgroundService`.
- Use Hangfire for scheduled and recurring background jobs.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. SignalR: The Real-Time Web
2. Hub Implementation & Client Targeting
3. Angular SignalR Client
4. Background Jobs (`BackgroundService`)
5. Hangfire for Persistent Jobs

### Part 2 — Practice / Lab (~90–120 min)
1. Build a SignalR Chat Hub
2. Hangfire Background Worker
3. ShopAPI Project Part 6: Live Notifications

---

## 1. SignalR: The Real-Time Web

Normally, HTTP is a "Pull" model. The client asks the server for data, and the server replies.
SignalR enables a **Push** model. The server can push data to connected clients instantly without them asking!

### Transport Fallback Chain
SignalR automatically chooses the best way to communicate:
1. **WebSockets:** (Best) Full-duplex, persistent connection.
2. **Server-Sent Events:** (Good) Server-to-client streaming.
3. **Long Polling:** (Fallback) Client keeps a request open until the server has data.

---

## 2. Hub Implementation & Client Targeting

A **Hub** is a C# class on the server that clients connect to. 

```csharp
public class NotificationHub : Hub
{
    // Clients can call this
    public async Task SendMessage(string user, string message)
    {
        // Server pushes this to ALL connected clients
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
```

### Sending Messages from Outside the Hub
What if you want to push a notification when an API endpoint is called? Inject `IHubContext<T>`!

```csharp
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public OrdersController(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder()
    {
        // ... save order ...
        await _hubContext.Clients.All.SendAsync("OrderCreated", "A new order was placed!");
        return Ok();
    }
}
```

---

## 3. Angular SignalR Client

Install the package in your Angular app:
```bash
npm install @microsoft/signalr
```

### Angular Service
```typescript
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/notifications')
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR Connected!'))
      .catch(err => console.error(err));

    // Listen for events from the server
    this.hubConnection.on('OrderCreated', (message) => {
      console.log('Notification:', message);
      // Update your signals here!
    });
  }
}
```

---

## 4. Background Jobs (`BackgroundService`)

Sometimes you need a task to run constantly in the background (e.g., cleaning up old data, checking for expired subscriptions). ASP.NET Core provides `BackgroundService`.

```csharp
public class CleanupService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromHours(24));
        
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            Console.WriteLine("Running daily cleanup...");
            // Do work here!
        }
    }
}

// In Program.cs
builder.Services.AddHostedService<CleanupService>();
```

---

## 5. Hangfire

For complex background jobs (retries, scheduled jobs, recurring jobs), `BackgroundService` is too simple. Use **Hangfire**! It saves job states to a database so they survive server restarts.

```bash
dotnet add package Hangfire.AspNetCore
dotnet add package Hangfire.SqlServer
```

### Job Types
```csharp
// Fire-and-Forget
BackgroundJob.Enqueue(() => Console.WriteLine("Run immediately!"));

// Delayed
BackgroundJob.Schedule(() => Console.WriteLine("Run in 1 hour!"), TimeSpan.FromHours(1));

// Recurring
RecurringJob.AddOrUpdate("daily-report", () => GenerateReport(), Cron.Daily);
```

Hangfire also comes with a beautiful `/hangfire` dashboard to monitor your jobs!

---

## 🧪 Practice Labs

### Lab 1 — Real-Time Chat (45 min)
1. Add `builder.Services.AddSignalR()` and `app.MapHub<ChatHub>("/chat")` to your API.
2. Create a `ChatHub` that broadcasts messages to `Clients.All`.
3. Create a simple Angular app (or plain HTML/JS) to connect to the hub and send/receive messages.

### Lab 2 — Hangfire Dashboard (30 min)
1. Install `Hangfire.AspNetCore` and `Hangfire.MemoryStorage` (for testing).
2. Configure Hangfire in `Program.cs`.
3. Enqueue a simple `BackgroundJob`.
4. Open the `/hangfire` dashboard in your browser and watch the job execute!

---

## 📝 Assignment: ShopAPI Project — Part 6

Let's notify our frontend when a new product is added!

### Requirements
1. Add SignalR to your `ShopAPI`.
2. Create a `NotificationHub`.
3. Inject `IHubContext<NotificationHub>` into your `ProductsController`.
4. When a new Product is successfully created via `POST`, use the Hub Context to broadcast a `ProductAdded` event containing the product's name.
5. In your Angular `ShopApp`, connect to the SignalR hub and display a toast notification whenever a new product is added by another user!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| SignalR Overview | https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction |
| Hangfire Docs | https://docs.hangfire.io/en/latest/ |

---

## 📌 Key Takeaways
- **SignalR** allows the server to push data to the client in real-time.
- **Hubs** are the central point of communication.
- Inject **`IHubContext<T>`** to send messages from outside the hub.
- **`BackgroundService`** is for simple, in-memory daemon tasks.
- **Hangfire** is for robust, persistent, schedulable background jobs.

---

**Next Lecture:** [Lecture 45 — Advanced API Patterns — CQRS, MediatR & Caching](./45%20-%20Advanced%20API%20Patterns%20%E2%80%94%20CQRS,%20MediatR%20%26%20Caching.md)