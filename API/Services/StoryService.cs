using API.DTOs;
using API.Enums;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Services;

public class StoryService : IStoryService
{
	private readonly IStoryRepository _storyRepository;
	private readonly IStoryCommitRepository _storyCommitRepository;
	private readonly INotificationService _notificationService;
	private readonly ILoggingService _loggingService;
	private readonly UserManager<User> _userManager;

	public StoryService(
		IStoryRepository storyRepository,
		IStoryCommitRepository storyCommitRepository,
		UserManager<User> userManager,
		INotificationService notificationService,
		ILoggingService loggingService)
	{
		_storyRepository = storyRepository;
		_storyCommitRepository = storyCommitRepository;
		_userManager = userManager;
		_notificationService = notificationService;
		_loggingService = loggingService;
	}

	public async Task AddCommitAsync(Guid storyId, User loggedInUser, StoryCommitDTO commitDTO)
	{
		var story = await _storyRepository.ReadAsync(storyId)
			?? throw new KeyNotFoundException();
			
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

	public async Task UpdateCommitAsync(StoryCommitDTO commitDTO)
	{
		var commit = await _storyCommitRepository.ReadAsync(commitDTO.Id)
			?? throw new KeyNotFoundException();
			
		commit.StoryCommitType = Enum.Parse<StoryCommitType>(commitDTO.StoryCommitType.ToTitleCase());
		commit.Hours = commitDTO.Hours;
		
		_storyCommitRepository.Update(commit);
	}

	public async Task RemoveCommitAsync(Guid commitId)
	{
		var commit = await _storyCommitRepository.ReadAsync(commitId)
			?? throw new KeyNotFoundException();
			
		_storyCommitRepository.Delete(commit);
	}

	public async Task UpdateAsync(StoryDTO storyDTO)
	{
		var story = await _storyRepository.ReadAsync(storyDTO.Id)
			?? throw new KeyNotFoundException();
		
		story.Title = storyDTO.Title;
		story.Description = storyDTO.Description;
		story.StoryPriority = Enum.Parse<StoryPriority>(storyDTO.StoryPriority.ToTitleCase());
		story.StoryType = Enum.Parse<StoryType>(storyDTO.StoryType.ToTitleCase());
		story.StoryPoints = storyDTO.StoryPoints;
		story.StoryStatus = storyDTO.StoryStatus;
		
		_storyRepository.Update(story);
		await _storyRepository.SaveAsync();
	}

	public async Task Assign(Guid storyId, Guid userId)
	{
		var story = await _storyRepository.ReadAsync(storyId)
			?? throw new KeyNotFoundException();
		
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
	
	public async Task Unassign(Guid storyId, Guid userId)
	{
		var story = await _storyRepository.ReadAsync(storyId)
			?? throw new KeyNotFoundException();
		
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
