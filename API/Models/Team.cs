using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Models;

public class Team
{
	[Key]
	public Guid Id { get; set; }
	public required string Name { get; set; }
	public virtual ICollection<Project> Projects { get; set; } = [];
	public virtual ICollection<Sprint> Sprints { get; set; } = [];
	[ForeignKey(nameof(TeamLeaderId))]
	public required virtual User TeamLeader { get; set; }
	public Guid TeamLeaderId { get; set; }
	public virtual ICollection<User> Members { get; set; } = [];
	
	public bool IsUserPartOf(User user) 
	{
		return Members.Any(m => m == user);
	}
}
