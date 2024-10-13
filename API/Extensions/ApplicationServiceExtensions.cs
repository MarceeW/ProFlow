using API.Data;
using API.Interfaces.Service;
using API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using API.Services;
using API.Repositories;
using API.Helpers;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
	public static IServiceCollection AddApplicationServices(
		this IServiceCollection services, IConfiguration config)
	{
		services.AddControllers();
		services.AddEndpointsApiExplorer();
		
		services.AddSignalR();

		services.AddDbContext<DataContext>(
			options => 
				options
					.UseLazyLoadingProxies()
					.UseSqlServer(config.GetConnectionString("DefaultConnection"))
		);

		services.AddCors();

		services.AddAutoMapper(typeof(AutoMapperProfiles));
		
		#region Services
		
		services.AddScoped<ITokenService, TokenService>();
		services.AddScoped<IProjectService, ProjectService>();
		services.AddScoped<ITeamService, TeamService>();
		services.AddScoped<INotificationService, NotificationService>();
		services.AddScoped<IStoryService, StoryService>();
		services.AddScoped<ISprintService, SprintService>();
		services.AddScoped<ILoggingService, LoggingService>();
		
		#endregion Services
		
		#region Repositories
		
		services.AddScoped<IInvitationRepository, InvitationRepository>();
		services.AddScoped<IAccountRepository, AccountRepository>();
		services.AddScoped<IProjectRepositoy, ProjectRepository>();
		services.AddScoped<ITeamRepository, TeamRepository>();
		services.AddScoped<IUserRepository, UserRepository>();
		services.AddScoped<INotificationRepository, NotificationRepository>();
		services.AddScoped<IStoryRepository, StoryRepository>();
		services.AddScoped<IStoryCommitRepository, StoryCommitRepository>();
		services.AddScoped<ISprintRepository, SprintRepository>();
		services.AddScoped<ILogRepository, LogRepository>();
		
		#endregion Repositories
		
		return services;
	}
}
