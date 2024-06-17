namespace API.Interfaces.SignalR;

public interface INotificationClient
{
    Task ReceiveNotification();
}
