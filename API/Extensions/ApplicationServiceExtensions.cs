using API.Data;
using API.Helpers;
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
		services.AddSwaggerGen();

		services.AddDbContext<DataContext>(
			options => options.UseSqlServer(config.GetConnectionString("DefaultConnection"))
		);

		services.AddIdentityServices(config);

		services.AddAuthorization();
		services
			.AddIdentityApiEndpoints<IdentityUser>()
			.AddEntityFrameworkStores<DataContext>();
			
		services.AddAutoMapper(typeof(AutoMapperProfiles));
			
		return services;
	}
}
