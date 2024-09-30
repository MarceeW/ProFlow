using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : IdentityDbContext<User, Role, Guid,
	IdentityUserClaim<Guid>, UserRole, IdentityUserLogin<Guid>,
	IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>
{
	public DbSet<Invitation> Invitations { get; set; }
	public DbSet<Project> Projects { get; set; }
	public DbSet<Team> Teams { get; set; }
	public DbSet<UserTeam> UserTeams { get; set; }
	public DbSet<Notification> Notifications { get; set; }
	public DataContext(DbContextOptions options) : base(options)
	{
	}
	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);
		
		#region Project
		
		builder.Entity<Project>()
			.HasMany(p => p.Teams)
			.WithOne(t => t.Project)
			.HasForeignKey(t => t.ProjectId)
			.IsRequired(false);
			
		#endregion Project
		
		#region UserRole
		
		builder.Entity<UserRole>()
			.HasKey(ur => new { ur.UserId, ur.RoleId });
		
		#endregion UserRole
			
		#region User
			
		builder.Entity<User>()
			.HasMany(u => u.Teams)
			.WithMany(t => t.Members)
			.UsingEntity<UserTeam>(
				l => l.HasOne<Team>().WithMany().HasForeignKey(ut => ut.TeamId).OnDelete(DeleteBehavior.Restrict),
				r => r.HasOne<User>().WithMany().HasForeignKey(ut => ut.UserId).OnDelete(DeleteBehavior.Restrict)
			);
			
		builder.Entity<User>()
			.HasMany(u => u.TeamLeaderInProjects)
			.WithMany(p => p.TeamLeaders)
			.UsingEntity<TeamLeaderProject>(
				l => l.HasOne<Project>().WithMany().HasForeignKey(tlp => tlp.ProjectId).OnDelete(DeleteBehavior.Restrict),
				r => r.HasOne<User>().WithMany().HasForeignKey(tlp => tlp.UserId).OnDelete(DeleteBehavior.Restrict)
			);
			
		builder.Entity<User>()
			.HasMany(u => u.LedTeams)
			.WithOne(t => t.TeamLeader)
			.HasForeignKey(u => u.TeamLeaderId)
			.IsRequired();
			
		builder.Entity<User>()
			.HasMany(u => u.CreatedInvitations)
			.WithOne(i => i.CreatedBy)
			.HasForeignKey(u => u.CreatedById)
			.IsRequired();
			
		builder.Entity<User>()
			.HasMany(u => u.OwnedProjects)
			.WithOne(p => p.ProjectManager)
			.HasForeignKey(p => p.ProjectManagerId)
			.IsRequired(false);

		builder.Entity<User>()
			.Property(u => u.InvitationKey)
			.HasColumnName("InvitationKey")
			.IsRequired(false);
			
		builder.Entity<User>()
			.HasMany(ur => ur.UserRoles)
			.WithOne(u => u.User)
			.HasForeignKey(ur => ur.UserId)
			.IsRequired();
			
		#endregion User
		
		#region Notification
		
		builder.Entity<Notification>()
			.HasOne(n => n.TargetUser)
			.WithMany(u => u.Notifications)
			.HasForeignKey(n => n.TargetUserId)
			.IsRequired();
		
		#endregion Notification
			
		#region Role

		builder.Entity<Role>()
			.HasMany(ur => ur.UserRoles)
			.WithOne(u => u.Role)
			.HasForeignKey(ur => ur.RoleId)
			.IsRequired();
			
		#endregion
	}
}
