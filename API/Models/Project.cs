using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class Project
{
	[Key]
	public Guid Id { get; set;}
	public DateTime Created { get; set; } = DateTime.Now;
	public required string Name { get; set;}
	[ForeignKey(nameof(ProjectManagerId))]
	public virtual required User ProjectManager { get; set; }
	public Guid ProjectManagerId { get; set; }
	public virtual required ICollection<User> TeamLeaders { get; set; } = [];
	public virtual ICollection<Team> Teams { get; set; } = [];
	public virtual ICollection<Story> ProductBacklog { get; set; } = [];
	public virtual ICollection<Sprint> Sprints { get; set; } = [];
	public override bool Equals(object? obj)
	{
		if(obj is Project p)
			return p.Id == Id;
		return false;
	}

	public override int GetHashCode()
	{
		return Id.GetHashCode();
	}
	
	public bool IsUserPartOf(User user) 
	{
		return Teams
			.SelectMany(t => t.Members)
			.Any(m => m == user);
	}
}
