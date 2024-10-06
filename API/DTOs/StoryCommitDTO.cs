using System;
using System.ComponentModel.DataAnnotations;
using API.DTO;

namespace API.DTOs;

public class StoryCommitDTO
{
	public Guid Id { get; set; }
	public DateTime Created { get; set; }
	[Required]
	public required UserDTO Commiter { get; set; }
	[Required]
	public required string StoryCommitType { get; set; }
	[Required]
	public required int Hours { get; set; }
}
