using API.Data;
using API.Helpers;
using API.Interfaces.Service;
using API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using API.Services;
using API.Repositories;

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
		services.AddScoped<IAccountRepository, AccountRepository>();
		services.AddScoped<IProjectRepositoy, ProjectRepository>();
		services.AddScoped<IUserRepository, UserRepository>();

		services.AddAutoMapper(typeof(AutoMapperProfiles));

		return services;
	}
}
