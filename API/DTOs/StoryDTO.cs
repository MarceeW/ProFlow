using System;
using System.ComponentModel.DataAnnotations;
using API.DTO;
using API.Enums;

namespace API.DTOs;

public class StoryDTO
{
	public Guid Id { get; set; }
	public DateTime Created { get; set; }
	public DateTime? Closed { get; set; }
	public Guid? SprintId { get; set; }
	[Required]
	public required string Title { get; set; }
	[Required]
	public required string Description { get; set; }
	public UserDTO? AssignedTo { get; set; }
	[Required]
	public required string StoryPriority { get; set; }
	[Required]
	public required string StoryType { get; set; }
	public int? StoryPoints { get; set; }
	public StoryStatus StoryStatus { get; set; }
	public List<string> Tags { get; set; } = [];
}
