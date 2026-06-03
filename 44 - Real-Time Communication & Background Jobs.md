# Lecture 44 — Real-Time Communication & Background Jobs

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Differentiate between the traditional HTTP "Pull" model and the real-time "Push" model
- Explain SignalR's hub-based architecture and its transport fallback mechanisms
- Create a SignalR `Hub` to push real-time updates from the server to connected clients
- Connect an Angular frontend to a SignalR hub and respond to real-time events
- Implement simple in-memory background tasks using `BackgroundService`
- Integrate Hangfire to manage persistent, scheduled, and recurring background jobs

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Push vs. Pull: The Real-Time Web (The Mailbox Analogy)
2. SignalR: Hubs & Transport Mechanisms
3. Pushing Data from API Controllers (`IHubContext`)
4. Connecting the Angular Client
5. Background Jobs: The Overnight Janitor
6. Hangfire for Persistent Jobs

### Part 2 — Practice / Lab (~90–120 min)
1. Build a SignalR Live Chat Hub
2. Hangfire Background Worker Dashboard
3. ShopAPI Project Part 6: Live Product Notifications

---

## 1. Push vs. Pull: The Real-Time Web

### The Real-World Analogy: The Mailbox vs. The Courier

**The "Pull" Model (Traditional HTTP):**
Imagine you are waiting for an important letter. You walk to your mailbox, open it, look inside, and see it's empty. You walk back inside. Ten minutes later, you do it again. You have to keep **polling** the mailbox. This is how standard HTTP works: the browser asks the server, "Do you have new data?" If no, it has to ask again later.

**The "Push" Model (Real-Time Web):**
Instead of a mailbox, you hire a Courier. You tell the courier, "Here is my address. Stand here. The moment a letter arrives, hand it to me immediately." You don't have to ask anymore; the data is **pushed** to you. 

Modern applications (chat apps, live sports scores, trading dashboards) require the Push model.

---

## 2. SignalR: Hubs & Transport Mechanisms

ASP.NET Core **SignalR** is a library that makes adding real-time web functionality incredibly easy.

### The Transport Fallback Chain
SignalR automatically chooses the best underlying network technology to establish the "Push" connection:
1. **WebSockets:** (The Gold Standard) A true, persistent, two-way connection.
2. **Server-Sent Events (SSE):** (Good) A one-way persistent connection from server to client.
3. **Long Polling:** (Fallback) The client asks for data and the server keeps the HTTP request hanging open until data is ready.

### Creating a Hub

A **Hub** is the central C# class on your server that all clients connect to.

```csharp
using Microsoft.AspNetCore.SignalR;

// 1. Inherit from the base Hub class
public class NotificationHub : Hub
{
    // 2. Define a method that a client can call
    public async Task SendMessageToServer(string user, string message)
    {
        // 3. The server receives the message, and then PUSHES it out to ALL connected clients.
        // It tells the clients to trigger a JavaScript function named "ReceiveMessage"
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
```

### Registering the Hub
```csharp
// Program.cs
builder.Services.AddSignalR();

var app = builder.Build();

// Map a URL endpoint to your hub
app.MapHub<NotificationHub>("/notifications");

app.Run();
```

---

## 3. Pushing Data from API Controllers

Often, you don't want clients talking directly to the Hub. Instead, a user makes a standard HTTP POST request to a Controller to create a product, and the Controller tells the Hub to notify everyone else.

To do this, we inject the `IHubContext<T>` into our Controller!

```csharp
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    // 1. Inject the context for your specific Hub
    private readonly IHubContext<NotificationHub> _hubContext;

    public OrdersController(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderDto order)
    {
        // 1. Save the order to the database (EF Core logic here)
        
        // 2. Push a real-time notification to EVERYONE currently on the website!
        await _hubContext.Clients.All.SendAsync("OrderCreated", "A new order was just placed!");
        
        return Ok();
    }
}
```

> [!TIP]
> You don't have to broadcast to `.All`. SignalR allows you to target `.Caller` (just the person who made the request), `.Group("Admins")` (a specific channel), or `.User(userId)` (a specific logged-in user).

---

## 4. Connecting the Angular Client

The server is broadcasting, but the frontend needs to tune in to the frequency!

### 1. Install the SignalR JavaScript library
```bash
npm install @microsoft/signalr
```

### 2. Create an Angular Service
```typescript
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  public startConnection() {
    // 1. Point the builder to the URL we mapped in Program.cs
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/notifications')
      .build();

    // 2. Start the persistent connection
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection Started!'))
      .catch(err => console.error('Error starting SignalR: ', err));

    // 3. LISTEN for the exact string the server sends
    this.hubConnection.on('OrderCreated', (serverMessage: string) => {
      console.log('Received real-time alert from server:', serverMessage);
      
      // Here you would update an Angular Signal, show a Toastr popup, 
      // or refresh a list of orders!
    });
  }
}
```

---

## 5. Background Jobs: The Overnight Janitor

### The Real-World Analogy
An API Controller is like a cashier. They help a customer as quickly as possible and move to the next. But who cleans the floors and takes out the trash? You hire a janitor to work constantly in the background.

