using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;

namespace API.Repositories;

public class SprintRepository : AbstractRepository<Sprint, Guid>, ISprintRepository
{
	private readonly IProjectRepositoy _projectRepositoy;
	public SprintRepository(
		DataContext dataContext, 
		IProjectRepositoy projectRepositoy) : base(dataContext, dataContext.Sprints)
	{
		_projectRepositoy = projectRepositoy;
	}

	public async Task<Sprint?> GetLatestSprint(Guid projectId)
	{
		var project = await _projectRepositoy.ReadAsync(projectId);
		return project.Sprints.MaxBy(s => s.Start);
	}
}
