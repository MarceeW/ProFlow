using API.DTO;
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

    public async Task<IEnumerable<UserDTO>> GetUsersAsync(string? filter)
	{
		return await _userManager
			.Users
			.Where(u => filter == null || filter != null && 
				(u.FirstName + u.LastName).ToLower()
					.Contains(filter.ToLower()))
			.ProjectTo<UserDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}
}
