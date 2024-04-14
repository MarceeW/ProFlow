using System.Security.Claims;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class UserManagerExtensions
{
	public static async Task<User?> GetLoggedInUserAsync(this UserManager<User> userManager, ClaimsPrincipal user) 
	{
		string? userName = user.FindFirstValue(ClaimTypes.NameIdentifier);
		
		if(userName == null)
			return null;
		
		return await userManager.GetUserByUserName(userName);
	}
	public static async Task<User?> GetUserByUserName(this UserManager<User> userManager, string userName) 
	{
		return await userManager.Users
			.SingleOrDefaultAsync(u => u.UserName == userName.ToLower());
	}
}
