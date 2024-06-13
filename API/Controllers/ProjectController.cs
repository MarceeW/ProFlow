using API.Constants;
using API.Controllers;
using API.DTO;
using API.Interfaces.Service;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API;

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
