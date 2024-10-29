using API.DTO;
using API.DTOs;
using API.DTOs.Reports;
using API.Models;

namespace API.Interfaces.Repository;

public interface IProjectRepositoy : IRepository<Project, Guid>
{
	IEnumerable<Project> GetUserProjects(User user);
	Task<Sprint?> GetNthSprintAsync(Guid projectId, Guid teamId, int n);
	Task<IEnumerable<Story>> GetBacklog(Guid projectId);
	Task<IEnumerable<BacklogStatDTO>> GetBacklogStatsAsync(Guid projectId);
}
