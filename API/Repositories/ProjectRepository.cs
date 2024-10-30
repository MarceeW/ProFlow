using API.Data;
using API.DTOs.Reports;
using API.Exceptions;
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
	
	public async Task<Sprint?> GetNthSprintAsync(Guid projectId, Guid teamId, int n)
	{
		var project = await ReadAsync(projectId) ?? throw new KeyNotFoundException();
			
		var sprints = project.Sprints
			.Where(s => s.TeamId == teamId);
			
		if(!sprints.Any())
			return null;
			
		return sprints.OrderByDescending(s => s.End).ElementAt(n);
	}

	public async Task<IEnumerable<BacklogStatDTO>> GetBacklogStatsAsync(Guid projectId)
	{
		var project = await ReadAsync(projectId) ?? throw new KeyNotFoundException();
			
		return project.ProductBacklog
			.GroupBy(pb => pb.StoryStatus)
			.Select(group => new BacklogStatDTO
			{
				StoryStatus = group.Key,
				Count = group.Count()
			});
	}

	public async Task<IEnumerable<Story>> GetBacklog(Guid projectId)
	{
		var project = await ReadAsync(projectId) ?? throw new KeyNotFoundException();
		return project.ProductBacklog.Where(s => s.StoryStatus != Enums.StoryStatus.Done);
	}

	public async Task<IEnumerable<StoryStatusChange>> GetLastUpdatesAsync(Guid projectId, User loggedInUser)
	{
		var project = await ReadAsync(projectId) ?? throw new KeyNotFoundException();
		const int changesToReturn = 10;
		
		if(project.ProjectManager == loggedInUser) 
			return project.ProductBacklog
				.SelectMany(pb => pb.StoryStatusChanges)
				.OrderByDescending(s => s.Timestamp)
				.Take(changesToReturn);

		if(!project.IsUserPartOf(loggedInUser))
			throw new NotAllowedException();
			
		return project.Teams
			.Where(t => t.Members.Any(m => m == loggedInUser)).First()
			.Sprints.Where(s => s.IsActive && s.Project == project).First()
			.SprintBacklog.SelectMany(s => s.StoryStatusChanges)
			.OrderByDescending(s => s.Timestamp)
			.Take(changesToReturn);
	}
}
