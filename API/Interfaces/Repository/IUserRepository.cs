using API.DTO;
using API.DTOs;
using API.DTOs.Reports;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
	Task<IEnumerable<UserDTO>> GetUsersAsync(string? roles);
	Task<UserDTO> GetUserByUserNameAsync(string userName);
	Task<UserStatDTO> GetUserStatsAsync(Guid id);
	Task<IEnumerable<BacklogStatDTO>> GetUserAssignedStoriesStatsAsync(Guid id);
}
