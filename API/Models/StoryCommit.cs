using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Enums;

namespace API.Models;

public class StoryCommit
{
	[Key]
	public Guid Id { get; set; }
	public DateTime Created { get; set; } = DateTime.Now;
	[ForeignKey(nameof(CommiterId))]
	public virtual required User Commiter { get; set; }
	public Guid CommiterId { get; set; }
	[ForeignKey(nameof(StoryId))]
	public virtual required Story Story { get; set; }
	public Guid StoryId { get; set; }
	public required StoryCommitType StoryCommitType { get; set; }
	[MaxLength(48)]
	public required string Summary { get; set; }
	public required int Hours { get; set; }
	
	public override bool Equals(object? obj)
	{
		if(obj is StoryCommit s) 
			return s.Id == Id;
		throw new InvalidOperationException();
	}

	public override int GetHashCode()
	{
		return Id.GetHashCode();
	}
}
