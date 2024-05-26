using API.Controllers;
using API.DTO;
using API.Interfaces.Repository;
using Microsoft.AspNetCore.Mvc;

namespace API;

public class UserController : BaseApiController
{
    private readonly IUserRepository _userRepository;

    public UserController(IUserRepository userRepository)
	{
        _userRepository = userRepository;
    }
	
	[HttpGet("{filter?}")]
	public async Task<IEnumerable<UserDTO>> GetUsers(string? filter) 
	{
		return await _userRepository.GetUsersAsync(filter);
	}
}
