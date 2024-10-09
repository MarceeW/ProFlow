using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace API.Models;

[Index(nameof(Start), AllDescending = true)]
public class Sprint
{
	[Key]
	public Guid Id { get; set; }
	public DateOnly Start { get; set; }
	public required DateOnly End { get; set; }
	[ForeignKey(nameof(ProjectId))]
	public virtual required Project Project { get; set; }
	public Guid ProjectId { get; set; }
	public virtual ICollection<Story> SprintBacklog { get; set; } = [];
}
