using API.Interfaces;
using API.Interfaces.Service;
using API.Models;

namespace API. Services;

public class NotificationService : INotificationService
{
	private readonly INotificationRepository _notificationRepository;

	public NotificationService(INotificationRepository notificationRepository)
	{
		_notificationRepository = notificationRepository;
	}
	public async Task CreateNotificationsForProject(Project project)
	{
		foreach(var team in project.Teams!) 
			await _notificationRepository.CreateAsync(GetTeamLeaderNotification(project.Name, team.TeamLeader));
			
		await _notificationRepository.SaveAsync();
	}
	
	private Notification GetTeamLeaderNotification(string projectName, User targetUser) => new Notification
	{
		Type = "flag",
		Title = $"Teamleader invitation!",
		Content = $"You have been invited as a teamleader in {projectName} project!",
		TargetUser = targetUser,
	};
}
