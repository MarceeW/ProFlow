using API.Constants;
using API.Controllers;
using API.DTO;
using API.Interfaces.Repository;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API;

public class ProjectController : BaseApiController
{
	private readonly IProjectRepositoy _projectRepositoy;
	private readonly UserManager<User> _userManager;
	private readonly IMapper _mapper;

	public ProjectController(
		IProjectRepositoy projectRepositoy,
		UserManager<User> userManager,
		IMapper mapper) 
	{
		_projectRepositoy = projectRepositoy;
		_userManager = userManager;
		_mapper = mapper;
	}
	
	[HttpPost("create")]
	[Authorize(Roles = RoleConstant.ProjectManager)]
	public async Task<ActionResult> CreateProject(ProjectDTO projectDTO) 
	{
		if(await _projectRepositoy.IsProjectNameExistsAsync(projectDTO.ProjectName))
			return BadRequest($"Project with the following name: '{projectDTO.ProjectName}' already exists!");
		
		Project project = new Project
		{
			Name = projectDTO.ProjectName,
			ProjectManager = (await _userManager.FindByNameAsync(projectDTO.ProjectManager.UserName))!,
		};
		var teams = projectDTO.Teams.Select(async t => new Team() 
		{
			TeamLeader = (await _userManager.FindByNameAsync(t.TeamLeader.UserName))!,
			Project = project
		});
		project.Teams = await Task.WhenAll(teams);

		await _projectRepositoy.CreateAsync(project);
		await _projectRepositoy.SaveAsync();

		return Created();
	}
}
