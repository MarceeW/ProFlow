using API.Constants;
using API.DTOs;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;

namespace API.Services;

public class SprintService : ISprintService
{
	private readonly IProjectRepositoy _projectRepository;
	private readonly ISprintRepository _sprintRepository;
	private readonly IStoryRepository _storyRepository;

	public SprintService(
		IProjectRepositoy projectRepositoy,
		IStoryRepository storyRepository,
		ISprintRepository sprintRepository)
	{
		_projectRepository = projectRepositoy;
		_storyRepository = storyRepository;
		_sprintRepository = sprintRepository;
	}
	
	public async Task RemoveStoriesFromBacklog(Guid sprintId, IEnumerable<StoryDTO> stories) 
	{
		var sprint = await _sprintRepository.ReadAsync(sprintId) 
			?? throw new KeyNotFoundException();
			
		foreach(var storyDTO in stories) 
		{
			var story = await _storyRepository.ReadAsync(storyDTO.Id);
			if (story == null)
				continue;
				
			story.Sprint = null;
			sprint.SprintBacklog.Remove(story);
		}
		await _sprintRepository.SaveAsync();
	}
	
	public async Task AddStoriesToBacklog(Guid sprintId, IEnumerable<StoryDTO> stories)
	{
		var sprint = await _sprintRepository.ReadAsync(sprintId) 
			?? throw new KeyNotFoundException();
		
		foreach(var storyDTO in stories) 
		{
			var story = await _storyRepository.ReadAsync(storyDTO.Id);
			if (story == null)
				continue;
				
			story.Sprint = sprint;
			sprint.SprintBacklog.Add(story);
		}
		await _sprintRepository.SaveAsync();
	}

	public async Task Close(Guid sprintId)
	{
		var sprint = await _sprintRepository.ReadAsync(sprintId)
				?? throw new KeyNotFoundException("Invalid sprint id!");
				
		sprint.End = DateTime.Now;
		
		sprint.CloseStories();
			
		await _sprintRepository.SaveAsync();
	}

	public async Task<bool> UserHasAccessToSprintAsync(Guid sprintId, User user)
	{
		var sprint = await _sprintRepository.ReadAsync(sprintId)
				?? throw new KeyNotFoundException("Invalid sprint id!");
				
		return UserHasAccessToSprint(sprint, user);
	}

	public bool UserHasAccessToSprint(Sprint sprint, User user)
	{
		var members = sprint.Members;
		return members.Any(m => m == user) || user.UserRoles!
			.Any(r => r.Role.Name!.ToLower() == RoleConstant.Administrator.ToLower());
	}
}
