using API.Constants;
using API.Controllers;
using API.DTO;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API;

[Authorize(Roles = RoleConstant.Administrator)]
public class AdminController : BaseApiController
{
	private readonly UserManager<User> _userManager;
	private readonly IMapper _mapper;
	private readonly IAccountRepository _accountRepository;
	private readonly IProjectRepositoy _projectRepositoy;
	private readonly ITeamService _teamService;
	private readonly IInvitationRepository _invitationRepository;

	public AdminController(
		UserManager<User> userManager,
		IMapper mapper,
		IAccountRepository accountRepository,
		IInvitationRepository invitationRepository,
		IProjectRepositoy projectRepositoy,
		ITeamService teamService)
	{
		_userManager = userManager;
		_mapper = mapper;
		_accountRepository = accountRepository;
		_invitationRepository = invitationRepository;
		_projectRepositoy = projectRepositoy;
		_teamService = teamService;
	}

	[HttpGet("accounts/{query?}")]
	public async Task<IEnumerable<AccountDTO>> GetAccountsByQuery(string? query)
	{
		if (query == null)
			return await _accountRepository.GetAccountsAsync();
		return await _accountRepository.GetAccountsByQueryAsync(query.ToLower());
	}
	
	[HttpGet("roles")]
	public async Task<IEnumerable<RoleDTO>> GetRoles()
	{
		return await _accountRepository.GetRolesAsync();
	}
	
	[HttpGet("generate-invitation-key")]
	public async Task<ActionResult<InvitationDTO>> GenerateInvitationKey(DateTime expirationDate)
	{
		var loggedInUser = await _userManager.GetLoggedInUserAsync(User);
		
		if(loggedInUser == null) 
			return Unauthorized("Logged in user's username claim not found!");
		
		Invitation invitation = new() { Expires = expirationDate, CreatedBy = loggedInUser };
		
		await _invitationRepository.CreateAsync(invitation);
		await _invitationRepository.SaveAsync();
		
		return new InvitationDTO 
		{
			Key = invitation.Key,
			Expires = invitation.Expires,
			IsActivated = invitation.IsActivated,
		};
	}
	
	[HttpGet("invitations")]
	public async Task<IEnumerable<InvitationDTO>> GetInvitations()
	{
		return await _invitationRepository.GetDTOsAsync();
	}
	
	[HttpDelete("delete-invitation/{key}")]
	public async Task<ActionResult<Guid>> GetInvitations(Guid key)
	{
		_invitationRepository.Delete(await _invitationRepository.ReadAsync(key));
		await _invitationRepository.SaveAsync();
		return Ok(key);
	}
	
	[HttpPatch("update-account")]
	public async Task<ActionResult<AccountDTO>> Update(UserManageDTO dto)
	{
		var user = await _userManager.FindByNameAsync(dto.UserName.ToLower());
		
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
			
		return _mapper.Map<AccountDTO>(user);
	}
	
	[HttpPatch("delete-account/{id}")]
	public async Task<ActionResult> DeleteAccount(Guid id, UserDTO? deputy) 
	{
		try
		{
			User user = await _userManager.FindByIdAsync(id.ToString())
				?? throw new KeyNotFoundException();
				
			var projects = user.OwnedProjects;
			if(user.OwnedProjects.Count > 0) 
			{
				if(deputy == null)
					return BadRequest("You must give a deputy project manager");
					
				foreach(Project project in user.OwnedProjects) 
				{
					project.ProjectManagerId = deputy.Id;
					_projectRepositoy.Update(project);
				}
				await _projectRepositoy.SaveAsync();
			}

			var loggedInUser = await _userManager.GetLoggedInUserAsync(User);
			var teamIds = user.Teams.Select(team => team.Id).ToList();
			foreach(var teamId in teamIds)
			{
				var userDTO = _mapper.Map<UserDTO>(user);
				await _teamService.RemoveFromTeamAsync(loggedInUser!, teamId, [userDTO]);
			}

			await _userManager.DeleteAsync(user);
			return Ok();
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
}
