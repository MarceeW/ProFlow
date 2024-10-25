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

[Authorize]
public class ProjectController(
	IProjectService projectService,
	IProjectRepositoy projectRepositoy,
	IMapper mapper,
	UserManager<User> userManager) : BaseApiController
{
	private readonly IProjectService _projectService = projectService;
	private readonly IProjectRepositoy _projectRepository = projectRepositoy;
	private readonly IMapper _mapper = mapper;
	private readonly UserManager<User> _userManager = userManager;

	[HttpPost("create")]
	[Authorize(Policy = "ProjectManagement")]
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
	[Authorize(Roles = RoleConstant.Administrator)]
	public async Task<IEnumerable<ProjectDTO>> GetProjects() 
	{
		return await _projectRepository
			.Get()
			.ProjectTo<ProjectDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}
	
	[HttpDelete("{id}")]
	[Authorize(Policy = "ProjectManagement")]
	public async Task<ActionResult> DeleteProjectAsync(Guid id) 
	{
		try
		{
			var user = await _userManager.GetLoggedInUserAsync(User);
			await _projectService.DeleteProjectAsync(id, user!);
			return Ok(id);
		} catch (KeyNotFoundException e) 
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpGet("{id}")]
	public async Task<ActionResult<ProjectDTO>> GetProject(Guid id) 
	{
		try
		{
			var user = await _userManager.GetLoggedInUserAsync(User);
			if(!await _projectService.UserHasAccessToProjectAsync(id, user!))
				return Forbid();
			
			user!.LastViewedProjectId = id;
			await _userManager.UpdateAsync(user);
			
			return _mapper.Map<ProjectDTO>(await _projectRepository.ReadAsync(id));
		} catch (KeyNotFoundException e) 
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("teams/{id}")]
	[Authorize(Policy = "ProjectManagement")]
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
	public async Task<IEnumerable<ProjectDTO>> GetMyProjects() 
	{
		var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
		return _projectRepository.GetUserProjects(loggedInUser)
			.AsQueryable()
			.ProjectTo<ProjectDTO>(_mapper.ConfigurationProvider);
	}
	
	[HttpPost("add-sprint/{projectId}")]
	[Authorize(Policy = "ProjectManagement")]
	public async Task<ActionResult> AddSprint(
		Guid projectId, 
		SprintDTO sprintDTO) 
	{
		try
		{
			var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
			await _projectService.AddSprintAsync(projectId, sprintDTO, loggedInUser);
			return Ok("Created sprint successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("nth-sprint/{projectId}")]
	public async Task<ActionResult<SprintDTO>> GetNthSprint(Guid projectId, [FromQuery] int n) 
	{
		try
		{
			var user = await _userManager.GetLoggedInUserAsync(User);
			if(!await _projectService.UserHasAccessToProjectAsync(projectId, user!))
				return Forbid();
				
			return _mapper
				.Map<SprintDTO>(await _projectRepository.GetNthSprintAsync(projectId, n));
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpGet("sprints/{projectId}")]
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
	[Authorize(Policy = "ProjectManagement")]
	public async Task<ActionResult<IEnumerable<StoryDTO>>> GetBacklog(Guid projectId) 
	{
		try
		{
			var project = await _projectRepository.ReadAsync(projectId);
			
			var user = await _userManager.GetLoggedInUserAsync(User);
			if(!_projectService.UserHasAccessToProject(project, user!))
				return Forbid();
			
			if(project == null)
				throw new KeyNotFoundException("Project does not exists");
			return Ok(project.ProductBacklog
				.AsQueryable()
				.ProjectTo<StoryDTO>(_mapper.ConfigurationProvider));
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpPost("add-story/{projectId}")]
	public async Task<ActionResult> AddStoryToBacklogAsync(
		Guid projectId, 
		StoryDTO story) 
	{
		try
		{
			var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
			await _projectService.AddStoryToBacklogAsync(projectId, story, loggedInUser);
			return Ok("Story added to product backlog successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpDelete("remove-story/{storyId}")]
	public async Task<ActionResult> RemoveStoryFromBacklogAsync( 
		Guid storyId) 
	{
		try
		{
			var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
			await _projectService.RemoveStoryFromBacklogAsync(storyId, loggedInUser);
			return Ok("Story removed from product backlog successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
}
