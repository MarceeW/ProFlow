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
	public DbSet<Notification> Notifications { get; set; }
	public DbSet<Sprint> Sprints { get; set; }
	public DbSet<Story> Stories { get; set; }
	public DbSet<StoryCommit> StoryCommits { get; set; }
	public DataContext(DbContextOptions options) : base(options)
	{
	}
	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);
		
		#region Project
		
		builder.Entity<Project>()
			.HasMany(p => p.Teams)
			.WithMany(t => t.Projects)
			.UsingEntity<TeamProject>(
				l => l.HasOne<Team>().WithMany().HasForeignKey(tp => tp.TeamId).OnDelete(DeleteBehavior.Cascade),
				r => r.HasOne<Project>().WithMany().HasForeignKey(tp => tp.ProjectId).OnDelete(DeleteBehavior.Cascade)
			);
			
		builder.Entity<Project>()
			.HasMany(p => p.Sprints)
			.WithOne(s => s.Project)
			.HasForeignKey(s => s.ProjectId)
			.IsRequired();
			
		builder.Entity<Project>()
			.HasMany(p => p.ProductBacklog)
			.WithOne(pb => pb.Project)
			.HasForeignKey(pb => pb.ProjectId)
			.IsRequired();
			
		#endregion Project
		
		#region Sprint
		
		builder.Entity<Sprint>()
			.HasMany(s => s.SprintBacklog)
			.WithOne(sb => sb.Sprint)
			.HasForeignKey(sb => sb.SprintId)
			.IsRequired(false);
		
		#endregion Sprint
		
		#region UserRole
		
		builder.Entity<UserRole>()
			.HasKey(ur => new { ur.UserId, ur.RoleId });
		
		#endregion UserRole
			
		#region User
			
		builder.Entity<User>()
			.HasMany(u => u.Teams)
			.WithMany(t => t.Members)
			.UsingEntity<UserTeam>(
				l => l.HasOne<Team>().WithMany().HasForeignKey(ut => ut.TeamId).OnDelete(DeleteBehavior.Cascade),
				r => r.HasOne<User>().WithMany().HasForeignKey(ut => ut.MemberId).OnDelete(DeleteBehavior.Cascade)
			);
			
		builder.Entity<User>()
			.HasMany(u => u.TeamLeaderInProjects)
			.WithMany(p => p.TeamLeaders)
			.UsingEntity<TeamLeaderProject>(
				l => l.HasOne<Project>().WithMany().HasForeignKey(tlp => tlp.ProjectId).OnDelete(DeleteBehavior.Cascade),
				r => r.HasOne<User>().WithMany().HasForeignKey(tlp => tlp.UserId).OnDelete(DeleteBehavior.Cascade)
			);
			
		builder.Entity<User>()
			.HasMany(u => u.StoryCommits)
			.WithOne(tc => tc.Commiter)
			.HasForeignKey(tc => tc.CommiterId)
			.IsRequired();
			
		builder.Entity<User>()
			.HasMany(u => u.AssignedStories)
			.WithOne(t => t.AssignedTo)
			.HasForeignKey(t => t.AssignedToId)
			.IsRequired(false);
			
		builder.Entity<User>()
			.HasMany(u => u.LedTeams)
			.WithOne(t => t.TeamLeader)
			.HasForeignKey(u => u.TeamLeaderId)
			.IsRequired()
			.OnDelete(DeleteBehavior.Restrict);
			
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
