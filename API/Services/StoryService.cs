using API.DTOs;
using API.Enums;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;

namespace API.Services;

public class StoryService : IStoryService
{
	private readonly IStoryRepository _storyRepository;
	private readonly IStoryCommitRepository _storyCommitRepository;

	public StoryService(
		IStoryRepository storyRepository, 
		IStoryCommitRepository storyCommitRepository)
	{
		_storyRepository = storyRepository;
		_storyCommitRepository = storyCommitRepository;
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
	}
}
