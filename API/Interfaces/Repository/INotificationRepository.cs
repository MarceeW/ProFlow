using API.Interfaces.Repository;
using API.Models;

namespace API.Interfaces;

public interface INotificationRepository : IRepository<Notification, Guid>
{
	Task<IQueryable<Notification>> GetUserNotifications(string userName);
	Task BulkUpdateUserNotifications(string userName);
}
