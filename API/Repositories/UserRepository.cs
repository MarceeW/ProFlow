using System.Net.Quic;
using API.Data;
using API.DTO;
using API.Interfaces;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.IdentityModel.Tokens;

namespace API.Repositories;

public class UserRepository : IUserRepository
{
	private readonly UserManager<User> _userManager;
	private readonly IMapper _mapper;

	public UserRepository(UserManager<User> userManager, IMapper mapper)
	{
		_userManager = userManager;
		_mapper = mapper;
	}

	public async Task<IEnumerable<UserDTO>> GetUsersAsync()
	{		
		return await _userManager
			.Users
			.ProjectTo<UserDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}

	public async Task<IEnumerable<UserDTO>> GetUsersByQueryAsync(string query)
	{
		var filteredList = await _userManager
			.Users
			.Where(u => 
				u.UserName!.ToLower().Contains(query)
			 	|| u.FirstName.ToLower().Contains(query)
				|| u.LastName.ToLower().Contains(query))
			.ProjectTo<UserDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
			
		if (!filteredList.IsNullOrEmpty())
			return filteredList;
		
		var fullDTOList = await _userManager
			.Users
			.ProjectTo<UserDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
			
		return fullDTOList.Where(u => u.Roles.Any(r => r.ToLower().Contains(query)));
	}
}
