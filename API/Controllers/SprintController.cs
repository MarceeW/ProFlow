using API.DTOs;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class SprintController : BaseApiController
{
	private readonly ISprintRepository _sprintRepository;
	private readonly ISprintService _sprintService;
	private readonly IMapper _mapper;

	public SprintController(
		ISprintRepository sprintRepository,
		IMapper mapper,
		ISprintService sprintService)
	{
		_sprintRepository = sprintRepository;
		_mapper = mapper;
		_sprintService = sprintService;
	}
	
	[HttpGet("{sprintId}")]
	public async Task<ActionResult<SprintDTO>> GetSprint(Guid sprintId) 
	{
		try
		{
			var sprint = await _sprintRepository.ReadAsync(sprintId);
			if(sprint == null)
				return BadRequest($"Sprint with id: '{sprintId}' doesn't exists!");
			
			return _mapper.Map<SprintDTO>(sprint);
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpPatch("add-stories/{sprintId}")]
	// TODO: policy based authorization
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
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpPatch("remove-stories/{sprintId}")]
	// TODO: policy based authorization
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
	// TODO: policy based authorization
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
