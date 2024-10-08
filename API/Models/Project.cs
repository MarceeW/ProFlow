using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class Project
{
	[Key]
	public Guid Id { get; set;}
	public DateTime Created { get; set; } = DateTime.UtcNow;
	public required string Name { get; set;}
	[ForeignKey(nameof(ProjectManagerId))]
	public virtual required User ProjectManager { get; set; }
	public virtual Guid ProjectManagerId { get; set; }
	public virtual required ICollection<User> TeamLeaders { get; set; } = [];
	public virtual ICollection<Team> Teams { get; set; } = [];
	public virtual ICollection<Story> ProductBacklog { get; set; } = [];
	public virtual ICollection<Sprint> Sprints { get; set; } = [];
}
