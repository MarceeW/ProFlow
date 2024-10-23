
namespace API.DTO;

public class AccountDTO
{
	public required Guid Id { get; set; }
	public required ICollection<string> Roles { get; set; }
	public InvitationDTO? Invitation { get; set; }
	public required string UserName { get; set; }
	public required string FirstName { get; set; }
	public required string LastName { get; set; }
	public required DateOnly DateOfBirth { get; set; }
	public DateTime Created { get; set; }
	public DateTime LastSeen { get; set; }
}
