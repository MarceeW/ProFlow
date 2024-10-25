using API.DTOs;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;

namespace API.Services;

public class UserService(
	IUserSkillRepository _userSkillRepository, 
	ISkillRepository _skillRepository) : IUserService
{
	public async Task SetUserSkillAsync(User user, UserSkillDTO userSkillDTO)
	{
		var userSkill = user.UserSkills
			.Where(us => us.SkillId == userSkillDTO.Skill.Id)
			.FirstOrDefault();
			
		if(userSkill == null) 
		{
			var newUserSkill = new UserSkill 
			{
				User = user,
				Skill = await _skillRepository.ReadAsync(userSkillDTO.Skill.Id),
				SkillLevel = userSkillDTO.SkillLevel
			};
			
			await _userSkillRepository.CreateAsync(newUserSkill);
		} 
		else 
		{
			userSkill.SkillLevel = userSkillDTO.SkillLevel;
			if(userSkillDTO.SkillLevel == 0)
				_userSkillRepository.Delete(userSkill);
			else 
				_userSkillRepository.Update(userSkill);
		}
		
		await _userSkillRepository.SaveAsync();
	}
}
