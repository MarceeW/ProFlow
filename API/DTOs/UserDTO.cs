namespace API.DTO;

public class UserDTO
{
	public required Guid Id { get; set; }
	public required string UserName { get; set; }
	public string? FullName { get; set; }
}
