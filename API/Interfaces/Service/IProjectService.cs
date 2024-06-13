using API.DTO;

namespace API.Interfaces.Service;

public interface IProjectService
{
    Task CreateProjectAsync(ProjectDTO projectDTO);
}
