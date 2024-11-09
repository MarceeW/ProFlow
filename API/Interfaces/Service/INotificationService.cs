using API.Models;

namespace API.Interfaces.Service;

public interface INotificationService
{
	Task CreateNotificationAsync(Notification notification);
	Task CreateNotificationsAsync(IEnumerable<Notification> notifications);
}
