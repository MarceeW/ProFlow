using API.Constants;
using API.Controllers;
using API.DTO;
using API.Interfaces.Repository;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API;

public class ProjectController : BaseApiController
{
	private readonly IProjectRepositoy _projectRepositoy;
	private readonly IMapper _mapper;

	public ProjectController(
		IProjectRepositoy projectRepositoy,
		IMapper mapper) 
	{
		_projectRepositoy = projectRepositoy;
		_mapper = mapper;
	}
	
	[HttpPost("create")]
	[Authorize(Roles = RoleConstant.ProjectManager)]
	public async Task<ActionResult> CreateProject(ProjectDTO projectDTO) 
	{
		 return Ok();
	}
}
