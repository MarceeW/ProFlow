using API.Data;
using API.DTO;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
	private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly IMapper _mapper;
	private readonly DataContext _dataContext;
	private readonly ITokenService _tokenService;

	public AccountController(
		UserManager<User> userManager,
		RoleManager<Role> roleManager, 
		IMapper mapper, 
		DataContext dataContext,
		ITokenService tokenService)
	{
		_userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
		_dataContext = dataContext;
		_tokenService = tokenService;
	}

	[HttpPost("register")]
	public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
	{
		if (await _userManager.Users.AnyAsync(u => u.UserName == registerDTO.UserName))
			return BadRequest("Username is taken!");

		var user = new User { UserName = registerDTO.UserName.ToLower() };

		var result = await _userManager.CreateAsync(user, registerDTO.Password);

		if (!result.Succeeded)
			return BadRequest(result.Errors);

		return new UserDTO
		{
			UserName = registerDTO.UserName,
			Token = _tokenService.CreateToken(user)
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

		if (!result)
			return Unauthorized("Invalid password!");

		return new UserDTO
		{
			UserName = loginDTO.UserName,
			Token = _tokenService.CreateToken(user)
		};
	}
}
