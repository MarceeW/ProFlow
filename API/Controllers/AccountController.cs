using API.Constants;
using API.DTO;
using API.Models;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using System.Globalization;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers;

public class AccountController : BaseApiController
{
	private readonly UserManager<User> _userManager;
	private readonly RoleManager<Role> _roleManager;
	private readonly ITokenService _tokenService;
	private readonly IInvitationRepository _invitationRepository;
	private readonly IAccountRepository _accountRepository;
    private readonly IMapper _mapper;

    public AccountController(
		UserManager<User> userManager,
		RoleManager<Role> roleManager,
		ITokenService tokenService,
		IInvitationRepository invitationRepository,
		IAccountRepository accountRepository,
		IMapper mapper)
	{
		_userManager = userManager;
		_roleManager = roleManager;
		_tokenService = tokenService;
		_invitationRepository = invitationRepository;
		_accountRepository = accountRepository;
        _mapper = mapper;
    }

	[HttpPost("register")]
	public async Task<ActionResult<AuthUserDTO>> Register(
		[FromBody]RegisterDTO registerDTO,
		[FromQuery]Guid invitationKey)
	{
		Invitation? invitation = await _invitationRepository.ReadAsync(invitationKey);
		
		if (invitation == null)
			return BadRequest("Invalid invitation key!");
			
		if (invitation.Expires < DateTime.UtcNow)
			return BadRequest("The invitation has expired!");
			
		if (invitation.IsActivated)
			return BadRequest("The invitation has already been activated!");
		
		if (await _userManager.Users.AnyAsync(u => u.UserName == registerDTO.UserName))
			return BadRequest("Username is taken!");

		var textInfo = new CultureInfo("en-US",false).TextInfo;
		var user = new User 
		{ 
			UserName = registerDTO.UserName.ToLower(),
			Invitation = invitation,
			FirstName = textInfo.ToTitleCase(registerDTO.FirstName),
			LastName = textInfo.ToTitleCase(registerDTO.LastName),
			Email = registerDTO.Email,
			DateOfBirth = DateOnly.FromDateTime(registerDTO.DateOfBirth),
		};

		var result = await _userManager.CreateAsync(user, registerDTO.Password);

		if (!result.Succeeded)
			return BadRequest(result.Errors);
			
		var roleResult = await _userManager.AddToRoleAsync(user, RoleConstant.User);
			
		if (!roleResult.Succeeded)
			return BadRequest(roleResult.Errors);
			
		invitation.IsActivated = true;
		
		_invitationRepository.Update(invitation);
		await _invitationRepository.SaveAsync();
		
		return new AuthUserDTO
		{
			UserName = registerDTO.UserName,
			Token = await _tokenService.CreateToken(user),
		};
	}

	[HttpPost("login")]
	public async Task<ActionResult<AuthUserDTO>> Login(LoginDTO loginDTO)
	{
		var user = await _userManager.GetUserByUserName(loginDTO.UserName.ToLower());

		if (user == null)
			return Unauthorized("Invalid username!");

		var result = await _userManager.CheckPasswordAsync(user, loginDTO.Password);

		if (!result)
			return Unauthorized("Invalid password!");
			
		user.LastSeen = DateTime.Now;
		await _userManager.UpdateAsync(user);
		
		return new AuthUserDTO
		{
			UserName = loginDTO.UserName,
			Token = await _tokenService.CreateToken(user),
		};
	}
	
	[HttpGet("invitation/{key}")]
	public async Task<ActionResult<InvitationDTO>> ReadInvitation(Guid key)
	{
		return await _invitationRepository.ReadInvitationDTOAsync(key);
	}
}
