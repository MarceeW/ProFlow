using API.DTOs;
using API.Enums;
using API.Exceptions;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Services;

public class StoryService : IStoryService
{
	private readonly IStoryRepository _storyRepository;
	private readonly IProjectService _projectService;
	private readonly IStoryCommitRepository _storyCommitRepository;
	private readonly IStoryStatusChangeRepository _storyStatusChangeRepository;
	private readonly INotificationService _notificationService;
	private readonly ILoggingService _loggingService;
	private readonly UserManager<User> _userManager;

	public StoryService(
		IStoryRepository storyRepository,
		IStoryCommitRepository storyCommitRepository,
		UserManager<User> userManager,
		INotificationService notificationService,
		ILoggingService loggingService,
		IProjectService projectService,
		IStoryStatusChangeRepository storyStatusChangeRepository)
	{
		_storyRepository = storyRepository;
		_storyCommitRepository = storyCommitRepository;
		_userManager = userManager;
		_notificationService = notificationService;
		_loggingService = loggingService;
		_projectService = projectService;
		_storyStatusChangeRepository = storyStatusChangeRepository;
	}

	public async Task AddCommitAsync(Guid storyId, User loggedInUser, StoryCommitDTO commitDTO)
	{
		var story = await _storyRepository.ReadAsync(storyId)
			?? throw new KeyNotFoundException();
			
		if(!_projectService.UserHasAccessToProject(story.Project, loggedInUser))
			throw new NotAllowedException();
		
		StoryCommit commit = new() 
		{
			Commiter = loggedInUser,
			Story = story,
			StoryCommitType = Enum.Parse<StoryCommitType>(commitDTO.StoryCommitType.ToTitleCase()),
			Summary = commitDTO.Summary,
			Hours = commitDTO.Hours
		};
		
		story.StoryCommits.Add(commit);
		await _storyRepository.SaveAsync();
	}

	public async Task UpdateCommitAsync(StoryCommitDTO commitDTO, User loggedInUser)
	{
		var commit = await _storyCommitRepository.ReadAsync(commitDTO.Id)
			?? throw new KeyNotFoundException();
			
		if(!_projectService.UserHasAccessToProject(commit.Story.Project, loggedInUser))
			throw new NotAllowedException();
		
		commit.StoryCommitType = Enum.Parse<StoryCommitType>(commitDTO.StoryCommitType.ToTitleCase());
		commit.Hours = commitDTO.Hours;
		
		_storyCommitRepository.Update(commit);
	}

	public async Task RemoveCommitAsync(Guid commitId, User loggedInUser)
	{
		var commit = await _storyCommitRepository.ReadAsync(commitId)
			?? throw new KeyNotFoundException();
			
		if(!_projectService.UserHasAccessToProject(commit.Story.Project, loggedInUser))
			throw new NotAllowedException();
			
		_storyCommitRepository.Delete(commit);
		await _storyCommitRepository.SaveAsync();
	}

	public async Task UpdateAsync(StoryDTO storyDTO, User loggedInUser)
	{
		var story = await _storyRepository.ReadAsync(storyDTO.Id)
			?? throw new KeyNotFoundException();
		
		if(!_projectService.UserHasAccessToProject(story.Project, loggedInUser))
			throw new NotAllowedException();
		
		if(story.StoryStatus != storyDTO.StoryStatus)
		{
			story.Closed = storyDTO.StoryStatus == StoryStatus.Done ? 
				DateTime.Now : null;
				
			if(story.StoryStatus + 1 == storyDTO.StoryStatus && storyDTO.StoryStatus == StoryStatus.InPorgress) 
				story.ResolveStart = DateTime.Now;
			else if(storyDTO.StoryStatus == StoryStatus.Backlog)
				story.ResolveStart = null;

			await _storyStatusChangeRepository.CreateAsync(new()
			{
				Story = story,
				PreviousStoryStatus = story.StoryStatus,
				StoryStatus = storyDTO.StoryStatus
			});
			await _storyStatusChangeRepository.SaveAsync();
		}
		
		story.Title = storyDTO.Title;
		story.Description = storyDTO.Description;
		story.StoryPriority = Enum.Parse<StoryPriority>(storyDTO.StoryPriority.ToTitleCase());
		story.StoryType = Enum.Parse<StoryType>(storyDTO.StoryType.ToTitleCase());
		story.StoryPoints = storyDTO.StoryPoints;
		story.StoryStatus = storyDTO.StoryStatus;
		
		_storyRepository.Update(story);
		await _storyRepository.SaveAsync();
	}

	public async Task Assign(Guid storyId, Guid userId, User loggedInUser)
	{
		var story = await _storyRepository.ReadAsync(storyId)
			?? throw new KeyNotFoundException();
		
		if(!_projectService.UserHasAccessToProject(story.Project, loggedInUser)
				|| userId != loggedInUser.Id)
			throw new NotAllowedException();
		
		var user = await _userManager.FindByIdAsync(userId.ToString())
			?? throw new KeyNotFoundException();
			
		story.AssignedTo = user;
		await _storyRepository.SaveAsync();
		await _loggingService.CreateLogAsync(new Log 
		{
			UserId = userId,
			LoggerLevel = Castle.Core.Logging.LoggerLevel.Info,
			Source = nameof(StoryService),
			Message = $"Assignee set to storyId: {storyId}"
		});
		
		await _notificationService.CreateNotificationAsync(new Notification
		{
			Type = "info",
			Title = "Story assignation",
			Content = $"You have successfully assigned to '{story.Title}' story!",
			TargetUser = user
		});
	}
	
	public async Task Unassign(Guid storyId, Guid userId, User loggedInUser)
	{
		var story = await _storyRepository.ReadAsync(storyId)
			?? throw new KeyNotFoundException();
		
		if(!_projectService.UserHasAccessToProject(story.Project, loggedInUser)
				|| userId != loggedInUser.Id)
			throw new NotAllowedException();
		
		var user = await _userManager.FindByIdAsync(userId.ToString())
			?? throw new KeyNotFoundException();
			
		story.AssignedTo = null;
		await _storyRepository.SaveAsync();
		await _loggingService.CreateLogAsync(new Log 
		{
			UserId = userId,
			LoggerLevel = Castle.Core.Logging.LoggerLevel.Info,
			Source = nameof(StoryService),
			Message = $"Assignee removed from storyId: {storyId}"
		});
		
		await _notificationService.CreateNotificationAsync(new Notification
		{
			Type = "info",
			Title = "Deleted story assignation",
			Content = $"You have successfully unassigned from '{story.Title}' story!",
			TargetUser = user
		});
	}
}
