using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Models;

public class Team
{
	[Key]
	public Guid Id { get; set; } = Guid.NewGuid();
	[ForeignKey(nameof(ProjectId))]
	public required virtual Project Project { get; set; }
	public Guid ProjectId { get; set; }
	[ForeignKey(nameof(TeamLeaderId))]
	public required virtual User TeamLeader { get; set; }
	public Guid TeamLeaderId { get; set; }
	public virtual ICollection<User> Members { get; set; } = [];
}
