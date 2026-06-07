using Microsoft.AspNetCore.SignalR;

namespace ShopAPI.Hubs
{
    // TODO: Inherit from Hub. This class will act as our SignalR endpoint for Catalog events.
    public class CatalogHub : Hub
    {
        // No custom methods are needed here, as the server will only push events down.
    }
}
