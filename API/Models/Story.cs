using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Enums;

namespace API.Models;

public class Story
{
	[Key]
	public Guid Id { get; set; }
	public DateTime Created { get; set; } = DateTime.Now;
	public DateTime? Closed { get; set; }
	public required string Title { get; set; }
	public required string Description { get; set; }
	[ForeignKey(nameof(AssignedToId))]
	public virtual User? AssignedTo { get; set; }
	public Guid? AssignedToId { get; set; }
	public required StoryPriority StoryPriority { get; set; }
	public required StoryType StoryType { get; set; }
	[ForeignKey(nameof(ProjectId))]
	public virtual required Project Project { get; set; }
	public Guid ProjectId { get; set; }
	[ForeignKey(nameof(SprintId))]
	public virtual Sprint? Sprint { get; set; }
	public Guid? SprintId { get; set; }
	public int? StoryPoints { get; set; }
	public required StoryStatus StoryStatus { get; set; } = StoryStatus.Backlog;
	public virtual ICollection<StoryCommit> StoryCommits { get; set; } = [];

	public override bool Equals(object? obj)
	{
		if(obj is Story s) 
			return s.Id == Id;
		throw new InvalidOperationException();
	}

	public override int GetHashCode()
	{
		return Id.GetHashCode();
	}
}
