using System.ComponentModel.DataAnnotations;
using API.Attribute;

namespace API.DTO;

public class RegisterDTO
{
	[Required]
	public required string UserName { get; set; }
	[Required]
	public required string Password { get; set; }
	[Required]
	public required string FirstName { get; set; }
	[Required]
	public required string LastName { get; set; }
	[Required]
	[EmailAddress]
	public required string Email { get; set; }
	[Required]
	[ValidPastDate(ErrorMessage = "Date of birth can't be future date!")]
	public required DateTime DateOfBirth { get; set; }
}
