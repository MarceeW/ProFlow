﻿using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
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
			options => options.UseSqlServer(config.GetConnectionString("DefaultConnection"))
		);
		
		services.AddCors();
		
		services.AddScoped<ITokenService, TokenService>();
		
		services.AddAutoMapper(typeof(AutoMapperProfiles));
		
		return services;
	}
}
