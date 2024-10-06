using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Enums;

namespace API.Models;

public class StoryCommit
{
	[Key]
	public Guid Id { get; set; } = Guid.NewGuid();
	public DateTime Created { get; set; } = DateTime.UtcNow;
	[ForeignKey(nameof(CommiterId))]
	public virtual required User Commiter { get; set; }
	public required Guid CommiterId { get; set; }
	[ForeignKey(nameof(StoryId))]
	public virtual required Story Story { get; set; }
	public required Guid StoryId { get; set; }
	public required StoryCommitType StoryCommitType { get; set; }
	public required int Hours { get; set; }
}
