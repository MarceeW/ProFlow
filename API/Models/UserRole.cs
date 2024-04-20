using System.Text.Json.Serialization;
using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API;

public class UserRole : IdentityUserRole<Guid>
{
	public virtual required User User { get; set; }
	public virtual required Role Role { get; set; }
}
