using System;
using System.Runtime.CompilerServices;
using API.Models;

namespace API.Interfaces.Repository;

public interface ISkillRepository : IRepository<Skill, Guid>
{
}
