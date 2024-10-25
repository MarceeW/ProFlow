using API.DTO;
using API.DTOs;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
	Task<IEnumerable<UserDTO>> GetUsersAsync(string? roles);
	Task<UserDTO> GetUserByUserNameAsync(string userName);
	Task<UserStatDTO> GetUserStatsAsync(Guid id);
}
