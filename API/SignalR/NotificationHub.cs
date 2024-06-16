using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public sealed class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Clients.Others.SendAsync("UserIsOnline");
    }
}
