
using System.ComponentModel.DataAnnotations;

namespace API.DTO;

public class ProjectDTO
{
	[Required]
	public required string ProjectName { get; set; }
	[Required]
	public required UserDTO ProjectManager { get; set; }
	[Required]
	public required ICollection<TeamDTO> Teams { get; set; }
}
