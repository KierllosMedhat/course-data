// ASSIGNMENT — Live Notification System (SignalR & Background Jobs)

/*
// TODO 1: Create a SignalR Hub
// Create a class 'NotificationHub' inheriting from Microsoft.AspNetCore.SignalR.Hub.
// You don't need any methods inside it for this basic broadcast scenario.

// TODO 2: Configure SignalR in Program.cs
// Add builder.Services.AddSignalR();
// Map the hub: app.MapHub<NotificationHub>("/notifications");

// TODO 3: Create a Background Service
// Create a class 'SystemMonitorWorker' inheriting from BackgroundService.
// Override ExecuteAsync.
// Inject IHubContext<NotificationHub> into the constructor.

// TODO 4: Broadcast from the Worker
// Inside the while(!stoppingToken.IsCancellationRequested) loop of your worker:
// Use the IHubContext to send a message "ReceiveNotification" to all clients 
// containing a fake system metric (e.g., "CPU Usage: 45%").
// Use Task.Delay to wait 5 seconds before repeating.

// TODO 5: Register the Worker
// In Program.cs: builder.Services.AddHostedService<SystemMonitorWorker>();
*/
