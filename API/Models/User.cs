using System.ComponentModel.DataAnnotations.Schema;
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
	public virtual ICollection<Project> OwnedProjects { get; set; } = [];
	public virtual ICollection<Project> TeamLeaderInProjects { get; set; } = [];
	public virtual ICollection<Notification> Notifications { get; set; } = [];
	public virtual ICollection<StoryCommit> StoryCommits { get; set; } = [];
	public virtual ICollection<Story> AssignedStories { get; set; } = [];
	public required string FirstName { get; set; }
	public required string LastName { get; set; }
	public required DateOnly DateOfBirth { get; set; }
	public DateTime Created { get; set; } = DateTime.Now;
	public DateTime LastSeen { get; set; } = DateTime.Now;
	public string? ProfilePicturePath { get; set; }
	public virtual ICollection<UserSkill> UserSkills { get; set; } = [];
	[NotMapped]
	public string FullName { get => $"{FirstName} {LastName}"; }

	public override bool Equals(object? obj)
	{
		if(obj is User u)
			return u.Id == Id;
		return false;
	}

	public override int GetHashCode()
	{
		return (Id, UserName).GetHashCode();
	}
}
