using System;
using API.DTOs;
using API.Models;

namespace API.Interfaces.Service;

public interface IStoryService
{
	Task UpdateAsync(StoryDTO storyDTO);
	Task AddCommitAsync(Guid storyId, User loggedInUser, StoryCommitDTO commitDTO);
	Task RemoveCommitAsync(Guid commitId);
	Task UpdateCommitAsync(StoryCommitDTO commitDTO);
	Task Assign(Guid storyId, Guid userId);
}
