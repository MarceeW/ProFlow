using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;

namespace API.Repositories;

public class SprintRepository : AbstractRepository<Sprint, Guid>, ISprintRepository
{
	public SprintRepository(
		DataContext dataContext) : base(dataContext, dataContext.Sprints)
	{
	}
}
