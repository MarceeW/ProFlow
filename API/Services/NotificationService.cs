using API.Interfaces;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Interfaces.SignalR;
using API.Models;
using API.SignalR;
using Microsoft.AspNetCore.SignalR;

namespace API. Services;

public class NotificationService : INotificationService
{
	private readonly INotificationRepository _notificationRepository;
	private readonly IHubContext<NotificationHub, INotificationClient> _notificationHub;

	public NotificationService(
		INotificationRepository notificationRepository,
		IHubContext<NotificationHub, INotificationClient> notificationHub)
	{
		_notificationRepository = notificationRepository;
		_notificationHub = notificationHub;
	}
	
	public async Task CreateNotificationAsync(Notification notification) 
	{
		await _notificationRepository.CreateAsync(notification);
		await _notificationRepository.SaveAsync();
		await _notificationHub.Clients.User(notification.TargetUser.UserName!).ReceiveNotification();
	}

	public async Task CreateNotificationsAsync(IEnumerable<Notification> notifications)
	{
		foreach(var notification in notifications) 
			await _notificationRepository.CreateAsync(notification);
		await _notificationRepository.SaveAsync();
		await _notificationHub.Clients.Users(notifications.Select(n => n.TargetUser.UserName!)).ReceiveNotification();
	}
}
