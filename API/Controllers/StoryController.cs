using API.Constants;
using API.DTOs;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class StoryController : BaseApiController
{
	private readonly IStoryRepository _storyRepository;
	private readonly IStoryService _storyService;
	private readonly UserManager<User> _userManager;

	public StoryController(
		IStoryRepository storyRepository,
		UserManager<User> userManager,
		IStoryService storyService)
	{
		_storyRepository = storyRepository;
		_userManager = userManager;
		_storyService = storyService;
	}

	[HttpGet("{id}")]
	public async Task<ActionResult> GetStory(Guid id) 
	{
		try
		{
			var story = await _storyRepository.ReadAsync(id);
			if(story == null)
				return BadRequest($"Story with id: '{id}' doesn't exists!");
			return Ok(story);
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}

	[HttpPatch("update")]
	public async Task<ActionResult> UpdateStory(StoryDTO storyDTO) 
	{
		try
		{
			await _storyService.UpdateAsync(storyDTO);
			return Ok($"Story moved to status: '{storyDTO.StoryStatus}'");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpPatch("add-commit/{storyId}")]
	public async Task<ActionResult> AddCommit(Guid storyId, StoryCommitDTO commitDTO) 
	{
		try
		{
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
			await _storyService.RemoveCommitAsync(commitId);
			return Ok("Commit removed successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
		}
	}
	
	[HttpPatch("update-commit")]
	public async Task<ActionResult> UpdateCommit(StoryCommitDTO commitDTO) 
	{
		try
		{
			await _storyService.UpdateCommitAsync(commitDTO);
			return Ok("Commit updated successfully");
		}
		catch (Exception e)
		{
			return BadRequest(e.Message);
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
		return Ok($"Deleted story: {id}");
	}
}
