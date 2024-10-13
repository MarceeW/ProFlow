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
	public DateTime? EarlyClose { get; set; }
	public ICollection<StoryDTO> SprintBacklog { get; set; } = [];
	public bool IsActive { get; set; }
}
