﻿
using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.DTO;

public class ProjectDTO
{
	public Guid Id { get; set; }
	[Required]
	public required string Name { get; set; }
	[Required]
	public required UserDTO ProjectManager { get; set; }
	[Required]
	public required ICollection<UserDTO> TeamLeaders { get; set; }
	public ICollection<ShortTeamDTO> Teams { get; set; } = [];
	public ICollection<ShortSprintDTO> Sprints { get; set; } = [];
}
