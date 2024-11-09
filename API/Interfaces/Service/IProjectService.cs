using API.DTO;
using API.DTOs;
using API.Models;

namespace API.Interfaces.Service;

public interface IProjectService
{
	Task<bool> UserHasAccessToProjectAsync(Guid projectId, User user);
	bool UserHasAccessToProject(Project project, User user);
	Task CreateProjectAsync(ProjectDTO projectDTO);
	Task UpdateProjectAsync(ProjectDTO projectDTO);
	Task AddStoryToBacklogAsync(Guid projectId, StoryDTO story, User user);
	Task AddSprintAsync(Guid projectId, SprintDTO sprintDTO, User user);
	Task RemoveStoryFromBacklogAsync(Guid storyId, User user);
	Task DeleteProjectAsync(Guid projectId, User user);
}
