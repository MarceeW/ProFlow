using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class UserSkillRepository : AbstractRepository<UserSkill, Guid>, IUserSkillRepository
{
    public UserSkillRepository(DataContext dataContext) : base(dataContext, dataContext.UserSkills)
    {
    }
}
