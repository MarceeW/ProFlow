using API.DTO;
using API.Extensions;
using API.Interfaces.Repository;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Repositories;

public class AccountRepository : IAccountRepository
{
	private readonly UserManager<User> _userManager;
	private readonly RoleManager<Role> _roleManager;
	private readonly IMapper _mapper;

	public AccountRepository(
		UserManager<User> userManager, 
		RoleManager<Role> roleManager,
		IMapper mapper)
	{
		_userManager = userManager;
		_roleManager = roleManager;
		_mapper = mapper;
	}

	public async Task<IEnumerable<RoleDTO>> GetRolesAsync()
	{
		return await _roleManager
			.Roles
			.ProjectTo<RoleDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}

	public async Task<IEnumerable<AccountDTO>> GetAccountsAsync()
	{		
		return await _userManager
			.Users
			.ProjectTo<AccountDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}

	public async Task<IEnumerable<AccountDTO>> GetAccountsByQueryAsync(string query)
	{
		var filteredList = await _userManager
			.Users
			.Where(u => 
				u.UserName!.ToLower().Contains(query)
			 	|| u.FirstName.ToLower().Contains(query)
				|| u.LastName.ToLower().Contains(query))
			.ProjectTo<AccountDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
			
		if (!filteredList.IsNullOrEmpty())
			return filteredList;
		
		var fullDTOList = await _userManager
			.Users
			.ProjectTo<AccountDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
			
		return fullDTOList.Where(u => u.Roles.Any(r => r.ToLower().Contains(query)));
	}
}
