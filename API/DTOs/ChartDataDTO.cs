using System;

namespace API.DTOs;

public class ChartDataDTO
{
	public required object Name { get; set; }
	public object? Value { get; set; }
	public IEnumerable<ChartDataDTO>? Series { get; set; }
}
