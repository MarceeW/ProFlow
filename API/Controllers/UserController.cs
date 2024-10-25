using API.Controllers;
using API.DTO;
using API.DTOs;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API;

[Authorize]
public class UserController : BaseApiController
{
	private readonly IUserRepository _userRepository;
	private readonly UserManager<User> _userManager;
	private readonly IMapper _mapper;
	private readonly IUserService _userService;

	public UserController(
		IUserRepository userRepository,
		UserManager<User> userManager,
		IMapper mapper,
		IUserService userService)
	{
		_userRepository = userRepository;
		_userManager = userManager;
		_mapper = mapper;
		_userService = userService;
	}

	[HttpGet]
	public async Task<IEnumerable<UserDTO>> GetUsers([FromQuery] string? roles) 
	{
		return await _userRepository.GetUsersAsync(roles);
	}
	
	[HttpGet("{id}")]
	public async Task<ActionResult<UserDTO>> GetUser(Guid id) 
	{
		var user = await _userManager.FindByIdAsync(id.ToString());
		
		if(user == null)
			return BadRequest("User doesn't exists");
			
		return _mapper.Map<UserDTO>(user);
	}
	
	[HttpGet("skills/{id}")]
	public async Task<ActionResult<IEnumerable<UserSkillDTO>>> GetUserSkills(Guid id) 
	{
		var user = await _userManager.FindByIdAsync(id.ToString());
		
		if(user == null)
			return BadRequest("User doesn't exists");
			
		return user.UserSkills
			.AsQueryable()
			.ProjectTo<UserSkillDTO>(_mapper.ConfigurationProvider)
			.ToList();
	}
	
	[HttpPatch("set-skill")]
	public async Task<ActionResult> SetUserSkill(UserSkillDTO userSkillDTO) 
	{
		var loggedInUser = await _userManager.GetLoggedInUserAsync(User);
		await _userService.SetUserSkillAsync(loggedInUser!, userSkillDTO);
		return Ok();
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
	
	[HttpGet("stats/{id}")]
	public async Task<ActionResult<UserStatDTO>> GetUserStats(Guid id) 
	{
		try
		{
			return await _userRepository.GetUserStatsAsync(id);
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
}
