using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Enums;

namespace API.Models;

public class StoryStatusChange
{
	[Key]
	public Guid Id { get; set; }
	[ForeignKey(nameof(UserId))]
	public required virtual User User { get; set; }
	public Guid UserId { get; set; }
	public DateTime Timestamp { get; set; } = DateTime.Now;
	[ForeignKey(nameof(StoryId))]
	public required virtual Story Story { get; set; }
	public Guid StoryId { get; set; }
	public required StoryStatus PreviousStoryStatus { get; set; }
	public required StoryStatus StoryStatus { get; set; }
}
