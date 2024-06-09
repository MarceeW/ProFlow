using API.DTO;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
	Task<IEnumerable<UserDTO>> GetUsersAsync(string? filter);
	Task<UserDTO> GetUserByUserNameAsync(string userName);
}
