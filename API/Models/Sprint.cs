using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class Sprint
{
	[Key]
	public Guid Id { get; set; } = Guid.NewGuid();
	public DateOnly Start { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
	public required DateOnly End { get; set; }
	[ForeignKey(nameof(ProjectId))]
	public virtual required Project Project { get; set; }
	public required Guid ProjectId { get; set; }
	public virtual ICollection<Story> SprintBacklog { get; set; } = [];
}
