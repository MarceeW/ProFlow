using API.Constants;
using API.DTO;
using API.DTOs;
using API.Enums;
using API.Exceptions;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class ProjectService : IProjectService
{
	private readonly IProjectRepositoy _projectRepository;
	private readonly ISprintRepository _sprintRepository;
	private readonly IStoryRepository _storyRepository;
	private readonly INotificationService _notificationService;
	private readonly UserManager<User> _userManager;

	public ProjectService(
		IProjectRepositoy projectRepository,
		INotificationService notificationService,
		UserManager<User> userManager,
		IStoryRepository storyRepository,
		ISprintRepository sprintRepository)
	{
		_projectRepository = projectRepository;
		_notificationService = notificationService;
		_userManager = userManager;
		_storyRepository = storyRepository;
		_sprintRepository = sprintRepository;
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

	public async Task AddStoryToBacklogAsync(Guid projectId, StoryDTO storyDTO, User user)
	{
		var project = await _projectRepository.ReadAsync(projectId) 
			?? throw new KeyNotFoundException();
			
		if(project.ProjectManager != user)
			throw new NotAllowedException();	
		
		Story story = new() 
		{
			Title = storyDTO.Title,
			Description = storyDTO.Description,
			StoryPriority = Enum.Parse<StoryPriority>(storyDTO.StoryPriority.ToTitleCase()),
			StoryType = Enum.Parse<StoryType>(storyDTO.StoryType.ToTitleCase()),
			Project = project,
			StoryPoints = storyDTO.StoryPoints,
			StoryStatus = storyDTO.StoryStatus,
		};
		project.ProductBacklog.Add(story);
		await _projectRepository.SaveAsync();
	}
	
	public async Task AddSprintAsync(Guid projectId, SprintDTO sprintDTO, User user)
	{
		var project = await _projectRepository.ReadAsync(projectId) 
			?? throw new KeyNotFoundException();
			
		if(project.ProjectManager != user)
			throw new NotAllowedException();
			
		if(project.Sprints.Count > 0) 
		{
			var lastSprint = await _projectRepository.GetNthSprintAsync(projectId, 0);
			lastSprint.CloseStories();
		}
			
		Sprint sprint = new() 
		{
			End = sprintDTO.End,
			Project = project,
		};
		
		project.Sprints.Add(sprint);
		await _sprintRepository.SaveAsync();
	}

	public async Task RemoveStoryFromBacklogAsync(Guid storyId, User user)
	{
		var story = await _storyRepository.ReadAsync(storyId)
			?? throw new KeyNotFoundException();
			
		if(story.Project.ProjectManager != user)
			throw new NotAllowedException();
			
		_storyRepository.Delete(story);
		await _storyRepository.SaveAsync();
	}

	public async Task DeleteProjectAsync(Guid projectId, User user)
	{
		Project project = await _projectRepository.ReadAsync(projectId)
			?? throw new KeyNotFoundException();
			
		if(project.ProjectManager != user)
			throw new NotAllowedException();
			
		_projectRepository.Delete(project);
		
		var notificationTargetIds = project.Teams
			.SelectMany(t => t.Members)
			.Select(t => t.Id)
			.Where(t => t != project.ProjectManagerId)
			.Append(project.ProjectManagerId);
		
		foreach(var target in notificationTargetIds) 
		{
			var notification = new Notification
			{
				Type = "report",
				Title = "Project abortion",
				Content = $"{project.Name} project had been aborted!",
				TargetUser = (await _userManager.FindByIdAsync(target.ToString()))!
			};
			await _notificationService.CreateNotificationAsync(notification);
		}
		await _projectRepository.SaveAsync();
	}

	public async Task<bool> UserHasAccessToProjectAsync(Guid projectId, User user)
	{
		Project project = await _projectRepository.ReadAsync(projectId)
			?? throw new KeyNotFoundException();
			
		return UserHasAccessToProject(project, user);
	}
	
	public bool UserHasAccessToProject(Project project, User user)
	{
		var projects = _projectRepository.GetUserProjects(user);
		return projects.Any(p => p == project) || user.UserRoles!
			.Any(r => r.Role.Name!.ToLower() == RoleConstant.Administrator.ToLower());;
	}
}
