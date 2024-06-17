using API.Constants;
using API.DTO;
using API.Exceptions;
using API.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProjectController : BaseApiController
{
    private readonly IProjectService _projectService;

    public ProjectController(IProjectService projectService)
	{
        _projectService = projectService;
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
}
