using API.Data;
using API.DTO;
using API.Interfaces;
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
}
