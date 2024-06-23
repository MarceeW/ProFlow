using API.Models;

namespace API.Interfaces.Service;

public interface INotificationService
{
	Task CreateNotificationsForProject(Project project);
	Task CreateNotificationAsync(Notification notification);
}
