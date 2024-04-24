using API.DTO;
using API.Models;

namespace API.Interfaces;

public interface IAccountRepository
{
	Task<IEnumerable<UserDTO>> GetUsersAsync();
	Task<IEnumerable<UserDTO>> GetUsersByQueryAsync(string query);
	Task<IEnumerable<RoleDTO>> GetRolesAsync();
}
