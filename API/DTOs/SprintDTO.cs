using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SprintDTO
{
	public Guid Id { get; set; }
	[Required]
	public DateOnly Start { get; set; }
	[Required]
	public DateOnly End { get; set; }
	public ICollection<StoryDTO> SprintBacklog { get; set; } = [];
}
