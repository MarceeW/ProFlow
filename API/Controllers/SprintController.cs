using API.DTOs;
using API.Exceptions;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class SprintController : BaseApiController
{
	private readonly ISprintRepository _sprintRepository;
	private readonly ISprintService _sprintService;
	private readonly IMapper _mapper;
	private readonly UserManager<User> _userManager;

	public SprintController(
		ISprintRepository sprintRepository,
		IMapper mapper,
		ISprintService sprintService,
		UserManager<User> userManager)
	{
		_sprintRepository = sprintRepository;
		_mapper = mapper;
		_sprintService = sprintService;
		_userManager = userManager;
	}

	[HttpGet("{sprintId}")]
	public async Task<ActionResult<SprintDTO>> GetSprint(Guid sprintId) 
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			var sprint = await _sprintRepository.ReadAsync(sprintId)
				?? throw new KeyNotFoundException($"Sprint with id: '{sprintId}' doesn't exists!");
			
			if(!_sprintService.UserHasAccessToSprint(sprint, user))
				throw new NotAllowedException();
			
			return _mapper.Map<SprintDTO>(sprint);
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpPatch("add-stories/{sprintId}")]
	[Authorize(Policy = "ScrumManagement")]
	public async Task<ActionResult> AddStoriesToBacklog(
		Guid sprintId, 
		IEnumerable<StoryDTO> stories) 
	{
		try
		{
			await _sprintService.AddStoriesToBacklog(sprintId, stories);
		
			string prefix = stories.Count() == 0 ? "Story" : "Stories";
			return Ok($"{prefix} added to sprint backlog successfully");
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpPatch("remove-stories/{sprintId}")]
	[Authorize(Policy = "ScrumManagement")]
	public async Task<ActionResult> RemoveStoriesFromBacklog(
		Guid sprintId, 
		IEnumerable<StoryDTO> stories) 
	{
		try
		{
			await _sprintService.RemoveStoriesFromBacklog(sprintId, stories);
			string prefix = stories.Count() == 0 ? "Story" : "Stories";
			return Ok($"{prefix} removed from sprint backlog successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("close/{sprintId}")]
	[Authorize(Policy = "ScrumManagement")]
	public async Task<ActionResult> CloseSprint(Guid sprintId)
	{
		try
		{
			await _sprintService.Close(sprintId);
			return Ok("Sprint closed successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
}
