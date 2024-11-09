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
	
	[HttpPatch("update-backlog/{sprintId}")]
	[Authorize(Policy = "ScrumManagement")]
	public async Task<ActionResult> AddStoriesToBacklog(
		Guid sprintId, 
		IEnumerable<SprintBacklogUpdateItemDTO> sprintBacklogUpdateItemDTOs) 
	{
		try
		{
			await _sprintService.UpdateBacklog(sprintId, sprintBacklogUpdateItemDTOs);
			return Ok("Backlog updated");
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpPatch("update")]
	[Authorize(Policy = "ScrumManagement")]
	public async Task<ActionResult> UpdateSprint(SprintDTO sprintDTO) 
	{
		try
		{
			await _sprintService.Update(sprintDTO);
			return Ok("Sprint updated");
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
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
	
	#region Reports
	
	[HttpGet("reports/burndown/{sprintId}")]
	public async Task<ActionResult<IEnumerable<ChartDataDTO>>> GetSprintBurndown(Guid sprintId)
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			return Ok(await _sprintRepository.GetBurndownChartDataAsync(sprintId, user));
		}
		catch (NotAllowedException) 
		{
			return Forbid();
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	#endregion
}
