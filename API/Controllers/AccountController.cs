using API.Constants;
using API.DTO;
using API.Models;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using API.Extensions;
using Api.DTO;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

public class AccountController : BaseApiController
{
	private readonly UserManager<User> _userManager;
	private readonly RoleManager<Role> _roleManager;
	private readonly ITokenService _tokenService;
	private readonly IInvitationRepository _invitationRepository;
	private readonly IMapper _mapper;
	private readonly INotificationService _notificationService;

	public AccountController(
		UserManager<User> userManager,
		RoleManager<Role> roleManager,
		ITokenService tokenService,
		IInvitationRepository invitationRepository,
		IMapper mapper,
		INotificationService notificationService)
	{
		_userManager = userManager;
		_roleManager = roleManager;
		_tokenService = tokenService;
		_invitationRepository = invitationRepository;
		_mapper = mapper;
		_notificationService = notificationService;
	}

	[HttpPost("register")]
	public async Task<ActionResult<AuthUserDTO>> Register(
		[FromBody]RegisterDTO registerDTO,
		[FromQuery]Guid invitationKey)
	{
		Invitation? invitation = await _invitationRepository.ReadAsync(invitationKey);
		
		if (invitation == null)
			return BadRequest("Invalid invitation key!");
			
		if (invitation.Expires < DateTime.Now)
			return BadRequest("The invitation has expired!");
			
		if (invitation.IsActivated)
			return BadRequest("The invitation has already been activated!");
		
		if (await _userManager.Users.AnyAsync(u => u.UserName == registerDTO.UserName))
			return BadRequest("Username is taken!");

		var textInfo = new CultureInfo("en-US",false).TextInfo;
		var user = new User 
		{ 
			UserName = registerDTO.UserName,
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
		
		await _notificationService.CreateNotificationAsync(new Notification
		{
			Type = "mail",
			Title = "Welcome to ProFlow!",
			Content = $"Hi {user.FirstName}! We are glad to welcome you in ProFlow!",
			TargetUser = user
		});
		
		return new AuthUserDTO
		{
			UserName = registerDTO.UserName,
			Token = await _tokenService.CreateToken(user),
		};
	}

	[HttpPost("login")]
	public async Task<ActionResult<AuthUserDTO>> Login(LoginDTO loginDTO)
	{
		var user = await _userManager.FindByNameAsync(loginDTO.UserName);

		if (user == null)
			return BadRequest("Invalid username!");

		var result = await _userManager.CheckPasswordAsync(user, loginDTO.Password);

		if (!result)
			return BadRequest("Invalid password!");
		
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
	
	[HttpPost("upload-picture")]
	[Authorize]
	public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile picture) 
	{
		if (picture == null || picture.Length == 0)
			return BadRequest("No file uploaded.");
		
		var user = (await _userManager.FindByNameAsync(User.GetUserName()!))!;
			
		string path = Path.Combine(@"Resources\Images", $"{user.Id!}{Path.GetExtension(picture.FileName)}");
		using var fileStream = new FileStream(path, FileMode.Create);
		await picture.CopyToAsync(fileStream);
		
		user.ProfilePicturePath = path;
		var result = await _userManager.UpdateAsync(user);
		
		if(!result.Succeeded)
			return BadRequest(result.Errors);

		return Ok();
	}
	
	[HttpPatch("update")]
	[Authorize]
	public async Task<ActionResult<AuthUserDTO>> UpdateAccountSettings(AccountSettingsModelDTO settingsModelDTO) 
	{
		var user = (await _userManager.FindByNameAsync(User.GetUserName()!))!;
		
		List<string> changedCreds = [];
		if(settingsModelDTO.UserName != null) 
		{
			if(settingsModelDTO.UserName == user.UserName!)
				return BadRequest("You can't update your username to its current value!");
			if(await _userManager.FindByNameAsync(settingsModelDTO.UserName) != null)
				return BadRequest($"The username '{settingsModelDTO.UserName}' is taken!");
			
			user.UserName = settingsModelDTO.UserName;
			changedCreds.Add("username");
		}
		
		if(settingsModelDTO.Password != null) 
		{
			if(await _userManager.CheckPasswordAsync(user, settingsModelDTO.Password))
				return BadRequest("You can't use your last password as a new one.");
				
			await _userManager.RemovePasswordAsync(user);
			await _userManager.AddPasswordAsync(user, settingsModelDTO.Password);
			changedCreds.Add("password");
		}

		if (changedCreds.Count > 0)
		{
			var result = await _userManager.UpdateAsync(user);
			if(result.Succeeded) 
			{
				await _notificationService.CreateNotificationAsync(new Notification
				{
					Type = "report",
					Title = "Account updated!",
					Content = $"You have successfully changed your creditentals! Changed creditentals: ({string.Join(", ", changedCreds)})",
					TargetUser = user
				});
				
				return new AuthUserDTO
				{
					UserName = user.UserName!,
					Token = await _tokenService.CreateToken(user),
				};
			}
			return BadRequest(result.Errors);;
		}
		return BadRequest("Nothing changed!");
	}
}
