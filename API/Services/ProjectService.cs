
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
		if(await IsProjectNameExistsAsync(projectDTO.ProjectName))
			throw new NameAlreadyExistsException(projectDTO.ProjectName);
		
		Project project = new Project
		{
			Name = projectDTO.ProjectName,
			ProjectManager = (await _userManager.FindByNameAsync(projectDTO.ProjectManager.UserName))!,
		};
		var teams = projectDTO.Teams.Select(async t =>  new Team
			{
				TeamLeader = (await _userManager.FindByNameAsync(t.TeamLeader.UserName))!,
				Project = project
			});
		project.Teams = await Task.WhenAll(teams);

		await _projectRepository.CreateAsync(project);
		await _projectRepository.SaveAsync();
		
		await _notificationService.CreateNotificationsForProject(project);
	}
	
	private async Task<bool> IsProjectNameExistsAsync(string name) 
	{
		return await _projectRepository.Get().AnyAsync(p => p.Name == name);
	}
}
