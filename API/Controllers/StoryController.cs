using API.Constants;
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

namespace API.Controllers;

[Authorize]
public class StoryController : BaseApiController
{
	private readonly IStoryRepository _storyRepository;
	private readonly IStoryStatusChangeRepository _StoryStatusChangeRepository;
	private readonly IStoryService _storyService;
	private readonly IProjectService _projectService;
	private readonly UserManager<User> _userManager;
	private readonly IMapper _mapper;

	public StoryController(
		IStoryRepository storyRepository,
		UserManager<User> userManager,
		IStoryService storyService,
		IMapper mapper,
		IProjectService projectService,
		IStoryStatusChangeRepository StoryStatusChangeRepository)
	{
		_storyRepository = storyRepository;
		_userManager = userManager;
		_storyService = storyService;
		_mapper = mapper;
		_projectService = projectService;
		_StoryStatusChangeRepository = StoryStatusChangeRepository;
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<StoryDTO>> GetStory(Guid id) 
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			
			var story = await _storyRepository.ReadAsync(id);
			if(!_projectService.UserHasAccessToProject(story.Project, user))
				throw new NotAllowedException();
			
			if(story == null)
				return BadRequest($"Story with id: '{id}' doesn't exists!");
			return Ok(_mapper.Map<StoryDTO>(story));
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}

	[HttpPatch("update")]
	public async Task<ActionResult> UpdateStory(StoryDTO storyDTO) 
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			await _storyService.UpdateAsync(storyDTO, user);
			return Ok();
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpGet("assign/{id}")]
	public async Task<ActionResult> AssignStory(Guid id, [FromQuery] Guid userId) 
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			await _storyService.Assign(id, userId, user);
			return Ok("Story is successfully assigned");
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpGet("unassign/{id}")]
	public async Task<ActionResult> UnassignStory(Guid id, [FromQuery] Guid userId) 
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			await _storyService.Unassign(id, userId, user);
			return Ok("Story is successfully assigned");
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpGet("commits/{id}")]
	public async Task<ActionResult<IEnumerable<StoryCommitDTO>>> GetCommits(Guid id) 
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			var story = await _storyRepository.ReadAsync(id)
				?? throw new KeyNotFoundException("Invalid story id");
			if(!_projectService.UserHasAccessToProject(story.Project, user))
				throw new NotAllowedException();
			
			return Ok(story.StoryCommits
				.AsQueryable()
				.ProjectTo<StoryCommitDTO>(_mapper.ConfigurationProvider));
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpPatch("add-commit/{storyId}")]
	public async Task<ActionResult> AddCommit(Guid storyId, StoryCommitDTO commitDTO) 
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			var loggedInUser = (await _userManager.GetLoggedInUserAsync(User))!;
			await _storyService.AddCommitAsync(storyId, loggedInUser, commitDTO);
			return Ok("Commit added successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpDelete("remove-commit/{commitId}")]
	public async Task<ActionResult> AddCommit(Guid commitId) 
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			await _storyService.RemoveCommitAsync(commitId, user);
			return Ok("Commit removed successfully");
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpPatch("update-commit")]
	public async Task<ActionResult> UpdateCommit(StoryCommitDTO commitDTO) 
	{
		try
		{
			var user = (await _userManager.GetLoggedInUserAsync(User))!;
			await _storyService.UpdateCommitAsync(commitDTO, user);
			return Ok("Commit updated successfully");
		}
		catch (KeyNotFoundException e)
		{
			return BadRequest(e.Message);
		} catch(NotAllowedException) 
		{
			return Forbid();
		}
	}
	
	[HttpDelete("delete/{id}")]
	[Authorize(Roles = RoleConstant.ProjectManager)]
	public async Task<ActionResult> DeleteStory(Guid id) 
	{
		var story = await _storyRepository.ReadAsync(id);
		
		if(story == null)
			return BadRequest($"Invalid story id: {id}");
			
		_storyRepository.Delete(story);
		await _storyRepository.SaveAsync();
		return Ok($"Story deleted successfully");
	}
}
