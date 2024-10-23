using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SkillDTO
{
	public Guid Id { get; set; }
	[Required]
	public required string Name { get; set; }
}
