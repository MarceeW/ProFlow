using API.Constants;
using API.DTOs;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class SkillController(
	ISkillRepository _skillRepository, 
	IMapper _mapper,
	ISkillService _skillService)
	: BaseApiController
{
	[HttpGet]
	public async Task<IEnumerable<SkillDTO>> GetSkills() 
	{
		return await _skillRepository
			.Get()
			.ProjectTo<SkillDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}
	
	[HttpPost("create")]
	[Authorize(Roles = RoleConstant.Administrator)]
	public async Task<ActionResult> CreateSkill(SkillDTO skillDTO) 
	{
		await _skillService.CreateSkillAsync(skillDTO);
		return Ok();
	}
}
