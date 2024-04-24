using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class Project
{
	[Key]
	public Guid Id { get; set;} = Guid.NewGuid();
	public required string Name { get; set;}
	[ForeignKey(nameof(ProjectManagerId))]
	public virtual required User ProjectManager { get; set; }
	public virtual required Guid ProjectManagerId { get; set; }
	public virtual ICollection<Team>? Teams { get; set; }
	public DateTime Created { get; set; } = DateTime.UtcNow;
}
