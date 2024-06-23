using API.Interfaces;
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
	public async Task CreateNotificationsForProject(Project project)
	{
		foreach(var team in project.Teams!) 
		{
			await _notificationRepository
				.CreateAsync(GetTeamLeaderNotification(project.Name, team.TeamLeader));
				
			await _notificationHub.Clients.User(team.TeamLeader.UserName!)
				.ReceiveNotification();
		}
			
		await _notificationRepository.SaveAsync();
	}
	
	public async Task CreateNotificationAsync(Notification notification) 
	{
		await _notificationRepository.CreateAsync(notification);
		await _notificationRepository.SaveAsync();
		await _notificationHub.Clients.User(notification.TargetUser.UserName!).ReceiveNotification();
	}
	
	private Notification GetTeamLeaderNotification(string projectName, User targetUser) => new Notification
	{
		Type = "flag",
		Title = $"Teamleader invitation!",
		Content = $"You have been invited as a teamleader in {projectName} project!",
		TargetUser = targetUser,
	};
}
