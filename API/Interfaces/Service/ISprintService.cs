using API.DTOs;
using API.Models;

namespace API.Interfaces.Service;

public interface ISprintService
{
	Task AddStoriesToBacklog(Guid sprintId, IEnumerable<StoryDTO> stories);
	Task Close(Guid sprintId);
	Task RemoveStoriesFromBacklog(Guid sprintId, IEnumerable<StoryDTO> stories);
	Task<bool> UserHasAccessToSprintAsync(Guid sprintId, User user);
	bool UserHasAccessToSprint(Sprint sprint, User user);
}
