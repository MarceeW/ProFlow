using System.ComponentModel.DataAnnotations;
using API.Enums;

namespace API.DTO;

public class NotificationDTO
{
	[Required]
	public required NotificationType NotificationType { get; set; }
	[Required]
	public required string Content { get; set; }
	[Required]
	public required UserDTO TargetUser { get; set; }
	public DateTime Created { get; set; }
	public bool Viewed { get; set; }
}
