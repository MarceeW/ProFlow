using API.Data;
using API.DTO;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
	private readonly UserManager<User> _userManager;
	private readonly IMapper _mapper;
	private readonly DataContext _dataContext;

	public AccountController(UserManager<User> userManager, IMapper mapper, DataContext dataContext) 
	{
		_userManager = userManager;
		_mapper = mapper;
		_dataContext = dataContext;
	}
	
	[HttpPost("register")]
	public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
	{
		if(await _userManager.Users.AnyAsync(u => u.UserName == registerDTO.UserName))
			return BadRequest("Username is taken!");
		
		var user = new User{ UserName = registerDTO.UserName.ToLower() };
		
		var result = await _userManager.CreateAsync(user, registerDTO.Password);
		
		if(!result.Succeeded)
			return BadRequest(result.Errors);
		
		return new UserDTO
		{
			Username = registerDTO.UserName,
			Token = ""
		};
	}
	
	[HttpPost("login")]
	public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
	{
		var user = await _userManager.Users
			.SingleOrDefaultAsync(u => u.UserName == loginDTO.UserName.ToLower());
		
		if (user == null)
			return Unauthorized("Invalid username!");
		
		var result = await _userManager.CheckPasswordAsync(user, loginDTO.Password);
		
		if(!result)
			return Unauthorized("Invalid password!");
		
		return new UserDTO
		{
			Username = loginDTO.UserName,
			Token = ""
		};
	}
}
