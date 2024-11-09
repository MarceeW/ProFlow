using API.DTOs;
using API.Models;

namespace API.Interfaces.Service;

public interface ISprintService
{
	Task UpdateBacklog(Guid sprintId, IEnumerable<SprintBacklogUpdateItemDTO> sprintBacklogUpdateItemDTOs);
	Task Update(SprintDTO sprintDTO);
	Task Close(Guid sprintId);
	Task<bool> UserHasAccessToSprintAsync(Guid sprintId, User user);
	bool UserHasAccessToSprint(Sprint sprint, User user);
}
