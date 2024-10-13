using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;

namespace API.Repositories;

public class SprintRepository : AbstractRepository<Sprint, Guid>, ISprintRepository
{
	private readonly IProjectRepositoy _projectRepository;
	public SprintRepository(
		DataContext dataContext, 
		IProjectRepositoy projectRepositoy) : base(dataContext, dataContext.Sprints)
	{
		_projectRepository = projectRepositoy;
	}

	public async Task<Sprint?> GetLatestSprint(Guid projectId)
	{
		var project = await _projectRepository.ReadAsync(projectId);
		return project.Sprints.MaxBy(s => s.Start);
	}
}
