using System;
using API.DTOs;
using API.Models;

namespace API.Interfaces.Repository;

public interface ITeamRepository : IRepository<Team, Guid>
{
	public Task<IEnumerable<ChartDataDTO>> GetVelocityChartDataAsync(Guid teamId, User loggedInUser);
}
