using System;
using API.Enums;
using API.Models;

namespace API.DTOs;

public class StoryRecommendationDataDTO
{
	public required StoryType StoryType { get; set; }
	public required StoryPriority StoryPriority { get; set; }
	public required string StoryTitle { get; set; }
	public required int StoryPoints { get; set; }
	public required int SpentHours { get; set; }
	public required float UserPreviousSuccessRate { get; set; }
	public required float UserAverageSpentHours { get; set; }
	public required bool Completed { get; set; }
	public required IEnumerable<string> UserSkills { get; set; } = [];
	public required IEnumerable<string> Skills { get; set; } = [];
	public required IEnumerable<string> Tags { get; set; } = [];
}
