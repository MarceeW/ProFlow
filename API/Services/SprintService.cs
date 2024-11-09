using API.Constants;
using API.DTOs;
using API.Enums;
using API.Exceptions;
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
		var members = sprint.Team.Members;
		return members.Any(m => m == user) || user.UserRoles!
			.Any(r => r.Role.Name!.ToLower() == RoleConstant.Administrator.ToLower());
	}

	public async Task Update(SprintDTO sprintDTO)
	{	
		var sprint = await _sprintRepository.ReadAsync(sprintDTO.Id)
			?? throw new KeyNotFoundException();
		
		sprint.Start = sprintDTO.Start;
		sprint.End = sprintDTO.End;
		sprint.Capacity = sprintDTO.Capacity;
		
		_sprintRepository.Update(sprint);
		await _projectRepository.SaveAsync();
	}

	public async Task UpdateBacklog(Guid sprintId, 
		IEnumerable<SprintBacklogUpdateItemDTO> sprintBacklogUpdateItemDTOs)
	{
		var sprint = await _sprintRepository.ReadAsync(sprintId) 
			?? throw new KeyNotFoundException();
			
		foreach(var item in sprintBacklogUpdateItemDTOs) 
		{
			var story = await _storyRepository.ReadAsync(item.Id);
			if (story == null)
				continue;
				
			if(item.Remove) 
			{
				story.StoryStatus = StoryStatus.Backlog;
				story.Sprint = null;
				sprint.SprintBacklog.Remove(story);
			} else 
			{
				story.Sprint = sprint;
				sprint.SprintBacklog.Add(story);
			}
		}
		await _sprintRepository.SaveAsync();
	}
}
