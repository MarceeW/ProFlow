using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Models;

public class Invitation
{
	[Key]
	public Guid Key { get; set; } = Guid.NewGuid();
	public required DateTime Expires { get; set; }
	public bool IsActivated { get; set; } = false;
}