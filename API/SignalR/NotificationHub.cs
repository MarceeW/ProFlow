using API.Extensions;
using API.Interfaces.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public sealed class NotificationHub : Hub<INotificationClient>
{
	public override async Task OnConnectedAsync()
	{
		await Clients.Client(Context.ConnectionId).ReceiveNotification();
		await base.OnConnectedAsync();
	}
}
