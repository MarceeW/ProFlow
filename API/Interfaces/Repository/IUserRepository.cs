using API.DTO;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
	Task<IEnumerable<UserDTO>> GetUsersAsync(string? roles);
	Task<UserDTO> GetUserByUserNameAsync(string userName);
}
