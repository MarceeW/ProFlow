namespace API.Models;

public class Company
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public required string Name { get; set; }
	public DateTime Created { get; set; } = DateTime.UtcNow;
}
