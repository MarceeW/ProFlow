using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Enums;

namespace API.Models;

public class Story
{
	[Key]
	public Guid Id { get; set; } = Guid.NewGuid();
	public DateTime Created { get; set; } = DateTime.UtcNow;
	public required string Title { get; set; }
	public required string Description { get; set; }
	[ForeignKey(nameof(AssignedToId))]
	public virtual User? AssignedTo { get; set; }
	public Guid? AssignedToId { get; set; }
	public required StoryPriority StoryPriority { get; set; }
	public required StoryType StoryType { get; set; }
	[ForeignKey(nameof(ProjectId))]
	public virtual required Project Project { get; set; }
	public required Guid ProjectId { get; set; }
	[ForeignKey(nameof(SprintId))]
	public virtual Sprint? Sprint { get; set; }
	public Guid? SprintId { get; set; }
	public required int StoryPoints { get; set; }
	public virtual ICollection<StoryCommit> StoryCommits { get; set; } = [];
}
