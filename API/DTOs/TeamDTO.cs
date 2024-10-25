
using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.DTO;

public class TeamDTO
{
	public Guid Id { get; set; }
	[Required]
	[MinLength(5)]
	[MaxLength(50)]
	public required string Name { get; set; }
	public required UserDTO TeamLeader { get; set; }
	public ICollection<ProjectDTO> Projects { get; set; } = [];
	public ICollection<UserDTO> Members { get; set; } = [];
	public ICollection<UserSkillDTO> TopUserSkills { get; set; } = [];
}
