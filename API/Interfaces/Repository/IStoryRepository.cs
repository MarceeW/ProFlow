using System;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Interfaces.Repository;

public interface IStoryRepository : IRepository<Story, Guid>
{
	Task<IEnumerable<StoryRecommendationDataDTO>> GetRecommendationDataForTraining();
	Task<IEnumerable<StoryRecommendationDataDTO>> GetRecommendationDataForPrediction(IEnumerable<Guid> storyIds, User user);
}
