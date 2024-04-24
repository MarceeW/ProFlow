using API.Constants;
using API.Controllers;
using API.DTO;
using API.Extensions;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API;

public class AdminController : BaseApiController
{
	private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private readonly IAccountRepository _accountRepository;
	private readonly IInvitationRepository _invitationRepository;

	public AdminController(
		UserManager<User> userManager,
		IMapper mapper,
		IAccountRepository accountRepository,
		IInvitationRepository invitationRepository) 
	{
		_userManager = userManager;
        _mapper = mapper;
        _accountRepository = accountRepository;
		_invitationRepository = invitationRepository;
	}
	
	[Authorize(Roles = RoleConstant.Administrator)]
	[HttpGet]
	public async Task<IEnumerable<UserDTO>> GetAccounts()
	{
		return await _accountRepository.GetUsersAsync();
	}
	
	[Authorize(Roles = RoleConstant.Administrator)]
	[HttpGet("{query}")]
	public async Task<IEnumerable<UserDTO>> GetAccountsByQuery(string query)
	{
		return await _accountRepository.GetUsersByQueryAsync(query.ToLower());
	}
	
	[Authorize(Roles = RoleConstant.Administrator)]
	[HttpGet("roles")]
	public async Task<IEnumerable<RoleDTO>> GetRoles()
	{
		return await _accountRepository.GetRolesAsync();
	}
	
	[Authorize(Roles = RoleConstant.Administrator)]
	[HttpGet("generate-invitation-key")]
	public async Task<ActionResult<InvitationDTO>> GenerateInvitationKey(DateTime expirationDate)
	{
		var loggedInUser = await _userManager.GetLoggedInUserAsync(User);
		
		if(loggedInUser == null) 
			return Unauthorized("Logged in user's username claim not found!");
		
		Invitation invitation = new Invitation { Expires = expirationDate };
		
		await _invitationRepository.CreateAsync(invitation);
		await _invitationRepository.SaveAsync();
		
		return new InvitationDTO 
		{
			Key = invitation.Key,
			Expires = invitation.Expires,
			IsActivated = invitation.IsActivated,
		};
	}
	
	[Authorize(Roles = RoleConstant.Administrator)]
	[HttpGet("invitations")]
	public async Task<IEnumerable<InvitationDTO>> GetInvitations()
	{
		return await _invitationRepository.GetDTOsAsync();
	}
	
		
	[Authorize(Roles = RoleConstant.Administrator)]
	[HttpDelete("delete-invitation/{key}")]
	public async Task<ActionResult<Guid>> GetInvitations(Guid key)
	{
		_invitationRepository.Delete(await _invitationRepository.ReadAsync(key));
		await _invitationRepository.SaveAsync();
		return Ok(key);
	}
	
	[Authorize(Roles = RoleConstant.Administrator)]
	[HttpPatch("update")]
	public async Task<ActionResult<UserDTO>> Update(UserManageDTO dto)
	{
		var user = await _userManager.GetUserByUserName(dto.UserName.ToLower());
		
		if (user == null)
			return BadRequest($"No user found with this username: {dto.UserName}!");
		
		if(!dto.NewRoles.IsNullOrEmpty()) 
		{	
			var roleResult = await _userManager.AddToRolesAsync(user, dto.NewRoles!);
			if (!roleResult.Succeeded)
				return BadRequest(roleResult.Errors);
		}
		if(!dto.DeletedRoles.IsNullOrEmpty()) 
		{	
			var roleResult = await _userManager.RemoveFromRolesAsync(user, dto.DeletedRoles!);
			if (!roleResult.Succeeded)
				return BadRequest(roleResult.Errors);
		}
		
		var result = await _userManager.UpdateAsync(user);
		
		if(!result.Succeeded)
			return BadRequest(result.Errors);
			
		return _mapper.Map<UserDTO>(user);
	}
}
