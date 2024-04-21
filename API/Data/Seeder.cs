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
			new Role { Name = RoleConstant.Administrator },
			new Role { Name = RoleConstant.ProjectManager },
			new Role { Name = RoleConstant.TeamLeader },
			new Role { Name = RoleConstant.FunctionalManager },
			new Role { Name = RoleConstant.TeamMember },
			new Role { Name = RoleConstant.User },
		};
		
		foreach (var role in roles) 
		{
			await roleManager.CreateAsync(role);
		}
				
		var admin = new User
		{
			UserName = "admin",
			FirstName = "admin",
			LastName = "admin",
			Email = "admin@admin.com",
			DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow),
		};
		
		await userManager.CreateAsync(admin, "admin");
		await userManager.AddToRolesAsync(admin, [RoleConstant.Administrator, RoleConstant.User]);
	} 
}