In .NET, if you need a task to run constantly (e.g., deleting expired sessions from the database every hour), you use a `BackgroundService`.

```csharp
public class DatabaseCleanupService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Set a timer for 1 hour
        using var timer = new PeriodicTimer(TimeSpan.FromHours(1));
        
        // Loop continuously until the application shuts down
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            Console.WriteLine("Janitor: Running hourly database cleanup...");
            // Do your heavy cleanup work here!
        }
    }
}
```

**Registration:**
```csharp
// Program.cs - Note the special HostedService registration method!
builder.Services.AddHostedService<DatabaseCleanupService>();
```

---

## 6. Hangfire for Persistent Jobs

`BackgroundService` is great for simple tasks, but it has a massive flaw: **If the server crashes, all pending background jobs are lost forever.**

**Hangfire** is a robust library that solves this by saving job states into a real database (SQL Server, Redis). If the server crashes, Hangfire just picks up where it left off when it restarts!

### 1. Installation
```bash
dotnet add package Hangfire.AspNetCore
dotnet add package Hangfire.SqlServer
```

### 2. The 3 Types of Jobs

```csharp
// 1. Fire-and-Forget
// Runs immediately in the background so the HTTP request can return instantly
BackgroundJob.Enqueue(() => SendWelcomeEmail(userEmail));

// 2. Delayed
// Runs exactly 24 hours from now
BackgroundJob.Schedule(() => SendFollowUpEmail(userEmail), TimeSpan.FromHours(24));

// 3. Recurring (Cron Jobs)
// Runs at a specific schedule (e.g., Every day at midnight)
RecurringJob.AddOrUpdate("daily-report", () => GenerateSalesReport(), Cron.Daily);
```

> [!NOTE]
> Hangfire includes a beautiful, built-in dashboard! Add `app.UseHangfireDashboard();` to your pipeline and navigate to `/hangfire` to visually monitor, retry, and delete your background jobs!

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Running heavy calculations inside a SignalR Hub method | Hub methods must execute instantly. Use Fire-and-Forget Hangfire jobs for heavy work triggered by SignalR. |
| Injecting a `DbContext` (Scoped) directly into a `BackgroundService` (Singleton) | You cannot inject Scoped services into Singletons! You must inject `IServiceScopeFactory`, create a scope manually, and resolve the DbContext inside the `ExecuteAsync` loop. |
| Forgetting to stop the SignalR connection in Angular | Implement `ngOnDestroy` in your Angular components to gracefully shut down the connection when navigating away. |

---

## 🧪 Practice Labs

### Lab 1 — Real-Time Chat (45 min)
1. In a new Web API, register `AddSignalR()` and map a `/chat` endpoint to a new `ChatHub`.
2. Inside `ChatHub`, write a `SendMessage(string user, string message)` method that broadcasts to `.All`.
3. Create a simple `index.html` file with vanilla JavaScript. Import the SignalR CDN, connect to `/chat`, and create a text input and button to send and receive messages.
4. Open the HTML file in two different browser windows and chat with yourself!

### Lab 2 — Hangfire Dashboard (30 min)
1. Install `Hangfire.AspNetCore` and `Hangfire.MemoryStorage` (MemoryStorage is great for local testing without SQL).
2. Configure Hangfire in `Program.cs` and add the Dashboard middleware.
3. Enqueue a simple `BackgroundJob` that writes to the console.
4. Open the `/hangfire` dashboard in your browser and watch the job execute.

---

## 📝 Assignment: ShopAPI Project — Part 6

Let's notify all active users when our store gets a new product!

### Requirements
1. Add the SignalR service and middleware to your `ShopAPI`.
2. Create a `CatalogHub`. It doesn't need any methods inside it; we just need it as an endpoint.
3. Map the hub to the `/hubs/catalog` endpoint in `Program.cs`.
4. Open your `ProductsController`. Inject `IHubContext<CatalogHub>` into the constructor.
5. Inside your `POST` endpoint (where you create a product), after successfully saving to the database, use the hub context to broadcast a message: `"ProductAdded"`. Send the name of the new product as the payload.
6. **Bonus (Frontend):** In your Angular application, install `@microsoft/signalr`, connect to the hub, and show a `console.log` or Toast notification whenever a new product is added from Postman!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| SignalR Overview & Tutorials | https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction |
| SignalR JavaScript Client | https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client |
| Hangfire Documentation | https://docs.hangfire.io/en/latest/ |
| Cron Expression Generator | https://crontab.guru/ |

---

## 📌 Key Takeaways
- **SignalR** solves the polling problem by establishing persistent, real-time push connections (usually via WebSockets).
- **Hubs** are the central endpoints for SignalR communication.
- Inject **`IHubContext<T>`** into controllers to broadcast events globally when API actions occur.
- **`BackgroundService`** acts as an overnight janitor for simple, continuously running, in-memory daemon tasks.
- **Hangfire** provides enterprise-grade, persistent, schedulable background jobs with a built-in monitoring dashboard.

---

**Next Lecture:** [Lecture 45 — Advanced API Patterns — CQRS, MediatR & Caching](./45%20-%20Advanced%20API%20Patterns%20-%20CQRS,%20MediatR%20%26%20Caching.md)