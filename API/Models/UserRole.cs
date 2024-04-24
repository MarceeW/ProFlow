using Microsoft.AspNetCore.Identity;

namespace API.Models;

public class UserRole : IdentityUserRole<Guid>
{
	public virtual required User User { get; set; }
	public virtual required Role Role { get; set; }
}
