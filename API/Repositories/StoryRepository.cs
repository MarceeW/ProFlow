using System;
using System.Text.RegularExpressions;
using API.Data;
using API.DTOs;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Repositories;

public class StoryRepository : AbstractRepository<Story, Guid>, IStoryRepository
{
	public StoryRepository(DataContext dataContext) : base(dataContext, dataContext.Stories)
	{
	}
	
	public async Task<IEnumerable<StoryRecommendationDataDTO>> GetRecommendationDataForPrediction(IEnumerable<Guid> storyIds, User user) 
	{
		
		var averageHours = user.AssignedStories.Count > 0 ? user.AssignedStories.Average(s => s.StoryCommits.Sum(sc => sc.Hours)) : 0;
		var successRate = user.AssignedStories.Count(s => s.StoryCommits
							.Sum(sc => sc.Hours) < s.StoryPoints * 8) / (float)user.AssignedStories.Count();
							
		var stories = _values.Where(s => storyIds.Contains(s.Id));
		
		return await stories
			.Select(s => new StoryRecommendationDataDTO
				{
					StoryTitle = s.Title,
					StoryType = s.StoryType,
					StoryPriority = s.StoryPriority,
					UserAverageSpentHours = (float)averageHours,
					UserPreviousSuccessRate = (float)(double.IsNaN(successRate) ? 0 : successRate),
					UserSkills = user.UserSkills.Select(us => us.Skill.Name),
					Skills = s.RequiredSkills.Select(s => s.Name),
					Tags = s.TagList,
					StoryPoints = s.StoryPoints ?? 0,
					Completed = s.StoryStatus == Enums.StoryStatus.Done,
					SpentHours = s.StoryCommits.Sum(sc => sc.Hours)
				})
			.ToListAsync();
	}
	
	public async Task<IEnumerable<StoryRecommendationDataDTO>> GetRecommendationDataForTraining()
	{
		var stories = Get().Where(s => s.AssignedTo != null);
		
		var averageHours = await stories
			.Include(s => s.StoryCommits)
			.Where(s => s.AssignedToId != null)
			.GroupBy(s => s.AssignedToId)
			.ToDictionaryAsync(
				group => (Guid)group.Key!,
				group => group.Average(s => s.StoryCommits.Sum(sc => sc.Hours)));
				
		var successRate = await stories
			.Include(s => s.StoryCommits)
			.Where(s => s.AssignedToId != null)
			.GroupBy(s => s.AssignedToId)
			.ToDictionaryAsync(
				group => (Guid)group.Key!,
				group => group.Count(us => us.StoryCommits
							.Sum(sc => sc.Hours) < us.StoryPoints * 8) / (float)group.Count());
		
		return await stories
			.Select(s => new StoryRecommendationDataDTO
				{
					StoryTitle = s.Title,
					StoryType = s.StoryType,
					StoryPriority = s.StoryPriority,
					UserAverageSpentHours = (float)averageHours[(Guid)s.AssignedToId!],
					UserPreviousSuccessRate = (float)successRate[(Guid)s.AssignedToId!],
					UserSkills = s.AssignedTo!.UserSkills.Select(skill => skill.Skill.Name),
					Skills = s.RequiredSkills.Select(s => s.Name),
					Tags = s.TagList,
					StoryPoints = s.StoryPoints ?? 0,
					Completed = s.StoryStatus == Enums.StoryStatus.Done,
					SpentHours = s.StoryCommits.Sum(sc => sc.Hours)
				})
			.ToListAsync();
	}
}
