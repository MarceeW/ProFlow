using API.Constants;
using API.DTO;
using API.Exceptions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class ProjectController : BaseApiController
{
	private readonly IProjectService _projectService;
	private readonly IProjectRepositoy _projectRepository;
	private readonly IMapper _mapper;

	public ProjectController(
		IProjectService projectService,
		IProjectRepositoy projectRepositoy,
		IMapper mapper)
	{
		_projectService = projectService;
		_projectRepository = projectRepositoy;
		_mapper = mapper;
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
}
