using API.Constants;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public static class Seeder
{
	public static async Task SeedSkillsAsync(DataContext dataContext) 
	{
		if(dataContext.Skills.Any())
			return;
			
		var skills = new Skill[] 
		{
			new() { Name = "C++" },
			new() { Name = "Java" },
			new() { Name = "C#" },
			new() { Name = "Kotlin" },
			new() { Name = "Angular" },
			new() { Name = "Backend" },
			new() { Name = "Frontent" },
			new() { Name = "CUDA" },
			new() { Name = "OpenGL" },
			new() { Name = "Vue.js" },
			new() { Name = "React" },
			new() { Name = "Cloud engineering" },
			new() { Name = "Devops" },
			new() { Name = "Testing" },
			new() { Name = "NoSQL" },
			new() { Name = "Relational databases" },
			new() { Name = "MySQL" },
			new() { Name = "SQL Server" },
			new() { Name = "TypeScript" },
			new() { Name = "JavaScript" },
			new() { Name = "Python" },
			new() { Name = "C" },
			new() { Name = "PHP" },
			new() { Name = "Node.js" },
			new() { Name = ".NET" },
			new() { Name = "R" },
			new() { Name = "Swift" },
		};
		await dataContext.Skills.AddRangeAsync(skills);
		await dataContext.SaveChangesAsync();
	}
	public static async Task SeedUsersAsync(UserManager<User> userManager, RoleManager<Role> roleManager) 
	{
		if(await userManager.Users.AnyAsync())
			return;
			
		var roles = new List<Role>
		{
			new() { Name = RoleConstant.Administrator },
			new() { Name = RoleConstant.ProjectManager },
			new() { Name = RoleConstant.TeamLeader },
			new() { Name = RoleConstant.FunctionalManager },
			new() { Name = RoleConstant.TeamMember },
			new() { Name = RoleConstant.User, Default = true },
		};
		
		foreach (var role in roles) 
		{
			await roleManager.CreateAsync(role);
		}
				
		var admin = new User
		{
			UserName = "admin",
			FirstName = "ProFlow",
			LastName = "Admin",
			Email = "admin@proflow.com",
			DateOfBirth = DateOnly.FromDateTime(DateTime.Now),
			SecurityStamp = Guid.NewGuid().ToString()
		};
		
		await userManager.CreateAsync(admin, "admin");
		
		foreach(var user in await userManager.Users.ToListAsync()) 
		{
			await userManager.AddToRolesAsync(user, [
				RoleConstant.Administrator,
				RoleConstant.User, 
				RoleConstant.TeamLeader, 
				RoleConstant.ProjectManager
			]);
		}
	}
}
