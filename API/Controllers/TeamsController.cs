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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	[Authorize]
	public class TeamsController : BaseApiController
	{
		private readonly UserManager<User> _userManager;
		private readonly ITeamService _teamService;
		private readonly ITeamRepository _teamRepository;
		private readonly IMapper _mapper;

		public TeamsController(
			UserManager<User> userManager,
			ITeamService teamService, 
			ITeamRepository teamRepository, 
			IMapper mapper)
		{
			_userManager = userManager;
			_teamService = teamService;
			_teamRepository = teamRepository;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<IEnumerable<TeamDTO>> GetTeams() 
		{
			return await _teamRepository
				.Get()
				.ProjectTo<TeamDTO>(_mapper.ConfigurationProvider)
				.ToListAsync();
		}
		
		[HttpGet("my-teams")]
		public async Task<IEnumerable<TeamDTO>> GetMyTeams() 
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			var teams = user.LedTeams
				.AsQueryable()
				.ProjectTo<TeamDTO>(_mapper.ConfigurationProvider);
			return teams;
		}
		
		[HttpGet("{id}")]
		public async Task<ActionResult<TeamDTO>> GetTeam(Guid id) 
		{
			try
			{
				return _mapper.Map<TeamDTO>(await _teamRepository.ReadAsync(id));
			} catch (Exception e) 
			{
				return BadRequest(e.Message);
			}
		}
		
		[HttpPost("create")]
		[Authorize(Roles = RoleConstant.TeamLeader)]
		public async Task<ActionResult> CreateTeam(TeamDTO teamDTO)
		{
			try
			{
				var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
				await _teamService.CreateTeamAsync(teamDTO, loggedInUser);
				return Created();
			}
			catch (Exception e)
			{
				return BadRequest(e.Message);
			}
		}
		
		[HttpDelete("delete/{id}")]
		[Authorize(Roles = RoleConstant.TeamLeader)]
		public async Task<ActionResult> DeleteTeam(Guid id) 
		{
			try
			{
				var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
				await _teamService.DeleteTeamAsync(id, loggedInUser);
				return Ok($"Deleted {id}");
			} catch (Exception e) 
			{
				return BadRequest(e.Message);
			}
		}
		
		[HttpPatch("add-to-team/{teamId}")]
		[Authorize(Roles = RoleConstant.TeamLeader)]
		public async Task<ActionResult> AddToTeam(Guid teamId, IEnumerable<UserDTO> users) 
		{
			var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
			try
			{
				await _teamService.AddToTeamAsync(loggedInUser, teamId, users);
				return Ok();
			} catch (Exception e)
			{
				return BadRequest(e.Message);
			}
		}
		
		[HttpPatch("remove-from-team/{teamId}")]
		[Authorize(Roles = RoleConstant.TeamLeader)]
		public async Task<ActionResult> RemoveFromTeam(Guid teamId, IEnumerable<UserDTO> users) 
		{
			var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
			try
			{
				await _teamService.RemoveFromTeamAsync(loggedInUser, teamId, users);
				return Ok();
			} catch (Exception e)
			{
				return BadRequest(e.Message);
			}
		}
		
		[HttpPatch("rename")]
		[Authorize(Roles = RoleConstant.TeamLeader)]
		public async Task<ActionResult> Rename(TeamDTO teamDTO) 
		{
			var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
			try
			{
				await _teamService.RenameAsync(loggedInUser, teamDTO);
				return Ok();
			} catch (Exception e)
			{
				return BadRequest(e.Message);
			}
		}
		
		[HttpPatch("add-to-project/{teamId}")]
		[Authorize(Roles = RoleConstant.TeamLeader)]
		public async Task<ActionResult> AddToProject(
			Guid teamId, IEnumerable<ProjectDTO> projects) 
		{
			var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
			try
			{
				await _teamService.AddToProjectAsync(loggedInUser, teamId, projects);
				return Ok();
			} catch (Exception e)
			{
				return BadRequest(e.Message);
			}
		}
		
		[HttpPatch("remove-from-project/{teamId}")]
		[Authorize(Roles = RoleConstant.TeamLeader)]
		public async Task<ActionResult> RemoveFromProject(
			Guid teamId, IEnumerable<ProjectDTO> projects) 
		{
			var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
			try
			{
				await _teamService.RemoveFromProjectAsync(loggedInUser, teamId, projects);
				return Ok();
			} catch (Exception e)
			{
				return BadRequest(e.Message);
			}
		}
	}
}
