using System.ComponentModel.DataAnnotations;

namespace API.DTO;

public class NotificationDTO
{
	[Required]
	public required string Type { get; set; }
	[Required]
	public required string Title { get; set; }
	[Required]
	public required string Content { get; set; }
	[Required]
	public required UserDTO TargetUser { get; set; }
	public DateTime Created { get; set; }
	public bool Viewed { get; set; }
}
