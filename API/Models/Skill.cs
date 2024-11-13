using System;
using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Skill
{
	[Key]
	public Guid Id { get; set; }
	public required string Name { get; set; }
	public virtual ICollection<UserSkill> UserSkills { get; set; } = [];
	public virtual ICollection<Story> Stories { get; set; } = [];
}
