using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SprintDTO
{
	public Guid Id { get; set; }
	[Required]
	public DateTime Start { get; set; }
	[Required]
	public DateTime End { get; set; }
	public int Capacity { get; set; }
	public ICollection<StoryDTO> SprintBacklog { get; set; } = [];
	public bool IsActive { get; set; }
	public Guid TeamId { get; set; }
}
