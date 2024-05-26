using API.DTO;

namespace API.Interfaces.Repository;

public interface IAccountRepository
{
	Task<IEnumerable<AccountDTO>> GetAccountsAsync();
	Task<IEnumerable<AccountDTO>> GetAccountsByQueryAsync(string query);
	Task<IEnumerable<RoleDTO>> GetRolesAsync();
}
