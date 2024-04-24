using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class Invitation
{
	[Key]
	public Guid Key { get; set; } = Guid.NewGuid();
	public required DateTime Expires { get; set; }
	[ForeignKey(nameof(CreatedById))]
	public virtual required User CreatedBy { get; set; }
	public Guid CreatedById { get; set; }
	public bool IsActivated { get; set; } = false;
}