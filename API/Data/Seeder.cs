using API.Constants;
using API.Entities;
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
			RoleConstant.ADMINISTRATOR,
			RoleConstant.USER,
		};
		
		foreach (var role in roles) 
		{
			await roleManager.CreateAsync(role);
		}
				
		var admin = new User
		{
			UserName = "admin"
		};
		
		await userManager.CreateAsync(admin, "admin");
		await userManager.AddToRolesAsync(admin, [RoleConstant.ADMINISTRATOR.Name, RoleConstant.USER.Name]);
	} 
}
