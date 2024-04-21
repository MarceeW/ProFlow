using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Models;
using API.Repositories;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
	public static IServiceCollection AddApplicationServices(
		this IServiceCollection services, IConfiguration config)
	{
		services.AddControllers();
		services.AddEndpointsApiExplorer();

		services.AddDbContext<DataContext>(
			options => 
				options
					.UseLazyLoadingProxies()
					.UseSqlServer(config.GetConnectionString("DefaultConnection"))
		);

		services.AddCors();

		services.AddScoped<ITokenService, TokenService>();
		services.AddScoped<IInvitationRepository, InvitationRepository>();
		services.AddScoped<IUserRepository, UserRepository>();

		services.AddAutoMapper(typeof(AutoMapperProfiles));

		return services;
	}
}
