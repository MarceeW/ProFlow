
namespace API.DTO;

public class ProjectDTO
{
	public required string ProjectName { get; set; }
	public required UserDTO ProjectManager { get; set; }
	public ICollection<TeamDTO>? Teams { get; set; }
}
