using System;
using API.DTOs;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;

namespace API.Services;

public class SkillService(ISkillRepository _skillRepository) : ISkillService
{

	public async Task CreateSkillAsync(SkillDTO skillDTO)
	{
		Skill skill = new Skill
		{
			Name = skillDTO.Name	
		};
		await _skillRepository.CreateAsync(skill);
		await _skillRepository.SaveAsync();
	}
}
