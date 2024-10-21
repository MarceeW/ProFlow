using System;
using API.DTOs;
using API.Models;

namespace API.Interfaces.Service;

public interface IStoryService
{
	Task UpdateAsync(StoryDTO storyDTO, User loggedInUser);
	Task AddCommitAsync(Guid storyId, User loggedInUser, StoryCommitDTO commitDTO);
	Task RemoveCommitAsync(Guid commitId, User loggedInUser);
	Task UpdateCommitAsync(StoryCommitDTO commitDTO, User loggedInUser);
	Task Assign(Guid storyId, Guid userId, User loggedInUser);
	Task Unassign(Guid storyId, Guid userId, User loggedInUser);
}
