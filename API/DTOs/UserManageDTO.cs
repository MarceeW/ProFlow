namespace API.DTO;

public class UserManageDTO
{
	public required string UserName { get; set; } 
	public IEnumerable<string>? NewRoles { get; set; } 
	public IEnumerable<string>? DeletedRoles { get; set; }
}
