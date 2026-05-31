# Lab 1: SignalR Real-Time Chat

1. In `Program.cs`, add `builder.Services.AddSignalR();` and `app.MapHub<ChatHub>("/chat");`.
2. Create a `ChatHub` class inheriting from `Hub`.
3. Add a `SendMessage` method that calls `await Clients.All.SendAsync("ReceiveMessage", user, message);`.
4. Create a simple HTML page with the SignalR JS client to connect and send messages!
