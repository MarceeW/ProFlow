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
			return await _teamRepository
				.Get()
				.Where(t => t.TeamLeader == user)
				.ProjectTo<TeamDTO>(_mapper.ConfigurationProvider)
				.ToListAsync();
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
				var user = (await _userManager.GetLoggedInUserAsync(User))!;
				await _teamService.CreateTeamAsync(teamDTO, user);
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
		
		[HttpPost("add-to-team/{teamId}")]
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
		
		[HttpPost("remove-from-team/{teamId}")]
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
		
		[HttpPost("rename")]
		[Authorize(Roles = RoleConstant.TeamLeader)]
		public async Task<ActionResult> RemoveFromTeam(Guid teamId, TeamDTO teamDTO) 
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
	}
}
