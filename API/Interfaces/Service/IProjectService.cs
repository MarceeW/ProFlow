using API.DTO;
using API.DTOs;
using API.Models;

namespace API.Interfaces.Service;

public interface IProjectService
{
	Task CreateProjectAsync(ProjectDTO projectDTO);
	Task AddStoryToBacklog(Guid projectId, StoryDTO story);
	Task AddSprintAsync(Guid projectId, SprintDTO sprintDTO);
	Task RemoveStoryFromBacklog(Guid storyId);
	Task DeleteProject(Guid projectId);
}
