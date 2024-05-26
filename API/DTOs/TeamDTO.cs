
namespace API.DTO;

public class TeamDTO
{
	public required UserDTO TeamLeader { get; set; }
	public ICollection<UserDTO>? Members { get; set; }
}
