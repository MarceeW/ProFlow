using API.Data;
using API.Interfaces;
using API.Interfaces.Repository;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API;

public class NotificationRepository : AbstractRepository<Notification, Guid>, INotificationRepository
{
	private readonly IMapper _mapper;
	private readonly UserManager<User> _userManager;

	public NotificationRepository(
		DataContext dataContext, 
		IMapper mapper, 
		UserManager<User> userManager) : base(dataContext, dataContext.Notifications)
	{
		_mapper = mapper;
		_userManager = userManager;
	}

	public async Task<IQueryable<Notification>> GetUserNotifications(string userName)
	{
		User? user = await _userManager.FindByNameAsync(userName);
		
		if(user == null)
			throw new KeyNotFoundException($"User with this username: [{userName}] is not found");
			
		return _values
			.Where(n => n.TargetUser == user)
			.OrderBy(n => n.Viewed)
			.ThenByDescending(n => n.Created);
	}
	
	public async Task BulkUpdateUserNotifications(string userName)
	{
		User? user = await _userManager.FindByNameAsync(userName);
		
		if(user == null)
			throw new KeyNotFoundException($"User with this username: [{userName}] is not found");
			
		await _values
			.Where(n => !n.Viewed && n.TargetUser == user)
			.ExecuteUpdateAsync(s => s.SetProperty(n => n.Viewed, e => true));
	}
}
