using System;
using System.ComponentModel.DataAnnotations;
using API.Models;

namespace API.DTOs;

public class UserSkillDTO
{
	[Required]
	public required SkillDTO Skill { get; set; }
	[Required]
	public required int SkillLevel { get; set; }
}
