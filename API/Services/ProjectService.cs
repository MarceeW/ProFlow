
using API.DTO;
using API.Exceptions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class ProjectService : IProjectService
{
	private readonly IProjectRepositoy _projectRepository;
	private readonly INotificationService _notificationService;
	private readonly UserManager<User> _userManager;

	public ProjectService(
		IProjectRepositoy projectRepository, 
		INotificationService notificationService, 
		UserManager<User> userManager)
	{
		_projectRepository = projectRepository;
		_notificationService = notificationService;
		_userManager = userManager;
	}
	public async Task CreateProjectAsync(ProjectDTO projectDTO)
	{
		if(await IsProjectNameExistsAsync(projectDTO.Name))
			throw new NameAlreadyExistsException(projectDTO.Name);
		
		Project project = new()
        {
			Name = projectDTO.Name,
			ProjectManager = (await _userManager.FindByNameAsync(projectDTO.ProjectManager.UserName))!,
			TeamLeaders = await GetTeamLeadersFromDTO(projectDTO.TeamLeaders)
		};

		await _projectRepository.CreateAsync(project);
		await _projectRepository.SaveAsync();
		
		await _notificationService.CreateNotificationsForProject(project);
	}
	
	private async Task<bool> IsProjectNameExistsAsync(string name) 
	{
		return await _projectRepository.Get().AnyAsync(p => p.Name == name);
	}
	private async Task<ICollection<User>> GetTeamLeadersFromDTO(ICollection<UserDTO> teamLeaders) 
	{
		var users = new List<User>();
		foreach(var teamLeader in teamLeaders) 
		{
			var user = await _userManager.FindByNameAsync(teamLeader.UserName);
			if(user == null)
				throw new UserNotFoundException(teamLeader.UserName);
			
			users.Add(user);
		}
		return users;
	}
}
