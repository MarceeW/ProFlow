using API.Constants;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public static class Seeder
{
	public static async Task SeedUsers(UserManager<User> userManager, RoleManager<Role> roleManager) 
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
			DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow),
		};
		
		var developer = new User
		{
			UserName = "developer",
			FirstName = "ProFlow",
			LastName = "Developer",
			Email = "developer@proflow.com",
			DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow),
		};
		
		await userManager.CreateAsync(admin, "admin");
		await userManager.CreateAsync(developer, "dev");
		
		await userManager.AddToRolesAsync(admin, [
			RoleConstant.Administrator,
			RoleConstant.User, 
			RoleConstant.TeamLeader, 
			RoleConstant.ProjectManager
		]);
		
		await userManager.AddToRolesAsync(developer, [
			RoleConstant.Administrator,
			RoleConstant.User, 
			RoleConstant.TeamLeader, 
			RoleConstant.ProjectManager
		]);
	} 
}
