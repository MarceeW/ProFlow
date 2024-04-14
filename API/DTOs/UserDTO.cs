using System.ComponentModel.DataAnnotations;
using API.Data;

namespace API.DTO;

public class UserDTO
{
	[Required]
	public required string UserName { get; set; }
	[Required]
	public required string Token { get; set; }
}
