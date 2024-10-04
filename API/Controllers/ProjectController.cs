using API.Constants;
using API.DTO;
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
	private readonly IProjectRepositoy _projectRepository;
	private readonly IMapper _mapper;
	private readonly UserManager<User> _userManager;

	public ProjectController(
		IProjectService projectService,
		IProjectRepositoy projectRepositoy,
		IMapper mapper,
		UserManager<User> userManager)
	{
		_projectService = projectService;
		_projectRepository = projectRepositoy;
		_mapper = mapper;
		_userManager = userManager;
	}

	[HttpPost("create")]
	[Authorize(Roles = RoleConstant.ProjectManager)]
	public async Task<ActionResult> CreateProject(ProjectDTO projectDTO)
	{
		try
		{
			await _projectService.CreateProjectAsync(projectDTO);
		}
		catch (NameAlreadyExistsException e)
		{
			return BadRequest(e.Message);
		}
		return Created();
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
			Project project = await _projectRepository.ReadAsync(id);
			_projectRepository.Delete(project);
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
}
