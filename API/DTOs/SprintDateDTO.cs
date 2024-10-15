using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SprintDateDTO
{
	public Guid Id { get; set; }
	[Required]
	public DateTime Start { get; set; }
	[Required]
	public DateTime End { get; set; }
	public DateTime? EarlyClose { get; set; }
	public bool IsActive { get; set; }
}
