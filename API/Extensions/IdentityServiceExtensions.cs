using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
	public static IServiceCollection AddIdentityServices(this IServiceCollection services, 
		IConfiguration configuration) 
	{
		services.AddIdentityCore<User>(opt => 
		{
			opt.Password.RequiredLength = 1;
			opt.Password.RequireDigit = false;
			opt.Password.RequireNonAlphanumeric = false;
			opt.Password.RequireUppercase = false;
		})
			.AddRoles<Role>()
			.AddRoleManager<RoleManager<Role>>()
			.AddEntityFrameworkStores<DataContext>();
			
		return services;
	}
}
