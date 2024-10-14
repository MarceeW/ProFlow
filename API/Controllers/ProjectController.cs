using API.Constants;
using API.DTO;
using API.DTOs;
using API.Exceptions;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class ProjectController : BaseApiController
{
	private readonly IProjectService _projectService;
	private readonly ISprintService _sprintService;
	private readonly IProjectRepositoy _projectRepository;
	private readonly ISprintRepository _sprintRepository;
	private readonly IMapper _mapper;
	private readonly UserManager<User> _userManager;

	public ProjectController(
		IProjectService projectService,
		IProjectRepositoy projectRepositoy,
		IMapper mapper,
		UserManager<User> userManager,
		ISprintRepository sprintRepository,
		ISprintService sprintService)
	{
		_projectService = projectService;
		_projectRepository = projectRepositoy;
		_mapper = mapper;
		_userManager = userManager;
		_sprintRepository = sprintRepository;
		_sprintService = sprintService;
	}

	[HttpPost("create")]
	[Authorize(Roles = RoleConstant.ProjectManager)]
	public async Task<ActionResult> CreateProject(ProjectDTO projectDTO)
	{
		try
		{
			await _projectService.CreateProjectAsync(projectDTO);
			return Created();
		}
		catch (NameAlreadyExistsException e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet]
	[Authorize]
	public async Task<IEnumerable<ProjectDTO>> GetProjects() 
	{
		return await _projectRepository
			.Get()
			.ProjectTo<ProjectDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}
	
	[HttpDelete("{id}")]
	[Authorize(Roles = RoleConstant.ProjectManager)]
	public async Task<ActionResult> DeleteProject(Guid id) 
	{
		try
		{
			await _projectService.DeleteProject(id);
			return Ok(id);
		} catch (KeyNotFoundException e) 
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("{id}")]
	public async Task<ActionResult<ProjectDTO>> GetProject(Guid id) 
	{
		try
		{
			return _mapper.Map<ProjectDTO>(await _projectRepository.ReadAsync(id));
		} catch (KeyNotFoundException e) 
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("teams/{id}")]
	public async Task<ActionResult<IEnumerable<TeamDTO>>> GetProjectTeams(Guid id) 
	{
		try
		{
			var project = (await _projectRepository.ReadAsync(id))!;
			return Ok(
				project.Teams
					.AsQueryable()
					.ProjectTo<TeamDTO>(_mapper.ConfigurationProvider)
				);
		} catch (KeyNotFoundException e) 
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("my-projects")]
	[Authorize]
	public async Task<IEnumerable<ProjectDTO>> GetMyProjects() 
	{
		var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
		return _projectRepository.GetMyProjects(loggedInUser)
			.AsQueryable()
			.ProjectTo<ProjectDTO>(_mapper.ConfigurationProvider);
	}
	
	[HttpPost("add-sprint/{projectId}")]
	// policy based authorization
	public async Task<ActionResult> AddSprint(
		Guid projectId, 
		SprintDTO sprintDTO) 
	{
		try
		{
			await _projectService.AddSprintAsync(projectId, sprintDTO);
			return Ok("Created sprint successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("nth-sprint/{projectId}")]
	// policy based authorization
	public async Task<ActionResult<SprintDTO>> GetNthSprint(Guid projectId, [FromQuery] int n) 
	{
		try
		{
			return _mapper
				.Map<SprintDTO>(await _projectService.GetNthSprint(projectId, n));
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("sprints/{projectId}")]
	// policy based authorization
	public async Task<ActionResult<IEnumerable<SprintDTO>>> GetSprints(Guid projectId) 
	{
		try
		{
			var project = await _projectRepository.ReadAsync(projectId);
			if(project == null)
				throw new KeyNotFoundException("Project does not exists");
			return Ok(project.Sprints.AsQueryable().ProjectTo<SprintDTO>(_mapper.ConfigurationProvider));
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("backlog/{projectId}")]
	// policy based authorization
	public async Task<ActionResult<IEnumerable<StoryDTO>>> GetBacklog(Guid projectId) 
	{
		try
		{
			var project = await _projectRepository.ReadAsync(projectId);
			if(project == null)
				throw new KeyNotFoundException("Project does not exists");
			return Ok(project.ProductBacklog
				.Where(p => p.SprintId == null)
				.AsQueryable()
				.ProjectTo<StoryDTO>(_mapper.ConfigurationProvider));
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpPost("add-story/{projectId}")]
	// TODO: policy based authorization
	public async Task<ActionResult> AddStoryToBacklog(
		Guid projectId, 
		StoryDTO story) 
	{
		try
		{
			await _projectService.AddStoryToBacklog(projectId, story);
			return Ok("Story added to product backlog successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpDelete("remove-story/{storyId}")]
	// TODO: policy based authorization
	public async Task<ActionResult> RemoveStoryFromBacklog( 
		Guid storyId) 
	{
		try
		{
			await _projectService.RemoveStoryFromBacklog(storyId);
			return Ok("Story removed from product backlog successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
}
