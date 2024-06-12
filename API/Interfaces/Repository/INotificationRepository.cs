using API.DTO;
using API.Interfaces.Repository;
using API.Models;

namespace API.Interfaces;

public interface INotificationRepository : IRepository<Notification, Guid>
{
}
