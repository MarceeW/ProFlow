using API.Models;

namespace API.Interfaces.Repository;

public interface INotificationRepository : IRepository<Notification, Guid>
{
	Task<IQueryable<Notification>> GetUserNotifications(string userName);
	Task BulkUpdateUserNotifications(string userName);
}
