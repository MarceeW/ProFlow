using API.Data;
using API.Interfaces.Repository;
using API.Models;

namespace API.Repositories;

public class ProjectRepository : AbstractRepository<Project, Guid>, IProjectRepositoy
{
	public ProjectRepository(DataContext dataContext) : base(dataContext, dataContext.Projects)
	{
	}

	public IEnumerable<Project> GetUserProjects(User user)
	{
		var projects = 
			user.Teams
				.SelectMany(t => t.Projects)
				.Union(user.TeamLeaderInProjects)
				.Union(user.OwnedProjects);
		return projects;
	}
	
	public async Task<Sprint> GetNthSprintAsync(Guid projectId, int n)
	{
		var project = await ReadAsync(projectId) 
			?? throw new KeyNotFoundException();
		return project.Sprints.OrderByDescending(s => s.End).ElementAt(n);
	}
}
