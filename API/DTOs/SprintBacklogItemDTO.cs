using System;

namespace API.DTOs;

public class SprintBacklogUpdateItemDTO
{
	public Guid Id { get; set; }
	public bool Remove { get; set; }
}
