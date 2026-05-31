// REAL-TIME COMMUNICATION & BACKGROUND JOBS — Lecture 44

// ==========================================
// 1. SIGNALR (Real-Time Websockets)
// ==========================================
/*
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add SignalR Services
builder.Services.AddSignalR();

var app = builder.Build();

// Map the Hub endpoint
app.MapHub<ChatHub>("/chathub");

app.Run();

// The Hub Class
public class ChatHub : Hub
{
    // Called by the client
    public async Task SendMessage(string user, string message)
    {
        // Broadcasts to all connected clients
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
    
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }
}
*/

// ==========================================
// 2. BACKGROUND JOBS (Hosted Services)
// ==========================================
/*
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

// Register in Program.cs: builder.Services.AddHostedService<DailyReportWorker>();

public class DailyReportWorker : BackgroundService
{
    private readonly ILogger<DailyReportWorker> _logger;

    public DailyReportWorker(ILogger<DailyReportWorker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Daily Report Worker starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Generating daily reports at: {time}", DateTimeOffset.Now);
            
            // Simulate work
            await Task.Delay(5000, stoppingToken); 
            
            // Wait for 24 hours (simulated here with 1 minute)
            // await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
        
        _logger.LogInformation("Daily Report Worker stopping.");
    }
}
*/
