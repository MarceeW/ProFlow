using System;

namespace API.DTOs;

public class ShortTeamDTO
{
	public required Guid Id { get; set; }
	public required string Name { get; set; }
	public required Guid TeamLeaderId { get; set; }
	public required IEnumerable<Guid> MemberIds { get; set; }
}
