using System;
using API.Data;
using API.DTOs;
using API.Exceptions;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class TeamRepository : AbstractRepository<Team, Guid>, ITeamRepository
{
	public TeamRepository(DataContext dataContext) : base(dataContext, dataContext.Teams)
	{
	}

	public async Task<IEnumerable<ChartDataDTO>> GetVelocityChartDataAsync(Guid teamId, User loggedInUser)
	{
		var team = await ReadAsync(teamId) ?? throw new KeyNotFoundException();
		
		//if(!team.IsUserPartOf(loggedInUser))
		//	throw new NotAllowedException();
		
		
		
		return [];
	}
}
