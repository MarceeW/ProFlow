using System;
using System.ComponentModel.DataAnnotations;
using API.DTO;

namespace API.DTOs;

public class StoryDTO
{
	public Guid Id { get; set; }
	public DateTime Created { get; set; }
	[Required]
	public required string Title { get; set; }
	[Required]
	public required string Description { get; set; }
	public UserDTO? AssignedTo { get; set; }
	[Required]
	public required string StoryPriority { get; set; }
	[Required]
	public required string StoryType { get; set; }
	[Required]
	public required int StoryPoints { get; set; }
	public ICollection<StoryCommitDTO> StoryCommits { get; set; } = [];
}