using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;

namespace API.Repositories;

public class SkillRepository(DataContext dataContext)
	: AbstractRepository<Skill, Guid>(dataContext, dataContext.Skills), ISkillRepository
{
}
