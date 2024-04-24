using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace API.Models;
public class User : IdentityUser<Guid>
{
	public virtual ICollection<UserRole>? UserRoles { get; set; }
	[ForeignKey(nameof(InvitationKey))]
	public virtual Invitation? Invitation { get; set; }
	public Guid? InvitationKey { get; set; }
	public virtual ICollection<Invitation> CreatedInvitations { get; set; } = [];
	public virtual ICollection<Team> Teams { get; set; } = [];
	public virtual ICollection<Team> LedTeams { get; set; } = [];
	public virtual ICollection<Project> Projects { get; set; } = [];
	public required string FirstName { get; set; }
	public required string LastName { get; set; }
	public required DateOnly DateOfBirth { get; set; }
	public DateTime Created { get; set; } = DateTime.UtcNow;
	public DateTime LastSeen { get; set; } = DateTime.UtcNow;
	[NotMapped]
	public string FullName { get => $"{FirstName} {LastName}"; }
}
