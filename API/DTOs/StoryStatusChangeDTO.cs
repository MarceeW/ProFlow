using System;
using API.DTO;
using API.Enums;

namespace API.DTOs;

public class StoryStatusChangeDTO
{
    public Guid Id { get; set; }
    public required UserDTO User { get; set; }
	public DateTime Timestamp { get; set; } = DateTime.Now;
	public required virtual StoryDTO Story { get; set; }
	public required StoryStatus PreviousStoryStatus { get; set; }
	public required StoryStatus StoryStatus { get; set; }
}
