using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace API.Models;
public class User : IdentityUser
{
	public virtual ICollection<UserRole>? UserRoles { get; set; }
	[ForeignKey("Invitation")]
	public Guid? InvitationId { get; set; }
	[JsonIgnore]
	public virtual Invitation? Invitation { get; set; }
}
