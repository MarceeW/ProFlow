using Microsoft.AspNetCore.Identity;

namespace API.Models;

public class Role : IdentityRole<Guid>
{
	public virtual ICollection<UserRole>? UserRoles { get; set; }
	public bool Default { get; set; } = false;
}
