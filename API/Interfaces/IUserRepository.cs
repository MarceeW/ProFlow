using API.Models;

namespace API.Interfaces;

public interface IUserRepository
{
	Task<IEnumerable<UserDTO>> GetUsersAsync();
	Task<IEnumerable<UserDTO>> GetUsersByQueryAsync(string query);
}
