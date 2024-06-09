using API.Models;

namespace API.Interfaces.Repository;

public interface IProjectRepositoy : IRepository<Project, Guid>
{
	Task<bool> IsProjectNameExistsAsync(string projectName);
}
