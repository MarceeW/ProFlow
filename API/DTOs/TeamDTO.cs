
using System.ComponentModel.DataAnnotations;

namespace API.DTO;

public class TeamDTO
{
	public Guid Id { get; set; }
	[Required]
	[MinLength(5)]
	[MaxLength(50)]
	public required string Name { get; set; }
	public UserDTO? TeamLeader { get; set; }
	public ICollection<ProjectDTO>? Projects { get; set; }
	public ICollection<UserDTO>? Members { get; set; }
}
