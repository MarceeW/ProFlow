using API.Data;
using API.Models;
using API.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

app.UseCors(builder => builder
	.AllowAnyHeader()
	.AllowAnyMethod()
	.AllowCredentials()
	.WithOrigins("https://localhost:4200"));

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("hubs/notification");

 using var scope = app.Services.CreateScope();
 var services = scope.ServiceProvider;
 try
 {
 	var context = services.GetRequiredService<DataContext>();
 	var userManager = services.GetRequiredService<UserManager<User>>();
 	var roleManager = services.GetRequiredService<RoleManager<Role>>();
 	
 	await context.Database.MigrateAsync();
 	await Seeder.SeedUsers(userManager, roleManager);
 }
 catch (Exception ex)
 {
 	var logger = services.GetService<ILogger<Program>>();
 	logger?.LogError(ex, ex.Message);
 }

app.Run();
