using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API;

public class UserRole : IdentityUserRole<string>
{
    public virtual required User User { get; set; }
    public virtual required Role Role { get; set; }
}
