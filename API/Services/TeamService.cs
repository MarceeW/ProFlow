using API.DTO;
using API.Exceptions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class TeamService(
	ITeamRepository teamRepository,
	UserManager<User> userManager,
	INotificationService notificationService,
	IProjectRepositoy projectRepositoy,
	ILoggingService loggingService) : ITeamService
{ 
	private readonly ITeamRepository _teamRepository = teamRepository;
	private readonly IProjectRepositoy _projectRepository = projectRepositoy;
	private readonly UserManager<User> _userManager = userManager;
	private readonly INotificationService _notificationService = notificationService;
	private readonly ILoggingService _loggingService = loggingService;

	public async Task CreateTeamAsync(TeamDTO teamDTO, User user) 
	{
		if(await TeamNameExistsAsync(teamDTO.Name))
			throw new NameAlreadyExistsException(teamDTO.Name);
		
		var tasks = teamDTO.Members?
			.Select(async m => (await _userManager.FindByNameAsync(m.UserName))!);
		var members = ((await Task.WhenAll(tasks?.ToList() ?? [])) ?? []).Append(user);
		
		Team team = new()
		{
			TeamLeader = user,
			Name = teamDTO.Name,
			Members = members.ToList()
		};

		var notifications = team.Members.Select(m => 
		{
			var notification = new Notification
			{
				Type = "info",
				Title = "Team invitation",
				Content = $"You are now part of '{team.Name} team'!",
				TargetUser = m
			};
			
			return notification;
		});
		
		await _notificationService.CreateNotificationsAsync(notifications);
		
		await _teamRepository.CreateAsync(team);
		await _teamRepository.SaveAsync();
	}
	
	public async Task DeleteTeamAsync(Guid id, User loggedInUser)
	{
		Team team = await _teamRepository.ReadAsync(id);
		if(team.TeamLeader != loggedInUser)
			throw new NotAllowedException();
		
		var teamStories = team.Sprints.SelectMany(s => s.SprintBacklog);
		
		foreach(var story in teamStories)
			story.SprintId = null;
		
		_teamRepository.Delete(team);

		var notifications = team.Members.Select(m => 
		{
			var notification = new Notification
			{
				Type = "report",
				Title = "Team disbandment",
				Content = $"{team.Name} team had been deleted!",
				TargetUser = m
			};
			
			return notification;
		});
		
		await _notificationService.CreateNotificationsAsync(notifications);
		await _teamRepository.SaveAsync();
	}
	
	public async Task AddToTeamAsync(User loggedInUser, Guid teamId, IEnumerable<UserDTO> users)
	{
		var team = await _teamRepository.ReadAsync(teamId) 
			?? throw new KeyNotFoundException();
			
		if(team.TeamLeader != loggedInUser)
			throw new NotAllowedException();
		
		foreach(var userDTO in users) 
		{
			var user = (await _userManager.FindByNameAsync(userDTO.UserName))!;
			if(team.Members.Any(u => u.UserName == user.UserName))
				continue;
				
			team.Members.Add(user);
			await _notificationService.CreateNotificationAsync(new Notification
			{
				Type = "",
				Title = "Team invite",
				Content = $"You have been added to {team.TeamLeader}'s '{team.Name}' team!",
				TargetUser = user
			});
		}
		
		await _teamRepository.SaveAsync();
	}

	public async Task RemoveFromTeamAsync(User loggedInUser, Guid teamId, IEnumerable<UserDTO> users)
	{
		var team = await _teamRepository.ReadAsync(teamId) 
			?? throw new KeyNotFoundException();
		
		if(team.TeamLeader != loggedInUser)
			throw new NotAllowedException();
			
		if(users.Any(u => u.Id == team.TeamLeaderId))
			throw new NotAllowedException("You can't delete yourself from the team!");
		
		foreach(var userDTO in users) 
		{
			var user = (await _userManager.FindByNameAsync(userDTO.UserName))!;
			team.Members.Remove(user);
		}
		
		await _teamRepository.SaveAsync();
	}
	
	public async Task RenameAsync(User loggedInUser, TeamDTO teamDTO)
	{
		var team = await _teamRepository.ReadAsync(teamDTO.Id) 
			?? throw new KeyNotFoundException();
		
		if(team.TeamLeader != loggedInUser)
			throw new NotAllowedException();
			
		team.Name = teamDTO.Name;
		await _teamRepository.SaveAsync();
	}
	
	private async Task<bool> TeamNameExistsAsync(string name) 
	{
		return await _teamRepository.Get().AnyAsync(t => t.Name == name);
	}

	public async Task AddToProjectAsync(User loggedInUser, Guid teamId, IEnumerable<ProjectDTO> projects)
	{
		var team = await _teamRepository.ReadAsync(teamId) 
			?? throw new KeyNotFoundException();
		
		if(team.TeamLeader != loggedInUser)
			throw new NotAllowedException();
			
		foreach(var projectDTO in projects) 
		{
			var project = await _projectRepository.ReadAsync(projectDTO.Id)!;
			project.Teams.Add(team);
		}	
			
		await _projectRepository.SaveAsync();
	}

	public async Task RemoveFromProjectAsync(User loggedInUser, Guid teamId, IEnumerable<ProjectDTO> projects)
	{
		var team = await _teamRepository.ReadAsync(teamId) 
			?? throw new KeyNotFoundException();
		
		if(team.TeamLeader != loggedInUser)
			throw new NotAllowedException();
		
		foreach(var projectDTO in projects) 
		{
			var project = await _projectRepository.ReadAsync(projectDTO.Id)!;
			team.Projects.Remove(project);
		}
		
		await _teamRepository.SaveAsync();
	}
}
