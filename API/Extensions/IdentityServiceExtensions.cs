using System.Text;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
	public static IServiceCollection AddIdentityServices(this IServiceCollection services, 
		IConfiguration config) 
	{			
		services
			.AddIdentityApiEndpoints<User>()
			.AddEntityFrameworkStores<DataContext>();
		
		services.AddIdentityCore<User>(opt => 
		{
			opt.Password.RequiredLength = 8;
			opt.Password.RequireDigit = false;
			opt.Password.RequireNonAlphanumeric = false;
			opt.Password.RequireUppercase = false;
		})
			.AddRoles<Role>()
			.AddRoleManager<RoleManager<Role>>()
			.AddEntityFrameworkStores<DataContext>();
			
		services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options => 
				{
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidIssuer = config["JwtSettings:Issuer"],
						ValidAudience = config["JwtSettings:Audience"],
						IssuerSigningKey = new SymmetricSecurityKey(
							Encoding.UTF8.GetBytes(config["JwtSettings:Key"])),
						ValidateIssuer = true,
						ValidateAudience = true,
						ValidateLifetime = true,
						ValidateIssuerSigningKey = true
					};
				});
		services.AddAuthorization();
			
		return services;
	}
}
