using API.DTO;
using API.Interfaces;
using API.Interfaces.Repository;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class NotificationController : BaseApiController
{
	private readonly INotificationRepository _notificationRepository;
	private readonly IMapper _mapper;
	private readonly UserManager<User> _userManager;

	public NotificationController(INotificationRepository notificationRepository, IMapper mapper, UserManager<User> userManager)
	{
		_notificationRepository = notificationRepository;
		_mapper = mapper;
		_userManager = userManager;
	}
	
	[HttpGet("{userName}")]
	public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetUserNotifications(string userName) 
	{
		var notifications = await _notificationRepository.GetUserNotifications(userName);
		return Ok(notifications.ProjectTo<NotificationDTO>(_mapper.ConfigurationProvider));
	}
	
	[HttpGet("view/{userName}")]
	public async Task<ActionResult> ViewNotifications(string userName) 
	{
		await _notificationRepository.BulkUpdateUserNotifications(userName);		
		return Ok();
	}
	
	[HttpGet("get-count/{userName}")]
	public async Task<ActionResult<int>> GetUnseenNotificationCOunt(string userName) 
	{
		var notifications = await _notificationRepository.GetUserNotifications(userName);	
		int notificationCount = notifications.Count(n => !n.Viewed);	
		return Ok(notificationCount);
	}
}
