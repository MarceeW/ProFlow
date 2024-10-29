using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace API.Models;

[Index(nameof(Start), AllDescending = true)]
public class Sprint
{
	[Key]
	public Guid Id { get; set; }
	public DateTime Start { get; set; } = DateTime.Now;
	public required DateTime End { get; set; }
	[AllowNull]
	[ForeignKey(nameof(ProjectId))]
	public virtual required Project Project { get; set; }
	public Guid ProjectId { get; set; }
	[ForeignKey(nameof(TeamId))]
	public virtual required Team Team { get; set; }
	public Guid TeamId { get; set; }
	public virtual ICollection<Story> SprintBacklog { get; set; } = [];
	public bool IsActive { 
		get 
		{
			return End > DateTime.Now;
		}
	}
	
	public void CloseStories() 
	{
		foreach(var story in SprintBacklog.Where(s => s.Closed != null)) 
			story.Closed = DateTime.Now;
	}
	
	[NotMapped]
	public IEnumerable<User> Members => 
		Project.Teams
			.SelectMany(t => t.Members)
			.Append(Project.ProjectManager);

	public override bool Equals(object? obj)
	{
		if(obj is Sprint s)
			return s.Id == Id;
		return false;
	}

	public override int GetHashCode()
	{
		return Id.GetHashCode();
	}
}
