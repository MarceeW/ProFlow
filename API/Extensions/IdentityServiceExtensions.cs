using System.Text;
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
						ValidIssuer = config["JwtSettings:Issuer"]!,
						ValidAudience = config["JwtSettings:Audience"]!,
						IssuerSigningKey = new SymmetricSecurityKey(
							Encoding.UTF8.GetBytes(config["JwtSettings:Key"]!)),
						ValidateIssuer = true,
						ValidateAudience = true,
						ValidateLifetime = true,
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

		return services;
	}
}
