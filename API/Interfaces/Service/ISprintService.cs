using API.DTOs;

namespace API.Interfaces.Service;

public interface ISprintService
{
	Task AddStoriesToBacklog(Guid sprintId, IEnumerable<StoryDTO> stories);
	Task Close(Guid sprintId);
	Task RemoveStoriesFromBacklog(Guid sprintId, IEnumerable<StoryDTO> stories);
}
