using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using API.Data;
using API.DTOs;
using API.Enums;
using API.Exceptions;
using API.Extensions;
using API.Interfaces.Repository;
using API.Models;

namespace API.Repositories;

public class SprintRepository : AbstractRepository<Sprint, Guid>, ISprintRepository
{
	
	private readonly ITeamRepository _teamRepository;
	public SprintRepository(
		DataContext dataContext, ITeamRepository teamRepository) : base(dataContext, dataContext.Sprints)
	{
		_teamRepository = teamRepository;
	}

	public async Task<IEnumerable<ChartDataDTO>> GetBurndownChartDataAsync(Guid sprintId, User loggedInUser)
	{
		var sprint = await ReadAsync(sprintId) ?? throw new KeyNotFoundException();
		
		var team = (await _teamRepository.ReadAsync(sprint.TeamId))!;
		
		//if(!team.IsUserPartOf(loggedInUser))
		//	throw new NotAllowedException();
			
		int sprintDuration = (sprint.End - sprint.Start).Days;
		
		float sprintWeight = sprint.SprintBacklog.Sum(s => s.StoryPoints ?? 0);
		
		var ideal = new ChartDataDTO
		{
			Name = "Ideal burndown",
			Series = Enumerable
				.Range(0, sprintDuration + 1)
				.Select(i => new ChartDataDTO
				{
					Value = sprintWeight - sprintWeight / sprintDuration * i,
					Name = i
				})
		};
		
		var sprintDays = ((DateTime.Now < sprint.End ? DateTime.Now : sprint.End) - sprint.Start).Days + 1;
		
		var remaining = new ChartDataDTO
		{
			Name = "Remaining effort",
			Series =  Enumerable
				.Range(0, sprintDays + 1)
				.Select(dayIdx => sprint.SprintBacklog
					.Select(s => s.StoryStatusChanges
						.Where(ss => ss.Timestamp > sprint.Start && (ss.Timestamp.Date - sprint.Start.AddDays(dayIdx).Date).TotalDays == 0)
						.Aggregate(0f, (total, actual) => total + (actual.StoryStatus - actual.PreviousStoryStatus) / 
							(float)StoryStatus.Done * (float)actual.Story.StoryPoints!))
						.Sum()).Aggregate(new List<ChartDataDTO> 
						{
							new ChartDataDTO
							{
								Value = sprintWeight,
								Name = 0
							}
						}, (total, curr) => 
						{
							total.Add(new ChartDataDTO
							{
								Value = (float)total.Last().Value! - (float)curr!,
								Name = (int)total.Last().Name + 1
							});
							return total;
						})
		};
		
		return [ideal, remaining];
	}
}
