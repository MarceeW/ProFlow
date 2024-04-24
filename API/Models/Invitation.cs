using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Invitation
{
	[Key]
	public Guid Key { get; set; } = Guid.NewGuid();
	public required DateTime Expires { get; set; }
	public bool IsActivated { get; set; } = false;
}