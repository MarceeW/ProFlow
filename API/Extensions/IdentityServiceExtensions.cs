using System.Text;
using API.Constants;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
	public static IServiceCollection AddIdentityServices(
		this IServiceCollection services,
		IConfiguration config)
	{	
		services.AddIdentityCore<User>(opt =>
		{
			opt.Password.RequiredLength = 5;
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
						IssuerSigningKey = new SymmetricSecurityKey(
							Encoding.UTF8.GetBytes(config["JwtSettings:Key"]!)),
						ValidateIssuer = false,
						ValidateAudience = false,
						ValidateIssuerSigningKey = true
					};
					
					options.Events = new JwtBearerEvents
					{
						OnMessageReceived = context => 
						{
							var accessToken = context.Request.Query["access_token"];
							
							var path = context.HttpContext.Request.Path;
							if(!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
							{
								context.Token = accessToken;
							}
							
							return Task.CompletedTask;
						}	
					};
				});
				
		services.AddAuthorization();
		services.AddAuthorizationBuilder()
			.AddPolicy("ProjectManagement", policy => policy
				.RequireRole(RoleConstant.Administrator, RoleConstant.ProjectManager))
			.AddPolicy("ScrumManagement", policy => policy
				.RequireRole(RoleConstant.Administrator, RoleConstant.TeamLeader, RoleConstant.ProjectManager))
			.AddPolicy("TeamManagement", policy => policy
				.RequireRole(RoleConstant.Administrator, RoleConstant.TeamLeader, RoleConstant.ProjectManager));
				
		return services;
	}
}
