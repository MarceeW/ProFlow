using API.DTOs;
using API.Models;

namespace API.Interfaces.Service;

public interface IUserService
{
	Task SetUserSkillAsync(User user, UserSkillDTO userSkillDTO);
}
