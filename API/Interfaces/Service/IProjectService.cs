using API.DTO;
using API.DTOs;

namespace API.Interfaces.Service;

public interface IProjectService
{
	Task CreateProjectAsync(ProjectDTO projectDTO);
	Task AddStoryToBacklog(Guid projectId, StoryDTO story);
	Task RemoveStoryFromBacklog(Guid storyId);
}
