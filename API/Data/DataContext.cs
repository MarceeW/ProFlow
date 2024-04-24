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
	public DataContext(DbContextOptions options) : base(options)
	{
	}
	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);
		
		builder.Entity<Project>()
			.HasMany(p => p.Teams)
			.WithOne(t => t.Project)
			.HasForeignKey(t => t.ProjectId)
			.IsRequired();
		
		builder.Entity<UserRole>()
			.HasKey(ur => new { ur.UserId, ur.RoleId });
			
		builder.Entity<User>()
			.HasMany(u => u.Teams)
			.WithMany(u => u.Members)
			.UsingEntity<UserTeam>(
				l => l.HasOne<Team>().WithMany().HasForeignKey(ut => ut.TeamId).OnDelete(DeleteBehavior.Restrict),
				r => r.HasOne<User>().WithMany().HasForeignKey(ut => ut.UserId).OnDelete(DeleteBehavior.Restrict)
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
			.HasMany(u => u.Projects)
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

		builder.Entity<Role>()
			.HasMany(ur => ur.UserRoles)
			.WithOne(u => u.Role)
			.HasForeignKey(ur => ur.RoleId)
			.IsRequired();
	}
}
