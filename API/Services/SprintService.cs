using System;
using API.DTOs;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;

namespace API.Services;

public class SprintService : ISprintService
{
	private readonly IProjectRepositoy _projectRepositoy;
	private readonly ISprintRepository _sprintRepository;
	private readonly IStoryRepository _storyRepository;

	public SprintService(
		IProjectRepositoy projectRepositoy,
		IStoryRepository storyRepository,
		ISprintRepository sprintRepository)
	{
		_projectRepositoy = projectRepositoy;
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

	public async Task AddSprintAsync(Guid projectId, SprintDTO sprintDTO)
	{
		var project = await _projectRepositoy.ReadAsync(projectId) 
			?? throw new KeyNotFoundException();
		Sprint sprint = new() 
		{
			Start = sprintDTO.Start,
			End = sprintDTO.End,
			Project = project,
		};
		
		project.Sprints.Add(sprint);
		await _sprintRepository.SaveAsync();
	}
}
