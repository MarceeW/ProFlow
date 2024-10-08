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
	private readonly IStoryRepository _storyRepository;
	private readonly INotificationService _notificationService;
	private readonly UserManager<User> _userManager;

	public ProjectService(
		IProjectRepositoy projectRepository,
		INotificationService notificationService,
		UserManager<User> userManager,
		IStoryRepository storyRepository)
	{
		_projectRepository = projectRepository;
		_notificationService = notificationService;
		_userManager = userManager;
		_storyRepository = storyRepository;
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

	public async Task AddStoryToBacklog(Guid projectId, StoryDTO storyDTO)
	{
		var project = await _projectRepository.ReadAsync(projectId) 
			?? throw new KeyNotFoundException();
			
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

	public async Task RemoveStoryFromBacklog(Guid storyId)
	{
		var story = await _storyRepository.ReadAsync(storyId)
			?? throw new KeyNotFoundException();
			
		_storyRepository.Delete(story);
		await _storyRepository.SaveAsync();
	}
}
