using System.ComponentModel.DataAnnotations;

namespace API.DTO;

public class AuthUserDTO
{
	[Required]
	public required string UserName { get; set; }
	[Required]
	public required string Token { get; set; }
}
