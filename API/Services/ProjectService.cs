
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

	public ProjectService(IProjectRepositoy projectRepository, INotificationService notificationService, UserManager<User> userManager)
	{
		_projectRepository = projectRepository;
		_notificationService = notificationService;
		_userManager = userManager;
	}
	public async Task CreateProjectAsync(ProjectDTO projectDTO)
	{
		if(await IsProjectNameExistsAsync(projectDTO.Name))
			throw new NameAlreadyExistsException(projectDTO.Name);
		
		Project project = new Project
		{
			Name = projectDTO.Name,
			ProjectManager = (await _userManager.FindByNameAsync(projectDTO.ProjectManager.UserName))!,
		};
		
		foreach(var teamDTO in projectDTO.Teams) 
		{
			Team team = new Team
			{
				TeamLeader = (await _userManager.FindByNameAsync(teamDTO.TeamLeader.UserName))!,
				Project = project
			};
			project.Teams.Add(team);
		}

		await _projectRepository.CreateAsync(project);
		await _projectRepository.SaveAsync();
		
		await _notificationService.CreateNotificationsForProject(project);
	}
	
	private async Task<bool> IsProjectNameExistsAsync(string name) 
	{
		return await _projectRepository.Get().AnyAsync(p => p.Name == name);
	}
}
