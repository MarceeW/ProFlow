using API.Controllers;
using API.DTO;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API;

[Authorize]
public class UserController : BaseApiController
{
	private readonly IUserRepository _userRepository;
	private readonly UserManager<User> _userManager;

	public UserController(
		IUserRepository userRepository,
		UserManager<User> userManager)
	{
		_userRepository = userRepository;
		_userManager = userManager;
	}
	
	[HttpGet]
	public async Task<IEnumerable<UserDTO>> GetUsers([FromQuery] string? roles) 
	{
		return await _userRepository.GetUsersAsync(roles);
	}
	
	[HttpGet("by-username")]
	public async Task<UserDTO> GetUserByUserName(string userName) 
	{
		return await _userRepository.GetUserByUserNameAsync(userName);
	}
	
	[HttpGet("picture/{userId}")]
	[AllowAnonymous]
	public async Task<ActionResult> GetUserPicture(string userId) 
	{
		var user = await _userManager.FindByIdAsync(userId);
		
		if(user == null)
			return BadRequest($"Username: {userId} is not a valid id!");
		
		string path = user.ProfilePicturePath == null ? @"Resources\Images\user-icon.png" : user.ProfilePicturePath;
		var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read);
		
		string extension = Path.GetExtension(path).Substring(1);
		string mimeType = $"image/{extension}";
		return File(fileStream, mimeType);
	}
}
