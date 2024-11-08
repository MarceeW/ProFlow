using API.DTO;
using API.DTOs;
using API.Enums;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Interfaces.Repository;

public class UserRepository : IUserRepository
{
	private readonly UserManager<User> _userManager;
	private readonly IMapper _mapper;

	public UserRepository(
		UserManager<User> userManager,
		IMapper mapper)
	{
		_userManager = userManager;
		_mapper = mapper;
	}

	public async Task<UserDTO> GetUserByUserNameAsync(string userName)
	{
		return _mapper.Map<UserDTO>(await _userManager.FindByNameAsync(userName));
	}

	public async Task<IEnumerable<UserDTO>> GetUsersAsync(string? roles)
	{
		var rolesArray = roles?.ToLower().Split(',');
		
		return await _userManager
			.Users
			.Where(u => roles == null || rolesArray!.Intersect(u.UserRoles!.Select(ur => ur.Role.Name)).Count() > 0)
			.ProjectTo<UserDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}

	public async Task<UserStatDTO> GetUserStatsAsync(Guid id)
	{
		var user = await _userManager.FindByIdAsync(id.ToString())
			?? throw new KeyNotFoundException("User is not found");
		
		return new() 
		{
			OwnedProjects = user.OwnedProjects.Count,
			LedTeams = user.LedTeams.Count,
			Teams = user.Teams.Count,
			Projects = user.Teams.Sum(t => t.Projects.Count),
			StoriesDone = user.AssignedStories
				.Count(t => t.StoryStatus == StoryStatus.Done),
			Performance = user.GetAverageStoryPointsPerHour()
		};
	}
}
