using Microsoft.AspNetCore.Identity;

namespace API.Models;

public class Role : IdentityRole
{
    public virtual ICollection<UserRole>? UserRoles { get; set; }
}
