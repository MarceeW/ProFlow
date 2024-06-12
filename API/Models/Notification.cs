using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Enums;

namespace API.Models;

public class Notification
{
	[Key]
	public Guid Id { get; set; } = Guid.NewGuid();
	[ForeignKey(nameof(TargetUserId))]
	
	public required NotificationType NotificationType { get; set; }
	public required string Content { get; set; }
	public required virtual User TargetUser { get; set; }
	public Guid TargetUserId { get; set; }
	public DateTime Created { get; set; } = DateTime.UtcNow;
	public bool Viewed { get; set; }
}
