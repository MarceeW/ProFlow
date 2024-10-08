using System;
using API.DTOs;

namespace API.Interfaces.Service;

public interface ISprintService
{
	Task AddSprintAsync(Guid projectId, SprintDTO sprintDTO);
	Task AddStoriesToBacklog(Guid sprintId, IEnumerable<StoryDTO> stories);
	Task RemoveStoriesFromBacklog(Guid sprintId, IEnumerable<StoryDTO> stories);
}
