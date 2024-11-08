using API.DTOs;
using API.Models;

namespace API.Interfaces.Repository;

public interface ISprintRepository : IRepository<Sprint, Guid>
{
	Task<IEnumerable<ChartDataDTO>> GetBurndownChartDataAsync(Guid sprintId, User loggedInUser);
}
